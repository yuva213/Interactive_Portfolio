"use client";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import { useToast } from "@/components/ui/use-toast";

export type User = {
  id: string;
  socketId: string;
  name: string;
  avatar: string;
  color: string;
  isOnline: string;
  posX: number;
  posY: number;
  location: string;
  flag: string;
  lastSeen: string;
  createdAt: string;
};

export type Message = {
  id: string;
  sessionId: string;
  flag: string;
  country: string;
  username: string;
  avatar: string;
  color?: string;
  content: string;
  createdAt: string | Date;
}

type SocketContextType = {
  socket: Socket | null;
  users: User[];
  setUsers: Dispatch<SetStateAction<User[]>>;
  msgs: Message[];
  isCurrentUser: boolean
};

const INITIAL_STATE: SocketContextType = {
  socket: null,
  users: [],
  setUsers: () => { },
  msgs: [],
  isCurrentUser: false
};

export const SocketContext = createContext<SocketContextType>(INITIAL_STATE);

const SESSION_ID_KEY = "portfolio-site-session-id";

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [msgs, setMsgs] = useState<Message[]>([]);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "https://socket.nikhilsharma.in"; 
    // If you have your own socket server, please update NEXT_PUBLIC_WS_URL in .env
    
    if (!wsUrl) return;

    const newSocket = io(wsUrl, {
      auth: {
        sessionId: localStorage.getItem(SESSION_ID_KEY),
      },
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Connected to Realtime Server:", newSocket.id);
      setIsCurrentUser(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from Realtime Server");
      setIsCurrentUser(false);
    });

    newSocket.on("session", ({ sessionId }) => {
      console.log("Realtime Session initialized:", sessionId);
      localStorage.setItem(SESSION_ID_KEY, sessionId);
    });

    newSocket.on("users-updated", (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    newSocket.on("cursor-changed", (data) => {
      setUsers((prev) => {
        const newUsers = [...prev];
        const userIndex = newUsers.findIndex((u) => u.socketId === data.socketId);
        if (userIndex !== -1) {
          newUsers[userIndex] = {
            ...newUsers[userIndex],
            posX: data.pos.x,
            posY: data.pos.y,
          };
        } else {
          // If user isn't in users-updated yet, add them from cursor-changed event if they include full data
          // typically cursor-changed just has pos/socketId though.
        }
        return newUsers;
      });
    });

    newSocket.on("msg-receive", (newMsg: Message) => {
      setMsgs((prev) => [...prev, newMsg]);
    });

    newSocket.on("msgs-receive-init", (initialMsgs: Message[]) => {
      setMsgs(initialMsgs);
    });

    newSocket.on("msg-delete", (data: { id: number }) => {
      setMsgs((prev) => prev.filter((m) => Number(m.id) !== data.id));
    });

    newSocket.on("warning", (data: { message: string }) => {
      toast({
        variant: "destructive",
        title: "System Warning",
        description: data.message,
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return (
    <SocketContext.Provider value={{ socket, users, setUsers, msgs, isCurrentUser }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
