import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const API_BASE_URL = 'http://localhost:5001';

    // Get token from localStorage
    const getToken = () => localStorage.getItem('token');

    // Fetch all restaurants
    const fetchRestaurants = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/restaurants`);
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setRestaurants(data);
            } else {
                console.error("API error or unexpected format:", data);
                setRestaurants([]);
            }
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch restaurants:", err);
            setRestaurants([]);
            setLoading(false);
        }
    }, [API_BASE_URL]);

    // Fetch restaurant by ID
    const fetchRestaurantById = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/restaurants/${id}`);
            const data = await res.json();
            return data;
        } catch (err) {
            console.error("Failed to fetch restaurant:", err);
            return null;
        }
    };

    // Create a new restaurant
    const createRestaurant = async (restaurantData) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/restaurants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(restaurantData)
            });

            if (res.ok) {
                const newRestaurant = await res.json();
                setRestaurants(prev => [...prev, newRestaurant]);
                return { success: true, data: newRestaurant };
            } else {
                const error = await res.json();
                return { success: false, message: error.message };
            }
        } catch (err) {
            console.error("Failed to create restaurant:", err);
            return { success: false, message: 'An error occurred while creating the restaurant' };
        }
    };

    // Update restaurant
    const updateRestaurant = async (id, restaurantData) => {
        try {
            console.log('Updating restaurant with ID:', id);
            console.log('Restaurant data:', restaurantData);

            const res = await fetch(`${API_BASE_URL}/api/restaurants/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(restaurantData)
            });

            if (res.ok) {
                const updatedRestaurant = await res.json();
                console.log('Updated restaurant response:', updatedRestaurant);

                // Force a complete refresh of restaurants to ensure consistency
                await fetchRestaurants();

                return { success: true, data: updatedRestaurant };
            } else {
                const error = await res.json();
                console.error('Update failed with error:', error);
                return { success: false, message: error.message };
            }
        } catch (err) {
            console.error("Failed to update restaurant:", err);
            return { success: false, message: 'An error occurred while updating the restaurant' };
        }
    };

    // Delete restaurant
    const deleteRestaurant = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/restaurants/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });

            if (res.ok) {
                setRestaurants(prev => prev.filter(restaurant => restaurant._id !== id));
                return { success: true };
            } else {
                const error = await res.json();
                return { success: false, message: error.message };
            }
        } catch (err) {
            console.error("Failed to delete restaurant:", err);
            return { success: false, message: 'An error occurred while deleting the restaurant' };
        }
    };

    // Table Management
    const addTable = async (restaurantId, tableData) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/tables`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(tableData)
            });
            if (res.ok) {
                await fetchRestaurants();
                return { success: true };
            }
            return { success: false };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const updateTable = async (restaurantId, tableId, tableData) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/tables/${tableId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify(tableData)
            });
            if (res.ok) {
                await fetchRestaurants();
                return { success: true };
            }
            return { success: false };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const deleteTable = async (restaurantId, tableId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/restaurants/${restaurantId}/tables/${tableId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getToken()}`
                }
            });
            if (res.ok) {
                await fetchRestaurants();
                return { success: true };
            }
            return { success: false };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, []);

    return (
        <RestaurantContext.Provider value={{
            restaurants,
            loading,
            fetchRestaurants,
            fetchRestaurantById,
            createRestaurant,
            updateRestaurant,
            deleteRestaurant,
            addTable,
            updateTable,
            deleteTable
        }}>
            {children}
        </RestaurantContext.Provider>
    );
}

export const useRestaurants = () => useContext(RestaurantContext);