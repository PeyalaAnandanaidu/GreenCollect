import { useEffect, useState } from 'react';

interface ElevenLabsWidgetProps {
  isLoggedIn: boolean;
}

const ElevenLabsWidget = ({ isLoggedIn }: ElevenLabsWidgetProps) => {
  const [isWidgetReady, setIsWidgetReady] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      // Check if the ElevenLabs script is loaded
      const checkWidget = () => {
        if ((window as any).customElements && (window as any).customElements.get('elevenlabs-convai')) {
          setIsWidgetReady(true);
        } else {
          // Try again after a short delay
          setTimeout(checkWidget, 500);
        }
      };

      // Start checking after the script should be loaded
      setTimeout(checkWidget, 1000);
    } else {
      setIsWidgetReady(false);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  return (
    <>
      {/* ElevenLabs ConvAI Widget */}
      <div 
        className="elevenlabs-widget-container"
        dangerouslySetInnerHTML={{
          __html: '<elevenlabs-convai agent-id="agent_8201k7e7fffxebr8vxe4q774fcve"></elevenlabs-convai>'
        }}
      />

      {/* Custom Styling for ElevenLabs Widget */}
      <style>{`
        .elevenlabs-widget-container {
          position: fixed;
          bottom: 30px;
          left: 30px;
          z-index: 1000;
        }

        /* Style the ElevenLabs ConvAI widget to match GreenCollect theme */
        elevenlabs-convai {
          --elevenlabs-primary-color: #ffcc00 !important;
          --elevenlabs-secondary-color: #ffaa00 !important;
          --elevenlabs-background-color: #000000 !important;
          --elevenlabs-text-color: #ffffff !important;
          --elevenlabs-border-color: rgba(255, 204, 0, 0.5) !important;
          --elevenlabs-accent-color: #ffcc00 !important;
        }

        /* Custom positioning and styling for the widget button */
        elevenlabs-convai button,
        elevenlabs-convai [role="button"] {
          background: linear-gradient(135deg, #ffcc00 0%, #ffaa00 100%) !important;
          border: none !important;
          border-radius: 50% !important;
          width: 70px !important;
          height: 70px !important;
          box-shadow: 0 8px 25px rgba(255, 204, 0, 0.3) !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border: 3px solid rgba(255, 255, 255, 0.2) !important;
        }

        elevenlabs-convai button:hover,
        elevenlabs-convai [role="button"]:hover {
          transform: translateY(-3px) scale(1.05) !important;
          box-shadow: 0 12px 35px rgba(255, 204, 0, 0.5) !important;
          background: linear-gradient(135deg, #ffd700 0%, #ffcc00 100%) !important;
        }

        elevenlabs-convai button:active,
        elevenlabs-convai [role="button"]:active {
          transform: translateY(-1px) scale(0.98) !important;
        }

        /* Style the widget panel when open */
        elevenlabs-convai .widget-panel,
        elevenlabs-convai [class*="panel"],
        elevenlabs-convai [class*="container"],
        elevenlabs-convai [class*="chat"] {
          background: linear-gradient(135deg, #000000 0%, #333333 100%) !important;
          border: 3px solid #ffcc00 !important;
          border-radius: 15px !important;
          backdrop-filter: blur(15px) !important;
          color: #ffffff !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
          max-width: 400px !important;
          max-height: 500px !important;
        }

        /* Style text and inputs in the widget */
        elevenlabs-convai input,
        elevenlabs-convai textarea,
        elevenlabs-convai [contenteditable] {
          background: rgba(20, 20, 20, 0.9) !important;
          border: 1px solid rgba(255, 204, 0, 0.5) !important;
          border-radius: 8px !important;
          color: #ffffff !important;
          padding: 12px !important;
          font-family: 'Inter', sans-serif !important;
        }

        elevenlabs-convai input:focus,
        elevenlabs-convai textarea:focus,
        elevenlabs-convai [contenteditable]:focus {
          border-color: #ffcc00 !important;
          box-shadow: 0 0 0 2px rgba(255, 204, 0, 0.2) !important;
          outline: none !important;
        }

        /* Style buttons inside the chat */
        elevenlabs-convai .chat-button,
        elevenlabs-convai button:not([role="button"]) {
          background: #ffcc00 !important;
          color: #000000 !important;
          border: none !important;
          border-radius: 20px !important;
          padding: 8px 16px !important;
          font-weight: 600 !important;
          cursor: pointer !important;
        }

        elevenlabs-convai .chat-button:hover,
        elevenlabs-convai button:not([role="button"]):hover {
          background: #ffd700 !important;
        }

        /* Animation for widget appearance */
        elevenlabs-convai {
          animation: slideInFromLeft 0.6s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }

        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .elevenlabs-widget-container {
            left: 20px !important;
            bottom: 20px !important;
          }
          
          elevenlabs-convai button,
          elevenlabs-convai [role="button"] {
            width: 60px !important;
            height: 60px !important;
          }
          
          elevenlabs-convai .widget-panel,
          elevenlabs-convai [class*="panel"],
          elevenlabs-convai [class*="container"],
          elevenlabs-convai [class*="chat"] {
            max-width: 300px !important;
            max-height: 400px !important;
          }
        }
      `}</style>
    </>
  );
};

export default ElevenLabsWidget;
