import { PrismaClient, Contact } from '@prisma/client';
import express from "express"
const app = express();
const prisma = new PrismaClient();
app.use(express.json());

app.post("/identify",  async (req,res)=>{
    
    const {email, phoneNumber} = req.body
    
    try{
        const user = await prisma.contact.findMany({
            where: {
              OR: [
                { email: email },
                { phoneNumber: phoneNumber }
              ]
            },
            orderBy: { createdAt: 'asc' } //earlier comes first
        }); // user will be the object which will contains all the contacts whose either phoneNumber or email are same
        if(user.length === 0) {
            const newContact = await prisma.contact.create({
            data : {
                email, phoneNumber, linkPrecedence: 'primary',
            }
        });
        res.status(200).json({
            contact: {
                primaryContactId: newContact.id,
                emails: [newContact.email].filter(Boolean),
                phoneNumbers: [newContact.phoneNumber].filter(Boolean),
                secondaryContactIds: []
            }
            });
        return;
        }
          
        let primaryContact = user[0]; // it will give the earlieast contact
          
        while (primaryContact.linkPrecedence === 'secondary' && primaryContact.linkedId) {
          const next: Contact | null = await prisma.contact.findUnique({
            where: { id: primaryContact.linkedId! }
          });
          if (!next) break;
          primaryContact = next;
        } // If it get matched with any secondary contact, this backtrack code will link it to the primary one

        const allPrimaryContacts = user.filter(c => c.linkPrecedence === 'primary');
        for (const other of allPrimaryContacts) {
          if (other.id !== primaryContact.id) {
            await prisma.contact.update({
              where: { id: other.id },
              data: {
                linkPrecedence: 'secondary',
                linkedId: primaryContact.id
              }
            });
          }
        }//updating if primary is getting converted to secondary

        const alreadyExists = user.some(c => (email && c.email === email) && (phoneNumber && c.phoneNumber === phoneNumber));
    
        if (!alreadyExists) {
        // Step 5: Create a new secondary contact
            await prisma.contact.create({
                data: {
                email,
                phoneNumber,
                linkPrecedence: 'secondary',
                linkedId: primaryContact.id
                }
            });
        }//if email and phoneNumber arrived exactly same as the existing it would not create another data 

        const relatedContacts = await prisma.contact.findMany({
            where: {
              OR: [
                { id: primaryContact.id },
                { linkedId: primaryContact.id }
              ]
            },
            orderBy: { createdAt: 'asc' }
        });//all the related contacts are getting cummulated {obvious condition}
        
        //creating array of all the required things
        const emails = [...new Set(relatedContacts.map(c => c.email).filter(Boolean))];
        const phoneNumbers = [...new Set(relatedContacts.map(c => c.phoneNumber).filter(Boolean))];
        const secondaryContactIds = relatedContacts
          .filter(c => c.linkPrecedence === 'secondary')
          .map(c => c.id);
    
        res.status(200).json({
          contact: {
            primaryContactId: primaryContact.id,
            emails,
            phoneNumbers,
            secondaryContactIds
          }
        });//output in the required format
        return;
    } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create or fetch contact" });
    return;
    }
});

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


