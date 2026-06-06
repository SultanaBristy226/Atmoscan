'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Wind, TrendingUp, AlertTriangle, CheckCircle,
  Clock, Wifi, WifiOff, RefreshCw, Bell,
  Home, BarChart3, Settings, HelpCircle,
  Menu, X, Gauge, Flame,
  Cpu, Cloud, Zap, Leaf,
  Sparkles, Shield, Award, BatteryFull, Sun, Moon, Power, Fan
} from 'lucide-react';

export default function Dashboard() {
  const [currentData, setCurrentData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartHover, setChartHover] = useState<number | null>(null);
  const [notificationCount, setNotificationCount] = useState(3);
  const [particles, setParticles] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [darkMode, setDarkMode] = useState(true);

  const theme = {
    bg: darkMode ? '#0a0c10' : '#f0f4f8',
    surface: darkMode ? '#0d1117' : '#ffffff',
    surface2: darkMode ? '#1a202c' : '#e8edf3',
    border: darkMode ? '#1a202c' : '#dde3ea',
    text: darkMode ? '#ffffff' : '#0f172a',
    textMuted: darkMode ? '#8892b0' : '#64748b',
    textSub: darkMode ? '#cbd5e1' : '#374151',
    accent: '#4caf50',
    accentDim: darkMode ? 'rgba(76,175,80,0.15)' : 'rgba(76,175,80,0.12)',
    headerBg: darkMode ? 'rgba(13,17,23,0.95)' : 'rgba(240,244,248,0.95)',
    cardShadow: darkMode ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)',
  };

  const fetchData = async () => {
    try {
      const response = await fetch('/api/air-quality');
      const data = await response.json();
      setCurrentData(data.current);
      setHistoryData(data.history || []);
      setLastUpdate(new Date());
      setIsConnected(true);
    } catch {
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newParticles = Array.from({ length: 25 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      id: i,
    }));
    setParticles(newParticles);
  }, []);

  const getAQIInfo = (aqi: number) => {
    if (aqi <= 50) return { level: 'Good', color: '#4caf50', bg: 'rgba(76,175,80,0.15)', icon: CheckCircle };
    if (aqi <= 100) return { level: 'Moderate', color: '#ffc107', bg: 'rgba(255,193,7,0.15)', icon: Activity };
    if (aqi <= 150) return { level: 'Unhealthy', color: '#ff9800', bg: 'rgba(255,152,0,0.15)', icon: AlertTriangle };
    return { level: 'Hazardous', color: '#f44336', bg: 'rgba(244,67,54,0.15)', icon: Zap };
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: theme.bg, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {particles.map(p => (
            <motion.div key={p.id} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: 4, height: 4, background: '#4caf50', borderRadius: '50%', opacity: 0.3 }}
              animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }} />
          ))}
        </div>
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 360] }} transition={{ duration: 2, repeat: Infinity }}
          style={{ width: 60, height: 60, border: '3px solid rgba(76,175,80,0.2)', borderTopColor: '#4caf50', borderRadius: '50%' }} />
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ marginTop: 20, color: '#8892b0', fontSize: 14 }}>
          Initializing Atmoscan System...
        </motion.p>
        <motion.div initial={{ width: 0 }} animate={{ width: 200 }} transition={{ duration: 1.5, repeat: Infinity }}
          style={{ marginTop: 20, height: 2, background: '#4caf50', borderRadius: 2 }} />
      </div>
    );
  }

  const aqiInfo = getAQIInfo(currentData?.aqi || 0);
  const maxAQI = Math.max(...historyData.map(d => d.aqi), 150);
  const maxCO2 = Math.max(...historyData.map(d => d.co2), 500);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, type: 'spring' as const, stiffness: 100 },
    }),
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: theme.bg, position: 'relative', overflowX: 'hidden', transition: 'background 0.4s ease' }}>

      {/* Background Particles */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {particles.map(p => (
          <motion.div key={p.id} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: 2, height: 2, background: '#4caf50', borderRadius: '50%', opacity: darkMode ? 0.15 : 0.08 }}
            animate={{ y: [0, -50, 0], x: [0, 20, -20, 0], opacity: darkMode ? [0.15, 0.4, 0.15] : [0.08, 0.2, 0.08] }}
            transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }} />
        ))}
      </div>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 25 }}
        style={{ position: 'fixed', left: 0, top: 0, height: '100vh', width: sidebarOpen ? 280 : 80, background: theme.surface, borderRight: `1px solid ${theme.border}`, overflowX: 'hidden', zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)', boxShadow: theme.cardShadow }}
      >
        <div>
          <div style={{ padding: '24px 20px', borderBottom: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <motion.div style={{ display: 'flex', alignItems: 'center', gap: 12 }} whileHover={{ scale: 1.05 }}>
              <motion.div style={{ width: 40, height: 40, background: theme.accentDim, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}>
                <Leaf size={22} color="#4caf50" />
              </motion.div>
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: theme.text, letterSpacing: -0.5, display: 'block' }}>Atmoscan</span>
                  <span style={{ fontSize: 10, color: '#4caf50', display: 'block' }}>Air Quality</span>
                </motion.div>
              )}
            </motion.div>
            <motion.button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              whileHover={{ scale: 1.1, rotate: 180 }} whileTap={{ scale: 0.9 }}>
              {sidebarOpen ? <X size={18} color={theme.textMuted} /> : <Menu size={18} color={theme.textMuted} />}
            </motion.button>
          </div>

          <nav style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { id: 'overview', icon: Home, label: 'Overview' },
              { id: 'analytics', icon: BarChart3, label: 'Analytics' },
              { id: 'devices', icon: Cpu, label: 'Devices' },
              { id: 'settings', icon: Settings, label: 'Settings' },
              { id: 'help', icon: HelpCircle, label: 'Help' },
            ].map((item, idx) => (
              <motion.button key={item.id}
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.05, type: 'spring' }}
                onClick={() => setActiveTab(item.id)}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: activeTab === item.id ? theme.accentDim : 'transparent', border: 'none', borderRadius: 12, cursor: 'pointer', width: '100%', position: 'relative', justifyContent: sidebarOpen ? 'flex-start' : 'center' }}
                whileHover={{ x: 6, background: theme.accentDim }} whileTap={{ scale: 0.98 }}>
                <item.icon size={18} color={activeTab === item.id ? '#4caf50' : theme.textMuted} />
                {sidebarOpen && <span style={{ fontSize: 14, fontWeight: 500, color: activeTab === item.id ? '#4caf50' : theme.textSub }}>{item.label}</span>}
                {activeTab === item.id && sidebarOpen && (
                  <motion.div layoutId="activeIndicator"
                    style={{ position: 'absolute', right: -16, width: 3, height: 20, background: '#4caf50', borderRadius: 3 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                )}
              </motion.button>
            ))}
          </nav>
        </div>

        <motion.div style={{ padding: 20, borderTop: `1px solid ${theme.border}` }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 12 }}>
            <motion.div style={{ width: 8, height: 8, background: '#4caf50', borderRadius: '50%' }}
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1, repeat: Infinity }} />
            {sidebarOpen && <span style={{ fontSize: 12, color: theme.textMuted }}>System Online</span>}
          </div>
          <motion.div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', padding: '6px 12px', background: theme.accentDim, borderRadius: 20 }} whileHover={{ scale: 1.05 }}>
            <BatteryFull size={14} color="#4caf50" />
            {sidebarOpen && <span style={{ fontSize: 10, color: '#4caf50' }}>100%</span>}
          </motion.div>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: sidebarOpen ? 280 : 80, minHeight: '100vh', position: 'relative', zIndex: 1, transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)' }}>

        {/* Header */}
        <motion.header
          initial={{ y: -100, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 100 }}
          style={{ position: 'sticky', top: 0, background: theme.headerBg, backdropFilter: 'blur(12px)', borderBottom: `1px solid ${theme.border}`, padding: '16px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 40, transition: 'background 0.4s ease' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: theme.text, letterSpacing: -0.5 }}>Dashboard</h1>
            <p style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>Real-time air quality monitoring</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Dark/Light Mode Toggle */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              style={{ padding: 8, background: theme.surface2, border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              {darkMode ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#6366f1" />}
            </motion.button>

            <motion.div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: theme.surface2, borderRadius: 20 }}
              animate={{ boxShadow: isConnected ? ['0 0 0 0 rgba(76,175,80,0.4)', '0 0 0 10px rgba(76,175,80,0)'] : [] }}
              transition={{ duration: 1.5, repeat: Infinity }}>
              {isConnected ? <Wifi size={12} color="#4caf50" /> : <WifiOff size={12} color="#f44336" />}
              <span style={{ fontSize: 12, fontWeight: 500, color: isConnected ? '#4caf50' : '#f44336' }}>{isConnected ? 'Live' : 'Offline'}</span>
            </motion.div>

            <motion.div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: theme.surface2, borderRadius: 20 }}>
              <Clock size={12} color={theme.textMuted} />
              <span style={{ fontSize: 12, color: theme.textMuted }}>{lastUpdate.toLocaleTimeString()}</span>
            </motion.div>

            <motion.button onClick={fetchData}
              style={{ padding: 8, background: theme.surface2, border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              whileHover={{ rotate: 180, background: theme.accentDim }} whileTap={{ scale: 0.9 }}>
              <RefreshCw size={16} color="#64ffda" />
            </motion.button>

            <div style={{ position: 'relative' }}>
              <motion.button style={{ padding: 8, background: theme.surface2, border: 'none', borderRadius: 10, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Bell size={16} color="#64ffda" />
              </motion.button>
              {notificationCount > 0 && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500 }}
                  style={{ position: 'absolute', top: -5, right: -5, background: '#f44336', borderRadius: 10, minWidth: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 10, color: '#fff', fontWeight: 'bold' }}>{notificationCount}</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.header>

        <div style={{ padding: 32 }}>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24, marginBottom: 32 }}>
            {[
              { title: 'Air Quality Index', value: currentData?.aqi || '--', unit: '', icon: Gauge, color: aqiInfo.color, bg: aqiInfo.bg, subValue: aqiInfo.level },
              { title: 'Carbon Dioxide', value: Math.round(currentData?.co2 || 0), unit: 'ppm', icon: Wind, color: '#4caf50', bg: 'rgba(76,175,80,0.1)', progress: Math.min((currentData?.co2 || 0) / 10, 100), safeLimit: 'Safe: 1000 ppm' },
              { title: 'Carbon Monoxide', value: Math.round(currentData?.co || 0), unit: 'ppm', icon: Flame, color: '#ff9800', bg: 'rgba(255,152,0,0.1)', progress: Math.min((currentData?.co || 0) * 2, 100), safeLimit: 'Safe: 50 ppm' },
              { title: 'Environment', value: '', unit: '', icon: Cloud, color: '#64ffda', bg: 'rgba(100,255,218,0.1)', isDouble: true, temp: currentData?.temperature, humidity: currentData?.humidity },
            ].map((item, idx) => (
              <motion.div key={idx} custom={idx} initial="hidden" animate="visible" variants={cardVariants}
                style={{ background: theme.surface, borderRadius: 20, border: `1px solid ${theme.border}`, padding: 24, boxShadow: theme.cardShadow, transition: 'background 0.4s ease' }}
                whileHover={{ y: -8, boxShadow: `0 20px 40px rgba(0,0,0,0.2), 0 0 20px ${item.color}20` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: 12, color: theme.textMuted, marginBottom: 8, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{item.title}</p>
                    {item.isDouble ? (
                      <div style={{ display: 'flex', gap: 24, marginTop: 4 }}>
                        <div>
                          <p style={{ fontSize: 36, fontWeight: 700, color: item.color }}>{item.temp || '--'}°</p>
                          <p style={{ fontSize: 11, color: theme.textMuted }}>Temp</p>
                        </div>
                        <div>
                          <p style={{ fontSize: 36, fontWeight: 700, color: item.color }}>{item.humidity || '--'}%</p>
                          <p style={{ fontSize: 11, color: theme.textMuted }}>Humidity</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <motion.p key={String(item.value)} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                          style={{ fontSize: 36, fontWeight: 700, color: item.color }}>
                          {item.value}
                        </motion.p>
                        {item.unit && <p style={{ fontSize: 11, color: theme.textMuted, marginTop: 2 }}>{item.unit}</p>}
                        {item.subValue && <p style={{ fontSize: 14, fontWeight: 500, marginTop: 4, color: item.color }}>{item.subValue}</p>}
                      </>
                    )}
                  </div>
                  <motion.div style={{ padding: 12, borderRadius: 14, background: item.bg }} whileHover={{ scale: 1.1, rotate: 10 }}>
                    <item.icon size={28} color={item.color} />
                  </motion.div>
                </div>
                {item.progress !== undefined && (
                  <>
                    <div style={{ marginTop: 20, height: 6, background: theme.surface2, borderRadius: 10, overflow: 'hidden' }}>
                      <motion.div style={{ height: '100%', borderRadius: 10, background: item.color }}
                        initial={{ width: 0 }} animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.1 }} />
                    </div>
                    <p style={{ fontSize: 10, color: '#4caf50', marginTop: 10 }}>✓ {item.safeLimit}</p>
                  </>
                )}
              </motion.div>
            ))}
          </div>

          {/* Purifier & Alerts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 32 }}>

            {/* Purifier Status Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, type: 'spring' }}
              style={{ background: theme.surface, borderRadius: 20, border: `1px solid ${theme.border}`, padding: 24, boxShadow: theme.cardShadow, transition: 'background 0.4s ease' }}
              whileHover={{ y: -5, borderColor: '#a78bfa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Fan size={18} color="#a78bfa" />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.text, flex: 1 }}>Purifier Status</h3>
                <motion.div style={{ padding: '4px 10px', background: 'rgba(167,139,250,0.15)', borderRadius: 20 }}
                  animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
                  <span style={{ fontSize: 10, color: '#a78bfa', fontWeight: 'bold' }}>AUTO</span>
                </motion.div>
              </div>
              {[
                { label: 'Status', value: 'RUNNING', color: '#4caf50', icon: Power },
                { label: 'Fan Speed', value: '75%', color: '#a78bfa', icon: Fan },
                { label: 'Mode', value: 'Auto', color: '#64ffda', icon: Settings },
                { label: 'Filter Life', value: '84%', color: '#ffc107', icon: BatteryFull },
              ].map((item, i) => (
                <motion.div key={item.label}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${theme.border}`, fontSize: 13, color: theme.textSub }}
                  whileHover={{ x: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <item.icon size={15} color={item.color} />
                    <span>{item.label}</span>
                  </div>
                  <strong style={{ color: item.color }}>{item.value}</strong>
                </motion.div>
              ))}
            </motion.div>

            {/* Alerts Panel */}
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, type: 'spring' }}
              style={{ background: theme.surface, borderRadius: 20, border: `1px solid ${theme.border}`, padding: 24, boxShadow: theme.cardShadow, transition: 'background 0.4s ease' }}
              whileHover={{ y: -5, borderColor: '#f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Bell size={18} color="#f59e0b" />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.text, flex: 1 }}>Recent Alerts</h3>
                <motion.button onClick={() => setNotificationCount(0)}
                  style={{ padding: '4px 10px', background: 'rgba(245,158,11,0.15)', borderRadius: 20, border: 'none', cursor: 'pointer' }}
                  whileHover={{ scale: 1.05 }}>
                  <span style={{ fontSize: 10, color: '#f59e0b' }}>{notificationCount} NEW</span>
                </motion.button>
              </div>
              {[
                { title: 'CO₂ Rising', message: 'CO₂ level approaching 800 ppm', time: '2 min ago', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
                { title: 'Purifier Active', message: 'Auto purification started', time: '5 min ago', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
                { title: 'System Online', message: 'ESP32 connected successfully', time: '10 min ago', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
              ].map((alert, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  style={{ display: 'flex', gap: 12, padding: 12, marginBottom: 8, background: alert.bg, borderRadius: 12, borderLeft: `3px solid ${alert.color}`, cursor: 'pointer' }}
                  whileHover={{ x: 4 }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: theme.text, marginBottom: 2 }}>{alert.title}</p>
                    <p style={{ fontSize: 11, color: theme.textMuted }}>{alert.message}</p>
                  </div>
                  <span style={{ fontSize: 10, color: theme.textMuted, whiteSpace: 'nowrap' }}>{alert.time}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Chart */}
          <motion.div
            initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={{ background: theme.surface, borderRadius: 20, border: `1px solid ${theme.border}`, padding: 24, marginBottom: 32, boxShadow: theme.cardShadow, transition: 'background 0.4s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}>
                <TrendingUp size={18} color="#64ffda" />
              </motion.div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.text, flex: 1 }}>24-Hour Air Quality Trend</h3>
              <motion.div style={{ padding: '4px 10px', background: theme.accentDim, borderRadius: 20 }}
                animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }}>
                <span style={{ fontSize: 10, color: '#4caf50', fontWeight: 'bold' }}>LIVE</span>
              </motion.div>
            </div>

            <div style={{ width: '100%', height: 280, marginTop: 16 }}>
              <svg width="100%" height="280" viewBox="0 0 800 280" preserveAspectRatio="none">
                {[0, 1, 2, 3, 4].map(i => (
                  <line key={i} x1="40" y1={40 + i * 48} x2="760" y2={40 + i * 48}
                    stroke={darkMode ? '#1a202c' : '#e8edf3'} strokeWidth="1" strokeDasharray="4" />
                ))}
                <text x="30" y="45" fill={theme.textMuted} fontSize="10" textAnchor="end">{Math.round(maxAQI)}</text>
                <text x="30" y="141" fill={theme.textMuted} fontSize="10" textAnchor="end">{Math.round(maxAQI * 0.5)}</text>
                <text x="30" y="237" fill={theme.textMuted} fontSize="10" textAnchor="end">0</text>
                <defs>
                  <linearGradient id="aqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4caf50" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#4caf50" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>
                <motion.path d={generateAreaPath(historyData, maxAQI, 800, 280, 'aqi')} fill="url(#aqiGrad)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} />
                <motion.path d={generateLinePath(historyData, maxAQI, 800, 280, 'aqi')} fill="none" stroke="#4caf50"
                  strokeWidth="2.5" filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: 'easeInOut' }} />
                <motion.path d={generateLinePath(historyData, maxCO2, 800, 280, 'co2')} fill="none" stroke="#ff9800"
                  strokeWidth="2" strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: 'easeInOut' }} />
                {historyData.map((item, idx) => {
                  const x = 40 + (idx / (historyData.length - 1)) * 720;
                  const aqiY = 40 + (1 - item.aqi / maxAQI) * 200;
                  const co2Y = 40 + (1 - item.co2 / maxCO2) * 200;
                  return (
                    <g key={idx}>
                      <motion.circle cx={x} cy={aqiY} r="5" fill="#4caf50"
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + idx * 0.02, type: 'spring' }}
                        onMouseEnter={() => setChartHover(idx)} onMouseLeave={() => setChartHover(null)} />
                      <motion.circle cx={x} cy={co2Y} r="4" fill="#ff9800"
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + idx * 0.02, type: 'spring' }} />
                      <AnimatePresence>
                        {chartHover === idx && (
                          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <rect x={x - 40} y={Math.min(aqiY, co2Y) - 52} width="80" height="48" rx="8"
                              fill={darkMode ? '#1a202c' : '#fff'} stroke="#4caf50" strokeWidth="1" />
                            <text x={x} y={Math.min(aqiY, co2Y) - 38} fill="#64ffda" fontSize="9" textAnchor="middle" fontWeight="bold">AQI: {Math.round(item.aqi)}</text>
                            <text x={x} y={Math.min(aqiY, co2Y) - 26} fill="#ffb74d" fontSize="9" textAnchor="middle">CO₂: {Math.round(item.co2)}</text>
                            <text x={x} y={Math.min(aqiY, co2Y) - 14} fill={theme.textMuted} fontSize="8" textAnchor="middle">{item.time}</text>
                          </motion.g>
                        )}
                      </AnimatePresence>
                      {(idx % 3 === 0 || idx === historyData.length - 1) && (
                        <text x={x} y="265" fill={theme.textMuted} fontSize="9" textAnchor="middle">{item.time}</text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 32, marginTop: 20, paddingTop: 20, borderTop: `1px solid ${theme.border}` }}>
              {[{ color: '#4caf50', label: 'AQI' }, { color: '#ff9800', label: 'CO₂ (ppm)' }].map(l => (
                <motion.div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} whileHover={{ scale: 1.1 }}>
                  <div style={{ width: 12, height: 12, background: l.color, borderRadius: 3 }} />
                  <span style={{ fontSize: 12, color: theme.textMuted }}>{l.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Health & Pollutant Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24, marginBottom: 32 }}>

            {/* Health Recommendations */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, type: 'spring' }}
              style={{ background: theme.surface, borderRadius: 20, border: `1px solid ${theme.border}`, padding: 24, boxShadow: theme.cardShadow, transition: 'background 0.4s ease' }}
              whileHover={{ y: -5, borderColor: '#4caf50' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <Activity size={18} color="#64ffda" />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.text, flex: 1 }}>Health Recommendations</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: theme.accentDim, borderRadius: 12 }}>
                  <Shield size={12} color="#4caf50" />
                  <span style={{ fontSize: 10, color: '#4caf50' }}>AI Suggested</span>
                </div>
              </div>
              <AnimatePresence mode="wait">
                {(currentData?.aqi || 0) > 100 ? (
                  <motion.div key="unhealthy" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, background: 'rgba(255,152,0,0.1)', borderRadius: 14, border: '1px solid rgba(255,152,0,0.2)', marginBottom: 20 }}>
                      <AlertTriangle size={14} color="#ff9800" />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#ff9800' }}>Poor Air Quality Alert</span>
                    </div>
                    {['😷 Wear N95 mask when outdoors', '🚪 Keep windows and doors closed', '🌀 Use air purifier if available', '🏠 Avoid outdoor exercise'].map((text, i) => (
                      <motion.div key={text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                        style={{ padding: '10px 0', color: theme.textSub, fontSize: 13, borderBottom: `1px solid ${theme.border}`, cursor: 'pointer' }}
                        whileHover={{ x: 8, color: '#64ffda' }}>{text}</motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div key="healthy" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, background: 'rgba(76,175,80,0.1)', borderRadius: 14, border: '1px solid rgba(76,175,80,0.2)', marginBottom: 20 }}>
                      <CheckCircle size={14} color="#4caf50" />
                      <span style={{ fontSize: 13, fontWeight: 500, color: '#4caf50' }}>Good Air Quality</span>
                    </div>
                    {['🏃 Perfect for outdoor activities', '🪟 Open windows for fresh air', '💪 Great time for exercise', '😊 Enjoy your day outdoors'].map((text, i) => (
                      <motion.div key={text} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                        style={{ padding: '10px 0', color: theme.textSub, fontSize: 13, borderBottom: `1px solid ${theme.border}`, cursor: 'pointer' }}
                        whileHover={{ x: 8, color: '#64ffda' }}>{text}</motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Sparkles size={12} color={theme.textMuted} />
                <span style={{ fontSize: 10, color: theme.textMuted }}>Based on real-time AQI data</span>
              </div>
            </motion.div>

            {/* Pollutant Analysis */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, type: 'spring' }}
              style={{ background: theme.surface, borderRadius: 20, border: `1px solid ${theme.border}`, padding: 24, boxShadow: theme.cardShadow, transition: 'background 0.4s ease' }}
              whileHover={{ y: -5, borderColor: '#4caf50' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <BarChart3 size={18} color="#64ffda" />
                <h3 style={{ fontSize: 16, fontWeight: 600, color: theme.text, flex: 1 }}>Pollutant Analysis</h3>
                <div style={{ padding: '4px 10px', background: theme.surface2, borderRadius: 12, cursor: 'pointer' }}>
                  <span style={{ fontSize: 10, color: theme.textMuted }}>Export</span>
                </div>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border}` }}>
                    {['Pollutant', 'Current', 'Safe Limit', 'Status'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '14px 8px', fontSize: 12, fontWeight: 500, color: theme.textMuted }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'CO₂', icon: Wind, color: '#4caf50', value: currentData?.co2, limit: 1000, unit: 'ppm' },
                    { name: 'CO', icon: Flame, color: '#ff9800', value: currentData?.co, limit: 50, unit: 'ppm' },
                  ].map((p, idx) => (
                    <motion.tr key={p.name} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.05, type: 'spring' }}
                      style={{ borderBottom: `1px solid ${theme.border}` }}
                      whileHover={{ background: theme.accentDim }}>
                      <td style={{ padding: '14px 8px', fontSize: 13, color: theme.textSub }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <p.icon size={14} color={p.color} />
                          <span>{p.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 8px', fontSize: 13, color: theme.textSub }}>{Math.round(p.value || 0)} {p.unit}</td>
                      <td style={{ padding: '14px 8px', fontSize: 13, color: theme.textSub }}>&lt; {p.limit} {p.unit}</td>
                      <td style={{ padding: '14px 8px' }}>
                        <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4, background: (p.value || 0) < p.limit ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)', color: (p.value || 0) < p.limit ? '#4caf50' : '#f44336' }}>
                          {(p.value || 0) < p.limit ? <><CheckCircle size={10} /> Safe</> : <><AlertTriangle size={10} /> Unsafe</>}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: `1px solid ${theme.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={12} color={theme.textMuted} />
                <span style={{ fontSize: 10, color: theme.textMuted }}>Data updated every 10 seconds</span>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <motion.footer initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
            style={{ textAlign: 'center', paddingTop: 24, borderTop: `1px solid ${theme.border}`, color: theme.textMuted, fontSize: 12 }}>
            <p>© 2026 Atmoscan - IoT Air Quality Monitoring and purifying System</p>
            <motion.p style={{ marginTop: 8, fontSize: 11 }}
              animate={{ color: ['#4caf50', '#64ffda', '#4caf50'] }}
              transition={{ duration: 3, repeat: Infinity }}>
              Real-time IoT Data 
            </motion.p>
          </motion.footer>
        </div>
      </main>
    </div>
  );
}

function generateLinePath(data: any[], maxValue: number, width: number, height: number, key: string): string {
  if (!data.length) return '';
  const chartWidth = width - 80;
  const chartHeight = height - 80;
  let path = '';
  data.forEach((item, idx) => {
    const x = 40 + (idx / (data.length - 1)) * chartWidth;
    const y = 40 + (1 - item[key] / maxValue) * chartHeight;
    path += idx === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
  });
  return path;
}

function generateAreaPath(data: any[], maxValue: number, width: number, height: number, key: string): string {
  if (!data.length) return '';
  const path = generateLinePath(data, maxValue, width, height, key);
  const lastX = 40 + (width - 80);
  const bottomY = 40 + (height - 80);
  return `${path} L ${lastX} ${bottomY} L 40 ${bottomY} Z`;
}