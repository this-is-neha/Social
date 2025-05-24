import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
const baseUrl= import.meta.env.VITE_API_BASE_URL
interface UserContextType {
  follower: any | null;
  setFollower: React.Dispatch<React.SetStateAction<any | null>>;
  loadings: boolean;
}


const defaultUserContext: UserContextType = {
  follower: null,
  setFollower: () => {}, 
  loadings: false,
};


export const FollowerContext = createContext<UserContextType>(defaultUserContext);

interface UserProviderProps {
  children: ReactNode;
}


export function FollowerProvider({ children }: UserProviderProps) {
  const [follower, setFollower] = useState<any | null>(null);
  const [loadings, setLoadings] = useState(true);

  useEffect(() => {
    async function fetchFollower() {
      try {
        const token = localStorage.getItem("accessToken");
          const responsee = await axios.get(`${baseUrl}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Logged-in user responssdsfe:", responsee.data);
        const userId = responsee.data.result._id;
        console.log("Logged-in user ID:", userId);
        setLoadings(true);
        const response = await axios.get(`${baseUrl}/auth/followers/${userId}`);
        const data = await response.data
        setFollower(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setFollower(null);
      } finally {
        setLoadings(false);
      }
    }
    fetchFollower();
  }, []);

  return (
    <FollowerContext.Provider value={{ follower, setFollower, loadings }}>
      {children}
    </FollowerContext.Provider>
  );
}
