const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Init Middleware
app.use(cors());
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('Aromea Cafe API Running'));

// Define Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reservations', require('./routes/reservations'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/feedback', require('./routes/feedback'));
app.use('/api/payment', require('./routes/payment'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
