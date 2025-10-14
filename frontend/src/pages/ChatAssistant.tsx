import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const ChatAssistant = () => {
  const [messages, setMessages] = useState<{ role:'user'|'assistant'; text:string }[]>([]);
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket|null>(null);
  const draftRef = useRef('');
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem('auth.userId') || 'demo-user';
    const s = io('/', { 
      query: { userId },
      autoConnect: false
    });
    
    // Connect and handle errors gracefully
    s.connect();
    socketRef.current = s;
    
    // Handle connection errors
    s.on('connect_error', (error: any) => {
      console.log('Chat Socket.IO connection failed:', error?.message || error);
      setError('Chat service unavailable. Please ensure backend is running.');
    });

    s.on('connect', () => {
      setError(null); // Clear error on successful connection
    });
    s.on('chat:status', (p:any) => setStreaming(p.state === 'thinking'));
    s.on('chat:delta', (piece:string) => {
      draftRef.current += piece;
      setMessages(prev => {
        const copy = [...prev];
        if (copy[copy.length-1]?.role === 'assistant') {
          copy[copy.length-1] = { role: 'assistant', text: draftRef.current };
        } else {
          copy.push({ role:'assistant', text: draftRef.current });
        }
        return copy;
      });
    });
    s.on('chat:done', (payload:any) => {
      // Ensure final text in list (payload.display preferred if provided)
      if (payload?.display) {
        setMessages(prev => [...prev.filter(m=>m.role!=='assistant' || m.text!==draftRef.current), { role:'assistant', text: payload.display }]);
      }
      // Speak
      if (payload?.speech) {
        const u = new SpeechSynthesisUtterance(payload.speech);
        u.rate = 1.0;
        speechSynthesis.speak(u);
      }
      draftRef.current = '';
    });
  s.on('chat:error', (e:any) => { draftRef.current=''; setError(e?.message || 'Assistant failed to respond'); });
  return () => { s.disconnect(); };
  }, []);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages(prev => [...prev, { role:'user', text }]);
    draftRef.current = '';
    socketRef.current?.emit('chat:user', { userId: localStorage.getItem('auth.userId') || 'demo-user', text });
    setInput('');
  };

  const startListening = () => {
    const SR:any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) { alert('Speech recognition not supported'); return; }
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    setListening(true);
    rec.onresult = (e:any) => { setInput(e.results[0][0].transcript); setListening(false); };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  };

  return (
    <div className="chat-page" style={{maxWidth: 900, margin: '0 auto', padding: 16}}>
      <h2 style={{color:'#ffcc00'}}>AI Assistant</h2>
      <div className="chat-window" style={{background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', borderRadius:12, padding:12, minHeight:300}}>
        {error && <div style={{color:'#ff6666', marginBottom:8, fontSize:12}}>{error}</div>}
        {messages.map((m,i)=> (
          <div key={i} style={{display:'flex', justifyContent: m.role==='user'?'flex-end':'flex-start', margin:'8px 0'}}>
            <div style={{maxWidth:'80%', padding:'10px 12px', borderRadius:10, background: m.role==='user' ? '#ffcc00' : 'rgba(255,255,255,0.08)', color: m.role==='user'?'#111':'#eaeaea'}}>
              {m.text}
            </div>
          </div>
        ))}
        {streaming && <div style={{opacity:0.7, fontSize:12}}>Assistant is typing…</div>}
      </div>
      <div className="chat-input" style={{display:'flex', gap:8, marginTop:12}}>
        <button onClick={startListening} disabled={listening} className="btn btn-outline">{listening?'Listening…':'🎤'}</button>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send(); }} placeholder="Ask me anything…" style={{flex:1, padding:'10px 12px', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'#fff'}} />
        <button onClick={send} disabled={!input.trim()} className="btn btn-yellow">Send</button>
      </div>
    </div>
  );
};

export default ChatAssistant;
