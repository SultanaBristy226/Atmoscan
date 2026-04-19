'use client';

import { useEffect, useState } from 'react';
import { 
  Activity, Wind, Thermometer, Droplets, 
  TrendingUp, AlertTriangle, CheckCircle, 
  Clock, Wifi, WifiOff, RefreshCw, Bell,
  Home, BarChart3, Settings, HelpCircle,
  Menu, X, Gauge, Flame, ArrowUpRight,
  Cpu, Cloud, Zap
} from 'lucide-react';

export default function Dashboard() {
  const [currentData, setCurrentData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
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
  
  const getAQIInfo = (aqi: number) => {
    if (aqi <= 50) return { level: 'Good', color: '#10b981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', glow: '0 0 20px rgba(16,185,129,0.1)' };
    if (aqi <= 100) return { level: 'Moderate', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', glow: '0 0 20px rgba(245,158,11,0.1)' };
    if (aqi <= 150) return { level: 'Unhealthy', color: '#f97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.2)', glow: '0 0 20px rgba(249,115,22,0.1)' };
    return { level: 'Hazardous', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', glow: '0 0 20px rgba(239,68,68,0.1)' };
  };
  
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Initializing Atmoscan System...</p>
      </div>
    );
  }
  
  const aqiInfo = getAQIInfo(currentData?.aqi || 0);
  
  return (
    <div style={styles.appContainer}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: sidebarOpen ? 260 : 80 }}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logoContainer}>
            <div style={styles.logoIcon}>
              <Gauge size={20} color="#8b5cf6" />
            </div>
            {sidebarOpen && <span style={styles.logoText}>Atmoscan</span>}
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.sidebarToggle}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        
        <nav style={styles.sidebarNav}>
          {[
            { id: 'overview', icon: Home, label: 'Overview' },
            { id: 'analytics', icon: BarChart3, label: 'Analytics' },
            { id: 'devices', icon: Cpu, label: 'Devices' },
            { id: 'settings', icon: Settings, label: 'Settings' },
            { id: 'help', icon: HelpCircle, label: 'Help' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                ...styles.navItem,
                ...(activeTab === item.id ? styles.navItemActive : {}),
                justifyContent: sidebarOpen ? 'flex-start' : 'center'
              }}
              onMouseEnter={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = 'rgba(139,92,246,0.08)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'translateX(0)';
                }
              }}
            >
              <item.icon size={18} color={activeTab === item.id ? '#8b5cf6' : '#9ca3af'} />
              {sidebarOpen && <span style={styles.navLabel}>{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>
      
      {/* Main Content */}
      <main style={{ ...styles.mainContent, marginLeft: sidebarOpen ? 260 : 80 }}>
        {/* Header */}
        <header style={styles.header}>
          <div style={styles.headerLeft}>
            <h1 style={styles.headerTitle}>Dashboard</h1>
            <p style={styles.headerSubtitle}>Real-time air quality monitoring</p>
          </div>
          
          <div style={styles.headerRight}>
            <div style={styles.statusBadge}>
              {isConnected ? <Wifi size={12} color="#10b981" /> : <WifiOff size={12} color="#ef4444" />}
              <span style={{ ...styles.statusText, color: isConnected ? '#10b981' : '#ef4444' }}>
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            
            <div style={styles.timeBadge}>
              <Clock size={12} color="#6b7280" />
              <span style={styles.timeText}>{lastUpdate.toLocaleTimeString()}</span>
            </div>
            
            <button onClick={fetchData} style={styles.iconButton} className="refresh-btn">
              <RefreshCw size={16} color="#9ca3af" />
            </button>
            
            <button style={styles.iconButton} className="bell-btn">
              <Bell size={16} color="#9ca3af" />
            </button>
          </div>
        </header>
        
        <div style={styles.contentArea}>
          {/* Stats Grid */}
          <div style={styles.statsGrid}>
            {/* AQI Card */}
            <div 
              style={{ ...styles.statCard, borderColor: aqiInfo.border, boxShadow: hoveredCard === 'aqi' ? aqiInfo.glow : 'none' }}
              onMouseEnter={() => setHoveredCard('aqi')}
              onMouseLeave={() => setHoveredCard(null)}
              className="stat-card"
            >
              <div style={styles.statCardHeader}>
                <div>
                  <p style={styles.statLabel}>Air Quality Index</p>
                  <p style={{ ...styles.statValue, color: aqiInfo.color }}>{currentData?.aqi || '--'}</p>
                  <p style={{ ...styles.statSubValue, color: aqiInfo.color }}>{aqiInfo.level}</p>
                </div>
                <div style={{ ...styles.statIconWrapper, background: aqiInfo.bg }}>
                  <Gauge size={24} color={aqiInfo.color} />
                </div>
              </div>
              <div style={styles.cardTrend}>
                <ArrowUpRight size={14} color={aqiInfo.color} />
                <span style={{ ...styles.trendText, color: aqiInfo.color }}>Real-time</span>
              </div>
            </div>
            
            {/* CO2 Card */}
            <div 
              style={styles.statCard}
              onMouseEnter={() => setHoveredCard('co2')}
              onMouseLeave={() => setHoveredCard(null)}
              className="stat-card"
            >
              <div style={styles.statCardHeader}>
                <div>
                  <p style={styles.statLabel}>Carbon Dioxide</p>
                  <p style={styles.statValue}>{Math.round(currentData?.co2 || 0)}</p>
                  <p style={styles.statUnit}>ppm</p>
                </div>
                <div style={styles.statIconWrapperPurple}>
                  <Wind size={24} color="#8b5cf6" />
                </div>
              </div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${Math.min((currentData?.co2 || 0) / 20, 100)}%`, background: '#8b5cf6' }}></div>
              </div>
              <div style={styles.cardFooter}>
                <span style={styles.safeLimitText}>Safe limit: &lt; 1000 ppm</span>
              </div>
            </div>
            
            {/* CO Card */}
            <div 
              style={styles.statCard}
              onMouseEnter={() => setHoveredCard('co')}
              onMouseLeave={() => setHoveredCard(null)}
              className="stat-card"
            >
              <div style={styles.statCardHeader}>
                <div>
                  <p style={styles.statLabel}>Carbon Monoxide</p>
                  <p style={styles.statValue}>{Math.round(currentData?.co || 0)}</p>
                  <p style={styles.statUnit}>ppm</p>
                </div>
                <div style={styles.statIconWrapperOrange}>
                  <Flame size={24} color="#f97316" />
                </div>
              </div>
              <div style={styles.progressBar}>
                <div style={{ ...styles.progressFill, width: `${Math.min((currentData?.co || 0) * 2, 100)}%`, background: '#f97316' }}></div>
              </div>
              <div style={styles.cardFooter}>
                <span style={styles.safeLimitText}>Safe limit: &lt; 50 ppm</span>
              </div>
            </div>
            
            {/* Environment Card */}
            <div 
              style={styles.statCard}
              onMouseEnter={() => setHoveredCard('env')}
              onMouseLeave={() => setHoveredCard(null)}
              className="stat-card"
            >
              <div style={styles.statCardHeader}>
                <div>
                  <p style={styles.statLabel}>Environment</p>
                  <div style={styles.environmentValues}>
                    <div>
                      <p style={styles.statValue}>{currentData?.temperature || '--'}°</p>
                      <p style={styles.statUnit}>Temperature</p>
                    </div>
                    <div>
                      <p style={styles.statValue}>{currentData?.humidity || '--'}%</p>
                      <p style={styles.statUnit}>Humidity</p>
                    </div>
                  </div>
                </div>
                <div style={styles.statIconWrapperCyan}>
                  <Cloud size={24} color="#06b6d4" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Two Column Layout */}
          <div style={styles.twoColumnGrid}>
            {/* Health Recommendations */}
            <div style={styles.infoCard} className="info-card">
              <div style={styles.cardHeader}>
                <Activity size={18} color="#8b5cf6" />
                <h3 style={styles.cardTitle}>Health Recommendations</h3>
              </div>
              
              {currentData?.aqi > 100 ? (
                <div>
                  <div style={styles.alertBoxRed}>
                    <AlertTriangle size={14} color="#ef4444" />
                    <span style={styles.alertTextRed}>Poor Air Quality Alert</span>
                  </div>
                  <ul style={styles.recommendationList}>
                    <li style={styles.recommendationItem}>Wear N95 mask when outdoors</li>
                    <li style={styles.recommendationItem}>Keep windows and doors closed</li>
                    <li style={styles.recommendationItem}>Use air purifier if available</li>
                    <li style={styles.recommendationItem}>Avoid outdoor exercise</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <div style={styles.alertBoxGreen}>
                    <CheckCircle size={14} color="#10b981" />
                    <span style={styles.alertTextGreen}>Good Air Quality</span>
                  </div>
                  <ul style={styles.recommendationList}>
                    <li style={styles.recommendationItem}>Perfect for outdoor activities</li>
                    <li style={styles.recommendationItem}>Open windows for fresh air</li>
                    <li style={styles.recommendationItem}>Great time for exercise</li>
                    <li style={styles.recommendationItem}>Enjoy your day outdoors</li>
                  </ul>
                </div>
              )}
            </div>
            
            {/* Pollutant Table */}
            <div style={styles.infoCard} className="info-card">
              <div style={styles.cardHeader}>
                <BarChart3 size={18} color="#8b5cf6" />
                <h3 style={styles.cardTitle}>Pollutant Analysis</h3>
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
                  <tr style={styles.tableRow} className="table-row">
                    <td style={styles.td}>
                      <div style={styles.pollutantCell}>
                        <Wind size={14} color="#8b5cf6" />
                        <span>CO₂</span>
                      </div>
                    </td>
                    <td style={styles.td}>{Math.round(currentData?.co2 || 0)} ppm</td>
                    <td style={styles.td}>&lt; 1000 ppm</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadgeSmall,
                        background: (currentData?.co2 || 0) < 1000 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: (currentData?.co2 || 0) < 1000 ? '#10b981' : '#ef4444'
                      }}>
                        {(currentData?.co2 || 0) < 1000 ? 'Safe' : 'Unsafe'}
                      </span>
                    </td>
                  </tr>
                  <tr style={styles.tableRow} className="table-row">
                    <td style={styles.td}>
                      <div style={styles.pollutantCell}>
                        <Flame size={14} color="#f97316" />
                        <span>CO</span>
                      </div>
                    </td>
                    <td style={styles.td}>{Math.round(currentData?.co || 0)} ppm</td>
                    <td style={styles.td}>&lt; 50 ppm</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadgeSmall,
                        background: (currentData?.co || 0) < 50 ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                        color: (currentData?.co || 0) < 50 ? '#10b981' : '#ef4444'
                      }}>
                        {(currentData?.co || 0) < 50 ? 'Safe' : 'Unsafe'}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Chart Section */}
          <div style={styles.chartCard} className="chart-card">
            <div style={styles.cardHeader}>
              <TrendingUp size={18} color="#8b5cf6" />
              <h3 style={styles.cardTitle}>24-Hour Air Quality Trend</h3>
            </div>
            
            <div style={styles.chartContainer}>
              {historyData.slice(-12).map((item, idx) => (
                <div key={idx} style={styles.chartBarWrapper} className="chart-bar">
                  <div style={styles.chartBars}>
                    <div style={{ ...styles.chartBarAqi, height: `${(item.aqi / 200) * 150}px` }}></div>
                    <div style={{ ...styles.chartBarCo2, height: `${(item.co2 / 500) * 120}px` }}></div>
                  </div>
                  <span style={styles.chartLabel}>{item.time}</span>
                </div>
              ))}
            </div>
            
            <div style={styles.chartLegend}>
              <div style={styles.legendItem}>
                <div style={styles.legendColorPurple}></div>
                <span style={styles.legendText}>AQI</span>
              </div>
              <div style={styles.legendItem}>
                <div style={styles.legendColorAmber}></div>
                <span style={styles.legendText}>CO₂ (ppm)</span>
              </div>
            </div>
          </div>
          
          {/* Footer */}
          <footer style={styles.footer}>
            <p>© 2024 Atmoscan - Enterprise Air Quality Monitoring System</p>
            <p>IoT Enabled | Real-time Data | Cloud Sync</p>
          </footer>
        </div>
      </main>
      
      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes glow {
          0% {
            box-shadow: 0 0 5px rgba(139,92,246,0.2);
          }
          100% {
            box-shadow: 0 0 20px rgba(139,92,246,0.4);
          }
        }
        
        .stat-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideIn 0.4s ease-out;
        }
        
        .stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(139,92,246,0.4);
        }
        
        .info-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideIn 0.4s ease-out 0.1s both;
        }
        
        .info-card:hover {
          transform: translateY(-2px);
          border-color: rgba(139,92,246,0.3);
        }
        
        .chart-card {
          animation: slideIn 0.4s ease-out 0.2s both;
        }
        
        .chart-bar {
          transition: all 0.3s ease;
        }
        
        .chart-bar:hover {
          transform: scale(1.05);
        }
        
        .refresh-btn {
          transition: all 0.3s ease;
        }
        
        .refresh-btn:hover {
          transform: rotate(180deg);
          background: rgba(139,92,246,0.2);
        }
        
        .refresh-btn:hover svg {
          color: #8b5cf6;
        }
        
        .bell-btn {
          transition: all 0.3s ease;
        }
        
        .bell-btn:hover {
          background: rgba(139,92,246,0.2);
          transform: scale(1.05);
        }
        
        .bell-btn:hover svg {
          color: #8b5cf6;
        }
        
        .table-row {
          transition: all 0.2s ease;
        }
        
        .table-row:hover {
          background: rgba(139,92,246,0.05);
        }
        
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .progress-fill {
          position: relative;
          overflow: hidden;
        }
        
        .progress-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  appContainer: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0a0a0f',
  },
  loadingContainer: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0a0f',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '3px solid rgba(139,92,246,0.2)',
    borderTopColor: '#8b5cf6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: 16,
    color: '#6b7280',
    fontSize: 14,
  },
  sidebar: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100vh',
    background: '#111827',
    borderRight: '1px solid #1f2937',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    overflowX: 'hidden',
    zIndex: 50,
  },
  sidebarHeader: {
    padding: '20px 16px',
    borderBottom: '1px solid #1f2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 32,
    height: 32,
    background: 'rgba(139,92,246,0.15)',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 18,
    fontWeight: 600,
    color: '#ffffff',
    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  sidebarToggle: {
    background: 'none',
    border: 'none',
    color: '#9ca3af',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  },
  sidebarNav: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 16px',
    background: 'transparent',
    border: 'none',
    borderRadius: 10,
    color: '#9ca3af',
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    width: '100%',
  },
  navItemActive: {
    background: 'rgba(139,92,246,0.15)',
    color: '#8b5cf6',
  },
  navLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  mainContent: {
    flex: 1,
    transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    minHeight: '100vh',
  },
  header: {
    position: 'sticky',
    top: 0,
    background: 'rgba(17,24,39,0.95)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid #1f2937',
    padding: '16px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 40,
  },
  headerLeft: {},
  headerTitle: {
    fontSize: 20,
    fontWeight: 600,
    background: 'linear-gradient(135deg, #ffffff, #9ca3af)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#6b7280',
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
    padding: '6px 12px',
    background: '#1f2937',
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
    padding: '6px 12px',
    background: '#1f2937',
    borderRadius: 20,
  },
  timeText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  iconButton: {
    padding: 8,
    background: '#1f2937',
    border: 'none',
    borderRadius: 10,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
  },
  contentArea: {
    padding: '24px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: 20,
    marginBottom: 24,
  },
  statCard: {
    background: '#111827',
    borderRadius: 16,
    border: '1px solid #1f2937',
    padding: 20,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  statCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
    letterSpacing: '0.5px',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 600,
    color: '#ffffff',
  },
  statSubValue: {
    fontSize: 14,
    fontWeight: 500,
    marginTop: 4,
  },
  statUnit: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 2,
  },
  statIconWrapper: {
    padding: 12,
    borderRadius: 12,
  },
  statIconWrapperPurple: {
    padding: 12,
    background: 'rgba(139,92,246,0.1)',
    borderRadius: 12,
  },
  statIconWrapperOrange: {
    padding: 12,
    background: 'rgba(249,115,22,0.1)',
    borderRadius: 12,
  },
  statIconWrapperCyan: {
    padding: 12,
    background: 'rgba(6,182,212,0.1)',
    borderRadius: 12,
  },
  progressBar: {
    marginTop: 16,
    height: 6,
    background: '#1f2937',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 10,
    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  cardFooter: {
    marginTop: 12,
  },
  safeLimitText: {
    fontSize: 10,
    color: '#6b7280',
  },
  cardTrend: {
    marginTop: 12,
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  trendText: {
    fontSize: 11,
    fontWeight: 500,
  },
  environmentValues: {
    display: 'flex',
    gap: 20,
    marginTop: 4,
  },
  twoColumnGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: 20,
    marginBottom: 24,
  },
  infoCard: {
    background: '#111827',
    borderRadius: 16,
    border: '1px solid #1f2937',
    padding: 20,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#ffffff',
  },
  alertBoxRed: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    background: 'rgba(239,68,68,0.1)',
    borderRadius: 12,
    border: '1px solid rgba(239,68,68,0.2)',
    marginBottom: 16,
  },
  alertTextRed: {
    fontSize: 13,
    fontWeight: 500,
    color: '#ef4444',
  },
  alertBoxGreen: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    background: 'rgba(16,185,129,0.1)',
    borderRadius: 12,
    border: '1px solid rgba(16,185,129,0.2)',
    marginBottom: 16,
  },
  alertTextGreen: {
    fontSize: 13,
    fontWeight: 500,
    color: '#10b981',
  },
  recommendationList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  recommendationItem: {
    padding: '8px 0',
    color: '#d1d5db',
    fontSize: 13,
    borderBottom: '1px solid #1f2937',
    transition: 'all 0.2s ease',
  },
  pollutantCell: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    borderBottom: '1px solid #1f2937',
  },
  th: {
    textAlign: 'left',
    padding: '12px 8px',
    fontSize: 12,
    fontWeight: 500,
    color: '#6b7280',
  },
  td: {
    padding: '12px 8px',
    fontSize: 13,
    color: '#d1d5db',
    borderBottom: '1px solid #1f2937',
  },
  tableRow: {
    borderBottom: '1px solid #1f2937',
    transition: 'all 0.2s ease',
  },
  statusBadgeSmall: {
    padding: '4px 10px',
    borderRadius: 20,
    fontSize: 11,
    fontWeight: 500,
  },
  chartCard: {
    background: '#111827',
    borderRadius: 16,
    border: '1px solid #1f2937',
    padding: 20,
    marginBottom: 24,
  },
  chartContainer: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 8,
    height: 220,
    padding: '20px 0',
  },
  chartBarWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  chartBars: {
    display: 'flex',
    gap: 4,
    alignItems: 'flex-end',
    height: 160,
  },
  chartBarAqi: {
    width: 20,
    background: '#8b5cf6',
    borderRadius: 4,
    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  chartBarCo2: {
    width: 20,
    background: '#f59e0b',
    borderRadius: 4,
    transition: 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  chartLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  chartLegend: {
    display: 'flex',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
    paddingTop: 16,
    borderTop: '1px solid #1f2937',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  legendColorPurple: {
    width: 12,
    height: 12,
    background: '#8b5cf6',
    borderRadius: 2,
  },
  legendColorAmber: {
    width: 12,
    height: 12,
    background: '#f59e0b',
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  footer: {
    textAlign: 'center',
    paddingTop: 24,
    borderTop: '1px solid #1f2937',
    color: '#6b7280',
    fontSize: 12,
  },
};