'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Activity, Wind, Thermometer, Droplets, 
  TrendingUp, AlertTriangle, CheckCircle, 
  Clock, Wifi, WifiOff, RefreshCw, Bell,
  Home, BarChart3, Settings, HelpCircle,
  Menu, X, Gauge, Flame, ArrowUpRight,
  Cpu, Cloud, Zap, LineChart, Leaf,
  Sparkles, Shield, Award, BatteryFull
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
  const [particles, setParticles] = useState<Array<{x: number, y: number, id: number}>>([]);
  
  // Mouse follow effect for cards
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  
  const fetchData = async () => {
    try {
      const response = await fetch('/api/air-quality');
      const data = await response.json();
      setCurrentData(data.current);
      setHistoryData(data.history || []);
      setLastUpdate(new Date());
      setIsConnected(true);
    } catch (error) {
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
  
  // Generate particles for background effect
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 30; i++) {
      newParticles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        id: i,
      });
    }
    setParticles(newParticles);
  }, []);
  
  const getAQIInfo = (aqi: number) => {
    if (aqi <= 50) return { level: 'Good', color: '#4caf50', bg: 'rgba(76,175,80,0.15)', border: 'rgba(76,175,80,0.3)', icon: CheckCircle };
    if (aqi <= 100) return { level: 'Moderate', color: '#ffc107', bg: 'rgba(255,193,7,0.15)', border: 'rgba(255,193,7,0.3)', icon: Activity };
    if (aqi <= 150) return { level: 'Unhealthy', color: '#ff9800', bg: 'rgba(255,152,0,0.15)', border: 'rgba(255,152,0,0.3)', icon: AlertTriangle };
    return { level: 'Hazardous', color: '#f44336', bg: 'rgba(244,67,54,0.15)', border: 'rgba(244,67,54,0.3)', icon: Zap };
  };
  
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        {/* Animated Background Particles */}
        <div style={styles.particlesContainer}>
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              style={{
                position: 'absolute',
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: 4,
                height: 4,
                background: '#4caf50',
                borderRadius: '50%',
                opacity: 0.3,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={styles.spinner}
        />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          style={styles.loadingText}
        >
          Initializing Atmoscan System...
        </motion.p>
        
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 200 }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={styles.loadingBar}
        />
      </div>
    );
  }
  
  const aqiInfo = getAQIInfo(currentData?.aqi || 0);
  const AQIIcon = aqiInfo.icon;
  const maxAQI = Math.max(...historyData.map(d => d.aqi), 150);
  const maxCO2 = Math.max(...historyData.map(d => d.co2), 500);
  
  // Card variants for stagger animation
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 100,
      },
    }),
  };
  
  return (
    <div style={styles.appContainer}>
      {/* Animated Background Particles */}
      <div style={styles.particlesBg}>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            style={{
              position: 'absolute',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: 2,
              height: 2,
              background: '#4caf50',
              borderRadius: '50%',
              opacity: 0.2,
            }}
            animate={{
              y: [0, -50, 0],
              x: [0, 20, -20, 0],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
      
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 25 }}
        style={{ ...styles.sidebar, width: sidebarOpen ? 280 : 80 }}
      >
        <div style={styles.sidebarHeader}>
          <motion.div 
            style={styles.logoContainer}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <motion.div 
              style={styles.logoIcon}
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                repeatDelay: 5,
              }}
            >
              <Leaf size={22} color="#ffffff" />
            </motion.div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span style={styles.logoText}>Atmoscan</span>
                <span style={styles.logoSub}>Air Quality</span>
              </motion.div>
            )}
          </motion.div>
          <motion.button 
            onClick={() => setSidebarOpen(!sidebarOpen)} 
            style={styles.sidebarToggle}
            whileHover={{ scale: 1.1, rotate: 180 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            {sidebarOpen ? <X size={18} color="#ffffff" /> : <Menu size={18} color="#ffffff" />}
          </motion.button>
        </div>
        
        <nav style={styles.sidebarNav}>
          {[
            { id: 'overview', icon: Home, label: 'Overview' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'devices', icon: Cpu, label: 'Devices' },
            { id: 'settings', icon: Settings, label: 'Settings' },
            { id: 'help', icon: HelpCircle, label: 'Help' },
          ].map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05, type: "spring" }}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navItem,
                ...(activeTab === item.id ? styles.navItemActive : {}),
                justifyContent: sidebarOpen ? 'flex-start' : 'center'
              }}
              whileHover={{ 
                x: 8, 
                background: 'rgba(76,175,80,0.15)',
                transition: { type: "spring", stiffness: 400 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={activeTab === item.id ? {
                  scale: [1, 1.2, 1],
                } : {}}
                transition={{ duration: 0.5 }}
              >
                <item.icon size={18} color={activeTab === item.id ? '#4caf50' : 'rgba(255,255,255,0.6)'} />
              </motion.div>
              {sidebarOpen && <span style={styles.navLabel}>{item.label}</span>}
              {activeTab === item.id && sidebarOpen && (
                <motion.div
                  layoutId="activeIndicator"
                  style={styles.activeIndicator}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </nav>
        
        <motion.div 
          style={styles.sidebarFooter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div style={styles.systemStatus}>
            <motion.div 
              style={styles.statusDot}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <span style={styles.systemText}>System Online</span>
          </div>
          <motion.div 
            style={styles.batteryStatus}
            whileHover={{ scale: 1.05 }}
          >
            <BatteryFull size={14} color="#4caf50" />
            <span style={styles.batteryText}>100%</span>
          </motion.div>
        </motion.div>
      </motion.aside>
      
      {/* Main Content */}
      <main style={{ ...styles.mainContent, marginLeft: sidebarOpen ? 280 : 80 }}>
        {/* Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
          style={styles.header}
        >
          <div style={styles.headerLeft}>
            <motion.h1 
              style={styles.headerTitle}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Dashboard
            </motion.h1>
            <motion.p 
              style={styles.headerSubtitle}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Real-time air quality monitoring
            </motion.p>
          </div>
          
          <div style={styles.headerRight}>
            <motion.div 
              style={styles.statusBadge}
              whileHover={{ scale: 1.05 }}
              animate={{ 
                boxShadow: isConnected ? ['0 0 0 0 rgba(76,175,80,0.4)', '0 0 0 10px rgba(76,175,80,0)'] : [],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {isConnected ? <Wifi size={12} color="#4caf50" /> : <WifiOff size={12} color="#f44336" />}
              <span style={{ ...styles.statusText, color: isConnected ? '#4caf50' : '#f44336' }}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </motion.div>
            
            <motion.div 
              style={styles.timeBadge}
              whileHover={{ scale: 1.05 }}
            >
              <Clock size={12} color="#8892b0" />
              <span style={styles.timeText}>{lastUpdate.toLocaleTimeString()}</span>
            </motion.div>
            
            <motion.button 
              onClick={fetchData} 
              style={styles.iconButton}
              whileHover={{ rotate: 180, background: 'rgba(76,175,80,0.2)' }}
              whileTap={{ scale: 0.9 }}
              animate={{ rotate: 0 }}
            >
              <RefreshCw size={16} color="#64ffda" />
            </motion.button>
            
            <motion.div style={{ position: 'relative' }}>
              <motion.button 
                style={styles.iconButton}
                whileHover={{ scale: 1.1, background: 'rgba(76,175,80,0.2)' }}
                whileTap={{ scale: 0.9 }}
                animate={{ 
                  boxShadow: notificationCount > 0 ? ['0 0 0 0 rgba(76,175,80,0.4)', '0 0 0 10px rgba(76,175,80,0)'] : [],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Bell size={16} color="#64ffda" />
              </motion.button>
              {notificationCount > 0 && (
                <motion.div 
                  style={styles.notificationBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <span style={styles.notificationText}>{notificationCount}</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.header>
        
        <div style={styles.contentArea}>
          {/* Stats Grid with Stagger Animation */}
          <div style={styles.statsGrid}>
            {[
              {
                title: 'Air Quality Index',
                value: currentData?.aqi || '--',
                unit: '',
                icon: Gauge,
                color: aqiInfo.color,
                bg: aqiInfo.bg,
                subValue: aqiInfo.level,
              },
              {
                title: 'Carbon Dioxide',
                value: Math.round(currentData?.co2 || 0),
                unit: 'ppm',
                icon: Wind,
                color: '#4caf50',
                bg: 'rgba(76,175,80,0.1)',
                progress: Math.min((currentData?.co2 || 0) / 20, 100),
                safeLimit: 'Safe: 1000 ppm',
              },
              {
                title: 'Carbon Monoxide',
                value: Math.round(currentData?.co || 0),
                unit: 'ppm',
                icon: Flame,
                color: '#ff9800',
                bg: 'rgba(255,152,0,0.1)',
                progress: Math.min((currentData?.co || 0) * 2, 100),
                safeLimit: 'Safe: 50 ppm',
              },
              {
                title: 'Environment',
                value: `${currentData?.temperature || '--'}° / ${currentData?.humidity || '--'}%`,
                unit: '',
                icon: Cloud,
                color: '#64ffda',
                bg: 'rgba(100,255,218,0.1)',
                isDouble: true,
                temp: currentData?.temperature,
                humidity: currentData?.humidity,
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                custom={idx}
                initial="hidden"
                animate="visible"
                variants={cardVariants}
                style={{ ...styles.statCard, borderColor: item.bg?.replace('0.1', '0.3') }}
                whileHover={{ 
                  y: -8,
                  boxShadow: `0 20px 40px rgba(0,0,0,0.3), 0 0 20px ${item.color}20`,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <div style={styles.statCardHeader}>
                  <div>
                    <p style={styles.statLabel}>{item.title}</p>
                    {item.isDouble ? (
                      <div style={styles.environmentValues}>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.1, type: "spring" }}
                        >
                          <p style={styles.statValue}>{item.temp || '--'}°</p>
                          <p style={styles.statUnit}>Temp</p>
                        </motion.div>
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: idx * 0.1 + 0.05, type: "spring" }}
                        >
                          <p style={styles.statValue}>{item.humidity || '--'}%</p>
                          <p style={styles.statUnit}>Humidity</p>
                        </motion.div>
                      </div>
                    ) : (
                      <>
                        <motion.p 
                          key={item.value}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 500 }}
                          style={{ ...styles.statValue, color: item.color }}
                        >
                          {item.value}
                        </motion.p>
                        {item.unit && <p style={styles.statUnit}>{item.unit}</p>}
                        {item.subValue && (
                          <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ ...styles.statSubValue, color: item.color }}
                          >
                            {item.subValue}
                          </motion.p>
                        )}
                      </>
                    )}
                  </div>
                  <motion.div 
                    style={{ ...styles.statIconWrapper, background: item.bg }}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <item.icon size={28} color={item.color} />
                  </motion.div>
                </div>
                {item.progress !== undefined && (
                  <>
                    <div style={styles.progressBar}>
                      <motion.div 
                        style={{ ...styles.progressFill, width: `${item.progress}%`, background: item.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${item.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: idx * 0.1 }}
                      />
                    </div>
                    <motion.p 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.1 + 0.3 }}
                      style={styles.safeText}
                    >
                      ✓ {item.safeLimit}
                    </motion.p>
                  </>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Chart Section with Animated Graph */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            style={styles.chartCard}
            whileHover={{ boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}
          >
            <div style={styles.cardHeader}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <TrendingUp size={18} color="#64ffda" />
              </motion.div>
              <h3 style={styles.cardTitle}>24-Hour Air Quality Trend</h3>
              <motion.div
                style={styles.liveBadge}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span style={styles.liveText}>LIVE</span>
              </motion.div>
            </div>
            
            <div style={styles.svgContainer}>
              <svg width="100%" height="280" viewBox="0 0 800 280" preserveAspectRatio="none" style={styles.svg}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <line key={`grid-${i}`} x1="40" y1={40 + i * 48} x2="760" y2={40 + i * 48} stroke="#1a202c" strokeWidth="1" strokeDasharray="4">
                    <animate attributeName="stroke-dashoffset" from="0" to="20" dur="2s" repeatCount="indefinite" />
                  </line>
                ))}
                
                <text x="30" y="45" fill="#8892b0" fontSize="10" textAnchor="end">{maxAQI}</text>
                <text x="30" y="93" fill="#8892b0" fontSize="10" textAnchor="end">{Math.round(maxAQI * 0.75)}</text>
                <text x="30" y="141" fill="#8892b0" fontSize="10" textAnchor="end">{Math.round(maxAQI * 0.5)}</text>
                <text x="30" y="189" fill="#8892b0" fontSize="10" textAnchor="end">{Math.round(maxAQI * 0.25)}</text>
                <text x="30" y="237" fill="#8892b0" fontSize="10" textAnchor="end">0</text>
                
                <defs>
                  <linearGradient id="aqiGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4caf50" stopOpacity="0.5">
                      <animate attributeName="stop-opacity" values="0.5;0.7;0.5" dur="3s" repeatCount="indefinite" />
                    </stop>
                    <stop offset="100%" stopColor="#4caf50" stopOpacity="0"/>
                  </linearGradient>
                  <linearGradient id="co2Gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff9800" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#ff9800" stopOpacity="0"/>
                  </linearGradient>
                  
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                <motion.path
                  d={generateAreaPath(historyData, maxAQI, 800, 280, 'aqi')}
                  fill="url(#aqiGradient)"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />
                
                <motion.path
                  d={generateLinePath(historyData, maxAQI, 800, 280, 'aqi')}
                  fill="none"
                  stroke="#4caf50"
                  strokeWidth="2.5"
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
                
                <motion.path
                  d={generateLinePath(historyData, maxCO2, 800, 280, 'co2')}
                  fill="none"
                  stroke="#ff9800"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeInOut" }}
                />
                
                {historyData.map((item, idx) => {
                  const x = 40 + (idx / (historyData.length - 1)) * 720;
                  const aqiY = 40 + (1 - item.aqi / maxAQI) * 200;
                  const co2Y = 40 + (1 - item.co2 / maxCO2) * 200;
                  return (
                    <g key={`point-${idx}`}>
                      <motion.circle
                        cx={x}
                        cy={aqiY}
                        r="5"
                        fill="#4caf50"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + idx * 0.02, type: "spring" }}
                        whileHover={{ r: 8, fill: '#64ffda' }}
                        onMouseEnter={() => setChartHover(idx)}
                        onMouseLeave={() => setChartHover(null)}
                      />
                      <motion.circle
                        cx={x}
                        cy={co2Y}
                        r="4"
                        fill="#ff9800"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + idx * 0.02, type: "spring" }}
                        whileHover={{ r: 6, fill: '#ffb74d' }}
                      />
                      
                      <AnimatePresence>
                        {chartHover === idx && (
                          <motion.g
                            initial={{ opacity: 0, y: -10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.8 }}
                            transition={{ type: "spring" }}
                          >
                            <rect x={x - 40} y={Math.min(aqiY, co2Y) - 50} width="80" height="45" rx="8" fill="#1a202c" stroke="#4caf50" strokeWidth="1" />
                            <text x={x} y={Math.min(aqiY, co2Y) - 40} fill="#64ffda" fontSize="9" textAnchor="middle" fontWeight="bold">AQI: {item.aqi}</text>
                            <text x={x} y={Math.min(aqiY, co2Y) - 30} fill="#ffb74d" fontSize="9" textAnchor="middle">CO₂: {Math.round(item.co2)} ppm</text>
                            <text x={x} y={Math.min(aqiY, co2Y) - 20} fill="#8892b0" fontSize="8" textAnchor="middle">{item.time}</text>
                          </motion.g>
                        )}
                      </AnimatePresence>
                    </g>
                  );
                })}
                
                {historyData.map((item, idx) => {
                  const x = 40 + (idx / (historyData.length - 1)) * 720;
                  if (idx % 3 === 0 || idx === historyData.length - 1) {
                    return (
                      <text key={`label-${idx}`} x={x} y="265" fill="#8892b0" fontSize="9" textAnchor="middle">
                        {item.time}
                      </text>
                    );
                  }
                  return null;
                })}
              </svg>
            </div>
            
            <motion.div 
              style={styles.chartLegend}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div style={styles.legendItem} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <motion.div 
                  style={styles.legendColorGreen}
                  animate={{ boxShadow: ['0 0 0 0 rgba(76,175,80,0.4)', '0 0 0 5px rgba(76,175,80,0)'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span style={styles.legendText}>AQI</span>
              </motion.div>
              <motion.div style={styles.legendItem} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <div style={styles.legendColorOrange}></div>
                <span style={styles.legendText}>CO₂ (ppm)</span>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Two Column Layout with Stagger */}
          <div style={styles.twoColumnGrid}>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
              style={styles.infoCard}
              whileHover={{ y: -5, borderColor: '#4caf50' }}
            >
              <div style={styles.cardHeader}>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Activity size={18} color="#64ffda" />
                </motion.div>
                <h3 style={styles.cardTitle}>Health Recommendations</h3>
                <motion.div
                  style={styles.recommendBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring" }}
                >
                  <Shield size={12} color="#4caf50" />
                  <span style={styles.recommendText}>AI Suggested</span>
                </motion.div>
              </div>
              
              <AnimatePresence mode="wait">
                {currentData?.aqi > 100 ? (
                  <motion.div
                    key="unhealthy"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div 
                      style={styles.alertBoxOrange}
                      whileHover={{ scale: 1.02 }}
                      animate={{ 
                        boxShadow: ['0 0 0 0 rgba(255,152,0,0.4)', '0 0 0 10px rgba(255,152,0,0)'],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <AlertTriangle size={14} color="#ff9800" />
                      <span style={styles.alertTextOrange}>Poor Air Quality Alert</span>
                    </motion.div>
                    <ul style={styles.recommendationList}>
                      {[
                        { text: 'Wear N95 mask when outdoors', icon: '😷' },
                        { text: 'Keep windows and doors closed', icon: '🚪' },
                        { text: 'Use air purifier if available', icon: '🌀' },
                        { text: 'Avoid outdoor exercise', icon: '🏠' },
                      ].map((item, i) => (
                        <motion.li
                          key={item.text}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i, type: "spring" }}
                          style={styles.recommendationItem}
                          whileHover={{ x: 8, color: '#64ffda' }}
                        >
                          <span style={{ marginRight: 8 }}>{item.icon}</span>
                          {item.text}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div
                    key="healthy"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <motion.div 
                      style={styles.alertBoxGreen}
                      whileHover={{ scale: 1.02 }}
                    >
                      <CheckCircle size={14} color="#4caf50" />
                      <span style={styles.alertTextGreen}>Good Air Quality</span>
                    </motion.div>
                    <ul style={styles.recommendationList}>
                      {[
                        { text: 'Perfect for outdoor activities', icon: '🏃' },
                        { text: 'Open windows for fresh air', icon: '🪟' },
                        { text: 'Great time for exercise', icon: '💪' },
                        { text: 'Enjoy your day outdoors', icon: '😊' },
                      ].map((item, i) => (
                        <motion.li
                          key={item.text}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i, type: "spring" }}
                          style={styles.recommendationItem}
                          whileHover={{ x: 8, color: '#64ffda' }}
                        >
                          <span style={{ marginRight: 8 }}>{item.icon}</span>
                          {item.text}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div 
                style={styles.tipFooter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles size={12} color="#8892b0" />
                <span style={styles.tipText}>Based on real-time AQI data</span>
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55, duration: 0.5, type: "spring" }}
              style={styles.infoCard}
              whileHover={{ y: -5, borderColor: '#4caf50' }}
            >
              <div style={styles.cardHeader}>
                <BarChart3 size={18} color="#64ffda" />
                <h3 style={styles.cardTitle}>Pollutant Analysis</h3>
                <motion.div
                  style={styles.exportBadge}
                  whileHover={{ scale: 1.05 }}
                >
                  <span style={styles.exportText}>Export</span>
                </motion.div>
              </div>
              
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeader}>
                    <th style={styles.th}>Pollutant</th>
                    <th style={styles.th}>Current Value</th>
                    <th style={styles.th}>Safe Limit</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'CO₂', icon: Wind, color: '#4caf50', value: currentData?.co2, limit: 1000, unit: 'ppm' },
                    { name: 'CO', icon: Flame, color: '#ff9800', value: currentData?.co, limit: 50, unit: 'ppm' },
                  ].map((pollutant, idx) => (
                    <motion.tr
                      key={pollutant.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.05, type: "spring" }}
                      style={styles.tableRow}
                      whileHover={{ background: 'rgba(76,175,80,0.05)', scale: 1.01 }}
                    >
                      <td style={styles.td}>
                        <div style={styles.pollutantCell}>
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                          >
                            <pollutant.icon size={14} color={pollutant.color} />
                          </motion.div>
                          <span>{pollutant.name}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <motion.span
                          key={pollutant.value}
                          initial={{ scale: 1.2, color: pollutant.color }}
                          animate={{ scale: 1, color: '#cbd5e1' }}
                          transition={{ duration: 0.3 }}
                        >
                          {Math.round(pollutant.value || 0)} {pollutant.unit}
                        </motion.span>
                      </td>
                      <td style={styles.td}>&lt; {pollutant.limit} {pollutant.unit}</td>
                      <td style={styles.td}>
                        <motion.span
                          initial={{ scale: 0.8 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          style={{
                            ...styles.statusBadgeSmall,
                            background: (pollutant.value || 0) < pollutant.limit ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
                            color: (pollutant.value || 0) < pollutant.limit ? '#4caf50' : '#f44336'
                          }}
                        >
                          {(pollutant.value || 0) < pollutant.limit ? (
                            <><CheckCircle size={10} style={{ marginRight: 4 }} /> Safe</>
                          ) : (
                            <><AlertTriangle size={10} style={{ marginRight: 4 }} /> Unsafe</>
                          )}
                        </motion.span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              
              <motion.div 
                style={styles.analysisFooter}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Award size={12} color="#8892b0" />
                <span style={styles.analysisText}>Data updated every 10 seconds</span>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Footer */}
          <motion.footer 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            style={styles.footer}
          >
            <p>© 2024 Atmoscan - Enterprise Air Quality Monitoring System</p>
            <motion.p 
              style={styles.footerSub}
              animate={{ color: ['#4caf50', '#64ffda', '#4caf50'] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Real-time IoT Data | Green Initiative | Cloud Sync
            </motion.p>
          </motion.footer>
        </div>
      </main>
      
      {/* Global Animation Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.2); opacity: 0; }
        }
        
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .stat-card, .info-card, .chart-card {
          animation: none;
        }
      `}</style>
    </div>
  );
}

function generateLinePath(data: any[], maxValue: number, width: number, height: number, key: string): string {
  if (!data.length) return '';
  const chartWidth = width - 80;
  const chartHeight = height - 80;
  const startX = 40;
  const startY = 40;
  let path = '';
  data.forEach((item, idx) => {
    const x = startX + (idx / (data.length - 1)) * chartWidth;
    const y = startY + (1 - item[key] / maxValue) * chartHeight;
    if (idx === 0) path += `M ${x} ${y}`;
    else path += ` L ${x} ${y}`;
  });
  return path;
}

function generateAreaPath(data: any[], maxValue: number, width: number, height: number, key: string): string {
  if (!data.length) return '';
  const chartWidth = width - 80;
  const chartHeight = height - 80;
  const startX = 40;
  const startY = 40;
  const bottomY = startY + chartHeight;
  let path = generateLinePath(data, maxValue, width, height, key);
  const lastX = startX + chartWidth;
  path += ` L ${lastX} ${bottomY} L ${startX} ${bottomY} Z`;
  return path;
}

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0a0c10',
    position: 'relative',
    overflowX: 'hidden',
  },
  particlesBg: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    zIndex: 0,
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0c10',
    position: 'relative',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  spinner: {
    width: 60,
    height: 60,
    border: '3px solid rgba(76,175,80,0.2)',
    borderTopColor: '#4caf50',
    borderRadius: '50%',
  },
  loadingText: {
    marginTop: 20,
    color: '#8892b0',
    fontSize: 14,
    zIndex: 1,
  },
  loadingBar: {
    marginTop: 20,
    height: 2,
    background: '#4caf50',
    borderRadius: 2,
  },
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    background: '#0d1117',
    borderRight: '1px solid #1a202c',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflowX: 'hidden',
    zIndex: 50,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  sidebarHeader: {
    padding: '24px 20px',
    borderBottom: '1px solid #1a202c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logoIcon: {
    width: 40,
    height: 40,
    background: 'rgba(76,175,80,0.15)',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  logoSub: {
    fontSize: 10,
    color: '#4caf50',
    display: 'block',
  },
  sidebarToggle: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarNav: {
    padding: '20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: 12,
    cursor: 'pointer',
    transition: 'all 0.2s',
    width: '100%',
    position: 'relative',
  },
  navItemActive: {
    background: 'rgba(76,175,80,0.15)',
  },
  navLabel: {
    fontSize: 14,
    fontWeight: 500,
    color: '#e2e8f0',
  },
  activeIndicator: {
    position: 'absolute',
    right: -16,
    width: 3,
    height: 20,
    background: '#4caf50',
    borderRadius: 3,
  },
  sidebarFooter: {
    padding: '20px',
    borderTop: '1px solid #1a202c',
  },
  systemStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    background: '#4caf50',
    borderRadius: '50%',
  },
  systemText: {
    fontSize: 12,
    color: '#8892b0',
  },
  batteryStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    justifyContent: 'center',
    padding: '6px 12px',
    background: 'rgba(76,175,80,0.1)',
    borderRadius: 20,
    cursor: 'pointer',
  },
  batteryText: {
    fontSize: 10,
    color: '#4caf50',
  },
  mainContent: {
    flex: 1,
    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  header: {
    position: 'sticky',
    top: 0,
    background: 'rgba(13,17,23,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #1a202c',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 40,
  },
  headerLeft: {},
  headerTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#ffffff',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8892b0',
    marginTop: 4,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    background: '#1a202c',
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 500,
  },
  timeBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '6px 14px',
    background: '#1a202c',
    borderRadius: 20,
  },
  timeText: {
    fontSize: 12,
    color: '#8892b0',
  },
  iconButton: {
    padding: 8,
    background: '#1a202c',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    background: '#f44336',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  contentArea: {
    padding: '32px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 24,
    marginBottom: 32,
  },
  statCard: {
    background: '#0d1117',
    borderRadius: 20,
    border: '1px solid #1a202c',
    padding: 24,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  statCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 12,
    color: '#8892b0',
    marginBottom: 8,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 36,
    fontWeight: 700,
    color: '#ffffff',
  },
  statSubValue: {
    fontSize: 14,
    fontWeight: 500,
    marginTop: 4,
  },
  statUnit: {
    fontSize: 11,
    color: '#8892b0',
    marginTop: 2,
  },
  statIconWrapper: {
    padding: 12,
    borderRadius: 14,
  },
  progressBar: {
    marginTop: 20,
    height: 6,
    background: '#1a202c',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
  safeText: {
    fontSize: 10,
    color: '#4caf50',
    marginTop: 10,
  },
  environmentValues: {
    display: 'flex',
    gap: 24,
    marginTop: 4,
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
    gap: 24,
    marginBottom: 32,
  },
  infoCard: {
    background: '#0d1117',
    borderRadius: 20,
    border: '1px solid #1a202c',
    padding: 24,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#ffffff',
    flex: 1,
  },
  liveBadge: {
    padding: '4px 10px',
    background: 'rgba(76,175,80,0.2)',
    borderRadius: 20,
  },
  liveText: {
    fontSize: 10,
    color: '#4caf50',
    fontWeight: 'bold',
  },
  recommendBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    padding: '4px 8px',
    background: 'rgba(76,175,80,0.1)',
    borderRadius: 12,
  },
  recommendText: {
    fontSize: 10,
    color: '#4caf50',
  },
  exportBadge: {
    padding: '4px 10px',
    background: '#1a202c',
    borderRadius: 12,
    cursor: 'pointer',
  },
  exportText: {
    fontSize: 10,
    color: '#8892b0',
  },
  alertBoxOrange: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    background: 'rgba(255,152,0,0.1)',
    borderRadius: 14,
    border: '1px solid rgba(255,152,0,0.2)',
    marginBottom: 20,
  },
  alertTextOrange: {
    fontSize: 13,
    fontWeight: 500,
    color: '#ff9800',
  },
  alertBoxGreen: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    background: 'rgba(76,175,80,0.1)',
    borderRadius: 14,
    border: '1px solid rgba(76,175,80,0.2)',
    marginBottom: 20,
  },
  alertTextGreen: {
    fontSize: 13,
    fontWeight: 500,
    color: '#4caf50',
  },
  recommendationList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  recommendationItem: {
    padding: '10px 0',
    color: '#cbd5e1',
    fontSize: 13,
    borderBottom: '1px solid #1a202c',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
  tipFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTop: '1px solid #1a202c',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  tipText: {
    fontSize: 10,
    color: '#8892b0',
  },
  analysisFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTop: '1px solid #1a202c',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  analysisText: {
    fontSize: 10,
    color: '#8892b0',
  },
  pollutantCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    borderBottom: '1px solid #1a202c',
  },
  th: {
    textAlign: 'left',
    padding: '14px 8px',
    fontSize: 12,
    fontWeight: 500,
    color: '#8892b0',
  },
  td: {
    padding: '14px 8px',
    fontSize: 13,
    color: '#cbd5e1',
    borderBottom: '1px solid #1a202c',
  },
  tableRow: {
    borderBottom: '1px solid #1a202c',
  },
  statusBadgeSmall: {
    padding: '4px 12px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  chartCard: {
    background: '#0d1117',
    borderRadius: 20,
    border: '1px solid #1a202c',
    padding: 24,
    marginBottom: 32,
  },
  svgContainer: {
    width: '100%',
    height: 280,
    marginTop: 16,
  },
  svg: {
    width: '100%',
    height: '100%',
  },
  chartLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 32,
    marginTop: 20,
    paddingTop: 20,
    borderTop: '1px solid #1a202c',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    cursor: 'pointer',
  },
  legendColorGreen: {
    width: 12,
    height: 12,
    background: '#4caf50',
    borderRadius: 3,
  },
  legendColorOrange: {
    width: 12,
    height: 12,
    background: '#ff9800',
    borderRadius: 3,
  },
  legendText: {
    fontSize: 12,
    color: '#8892b0',
  },
  footer: {
    textAlign: 'center',
    paddingTop: 24,
    borderTop: '1px solid #1a202c',
    color: '#8892b0',
    fontSize: 12,
  },
  footerSub: {
    marginTop: 8,
    fontSize: 11,
  },
};