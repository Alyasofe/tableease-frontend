import { createContext, useContext, useState, useEffect } from 'react';

const BookingContext = createContext();

export function BookingProvider({ children }) {
    // Initialize from localStorage
    const [bookings, setBookings] = useState(() => {
        const saved = localStorage.getItem('restaurant_bookings');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('restaurant_bookings', JSON.stringify(bookings));
    }, [bookings]);

    const addBooking = (newBooking) => {
        const booking = {
            id: Date.now(), // Simple ID generation
            status: 'pending',
            dateCreated: new Date().toISOString(),
            ...newBooking
        };
        setBookings(prev => [booking, ...prev]);
        console.log("Booking Added:", booking);
    };

    const updateStatus = (id, newStatus) => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
    };

    const clearBookings = () => {
        setBookings([]);
        localStorage.removeItem('restaurant_bookings');
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking, updateStatus, clearBookings }}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBookings = () => useContext(BookingContext);
