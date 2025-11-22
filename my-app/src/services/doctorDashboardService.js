const API_BASE_URL = 'http://localhost:5000';

export const doctordashboard = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/doctordashboard`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching doctor dashboard data:', error);
        throw error;
    }
};