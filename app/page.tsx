'use client';

import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { motion } from 'framer-motion';
import { 
  Activity, Wind, Thermometer, TrendingUp, CheckCircle, 
  Clock, Wifi, WifiOff, RefreshCw, Bell, Menu, X, 
  Gauge, Flame, Leaf, BatteryFull, Cpu, BarChart3
} from 'lucide-react';
import { DashboardData, AirQualityData } from '@/types/aqi';
import PurifierCard from '@/components/ui/PurifierCard';
import AlertMessageComponent from '@/components/ui/AlertMessage';

export default function Dashboard() {
  // ========== STATE ==========
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);

  // Socket reference
  const socketRef = useRef<Socket | null>(null);

  // ========== INIT SOCKET ==========
  useEffect(() => {
    // Initialize socket connection
    const socket = io({
      path: '/api/socket',
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setIsConnected(false);
    });

    // Receive real-time data
    socket.on('air-quality-update', (data: DashboardData) => {
      setDashboardData(data);
      setLastUpdate(new Date());
      setLoading(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // ========== MANUAL REFRESH ==========
  const refreshData = () => {
    if (socketRef.current) {
      socketRef.current.emit('request-data');
    }
  };

  // ========== LOADING ==========
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} style={styles.spinner} />
        <p style={styles.loadingText}>Connecting to Atmoscan...</p>
      </div>
    );
  }

  const currentData = dashboardData?.current;
  const purifier = dashboardData?.purifier;
  const alert = dashboardData?.alert;
  const historyData = dashboardData?.history || [];
  const maxAQI = Math.max(...historyData.map((d: AirQualityData) => d.aqi), 150);

  return (
    <div style={styles.appContainer}>
      {/* Particles Background */}
      <div style={styles.particlesBg}>
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            style={{ ...styles.particle, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* Menu Button */}
      <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.menuBtn}>
        <Menu size={20} color="#fff" />
      </button>

      {/* Sidebar */}
      {sidebarOpen && <div style={styles.overlay} onClick={() => setSidebarOpen(false)} />}
      <motion.div 
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3 }}
        style={styles.sidebar}
      >
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}><Leaf size={24} color="#a855f7" /></div>
            <span style={styles.logoText}>Atmoscan</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={styles.closeBtn}>
            <X size={18} color="#a78bfa" />
          </button>
        </div>
        <nav style={styles.sidebarNav}>
          {['Dashboard', 'Analytics', 'Devices', 'Settings'].map((item, i) => (
            <motion.button key={i} style={styles.navItem} whileHover={{ x: 6, background: 'rgba(168,85,247,0.15)' }}>
              {i === 0 && <Activity size={18} color="#a78bfa" />}
              {i === 1 && <BarChart3 size={18} color="#a78bfa" />}
              {i === 2 && <Cpu size={18} color="#a78bfa" />}
              {i === 3 && <Gauge size={18} color="#a78bfa" />}
              <span>{item}</span>
            </motion.button>
          ))}
        </nav>
        <div style={styles.sidebarFooter}>
          <div style={styles.statusRow}>
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} style={styles.statusDot} />
            <span style={{ color: isConnected ? '#10b981' : '#6b7280' }}>
              {isConnected ? 'Live' : 'Offline'}
            </span>
          </div>
          <div style={styles.batteryRow}>
            <BatteryFull size={14} color="#a855f7" />
            <span>94%</span>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Real-time air quality monitoring</p>
          </div>
          <div style={styles.headerRight}>
            <div style={{ ...styles.statusBadge, borderColor: isConnected ? '#10b981' : '#f44336' }}>
              <div style={{ ...styles.statusDot, background: isConnected ? '#10b981' : '#f44336' }} />
              <span style={{ color: isConnected ? '#10b981' : '#f44336' }}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            <div style={styles.timeBadge}>
              <Clock size={12} color="#a78bfa" />
              <span>{lastUpdate.toLocaleTimeString()}</span>
            </div>
            <motion.button onClick={refreshData} style={styles.iconBtn} whileHover={{ rotate: 180 }}>
              <RefreshCw size={16} color="#a78bfa" />
            </motion.button>
            <motion.button style={styles.iconBtn} whileHover={{ scale: 1.1 }}>
              <Bell size={16} color="#a78bfa" />
            </motion.button>
          </div>
        </header>

        {/* Alert Message */}
        {alert && showAlert && (
          <AlertMessageComponent alert={alert} onClose={() => setShowAlert(false)} />
        )}

        {/* 4 Cards Grid */}
        <div style={styles.cardsGrid}>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} whileHover={{ y: -6 }} style={styles.card}>
            <p style={styles.cardLabel}>Air Quality Status</p>
            <p style={{ ...styles.cardValue, color: '#a855f7' }}>{currentData?.aqi || '--'}</p>
            <p style={styles.cardSub}>{currentData?.level || '--'}</p>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} whileHover={{ y: -6 }} style={styles.card}>
            <p style={styles.cardLabel}>Temperature</p>
            <p style={styles.cardValue}>{currentData?.temperature || '--'}°</p>
            <p style={styles.cardUnit}>Celsius</p>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} whileHover={{ y: -6 }} style={styles.card}>
            <p style={styles.cardLabel}>Humidity</p>
            <p style={styles.cardValue}>{currentData?.humidity || '--'}%</p>
            <p style={styles.cardUnit}>Relative Humidity</p>
          </motion.div>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }} whileHover={{ y: -6 }} style={styles.card}>
            <p style={styles.cardLabel}>CO₂</p>
            <p style={styles.cardValue}>{Math.round(currentData?.co2 || 0)}</p>
            <p style={styles.cardUnit}>ppm</p>
          </motion.div>
        </div>

        {/* Purifier Status Card */}
        {purifier && <PurifierCard purifier={purifier} />}

        {/* Chart Section */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.35 }} style={styles.chartCard}>
          <div style={styles.chartHeader}>
            <TrendingUp size={18} color="#a855f7" />
            <h3 style={styles.chartTitle}>24-Hour Air Quality Trend</h3>
            <div style={{ ...styles.liveBadge, borderColor: isConnected ? '#10b981' : '#f44336' }}>
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }} 
                transition={{ duration: 1, repeat: Infinity }} 
                style={{ ...styles.liveDot, background: isConnected ? '#10b981' : '#f44336' }} 
              />
              <span>LIVE</span>
            </div>
          </div>
          <div style={styles.chart}>
            {historyData.slice(-12).map((item: AirQualityData, idx: number) => (
              <div key={idx} style={styles.chartBar}>
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.aqi / maxAQI) * 100}px` }}
                  transition={{ delay: idx * 0.02 }}
                  style={{ ...styles.bar, background: '#a855f7' }}
                />
                <span style={styles.chartTime}>
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>© 2024 Atmoscan - Smart Air Purification System</p>
          <p style={styles.footerSub}>IoT Enabled | ESP32 | Auto Purification | Real-time</p>
        </footer>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .menuBtn { display: flex !important; }
          .cardsGrid { grid-template-columns: repeat(2, 1fr) !important; gap: 12px !important; }
        }
      `}</style>
    </div>
  );
}

