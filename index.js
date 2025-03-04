const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/productsDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log(' MongoDB Connected'))
  .catch(error => console.error(' MongoDB Connection Error:', error));

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
});
const Product = mongoose.model('Product', productSchema);

app.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ message: 'All products', products });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

app.post('/products', async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const newProduct = new Product({ name, description, price });
    await newProduct.save();
    res.status(201).json({ message: 'Product created', product: newProduct });
  } catch (error) {
    res.status(400).json({ message: 'Error creating product', error });
  }
});

app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product found', product });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product', error });
  }
});

app.put('/products/:id', async (req, res) => {
  const { name, description, price } = req.body;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price },
      { new: true, runValidators: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product updated', product: updatedProduct });
  } catch (error) {
    res.status(400).json({ message: 'Error updating product', error });
  }
});

app.delete('/products/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted', product: deletedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
