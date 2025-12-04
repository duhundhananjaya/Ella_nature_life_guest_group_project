import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Minimize2 } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';

export default function FloatingChat() {
   const [isOpen, setIsOpen] = useState(false);
   const [isMinimized, setIsMinimized] = useState(false);
   const [messages, setMessages] = useState([
     { id: 1, text: "Hi! How can I help you today?", sender: "bot", time: "Just now" }
   ]);
   const [inputValue, setInputValue] = useState("");

   // Check if user is authenticated
   const isAuthenticated = !!localStorage.getItem('token');
   const currentUser = isAuthenticated ? JSON.parse(localStorage.getItem('user') || '{}') : null;

   const [customerId] = useState(() => {
     if (isAuthenticated && currentUser) {
       return currentUser._id || currentUser.id;
     }
     return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
   });

   const [customerName] = useState(() => {
     if (isAuthenticated && currentUser) {
       return currentUser.name || `${currentUser.email}`;
     }
     return 'Guest User';
   });

   const [conversationId, setConversationId] = useState(null);
   const [hasSentMessage, setHasSentMessage] = useState(false);
   const [socket, setSocket] = useState(null);
   const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize Socket.IO
  useEffect(() => {
    console.log('Client: Initializing Socket.IO connection...');
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Client: Socket.IO connected:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Client: Socket.IO connection error:', error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Client: Socket.IO disconnected:', reason);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Listen for new messages from clerk
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (messageData) => {
      console.log('Client: Received newMessage:', messageData);
      if (conversationId && messageData.conversationId === conversationId) {
        // Check if this message is already in the chat (to avoid duplicates)
        const messageExists = messages.some(msg => msg.id === messageData._id);
        if (messageExists) {
          console.log('Client: Message already exists, skipping');
          return;
        }

        console.log('Client: Adding message to chat');
        // Convert server message to client format
        const clientMessage = {
          id: messageData._id,
          text: messageData.text,
          sender: messageData.sender === 'user' ? 'user' : 'bot', // Keep user messages as 'user', clerk as 'bot'
          time: new Date(messageData.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, clientMessage]);
      } else {
        console.log('Client: Ignoring message - conversationId mismatch', { current: conversationId, received: messageData.conversationId });
      }
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, conversationId]);

  // Fetch messages for the conversation
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/chat/messages/${customerId}`);
      if (response.data.success) {
        // Set conversationId if available
        if (response.data.conversationId && !conversationId) {
          setConversationId(response.data.conversationId);
        }

        if (response.data.messages.length > 0) {
          // Convert server messages to client format
          const serverMessages = response.data.messages.map(msg => ({
            id: msg._id,
            text: msg.text,
            sender: msg.sender === 'user' ? 'user' : 'bot',
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }));

          // Replace all messages (not just append) to avoid duplicates
          setMessages(prev => {
            // Keep the initial bot message if no server messages
            const initialBotMessage = prev.find(m => m.id === 1);
            const allMessages = initialBotMessage && serverMessages.length === 0 ? [initialBotMessage] : serverMessages;
            return allMessages;
          });
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Join conversation room when conversationId is available
  useEffect(() => {
    if (conversationId && socket) {
      socket.emit('joinConversation', conversationId);
      console.log('Client: Joined conversation room:', conversationId);
    }
  }, [conversationId, socket]);

  // Poll for new messages as fallback (every 10 seconds when chat is open and has messages)
  useEffect(() => {
    if (!isOpen || !conversationId) return;

    const interval = setInterval(() => {
      console.log('Client: Polling for new messages...');
      fetchMessages();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [isOpen, conversationId]);

  const handleSend = async () => {
    if (inputValue.trim()) {
      const messageToSend = inputValue;
      setInputValue("");
      setHasSentMessage(true);

      try {
        // First, ensure we have a conversation
        let convId = conversationId;
        if (!convId) {
          const config = isAuthenticated ? {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          } : {};
          const response = await axios.post('http://localhost:3000/api/chat/send-message', {
            customerId,
            customerName,
            message: messageToSend
          }, config);

          if (response.data.success && response.data.conversation) {
            convId = response.data.conversation._id;
            setConversationId(convId);

            // Join the conversation room
            if (socket) {
              socket.emit('joinConversation', convId);
            }
          }
        }

        // Add user message to UI immediately
        const newMessage = {
          id: `user_${Date.now()}`,
          text: messageToSend,
          sender: "user",
          time: "Just now"
        };
        setMessages(prev => [...prev, newMessage]);

        // Send message via Socket.IO if we have a conversation
        if (convId && socket) {
          socket.emit('sendMessage', {
            conversationId: convId,
            message: messageToSend,
            sender: customerId,
            senderType: 'user'
          });
        }

        // Add a confirmation message
        setTimeout(() => {
          const confirmation = {
            id: `confirm_${Date.now()}`,
            text: "Thank you for your message! Our support team will respond shortly.",
            sender: "bot",
            time: "Just now"
          };
          setMessages(prev => [...prev, confirmation]);
        }, 500);
      } catch (error) {
        console.error('Error sending message:', error);
        // Show error message
        setTimeout(() => {
          const errorMsg = {
            id: `error_${Date.now()}`,
            text: "Sorry, there was an error sending your message. Please try again.",
            sender: "bot",
            time: "Just now"
          };
          setMessages(prev => [...prev, errorMsg]);
        }, 500);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1050 }}>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="mb-4 bg-white rounded shadow overflow-hidden d-flex flex-column"
          style={{
            height: isMinimized ? '64px' : '500px',
            width: '380px',
            transition: 'all 0.3s ease'
          }}
        >
          {/* Header */}
          <div className="bg-primary p-4 d-flex align-items-center justify-content-between text-white">
            <div className="d-flex align-items-center gap-3">
              <div className="bg-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                <MessageCircle className="text-primary" style={{ width: '24px', height: '24px' }} />
              </div>
              <div>
                <div className="fw-semibold">Chat Support</div>
                <div className="small opacity-75">Online</div>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-white btn btn-link p-2 rounded-circle"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <Minimize2 style={{ width: '20px', height: '20px' }} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white btn btn-link p-2 rounded-circle"
                style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
          </div>

          {/* Messages */}
          {!isMinimized && (
            <>
              <div className="flex-fill overflow-auto p-4 bg-light">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-4 d-flex ${
                      message.sender === 'user' ? 'justify-content-end' : 'justify-content-start'
                    }`}
                  >
                    <div
                      className={`rounded p-2 ${
                        message.sender === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-white text-dark shadow-sm'
                      }`}
                      style={{ maxWidth: '75%', borderRadius: '1rem' }}
                    >
                      <div className="small">{message.text}</div>
                      <div
                        className={`small mt-1 ${
                          message.sender === 'user' ? 'text-light' : 'text-muted'
                        }`}
                      >
                        {message.time}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-white border-top">
                <div className="d-flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="form-control flex-fill rounded-pill"
                  />
                  <button
                    onClick={handleSend}
                    className="btn btn-primary rounded-circle p-2"
                  >
                    <Send style={{ width: '20px', height: '20px' }} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Button */}
      <div className="d-flex flex-column gap-2">
        {isOpen && (
          <button
            onClick={() => {
              console.log('Client: Manual refresh triggered');
              fetchMessages();
            }}
            className="btn btn-secondary btn-sm rounded-circle shadow"
            style={{ width: '40px', height: '40px' }}
            title="Refresh messages"
          >
            🔄
          </button>
        )}
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsMinimized(false);
          }}
          className="btn btn-primary text-white rounded-circle shadow d-flex align-items-center justify-content-center"
          style={{
            width: '64px',
            height: '64px',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          {isOpen ? (
            <X style={{ width: '28px', height: '28px' }} />
          ) : (
            <MessageCircle style={{ width: '28px', height: '28px' }} />
          )}
        </button>
      </div>
    </div>
  );
}