import { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [bookings, setBookings] = useState([]);
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    // Get token from localStorage
    const getToken = () => localStorage.getItem('token');

    // Fetch bookings from Backend
    const fetchBookings = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/bookings`, {
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            const data = await res.json();

            if (res.ok && Array.isArray(data)) {
                // Map _id to id for frontend compatibility
                const formatted = data.map(b => ({
                    ...b,
                    id: b._id,
                    restaurantName: b.restaurant?.name || 'Unknown Restaurant',
                    userName: b.user?.username || 'Unknown User'
                }));
                setBookings(formatted);
            } else {
                console.error("Failed to fetch bookings or unexpected format:", data);
                setBookings([]);
            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
            setBookings([]);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const addBooking = async (newBooking) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(newBooking)
            });

            if (res.ok) {
                // Refresh list to get the new ID and data from server
                fetchBookings();
                console.log("Booking Added to DB");
                return { success: true };
            } else {
                const errorData = await res.json();
                return { success: false, message: errorData.message };
            }
        } catch (err) {
            return { success: false, message: 'An error occurred while processing your booking' };
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/bookings/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                // Refresh the bookings list
                fetchBookings();
                return true;
            }
            return false;
        } catch (err) {
            console.error("Failed to update status:", err);
            return false;
        }
    };

    const clearBookings = async () => {
        if (window.confirm('Are you sure? This will delete PERMANENTLY from the database!')) {
            try {
                await fetch(`${API_BASE_URL}/api/bookings`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${getToken()}`
                    }
                });
                setBookings([]);
            } catch (err) {
                console.error("Failed to clear bookings:", err);
            }
        }
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking, updateStatus, clearBookings }}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBookings = () => useContext(BookingContext);
