const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const submissionRoutes = require('./routes/submissions');
app.use('/api/submissions', submissionRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Submission service is running' });
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Submission service running on port ${PORT}`);
});
