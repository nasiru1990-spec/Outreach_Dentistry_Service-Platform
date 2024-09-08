import React, { useState, useEffect } from "react";
import { getDatabase, ref, push, onChildAdded } from "firebase/database";
import { useAuth } from "../../hooks/useAuth";

function Messaging() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuth();
  const db = getDatabase();

  useEffect(() => {
    const messagesRef = ref(db, "messages");
    const unsubscribe = onChildAdded(messagesRef, (snapshot) => {
      const message = snapshot.val();
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => unsubscribe();
  }, [db]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const messagesRef = ref(db, "messages");
    push(messagesRef, {
      text: newMessage,
      sender: user.email,
      timestamp: Date.now(),
    });

    setNewMessage("");
  };

  return (
    <div className="messaging">
      <h2>Messages</h2>
      <div className="message-list">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.sender}: </strong>
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Messaging;
