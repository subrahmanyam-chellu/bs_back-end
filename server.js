const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

app.use(express.json());
dotenv.config({ quiet: true });

app.use(cors({
  origin: process.env.FRONTEND_URL
}));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);


const PORT = 5000;
app.listen(process.env.PORT||5000, () => { console.log("Server Started......") });
mongoose.connect(process.env.DB_URI)
    .then(() => console.log("database connected"))
    .catch((err) => { console.log(err) });