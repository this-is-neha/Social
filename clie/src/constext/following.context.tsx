


import { createContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
const baseUrl=import.meta.env.VITE_API_BASE_URL 
interface UserContextType {
  user: any | null;
  setUser: React.Dispatch<React.SetStateAction<any | null>>;
  loading: boolean;
}


const defaultUserContext: UserContextType = {
  user: null,
  setUser: () => {}, 
  loading: false,
};


export const UserContext = createContext<UserContextType>(defaultUserContext);
interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
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
        setLoading(true);
        const response = await axios.get(`${baseUrl}/auth/following/${userId}`);
        const data = await response.data
        setUser(data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
}
