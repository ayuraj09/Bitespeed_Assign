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
            orderBy: { createdAt: 'asc' }
        });
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


