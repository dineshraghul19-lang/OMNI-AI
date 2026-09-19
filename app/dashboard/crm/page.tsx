'use client';

import { Search, MoreHorizontal, Filter, Download } from 'lucide-react';
import { mockCustomers } from '@/lib/crm/mock';

export default function CRM() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">CRM & Leads</h1>
            <p className="text-gray-400 mt-1">Manage your customer relationships and lead pipeline.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
              Add Customer
            </button>
          </div>
        </div>

        <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-[#0A0A0A]">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search customers by name, email, or phone..." 
                className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white placeholder-gray-500 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-[#111] border border-white/10 rounded-lg text-sm font-medium hover:bg-white/5 transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-400 uppercase bg-[#0A0A0A] border-b border-white/10">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Contact</th>
                  <th className="px-6 py-4 font-medium">Source</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Last Contact</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{customer.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-300">{customer.email}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-300 capitalize">{customer.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        customer.status === 'Lead' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                        customer.status === 'Customer' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {customer.lastContact}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="p-4 border-t border-white/10 bg-[#0A0A0A] flex items-center justify-between text-sm text-gray-400">
            <span>Showing 1 to 4 of 4 entries</span>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 disabled:opacity-50">Prev</button>
              <button className="px-3 py-1 border border-white/10 rounded hover:bg-white/5 disabled:opacity-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
