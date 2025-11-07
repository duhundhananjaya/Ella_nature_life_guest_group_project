import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  room_name: { type: String, required: true, unique: true },
  area: { type: Number, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  adult: { type: Number, required: true },
  children: { type: Number, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  description: { type: String },
  features: [{ type: mongoose.Schema.Types.ObjectId, ref: "Feature" }], 
  facilities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Facility" }], 
  created_at: { type: Date, default: Date.now },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
