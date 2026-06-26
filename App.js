// router.js
const express = require("express");
const app = express();
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutesSupabase");
const adminRoutes = require("./routes/adminRoutesSupabase");
const supabase = require("./config/supabase");
const {updateStatus} = require("./utils/updateStatusSupabase");


const port = process.env.PORT || 3000;

// Middleware
app.use(session({
  secret: process.env.SESSION_SECRET || "fallback-secret-key",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }, // set to true if using https
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

async function startServer() {
  try {
    await updateStatus();
    console.log('Status updated successfully');

    // Routes
    app.use('/', userRoutes);
    app.use('/admin', adminRoutes);

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error updating status:', error);
    process.exit(1);
  }
}

startServer();
