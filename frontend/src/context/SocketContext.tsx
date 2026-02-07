import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from "socket.io-client";
import { useAuth } from './AuthContext';

const SocketContext = createContext<Socket | null>(null);
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket'],
      withCredentials: true
    });
    newSocket.emit("identify", user._id);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
