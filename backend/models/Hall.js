import mongoose from "mongoose";

const hallSchema = new mongoose.Schema({
  hall_name: { type: String, required: true, unique: true },
  area: { type: Number, required: true },
  price: { type: Number, required: true },
 
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  description: { type: String },
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }], 
  facilities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Facility" }],
  images: [
    {
      image_path: { type: String, required: true },
      is_thumbnail: { type: Boolean, default: false },
      uploaded_at: { type: Date, default: Date.now }
    }
  ], 
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

const Hall = mongoose.model("Hall", hallSchema);
export default Hall;
