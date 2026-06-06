'use client';

import { AlertTriangle, Info, CheckCircle, XCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';

type AlertType = {
  type: 'danger' | 'warning' | 'success' | 'info';
  title: string;
  message: string;
};

interface AlertMessageProps {
  alert: AlertType;
  onClose?: () => void;
}

export default function AlertMessage({ alert, onClose }: AlertMessageProps) {
  const getIcon = () => {
    switch(alert.type) {
      case 'danger': return <XCircle size={18} color="#ef4444" />;
      case 'warning': return <AlertTriangle size={18} color="#f97316" />;
      case 'success': return <CheckCircle size={18} color="#10b981" />;
      default: return <Info size={18} color="#a855f7" />;
    }
  };

  const getBgColor = () => {
    switch(alert.type) {
      case 'danger': return 'rgba(239,68,68,0.1)';
      case 'warning': return 'rgba(249,115,22,0.1)';
      case 'success': return 'rgba(16,185,129,0.1)';
      default: return 'rgba(168,85,247,0.1)';
    }
  };
  const getBorderColor = () => {
    switch(alert.type) {
      case 'danger': return '#ef4444';
      case 'warning': return '#f97316';
      case 'success': return '#10b981';
      default: return '#a855f7';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{ 
        ...styles.alert, 
        background: getBgColor(), 
        borderLeftColor: getBorderColor() 
      }}
    >
      <div style={styles.content}>
        {getIcon()}
        <div>
          <p style={styles.title}>{alert.title}</p>
          <p style={styles.message}>{alert.message}</p>
        </div>
      </div>
      {onClose && (
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
}

const styles: any = {
  alert: { 
    display: 'flex', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: '12px 16px', 
    borderRadius: 12, 
    marginBottom: 20, 
    borderLeft: '3px solid' 
  },
  content: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 12 
  },
  title: { 
    fontSize: 13, 
    fontWeight: 600, 
    color: '#fff' 
  },
  message: { 
    fontSize: 11, 
    color: '#9ca3af', 
    marginTop: 2 
  },
  closeBtn: { 
    background: 'none', 
    border: 'none', 
    cursor: 'pointer', 
    color: '#6b7280' 
  }
};