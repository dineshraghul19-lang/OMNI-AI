'use client';

import { Zap, Plus, ArrowRight, Play, Settings2 } from 'lucide-react';

const automations = [
  {
    id: 1,
    name: "Urgent Support Routing",
    trigger: "Customer mentions 'refund', 'broken', or 'lawyer'",
    action: "Tag conversation as 'Urgent' and assign to Human Agent",
    active: true,
  },
  {
    id: 2,
    name: "Lead Qualification",
    trigger: "Customer asks about pricing or Enterprise plans",
    action: "Send Calendly link and tag as 'Warm Lead'",
    active: true,
  },
  {
    id: 3,
    name: "Out of Office Auto-Reply",
    trigger: "Outside of business hours (9AM-5PM EST)",
    action: "Reply: 'We are currently offline but our AI will try to help you...'",
    active: false,
  }
];

export default function Automation() {
  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0A] p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Automations & Workflows</h1>
            <p className="text-gray-400">Design smart IF/THEN rules for your AI to follow automatically.</p>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20">
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>

        <div className="grid gap-4">
          {automations.map((automation) => (
            <div key={automation.id} className="bg-[#111] border border-white/10 rounded-xl p-6 transition-all hover:border-white/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${automation.active ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-800 text-gray-500'}`}>
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-lg">{automation.name}</h3>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${automation.active ? 'bg-green-500' : 'bg-gray-600'}`} />
                      {automation.active ? 'Active' : 'Paused'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Play className="w-4 h-4" />
                  </button>
                  <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                    <Settings2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-4 flex items-center gap-4 text-sm border border-white/5">
                <div className="flex-1">
                  <span className="text-gray-500 font-medium uppercase text-xs tracking-wider block mb-1">If</span>
                  <span className="text-white">{automation.trigger}</span>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-600 shrink-0" />
                <div className="flex-1">
                  <span className="text-gray-500 font-medium uppercase text-xs tracking-wider block mb-1">Then</span>
                  <span className="text-indigo-300">{automation.action}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Builder Preview */}
        <div className="mt-12 p-8 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center bg-[#111]/50">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-gray-500" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Build a New Rule</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            Connect channels, trigger AI insights, or route customers to human agents using our visual workflow builder.
          </p>
          <button className="bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
            Open Workflow Builder
          </button>
        </div>

      </div>
    </div>
  );
}
