export const fetchProtectedData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("⚠️ No authentication token found.");
        return null; // Return null instead of throwing an error
    }

    try {
        const response = await fetch("http://localhost:5000/api/protected", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            if (response.status === 401) {
                console.error("❌ Authentication failed. Clearing token.");
                localStorage.removeItem("token"); // Remove invalid token
                return null; // Return null so the UI can handle re-authentication
            }

            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch data.");
        }

        return await response.json();
    } catch (error) {
        console.error("❌ Fetch error:", error.message);
        return null; // Ensure function always returns something
    }
};
