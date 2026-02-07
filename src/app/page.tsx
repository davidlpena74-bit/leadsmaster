"use client";

import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  MoreVertical,
  Filter,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Bell,
  ArrowUpRight,
  ArrowDownRight,
  Mail,
  Phone,
  Calendar,
  ChevronRight,
  Bot,
  Server
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { StatusBadge } from '../components/StatusBadge';

// --- Types ---

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Closed';
  source: string;
  date: string;
  value: number;
}

// --- Mock Data ---

const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Alex Rivera', email: 'alex@example.com', phone: '+34 600 123 456', status: 'New', source: 'Website', date: '2024-02-04', value: 1200 },
  { id: '2', name: 'Marta Soler', email: 'marta@tech.io', phone: '+34 611 222 333', status: 'Qualified', source: 'LinkedIn', date: '2024-02-03', value: 3500 },
  { id: '3', name: 'Julian Casablancas', email: 'julian@strokes.com', phone: '+34 622 333 444', status: 'Contacted', source: 'Referral', date: '2024-02-02', value: 800 },
  { id: '4', name: 'Elena Gilbert', email: 'elena@mystic.com', phone: '+34 633 444 555', status: 'Proposal', source: 'Google Ads', date: '2024-02-01', value: 5000 },
  { id: '5', name: 'Victor Nikiforov', email: 'victor@skate.jp', phone: '+34 644 555 666', status: 'Closed', source: 'Direct', date: '2024-01-30', value: 2100 },
  { id: '6', name: 'Sarah Connor', email: 'sarah@resistance.org', phone: '+34 655 666 777', status: 'Contacted', source: 'Website', date: '2024-01-29', value: 1500 },
];

const STATS = [
  { label: 'Total Leads', value: '1,284', change: '+12.5%', icon: Users, positive: true },
  { label: 'Conversion Rate', value: '24.2%', change: '+3.1%', icon: ArrowUpRight, positive: true },
  { label: 'Avg. Value', value: '€2,450', change: '-2.4%', icon: ArrowDownRight, positive: false },
  { label: 'Pending Proposals', value: '42', change: '+8', icon: MessageSquare, positive: true },
];

// --- Components ---

export default function LeadsDashboard() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeads = MOCK_LEADS.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border flex-col hidden md:flex glass">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Users size={24} />
            </div>
            <span className="text-xl font-bold font-display tracking-tight">Leads Manager</span>
          </div>

          <nav className="space-y-1">
            {[
              { icon: LayoutDashboard, label: 'Dashboard', active: true, href: '/' },
              { icon: Users, label: 'Leads', active: false, href: '#' },
              { icon: MessageSquare, label: 'Communications', active: false, href: '#' },
              { icon: Bot, label: 'Robot Automation', active: false, href: '/automation' },
              { icon: Settings, label: 'Settings', active: false, href: '#' },
            ].map((item, i) => (
              item.href !== '#' ? (
                <Link
                  key={i}
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${item.active
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ) : (
                <button
                  key={i}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${item.active
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              )
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-transparent border border-primary/20">
            <p className="text-sm font-medium mb-2">Upgrade to Pro</p>
            <p className="text-xs text-muted-foreground mb-4">Get advanced analytics and automation.</p>
            <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
              Upgrade
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-20 border-b border-border flex items-center justify-between px-8 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <div className="relative w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search leads, emails..."
              className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
            </button>
            <div className="h-8 w-[1px] bg-border mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right">
                <p className="text-sm font-semibold group-hover:text-primary transition-colors">David Adams</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-muted border-2 border-border group-hover:border-primary transition-colors" />
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Welcome & Stats */}
          <div className="space-y-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold font-display tracking-tight">Dashboard Overview</h2>
                <p className="text-muted-foreground">Monitor your performance and leads today.</p>
              </div>
              <button className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                <UserPlus size={18} />
                <span>Add New Lead</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {STATS.map((stat, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className="p-6 rounded-2xl bg-card border border-border hover:shadow-xl hover:shadow-primary/5 transition-all group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-xl bg-muted text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <stat.icon size={20} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${stat.positive ? 'text-emerald-500 bg-emerald-500/10' : 'text-destructive bg-destructive/10'
                      }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
              <h3 className="font-bold text-lg">Recent Leads</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border">
                  <Filter size={18} />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors border border-transparent hover:border-border">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/10">
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Lead Info</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Value</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Source</th>
                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <AnimatePresence>
                    {filteredLeads.map((lead, i) => (
                      <motion.tr
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={lead.id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold text-sm">
                              {lead.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="font-semibold">{lead.name}</p>
                              <p className="text-xs text-muted-foreground">{lead.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-mono text-sm font-medium" suppressHydrationWarning>€{lead.value.toLocaleString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-muted-foreground">{lead.source}</span>
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                          {lead.date}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                            <ChevronRight size={18} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-border bg-muted/5 flex items-center justify-between text-sm text-muted-foreground">
              <p>Showing {filteredLeads.length} of {MOCK_LEADS.length} leads</p>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted disabled:opacity-50 transition-colors" disabled>Previous</button>
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">Next</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
