const express = require("express");
const site = require("./server");

// Entrada reconhecida pela Vercel; a lógica continua em server/index.js.
const app = express();
app.disable("x-powered-by");
app.use(site);

module.exports = app;
