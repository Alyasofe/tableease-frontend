import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';

const OfferContext = createContext();

export function OfferProvider({ children }) {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchOffers = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('offers')
                .select('*, restaurants(id, name, name_ar, image_url, city)')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map keys for compatibility
            const formatted = data.map(o => ({
                ...o,
                _id: o.id,
                restaurant: o.restaurants, // Compatibility with existing code
                active: o.is_active,
                isShowList: o.is_show_list,
                isExclusiveHome: o.is_exclusive_home,
                isPromoCarousel: o.is_promo_carousel,
                imageUrl: o.image_url,
                image: o.image_url,
                restaurantName: o.restaurant_name,
                expiryDate: o.expiry_date,
                startDate: o.start_date,
                titleAr: o.title_ar,
                descriptionAr: o.description_ar,
                discountAr: o.discount_ar
            }));
            setOffers(formatted);
        } catch (error) {
            console.error("Error fetching offers:", error);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchVenueOffers = useCallback(async (restaurantId) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('offers')
                .select('*, restaurants(id, name, name_ar, image_url, city)')
                .eq('restaurant_id', restaurantId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formatted = data.map(o => ({
                ...o,
                _id: o.id,
                restaurant: o.restaurants,
                active: o.is_active,
                isShowList: o.is_show_list,
                isExclusiveHome: o.is_exclusive_home,
                isPromoCarousel: o.is_promo_carousel,
                imageUrl: o.image_url,
                image: o.image_url,
                restaurantName: o.restaurant_name,
                expiryDate: o.expiry_date,
                startDate: o.start_date,
                titleAr: o.title_ar,
                descriptionAr: o.description_ar,
                discountAr: o.discount_ar
            }));
            setOffers(formatted);
        } catch (error) {
            console.error("Error fetching venue offers:", error);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchAdminOffers = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('offers')
                .select('*, restaurants(id, name, name_ar, image_url, city)')
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formatted = data.map(o => ({
                ...o,
                _id: o.id,
                restaurant: o.restaurants, // Compatibility with existing code
                active: o.is_active,
                isShowList: o.is_show_list,
                isExclusiveHome: o.is_exclusive_home,
                isPromoCarousel: o.is_promo_carousel,
                imageUrl: o.image_url,
                image: o.image_url,
                restaurantName: o.restaurant_name,
                expiryDate: o.expiry_date,
                startDate: o.start_date,
                titleAr: o.title_ar,
                descriptionAr: o.description_ar,
                discountAr: o.discount_ar
            }));
            setOffers(formatted);
        } catch (error) {
            console.error("Error fetching admin offers:", error);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const addOffer = async (offerData) => {
        try {
            const dbOffer = {
                title: offerData.title,
                title_ar: offerData.titleAr,
                description: offerData.description,
                description_ar: offerData.descriptionAr,
                discount: offerData.discount,
                discount_ar: offerData.discountAr,
                restaurant_id: offerData.restaurantId || offerData.restaurant,
                restaurant_name: offerData.restaurantName,
                image_url: offerData.imageUrl,
                start_date: offerData.startDate || new Date().toISOString(),
                expiry_date: offerData.expiryDate,
                is_active: offerData.active !== undefined ? offerData.active : true,
                is_exclusive_home: offerData.isExclusiveHome || false,
                is_show_list: offerData.isShowList !== undefined ? offerData.isShowList : true,
                is_promo_carousel: offerData.isPromoCarousel || false
            };

            console.log("Adding offer to DB:", dbOffer);
            const { data, error } = await supabase
                .from('offers')
                .insert([dbOffer])
                .select()
                .single();

            if (error) {
                console.error("Supabase insert error:", error);
                throw error;
            }

            if (!data) throw new Error("No data returned from insert");

            const newOffer = {
                ...data,
                _id: data.id,
                active: data.is_active,
                imageUrl: data.image_url,
                titleAr: data.title_ar,
                descriptionAr: data.description_ar,
                discountAr: data.discount_ar
            };
            setOffers(prev => [newOffer, ...prev]);
            return { success: true };
        } catch (error) {
            console.error("Error adding offer:", error);
            return { success: false, message: error.message };
        }
    };

    const updateOffer = async (id, offerData) => {
        try {
            const dbOffer = {
                title: offerData.title,
                title_ar: offerData.titleAr,
                description: offerData.description,
                description_ar: offerData.descriptionAr,
                discount: offerData.discount,
                discount_ar: offerData.discountAr,
                restaurant_id: offerData.restaurantId || offerData.restaurant,
                restaurant_name: offerData.restaurantName,
                image_url: offerData.imageUrl,
                expiry_date: offerData.expiryDate,
                is_active: offerData.active,
                is_exclusive_home: offerData.isExclusiveHome,
                is_show_list: offerData.isShowList,
                is_promo_carousel: offerData.isPromoCarousel
            };

            console.log(`Updating offer ${id}:`, dbOffer);
            const { data, error } = await supabase
                .from('offers')
                .update(dbOffer)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error("Supabase update error:", error);
                throw error;
            }

            if (!data) throw new Error("No data returned from update");

            const updatedOffer = {
                ...data,
                _id: data.id,
                active: data.is_active,
                imageUrl: data.image_url,
                titleAr: data.title_ar,
                descriptionAr: data.description_ar,
                discountAr: data.discount_ar
            };
            setOffers(prev => prev.map(o => o.id === id || o._id === id ? updatedOffer : o));
            return { success: true };
        } catch (error) {
            console.error("Error updating offer:", error);
            return { success: false, message: error.message };
        }
    };

    const deleteOffer = async (id) => {
        try {
            const { error } = await supabase
                .from('offers')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setOffers(prev => prev.filter(o => o.id !== id));
            return { success: true };
        } catch (error) {
            console.error("Error deleting offer:", error);
            return { success: false, message: error.message };
        }
    };

    return (
        <OfferContext.Provider value={{
            offers,
            loading,
            fetchOffers,
            fetchVenueOffers,
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
