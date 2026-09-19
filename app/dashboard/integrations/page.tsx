'use client';

import { Phone, MessageCircle, Mail, Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState } from 'react';

const channels = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Connect your WhatsApp Business API to automate customer conversations.',
    icon: Phone,
    color: 'bg-green-500',
    status: 'connected',
  },
  {
    id: 'instagram',
    name: 'Instagram Direct',
    description: 'Automate replies to stories, DMs, and comments on your business profile.',
    icon: MessageCircle,
    color: 'bg-pink-500',
    status: 'disconnected',
  },
  {
    id: 'website',
    name: 'Website Chat Widget',
    description: 'Embed our AI chat widget directly onto your website to capture leads.',
    icon: Globe,
    color: 'bg-blue-500',
    status: 'connected',
  },
  {
    id: 'gmail',
    name: 'Gmail Support',
    description: 'Connect your support email to let AI draft replies to customer inquiries.',
    icon: Mail,
    color: 'bg-red-500',
    status: 'disconnected',
  }
];

export default function Integrations() {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = (id: string) => {
    setConnecting(id);
    setTimeout(() => {
      setConnecting(null);
      // Mock toggle status for demo
      const index = channels.findIndex(c => c.id === id);
      if (index !== -1) {
        channels[index].status = channels[index].status === 'connected' ? 'disconnected' : 'connected';
      }
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Connect Channels</h1>
          <p className="text-gray-400 mt-1">Connect your communication channels to let the AI handle conversations across all platforms.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {channels.map((channel) => (
            <div key={channel.id} className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col transition-all hover:bg-white/[0.02]">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${channel.color} bg-opacity-10`}>
                  <channel.icon className={`w-6 h-6 ${channel.color.replace('bg-', 'text-')}`} />
                </div>
                {channel.status === 'connected' ? (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Connected
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-white/5 text-gray-400 text-xs font-medium rounded-full border border-white/10">
                    Not Connected
                  </span>
                )}
              </div>
              
              <h3 className="text-xl font-semibold mb-2">{channel.name}</h3>
              <p className="text-gray-400 text-sm flex-1 mb-6 leading-relaxed">
                {channel.description}
              </p>

              <button 
                onClick={() => handleConnect(channel.id)}
                disabled={connecting === channel.id}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  channel.status === 'connected' 
                    ? 'bg-white/5 hover:bg-white/10 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                {connecting === channel.id ? (
                  <span className="animate-pulse">Connecting...</span>
                ) : channel.status === 'connected' ? (
                  'Manage Connection'
                ) : (
                  <>
                    Connect {channel.name.split(' ')[0]}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
