import mongoose from "mongoose";

const testResultSchema = new mongoose.Schema({
  candidat: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  test: { type: mongoose.Schema.Types.ObjectId, ref: "Test", required: true },
  reponses: [{ type: String, required: true }],
  score: { type: Number, default: 0 },
  status: { type: String, enum: ["en_cours","reussi", "echoue"], default: "echoue" },
  date: { type: Date, default: Date.now },
});

const TestResult = mongoose.model("TestResult", testResultSchema);
export default TestResult;
