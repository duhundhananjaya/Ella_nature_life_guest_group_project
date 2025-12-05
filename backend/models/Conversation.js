import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    customerId: { type: String, required: true }, // Could be guest ID or user ID
    customerName: { type: String },
    isRegisteredUser: { type: Boolean, default: false }, // Distinguish registered users from guests
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' }, // Reference to registered user
    lastMessage: { type: String },
    unreadCount: { type: Number, default: 0 },
    resolved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;