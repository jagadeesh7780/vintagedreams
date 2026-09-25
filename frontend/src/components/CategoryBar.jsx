import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  FaTshirt, 
  FaClock, 
  FaRing, 
  FaFemale, 
  FaGem, 
  FaThLarge,
  FaMale,
  FaCrown
} from 'react-icons/fa';
import { GiTrousers, GiRunningShoe, GiDress, GiIndianPalace, GiHighHeel } from 'react-icons/gi';

const allCategories = [
  // Vintage Highlight Collection (both genders)
  { id: 'vintage-collection', name: 'Vintage Archive', icon: FaCrown, color: 'bg-amber-100 text-amber-900 border border-amber-300', gender: 'all' },

  // Men's categories
  { id: 'shirts', name: 'Shirts & Polos', icon: FaTshirt, color: 'bg-blue-50 text-blue-600', gender: 'men' },
  { id: 'pants', name: 'Pants & Cargos', icon: GiTrousers, color: 'bg-emerald-50 text-emerald-600', gender: 'men' },
  { id: 'shoes', name: 'Shoes & Sneakers', icon: GiRunningShoe, color: 'bg-amber-50 text-amber-600', gender: 'men' },
  { id: 'watches', name: 'Luxury Watches', icon: FaClock, color: 'bg-purple-50 text-purple-600', gender: 'men' },
  { id: 'rings', name: '925 Silver Rings', icon: FaRing, color: 'bg-rose-50 text-rose-600', gender: 'men' },

  // Women's categories
  { id: 'women-dresses', name: "Dresses & Gowns", icon: GiDress, color: 'bg-pink-50 text-pink-600', gender: 'women' },
  { id: 'women-tops', name: 'Tops & Kurtis', icon: FaFemale, color: 'bg-teal-50 text-teal-600', gender: 'women' },
  { id: 'women-jewelry', name: 'Fine Jewelry', icon: FaGem, color: 'bg-violet-50 text-violet-600', gender: 'women' },
  { id: 'women-sarees', name: 'Silk Sarees', icon: GiIndianPalace, color: 'bg-red-50 text-red-600', gender: 'women' },
  { id: 'women-footwear', name: 'Footwear & Bags', icon: GiHighHeel, color: 'bg-rose-50 text-rose-600', gender: 'women' },
];

const CategoryBar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentCategory = searchParams.get('category') || 'all';
  const currentGender = searchParams.get('gender') || 'all';
  const [selectedGender, setSelectedGender] = useState(currentGender);

  // Filter category icons based on selected gender tab
  const displayedCategories = allCategories.filter((cat) => {
    if (selectedGender === 'all') return true;
    return cat.gender === selectedGender;
  });

  const handleGenderTabClick = (gender) => {
    setSelectedGender(gender);
    if (gender === 'all') {
      navigate('/products');
    } else {
      navigate(`/products?gender=${gender}`);
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  return (
    <div className="bg-white border-b border-gray-200 py-3 shadow-sm sticky top-16 z-30 space-y-2">
      
      {/* Top Gender Switcher Filter Buttons */}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
        <button
          onClick={() => handleGenderTabClick('all')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedGender === 'all'
              ? 'bg-gray-950 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <FaThLarge size={11} />
          <span>ALL CATEGORIES (500+ ITEMS)</span>
        </button>

        <button
          onClick={() => handleGenderTabClick('men')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedGender === 'men'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          <FaMale size={13} />
          <span>MEN'S FASHION ONLY</span>
        </button>

        <button
          onClick={() => handleGenderTabClick('women')}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            selectedGender === 'women'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
          }`}
        >
          <FaFemale size={13} />
          <span>WOMEN'S FASHION ONLY</span>
        </button>
      </div>

      {/* Horizontal Category Icons List */}
      <div className="overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-start md:justify-center gap-4 sm:gap-6 min-w-max py-1">
          {displayedCategories.map((cat) => {
            const IconComponent = cat.icon;
            const isActive = currentCategory === cat.id;

            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}&gender=${cat.gender}`}
                className="flex flex-col items-center group cursor-pointer transition-transform hover:-translate-y-0.5"
              >
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'ring-2 ring-rose-600 ring-offset-2 bg-rose-600 text-white shadow-md'
                      : `${cat.color} group-hover:scale-110 shadow-sm`
                  }`}
                >
                  <IconComponent size={20} className={isActive ? 'text-white' : ''} />
                </div>
                <span
                  className={`text-xs mt-1.5 font-semibold transition-colors ${
                    isActive ? 'text-rose-600 font-extrabold' : 'text-gray-700 group-hover:text-rose-600'
                  }`}
                >
                  {cat.name}
                </span>
                <span className="text-[9px] text-gray-400 font-medium">50+ items</span>
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default CategoryBar;
