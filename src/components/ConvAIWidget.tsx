import { useEffect } from 'react';

interface ConvAIWidgetProps {
  isLoggedIn: boolean;
}

const ConvAIWidget = ({ isLoggedIn }: ConvAIWidgetProps) => {
  useEffect(() => {
    // Load ElevenLabs ConvAI script if not already loaded
    if (isLoggedIn && !document.querySelector('script[src*="convai-widget-embed"]')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@elevenlabs/convai-widget-embed';
      script.async = true;
      script.type = 'text/javascript';
      document.head.appendChild(script);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  return (
    <>
      {/* ElevenLabs ConvAI Widget injected via innerHTML to avoid TSX custom element typing issues */}
      <div dangerouslySetInnerHTML={{ __html: '<elevenlabs-convai agent-id="agent_1101k7eje7wtetj8739rv2bx2ezz"></elevenlabs-convai>' }} />
      {/* Styling to match GreenCollect theme */}
      <style>{`
        elevenlabs-convai {
          --elevenlabs-primary-color: #ffcc00 !important;
          --elevenlabs-secondary-color: #ffaa00 !important;
          --elevenlabs-background-color: #000000 !important;
          --elevenlabs-text-color: #ffffff !important;
          --elevenlabs-border-color: #ffcc00 !important;
          --elevenlabs-accent-color: #ffcc00 !important;
        }
        
        /* Position the widget */
        elevenlabs-convai {
          position: fixed !important;
          bottom: 30px !important;
          right: 30px !important;
          z-index: 1051 !important;
        }
        
        /* Style the widget button */
        elevenlabs-convai button,
        elevenlabs-convai [role="button"] {
          background: linear-gradient(135deg, #ffcc00 0%, #ffaa00 100%) !important;
          border: none !important;
          border-radius: 50% !important;
          width: 70px !important;
          height: 70px !important;
          box-shadow: 0 8px 25px rgba(255, 204, 0, 0.3) !important;
          transition: all 0.3s ease !important;
        }
        
        elevenlabs-convai button:hover,
        elevenlabs-convai [role="button"]:hover {
          transform: translateY(-3px) scale(1.05) !important;
          box-shadow: 0 12px 35px rgba(255, 204, 0, 0.5) !important;
        }
        
        /* Style the chat panel */
        elevenlabs-convai .panel,
        elevenlabs-convai [class*="panel"],
        elevenlabs-convai [class*="chat"],
        elevenlabs-convai [class*="container"] {
          background: linear-gradient(135deg, #000000 0%, #333333 100%) !important;
          border: 3px solid #ffcc00 !important;
          border-radius: 15px !important;
          color: #ffffff !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
          z-index: 1051 !important;
          position: relative !important;
          max-height: calc(100vh - 100px) !important;
          margin-top: 10px !important;
        }
        
        /* Ensure chat panel doesn't overlap with navbar */
        elevenlabs-convai [class*="panel"]:not([class*="button"]) {
          top: auto !important;
          bottom: 80px !important;
          right: 0 !important;
        }
        
        /* Additional styling to prevent navbar overlap */
        elevenlabs-convai [class*="modal"],
        elevenlabs-convai [class*="overlay"],
        elevenlabs-convai [class*="dialog"] {
          z-index: 1052 !important;
          padding-top: 80px !important;
        }
        
        /* Style inputs and text areas */
        elevenlabs-convai input,
        elevenlabs-convai textarea {
          background: rgba(20, 20, 20, 0.9) !important;
          border: 1px solid #ffcc00 !important;
          border-radius: 8px !important;
          color: #ffffff !important;
          padding: 12px !important;
        }
        
        elevenlabs-convai input:focus,
        elevenlabs-convai textarea:focus {
          border-color: #ffd700 !important;
          box-shadow: 0 0 0 2px rgba(255, 204, 0, 0.3) !important;
          outline: none !important;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          elevenlabs-convai {
            right: 20px !important;
            bottom: 20px !important;
          }
          
          elevenlabs-convai button,
          elevenlabs-convai [role="button"] {
            width: 60px !important;
            height: 60px !important;
          }
          
          elevenlabs-convai [class*="panel"],
          elevenlabs-convai [class*="chat"],
          elevenlabs-convai [class*="container"] {
            max-width: 300px !important;
            max-height: calc(100vh - 120px) !important;
          }
        }
      `}</style>
    </>
  );
};

export default ConvAIWidget;
