import { createContext, useContext, useEffect, useState } from "react";
import { createSocket } from "../socket";
import { useAuthStore } from "../store/authStore"; 

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const user = useAuthStore((s) => s.user); 

  useEffect(() => {
    if (!user) {
      // If no user, ensure any existing socket is disconnected and nullified
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      console.log("No user found, socket not initialized or disconnected.");
      return;
    }

    const token = localStorage.getItem("authToken"); 
    if (!token) {
        console.log("User found, but no authToken. Disconnecting existing socket.");
        if (socket) {
            socket.disconnect();
            setSocket(null);
        }
        return;
    }

    // A token exists, so create and connect the socket
    const newSocket = createSocket(token);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // Cleanup function: disconnect when component unmounts OR user/token changes
    return () => {
      newSocket.disconnect();
      console.log("Socket cleanup: disconnected on unmount or user change.");
    };
  }, [user]); 

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);