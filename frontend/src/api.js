export const fetchProtectedData = async () => {
    const token = localStorage.getItem("user_token");

    if (!token) {
        console.warn("⚠️ No authentication token found.");
        return null; 
    }

    try {
        const response = await fetch("http://localhost:5000/api/protected", {
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
