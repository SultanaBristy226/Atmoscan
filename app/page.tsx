'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wind, TrendingUp, AlertTriangle, CheckCircle,
  Clock, Wifi, WifiOff, RefreshCw, Bell,
  Home, BarChart3, Settings, HelpCircle,
  Gauge, Flame, Leaf, BatteryFull,
  Cpu, Droplets, Zap, Shield, Sun, Moon, X, Fan
} from 'lucide-react';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isEspConnected, setIsEspConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showAlert, setShowAlert] = useState(true);
  const [dark, setDark] = useState(true);

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const toggleTheme = () => setDark(d => !d);

  const addNotification = (title: string, message: string, type: 'info' | 'warning' | 'danger' | 'success') => {
    const newNotif = { id: Date.now(), title, message, type, timestamp: new Date(), read: false };
    setNotifications(prev => [newNotif, ...prev].slice(0, 20));
    setUnreadCount(prev => prev + 1);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const fetchData = async () => {
    try {
      const res = await fetch('/api/air-quality');
      const data = await res.json();
      
      if (data && data.data) {
        const prevAQI = dashboardData?.current?.aqi || 0;
        const newAQI = data.data.current?.aqi || 0;
        
        if (prevAQI > 0 && newAQI > 0) {
          if (newAQI > 150 && prevAQI <= 150) {
            addNotification('🚨 Hazardous Air Quality!', `AQI spiked to ${newAQI}. Stay indoors!`, 'danger');
          } else if (newAQI > 100 && prevAQI <= 100) {
            addNotification('⚠️ Unhealthy Air Quality', `AQI reached ${newAQI}. Wear mask outside.`, 'warning');
          } else if (newAQI <= 50 && prevAQI > 50) {
            addNotification('✅ Air Quality Improved!', `AQI dropped to ${newAQI}. Safe to go out.`, 'success');
          }
        }

        if (data.data.esp32Connected && !isEspConnected) {
          addNotification('🟢 ESP32 Connected', 'Real-time data streaming started.', 'success');
        }

        if (!data.data.esp32Connected && isEspConnected) {
          addNotification('🔴 ESP32 Disconnected', 'Lost connection to ESP32. Reconnecting...', 'warning');
        }

        setDashboardData({
          current: data.data.current,
          history: data.data.history || [],
          purifier: data.data.purifier || { isOn: false, fanSpeed: 0, mode: 'WAITING', filterLife: 0 },
          alert: data.data.alert || null,
        });
        setIsEspConnected(data.data.esp32Connected || false);
        setLastUpdate(new Date());
        setIsConnected(true);
      } else {
        setDashboardData({
          current: { aqi: 0, co2: 0, co: 0, temperature: 0, humidity: 0 },
          history: [],
          purifier: { isOn: false, fanSpeed: 0, mode: 'WAITING', filterLife: 0 },
          alert: { type: 'warning', title: '⏳ Waiting for ESP32', message: 'Connect ESP32 to see real-time air quality data.' },
        });
        setIsEspConnected(false);
        setIsConnected(false);
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setIsConnected(false);
      setIsEspConnected(false);
      addNotification('⚠️ Connection Error', 'Failed to fetch data from server.', 'danger');
      setDashboardData({
        current: { aqi: 0, co2: 0, co: 0, temperature: 0, humidity: 0 },
        history: [],
        purifier: { isOn: false, fanSpeed: 0, mode: 'OFFLINE', filterLife: 0 },
        alert: { type: 'danger', title: '⚠️ Connection Lost', message: 'Unable to connect to ESP32. Please check your network.' },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 3000);
    return () => clearInterval(t);
  }, []);

  const getAQI = (aqi: number) => {
    if (aqi <= 50) return { label: 'Good', color: '#22c55e', glow: 'rgba(34,197,94,0.25)', bg: 'rgba(34,197,94,0.08)', ring: 'rgba(34,197,94,0.2)' };
    if (aqi <= 100) return { label: 'Moderate', color: '#eab308', glow: 'rgba(234,179,8,0.25)', bg: 'rgba(234,179,8,0.08)', ring: 'rgba(234,179,8,0.2)' };
    if (aqi <= 150) return { label: 'Unhealthy', color: '#f97316', glow: 'rgba(249,115,22,0.25)', bg: 'rgba(249,115,22,0.08)', ring: 'rgba(249,115,22,0.2)' };
    return { label: 'Hazardous', color: '#ef4444', glow: 'rgba(239,68,68,0.25)', bg: 'rgba(239,68,68,0.08)', ring: 'rgba(239,68,68,0.2)' };
  };

  const D = dark;
  const c = {
    bg: D ? '#080c12' : '#f5f7fa',
    sidebar: D ? '#0c1118' : '#ffffff',
    card: D ? '#0f1720' : '#ffffff',
    card2: D ? '#131e2a' : '#f0f4f8',
    border: D ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
    text: D ? '#f0f6ff' : '#0f1720',
    muted: D ? '#6b7fa3' : '#6b7fa3',
    sub: D ? '#94a3b8' : '#64748b',
    accent: '#3b82f6',
    accentDim: D ? 'rgba(59,130,246,0.12)' : 'rgba(59,130,246,0.08)',
    green: '#22c55e',
    greenDim: D ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.08)',
    header: D ? 'rgba(8,12,18,0.92)' : 'rgba(245,247,250,0.92)',
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: c.bg, gap: 20 }}>
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        style={{ width: 44, height: 44, border: `2px solid ${c.border}`, borderTopColor: c.accent, borderRadius: '50%' }} />
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: c.muted, fontSize: 14, letterSpacing: '0.5px' }}>
        Loading Atmoscan...
      </motion.p>
    </div>
  );

  const cur = dashboardData?.current;
  const purifier = dashboardData?.purifier || { isOn: false, fanSpeed: 0, mode: 'WAITING', filterLife: 0 };
  const alert = dashboardData?.alert;
  const history = dashboardData?.history || [];
  const aqiMeta = getAQI(cur?.aqi || 0);
  const maxAQI = Math.max(...history.map((d: any) => d.aqi || 0), 150);

  const navItems = [
    { id: 'overview', icon: Home, label: 'Overview' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'devices', icon: Cpu, label: 'Devices' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help' },
  ];

  const getBarColor = (aqi: number) => {
    if (aqi <= 50) return { color: '#22c55e', opacity: 1 };
    if (aqi <= 100) return { color: '#16a34a', opacity: 0.9 };
    if (aqi <= 150) return { color: '#15803d', opacity: 0.75 };
    return { color: '#166534', opacity: 0.6 };
  };

  // ============================================================
  // ========== ANALYTICS VIEW ==========
  // ============================================================
  const AnalyticsView = () => {
    if (!cur) return <div style={{ color: c.muted, padding: 40, textAlign: 'center' }}>No data available</div>;

    return (
      <div style={{ padding: '20px 0' }}>
        <h2 style={{ color: c.text, fontSize: 20, fontWeight: 700, marginBottom: 24 }}>📊 Air Quality Analytics</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 11, color: c.muted }}>Average AQI</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: c.text }}>
              {history.length > 0 ? Math.round(history.reduce((acc: number, d: any) => acc + d.aqi, 0) / history.length) : '--'}
            </p>
          </div>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 11, color: c.muted }}>Max AQI</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: c.text }}>
              {history.length > 0 ? Math.max(...history.map((d: any) => d.aqi)) : '--'}
            </p>
          </div>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 11, color: c.muted }}>Min AQI</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: c.text }}>
              {history.length > 0 ? Math.min(...history.map((d: any) => d.aqi)) : '--'}
            </p>
          </div>
          <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 11, color: c.muted }}>Data Points</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: c.text }}>{history.length}</p>
          </div>
        </div>

        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: c.text, fontSize: 14, fontWeight: 600, marginBottom: 16 }}>📋 History Log</h3>
          {history.length === 0 ? (
            <p style={{ color: c.muted, textAlign: 'center', padding: 20 }}>No data yet. Connect ESP32.</p>
          ) : (
            <div style={{ maxHeight: 300, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${c.border}` }}>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: c.muted, fontSize: 11 }}>Time</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: c.muted, fontSize: 11 }}>AQI</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: c.muted, fontSize: 11 }}>CO₂</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: c.muted, fontSize: 11 }}>CO</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: c.muted, fontSize: 11 }}>Temp</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: c.muted, fontSize: 11 }}>Humidity</th>
                    <th style={{ textAlign: 'left', padding: '8px 12px', color: c.muted, fontSize: 11 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.slice().reverse().map((item: any, idx: number) => {
                    const aqi = getAQI(item.aqi);
                    return (
                      <tr key={idx} style={{ borderBottom: `1px solid ${c.border}20` }}>
                        <td style={{ padding: '6px 12px', fontSize: 12, color: c.text }}>{item.time}</td>
                        <td style={{ padding: '6px 12px', fontSize: 12, color: aqi.color }}>{item.aqi}</td>
                        <td style={{ padding: '6px 12px', fontSize: 12, color: c.text }}>{item.co2 || '--'}</td>
                        <td style={{ padding: '6px 12px', fontSize: 12, color: c.text }}>{item.co || '--'}</td>
                        <td style={{ padding: '6px 12px', fontSize: 12, color: c.text }}>{item.temperature || '--'}°</td>
                        <td style={{ padding: '6px 12px', fontSize: 12, color: c.text }}>{item.humidity || '--'}%</td>
                        <td style={{ padding: '6px 12px', fontSize: 12 }}>
                          <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 10, background: aqi.color + '20', color: aqi.color }}>
                            {aqi.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // ========== DEVICES VIEW ==========
  // ============================================================
  const DevicesView = () => {
    return (
      <div style={{ padding: '20px 0' }}>
        <h2 style={{ color: c.text, fontSize: 20, fontWeight: 700, marginBottom: 24 }}>📱 Devices</h2>

        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Cpu size={24} color={isEspConnected ? c.green : '#ef4444'} />
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: c.text }}>ESP32</h3>
              <p style={{ fontSize: 12, color: isEspConnected ? c.green : '#ef4444' }}>
                {isEspConnected ? '🟢 Online' : '🔴 Offline'}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ padding: '8px 12px', background: c.card2, borderRadius: 8 }}>
              <p style={{ fontSize: 10, color: c.muted }}>Status</p>
              <p style={{ fontSize: 13, color: c.text }}>{isEspConnected ? 'Connected' : 'Disconnected'}</p>
            </div>
            <div style={{ padding: '8px 12px', background: c.card2, borderRadius: 8 }}>
              <p style={{ fontSize: 10, color: c.muted }}>Last Data</p>
              <p style={{ fontSize: 13, color: c.text }}>{lastUpdate.toLocaleTimeString()}</p>
            </div>
            <div style={{ padding: '8px 12px', background: c.card2, borderRadius: 8 }}>
              <p style={{ fontSize: 10, color: c.muted }}>Uptime</p>
              <p style={{ fontSize: 13, color: c.text }}>{isEspConnected ? 'Active' : '--'}</p>
            </div>
            <div style={{ padding: '8px 12px', background: c.card2, borderRadius: 8 }}>
              <p style={{ fontSize: 10, color: c.muted }}>Battery</p>
              <p style={{ fontSize: 13, color: c.text }}>{purifier.filterLife || 0}%</p>
            </div>
          </div>

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${c.border}` }}>
            <h4 style={{ fontSize: 12, color: c.muted, marginBottom: 12 }}>Purifier Control</h4>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => addNotification('🔄 Purifier Toggled', 'Fan speed changed to 70%', 'info')}
                style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${c.border}`, background: c.card2, color: c.text, cursor: 'pointer' }}
              >
                ⚡ Toggle
              </button>
              <button
                onClick={() => addNotification('🔄 Auto Mode', 'Purifier set to AUTO mode', 'info')}
                style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${c.border}`, background: c.card2, color: c.text, cursor: 'pointer' }}
              >
                🤖 Auto Mode
              </button>
            </div>
          </div>
        </div>

        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: c.text, fontSize: 14, fontWeight: 600, marginBottom: 12 }}>🌀 Purifier Status</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ padding: '8px 12px', background: c.card2, borderRadius: 8 }}>
              <p style={{ fontSize: 10, color: c.muted }}>Status</p>
              <p style={{ fontSize: 13, color: purifier.isOn ? c.green : c.muted }}>{purifier.isOn ? 'Running' : 'Standby'}</p>
            </div>
            <div style={{ padding: '8px 12px', background: c.card2, borderRadius: 8 }}>
              <p style={{ fontSize: 10, color: c.muted }}>Fan Speed</p>
              <p style={{ fontSize: 13, color: c.text }}>{purifier.fanSpeed || 0}%</p>
            </div>
            <div style={{ padding: '8px 12px', background: c.card2, borderRadius: 8 }}>
              <p style={{ fontSize: 10, color: c.muted }}>Mode</p>
              <p style={{ fontSize: 13, color: c.text }}>{purifier.mode || 'AUTO'}</p>
            </div>
            <div style={{ padding: '8px 12px', background: c.card2, borderRadius: 8 }}>
              <p style={{ fontSize: 10, color: c.muted }}>Filter Life</p>
              <p style={{ fontSize: 13, color: c.text }}>{purifier.filterLife || 0}%</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // ========== SETTINGS VIEW ==========
  // ============================================================
  const SettingsView = () => {
    return (
      <div style={{ padding: '20px 0' }}>
        <h2 style={{ color: c.text, fontSize: 20, fontWeight: 700, marginBottom: 24 }}>⚙️ Settings</h2>
        
        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 12 }}>Theme</h3>
          <button 
            onClick={toggleTheme}
            style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${c.border}`, background: c.card2, color: c.text, cursor: 'pointer' }}
          >
            {dark ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
          </button>
        </div>

        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 12 }}>Data</h3>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button 
              onClick={() => {
                setDashboardData((prev: any) => ({ ...prev, history: [] }));
                addNotification('🗑️ Data Cleared', 'All history data has been cleared.', 'info');
              }}
              style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid #ef4444`, background: 'transparent', color: '#ef4444', cursor: 'pointer' }}
            >
              Clear History
            </button>
            <button 
              onClick={() => {
                const dataStr = JSON.stringify(dashboardData, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `atmoscan_data_${new Date().toISOString().slice(0,10)}.json`;
                a.click();
                addNotification('📥 Data Exported', 'Data exported successfully!', 'success');
              }}
              style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${c.border}`, background: c.card2, color: c.text, cursor: 'pointer' }}
            >
              Export Data
            </button>
          </div>
        </div>

        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: c.text, marginBottom: 12 }}>System Info</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ padding: '8px 12px', background: c.card2, borderRadius: 8 }}>
              <p style={{ fontSize: 10, color: c.muted }}>Version</p>
              <p style={{ fontSize: 13, color: c.text }}>1.0.0</p>
            </div>
            <div style={{ padding: '8px 12px', background: c.card2, borderRadius: 8 }}>
              <p style={{ fontSize: 10, color: c.muted }}>ESP32</p>
              <p style={{ fontSize: 13, color: isEspConnected ? c.green : '#ef4444' }}>
                {isEspConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>
            <div style={{ padding: '8px 12px', background: c.card2, borderRadius: 8 }}>
              <p style={{ fontSize: 10, color: c.muted }}>Data Points</p>
              <p style={{ fontSize: 13, color: c.text }}>{history.length}</p>
            </div>
            <div style={{ padding: '8px 12px', background: c.card2, borderRadius: 8 }}>
              <p style={{ fontSize: 10, color: c.muted }}>Last Update</p>
              <p style={{ fontSize: 13, color: c.text }}>{lastUpdate.toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // ========== OVERVIEW VIEW ==========
  // ============================================================
  const OverviewView = () => {
    return (
      <div>
        <AnimatePresence>
          {alert && showAlert && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 10, marginBottom: 24, background: alert.type === 'danger' ? 'rgba(239,68,68,0.08)' : alert.type === 'warning' ? 'rgba(234,179,8,0.08)' : 'rgba(34,197,94,0.08)', border: `1px solid ${alert.type === 'danger' ? 'rgba(239,68,68,0.2)' : alert.type === 'warning' ? 'rgba(234,179,8,0.2)' : 'rgba(34,197,94,0.2)'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {alert.type === 'danger' ? <AlertTriangle size={15} color="#ef4444" /> : alert.type === 'warning' ? <AlertTriangle size={15} color="#eab308" /> : <CheckCircle size={15} color={c.green} />}
                <span style={{ fontSize: 13, fontWeight: 500, color: alert.type === 'danger' ? '#ef4444' : alert.type === 'warning' ? '#eab308' : c.green }}>{alert.title}</span>
                <span style={{ fontSize: 12, color: c.muted }}>— {alert.message}</span>
              </div>
              <button onClick={() => setShowAlert(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, display: 'flex' }}>
                <X size={14} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP METRICS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
            whileHover={{ y: -4, boxShadow: `0 16px 40px ${aqiMeta.glow}` }}
            style={{ background: c.card, border: `1px solid ${aqiMeta.ring}`, borderRadius: 16, padding: 22, position: 'relative', overflow: 'hidden', cursor: 'pointer' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: aqiMeta.glow, filter: 'blur(30px)', pointerEvents: 'none' }} />
            <p style={{ fontSize: 11, fontWeight: 600, color: c.muted, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 12 }}>Air Quality Index</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, marginBottom: 10 }}>
              <motion.span key={cur?.aqi} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                style={{ fontSize: 48, fontWeight: 800, color: aqiMeta.color, lineHeight: 1, letterSpacing: '-2px' }}>
                {cur?.aqi > 0 ? cur.aqi : '--'}
              </motion.span>
              <div style={{ paddingBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: aqiMeta.color }}>{cur?.aqi > 0 ? aqiMeta.label : 'No Data'}</div>
                <div style={{ fontSize: 10, color: c.muted }}>US AQI scale</div>
              </div>
            </div>
            <div style={{ height: 3, background: c.border, borderRadius: 2, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((cur?.aqi || 0) / 3, 100)}%` }} transition={{ duration: 1 }}
                style={{ height: '100%', background: aqiMeta.color, borderRadius: 2 }} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.07 }}
            whileHover={{ y: -4 }}
            style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 22, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: c.muted, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Carbon Dioxide</p>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: c.greenDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wind size={15} color={c.green} />
              </div>
            </div>
            <motion.div key={cur?.co2} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: 36, fontWeight: 800, color: c.text, letterSpacing: '-1.5px', marginBottom: 4 }}>
              {cur?.co2 > 0 ? Math.round(cur.co2) : '--'}
            </motion.div>
            <p style={{ fontSize: 11, color: c.muted, marginBottom: 14 }}>ppm</p>
            <div style={{ height: 3, background: c.border, borderRadius: 2, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((cur?.co2 || 0) / 10, 100)}%` }} transition={{ duration: 1 }}
                style={{ height: '100%', background: c.green, borderRadius: 2 }} />
            </div>
            <p style={{ fontSize: 10, color: c.muted, marginTop: 8 }}>Safe ≤ 1000 ppm</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            whileHover={{ y: -4 }}
            style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 22, cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: c.muted, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Carbon Monoxide</p>
              <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(34,197,94,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={15} color={c.green} />
              </div>
            </div>
            <motion.div key={cur?.co} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ fontSize: 36, fontWeight: 800, color: c.text, letterSpacing: '-1.5px', marginBottom: 4 }}>
              {cur?.co > 0 ? cur.co.toFixed(1) : '--'}
            </motion.div>
            <p style={{ fontSize: 11, color: c.muted, marginBottom: 14 }}>ppm</p>
            <div style={{ height: 3, background: c.border, borderRadius: 2, overflow: 'hidden' }}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min((cur?.co || 0) * 2, 100)}%` }} transition={{ duration: 1 }}
                style={{ height: '100%', background: '#16a34a', borderRadius: 2 }} />
            </div>
            <p style={{ fontSize: 10, color: c.muted, marginTop: 8 }}>Safe ≤ 50 ppm</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17 }}
            whileHover={{ y: -4 }}
            style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 22, cursor: 'pointer' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: c.muted, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 16 }}>Environment</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <div>
                <div style={{ fontSize: 34, fontWeight: 800, color: c.text, letterSpacing: '-1px' }}>
                  {cur?.temperature > 0 ? cur.temperature : '--'}°
                </div>
                <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>Temperature</div>
                <div style={{ fontSize: 10, color: c.sub, marginTop: 4 }}>Celsius</div>
              </div>
              <div style={{ width: 1, background: c.border }} />
              <div>
                <div style={{ fontSize: 34, fontWeight: 800, color: c.text, letterSpacing: '-1px' }}>
                  {cur?.humidity > 0 ? cur.humidity : '--'}%
                </div>
                <div style={{ fontSize: 11, color: c.muted, marginTop: 2 }}>Humidity</div>
                <div style={{ fontSize: 10, color: c.sub, marginTop: 4 }}>Relative</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* MIDDLE ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, marginBottom: 20 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <TrendingUp size={16} color={c.green} />
                <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>24-Hour Trend</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.5, repeat: Infinity }}
                  style={{ width: 6, height: 6, borderRadius: '50%', background: isEspConnected ? '#ef4444' : '#6b7280' }} />
                <span style={{ fontSize: 10, fontWeight: 700, color: isEspConnected ? '#ef4444' : '#6b7280', letterSpacing: '0.8px' }}>
                  {isEspConnected ? 'LIVE' : 'OFFLINE'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 140 }}>
              {history.length > 0 ? (
                history.slice(-16).map((item: any, idx: number) => {
                  const h = Math.max(4, (item.aqi / maxAQI) * 120);
                  const { color, opacity } = getBarColor(item.aqi);
                  return (
                    <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: h }}
                        transition={{ delay: idx * 0.02, duration: 0.5 }}
                        title={`AQI: ${Math.round(item.aqi)} at ${item.time}`}
                        style={{ width: '100%', borderRadius: '4px 4px 2px 2px', background: color, opacity, cursor: 'pointer' }} />
                      {idx % 4 === 0 && <span style={{ fontSize: 8.5, color: c.muted, whiteSpace: 'nowrap' }}>{item.time}</span>}
                    </div>
                  );
                })
              ) : (
                <div style={{ width: '100%', textAlign: 'center', color: c.muted, fontSize: 13 }}>
                  No data yet. Connect ESP32.
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 20, marginTop: 20, paddingTop: 16, borderTop: `1px solid ${c.border}`, flexWrap: 'wrap' }}>
              {[
                { color: '#22c55e', label: 'Good (≤50)' },
                { color: '#16a34a', label: 'Moderate (≤100)' },
                { color: '#15803d', label: 'Unhealthy (≤150)' },
                { color: '#166534', label: 'Hazardous' },
              ].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: l.color }} />
                  <span style={{ fontSize: 10, color: c.muted }}>{l.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <Fan size={16} color={c.green} />
                <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>Purifier</span>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 20, background: purifier.isOn ? c.greenDim : c.card2, color: purifier.isOn ? c.green : c.muted, border: `1px solid ${purifier.isOn ? 'rgba(34,197,94,0.2)' : c.border}` }}>
                {purifier.isOn ? '● ACTIVE' : '○ OFF'}
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <div style={{ position: 'relative', width: 110, height: 110 }}>
                <svg width="110" height="110" viewBox="0 0 110 110">
                  <circle cx="55" cy="55" r="46" fill="none" stroke={dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'} strokeWidth="8" />
                  <motion.circle cx="55" cy="55" r="46" fill="none" stroke={c.green} strokeWidth="8"
                    strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 46}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - purifier.fanSpeed / 100) }}
                    transform="rotate(-90 55 55)" transition={{ duration: 1, ease: 'easeOut' }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 22, fontWeight: 800, color: c.text, letterSpacing: '-1px' }}>{purifier.fanSpeed}%</span>
                  <span style={{ fontSize: 9, color: c.muted, marginTop: 1 }}>FAN SPEED</span>
                </div>
              </div>
            </div>

            {[
              { label: 'Mode', value: purifier.mode },
              { label: 'Filter Life', value: `${purifier.filterLife}%` },
              { label: 'Status', value: purifier.isOn ? 'Running' : 'Standby' },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderTop: `1px solid ${c.border}` }}>
                <span style={{ fontSize: 12, color: c.muted }}>{row.label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{row.value}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* BOTTOM ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
              <Shield size={16} color={c.green} />
              <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>Health Recommendations</span>
            </div>
            <div style={{ padding: '10px 14px', borderRadius: 10, background: aqiMeta.bg, border: `1px solid ${aqiMeta.ring}`, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <CheckCircle size={13} color={aqiMeta.color} />
              <span style={{ fontSize: 12.5, color: aqiMeta.color, fontWeight: 500 }}>
                {cur?.aqi > 0 ? (
                  aqiMeta.label === 'Good' ? 'Great air quality — outdoor activities are safe.' :
                  aqiMeta.label === 'Moderate' ? 'Acceptable — sensitive groups should be cautious.' :
                  aqiMeta.label === 'Unhealthy' ? 'Wear a mask outdoors, limit exposure time.' :
                  'Stay indoors, run purifier on full speed.'
                ) : (
                  'Waiting for ESP32 data...'
                )}
              </span>
            </div>
            {[
              'Monitor AQI before outdoor activities',
              'Keep windows closed at peak pollution hours',
              'Use N95 mask when AQI is above 100',
              'Run air purifier continuously indoors',
            ].map((tip, i) => (
              <motion.div key={i} whileHover={{ x: 5 }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0', borderTop: `1px solid ${c.border}`, cursor: 'pointer' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: c.green, flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, color: c.sub }}>{tip}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 18 }}>
              <BarChart3 size={16} color={c.green} />
              <span style={{ fontSize: 14, fontWeight: 600, color: c.text }}>Pollutant Analysis</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0 }}>
              {['Pollutant', 'Current', 'Safe Limit', 'Status'].map(h => (
                <div key={h} style={{ fontSize: 10, fontWeight: 600, color: c.muted, letterSpacing: '0.5px', textTransform: 'uppercase', padding: '0 0 10px', borderBottom: `1px solid ${c.border}` }}>{h}</div>
              ))}
            </div>

            {[
              { name: 'CO₂', icon: Wind, value: Math.round(cur?.co2 || 0), limit: 1000, unit: 'ppm' },
              { name: 'CO', icon: Flame, value: Number((cur?.co || 0).toFixed(1)), limit: 50, unit: 'ppm' },
              { name: 'AQI', icon: Gauge, value: cur?.aqi || 0, limit: 100, unit: '' },
              { name: 'Humidity', icon: Droplets, value: cur?.humidity || 0, limit: 80, unit: '%' },
            ].map((row, i) => {
              const safe = row.value < row.limit;
              return (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 0, borderBottom: `1px solid ${c.border}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '12px 0' }}>
                    <row.icon size={13} color={c.green} />
                    <span style={{ fontSize: 12.5, color: c.text, fontWeight: 500 }}>{row.name}</span>
                  </div>
                  <div style={{ padding: '12px 0', fontSize: 12.5, color: c.text, fontWeight: 600 }}>
                    {row.value > 0 ? `${row.value} ${row.unit}` : '--'}
                  </div>
                  <div style={{ padding: '12px 0', fontSize: 12, color: c.muted }}>≤ {row.limit} {row.unit}</div>
                  <div style={{ padding: '12px 0' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 20, background: row.value > 0 ? (safe ? c.greenDim : 'rgba(239,68,68,0.1)') : c.border, color: row.value > 0 ? (safe ? c.green : '#ef4444') : c.muted, border: `1px solid ${row.value > 0 ? (safe ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)') : c.border}` }}>
                      {row.value > 0 ? (safe ? 'Safe' : 'High') : '--'}
                    </span>
                  </div>
                </div>
              );
            })}

            <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 10, background: c.card2, display: 'flex', alignItems: 'center', gap: 10 }}>
              <Zap size={12} color={c.green} />
              <span style={{ fontSize: 11, color: c.muted }}>
                {isEspConnected ? 'Data refreshes every 3 seconds from ESP32' : 'Waiting for ESP32 connection...'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  // ============================================================
  // ========== MAIN RENDER ==========
  // ============================================================
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: c.bg, fontFamily: "'Inter', -apple-system, sans-serif", transition: 'background 0.3s' }}>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: 240, background: c.sidebar, borderRight: `1px solid ${c.border}`, display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 40, transition: 'background 0.3s' }}>
        <div style={{ padding: '24px 20px 20px', borderBottom: `1px solid ${c.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: c.greenDim, border: `1px solid rgba(34,197,94,0.2)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf size={18} color={c.green} />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: c.text, letterSpacing: '-0.3px' }}>Atmoscan</div>
              <div style={{ fontSize: 10, color: c.muted, letterSpacing: '0.3px' }}>AIR QUALITY</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {navItems.map(item => (
            <motion.button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              whileHover={{ x: 3 }} 
              whileTap={{ scale: 0.98 }}
              style={{ 
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', 
                borderRadius: 9, border: 'none', cursor: 'pointer', 
                background: activeTab === item.id ? c.accentDim : 'transparent', 
                width: '100%', textAlign: 'left', transition: 'all 0.15s' 
              }}
            >
              <item.icon size={16} color={activeTab === item.id ? c.accent : c.muted} strokeWidth={activeTab === item.id ? 2.2 : 1.8} />
              <span style={{ fontSize: 13.5, fontWeight: activeTab === item.id ? 600 : 400, color: activeTab === item.id ? c.accent : c.sub }}>
                {item.label}
              </span>
              {activeTab === item.id && (
                <motion.div layoutId="pill" style={{ marginLeft: 'auto', width: 4, height: 4, borderRadius: 2, background: c.accent }} />
              )}
            </motion.button>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: `1px solid ${c.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: c.card2, marginBottom: 10 }}>
            <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }}
              style={{ width: 7, height: 7, borderRadius: '50%', background: isEspConnected ? c.green : '#ef4444', flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 12, fontWeight: 500, color: c.text }}>{isEspConnected ? 'ESP32 Online' : 'ESP32 Offline'}</div>
              <div style={{ fontSize: 10, color: c.muted, marginTop: 1 }}>Real-time Data</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 9, background: c.greenDim }}>
            <BatteryFull size={13} color={c.green} />
            <span style={{ fontSize: 12, color: c.green, fontWeight: 500 }}>Filter {purifier.filterLife}%</span>
            <div style={{ flex: 1, height: 3, background: 'rgba(34,197,94,0.2)', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{ width: `${purifier.filterLife}%`, height: '100%', background: c.green, borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 30, background: c.header, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${c.border}`, padding: '0 32px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: 16, fontWeight: 700, color: c.text }}>
              {activeTab === 'overview' ? 'Dashboard' : activeTab === 'analytics' ? 'Analytics' : activeTab === 'devices' ? 'Devices' : 'Settings'}
            </span>
            <span style={{ fontSize: 13, color: c.muted, marginLeft: 10 }}>
              {activeTab === 'overview' ? 'Real-time air quality' : activeTab === 'analytics' ? 'Data analysis' : activeTab === 'devices' ? 'Device management' : 'Settings'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', background: c.card2, borderRadius: 20, border: `1px solid ${c.border}` }}>
              {isEspConnected ? <Wifi size={11} color={c.green} /> : <WifiOff size={11} color="#ef4444" />}
              <span style={{ fontSize: 11, fontWeight: 600, color: isEspConnected ? c.green : '#ef4444', letterSpacing: '0.3px' }}>
                {isEspConnected ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: c.card2, borderRadius: 20, border: `1px solid ${c.border}` }}>
              <Clock size={11} color={c.muted} />
              <span style={{ fontSize: 11, color: c.muted }}>{lastUpdate.toLocaleTimeString()}</span>
            </div>
            <motion.button onClick={fetchData} whileHover={{ rotate: 180 }} whileTap={{ scale: 0.9 }} transition={{ duration: 0.3 }}
              style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.card2, border: `1px solid ${c.border}`, borderRadius: 9, cursor: 'pointer' }}>
              <RefreshCw size={13} color={c.muted} />
            </motion.button>

            {/* Notification Button */}
            <div style={{ position: 'relative' }}>
              <motion.button 
                onClick={() => setShowNotifications(!showNotifications)}
                whileTap={{ scale: 0.9 }}
                style={{ 
                  width: 34, height: 34, 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  background: showNotifications ? c.accentDim : c.card2, 
                  border: `1px solid ${showNotifications ? c.accent : c.border}`, 
                  borderRadius: 9, cursor: 'pointer', position: 'relative' 
                }}
              >
                <Bell size={13} color={showNotifications ? c.accent : c.muted} />
                {unreadCount > 0 && (
                  <span style={{ 
                    position: 'absolute', top: -2, right: -2,
                    width: 16, height: 16, borderRadius: '50%',
                    background: '#ef4444', color: '#fff', fontSize: 9,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700
                  }}>
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div style={{
                  position: 'absolute', top: 40, right: 0,
                  width: 320, maxHeight: 400, overflowY: 'auto',
                  background: c.card, border: `1px solid ${c.border}`,
                  borderRadius: 12, boxShadow: '0 16px 48px rgba(0,0,0,0.3)',
                  zIndex: 100, padding: '8px 0'
                }}>
                  <div style={{ 
                    display: 'flex', justifyContent: 'space-between', 
                    padding: '10px 16px', borderBottom: `1px solid ${c.border}`,
                    position: 'sticky', top: 0, background: c.card, zIndex: 1
                  }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: c.text }}>Notifications</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} style={{ 
                        background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 11, color: c.accent, fontWeight: 500
                      }}>
                        Mark all read
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: c.muted, fontSize: 12 }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <motion.div 
                        key={notif.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          padding: '10px 16px',
                          borderBottom: `1px solid ${c.border}`,
                          background: notif.read ? 'transparent' : `${notif.type === 'danger' ? 'rgba(239,68,68,0.06)' : notif.type === 'warning' ? 'rgba(234,179,8,0.06)' : 'rgba(34,197,94,0.06)'}`,
                          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                            {notif.type === 'danger' && <AlertTriangle size={12} color="#ef4444" />}
                            {notif.type === 'warning' && <AlertTriangle size={12} color="#eab308" />}
                            {notif.type === 'success' && <CheckCircle size={12} color="#22c55e" />}
                            <span style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{notif.title}</span>
                          </div>
                          <p style={{ fontSize: 11, color: c.muted, margin: 0 }}>{notif.message}</p>
                          <span style={{ fontSize: 9, color: c.muted, opacity: 0.6 }}>
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <button 
                          onClick={() => deleteNotification(notif.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.muted, fontSize: 12 }}
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>

            <motion.button onClick={toggleTheme} whileTap={{ scale: 0.9 }}
              style={{ width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.card2, border: `1px solid ${c.border}`, borderRadius: 9, cursor: 'pointer' }}>
              {dark ? <Sun size={13} color="#fbbf24" /> : <Moon size={13} color={c.accent} />}
            </motion.button>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: '28px 32px', maxWidth: 1280, width: '100%' }}>
          {activeTab === 'overview' && <OverviewView />}
          {activeTab === 'analytics' && <AnalyticsView />}
          {activeTab === 'devices' && <DevicesView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${c.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 32px 20px' }}>
          <span style={{ fontSize: 11, color: c.muted }}>© 2025 Atmoscan · BAIUST · IoT Air Monitoring System</span>
          <span style={{ fontSize: 11, color: c.muted }}>
            {isEspConnected ? '🟢 ESP32 Online' : '🔴 ESP32 Offline'} · Next.js
          </span>
        </div>
      </main>
    </div>
  );
}