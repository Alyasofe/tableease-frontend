import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });
    const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem('user'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        // 1. Initial Session Check
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session && mounted) {
                    await fetchProfile(session.user.id);
                } else if (!session && mounted) {
                    setUser(null);
                    setIsAuthenticated(false);
                    localStorage.removeItem('user');
                }
            } finally {
                if (mounted) setLoading(false);
            }
        };

        checkSession();

        // 2. Auth State Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth Event:", event);
            if (event === 'SIGNED_IN' && session) {
                await fetchProfile(session.user.id);
                setIsAuthenticated(true);
            } else if (event === 'SIGNED_OUT' || !session) {
                setUser(null);
                setIsAuthenticated(false);
                localStorage.removeItem('user');
            }
            if (mounted) setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const fetchProfile = async (userId) => {
        try {
            // Get profile data from our custom profiles table
            const { data: profile, error } = await supabase
                .from('profiles')
                .select(`
                    *,
                    user_favorites(restaurant_id)
                `)
                .eq('id', userId)
                .single();

            if (error) throw error;

            // Format favorites for the app
            const favorites = profile.user_favorites?.map(f => f.restaurant_id) || [];

            const fullUser = {
                ...profile,
                favorites
            };

            setUser(fullUser);
            setIsAuthenticated(true);

            // Save to localStorage for persistence across reloads/pages
            localStorage.setItem('user', JSON.stringify(fullUser));

            return fullUser;
        } catch (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
    };

    const login = async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Fetch profile immediately to ensure we have role for routing
            if (data.session) {
                const profile = await fetchProfile(data.session.user.id);
                if (profile) return { success: true, data: profile };
            }

            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const register = async (username, email, password, role = 'customer', phone = '') => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        role,
                        phone
                    }
                }
            });

            if (error) throw error;

            // Update profile with phone number if provided
            if (data.user && phone) {
                await supabase.from('profiles').update({ phone }).eq('id', data.user.id);
            }

            // Check if email confirmation is required
            if (data.user && !data.session) {
                return { success: true, confirmationRequired: true };
            }

            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        // 1. Force clear application state first for immediate UI response
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');

        // 2. Brute force clear any potential Supabase persisting titles
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
                localStorage.removeItem(key);
            }
        });

        try {
            // 3. Attempt standard sign out with the backend
            const { error } = await supabase.auth.signOut();
            if (error) console.warn("Supabase signOut warning:", error.message);
        } catch (error) {
            console.error("Supabase signOut error:", error);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .update(profileData)
                .eq('id', user.id)
                .select()
                .single();

            if (error) throw error;

            setUser(prev => ({ ...prev, ...data }));
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const toggleFavorite = async (restaurantId) => {
        try {
            if (!user) return { success: false, message: "User not logged in" };
            const isFavorite = user.favorites.includes(restaurantId);

            if (isFavorite) {
                // Remove from favorites
                const { error } = await supabase
                    .from('user_favorites')
                    .delete()
                    .match({ user_id: user.id, restaurant_id: restaurantId });

                if (error) throw error;

                setUser(prev => ({
                    ...prev,
                    favorites: prev.favorites.filter(id => id !== restaurantId)
                }));
                return { success: true, isFavorite: false };
            } else {
                // Add to favorites
                const { error } = await supabase
                    .from('user_favorites')
                    .insert({ user_id: user.id, restaurant_id: restaurantId });

                if (error) throw error;

                setUser(prev => ({
                    ...prev,
                    favorites: [...prev.favorites, restaurantId]
                }));
                return { success: true, isFavorite: true };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const resendVerification = async (email) => {
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: email
            });
            if (error) throw error;
            return { success: true };
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            loading,
            login,
            register,
            logout,
            updateProfile,
            toggleFavorite,
            resendVerification
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
