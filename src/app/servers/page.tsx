"use client";

import React, { useState, useEffect } from 'react';
import {
    Server,
    RefreshCw,
    Power,
    AlertCircle,
    CheckCircle2,
    LayoutDashboard,
    Users,
    MessageSquare,
    Bot,
    Settings,
    ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface ServerStatus {
    id: string;
    name: string;
    port: number;
    online: boolean;
}

export default function ServersMonitor() {
    const [servers, setServers] = useState<ServerStatus[]>([]);
    const [loading, setLoading] = useState(true);
    const [restarting, setRestarting] = useState<string | null>(null);

    const fetchStatuses = async () => {
        try {
            const res = await fetch('/api/servers');
            const data = await res.json();
            setServers(data);
        } catch (error) {
            console.error('Failed to fetch statuses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatuses();
        const interval = setInterval(fetchStatuses, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleRestart = async (id: string) => {
        setRestarting(id);
        try {
            await fetch('/api/servers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            // Give it time to restart
            setTimeout(fetchStatuses, 3000);
        } catch (error) {
            console.error('Failed to restart server:', error);
        } finally {
            setTimeout(() => setRestarting(null), 2000);
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border flex-col hidden md:flex glass">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Users size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Leads Manager</span>
                    </div>

                    <nav className="space-y-1">
                        {[
                            { icon: LayoutDashboard, label: 'Dashboard', active: false, href: '/' },
                            { icon: Users, label: 'Leads', active: false, href: '#' },
                            { icon: MessageSquare, label: 'Communications', active: false, href: '#' },
                            { icon: Bot, label: 'Robot Automation', active: false, href: '/automation' },
                            { icon: Server, label: 'Server Status', active: true, href: '/servers' },
                            { icon: Settings, label: 'Settings', active: false, href: '#' },
                        ].map((item, i) => (
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
                        ))}
                    </nav>
                </div>
            </aside>

            <main className="flex-1 p-8">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <Link href="/" className="flex items-center gap-2 text-primary hover:underline mb-2 transition-all">
                                <ArrowLeft size={16} />
                                <span>Volver al Dashboard</span>
                            </Link>
                            <h2 className="text-4xl font-bold tracking-tight">Monitor de Servidores</h2>
                            <p className="text-muted-foreground">Supervisa el estado y reinicia tus servicios locales.</p>
                        </div>
                        <button
                            onClick={fetchStatuses}
                            disabled={loading}
                            className="p-3 bg-muted rounded-full hover:bg-muted/80 transition-colors disabled:opacity-50"
                        >
                            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading && servers.length === 0 ? (
                            [1, 2].map((i) => (
                                <div key={i} className="h-64 rounded-3xl bg-muted/20 animate-pulse border border-border" />
                            ))
                        ) : (
                            servers.map((server) => (
                                <motion.div
                                    layout
                                    key={server.id}
                                    className="p-8 rounded-3xl bg-card border border-border/50 shadow-xl shadow-black/5 relative overflow-hidden group"
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 rounded-full blur-3xl opacity-20 ${server.online ? 'bg-emerald-500' : 'bg-destructive'}`} />

                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`p-4 rounded-2xl ${server.online ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                                            <Server size={32} />
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${server.online
                                                    ? 'bg-emerald-500/10 text-emerald-500'
                                                    : 'bg-destructive/10 text-destructive'
                                                }`}>
                                                {server.online ? <CheckCircle2 size={12} /> : <AlertCircle size={12} />}
                                                {server.online ? 'Online' : 'Offline'}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-2 font-mono">Puerto: {server.port}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-1 mb-8">
                                        <h3 className="text-2xl font-bold">{server.name}</h3>
                                        <p className="text-sm text-muted-foreground">ID: {server.id}</p>
                                    </div>

                                    <button
                                        onClick={() => handleRestart(server.id)}
                                        disabled={restarting === server.id}
                                        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-95 ${restarting === server.id
                                                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                                                : 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90'
                                            }`}
                                    >
                                        <Power size={20} className={restarting === server.id ? 'animate-pulse' : ''} />
                                        {restarting === server.id ? 'Reiniciando...' : 'Reiniciar Servidor'}
                                    </button>
                                </motion.div>
                            ))
                        )}
                    </div>

                    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex items-center gap-6">
                        <div className="p-4 bg-primary/10 rounded-full text-primary">
                            <AlertCircle size={32} />
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">Nota de Seguridad</h4>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                Este panel utiliza comandos del sistema para gestionar procesos locales. Asegúrate de que no haya otros servicios críticos en los mismos puertos. Si el Leads Manager se detiene por completo, deberás iniciarlo manualmente desde la terminal.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
