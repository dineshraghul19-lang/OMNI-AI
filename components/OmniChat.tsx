'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';

export default function OmniChat({ businessId = 'd1b7d59b-134e-4f10-8646-6b2c2eb949b2' }: { businessId?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ id: string; sender: 'ai' | 'customer'; text: string }[]>([
    { id: '1', sender: 'ai', text: 'Hi there! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');

  useEffect(() => {
    // Generate a simple session ID for this browser tab
    setSessionId(Math.random().toString(36).substring(2, 15));
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMsg = { id: Date.now().toString(), sender: 'customer' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    try {
      const res = await fetch('/api/connectors/website', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          sessionId,
          message: userMsg.text
        })
      });
      
      const data = await res.json();
      if (data.reply) {
        const aiMsg = { 
          id: (Date.now() + 1).toString(), 
          sender: 'ai' as const, 
          text: data.reply
        };
        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="h-16 bg-indigo-600 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="text-white">
                <h3 className="font-semibold text-sm">OMNI Assistant</h3>
                <p className="text-[10px] text-indigo-100">We typically reply instantly</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 bg-gray-50 p-4 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isCustomer = msg.sender === 'customer';
              return (
                <div key={msg.id} className={`flex ${isCustomer ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                    isCustomer 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input area */}
          <div className="p-3 bg-white border-t border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Write a message..."
                className="flex-1 bg-gray-100 border-transparent focus:border-indigo-500 focus:bg-white focus:ring-0 rounded-full px-4 py-2 text-sm text-gray-800 transition-all outline-none"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim()}
                className="w-9 h-9 rounded-full bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 hover:bg-indigo-700 hover:scale-105 rounded-full shadow-xl flex items-center justify-center text-white transition-all"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
