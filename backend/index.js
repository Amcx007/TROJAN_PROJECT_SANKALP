require('dotenv').config();
const express = require('express');
const authRouter = require('./routes/auth');

const app = express();
app.use(express.json());

app.use('/auth', authRouter);

app.get('/', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
