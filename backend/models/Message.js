import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    text: { type: String, required: true },
    sender: { type: String, enum: ['user', 'clerk'], required: true },
    createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model("Message", messageSchema);
export default Message;