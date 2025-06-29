// models/Card.ts
import mongoose from "mongoose";
import { CardStatus, StatusType } from "./types";

const addressSchema = new mongoose.Schema({
  line1: { type: String, required: true },
  line2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true, default: "India" }
});

const statusEventSchema = new mongoose.Schema({
  id: { type: String, required: true },
  status: { 
    type: String, 
    required: true,
    enum: [
      "approved", "created", "embossing_queued", "embossing_complete", 
      "quality_check_passed", "quality_check_failed", "dispatch_queued", 
      "dispatched", "in_transit", "delivered", "delivery_failed", "destroyed"
    ]
  },
  timestamp: { type: String, required: true },
  location: { type: String },
  notes: { type: String },
  failureReason: { type: String },
  agentId: { type: String },
  statusType: { 
    type: String, 
    enum: ["success", "warning", "error", "neutral", "info"],
    default: "info" 
  }
});

const cardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // Card ID
  cardNumber: { type: String, required: true }, // Last 4 digits only for display
  panLastFour: { type: String, required: true },
  customerName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  cardType: { type: String, required: true },
  currentStatus: { 
    type: String, 
    required: true,
    enum: [
      "approved", "created", "embossing_queued", "embossing_complete", 
      "quality_check_passed", "quality_check_failed", "dispatch_queued", 
      "dispatched", "in_transit", "delivered", "delivery_failed", "destroyed"
    ],
    default: "created"
  },
  statusHistory: [statusEventSchema],
  issueDate: { type: String },
  expiryDate: { type: String },
  address: { type: addressSchema, required: true }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Create indexes for better query performance
cardSchema.index({ id: 1 });
cardSchema.index({ currentStatus: 1 });
cardSchema.index({ customerName: 1 });

export const Card = mongoose.model("Card", cardSchema);
