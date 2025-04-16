export const fetchProtectedData = async () => {
    const token = localStorage.getItem("user_token");

    if (!token) {
        console.warn("⚠️ No authentication token found.");
        return null; 
    }

    try {
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/protected`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error("❌ Authentication failed. Clearing token.");
                localStorage.removeItem("user_token"); 
                return null; 
            }

            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch data.");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Fetch error:", error.message);
        return null; 
    }
};

const checkAuth = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/protected`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('user_token')}`
            }
        });

        // ... rest of the code ...
    } catch (error) {
        // ... error handling ...
    }
};
