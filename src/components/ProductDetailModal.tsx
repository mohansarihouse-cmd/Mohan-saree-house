import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  MessageCircle, 
  Play, 
  Image as ImageIcon, 
  CheckCircle2, 
  Send, 
  Sparkles,
  MapPin,
  Clock,
  Store
} from 'lucide-react';
import { ProductItem, CommentItem, Language, CustomerUser } from '../types';
import { translations } from '../translations';

interface ProductDetailModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  comments: CommentItem[];
  currentUser: CustomerUser | null;
  onOpenAuth: () => void;
  onRateProduct: (productId: string, score: number) => void;
  onAddComment: (productId: string, text: string, rating: number) => void;
  onToggleLike: (productId: string) => void;
  isLiked: boolean;
  isAdmin: boolean;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  language,
  comments,
  currentUser,
  onOpenAuth,
  onRateProduct,
  onAddComment,
  onToggleLike,
  isLiked,
  isAdmin,
}) => {
  if (!isOpen || !product) return null;
  const t = translations[language];
  const title = language === 'hi' ? product.title.hi : product.title.en;
  const description = language === 'hi' ? product.description.hi : product.description.en;

  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>('photos');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Rating & Comment Form state
  const userCurrentRating = currentUser?.ratedItems?.[product.id] || 0;
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(userCurrentRating || 5);
  const [commentText, setCommentText] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Filter visible comments: Admin sees all; Customers see only 'approved'
  const visibleComments = comments.filter(
    (c) => c.itemId === product.id && (isAdmin || c.status === 'approved')
  );

  const handleRatingSubmit = (score: number) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    setSelectedRating(score);
    onRateProduct(product.id, score);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (!commentText.trim()) {
      setValidationError(t.commentRequired);
      return;
    }

    onAddComment(product.id, commentText.trim(), selectedRating);
    setCommentText('');
    setValidationError('');
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 3500);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `${t.inquireMessage} ${product.title.en} (Item ID: ${product.id}, Price: ₹${product.price.toLocaleString('en-IN')})`
    );
    window.open(`https://wa.me/919876543210?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-auto shadow-2xl border border-amber-900/20 overflow-hidden relative flex flex-col md:flex-row max-h-[92vh] animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-xs cursor-pointer"
          title={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Media Preview (Photos & Videos) */}
        <div className="w-full md:w-1/2 bg-stone-900 flex flex-col justify-between shrink-0 relative">
          
          {/* Media Switcher Tabs */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            <button
              onClick={() => setActiveMediaTab('photos')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all backdrop-blur-md flex items-center gap-1.5 cursor-pointer ${
                activeMediaTab === 'photos'
                  ? 'bg-white text-stone-900 shadow-md'
                  : 'bg-black/50 text-white/80 hover:bg-black/70'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{t.viewPhotos}</span>
            </button>

            {product.videoUrl && (
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all backdrop-blur-md flex items-center gap-1.5 cursor-pointer ${
                  activeMediaTab === 'video'
                    ? 'bg-rose-900 text-white shadow-md'
                    : 'bg-black/50 text-white/80 hover:bg-black/70'
                }`}
              >
                <Play className="w-3.5 h-3.5 fill-current text-amber-300" />
                <span>{t.watchVideo}</span>
              </button>
            )}
          </div>

          {/* Media Player / Viewport */}
          <div className="w-full h-80 sm:h-96 md:h-[500px] flex items-center justify-center bg-stone-950 overflow-hidden relative">
            {activeMediaTab === 'photos' ? (
              <img
                src={product.images[selectedPhotoIndex] || product.images[0]}
                alt={title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain object-center"
              />
            ) : product.videoUrl ? (
              <div className="w-full h-full flex flex-col items-center justify-center p-4">
                <video
                  src={product.videoUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full max-h-full rounded-lg shadow-lg"
                />
              </div>
            ) : null}
          </div>

          {/* Thumbnails Strip */}
          {activeMediaTab === 'photos' && product.images.length > 1 && (
            <div className="p-3 bg-stone-950/90 flex gap-2 overflow-x-auto justify-center">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  className={`w-12 h-16 rounded-md overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                    selectedPhotoIndex === idx ? 'border-amber-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details, Ratings, Reviews & Store In-Person Notice */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 overflow-y-auto flex flex-col justify-between max-h-[92vh]">
          <div>
            {/* Header Info */}
            <div className="mb-4">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-900 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                  {product.subcategory}
                </span>
                <button
                  onClick={() => onToggleLike(product.id)}
                  className={`p-2 rounded-full border transition-all cursor-pointer ${
                    isLiked
                      ? 'bg-rose-900 text-white border-rose-950'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                  }`}
                  title={isLiked ? 'Unlike' : 'Like'}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-['Cinzel',serif] leading-tight">
                {title}
              </h2>

              {/* Price & Rating Bar */}
              <div className="flex items-center justify-between mt-3 py-2 border-y border-stone-100">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-rose-950">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-stone-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1 rounded-full border border-amber-200 text-amber-950 font-bold text-sm">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{product.averageRating > 0 ? product.averageRating.toFixed(1) : '5.0'}</span>
                  <span className="text-xs text-stone-400">({product.totalRatings})</span>
                </div>
              </div>
            </div>

            {/* Offline Showroom Banner Notice */}
            <div className="bg-amber-50 border border-amber-300/80 rounded-xl p-3 mb-4 space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-950">
                <Store className="w-4 h-4 text-amber-700 shrink-0" />
                <span>{t.offlineBadge}</span>
              </div>
              <p className="text-[11px] text-stone-700 leading-relaxed">
                {t.offlineNotice}
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3 text-[10px] text-amber-900 font-semibold border-t border-amber-200/60">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-700" />
                  10:30 AM - 9:00 PM (Daily)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-amber-700" />
                  Main Market, Saree Mandi
                </span>
              </div>
            </div>

            {/* Specifications Chips */}
            <div className="grid grid-cols-2 gap-2 text-xs mb-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">{t.fabric}</span>
                <span className="font-semibold text-stone-800">{product.fabric}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">{t.work}</span>
                <span className="font-semibold text-stone-800">{product.work}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">{t.color}</span>
                <span className="font-semibold text-stone-800">{product.color}</span>
              </div>
              <div>
                <span className="text-stone-400 block text-[10px] uppercase font-bold">Showroom Availability</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {t.inStock}
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5">
              {description}
            </p>

            {/* Interactive Rating Section ("enable customer to rate the best item") */}
            <div className="bg-amber-50/70 rounded-xl p-4 border border-amber-200/80 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  {t.rateItem}
                </span>
                {userCurrentRating > 0 && (
                  <span className="text-[11px] text-amber-800 font-semibold">
                    {language === 'hi' ? `आपकी रेटिंग: ${userCurrentRating} ⭐` : `Your Rating: ${userCurrentRating} ⭐`}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = (hoverRating || selectedRating) >= star;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRatingSubmit(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                      title={`Rate ${star} Stars`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          isActive
                            ? 'fill-amber-500 text-amber-500 drop-shadow-xs'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="text-xs font-bold text-stone-600 ml-2">
                  {selectedRating} / 5
                </span>
              </div>
            </div>

            {/* Customer Reviews & Comment Box */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <h4 className="font-bold text-sm text-stone-900 flex items-center gap-1.5 font-['Cinzel',serif]">
                  <span>{t.reviewsLabel}</span>
                  <span className="text-xs font-sans text-stone-500">
                    ({visibleComments.length})
                  </span>
                </h4>
                <span className="text-[11px] text-stone-400">
                  {t.verifiedBuyer}
                </span>
              </div>

              {/* Leave a Review Form */}
              <form onSubmit={handleCommentSubmit} className="space-y-2 bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800">
                    {t.leaveComment}
                  </span>
                  {currentUser ? (
                    <span className="text-[11px] text-stone-500">
                      Posting as: <strong className="text-rose-900">{currentUser.name}</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={onOpenAuth}
                      className="text-[11px] text-rose-800 font-bold underline cursor-pointer"
                    >
                      {t.loginWithPhone}
                    </button>
                  )}
                </div>

                <textarea
                  value={commentText}
                  onChange={(e) => {
                    setCommentText(e.target.value);
                    setValidationError('');
                  }}
                  placeholder={t.writeCommentPlaceholder}
                  rows={2}
                  className="w-full text-xs p-2.5 border rounded-lg border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-800 text-stone-900 bg-white"
                />

                {validationError && (
                  <p className="text-[11px] text-red-600 font-medium">
                    {validationError}
                  </p>
                )}

                {submitSuccess && (
                  <div className="bg-emerald-50 text-emerald-800 p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 border border-emerald-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.reviewSuccess}</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-stone-400">
                    {t.commentModerationNotice}
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-rose-950 hover:bg-rose-900 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>{t.submitReview}</span>
                  </button>
                </div>
              </form>

              {/* Comments List */}
              <div className="space-y-3 pt-2">
                {visibleComments.length === 0 ? (
                  <p className="text-xs text-stone-400 italic text-center py-4">
                    {t.noReviewsYet}
                  </p>
                ) : (
                  visibleComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="p-3 bg-stone-50/70 rounded-xl border border-stone-200/80 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-stone-900">
                            {comment.userName}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            (+91 {comment.userPhone.slice(-4)})
                          </span>
                          {comment.rating && (
                            <span className="inline-flex items-center gap-0.5 text-amber-600 font-bold ml-1">
                              <Star className="w-3 h-3 fill-current text-amber-500" />
                              {comment.rating}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isAdmin && (
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase ${
                                comment.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {comment.status}
                            </span>
                          )}
                          <span className="text-[10px] text-stone-400">
                            {new Date(comment.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      </div>

                      <p className="text-stone-700 leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sticky In-Store WhatsApp Inquiry Action */}
          <div className="pt-6 mt-6 border-t border-stone-100">
            <button
              onClick={handleWhatsApp}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.inquireWhatsApp}</span>
            </button>
            <p className="text-[10px] text-stone-400 text-center mt-1.5">
              Call / WhatsApp Mohan Saree House at +91 98765 43210 to check showroom stock & timings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
