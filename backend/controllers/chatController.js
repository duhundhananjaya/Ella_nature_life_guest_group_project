import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';

// Get all conversations
const getConversations = async (req, res) => {
    try {
        const conversations = await Conversation.find({ resolved: false }).sort({ updatedAt: -1 });
        return res.status(200).json({ success: true, conversations });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get messages for a conversation
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });
        return res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Send a message
const sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { message } = req.body;
        const sender = 'clerk'; // Since this is from clerk dashboard

        // Create new message
        const newMessage = new Message({
            conversationId,
            text: message,
            sender
        });

        await newMessage.save();

        // Update conversation's last message and timestamp
        await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: message,
            updatedAt: new Date()
        });

        return res.status(201).json({ success: true, message: 'Message sent successfully', messageData: newMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Resolve a conversation
const resolveConversation = async (req, res) => {
    try {
        const { conversationId } = req.params;

        await Conversation.findByIdAndUpdate(conversationId, { resolved: true });

        return res.status(200).json({ success: true, message: 'Conversation resolved successfully' });
    } catch (error) {
        console.error('Error resolving conversation:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Create a new conversation (for when user starts chatting)
const createConversation = async (req, res) => {
    try {
        const { customerId, customerName } = req.body;

        const existingConversation = await Conversation.findOne({
            customerId,
            resolved: false
        });

        if (existingConversation) {
            return res.status(200).json({ success: true, conversation: existingConversation });
        }

        const newConversation = new Conversation({
            customerId,
            customerName
        });

        await newConversation.save();

        return res.status(201).json({ success: true, conversation: newConversation });
    } catch (error) {
        console.error('Error creating conversation:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Send message from user (client frontend)
const sendUserMessage = async (req, res) => {
    try {
        const { customerId, customerName, message } = req.body;

        // Check if this is a registered user (has token in request)
        const token = req.headers.authorization?.split(' ')[1];
        let isRegisteredUser = false;
        let userId = null;

        if (token) {
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                isRegisteredUser = true;
                userId = decoded.id;
            } catch (err) {
                // Token invalid, treat as guest
            }
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({ customerId, resolved: false });

        if (!conversation) {
            conversation = new Conversation({
                customerId,
                customerName,
                isRegisteredUser,
                userId: isRegisteredUser ? userId : null
            });
            await conversation.save();
        }

        // Create message
        const newMessage = new Message({
            conversationId: conversation._id,
            text: message,
            sender: 'user'
        });

        await newMessage.save();

        // Update conversation
        await Conversation.findByIdAndUpdate(conversation._id, {
            lastMessage: message,
            updatedAt: new Date(),
            unreadCount: conversation.unreadCount + 1
        });

        return res.status(201).json({ success: true, message: 'Message sent successfully', conversation });
    } catch (error) {
        console.error('Error sending user message:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Get messages for a customer (for client frontend polling)
const getCustomerMessages = async (req, res) => {
    try {
        const { customerId } = req.params;

        // Find the conversation for this customer
        const conversation = await Conversation.findOne({ customerId, resolved: false });
        if (!conversation) {
            return res.status(200).json({ success: true, messages: [], conversationId: null });
        }

        // Get messages for this conversation
        const messages = await Message.find({ conversationId: conversation._id }).sort({ createdAt: 1 });
        return res.status(200).json({ success: true, messages, conversationId: conversation._id });
    } catch (error) {
        console.error('Error fetching customer messages:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export {
    getConversations,
    getMessages,
    sendMessage,
    resolveConversation,
    createConversation,
    sendUserMessage,
    getCustomerMessages
};