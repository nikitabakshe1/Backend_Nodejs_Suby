const express = require('express');
const dotEnv = require('dotenv');
const mongoose = require('mongoose');
const vendorRoutes = require('./routes/vendorRoutes');
const bodyParser = require('body-parser');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

dotEnv.config();

app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);

app.get('/', (req, res) => {
    res.send("<h1>Welcome to SUBY</h1>");
});

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
        console.log(`Server started and running at ${PORT}`);
    });
})
.catch((error) => {
    console.log("MongoDB connection failed:", error);
});

console.log("MONGO_URI:", process.env.MONGO_URI);