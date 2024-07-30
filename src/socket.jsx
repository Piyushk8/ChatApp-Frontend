import { createContext, useMemo,useContext } from "react";
import io from "socket.io-client";
import { server } from "./constant/config";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);
const socket =   io("http://localhost:3000/", { withCredentials: true });


const SocketProvider = ({ children }) => {
 
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};



// const SocketProvider = ({ children }) => {
//   const socket = useRef(null); // Use ref to hold the socket instance

//   if (!socket.current) {
//     console.log("Initializing socket connection");
//     socket.current = io(server, { withCredentials: true });
//   }
//   useEffect(() => {
//     console.log("SocketProvider mounted");

//     socket.on("connect", () => {
//       console.log("Socket connected:", socket.id);
//     });

//     return () => {
//       console.log("SocketProvider unmounted");
//       socket.disconnect();
//     };
//   }, [socket]);

//   return (
//     <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
//   );
// };

export { SocketProvider, getSocket };

