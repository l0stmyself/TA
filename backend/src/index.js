const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const tripRoutes = require('./routes/trips');
const storeRoutes = require('./routes/stores');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
