const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load data
const strainsData = require('./strains.json');

// API Endpoint
app.get('/api/strains', (req, res) => {
  try {
    const { type, search } = req.query;
    let filtered = strainsData.strains;

    if (type) {
      filtered = filtered.filter(strain => 
        strain.type.toLowerCase() === type.toLowerCase()
      );
    }

    if (search) {
      filtered = filtered.filter(strain =>
        strain.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(filtered);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});