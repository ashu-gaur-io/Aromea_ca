# Aromea Café — Full Stack Web Application

## Quick Start

### 1. Backend
```bash
cd backend
npm install
node fixdb.js      # sets up database with correct 13 items
node server.js     # starts API on http://localhost:5000
```

### 2. Frontend
Open `frontend_design/index.html` with VS Code Live Server (port 5500)

## Project Structure
```
Aromea_cafe/
├── backend/
│   ├── routes/         # auth, menu, orders, reservations, feedback, contact, payment
│   ├── middleware/      # auth.js (JWT verify), admin.js (role check)
│   ├── server.js        # Express app entry point
│   ├── db.js            # SQLite connection
│   ├── schema.sql       # Database schema
│   ├── setup.js         # Full DB reset + seed (13 items)
│   ├── fixdb.js         # Quick DB fix without full reset
│   ├── makeAdmin.js     # node makeAdmin.js email@example.com
│   ├── .env             # JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
│   └── aromea.db        # SQLite database (created by setup.js)
│
└── frontend_design/
    ├── index.html       # Home — Today's Specials, Best Sellers, SDG
    ├── menu.html        # Full menu by category
    ├── catalogue.html   # Search/filter all items
    ├── cart.html        # Cart + COD + Razorpay checkout
    ├── login.html       # Register / Login with welcome overlay
    ├── reservation.html # Table booking
    ├── feedback.html    # Star rating form
    ├── contact.html     # Contact form
    ├── admin.html       # Admin dashboard
    ├── js/
    │   ├── menuData.js  # Static menu data + image map + API fetch
    │   ├── main.js      # Shared utils: cart, toast, auth helpers
    │   ├── data.js      # Fallback data
    │   └── admin.js     # Admin dashboard logic
    └── images/          # All food photos

## Razorpay Test
UPI ID: success@razorpay
Card:   5104 0155 5555 5558  |  Expiry: 12/26  |  CVV: 123  |  OTP: 1234

## Make Admin
node makeAdmin.js youremail@example.com
