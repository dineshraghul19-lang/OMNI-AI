'use client';

import { Phone, MessageCircle, Mail, Globe, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const BUSINESS_ID = 'd1b7d59b-134e-4f10-8646-6b2c2eb949b2';

const channelDefinitions = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Connect your WhatsApp Business API to automate customer conversations.',
    icon: Phone,
    color: 'bg-green-500',
    textColor: 'text-green-500',
  },
  {
    id: 'instagram',
    name: 'Instagram Direct',
    description: 'Automate replies to stories, DMs, and comments on your business profile.',
    icon: MessageCircle,
    color: 'bg-pink-500',
    textColor: 'text-pink-500',
  },
  {
    id: 'website',
    name: 'Website Chat Widget',
    description: 'Embed our AI chat widget directly onto your website to capture leads.',
    icon: Globe,
    color: 'bg-blue-500',
    textColor: 'text-blue-500',
  },
  {
    id: 'gmail',
    name: 'Gmail Support',
    description: 'Connect your support email to let AI draft replies to customer inquiries.',
    icon: Mail,
    color: 'bg-red-500',
    textColor: 'text-red-500',
  },
];

export default function Integrations() {
  const supabase = createClient();
  const [connectedChannels, setConnectedChannels] = useState<Set<string>>(new Set());
  const [toggling, setToggling] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load connected channels from DB
  useEffect(() => {
    const fetchIntegrations = async () => {
      const { data } = await supabase
        .from('integrations')
        .select('channel_id')
        .eq('business_id', BUSINESS_ID)
        .eq('status', 'connected');

      if (data) {
        setConnectedChannels(new Set(data.map((r: any) => r.channel_id)));
      }
      setLoading(false);
    };
    fetchIntegrations();
  }, [supabase]);

  const handleToggle = async (id: string) => {
    setToggling(id);
    const isConnected = connectedChannels.has(id);

    if (isConnected) {
      // Disconnect: update DB record
      await supabase
        .from('integrations')
        .update({ status: 'disconnected', updated_at: new Date().toISOString() })
        .eq('business_id', BUSINESS_ID)
        .eq('channel_id', id);
      setConnectedChannels(prev => { const s = new Set(prev); s.delete(id); return s; });
    } else {
      // Connect: upsert DB record
      await supabase
        .from('integrations')
        .upsert({
          business_id: BUSINESS_ID,
          channel_id: id,
          status: 'connected',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'business_id,channel_id' });
      setConnectedChannels(prev => new Set(prev).add(id));
    }
    setToggling(null);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Connect Channels</h1>
          <p className="text-gray-400 mt-1">Connect your communication channels to let the AI handle conversations across all platforms.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-3" /> Loading integrations...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {channelDefinitions.map((channel) => {
              const isConnected = connectedChannels.has(channel.id);
              return (
                <div key={channel.id} className="bg-[#111] border border-white/5 rounded-2xl p-6 flex flex-col transition-all hover:bg-white/[0.02]">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${channel.color} bg-opacity-10`}>
                      <channel.icon className={`w-6 h-6 ${channel.textColor}`} />
                    </div>
                    {isConnected ? (
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
                  <p className="text-gray-400 text-sm flex-1 mb-6 leading-relaxed">{channel.description}</p>

                  <button
                    onClick={() => handleToggle(channel.id)}
                    disabled={toggling === channel.id}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isConnected
                        ? 'bg-white/5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-white/10 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    {toggling === channel.id ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> {isConnected ? 'Disconnecting...' : 'Connecting...'}</>
                    ) : isConnected ? (
                      'Disconnect'
                    ) : (
                      <>Connect {channel.name.split(' ')[0]}<ArrowRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
