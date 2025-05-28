# Bitespeed Identity Resolution API

## 🔗 [Bitespeed Backend Task – Identity Reconciliation](https://bitespeed.notion.site/Bitespeed-Backend-Task-Identity-Reconciliation-53392ab01fe149fab989422300423199)


This project is a backend service for **contact identity resolution**, built as part of a hiring assignment for **Bitespeed**.

It provides a REST API endpoint to consolidate customer contact data based on overlapping email or phone number using a relational schema.

---

## 🛠️ Tech Stack

- **TypeScript**
- **Node.js**
- **Express**
- **PostgreSQL**
- **Prisma ORM**

---

## 🚀 Live Endpoint

The API is deployed at:  
➡️ [https://bitespeed-assign-44cc.onrender.com/identify](https://bitespeed-assign-44cc.onrender.com/identify)

---

## API Endpoint

### `POST /identify`

This endpoint accepts a request body with an optional email and/or phone number. It checks existing contact records, links them appropriately, and returns the consolidated contact information.

#### Request Body
Either "email" or "phoneNumber" is required, both are optional but at least one must be present.

```json
{
  "email": "george@hillvalley.edu",
  "phoneNumber": "717171"
}

