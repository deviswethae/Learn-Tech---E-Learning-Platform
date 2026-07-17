import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import moment from "moment";
import { useSelector } from "react-redux";
import "../styles/Chat.css";

const socket = io("https://learn-tech-e-learning-platform-backend.onrender.com");

const ChatPage = ({ setShowChat }) => {
  const userStore = useSelector((store) => store.UserReducer);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const token = userStore?.token;
    if (!token) {
      setError("Please log in to use chat");
      return;
    }

    socket.emit("authenticate", token);

    const onAuthenticated = () => {
      setConnected(true);
      socket.emit("requestPreviousMessages");
    };

    const onAuthError = () => {
      setError("Session expired — please log in again");
    };

    const onReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    const onPreviousMessages = (loadedMessages) => {
      setMessages(loadedMessages);
    };

    const onUpdateStatus = ({ messageId, status }) => {
      setMessages((prev) =>
        prev.map((msg) => (msg._id === messageId ? { ...msg, status } : msg))
      );
    };

    socket.on("authenticated", onAuthenticated);
    socket.on("authenticationError", onAuthError);
    socket.on("receiveMessage", onReceiveMessage);
    socket.on("previousMessages", onPreviousMessages);
    socket.on("updateMessageStatus", onUpdateStatus);

    return () => {
      socket.off("authenticated", onAuthenticated);
      socket.off("authenticationError", onAuthError);
      socket.off("receiveMessage", onReceiveMessage);
      socket.off("previousMessages", onPreviousMessages);
      socket.off("updateMessageStatus", onUpdateStatus);
    };
  }, [userStore?.token]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!inputMessage.trim() || !connected) return;

    socket.emit("sendMessage", {
      text: inputMessage,
      chatType: "private",
    });
    setInputMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => moment(timestamp).format("h:mm A");

  if (error) {
    return (
      <div className="chat-container">
        <div className="chat-header">
          <div className="chat-title">Chat</div>
          <button className="close-button" onClick={() => setShowChat(false)}>
            &times;
          </button>
        </div>
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="chat-container loading">
        <div className="chat-header">
          <div className="loading-placeholder"></div>
          <button className="close-button loading"></button>
        </div>
        <div className="chat-messages">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="message-loading">
              <div className="content-loading">
                <div
                  className="text-loading"
                  style={{ width: `${Math.random() * 100 + 100}px` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input-container loading">
          <div className="input-loading"></div>
          <div className="button-loading"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="chat-title">Global Chat</div>
        <button className="close-button" onClick={() => setShowChat(false)}>
          &times;
        </button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => {
            const senderId = message.sender?._id || message.sender;
            const isOwn = senderId === userStore.userId;
            const sender = message.sender || {};

            return (
              <div
                key={message._id || message.timestamp}
                className={`message-container ${isOwn ? "sent" : "received"}`}
              >
                <div className="message-content">
                  {!isOwn && (
                    <div className="message-sender">
                      {sender.name}
                      {sender.role !== "user" && (
                        <span className={`role-badge ${sender.role}`}>
                          {sender.role}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="message-bubble">
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">
                      {formatTime(message.timestamp)}
                      {isOwn && (
                        <span className={`message-status ${message.status || "sent"}`}>
                          {message.status === "read" ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} disabled={!inputMessage.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;