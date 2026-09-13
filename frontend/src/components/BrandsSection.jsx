// src/components/BrandsSection.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, ChevronRight } from 'lucide-react';

const BrandsSection = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/vehicles/featured-brands/');
                const data = await response.json();
                setBrands(data);
            } catch (err) {
                console.error('Failed to load brands:', err);
                setError('Failed to load brands');
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#8B1A1A]">
                        Browse by Brand
                    </h3>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-[#2D1B0E] mt-1">
                        Popular <span className="text-[#8B1A1A]">Brands</span>
                    </h2>
                </div>
                <Link
                    to="/vehicles"
                    className="flex items-center gap-1 text-sm font-semibold text-[#8B1A1A] hover:text-[#6B1515]"
                >
                    View All <ChevronRight size={16} />
                </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {brands.map((brand) => (
                    <BrandCard key={brand.id} brand={brand} />
                ))}
            </div>
        </div>
    );
};

// Brand Card Component
const BrandCard = ({ brand }) => {
    const [imageError, setImageError] = useState(false);

    return (
        <Link
            to={`/vehicles?brand=${brand.id}`}
            className="group relative overflow-hidden rounded-xl bg-white border border-[#D4A853]/20 p-4 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-[#8B1A1A]/10 hover:border-[#8B1A1A]/30"
        >
            {/* Brand Logo/Image */}
            <div className="relative h-16 w-full flex items-center justify-center">
                {brand.primary_image?.image && !imageError ? (
                    <img
                        src={brand.primary_image.image}
                        alt={brand.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="w-12 h-12 rounded-full bg-[#8B1A1A]/10 flex items-center justify-center">
                        <Car size={24} className="text-[#8B1A1A]" />
                    </div>
                )}
            </div>

            {/* Brand Name */}
            <h4 className="mt-3 font-bold text-sm text-[#2D1B0E] group-hover:text-[#8B1A1A] transition-colors">
                {brand.name}
            </h4>

            {/* Vehicle Count */}
            <p className="text-xs text-[#8A7A6A]">
                {brand.vehicle_count} vehicles
            </p>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#8B1A1A]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Link>
    );
};

export default BrandsSection;