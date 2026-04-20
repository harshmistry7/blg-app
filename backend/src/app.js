const express = require('express');
const multer = require('multer');
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const postRoutes = require("./routes/post.routes")


const app = express();
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173' || 'http://localhost:5173'   ;
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);



module.exports = app;
