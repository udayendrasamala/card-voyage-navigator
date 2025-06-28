// models/Card.ts
import mongoose from "mongoose";

const statusEventSchema = new mongoose.Schema({
  id: String,
  status: String,
  timestamp: String,
  location: String,
  notes: String,
  failureReason: String,
  agentId: String,
  statusType: { type: String, default: "info" }
});

const cardSchema = new mongoose.Schema({
  _id: String, // This is cardId
  cardNumber: String,
  panLastFour: String,
  customerName: String,
  mobileNumber: String,
  cardType: String,
  currentStatus: String,
  statusHistory: [statusEventSchema]
});

export const Cardm = mongoose.model("Cardm", cardSchema);
