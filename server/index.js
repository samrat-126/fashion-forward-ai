const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // SECURITY: Password Hashing
const jwt = require('jsonwebtoken'); // SECURITY: Token Generation
require('dotenv').config();

const Outfit = require('./models/Outfit'); 
const User = require('./models/User'); // NEW: Import the User model

const app = express();
app.use(cors({
    origin: true, // This dynamically reflects the requesting domain
    credentials: true
}));
app.use(express.json()); 

const PORT = process.env.PORT || 5000;

// ==========================================
// AUTHENTICATION ROUTES (LOGIN / SIGNUP)
// ==========================================

// 1. REGISTER A NEW USER
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists. Please log in." });
    }

    // Hash the password (scramble it 10 times)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save the new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Server error during registration." });
  }
});

// 2. LOG IN AN EXISTING USER
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Check if the password matches the hashed version in the database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password." });
    }

    // Generate the JWT Token (The digital key)
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ 
      message: "Login successful!", 
      token, // Send the key to React
      user: { id: user._id, email: user.email } 
    });
  } catch (error) {
    res.status(500).json({ error: "Server error during login." });
  }
});

// ==========================================
// PREVIOUS OUTFIT ROUTES
// ==========================================
app.get('/api/outfits', async (req, res) => {
  try {
    const allOutfits = await Outfit.find().sort({ createdAt: -1 });
    res.status(200).json(allOutfits);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch outfits" });
  }
});

app.post('/api/outfits', async (req, res) => {
  try {
    const newOutfit = new Outfit(req.body);
    const savedOutfit = await newOutfit.save();
    res.status(201).json(savedOutfit);
  } catch (error) {
    res.status(500).json({ error: "Failed to save outfit" });
  }
});

// ==========================================
// DATABASE & SERVER INIT
// ==========================================
mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/fashion-forward-ai")
  .then(() => console.log("📦 Successfully connected to MongoDB!"))
  .catch((error) => console.error("❌ MongoDB connection error:", error));

app.listen(PORT, () => {
  console.log(`🚀 Server is running smoothly on port ${PORT}`);
});

const Trend = require('./models/Trend');

// FETCH TREND FORECASTS
// UNIVERSAL AI SOCKET ENDPOINT (Update this route in index.js)
app.post('/api/ai/consult', async (req, res) => {
  try {
    const { prompt, contextType, image } = req.body; // <-- Add 'image' here
    
    if (!prompt && !image) {
      return res.status(400).json({ error: "Prompt or image is required." });
    }

    let finalPrompt = prompt || "Analyze this fashion image.";
    // ... keep your existing contextType logic here if you want ...

    // Pass the image to the service
    const aiResponse = await askFashionAI(finalPrompt, image);

    res.status(200).json({ result: aiResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "AI processing failed." });
  }
});