import { useState } from 'react';

interface SimpleChatbotProps {
  isLoggedIn: boolean;
}

const SimpleChatbot = ({ isLoggedIn }: SimpleChatbotProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{type: 'user' | 'bot', text: string}>>([
    { type: 'bot', text: 'Hello! I\'m your GreenCollect AI Assistant. I can help you with waste collection, eco-coins, and sustainable products. How can I assist you today?' }
  ]);

  if (!isLoggedIn) return null;

  const handleSend = () => {
    if (!message.trim()) return;
    
    setChatHistory(prev => [...prev, { type: 'user', text: message }]);
    
    // Simulate bot response
    setTimeout(() => {
      let botResponse = 'Thank you for your question! ';
      
      if (message.toLowerCase().includes('pickup') || message.toLowerCase().includes('collect')) {
        botResponse += 'To schedule a pickup, go to your dashboard and click "Schedule Pickup". You can choose from e-waste, plastic, paper, or cardboard collection.';
      } else if (message.toLowerCase().includes('coin') || message.toLowerCase().includes('reward')) {
        botResponse += 'You earn eco-coins for each successful pickup! E-waste gives 30-50 coins, plastic gives 20-30 coins, and paper gives 10-20 coins.';
      } else if (message.toLowerCase().includes('product') || message.toLowerCase().includes('store')) {
        botResponse += 'Visit our eco-store to redeem your coins for sustainable products like bamboo toothbrushes, stainless steel cups, and organic cotton bags.';
      } else if (message.toLowerCase().includes('track') || message.toLowerCase().includes('status')) {
        botResponse += 'You can track your pickup requests in real-time through your dashboard. You\'ll see status updates: scheduled → in-progress → completed.';
      } else {
        botResponse += 'I can help you with scheduling pickups, tracking collections, earning coins, and redeeming rewards. What would you like to know more about?';
      }
      
      setChatHistory(prev => [...prev, { type: 'bot', text: botResponse }]);
    }, 1000);
    
    setMessage('');
  };

  return (
    <>
      {/* Chat Button */}
      <div 
        className="chatbot-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="chat-icon">💬</div>
        <span className="chat-label">AI Assistant</span>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          <div className="chat-header">
            <h4>🤖 GreenCollect AI Assistant</h4>
            <button onClick={() => setIsOpen(false)}>×</button>
          </div>
          
          <div className="chat-messages">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-bubble">
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask me about pickups, coins, products..."
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}

      <style>{`
        .chatbot-toggle {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #ffcc00 0%, #ffaa00 100%);
          border-radius: 50%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 8px 25px rgba(255, 204, 0, 0.3);
          transition: all 0.3s ease;
          z-index: 1000;
          border: 3px solid rgba(255, 255, 255, 0.2);
        }

        .chatbot-toggle:hover {
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 35px rgba(255, 204, 0, 0.5);
        }

        .chat-icon {
          font-size: 20px;
          margin-bottom: 2px;
        }

        .chat-label {
          font-size: 8px;
          color: #000;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .chatbot-window {
          position: fixed;
          bottom: 120px;
          right: 30px;
          width: 350px;
          height: 450px;
          background: linear-gradient(135deg, #000000 0%, #333333 100%);
          border: 3px solid #ffcc00;
          border-radius: 15px;
          display: flex;
          flex-direction: column;
          z-index: 999;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .chat-header {
          background: #ffcc00;
          color: #000;
          padding: 15px;
          border-radius: 12px 12px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-header h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
        }

        .chat-header button {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #000;
        }

        .chat-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          max-height: 300px;
        }

        .message {
          margin-bottom: 15px;
        }

        .message.user .message-bubble {
          background: #ffcc00;
          color: #000;
          margin-left: auto;
          max-width: 80%;
        }

        .message.bot .message-bubble {
          background: #333;
          color: #fff;
          border: 1px solid #ffcc00;
          max-width: 80%;
        }

        .message-bubble {
          padding: 10px 12px;
          border-radius: 12px;
          font-size: 13px;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .chat-input {
          display: flex;
          padding: 15px;
          border-top: 1px solid #ffcc00;
          gap: 10px;
        }

        .chat-input input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ffcc00;
          border-radius: 20px;
          background: #000;
          color: #fff;
          font-size: 13px;
        }

        .chat-input input:focus {
          outline: none;
          box-shadow: 0 0 0 2px rgba(255, 204, 0, 0.3);
        }

        .chat-input button {
          background: #ffcc00;
          color: #000;
          border: none;
          border-radius: 20px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
        }

        .chat-input button:hover {
          background: #ffd700;
        }

        @media (max-width: 768px) {
          .chatbot-toggle {
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
          }

          .chatbot-window {
            right: 20px;
            bottom: 90px;
            width: 300px;
            height: 400px;
          }
        }
      `}</style>
    </>
  );
};

export default SimpleChatbot;
