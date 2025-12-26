import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const OfferContext = createContext();

export function OfferProvider({ children }) {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { token } = useAuth();

    const API_URL = 'http://localhost:5001/api/offers';

    const fetchOffers = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL);
            const data = await res.json();
            if (res.ok && data.success && Array.isArray(data.data)) {
                setOffers(data.data);
            } else {
                setOffers([]);
            }
        } catch (error) {
            console.error("Error fetching offers:", error);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    }, [API_URL]);

    const fetchAdminOffers = useCallback(async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok && data.success && Array.isArray(data.data)) {
                setOffers(data.data);
            } else {
                setOffers([]);
            }
        } catch (error) {
            console.error("Error fetching admin offers:", error);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    }, [API_URL, token]);

    const addOffer = async (offerData) => {
        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(offerData)
            });
            const data = await res.json();
            if (res.ok) {
                setOffers(prev => [data.data || data, ...prev]);
                return { success: true };
            }
            return { success: false, message: data.message || 'Failed to add offer' };
        } catch (error) {
            console.error("Error adding offer:", error);
            return { success: false, message: 'Failed to add offer' };
        }
    };

    const updateOffer = async (id, offerData) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(offerData)
            });
            const data = await res.json();
            if (res.ok) {
                setOffers(prev => prev.map(o => o._id === id ? (data.data || data) : o));
                return { success: true };
            }
            return { success: false, message: data.message || 'Failed to update offer' };
        } catch (error) {
            console.error("Error updating offer:", error);
            return { success: false, message: 'Failed to update offer' };
        }
    };

    const deleteOffer = async (id) => {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setOffers(prev => prev.filter(o => o._id !== id));
                return { success: true };
            }
            const data = await res.json();
            return { success: false, message: data.message || 'Failed to delete offer' };
        } catch (error) {
            console.error("Error deleting offer:", error);
            return { success: false, message: 'Failed to delete offer' };
        }
    };

    return (
        <OfferContext.Provider value={{
            offers,
            loading,
            fetchOffers,
            fetchAdminOffers,
            addOffer,
            updateOffer,
            deleteOffer
        }}>
            {children}
        </OfferContext.Provider>
    );
}

export const useOffers = () => useContext(OfferContext);
