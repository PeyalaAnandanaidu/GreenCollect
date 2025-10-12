import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Plastic", "E-Waste", "Metal", "Paper", "Organic", "Other"], 
      // You can add more categories as needed
    },
    city: { type: String, required: true },
    email: { type: String, required: true },
    wasteProcessed: {
      type: Number,
      required: true,
      min: 0,
      description: "Amount of waste processed in tons or kg",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields automatically
  }
);

const Partner = mongoose.model("Partner", partnerSchema);

export default Partner;
