const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const calculatorRoutes  = require('./routes/calculator');
const marketplaceRoutes = require('./routes/marketplace');
const locatorRoutes     = require('./routes/locator');

app.use('/api/calculator',  calculatorRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/locator',     locatorRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AgriWaste Nexus API' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});