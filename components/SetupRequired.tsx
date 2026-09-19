'use client';

import { Database, Copy, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

const sqlSchema = `-- 1. Enable pgvector for the Knowledge Base
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create tables
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  identifier TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(business_id, identifier)
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  last_contact TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(768),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'new',
  interest TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create dummy data for testing (Our Demo Business)
INSERT INTO businesses (id, name) VALUES ('d1b7d59b-134e-4f10-8646-6b2c2eb949b2', 'Demo Business') ON CONFLICT DO NOTHING;

-- 4. Enable Realtime on messages and conversations so the Inbox updates automatically
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table conversations;
`;

export default function SetupRequired() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sqlSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#050505] p-8 flex items-center justify-center min-h-full">
      <div className="max-w-3xl w-full bg-[#111] border border-red-500/20 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-red-500/10 blur-[100px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-6">
            <Database className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Database Setup Required</h1>
          <p className="text-gray-400 max-w-lg">
            We couldn't connect to your Supabase tables. This happens when the database schema hasn't been created yet. Let's fix that!
          </p>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold">1</div>
            <div>
              <h3 className="font-semibold text-white">Go to your Supabase SQL Editor</h3>
              <p className="text-sm text-gray-400 mt-1">
                Open your Supabase project and click on "SQL Editor" in the left sidebar.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 font-bold">2</div>
            <div className="w-full overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">Run this SQL code</h3>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-sm text-white transition-colors"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <div className="bg-black/50 border border-white/10 rounded-lg p-4 max-h-[300px] overflow-y-auto">
                <pre className="text-xs text-gray-300 font-mono text-left whitespace-pre-wrap">
                  {sqlSchema}
                </pre>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 font-bold">3</div>
            <div>
              <h3 className="font-semibold text-emerald-400">Refresh this page</h3>
              <p className="text-sm text-emerald-400/80 mt-1">
                Once you run the SQL code successfully, refresh this page and your dashboard will be fully operational.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
