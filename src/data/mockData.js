export const restaurants = [
    {
        id: 1,
        name: {
            en: "Sufra Restaurant",
            ar: "مطعم سفرة"
        },
        image: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=800&q=80",
        cuisine: "Jordanian",
        rating: 4.9,
        location: {
            en: "Rainbow St., Amman",
            ar: "شارع الرينبو، عمان"
        },
        priceRange: "$$$",
        description: {
            en: "Authentic Jordanian cuisine served in a beautiful historic house. Famous for their Mansaf and fresh baked bread.",
            ar: "مأكولات أردنية أصيلة تقدم في منزل تاريخي جميل. يشتهرون بالمنسف والخبز الطازج."
        }
    },
    {
        id: 2,
        name: {
            en: "Romero",
            ar: "روميرو"
        },
        image: "https://images.unsplash.com/photo-1514362545857-3bc16549766b?w=800&q=80",
        cuisine: "Italian",
        rating: 4.8,
        location: {
            en: "Abdoun, Amman",
            ar: "عبدون، عمان"
        },
        priceRange: "$$$$",
        description: {
            en: "A pioneer of Italian fine dining in Amman since 1979. Offers a romantic atmosphere and exquisite pasta dishes.",
            ar: "رائد الطعام الإيطالي الفاخر في عمان منذ عام 1979. يوفر أجواء رومانسية وأطباق معكرونة رائعة."
        }
    },
    {
        id: 3,
        name: {
            en: "Hashem Restaurant",
            ar: "مطعم هاشم"
        },
        image: "https://images.unsplash.com/photo-1541544744-37570a8fd6a2?w=800&q=80",
        cuisine: "Jordanian",
        rating: 4.7,
        location: {
            en: "Downtown, Amman",
            ar: "وسط البلد، عمان"
        },
        priceRange: "$",
        description: {
            en: "Legendary street food spot downtown, famous for crispy falafel, smooth hummus, and sweet tea. A must-visit landmark.",
            ar: "مكان أسطوري لطعام الشارع في وسط البلد، يشتهر بالفلافل المقرمشة، والحمص الناعم، والشاي الحلو. معلم يجب زيارته."
        }
    },
    {
        id: 4,
        name: {
            en: "Blue Fig",
            ar: "بلو فيج"
        },
        image: "https://images.unsplash.com/photo-1466978913421-dad938661248?w=800&q=80",
        cuisine: "Cafe",
        rating: 4.6,
        location: {
            en: "Abdoun, Amman",
            ar: "عبدون، عمان"
        },
        priceRange: "$$",
        description: {
            en: "Trendy cafe and restaurant offering a fusion of international flavors, great coffee, and a vibrant atmosphere.",
            ar: "كافيه ومطعم عصري يقدم مزيجاً من النكهات العالمية، وقهوة رائعة، وأجواء مفعمة بالحيوية."
        }
    },
    {
        id: 5,
        name: {
            en: "Fakhreldin",
            ar: "فخر الدين"
        },
        image: "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?w=800&q=80",
        cuisine: "Levantine",
        rating: 4.9,
        location: {
            en: "Jabal Amman, Amman",
            ar: "جبل عمان، عمان"
        },
        priceRange: "$$$$",
        description: {
            en: "The epitome of Levantine fine dining. Enjoy exceptional mezze and grills in a grand heritage villa.",
            ar: "قمة الطعام الشامي الفاخر. استمتع بمقبلات ومشويات استثنائية في فيلا تراثية فخمة."
        }
    },
    {
        id: 6,
        name: {
            en: "Shams El Balad",
            ar: "شمس البلد"
        },
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80",
        cuisine: "Jordanian",
        rating: 4.7,
        location: {
            en: "Jabal Amman, Amman",
            ar: "جبل عمان، عمان"
        },
        priceRange: "$$",
        description: {
            en: "Farm-to-table concept serving local organic dishes with a stunning view of the Citadel.",
            ar: "مفهوم من المزرعة إلى المائدة يقدم أطباقاً عضوية محلية مع إطلالة خلابة على القلعة."
        }
    }
];

export const offers = [
    {
        id: 1,
        title: {
            en: "Ramadan Iftar",
            ar: "إفطار رمضان"
        },
        discount: { en: "20% OFF", ar: "خصم ٢٠٪" },
        description: {
            en: "Special Iftar buffet with traditional desserts.",
            ar: "بوفيه إفطار مميز مع حلويات تقليدية."
        },
        restaurantId: 1
    },
    {
        id: 2,
        title: {
            en: "Morning Coffee",
            ar: "قهوة الصباح"
        },
        discount: { en: "Buy 1 Get 1", ar: "اشتر ١ واحصل على ١" },
        description: {
            en: "Start your day right with our premium blend.",
            ar: "ابدأ يومك بطريقة صحيحة مع خلطتنا المميزة."
        },
        restaurantId: 4
    }
];
