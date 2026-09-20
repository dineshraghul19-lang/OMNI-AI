'use client';

import { Zap, Plus, ArrowRight, Play, Pause, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const BUSINESS_ID = 'd1b7d59b-134e-4f10-8646-6b2c2eb949b2';

type Automation = {
  id: string;
  name: string;
  trigger_text: string;
  action_text: string;
  active: boolean;
};

export default function Automation() {
  const supabase = createClient();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState('');
  const [newTrigger, setNewTrigger] = useState('');
  const [newAction, setNewAction] = useState('');

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('automations')
      .select('*')
      .eq('business_id', BUSINESS_ID)
      .order('created_at', { ascending: true });
    if (data) setAutomations(data as Automation[]);
    setLoading(false);
  };

  const handleToggle = async (automation: Automation) => {
    const newActive = !automation.active;
    setAutomations(prev => prev.map(a => a.id === automation.id ? { ...a, active: newActive } : a));
    await supabase.from('automations').update({ active: newActive }).eq('id', automation.id);
  };

  const handleDelete = async (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
    await supabase.from('automations').delete().eq('id', id);
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newTrigger.trim() || !newAction.trim()) return;
    setSaving(true);
    const { data, error } = await supabase
      .from('automations')
      .insert({
        business_id: BUSINESS_ID,
        name: newName,
        trigger_text: newTrigger,
        action_text: newAction,
        active: true,
      })
      .select()
      .single();

    if (!error && data) {
      setAutomations(prev => [...prev, data as Automation]);
      setShowForm(false);
      setNewName(''); setNewTrigger(''); setNewAction('');
    }
    setSaving(false);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#0A0A0A] p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Automations & Workflows</h1>
            <p className="text-gray-400">Design smart IF/THEN rules for your AI to follow automatically.</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" />
            New Workflow
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-[#111] border border-indigo-500/30 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200">
            <h3 className="font-semibold text-lg">Create New Workflow</h3>
            <input
              placeholder="Workflow Name (e.g. 'Urgent Support Routing')"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 mb-2 block font-medium uppercase tracking-wider">IF (Trigger)</label>
                <textarea
                  placeholder="e.g. Customer mentions 'refund' or 'broken'"
                  value={newTrigger}
                  onChange={e => setNewTrigger(e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-2 block font-medium uppercase tracking-wider">THEN (Action)</label>
                <textarea
                  placeholder="e.g. Tag conversation as 'Urgent' and notify human agent"
                  value={newAction}
                  onChange={e => setNewAction(e.target.value)}
                  rows={3}
                  className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowForm(false)} className="px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors">Cancel</button>
              <button
                onClick={handleCreate}
                disabled={saving || !newName.trim() || !newTrigger.trim() || !newAction.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Create Workflow'}
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mr-3" /> Loading automations...
          </div>
        ) : automations.length === 0 ? (
          <div className="mt-4 p-8 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center bg-[#111]/50">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Workflows Yet</h3>
            <p className="text-gray-400 max-w-md mx-auto mb-6">Create your first automation to handle repetitive customer scenarios automatically.</p>
            <button onClick={() => setShowForm(true)} className="bg-white text-black px-6 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition-colors">
              Create First Workflow
            </button>
          </div>
        ) : (
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
                    <button
                      onClick={() => handleToggle(automation)}
                      title={automation.active ? 'Pause' : 'Activate'}
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      {automation.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleDelete(automation.id)}
                      title="Delete"
                      className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-black/50 rounded-lg p-4 flex items-center gap-4 text-sm border border-white/5">
                  <div className="flex-1">
                    <span className="text-gray-500 font-medium uppercase text-xs tracking-wider block mb-1">If</span>
                    <span className="text-white">{automation.trigger_text}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 shrink-0" />
                  <div className="flex-1">
                    <span className="text-gray-500 font-medium uppercase text-xs tracking-wider block mb-1">Then</span>
                    <span className="text-indigo-300">{automation.action_text}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
