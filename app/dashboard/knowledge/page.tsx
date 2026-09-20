'use client';

import { FileText, Link as LinkIcon, Plus, Trash2, CheckCircle2, UploadCloud } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import SetupRequired from '@/components/SetupRequired';

const BUSINESS_ID = 'd1b7d59b-134e-4f10-8646-6b2c2eb949b2'; // Demo Business

type KnowledgeDocument = {
  id: string;
  content: string;
  source_type: string;
  source_name: string;
  created_at: string;
};

export default function KnowledgeBase() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [setupRequired, setSetupRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadType, setUploadType] = useState<'text' | 'url' | 'pdf'>('text');
  
  const [newContent, setNewContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [adding, setAdding] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('business_id', BUSINESS_ID)
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01' || error.message?.includes("Could not find the table") || error.message?.includes("does not exist")) {
          setSetupRequired(true);
          return;
        }
        console.error("Error fetching knowledge base:", error);
        setLoading(false);
        return;
      }

      if (data) {
        setDocuments(data as KnowledgeDocument[]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (uploadType === 'text' && !newContent.trim()) return;
    if (uploadType === 'url' && !newContent.trim()) return;
    if (uploadType === 'pdf' && !file) return;

    setAdding(true);
    
    try {
      const formData = new FormData();
      formData.append('businessId', BUSINESS_ID);
      formData.append('type', uploadType);
      
      if (uploadType === 'pdf' && file) {
        formData.append('file', file);
      } else {
        formData.append('content', newContent);
      }

      const response = await fetch('/api/knowledge/ingest', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to ingest knowledge');
      }

      await fetchDocs();
      setShowAddModal(false);
      setNewContent('');
      setFile(null);
    } catch (error: any) {
      console.error(error);
      alert(error.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDocuments(docs => docs.filter(d => d.id !== id));
    await supabase.from('knowledge_base').delete().eq('id', id);
  };

  if (setupRequired) {
    return <SetupRequired />;
  }

  const openModal = (type: 'text' | 'url' | 'pdf') => {
    setUploadType(type);
    setNewContent('');
    setFile(null);
    setShowAddModal(true);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Business Brain</h1>
            <p className="text-gray-400 mt-1">Train your AI with your business knowledge, menus, policies, and FAQs.</p>
          </div>
          <button 
            onClick={() => openModal('text')}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Knowledge
          </button>
        </div>

        {showAddModal && (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl relative animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex gap-4 mb-6 border-b border-white/10 pb-2">
              <button onClick={() => setUploadType('text')} className={`text-sm font-medium pb-2 border-b-2 transition-colors ${uploadType === 'text' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Text</button>
              <button onClick={() => setUploadType('url')} className={`text-sm font-medium pb-2 border-b-2 transition-colors ${uploadType === 'url' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>Website URL</button>
              <button onClick={() => setUploadType('pdf')} className={`text-sm font-medium pb-2 border-b-2 transition-colors ${uploadType === 'pdf' ? 'border-indigo-500 text-white' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>PDF Upload</button>
            </div>

            {uploadType === 'text' && (
              <textarea 
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="Paste text here (e.g. 'Our store hours are 9 AM to 5 PM Mon-Fri.')"
                className="w-full h-32 bg-black border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none mb-4"
              />
            )}
            {uploadType === 'url' && (
              <input 
                type="url"
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="https://example.com/faq"
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors mb-4"
              />
            )}
            {uploadType === 'pdf' && (
              <div className="w-full h-32 bg-black border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center mb-4 relative overflow-hidden">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {file ? (
                  <div className="text-center">
                    <FileText className="w-8 h-8 text-indigo-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-white">{file.name}</p>
                    <p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <UploadCloud className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-300">Click or drag PDF to upload</p>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAdd}
                disabled={adding || (uploadType === 'pdf' ? !file : !newContent.trim())}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {adding ? 'Extracting & Training...' : 'Save & Train AI'}
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <div onClick={() => openModal('pdf')} className="p-6 bg-[#111] border border-white/5 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="font-semibold mb-1">Text or PDF</h3>
            <p className="text-xs text-gray-400">Upload documents, menus, or paste plain text.</p>
          </div>
          <div onClick={() => openModal('url')} className="p-6 bg-[#111] border border-white/5 rounded-2xl flex flex-col items-center text-center hover:bg-white/5 transition-colors cursor-pointer group">
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
          <div className="p-4 border-b border-white/10 bg-[#0A0A0A] flex justify-between items-center">
            <h3 className="font-medium">Active Knowledge Sources</h3>
            <span className="text-xs text-gray-500">{documents.length} chunks synced</span>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
               <div className="p-8 text-center text-sm text-gray-500">Loading knowledge base...</div>
            ) : documents.length === 0 ? (
               <div className="p-8 text-center text-sm text-gray-500">No knowledge added yet. Click "Add Knowledge" to train your AI.</div>
            ) : documents.map((doc) => (
              <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-500/10 text-gray-400 flex items-center justify-center">
                    {doc.source_type === 'url' ? <LinkIcon className="w-5 h-5 text-blue-400" /> : <FileText className="w-5 h-5 text-indigo-400" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm line-clamp-1">{doc.source_name || doc.source_type}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {doc.content.substring(0, 100)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 pl-4">
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Synced
                  </span>
                  <button 
                    onClick={() => handleDelete(doc.id)}
                    className="p-2 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded-lg transition-colors"
                    title="Delete"
                  >
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
