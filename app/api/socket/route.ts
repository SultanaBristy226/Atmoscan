import { Server as SocketServer } from 'socket.io';
import { NextRequest } from 'next/server';
import { getDashboardData } from '@/lib/data';

export async function GET(req: NextRequest) {
  // Check if socket server already running
  if (!(global as any).io) {
    console.log('🔌 Initializing Socket.io server...');

    const io = new SocketServer({
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log(`✅ Client connected: ${socket.id}`);

      // Send real-time data every 2 seconds
      const interval = setInterval(() => {
        const data = getDashboardData();
        socket.emit('air-quality-update', data);
      }, 2000);

      // Handle client disconnect
      socket.on('disconnect', () => {
        console.log(`❌ Client disconnected: ${socket.id}`);
        clearInterval(interval);
      });

      // Handle manual refresh request from client
      socket.on('request-data', () => {
        const data = getDashboardData();
        socket.emit('air-quality-update', data);
      });
    });

    (global as any).io = io;
  }

  return new Response('Socket server running');
}