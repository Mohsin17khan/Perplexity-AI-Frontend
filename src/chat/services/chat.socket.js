import { io } from "socket.io-client";


export const initializeSocketConnection = () => {
    
    const socket = io("https://perplexity-backend-1-rcvm.onrender.com", {
        withCredentials: true,
    });

    socket.on("connect", () => {
        console.log("Connected to socket.io server")
    });
}

