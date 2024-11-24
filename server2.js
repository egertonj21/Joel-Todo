const express = require("express");
const path = require("path");

const app = express();
const port = 8080;

// Serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

app.listen(port, () => {
    console.log(`Web app running at http://localhost:${port}`);
});
