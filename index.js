require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const jwtCheck = require('./middleware/auth');

// Models
const User = require('./models/User');
const AuditLog = require('./models/AuditLog');

// Routes
const noteRoutes = require('./routes/noteRoutes');
const userRoutes = require('./routes/userRoutes')
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error(" MongoDB connection error:", err));

// --- Audit logging middleware ---
app.use(async (req, res, next) => {
  res.on('finish', async () => {
    try {
      const userAuth0Id = req.auth?.payload?.sub;
      let userDoc = null;

      if (userAuth0Id) {
        // Sync user info if not in DB
        userDoc = await User.findOne({ auth0Id: userAuth0Id });
        if (!userDoc && req.auth?.payload?.email) {
          userDoc = await User.create({
            auth0Id: userAuth0Id,
            email: req.auth.payload.email,
            name: req.auth.payload.name || "",
          });
        }
      }

      await AuditLog.create({
        user: userDoc?._id,
        action: `${req.method} ${req.originalUrl}`,
        note: null, // fill in controllers when needed
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        metadata: { statusCode: res.statusCode }
      });
    } catch (err) {
      console.error("Audit log error:", err.message);
    }
  });

  next();
});

// Routes
app.use('/api', noteRoutes);
app.use('/api/users' , userRoutes)

// Health check
app.get('/', (req, res) => {
  res.send("ShareNote API is running ");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
