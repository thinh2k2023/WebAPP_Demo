const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Load sidebar data from JSON file
const loadSidebarData = () => {
    const data = fs.readFileSync("sidebar_data.json", "utf8");
    return JSON.parse(data);
};

// Route to render the index page with sidebar data
app.get("/", (req, res) => {
    const sidebarData = loadSidebarData();
    res.render("index", { sidebarData });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
