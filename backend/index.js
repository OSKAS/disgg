const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost/t-gather-clone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
