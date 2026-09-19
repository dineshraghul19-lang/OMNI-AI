import Link from 'next/link';
import { ArrowRight, MessageSquare, Bot, Database, Zap, BarChart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <nav className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            OMNI AI
          </div>
          <Link 
            href="/dashboard"
            className="px-4 py-2 rounded-full bg-white text-black font-medium text-sm hover:bg-gray-200 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
            One AI system for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              every conversation.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
            Connect WhatsApp, Instagram, Gmail, and your website. Let OMNI AI handle customer queries, generate leads, and automate follow-ups.
          </p>
          <div className="flex justify-center pt-4">
            <Link 
              href="/dashboard"
              className="group flex items-center gap-2 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-lg transition-all"
            >
              Enter Dashboard 
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-32">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-6">
              <MessageSquare className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Unified Inbox</h3>
            <p className="text-gray-400">All your customer messages from every platform in one single, beautiful interface.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-6">
              <Bot className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-gray-400">Train the AI on your business knowledge to answer customer queries accurately 24/7.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-6">
              <Database className="w-6 h-6 text-cyan-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart CRM</h3>
            <p className="text-gray-400">Every conversation automatically becomes a tracked lead and customer profile.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
