<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=140&section=header&text=Aromea%20Cafe&fontSize=48&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=A%20full-stack%20cafe%20ordering%20%26%20reservation%20website&descAlignY=58" width="100%" alt="Aromea Cafe">

<br>

![Node.js](https://img.shields.io/badge/Node.js-5a8f7b?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-2f3e46?style=for-the-badge&logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-4a6fa5?style=for-the-badge&logo=sqlite&logoColor=white)
![Razorpay](https://img.shields.io/badge/Razorpay-d98c63?style=for-the-badge&logo=razorpay&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-c9a227?style=for-the-badge&logo=javascript&logoColor=white)

</div>

## About

**Aromea** is a full-stack cafe website where customers can browse the menu, filter dishes, place orders with online or cash payment, and book a table time slot. It also includes an admin dashboard for managing orders and reservations.

## Features

**For customers**
- Browse the full menu by category: beverages, dishes, desserts and more
- Clear **Veg / Non-Veg** labels on every item
- **High-protein dishes** are highlighted, with the protein content shown
- Search and filter the whole catalogue
- Cart and checkout with **Razorpay (online)** or **Cash on Delivery**
- **Table reservation** with time-slot booking
- Register and log in (JWT authentication)
- Rate the cafe with a star-rating feedback form, and a contact form

**For admins**
- Admin dashboard to view and manage orders and reservations
- Role-based access, so only admin accounts can open the dashboard

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express |
| Database | SQLite |
| Auth | JWT (JSON Web Tokens) |
| Payments | Razorpay |

## Screenshots

> Add your screenshots here. Save them in a `screenshots/` folder and link them like this:

```md
![Home page](screenshots/home.png)
![Menu](screenshots/menu.png)
![Admin dashboard](screenshots/admin.png)
```

## Quick start

### 1. Backend

```bash
cd backend
npm install
node fixdb.js     # sets up the database with the menu items
node server.js    # starts the API on http://localhost:5000
```

### 2. Environment variables

Create a `.env` file inside `backend/` (it is git-ignored and never uploaded):

```env
JWT_SECRET=your_secret_here
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

Get Razorpay test keys from the Razorpay dashboard in test mode.

### 3. Frontend

Open `frontend_design/index.html` with the VS Code **Live Server** extension (port 5500).

### 4. Create an admin account

Register a normal account on the site, then run:

```bash
node makeAdmin.js youremail@example.com
```

## Razorpay test mode

Use these public test details only in test mode:

| Method | Details |
|---|---|
| UPI | `success@razorpay` |
| Card | `5104 0155 5555 5558` · any future expiry · CVV `123` · OTP `1234` |

## Project structure

```
Aromea_ca/
├── backend/
│   ├── routes/        # auth, menu, orders, reservations, feedback, contact, payment
│   ├── middleware/    # auth.js (JWT verify), admin.js (role check)
│   ├── server.js      # Express app entry point
│   ├── db.js          # SQLite connection
│   ├── schema.sql     # Database schema
│   ├── setup.js       # Full DB reset + seed
│   ├── fixdb.js       # Quick DB fix without full reset
│   └── makeAdmin.js   # Promote a user to admin
│
└── frontend_design/
    ├── index.html         # Home: specials, best sellers
    ├── menu.html          # Full menu by category
    ├── catalogue.html     # Search and filter all items
    ├── cart.html          # Cart, COD and Razorpay checkout
    ├── login.html         # Register / login
    ├── reservation.html   # Table booking
    ├── feedback.html      # Star rating form
    ├── contact.html       # Contact form
    ├── admin.html         # Admin dashboard
    ├── js/                # main.js, menuData.js, data.js, admin.js
    └── images/            # Food photos
```

## What I learned

- Building a REST API with Express and connecting it to SQLite
- JWT authentication and role-based access control
- Integrating a real payment gateway (Razorpay)
- Connecting a vanilla JavaScript frontend to a backend API

## Future improvements

- Deploy the app online
- Email or SMS confirmation for orders and reservations
- Order tracking for customers

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=12,20,24&height=80&section=footer" width="100%" alt="">

</div>
