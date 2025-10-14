import { useState } from 'react';
import { FaRobot, FaTimes } from 'react-icons/fa';
import ChatAssistant from '../pages/ChatAssistant';

const AssistantFab = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Floating Button */}
      <button
        aria-label="Open AI Assistant"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1000,
          width: 56, height: 56, borderRadius: 9999,
          background: 'linear-gradient(135deg,#ffcc00,#ffaa00)',
          color: '#111', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}
      >
        <FaRobot size={22} />
      </button>

      {/* Panel */}
      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.25)'
          }}
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-label="AI Assistant"
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute', right: 16, bottom: 16,
              width: 'min(92vw, 420px)', height: 'min(80vh, 560px)',
              background: 'rgba(20,20,20,0.9)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 14, boxShadow: '0 20px 45px rgba(0,0,0,0.45)',
              display: 'flex', flexDirection: 'column'
            }}
          >
            <div style={{
              display:'flex', alignItems:'center', justifyContent:'space-between',
              padding: '10px 12px', borderBottom:'1px solid rgba(255,255,255,0.08)'
            }}>
              <div style={{
                fontWeight: 800, letterSpacing: 0.2,
                background: 'linear-gradient(135deg,#ffcc00,#ffaa00)', WebkitBackgroundClip: 'text',
                backgroundClip: 'text', color: 'transparent'
              }}>AI Assistant</div>
              <button aria-label="Close" onClick={() => setOpen(false)} style={{
                background:'transparent', border:'none', color:'#eaeaea', cursor:'pointer'
              }}>
                <FaTimes />
              </button>
            </div>
            <div style={{ flex:1, overflow:'hidden' }}>
              <div style={{ height: '100%', overflow:'auto' }}>
                <ChatAssistant />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssistantFab;
