'use client';

import { FileText, Link as LinkIcon, Plus, Trash2 } from 'lucide-react';

export default function KnowledgeBase() {
  const documents = [
    { id: '1', type: 'text', name: 'Business Hours & Location', size: '1.2 KB', updated: 'Today' },
    { id: '2', type: 'pdf', name: 'Service Menu 2024.pdf', size: '2.4 MB', updated: 'Yesterday' },
    { id: '3', type: 'url', name: 'https://example.com/faq', size: '-', updated: '3 days ago' },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Brain</h1>
            <p className="text-gray-400 mt-1">Train your AI with your business knowledge, menus, policies, and FAQs.</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" />
            Add Knowledge
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-[#111] border border-white/5 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="font-semibold mb-1">Text or PDF</h3>
            <p className="text-xs text-gray-400">Upload documents, menus, or paste plain text.</p>
          </div>
          <div className="p-6 bg-[#111] border border-white/5 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <LinkIcon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold mb-1">Website URL</h3>
            <p className="text-xs text-gray-400">Scrape FAQs or pricing directly from your site.</p>
          </div>
          <div className="p-6 bg-[#111] border border-white/5 rounded-2xl flex flex-col items-center text-center opacity-50 cursor-not-allowed">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-semibold mb-1">More Integrations</h3>
            <p className="text-xs text-gray-400">Notion, Google Drive (Coming soon)</p>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-[#0A0A0A]">
            <h3 className="font-medium">Active Knowledge Sources</h3>
          </div>
          <div className="divide-y divide-white/5">
            {documents.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    doc.type === 'pdf' ? 'bg-red-500/10 text-red-400' :
                    doc.type === 'url' ? 'bg-blue-500/10 text-blue-400' :
                    'bg-gray-500/10 text-gray-400'
                  }`}>
                    {doc.type === 'url' ? <LinkIcon className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{doc.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {doc.size !== '-' ? `${doc.size} • ` : ''} 
                      Last updated: {doc.updated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Synced
                  </span>
                  <button className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
