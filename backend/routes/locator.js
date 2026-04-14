const express = require('express');
const router = express.Router();

let listings = [
  { id:'L001', farmerName:'Ramesh Patil',  location:'Nashik, Maharashtra', cropType:'rice',      wasteType:'Rice Straw',     quantity:15, unit:'tons', pricePerTon:1200, contact:'+91-9876543210', status:'available', postedDate:'2026-03-15', description:'Dry rice straw, low ash. Good for biogas/biochar.' },
  { id:'L002', farmerName:'Suresh Jadhav', location:'Pune, Maharashtra',   cropType:'wheat',     wasteType:'Wheat Stubble',  quantity:8,  unit:'tons', pricePerTon:900,  contact:'+91-9123456789', status:'available', postedDate:'2026-03-18', description:'Post-harvest wheat straw. Can deliver within 50km.' },
  { id:'L003', farmerName:'Anita Shinde',  location:'Solapur, Maharashtra',cropType:'sugarcane', wasteType:'Bagasse',        quantity:30, unit:'tons', pricePerTon:600,  contact:'+91-9988776655', status:'available', postedDate:'2026-03-20', description:'High calorific bagasse. Bulk available.' },
  { id:'L004', farmerName:'Vijay Kulkarni',location:'Kolhapur, Maharashtra',cropType:'maize',    wasteType:'Maize Stalks',   quantity:12, unit:'tons', pricePerTon:1100, contact:'+91-9765432100', status:'available', postedDate:'2026-03-22', description:'Dried corn stalks for biomass energy.' },
];

const buyers = [
  { id:'B001', name:'Maharashtra Biogas Authority', type:'Biogas Plant',    location:'Pune',     acceptedWaste:['rice','wheat','maize'],       capacity:'50T/day',  phone:'+91-2012345678', rating:4.5 },
  { id:'B002', name:'GreenChar Industries',         type:'Biochar Mfr',    location:'Nashik',   acceptedWaste:['rice','wheat','cotton'],       capacity:'20T/day',  phone:'+91-2534567890', rating:4.8 },
  { id:'B003', name:'SugarEnergy Co-op',            type:'Biomass Power',  location:'Solapur',  acceptedWaste:['sugarcane','cotton'],          capacity:'100T/day', phone:'+91-2174563210', rating:4.2 },
  { id:'B004', name:'AgroCompost Ltd.',             type:'Compost',        location:'Kolhapur', acceptedWaste:['rice','wheat','maize','soybean'],capacity:'30T/day', phone:'+91-2312345670', rating:4.0 },
];

router.get('/listings', (req, res) => {
  const { cropType, status } = req.query;
  let filtered = [...listings];
  if (cropType) filtered = filtered.filter(l => l.cropType === cropType);
  if (status)   filtered = filtered.filter(l => l.status   === status);
  res.json({ success: true, count: filtered.length, listings: filtered });
});

router.post('/listings', (req, res) => {
  const { farmerName, cropType, quantity } = req.body;
  if (!farmerName || !cropType || !quantity) {
    return res.status(400).json({ error: 'farmerName, cropType, quantity required' });
  }
  const newListing = {
    ...req.body,
    id: `L${Date.now()}`,
    status: 'available',
    postedDate: new Date().toISOString().split('T')[0]
  };
  listings.push(newListing);
  res.status(201).json({ success: true, listing: newListing });
});

router.delete('/listings/:id', (req, res) => {
  const before = listings.length;
  listings = listings.filter(l => l.id !== req.params.id);
  if (listings.length === before) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, message: 'Listing removed' });
});

router.get('/buyers', (req, res) => {
  const { wasteType } = req.query;
  let filtered = [...buyers];
  if (wasteType) filtered = filtered.filter(b => b.acceptedWaste.includes(wasteType));
  res.json({ success: true, buyers: filtered });
});

router.post('/contact/:buyerId', (req, res) => {
  const buyer = buyers.find(b => b.id === req.params.buyerId);
  if (!buyer) return res.status(404).json({ error: 'Buyer not found' });
  res.json({
    success: true,
    message: `Contact request sent to ${buyer.name}. They will reach out within 24 hours.`,
    buyer: { name: buyer.name, phone: buyer.phone }
  });
});

module.exports = router;