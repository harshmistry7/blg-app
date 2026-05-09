const express = require('express');
const multer = require('multer');
const cors = require("cors")
const authRoutes = require("./routes/auth.routes")
const postRoutes = require("./routes/post.routes")


const app = express();
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173' || 'http://localhost:5173'   ;
// After (correct)
app.use(cors({
  origin: [
    "https://blogs-six-rouge.vercel.app",
    "http://localhost:5173"  // keep for local dev
  ],
  credentials: true  // include if you use cookies/sessions
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);



module.exports = app;
