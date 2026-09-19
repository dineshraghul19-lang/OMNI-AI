'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Inbox, 
  Users, 
  Brain, 
  Zap, 
  Settings, 
  LayoutDashboard,
  LogOut,
  Plug
} from 'lucide-react';
import clsx from 'clsx';

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inbox', href: '/dashboard/inbox', icon: Inbox },
  { name: 'CRM & Leads', href: '/dashboard/crm', icon: Users },
  { name: 'Integrations', href: '/dashboard/integrations', icon: Plug },
  { name: 'Knowledge Base', href: '/dashboard/knowledge', icon: Brain },
  { name: 'Automation', href: '/dashboard/automation', icon: Zap },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-black flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="w-7 h-7 rounded bg-indigo-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            OMNI AI
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium',
                  isActive 
                    ? 'bg-indigo-500/10 text-indigo-400' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <item.icon className={clsx("w-5 h-5", isActive ? 'text-indigo-400' : 'text-gray-500')} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg transition-colors text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5">
            <LogOut className="w-5 h-5 text-gray-500" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
