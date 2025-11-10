import mongoose from "mongoose";

const featureSchema = new mongoose.Schema({
    feature_name: {type: String},
    created_at: {type: Date, default: Date.now}
})

const Feature = mongoose.model("Feature", featureSchema);
export default Feature;