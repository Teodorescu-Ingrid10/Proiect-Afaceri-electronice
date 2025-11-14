const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const wishRoutes = require('./routes/wish.routes');

const app = express();
dotenv.config();

const PORT = process.env.PORT || 5173;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.get('/', (req, res) => {
    res.status(200).json({message: 'Hello'});
})
app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishRoutes);

app.listen(PORT, () => {
    console.log(`Server successfully started on port ${PORT}`);
})