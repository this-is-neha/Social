const express = require('express');
const cors = require('cors');
const Joi = require("joi");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require('path'); 
require("./db.config");
const mainRoute = require("./routing.config");

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://instamediaa.netlify.app/'], // Replace with your frontend URLs
    allowedHeaders: 'Content-Type, Authorization', 
}));

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
  res.json({
    message: "Complaint Register backend is live 🚀",
  });
});
app.use('/uploads', express.static('uploads',{
    setHeaders: (res, path) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// ✅ Your routes come AFTER static files
app.use(mainRoute);

app.get('/', (req, res) => {
    res.send('Hello, world!');
});

console.log("Express server is running");
module.exports = app;
