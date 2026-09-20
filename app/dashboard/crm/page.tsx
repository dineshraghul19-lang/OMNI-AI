'use client';

import { Search, MoreHorizontal, Filter, Download, UserPlus, Loader2, X } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import SetupRequired from '@/components/SetupRequired';

const BUSINESS_ID = 'd1b7d59b-134e-4f10-8646-6b2c2eb949b2';

type CustomerData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  identifier: string;
  created_at: string;
  leads?: { status: string }[];
};

const PAGE_SIZE = 10;

export default function CRM() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [setupRequired, setSetupRequired] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addName, setAddName] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const [addPhone, setAddPhone] = useState('');
  const [addingSaving, setAddingSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const { data, error } = await supabase
          .from('customers')
          .select(`id, name, email, phone, identifier, created_at, leads ( status )`)
          .eq('business_id', BUSINESS_ID)
          .order('created_at', { ascending: false });

        if (error) {
          if (error.code === '42P01' || error.message?.includes('Could not find the table')) {
            setSetupRequired(true);
            return;
          }
          console.error('Error fetching customers:', error);
          setLoading(false);
          return;
        }

        if (data) setCustomers(data as CustomerData[]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [supabase]);

  // Live client-side search filter
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return customers;
    return customers.filter(c =>
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.identifier || '').toLowerCase().includes(q)
    );
  }, [customers, searchQuery]);

  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  // CSV Export
  const handleExport = () => {
    const rows = [['Name', 'Email', 'Phone', 'Identifier', 'Status', 'Joined']];
    filtered.forEach(c => {
      const status = c.leads?.[0]?.status || 'Customer';
      rows.push([
        c.name || 'Anonymous',
        c.email || '',
        c.phone || '',
        c.identifier,
        status,
        new Date(c.created_at).toLocaleDateString(),
      ]);
    });
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'omni-ai-customers.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Add Customer
  const handleAddCustomer = async () => {
    if (!addName.trim()) return;
    setAddingSaving(true);
    const { data, error } = await supabase
      .from('customers')
      .insert({
        business_id: BUSINESS_ID,
        name: addName,
        email: addEmail || null,
        phone: addPhone || null,
        identifier: `manual-${Date.now()}`,
      })
      .select(`id, name, email, phone, identifier, created_at, leads ( status )`)
      .single();

    if (!error && data) {
      setCustomers(prev => [data as CustomerData, ...prev]);
      setShowAddModal(false);
      setAddName(''); setAddEmail(''); setAddPhone('');
    }
    setAddingSaving(false);
  };

  if (setupRequired) return <SetupRequired />;

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CRM & Leads</h1>
            <p className="text-gray-400 mt-1">Manage your customer relationships and lead pipeline.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Add Customer
            </button>
          </div>
        </div>

        {/* Add Customer Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Add New Customer</h3>
                <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors"><X className="w-4 h-4 text-gray-400" /></button>
              </div>
              <input placeholder="Full Name *" value={addName} onChange={e => setAddName(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
              <input placeholder="Email Address" value={addEmail} onChange={e => setAddEmail(e.target.value)} type="email"
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
              <input placeholder="Phone Number" value={addPhone} onChange={e => setAddPhone(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleAddCustomer} disabled={addingSaving || !addName.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  {addingSaving ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : 'Add Customer'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden flex flex-col min-h-[400px]">
          {/* Toolbar */}
          <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-[#0A0A0A]">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
                placeholder="Search by name, email, phone..."
                className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 transition-colors"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-[#0A0A0A] border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-5 h-5 animate-spin inline mr-2" />Loading customers...</td></tr>
                ) : paginated.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    {searchQuery ? `No customers match "${searchQuery}"` : 'No customers found. They will appear here when they message you.'}
                  </td></tr>
                ) : paginated.map((customer) => {
                  const status = customer.leads?.[0]?.status || 'Customer';
                  return (
                    <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{customer.name || 'Anonymous User'}</div>
                        <div className="text-gray-500 text-xs mt-0.5 font-mono truncate max-w-[200px]">{customer.identifier}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">{customer.email || '-'}</div>
                        <div className="text-gray-500 text-xs mt-0.5">{customer.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                          status === 'new' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                          status === 'Customer' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        }`}>
                          {status === 'new' ? 'Lead' : status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-400">{new Date(customer.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-4 border-t border-white/10 bg-[#0A0A0A] flex items-center justify-between text-sm text-gray-400">
            <span>Showing {filtered.length === 0 ? 0 : page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length} entries</span>
            <div className="flex gap-2">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 disabled:opacity-40 transition-colors">Prev</button>
              <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 disabled:opacity-40 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
