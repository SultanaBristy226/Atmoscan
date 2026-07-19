'use client';

import { useEffect, useState } from 'react';
import { 
  Activity, Wind, TrendingUp, Clock, Wifi, WifiOff, 
  RefreshCw, Menu, X, Gauge, Flame, Leaf, BatteryFull, 
  Sun, Moon, Cpu
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(true);
  const [sidebar, setSidebar] = useState(false);

  const fetchData = () => {
    fetch('/api/air-quality')
      .then(res => res.json())
      .then(json => {
        setData(json.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Theme colors
  const bg = dark ? '#0a0a0f' : '#f5f5f5';
  const cardBg = dark ? '#0d1117' : '#ffffff';
  const border = dark ? '#1f2937' : '#e5e7eb';
  const text = dark ? '#ffffff' : '#1f2937';
  const sub = dark ? '#6b7280' : '#9ca3af';
  const headerBg = dark ? 'rgba(13,17,23,0.95)' : 'rgba(255,255,255,0.95)';

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: bg }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(168,85,247,0.2)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const current = data?.current;
  const purifier = data?.purifier;
  const history = data?.history || [];
  const maxAQI = Math.max(...history.map((d: any) => d.aqi), 150);

  return (
    <div style={{ minHeight: '100vh', background: bg, color: text, transition: 'all 0.3s' }}>
      {/* Header */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: `1px solid ${border}`,
        background: headerBg,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setSidebar(!sidebar)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: text }}>
            <Menu size={20} />
          </button>
          <Leaf size={22} color="#a855f7" />
          <span style={{ fontSize: 18, fontWeight: 700 }}>Atmoscan</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Theme Toggle Button - কাজ করবে! */}
          <button
            onClick={() => setDark(!dark)}
            style={{
              padding: '6px 12px',
              background: border,
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              color: text
            }}
          >
            {dark ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#a855f7" />}
            <span style={{ fontSize: 12 }}>{dark ? 'Light' : 'Dark'}</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: border, borderRadius: 20, fontSize: 12 }}>
            <Wifi size={12} color="#10b981" />
            <span>Live</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px', background: border, borderRadius: 20, fontSize: 12, color: sub }}>
            <Clock size={12} />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
          <button onClick={fetchData} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6 }}>
            <RefreshCw size={16} color="#a78bfa" />
          </button>
        </div>
      </header>

      {/* Sidebar */}
      {sidebar && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 260,
          height: '100vh',
          background: cardBg,
          borderRight: `1px solid ${border}`,
          zIndex: 50,
          padding: '24px 20px'
        }}>
          <button onClick={() => setSidebar(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', float: 'right', color: text }}>
            <X size={20} />
          </button>
          <div style={{ marginTop: 40 }}>
            {['Dashboard', 'Analytics', 'Devices', 'Settings'].map((item, i) => (
              <div key={i} style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 4, cursor: 'pointer', background: i === 0 ? 'rgba(168,85,247,0.15)' : 'transparent', color: i === 0 ? '#a855f7' : sub }}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px' }}>
        {/* 4 Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 }}>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: sub, textTransform: 'uppercase' }}>AQI</p>
            <p style={{ fontSize: 32, fontWeight: 600, color: text }}>{current?.aqi || '--'}</p>
            <p style={{ fontSize: 12, color: '#a855f7' }}>{current?.level || '--'}</p>
          </div>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: sub, textTransform: 'uppercase' }}>CO₂</p>
            <p style={{ fontSize: 32, fontWeight: 600, color: text }}>{Math.round(current?.co2 || 0)}</p>
            <p style={{ fontSize: 11, color: sub }}>ppm</p>
          </div>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: sub, textTransform: 'uppercase' }}>CO</p>
            <p style={{ fontSize: 32, fontWeight: 600, color: text }}>{Math.round(current?.co || 0)}</p>
            <p style={{ fontSize: 11, color: sub }}>ppm</p>
          </div>
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: 20, textAlign: 'center' }}>
            <p style={{ fontSize: 12, color: sub, textTransform: 'uppercase' }}>Environment</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
              <div><p style={{ fontSize: 20, fontWeight: 600, color: text }}>{current?.temperature || '--'}°</p><p style={{ fontSize: 10, color: sub }}>Temp</p></div>
              <div><p style={{ fontSize: 20, fontWeight: 600, color: text }}>{current?.humidity || '--'}%</p><p style={{ fontSize: 10, color: sub }}>Humidity</p></div>
            </div>
          </div>
        </div>

        {/* Purifier */}
        {purifier && (
          <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: 20, marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Cpu size={18} color="#a855f7" />
              <h3 style={{ fontSize: 14, color: sub, textTransform: 'uppercase' }}>Purifier Status</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: sub }}>Fan:</span><span style={{ color: purifier.isOn ? '#10b981' : '#6b7280' }}>{purifier.isOn ? '● ON' : '○ OFF'}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span style={{ color: sub }}>Speed:</span><div style={{ flex: 1, height: 4, background: '#1f2937', borderRadius: 2, margin: '0 12px' }}><div style={{ width: `${purifier.fanSpeed}%`, height: '100%', background: '#a855f7', borderRadius: 2 }} /></div><span>{purifier.fanSpeed}%</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: sub }}>Mode:</span><span>{purifier.mode}</span></div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: 20, marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <TrendingUp size={18} color="#a855f7" />
            <h3 style={{ fontSize: 16, fontWeight: 600, color: text }}>24-Hour Trend</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 140, padding: '8px 0' }}>
            {history.slice(-12).map((item: any, i: number) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: '100%', height: `${(item.aqi / maxAQI) * 100}px`, background: '#a855f7', borderRadius: 3 }} />
                <span style={{ fontSize: 8, color: sub }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer style={{ textAlign: 'center', paddingTop: 20, borderTop: `1px solid ${border}`, color: sub, fontSize: 12 }}>
          <p>© 2024 Atmoscan - Smart Air Purification System</p>
          <p style={{ marginTop: 4, fontSize: 10, color: '#a855f7' }}>IoT Enabled | ESP32 | Auto Purification</p>
        </footer>
      </main>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}