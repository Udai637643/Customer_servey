const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const path = require("path");

const app = express();
const PORT = 3000;

// Connect to MongoDB
// mongoose.connect("mongodb://localhost:27017/customer_survey")
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/customer_survey');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
//Create a MongoDB schema and model for survey responses
const surveyResponseSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },
  answers: [
    {
      questionId: { type: Number, required: true },
      answer: { type: mongoose.Schema.Types.Mixed, required: true },
    },
  ],
  status: { type: String, enum: ["IN_PROGRESS", "COMPLETED"], default: "IN_PROGRESS" },
  createdAt: { type: Date, default: Date.now },
});

const SurveyResponse = mongoose.model("SurveyResponse", surveyResponseSchema);

// // Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
// API to save survey response
app.post("/api/survey", async (req, res) => {
  try {
    const { sessionId, answers, status } = req.body;
    const surveyResponse = new SurveyResponse({ sessionId, answers, status });
    await surveyResponse.save();
    res.status(201).json({ message: "Survey response saved successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save survey response." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
