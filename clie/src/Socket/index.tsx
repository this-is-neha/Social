// src/socket.ts
import { io } from "socket.io-client";
const baseUrl= import.meta.env.VITE_API_BASE_URL
const socket = io(`${baseUrl}`); // Your backend URL
export default socket;
