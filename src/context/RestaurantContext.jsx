import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const RestaurantContext = createContext();

export function RestaurantProvider({ children }) {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all restaurants (Optimized list view)
    const fetchRestaurants = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('restaurants')
                .select('*');

            if (error) throw error;

            const mappedData = data.map(res => ({
                ...res,
                _id: res.id,
                ownerId: res.owner_id,
                imageUrl: res.image_url,
                image: res.image_url,
                gallery: (res.image_url && res.image_url.includes('|') ? res.image_url.split('|') : [res.image_url].filter(Boolean)),
                nameAr: res.name_ar,
                descriptionAr: res.description_ar,
                cuisineType: res.cuisine_type,
                cuisine: res.cuisine_type,
                priceRange: res.price_range,
                openingHours: res.opening_hours,
                amenities: res.amenities || [],
                menu: [],
                tables: []
            }));

            setRestaurants(mappedData);
        } catch (err) {
            console.error("Failed to fetch restaurants:", err);
            setRestaurants([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch restaurant by ID (Detailed view with joins)
    const fetchRestaurantById = async (id) => {
        try {
            const { data, error } = await supabase
                .from('restaurants')
                .select(`
                    *,
                    restaurant_menu_items (*),
                    restaurant_tables (*)
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            return {
                ...data,
                _id: data.id,
                ownerId: data.owner_id,
                imageUrl: data.image_url,
                image: data.image_url,
                gallery: (data.image_url && data.image_url.includes('|') ? data.image_url.split('|') : [data.image_url].filter(Boolean)),
                nameAr: data.name_ar,
                descriptionAr: data.description_ar,
                cuisineType: data.cuisine_type,
                cuisine: data.cuisine_type,
                priceRange: data.price_range,
                openingHours: data.opening_hours,
                amenities: data.amenities || [],
                menu: data.restaurant_menu_items?.map(item => ({
                    ...item,
                    _id: item.id,
                    imageUrl: item.image_url,
                    image: item.image_url
                })) || [],
                tables: data.restaurant_tables?.map(t => ({
                    ...t,
                    _id: t.id,
                    isActive: t.is_active
                })) || []
            };
        } catch (err) {
            console.error("Failed to fetch restaurant:", err);
            return null;
        }
    };

    const mapToDB = (data) => {
        const mapped = {
            name: data.name,
            name_ar: data.nameAr,
            description: data.description,
            description_ar: data.descriptionAr,
            cuisine_type: data.cuisineType || data.cuisine,
            image_url: Array.isArray(data.gallery) && data.gallery.length > 0 ? data.gallery.join('|') : (data.imageUrl || data.image),
            city: data.city,
            status: data.status,
            type: data.type,
            rating: data.rating,
            price_range: data.priceRange,
            opening_hours: data.openingHours,
            location: data.location,
            phone: data.phone,
            amenities: data.amenities,
            address: data.address
        };
        Object.keys(mapped).forEach(key => mapped[key] === undefined && delete mapped[key]);
        return mapped;
    };

    const createRestaurant = async (restaurantData) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { menu, tables } = restaurantData;
            const dbData = mapToDB(restaurantData);

            const { data, error } = await supabase
                .from('restaurants')
                .insert([{ ...dbData, owner_id: user.id }])
                .select()
                .single();

            if (error) throw error;

            if (menu && menu.length > 0) {
                await supabase.from('restaurant_menu_items').insert(
                    menu.map(item => ({
                        name: item.name,
                        description: item.description,
                        price: item.price,
                        image_url: item.image_url || item.image,
                        restaurant_id: data.id
                    }))
                );
            }

            if (tables && tables.length > 0) {
                await supabase.from('restaurant_tables').insert(
                    tables.map(table => ({ ...table, restaurant_id: data.id }))
                );
            }

            fetchRestaurants();
            return { success: true, data: { ...data, _id: data.id, ownerId: data.owner_id } };
        } catch (err) {
            console.error("Failed to create restaurant:", err);
            return { success: false, message: err.message };
        }
    };

    const updateRestaurant = async (id, restaurantData) => {
        try {
            const { menu, tables } = restaurantData;
            const dbData = mapToDB(restaurantData);

            const { data, error } = await supabase
                .from('restaurants')
                .update(dbData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            if (menu) {
                await supabase.from('restaurant_menu_items').delete().eq('restaurant_id', id);
                if (menu.length > 0) {
                    await supabase.from('restaurant_menu_items').insert(
                        menu.map(item => ({
                            name: item.name,
                            description: item.description,
                            price: item.price,
                            image_url: item.image_url || item.image,
                            restaurant_id: id
                        }))
                    );
                }
            }

            fetchRestaurants();
            return { success: true, data: { ...data, _id: data.id, ownerId: data.owner_id } };
        } catch (err) {
            console.error("Failed to update restaurant:", err);
            return { success: false, message: err.message };
        }
    };

    const deleteRestaurant = async (id) => {
        try {
            const { error } = await supabase.from('restaurants').delete().eq('id', id);
            if (error) throw error;
            setRestaurants(prev => prev.filter(res => res.id !== id));
            return { success: true };
        } catch (err) {
            console.error("Failed to delete restaurant:", err);
            return { success: false, message: err.message };
        }
    };

    // Table Management
    const addTable = async (restaurantId, tableData) => {
        try {
            const { error } = await supabase
                .from('restaurant_tables')
                .insert([{ ...tableData, restaurant_id: restaurantId }]);

            if (error) throw error;
            fetchRestaurants();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const updateTable = async (restaurantId, tableId, tableData) => {
        try {
            const { error } = await supabase
                .from('restaurant_tables')
                .update(tableData)
                .eq('id', tableId);

            if (error) throw error;
            fetchRestaurants();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    const deleteTable = async (restaurantId, tableId) => {
        try {
            const { error } = await supabase
                .from('restaurant_tables')
                .delete()
                .eq('id', tableId);

            if (error) throw error;
            fetchRestaurants();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.message };
        }
    };

    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

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