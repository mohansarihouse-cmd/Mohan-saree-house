import React from 'react';
import { Star, Heart, MessageSquare, Play, MessageCircle, Sparkles, MapPin } from 'lucide-react';
import { ProductItem, Language } from '../types';
import { translations } from '../translations';

interface ProductCardProps {
  product: ProductItem;
  language: Language;
  onSelect: (product: ProductItem) => void;
  onToggleLike: (productId: string) => void;
  isLiked: boolean;
  commentCount: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  language,
  onSelect,
  onToggleLike,
  isLiked,
  commentCount,
}) => {
  const t = translations[language];
  const title = language === 'hi' ? product.title.hi : product.title.en;

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = encodeURIComponent(
      `${t.inquireMessage} ${product.title.en} (Item ID: ${product.id}, Price: ₹${product.price.toLocaleString('en-IN')})`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div
      onClick={() => onSelect(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-amber-900/10 hover:border-amber-700/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Media Box */}
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
        <img
          src={product.images[0]}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Video badge if video is present */}
        {product.videoUrl && (
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white px-2.5 py-1 rounded-full text-[11px] font-medium flex items-center gap-1.5 shadow-sm">
            <Play className="w-3 h-3 fill-current text-amber-300" />
            <span>{t.watchVideo}</span>
          </div>
        )}

        {/* Badges: Trending, Offline Store or Bestseller */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.trendingScore >= 90 && (
            <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-200" />
              {t.trendingBadge}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-rose-900 text-amber-100 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleLike(product.id);
          }}
          className={`absolute top-3 right-3 p-2.5 rounded-full backdrop-blur-md transition-all shadow-md cursor-pointer ${
            isLiked
              ? 'bg-rose-900/90 text-white'
              : 'bg-white/80 hover:bg-white text-stone-700 hover:text-rose-700'
          }`}
          title={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Content Box */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Subcategory & Fabric Tag */}
          <div className="flex items-center justify-between text-[11px] text-amber-900/80 font-semibold mb-1 uppercase tracking-wider">
            <span>{product.subcategory}</span>
            <span>{product.fabric}</span>
          </div>

          {/* Product Title */}
          <h3 className="font-bold text-stone-900 text-base leading-snug group-hover:text-rose-950 transition-colors line-clamp-2 mb-2 font-['Cinzel',serif]">
            {title}
          </h3>

          {/* Ratings & Comments Metrics */}
          <div className="flex items-center gap-2 mb-3">
            <div className="inline-flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 text-xs font-bold text-amber-950">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>{product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}</span>
            </div>
            <span className="text-xs text-stone-500">
              ({product.totalRatings} {t.ratingLabel})
            </span>
            <span className="text-stone-300">•</span>
            <span className="text-xs text-stone-500 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-stone-400" />
              {commentCount}
            </span>
          </div>
        </div>

        {/* Pricing & Offline In-Store Notice */}
        <div className="pt-3 border-t border-stone-100 mt-auto">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-stone-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-stone-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              In Showroom
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(product)}
              className="py-2 px-3 text-xs font-bold text-rose-950 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200/80 transition-colors text-center cursor-pointer"
            >
              {t.rateItem}
            </button>
            <button
              onClick={handleWhatsApp}
              className="py-2 px-3 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
