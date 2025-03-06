import { createContext, useContext, useEffect, useState } from "react";
import { fetchUser } from "../services/userServices";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getUser = async () => {
            try {
                const data = await fetchUser();
                setUser(data);
            } catch (error) {
                console.error("❌ User fetch error:", error.message);
                setError(error.message);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        getUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
