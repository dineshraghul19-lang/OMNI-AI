'use client';

import { useState, useEffect } from 'react';
import { Search, MoreVertical, Send, Phone, Mail, MessageCircle, Globe } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import SetupRequired from '@/components/SetupRequired';

type Customer = {
  id: string;
  name: string;
  status?: string;
}

type Conversation = {
  id: string;
  channel: string;
  customer_id: string;
  customers: Customer; // Joined
}

type Message = {
  id: string;
  sender_type: 'customer' | 'ai' | 'human';
  content: string;
  created_at: string;
}

const BUSINESS_ID = 'd1b7d59b-134e-4f10-8646-6b2c2eb949b2'; // Demo Business

export default function Inbox() {
  const supabase = createClient();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [setupRequired, setSetupRequired] = useState(false);

  // 1. Fetch Conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select(`
            id,
            channel,
            customer_id,
            customers (
              id,
              name
            )
          `)
          .eq('business_id', BUSINESS_ID)
          .order('last_contact', { ascending: false });
          
        if (error) {
          if (error.code === '42P01' || error.message?.includes("Could not find the table")) {
            setSetupRequired(true);
            return;
          }
          console.error("Error fetching conversations:", error);
          return;
        }

        if (data) {
          // @ts-ignore - Supabase types are tricky with joins without generated types
          setConversations(data as Conversation[]);
          if (data.length > 0 && !activeConversationId) {
            setActiveConversationId(data[0].id);
          }
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      }
    };

    fetchConversations();

    // Subscribe to new conversations
    const channel = supabase.channel('conversations_channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'conversations' }, (payload) => {
        fetchConversations(); // Just refetch to get the joined customer data easily
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [supabase]);

  // 2. Fetch Messages for active conversation
  useEffect(() => {
    if (!activeConversationId) return;

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', activeConversationId)
        .order('created_at', { ascending: true });
        
      if (data) setMessages(data as Message[]);
    };

    fetchMessages();

    // Subscribe to new messages for this conversation
    const channel = supabase.channel(`messages_${activeConversationId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `conversation_id=eq.${activeConversationId}`
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel) };
  }, [activeConversationId, supabase]);

  const handleSend = async () => {
    if (!input.trim() || !activeConversationId) return;

    const tempInput = input;
    setInput('');

    // Insert human message
    await supabase.from('messages').insert({
      conversation_id: activeConversationId,
      sender_type: 'human',
      content: tempInput
    });
    
    // Update last_contact
    await supabase.from('conversations').update({
      last_contact: new Date().toISOString()
    }).eq('id', activeConversationId);
  };

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  const getChannelIcon = (channel: string) => {
    switch(channel) {
      case 'whatsapp': return <Phone className="w-4 h-4 text-green-500" />;
      case 'instagram': return <MessageCircle className="w-4 h-4 text-pink-500" />;
      case 'gmail': return <Mail className="w-4 h-4 text-red-500" />;
      case 'website': return <Globe className="w-4 h-4 text-blue-500" />;
      default: return <MessageCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  if (setupRequired) {
    return <SetupRequired />;
  }

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Conversations List */}
      <div className="w-80 border-r border-white/10 bg-[#0A0A0A] flex flex-col">
        <div className="h-16 px-4 flex items-center border-b border-white/10 shrink-0">
          <h2 className="font-semibold text-lg">Inbox</h2>
          <div className="ml-auto bg-[#111] rounded-full px-2 py-1 text-xs text-gray-400 border border-white/5">
            {conversations.length} total
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => {
            const isActive = activeConversationId === conv.id;
            return (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full text-left px-4 py-4 border-b border-white/5 transition-colors hover:bg-white/5 ${isActive ? 'bg-white/5 border-l-2 border-l-indigo-500' : 'border-l-2 border-l-transparent'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium truncate pr-2">{conv.customers?.name || 'Unknown'}</span>
                  {getChannelIcon(conv.channel)}
                </div>
                <p className="text-xs text-gray-500 uppercase tracking-wider">{conv.channel}</p>
              </button>
            );
          })}
          {conversations.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-500">
              No conversations yet. Open the website chat to start one!
            </div>
          )}
        </div>
      </div>

      {/* Active Conversation */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-[#111]">
          {/* Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-white/10 bg-[#0A0A0A] shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-semibold text-lg">
                {activeConversation.customers?.name?.charAt(0) || '?'}
              </div>
              <div>
                <h3 className="font-semibold">{activeConversation.customers?.name || 'Unknown'}</h3>
                <p className="text-xs text-gray-400 capitalize flex items-center gap-1.5">
                  {getChannelIcon(activeConversation.channel)}
                  Via {activeConversation.channel}
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => {
              const isCustomer = msg.sender_type === 'customer';
              return (
                <div key={msg.id} className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                    isCustomer 
                      ? 'bg-white/10 text-white rounded-tl-sm' 
                      : msg.sender_type === 'ai' 
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : 'bg-emerald-600 text-white rounded-tr-sm'
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <div className={`text-[10px] mt-1.5 flex items-center gap-1.5 ${isCustomer ? 'text-gray-400' : 'text-indigo-200'}`}>
                      {!isCustomer && (
                        <span className="opacity-80 font-medium">
                          {msg.sender_type === 'ai' ? '🤖 AI' : '👤 You'}
                        </span>
                      )}
                      <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-10">No messages yet.</div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-[#0A0A0A] border-t border-white/10 shrink-0">
            <div className="flex items-center gap-3 bg-[#111] border border-white/10 rounded-xl px-4 py-2 focus-within:border-indigo-500 transition-colors">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your reply..." 
                className="flex-1 bg-transparent border-none focus:outline-none text-sm py-2"
              />
              <button onClick={handleSend} disabled={!input.trim()} className="w-8 h-8 rounded-full bg-indigo-600 disabled:opacity-50 flex items-center justify-center hover:bg-indigo-700 transition-colors shrink-0">
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
          <MessageCircle className="w-12 h-12 mb-4 opacity-50" />
          <p>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
}
