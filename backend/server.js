// backend/server.js
const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to Atlas
connectDB().then(() => {
  app.listen(3000, () => {
    console.log("🚀 Server running on http://localhost:3000");
  });
});

// API Endpoints (same as before)
app.get('/skills', async (req, res) => {
  try {
    const db = getDB();
    const skills = await db.collection('skills').find().toArray();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/get-jobs', async (req, res) => {
  try {
    const db = getDB();
    const selectedSkills = req.body.skills.map(skill => skill.trim().toLowerCase());

    const jobs = await db.collection('jobs').aggregate([
      {
        $match: {
          "requiredSkills": {
            $in: selectedSkills
          }
        }
      },
      {
        $addFields: {
          matchPercentage: {
            $multiply: [
              {
                $divide: [
                  { $size: { $setIntersection: ["$requiredSkills", selectedSkills] } },
                  { $size: "$requiredSkills" }
                ]
              },
              100
            ]
          }
        }
      },
      { $sort: { matchPercentage: -1 } }
    ]).toArray();

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});