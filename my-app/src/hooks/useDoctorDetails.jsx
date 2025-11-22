import { useEffect, useState } from 'react';
import { doctordashboard } from '../services/doctorDashboardService';

export const useDoctorDetails = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getDetails = async () => {
            try {
                setLoading(true);
                const result = await doctordashboard();
                setData(result);
                setError(null);
            } catch (err) {
                setError(err.message);
                setData([]);
            } finally {
                setLoading(false);
            }
        };
        getDetails();
    }, []);

    return { data, loading, error };
}