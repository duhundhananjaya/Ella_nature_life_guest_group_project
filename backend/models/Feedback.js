import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
    name: {type: String},
    email: {type: String},
    message: {type: String},
    created_at: {type: Date, default: Date.now}
})

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;