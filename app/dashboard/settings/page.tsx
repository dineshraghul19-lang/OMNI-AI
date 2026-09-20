'use client';

import { Save, User, Bell, Shield, Key, Loader2, CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const BUSINESS_ID = 'd1b7d59b-134e-4f10-8646-6b2c2eb949b2';

type Tab = 'profile' | 'notifications' | 'security' | 'apikeys';

export default function Settings() {
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState('Admin');
  const [lastName, setLastName] = useState('User');
  const [email, setEmail] = useState('admin@omniai.com');
  const [businessName, setBusinessName] = useState('OMNI AI Supreme Bot');
  const [geminiKey, setGeminiKey] = useState('');

  // Load real business settings from DB on mount
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('businesses')
        .select('name, settings')
        .eq('id', BUSINESS_ID)
        .single();

      if (data) {
        setBusinessName(data.name || 'OMNI AI Supreme Bot');
        const s = data.settings || {};
        if (s.firstName) setFirstName(s.firstName);
        if (s.lastName) setLastName(s.lastName);
        if (s.email) setEmail(s.email);
        if (s.geminiKey) setGeminiKey(s.geminiKey);
      }
      setLoading(false);
    };
    load();
  }, [supabase]);

  const handleSave = async () => {
    setSaving(true);
    await supabase
      .from('businesses')
      .update({
        name: businessName,
        settings: { firstName, lastName, email, geminiKey },
      })
      .eq('id', BUSINESS_ID);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'notifications' as Tab, label: 'Notifications', icon: Bell },
    { id: 'security' as Tab, label: 'Security', icon: Shield },
    { id: 'apikeys' as Tab, label: 'API Keys', icon: Key },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-gray-400 mt-1">Manage your account settings and preferences.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full md:w-64 space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/10 text-indigo-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-24 text-gray-500">
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading settings...
              </div>
            ) : activeTab === 'profile' ? (
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Business Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={e => setBusinessName(e.target.value)}
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
            ) : activeTab === 'apikeys' ? (
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-2">API Keys</h2>
                <p className="text-gray-400 text-sm mb-6">Store your integration keys securely. These are used to power the AI and other features.</p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Gemini API Key</label>
                    <input
                      type="password"
                      value={geminiKey}
                      onChange={e => setGeminiKey(e.target.value)}
                      placeholder="AQ.Ab8RN6..."
                      className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm font-mono focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <p className="text-xs text-gray-500">Get yours from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline">Google AI Studio</a></p>
                  </div>
                </div>
              </div>
            ) : activeTab === 'notifications' ? (
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {['New conversation started', 'Customer requires human handoff', 'New lead captured', 'Daily summary email'].map(label => (
                    <div key={label} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                      <span className="text-sm text-gray-300">{label}</span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-700 peer-checked:bg-indigo-600 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#111] border border-white/5 rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-6">Security</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-400">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
                ) : saved ? (
                  <><CheckCircle2 className="w-4 h-4 text-emerald-400" />Saved!</>
                ) : (
                  <><Save className="w-4 h-4" />Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
