const express = require('express'); //web framework built for Node JS.
const mysql = require('mysql2'); // mysql2 is reccommended for faster performance according to some sources online 

const app = express();
const port = 3000; // default port for local development servers

// MySQL connection configuration
const pool = mysql.createPool({
  host: /*'hostaddress'*/, 
  user: /*'userName'*/, 
  password: /*password*/', 
  database: /*database*/, 
});

// Middleware to parse request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files (e.g., HTML, CSS, JavaScript)
app.use(express.static('public')); 

// Get data from the database and render an HTML page
app.get('/products', (req, res) => {
  pool.query('SELECT * FROM products', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Error fetching products');
      return;
    }

    res.render('products.ejs', { products: results }); // Assuming you have a 'products.ejs' template
  });
});

// Update a product in the database based on user input
// DO NOT USE FOR ACTUAL PROJECT!!!
app.post('/update-product/:id', (req, res) => {
  const productId = req.params.id;
  const { name, price } = req.body;

  pool.query(
    'UPDATE products SET name = ?, price = ? WHERE id = ?',
    [name, price, productId],
    (err, result) => {
      if (err) {
        console.error('Error updating product:', err);
        res.status(500).send('Error updating product');
        return;
      }

      res.redirect('/products'); // Redirect to the products page
    }
  );
});

// Create a new product in the database based on user input
app.post('/create-product', (req, res) => {
  const { name, price } = req.body;

  pool.query(
    'INSERT INTO products (name, price) VALUES (?, ?)',
    [name, price],
    (err, result) => {
      if (err) {
        console.error('Error creating product:', err);
        res.status(500).send('Error creating product');
        return;
      }

      res.redirect('/products'); // Redirect to the products page
    }
  );
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
