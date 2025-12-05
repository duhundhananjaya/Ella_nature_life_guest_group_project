import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import io from 'socket.io-client';

// Error Boundary Component
class ChatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Chat component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main>
          <div className="container-fluid px-4">
            <h1 className="mt-4">Live Chat Management</h1>
            <div className="alert alert-danger">
              <h4>Something went wrong with the chat component</h4>
              <p>Please refresh the page to try again.</p>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

const ClerkChatManager = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Socket.IO
  useEffect(() => {
    console.log('Initializing Socket.IO connection...');
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Socket.IO connected:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket.IO connection error:', error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Socket.IO disconnected:', reason);
    });

    setSocket(newSocket);

    // Listen for new messages
    newSocket.on('newMessage', (messageData) => {
      console.log('Clerk: Received newMessage:', messageData);
      if (selectedChat && messageData.conversationId === selectedChat._id) {
        setMessages(prev => {
          // Replace temporary message with real message if it exists
          const tempMessageIndex = prev.findIndex(msg => msg._id.startsWith('temp_') && msg.text === messageData.text);
          if (tempMessageIndex !== -1) {
            const newMessages = [...prev];
            newMessages[tempMessageIndex] = messageData;
            return newMessages;
          } else {
            // Add new message if not already present
            return [...prev, messageData];
          }
        });
      }
      // Refresh conversations to update last message
      fetchConversations();
    });

    // Listen for conversation updates
    newSocket.on('conversationUpdated', (data) => {
      if (data.conversationId === selectedChat?._id) {
        fetchMessages(selectedChat._id);
      }
      fetchConversations();
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Alert timeout
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/chat/conversations");
      // Safely update state to prevent DOM manipulation errors
      setTimeout(() => {
        setConversations(response.data.conversations || []);
      }, 0);
    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError("Failed to load conversations");
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/chat/conversations/${conversationId}/messages`
      );
      // Safely update state to prevent DOM manipulation errors
      setTimeout(() => {
        setMessages(response.data.messages || []);
      }, 0);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError("Failed to load messages");
    } finally {
      setTimeout(() => setLoading(false), 0);
    }
  };

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;

    const messageToSend = messageInput;
    setMessageInput("");

    // Create message object for immediate display
    const newMessage = {
      _id: `temp_${Date.now()}`, // Temporary ID
      text: messageToSend,
      sender: 'clerk',
      createdAt: new Date().toISOString()
    };

    // Add message to UI immediately
    setMessages(prev => [...prev, newMessage]);

    // Send message via Socket.IO
    if (socket) {
      socket.emit('sendMessage', {
        conversationId: selectedChat._id,
        message: messageToSend,
        sender: 'clerk',
        senderType: 'clerk'
      });
      setSuccess("Message sent successfully");
    } else {
      setError("Connection lost. Please refresh the page.");
    }
  };

  // Mark conversation as resolved
  const handleResolveChat = async (conversationId) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/chat/conversations/${conversationId}/resolve`,
        {}
      );
      setSuccess("Conversation marked as resolved");
      fetchConversations();
      if (selectedChat?._id === conversationId) {
        setSelectedChat(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Error resolving conversation:", err);
      setError("Failed to resolve conversation");
    }
  };

  // Initial load
  useEffect(() => {
    fetchConversations();
    // Disable polling to prevent DOM manipulation errors
    // const interval = setInterval(fetchConversations, 30000);
    // return () => clearInterval(interval);
  }, []);

  // Load messages when chat is selected (no polling)
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat._id);
    }
  }, [selectedChat]);

  // Auto-refresh messages every 10 seconds when chat is selected
  useEffect(() => {
    if (!selectedChat) return;

    const interval = setInterval(() => {
      console.log('Clerk: Auto-refreshing messages...');
      fetchMessages(selectedChat._id);
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [selectedChat]);

  // Select conversation
  const handleSelectChat = (conversation) => {
    // Leave previous conversation room
    if (selectedChat && socket) {
      socket.emit('leaveConversation', selectedChat._id);
    }

    setSelectedChat(conversation);
    fetchMessages(conversation._id);

    // Join new conversation room
    if (socket) {
      socket.emit('joinConversation', conversation._id);
    }
  };

  return (
    <main>
      <div className="container-fluid px-4">
        <h1 className="mt-4">Live Chat Management</h1>
        <ol className="breadcrumb mb-4">
          <li className="breadcrumb-item">Dashboard</li>
          <li className="breadcrumb-item active">Live Chat</li>
        </ol>

        {/* Alerts */}
        {error && (
          <div className="alert alert-danger alert-dismissible fade show" role="alert">
⚠️ {error}
            <button type="button" className="btn-close shadow-none" onClick={() => setError(null)}></button>
          </div>
        )}

        {success && (
          <div className="alert alert-success alert-dismissible fade show" role="alert">
✅ {success}
            <button type="button" className="btn-close shadow-none" onClick={() => setSuccess(null)}></button>
          </div>
        )}

        {/* Chat Interface */}
        <div className="card shadow-sm">
          <div className="card-body p-0">
            <div className="row g-0" style={{ height: "70vh" }}>
              {/* Conversations Sidebar */}
              <div className="col-md-4 border-end">
                <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    💬 Active Chats
                    <span className="badge bg-primary ms-2">{conversations.length}</span>
                  </h5>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={fetchConversations}
                    title="Refresh conversations"
                  >
                    <i className="fas fa-sync-alt"></i>
                  </button>
                </div>
                <div className="overflow-auto" style={{ height: "calc(70vh - 60px)" }}>
                  {conversations.length === 0 ? (
                    <div className="text-center text-muted py-5">
                      📭
                      <p>No active conversations</p>
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <div
                        key={conv._id}
                        className={`p-3 border-bottom ${
                          selectedChat?._id === conv._id ? "bg-primary bg-opacity-10" : ""
                        }`}
                        onClick={() => handleSelectChat(conv)}
                        style={{ cursor: "pointer" }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center gap-2">
                              <div
                                className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                                style={{ width: "40px", height: "40px" }}
                              >
                                👤
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-0">
                                  {conv.customerName || conv.customerId || "Guest"}
                                  {conv.isRegisteredUser && <span className="badge bg-success ms-2">Registered</span>}
                                  {!conv.isRegisteredUser && <span className="badge bg-secondary ms-2">Guest</span>}
                                </h6>
                                <small className="text-muted">
                                  {conv.lastMessage ? conv.lastMessage.substring(0, 30) + "..." : "No messages yet"}
                                </small>
                              </div>
                            </div>
                          </div>
                          <div className="text-end">
                            <small className="text-muted d-block">
                              {new Date(conv.updatedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </small>
                            {conv.unreadCount > 0 && (
                              <span className="badge bg-danger rounded-pill mt-1">
                                {conv.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className="col-md-8 d-flex flex-column">
                {selectedChat ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-0">
                          {selectedChat.customerName || selectedChat.customerId || "Guest"}
                          {selectedChat.isRegisteredUser && <span className="badge bg-success ms-2">Registered User</span>}
                          {!selectedChat.isRegisteredUser && <span className="badge bg-secondary ms-2">Guest User</span>}
                        </h5>
                        <small className="text-muted">
                          Started: {new Date(selectedChat.createdAt).toLocaleString()}
                        </small>
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => fetchMessages(selectedChat._id)}
                          title="Refresh messages"
                        >
                          <i className="fas fa-sync-alt"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-success shadow-none"
                          onClick={() => handleResolveChat(selectedChat._id)}
                        >
 ✔️ Resolve
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-grow-1 overflow-auto p-3 bg-light" style={{ height: "calc(70vh - 180px)" }}>
                      {loading && messages.length === 0 ? (
                        <div className="text-center py-5">
                          <div className="spinner-border text-primary" role="status"></div>
                        </div>
                      ) : (
                        <>
                          {messages.map((msg) => (
                            <div
                              key={msg._id}
                              className={`mb-3 d-flex ${
                                msg.sender === "clerk" ? "justify-content-end" : "justify-content-start"
                              }`}
                            >
                              <div
                                className={`rounded-3 px-3 py-2 shadow-sm ${
                                  msg.sender === "clerk"
                                    ? "bg-primary text-white"
                                    : "bg-white text-dark"
                                }`}
                                style={{ maxWidth: "70%" }}
                              >
                                <div>{msg.text}</div>
                                <small
                                  className={`d-block mt-1 ${
                                    msg.sender === "clerk" ? "text-white-50" : "text-muted"
                                  }`}
                                >
                                  {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </small>
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="p-3 border-top bg-white">
                      <form onSubmit={handleSendMessage} className="d-flex gap-2">
                        <input
                          type="text"
                          className="form-control shadow-none"
                          placeholder="Type your message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                        />
                        <button
                          type="submit"
                          className="btn btn-primary shadow-none"
                          disabled={!messageInput.trim()}
                        >
  📤
                        </button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex-grow-1 d-flex align-items-center justify-content-center text-muted">
                    <div className="text-center">
💬
                      <h5>Select a conversation to start chatting</h5>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

const ClerkChatManagerWithErrorBoundary = () => (
  <ChatErrorBoundary>
    <ClerkChatManager />
  </ChatErrorBoundary>
);

export default ClerkChatManagerWithErrorBoundary;