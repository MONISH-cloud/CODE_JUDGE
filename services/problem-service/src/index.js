const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const problemRoutes = require('./routes/problems');
const adminRoutes = require('./routes/admin');

app.use('/api/problems', problemRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Problem service is running' });
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Problem service running on port ${PORT}`);
});
