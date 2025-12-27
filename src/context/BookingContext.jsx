import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from './AuthContext';

const BookingContext = createContext();

export function BookingProvider({ children }) {
    const [bookings, setBookings] = useState([]);
    const { user } = useAuth();

    // Fetch bookings from Supabase
    const fetchBookings = useCallback(async () => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (!authUser) return;

            // Simple conditional fetching based on role
            // In a real app, RLS handles safety, but we want the right view here
            let query = supabase
                .from('bookings')
                .select(`
                    *,
                    restaurant:restaurants(name),
                    profile:profiles(username)
                `);

            // If user is restaurant owner, show bookings for their restaurants
            // If admin, show all (handled by query above)
            // If customer, filter by user_id
            // Note: RLS will already filter these, but explicit filters help.

            const { data, error } = await query.order('created_at', { ascending: false });

            if (error) throw error;

            if (Array.isArray(data)) {
                const formatted = data.map(b => ({
                    ...b,
                    id: b.id,
                    restaurantName: b.restaurant?.name || 'Unknown Restaurant',
                    userName: b.profile?.username || b.name || 'Guest'
                }));
                setBookings(formatted);
            }
        } catch (err) {
            console.error("Failed to fetch bookings:", err);
            setBookings([]);
        }
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings, user]);

    const addBooking = async (newBooking) => {
        try {
            const { data: { user: authUser } } = await supabase.auth.getUser();

            // 1. Smart Table Allocation via Postgres RPC (Optional now)
            const { data: tableId, error: rpcError } = await supabase.rpc('find_available_table', {
                p_restaurant_id: newBooking.restaurantId || newBooking.restaurant,
                p_date: newBooking.date,
                p_time: newBooking.time,
                p_guests: parseInt(newBooking.guests)
            });

            // Log error but don't block if table allocation fails 
            // This is crucial for venues that don't want to manage individual tables
            if (rpcError) console.warn("Table allocation skipped:", rpcError);

            // 2. Create booking with the allocated table
            const dbBooking = {
                restaurant_id: newBooking.restaurantId || newBooking.restaurant,
                user_id: authUser?.id || null,
                date: newBooking.date,
                time: newBooking.time,
                guests: newBooking.guests,
                special_requests: newBooking.specialRequests,
                name: newBooking.name,
                email: newBooking.email,
                phone: newBooking.phone,
                status: 'pending',
                table_id: tableId,
                applied_offer_id: newBooking.appliedOfferId || newBooking.appliedOffer
            };

            const { error: insertError } = await supabase
                .from('bookings')
                .insert([dbBooking]);

            if (insertError) throw insertError;

            fetchBookings();
            return { success: true };
        } catch (err) {
            console.error("Add booking error:", err);
            return { success: false, message: err.message };
        }
    };

    const updateStatus = async (id, newStatus) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            fetchBookings();
            return true;
        } catch (err) {
            console.error("Failed to update status:", err);
            return false;
        }
    };

    const updateBooking = async (id, updates) => {
        try {
            const { error } = await supabase
                .from('bookings')
                .update(updates)
                .eq('id', id);

            if (error) throw error;
            fetchBookings();
            return { success: true };
        } catch (err) {
            console.error("Failed to update booking:", err);
            return { success: false, message: err.message };
        }
    };

    const clearBookings = async () => {
        if (window.confirm('Are you sure? This will delete PERMANENTLY from the database!')) {
            try {
                // Warning: Supabase requires a filter for deletes. 
                // We'll delete based on the user's view via RLS or specific IDs
                const ids = bookings.map(b => b.id);
                if (ids.length > 0) {
                    const { error } = await supabase
                        .from('bookings')
                        .delete()
                        .in('id', ids);

                    if (error) throw error;
                }
                setBookings([]);
            } catch (err) {
                console.error("Failed to clear bookings:", err);
            }
        }
    };

    return (
        <BookingContext.Provider value={{ bookings, addBooking, updateStatus, updateBooking, clearBookings }}>
            {children}
        </BookingContext.Provider>
    );
}

export const useBookings = () => useContext(BookingContext);
