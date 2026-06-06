'use client';

import { Fan, Settings, Power, BatteryFull } from 'lucide-react';
import { PurifierStatus } from '@/types/aqi';

interface PurifierCardProps {
  purifier: PurifierStatus;
}

export default function PurifierCard({ purifier }: PurifierCardProps) {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Purifier Status</h3>
      <div style={styles.row}>
        <Power size={16} color={purifier.isOn ? '#10b981' : '#6b7280'} />
        <span>Status: <strong>{purifier.isOn ? 'RUNNING' : 'OFF'}</strong></span>
      </div>
      <div style={styles.row}>
        <Fan size={16} color="#a78bfa" />
        <span>Fan Speed: <strong>{purifier.fanSpeed}%</strong></span>
      </div>
      <div style={styles.row}>
        <Settings size={16} color="#6b7280" />
        <span>Mode: <strong>{purifier.mode}</strong></span>
      </div>
      <div style={styles.row}>
        <BatteryFull size={16} color="#6b7280" />
        <span>Filter Life: <strong>{purifier.filterLife}%</strong></span>
      </div>
    </div>
  );
}

const styles: any = {
  card: { 
    background: '#0d1117', 
    borderRadius: 16, 
    padding: 20, 
    border: '1px solid #1f2937',
    marginBottom: 20
  },
  title: { 
    fontSize: 14, 
    color: '#6b7280', 
    marginBottom: 16, 
    textTransform: 'uppercase' 
  },
  row: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: 10, 
    padding: '8px 0', 
    borderBottom: '1px solid #1f2937', 
    fontSize: 13, 
    color: '#cbd5e1' 
  }
};