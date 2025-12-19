const mongoose = require("mongoose");
const Item = require("./models/Item");
const User = require("./models/User");

// Connect to your MongoDB
mongoose.connect(
  "mongodb+srv://Smart-Grocery-List:password%40123@cluster0.lz6fvat.mongodb.net/Smart-Grocery-List?retryWrites=true&w=majority"
)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(err));

// Sample users
const users = [
  { username: "Ramesh", email: "ramesh@example.com", password: "123456" },
  { username: "Sita", email: "sita@example.com", password: "123456" },
  { username: "Amit", email: "amit@example.com", password: "123456" }
];

// Sample items
const items = [
  "Rice", "Wheat Flour", "Sugar", "Salt", "Turmeric Powder", "Red Chili Powder",
  "Ghee", "Milk", "Curd", "Paneer", "Cooking Oil", "Tea Leaves", "Coffee",
  "Onions", "Tomatoes", "Potatoes", "Garlic", "Ginger", "Green Chilies",
  "Coriander Leaves", "Apples", "Bananas", "Mangoes", "Chicken", "Fish",
  "Eggs", "Bread", "Biscuits", "Noodles", "Pasta", "Soy Sauce", "Tomato Ketchup",
  "Pickles", "Coconut Oil", "Mustard Seeds", "Cumin Seeds", "Asafoetida"
];

// Function to get random date within last month
function randomDate() {
  const now = new Date();
  const past = new Date();
  past.setDate(now.getDate() - 30);
  return new Date(past.getTime() + Math.random() * (now.getTime() - past.getTime()));
}

// Seed function
async function seedDB() {
  try {
    await User.deleteMany({});
    await Item.deleteMany({});

    const createdUsers = await User.insertMany(users);

    for (let user of createdUsers) {
      const userItems = [];
      // Each user gets 50-70 random purchases
      const purchaseCount = Math.floor(Math.random() * 20) + 50;
      for (let i = 0; i < purchaseCount; i++) {
        const itemName = items[Math.floor(Math.random() * items.length)];
        const categories = {
          "Produce": ["Onions", "Tomatoes", "Potatoes", "Garlic", "Ginger", "Green Chilies", "Coriander Leaves", "Apples", "Bananas", "Mangoes"],
          "Dairy": ["Milk", "Curd", "Paneer", "Ghee", "Eggs"],
          "Meat": ["Chicken", "Fish"],
          "Bakery": ["Bread"],
          "Other": ["Rice", "Wheat Flour", "Sugar", "Salt", "Turmeric Powder", "Red Chili Powder", "Cooking Oil", "Tea Leaves", "Coffee", "Biscuits", "Noodles", "Pasta", "Soy Sauce", "Tomato Ketchup", "Pickles", "Coconut Oil", "Mustard Seeds", "Cumin Seeds", "Asafoetida"]
        };
        const category = Object.keys(categories).find(cat => categories[cat].includes(itemName)) || "Other";

        userItems.push({
          name: itemName,
          category,
          checked: Math.random() < 0.5,
          quantity: Math.floor(Math.random() * 3) + 1,
          dateBought: randomDate(),
          userId: user._id
        });
      }
      await Item.insertMany(userItems);
    }

    console.log("Database seeded successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
}

seedDB();