const styles: any = {
  appContainer: { minHeight: '100vh', background: '#0a0a0f', position: 'relative' },
  particlesBg: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 0 },
  particle: { position: 'absolute', width: 3, height: 3, background: '#a855f7', borderRadius: '50%', opacity: 0.2 },
  loadingContainer: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f' },
  spinner: { width: 40, height: 40, border: '3px solid rgba(168,85,247,0.2)', borderTopColor: '#a855f7', borderRadius: '50%', animation: 'spin 1s linear infinite' },
  loadingText: { marginTop: 16, color: '#a78bfa' },
  menuBtn: { position: 'fixed', top: 20, left: 20, zIndex: 60, background: '#a855f7', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', display: 'none' },
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 45 },
  sidebar: { position: 'fixed', top: 0, left: 0, width: 270, height: '100vh', background: '#0d1117', borderRight: '1px solid #1f2937', zIndex: 50, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  sidebarHeader: { padding: '24px 20px', borderBottom: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', gap: 12 },
  logoIcon: { width: 40, height: 40, background: 'rgba(168,85,247,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 18, fontWeight: 700, color: '#fff' },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  sidebarNav: { padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'none', border: 'none', borderRadius: 10, cursor: 'pointer', fontSize: 14, color: '#e2e8f0', width: '100%' },
  sidebarFooter: { padding: '20px', borderTop: '1px solid #1f2937' },
  statusRow: { display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', marginBottom: 12, fontSize: 12 },
  statusDot: { width: 8, height: 8, borderRadius: '50%' },
  batteryRow: { display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center', color: '#a78bfa', fontSize: 12 },
  main: { maxWidth: 1100, margin: '0 auto', padding: '20px 24px', position: 'relative', zIndex: 1 },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 },
  title: { fontSize: 24, fontWeight: 600, background: 'linear-gradient(135deg, #fff, #a855f7)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  subtitle: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  headerRight: { display: 'flex', alignItems: 'center', gap: 10 },
  statusBadge: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#1f2937', borderRadius: 20, fontSize: 12, border: '1px solid' },
  timeBadge: { display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', background: '#1f2937', borderRadius: 20, fontSize: 12, color: '#a78bfa' },
  iconBtn: { padding: 8, background: '#1f2937', border: 'none', borderRadius: 10, cursor: 'pointer' },
  cardsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 28 },
  card: { background: '#0d1117', borderRadius: 16, padding: 20, textAlign: 'center', border: '1px solid #1f2937', transition: 'all 0.3s', cursor: 'pointer' },
  cardLabel: { fontSize: 12, color: '#6b7280', marginBottom: 8, textTransform: 'uppercase' },
  cardValue: { fontSize: 32, fontWeight: 600, color: '#fff' },
  cardSub: { fontSize: 12, marginTop: 4, color: '#a855f7' },
  cardUnit: { fontSize: 11, color: '#6b7280', marginTop: 2 },
  chartCard: { background: '#0d1117', borderRadius: 16, padding: 20, marginBottom: 28, border: '1px solid #1f2937' },
  chartHeader: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 },
  chartTitle: { fontSize: 16, fontWeight: 600, color: '#fff', flex: 1 },
  liveBadge: { display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 20, fontSize: 10, border: '1px solid' },
  liveDot: { width: 6, height: 6, borderRadius: '50%' },
  chart: { display: 'flex', alignItems: 'flex-end', gap: 6, height: 160, padding: '8px 0' },
  chartBar: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  bar: { width: '100%', borderRadius: 3 },
  chartTime: { fontSize: 9, color: '#6b7280' },
  footer: { textAlign: 'center', paddingTop: 20, borderTop: '1px solid #1f2937', color: '#6b7280', fontSize: 12, marginTop: 20 },
  footerSub: { marginTop: 6, fontSize: 11, color: '#a855f7' }
};