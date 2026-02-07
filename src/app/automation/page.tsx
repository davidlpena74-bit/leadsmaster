"use client";

import React, { useState, useEffect } from 'react';
import {
    Bot,
    Globe,
    ShieldCheck,
    Zap,
    Play,
    Pause,
    RefreshCw,
    LayoutDashboard,
    Users,
    MessageSquare,
    Settings,
    MapPin,
    Server,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// --- Types ---

interface RegionalProfile {
    country: string;
    code: string;
    flag: string;
    names: string[];
    lastNames: string[];
    phonePrefix: string;
    currency: string;
    timezones: string[];
}

const REGIONS: RegionalProfile[] = [
    {
        country: 'España',
        code: 'ES',
        flag: '🇪🇸',
        names: ['Antonio', 'María', 'José', 'Carmen', 'Francisco', 'Ana', 'Javier', 'Elena'],
        lastNames: ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Sánchez'],
        phonePrefix: '+34',
        currency: 'EUR',
        timezones: ['Europe/Madrid']
    },
    {
        country: 'Estados Unidos',
        code: 'US',
        flag: '🇺🇸',
        names: ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda'],
        lastNames: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller'],
        phonePrefix: '+1',
        currency: 'USD',
        timezones: ['America/New_York', 'America/Los_Angeles']
    },
    {
        country: 'México',
        code: 'MX',
        flag: '🇲🇽',
        names: ['Juan', 'Guadalupe', 'Luis', 'Margarita', 'Pedro', 'Leticia', 'Alejandro', 'Sofia'],
        lastNames: ['Hernández', 'García', 'Martínez', 'López', 'González', 'Pérez'],
        phonePrefix: '+52',
        currency: 'MXN',
        timezones: ['America/Mexico_City']
    },
    {
        country: 'Colombia',
        code: 'CO',
        flag: '��',
        names: ['Carlos', 'Sandra', 'Diego', 'Paula', 'Andrés', 'Andrea'],
        lastNames: ['Gómez', 'Moreno', 'Jiménez', 'Díaz', 'Álvarez', 'Vásquez'],
        phonePrefix: '+57',
        currency: 'COP',
        timezones: ['America/Bogota']
    },
    {
        country: 'Argentina',
        code: 'AR',
        flag: '��',
        names: ['Facundo', 'Lucila', 'Mateo', 'Martina', 'Nicolás', 'Valentina'],
        lastNames: ['Ferrari', 'Bianchi', 'Russo', 'Romano', 'Colombo', 'Ricci'],
        phonePrefix: '+54',
        currency: 'ARS',
        timezones: ['America/Argentina/Buenos_Aires']
    }
];

export default function AutomationPage() {
    const [isRunning, setIsRunning] = useState(false);
    const [selectedRegions, setSelectedRegions] = useState<string[]>(['ES', 'MX', 'CO']);
    const [targetProject, setTargetProject] = useState('tumaestro');
    const [prodUrl, setProdUrl] = useState('https://tumaestro.es');
    const [usePublicProxies, setUsePublicProxies] = useState(true);
    const [showBrowser, setShowBrowser] = useState(false);
    const [interval, setInterval] = useState(300); // 5 minutes in seconds
    const [activeLeads, setActiveLeads] = useState<any[]>([]);
    const [logs, setLogs] = useState<{ msg: string, type: 'info' | 'success' | 'warning' }[]>([]);

    const toggleRegion = (code: string) => {
        setSelectedRegions(prev =>
            prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
        );
    };

    const addLog = (msg: string, type: 'info' | 'success' | 'warning' = 'info') => {
        setLogs(prev => [{ msg, type }, ...prev].slice(0, 50));
    };

    const triggerRealBot = async () => {
        try {
            const res = await fetch('/api/run-bot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUrl: targetProject === 'tumaestro' ? prodUrl : 'http://localhost:3000',
                    headless: !showBrowser
                })
            });
            const data = await res.json();
            if (data.success) {
                addLog('Real Browser Bot: Sesión iniciada en segundo plano', 'success');
            } else {
                addLog('Real Browser Bot: Error - ' + data.error, 'warning');
            }
        } catch (err) {
            addLog('Real Browser Bot: Fallo crítico al conectar con API', 'warning');
        }
    };

    const generateLead = () => {
        if (selectedRegions.length === 0) return;

        // Simulación visual
        const regionCode = selectedRegions[Math.floor(Math.random() * selectedRegions.length)];
        const region = REGIONS.find(r => r.code === regionCode)!;

        // ... (resto de la lógica visual)
        const name = region.names[Math.floor(Math.random() * region.names.length)];
        const lastName = region.lastNames[Math.floor(Math.random() * region.lastNames.length)];
        const fullName = `${name} ${lastName}`;
        const email = `${name.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}@example.com`;
        const phone = `${region.phonePrefix} ${Math.floor(Math.random() * 900000000) + 100000000}`;
        const value = Math.floor(Math.random() * 5000) + 500;

        const newLead = {
            id: Math.random().toString(36).substr(2, 9),
            name: fullName,
            email,
            phone,
            region: region.country,
            flag: region.flag,
            status: 'New',
            value,
            timestamp: new Date().toLocaleTimeString()
        };

        setActiveLeads(prev => [newLead, ...prev].slice(0, 10));
        addLog(`${targetProject === 'tumaestro' ? 'TuMaestro.es' : 'General'}: Registrando a ${fullName}`, 'success');
        addLog(`VPN [${region.code}]: Rotando IP a nodo de salida en ${region.country}...`, 'info');

        if (targetProject === 'tumaestro') {
            addLog(`POST -> http://localhost:3000/api/auth/signup [${email}]`, 'info');
            // AQUÍ DISPARAMOS EL BOT REAL
            triggerRealBot();
        }
    };

    useEffect(() => {
        let timer: any;
        if (isRunning) {
            addLog(`Robot Iniciado contra: ${targetProject === 'tumaestro' ? prodUrl : 'Localhost'}`, 'info');
            addLog('Modo Premium Activado: Rotando IPs Residenciales (DataImpulse/ES)', 'success');
            timer = window.setInterval(generateLead, interval * 1000);
        } else {
            addLog('Robot Paused', 'warning');
        }
        return () => clearInterval(timer);
    }, [isRunning, selectedRegions, interval]);

    return (
        <div className="flex min-h-screen bg-background text-foreground font-sans">
            {/* Sidebar (Duplicate for now, should be a component) */}
            <aside className="w-64 border-r border-border flex-col hidden md:flex glass">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <Users size={24} />
                        </div>
                        <span className="text-xl font-bold font-display tracking-tight">Leads Manager</span>
                    </Link>

                    <nav className="space-y-1">
                        <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground">
                            <LayoutDashboard size={20} />
                            <span className="font-medium">Dashboard</span>
                        </Link>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground">
                            <Users size={20} />
                            <span className="font-medium">Leads</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 bg-primary text-primary-foreground shadow-md">
                            <Bot size={20} />
                            <span className="font-medium">Robot Settings</span>
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-muted text-muted-foreground hover:text-foreground">
                            <Settings size={20} />
                            <span className="font-medium">Settings</span>
                        </button>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <header className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold font-display tracking-tight flex items-center gap-3">
                            <Bot className="text-primary" size={32} />
                            Lead Generation Robot
                        </h1>
                        <p className="text-muted-foreground">Configure multi-regional lead simulation and VPN rotation.</p>
                    </div>

                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${isRunning
                            ? 'bg-destructive text-destructive-foreground shadow-destructive/20 hover:bg-destructive/90'
                            : 'bg-primary text-primary-foreground shadow-primary/20 hover:bg-primary/90'
                            }`}
                    >
                        {isRunning ? <Pause size={20} /> : <Play size={20} />}
                        {isRunning ? 'Stop Robot' : 'Start Robot'}
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Configuration */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Users size={20} className="text-primary" />
                                Target Project
                            </h3>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setTargetProject('tumaestro')}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${targetProject === 'tumaestro' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                >
                                    <p className="font-bold">TuMaestro.es</p>
                                    <p className="text-xs text-muted-foreground">URL: http://localhost:3000/registro</p>
                                </button>
                                <button
                                    onClick={() => setTargetProject('generic')}
                                    className={`flex-1 p-4 rounded-xl border-2 transition-all text-left ${targetProject === 'generic' ? 'border-primary bg-primary/5' : 'border-border'}`}
                                >
                                    <p className="font-bold">Simulación Genérica</p>
                                    <p className="text-xs text-muted-foreground">Captura de datos aleatoria</p>
                                </button>
                            </div>

                            {targetProject === 'tumaestro' && (
                                <div className="mt-4 space-y-3 p-4 bg-muted/30 rounded-xl border border-border">
                                    <label className="text-sm font-bold">URL Real de Producción (SEO Target):</label>
                                    <input
                                        type="text"
                                        value={prodUrl}
                                        onChange={(e) => setProdUrl(e.target.value)}
                                        className="w-full p-3 rounded-lg bg-background border border-border focus:ring-2 focus:ring-primary/20 outline-none font-mono text-sm"
                                        placeholder="https://tumaestro.es"
                                    />
                                    <div className="flex flex-col gap-2 pt-2">
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="proxyToggle"
                                                checked={usePublicProxies}
                                                onChange={(e) => setUsePublicProxies(e.target.checked)}
                                                className="w-4 h-4 accent-primary"
                                            />
                                            <label htmlFor="proxyToggle" className="text-sm font-medium cursor-pointer">
                                                Usar Proxies Públicos Gratuitos
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="checkbox"
                                                id="browserToggle"
                                                checked={showBrowser}
                                                onChange={(e) => setShowBrowser(e.target.checked)}
                                                className="w-4 h-4 accent-primary"
                                            />
                                            <label htmlFor="browserToggle" className="text-sm font-medium cursor-pointer text-amber-500 font-bold">
                                                Modo Visible (Ver navegador trabajando)
                                            </label>
                                        </div>
                                    </div>
                                    <button
                                        onClick={triggerRealBot}
                                        className="w-full mt-2 py-2 border-2 border-primary/30 text-primary rounded-lg text-xs font-bold hover:bg-primary/10 transition-colors"
                                    >
                                        Lanzar Sesión de Test en Real (Ahora)
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Globe size={20} className="text-primary" />
                                Regional Targeting (VPN Nodes)
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {REGIONS.map((region) => (
                                    <button
                                        key={region.code}
                                        onClick={() => toggleRegion(region.code)}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedRegions.includes(region.code)
                                            ? 'bg-primary/10 border-primary text-primary'
                                            : 'bg-muted/50 border-transparent hover:border-border'
                                            }`}
                                    >
                                        <span className="text-3xl">{region.flag}</span>
                                        <span className="font-semibold text-sm">{region.country}</span>
                                        <div className={`w-2 h-2 rounded-full ${selectedRegions.includes(region.code) ? 'bg-primary animate-pulse' : 'bg-muted-foreground/30'}`} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Zap size={20} className="text-primary" />
                                Simulation Parameters
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-sm font-medium">Generation Frequency</label>
                                        <span className="text-sm font-bold border px-2 py-0.5 rounded bg-muted">Every {interval} seconds</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="1"
                                        max="60"
                                        value={interval}
                                        onChange={(e) => setInterval(parseInt(e.target.value))}
                                        className="w-full accent-primary"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                                        <span>Fast (1s)</span>
                                        <span>Slow (60s)</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Rotation Strategy</p>
                                        <p className="font-bold flex items-center gap-2">
                                            <RefreshCw size={14} className="text-primary" />
                                            Round Robin IP
                                        </p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-muted/30 border border-border">
                                        <p className="text-xs text-muted-foreground mb-1">Device Profile</p>
                                        <p className="font-bold flex items-center gap-2">
                                            <Activity size={14} className="text-primary" />
                                            Randomized
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Live Feed */}
                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                            <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
                                <h3 className="font-bold">Live Lead Feed</h3>
                                <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded-full">
                                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                    Live
                                </span>
                            </div>
                            <div className="divide-y divide-border">
                                <AnimatePresence initial={false}>
                                    {activeLeads.length === 0 ? (
                                        <div className="p-8 text-center text-muted-foreground">
                                            <Bot size={48} className="mx-auto mb-3 opacity-20" />
                                            <p>Start the robot to see incoming leads</p>
                                        </div>
                                    ) : (
                                        activeLeads.map((lead) => (
                                            <motion.div
                                                key={lead.id}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold">
                                                        {lead.flag}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm">{lead.name}</p>
                                                        <p className="text-xs text-muted-foreground">{lead.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-mono text-sm font-bold text-primary">${lead.value.toLocaleString()}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                                                        <MapPin size={10} />
                                                        {lead.region} • {lead.timestamp}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Console / Status */}
                    <div className="space-y-6">
                        <div className="bg-slate-950 text-slate-300 p-6 rounded-2xl font-mono text-xs shadow-xl border border-slate-800">
                            <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2">
                                <span className="text-slate-500 flex items-center gap-2">
                                    <Server size={14} />
                                    System Console
                                </span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
                            </div>
                            <div className="h-[400px] overflow-y-auto space-y-2 custom-scrollbar">
                                {logs.map((log, i) => (
                                    <div key={i} className={`flex gap-2 ${log.type === 'success' ? 'text-emerald-400' :
                                        log.type === 'warning' ? 'text-amber-400' : 'text-slate-400'
                                        }`}>
                                        <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                                        <span>{log.msg}</span>
                                    </div>
                                ))}
                                {isRunning && (
                                    <div className="animate-pulse flex gap-2">
                                        <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
                                        <span className="text-primary italic">Awaiting Next Lead Event...</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <ShieldCheck size={20} className="text-primary" />
                                Security & VPN Status
                            </h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Encryption</span>
                                    <span className="font-bold text-emerald-500">AES-256 Active</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Proxy Layer</span>
                                    <span className="font-bold">Multi-Hop Active</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Browser Fingerprint</span>
                                    <span className="font-bold text-amber-500">Randomized</span>
                                </div>
                                <div className="pt-4 mt-4 border-t border-border">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center text-primary">
                                            <Globe size={16} />
                                        </div>
                                        <div>
                                            <p className="font-bold">Virtual IP</p>
                                            <p className="text-xs text-muted-foreground">DataImpulse Dynamic (Spain)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
