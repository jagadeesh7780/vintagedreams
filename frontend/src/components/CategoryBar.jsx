import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  FaTshirt, 
  FaClock, 
  FaRing, 
  FaFemale, 
  FaGem, 
  FaThLarge 
} from 'react-icons/fa';
import { GiTrousers, GiRunningShoe, GiDress, GiIndianPalace } from 'react-icons/gi';

const categories = [
  { id: 'all', name: 'All Collection', icon: FaThLarge, color: 'bg-indigo-50 text-indigo-600' },
  { id: 'shirts', name: 'Shirts & Polos', icon: FaTshirt, color: 'bg-blue-50 text-blue-600', gender: 'men' },
  { id: 'pants', name: 'Pants & Cargos', icon: GiTrousers, color: 'bg-emerald-50 text-emerald-600', gender: 'men' },
  { id: 'shoes', name: 'Shoes & Sneakers', icon: GiRunningShoe, color: 'bg-amber-50 text-amber-600', gender: 'men' },
  { id: 'watches', name: 'Luxury Watches', icon: FaClock, color: 'bg-purple-50 text-purple-600', gender: 'men' },
  { id: 'rings', name: 'Silver Rings', icon: FaRing, color: 'bg-rose-50 text-rose-600', gender: 'men' },
  { id: 'women-dresses', name: "Women's Dresses", icon: GiDress, color: 'bg-pink-50 text-pink-600', gender: 'women' },
  { id: 'women-tops', name: 'Tops & Kurtis', icon: FaFemale, color: 'bg-teal-50 text-teal-600', gender: 'women' },
  { id: 'women-jewelry', name: 'Fine Jewelry', icon: FaGem, color: 'bg-violet-50 text-violet-600', gender: 'women' },
  { id: 'women-sarees', name: 'Silk Sarees', icon: GiIndianPalace, color: 'bg-red-50 text-red-600', gender: 'women' },
];

const CategoryBar = () => {
  const [searchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'all';

  return (
    <div className="bg-white border-b border-gray-200 py-3 shadow-sm sticky top-16 z-30 overflow-x-auto no-scrollbar">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-start md:justify-center gap-4 sm:gap-6 min-w-max">
        {categories.map((cat) => {
          const IconComponent = cat.icon;
          const isActive = currentCategory === cat.id;

          return (
            <Link
              key={cat.id}
              to={cat.id === 'all' ? '/products' : `/products?category=${cat.id}${cat.gender ? `&gender=${cat.gender}` : ''}`}
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
                className={`text-xs mt-1.5 font-medium transition-colors ${
                  isActive ? 'text-rose-600 font-bold' : 'text-gray-700 group-hover:text-rose-600'
                }`}
              >
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBar;
