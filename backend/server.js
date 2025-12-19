const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(
  "mongodb+srv://Smart-Grocery-List:password%40123@cluster0.lz6fvat.mongodb.net/Smart-Grocery-List?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Routes
app.use("/users", require("./routes/users"));     // user register/login
app.use("/items", require("./routes/items"));     // CRUD for items
app.use("/predict", require("./routes/predict")); // weekly/monthly suggestions

app.get("/", (req, res) => {
  res.send("PantryPal Backend Running");
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
