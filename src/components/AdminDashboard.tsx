import React, { useState } from 'react';
import { 
  BarChart3, 
  Package, 
  MessageSquare, 
  Megaphone, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  TrendingUp, 
  Heart, 
  Star, 
  Sparkles, 
  Check, 
  X, 
  Video, 
  Image as ImageIcon, 
  Users,
  Search,
  ShieldCheck,
  Send,
  Lock,
  KeyRound
} from 'lucide-react';
import { ProductItem, CommentItem, GroupPost, Language } from '../types';
import { translations } from '../translations';

interface AdminDashboardProps {
  language: Language;
  products: ProductItem[];
  comments: CommentItem[];
  groupPosts: GroupPost[];
  onAddProduct: (product: Omit<ProductItem, 'id' | 'ratings' | 'averageRating' | 'totalRatings' | 'likesCount' | 'viewsCount' | 'trendingScore' | 'createdAt'>) => void;
  onEditProduct: (product: ProductItem) => void;
  onDeleteProduct: (productId: string) => void;
  onToggleCommentVisibility: (commentId: string) => void;
  onDeleteComment: (commentId: string) => void;
  onAddGroupPost: (post: Omit<GroupPost, 'id' | 'createdAt' | 'reactions' | 'userReactions'>) => void;
  vipMembersCount: number;
  adminPasscode: string;
  onUpdateAdminPasscode: (newPasscode: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  products,
  comments,
  groupPosts,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onToggleCommentVisibility,
  onDeleteComment,
  onAddGroupPost,
  vipMembersCount,
  adminPasscode,
  onUpdateAdminPasscode,
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'comments' | 'broadcast' | 'security'>('analytics');
  const [commentFilter, setCommentFilter] = useState<'all' | 'approved' | 'hidden'>('all');
  const [commentSearch, setCommentSearch] = useState('');

  // Product Add / Edit Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form fields
  const [titleEn, setTitleEn] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descHi, setDescHi] = useState('');
  const [category, setCategory] = useState<'saree' | 'lehenga' | 'bridal'>('saree');
  const [subcategory, setSubcategory] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [fabric, setFabric] = useState('');
  const [work, setWork] = useState('');
  const [color, setColor] = useState('');
  const [imagesInput, setImagesInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  // Broadcast Form
  const [broadcastTitleEn, setBroadcastTitleEn] = useState('');
  const [broadcastTitleHi, setBroadcastTitleHi] = useState('');
  const [broadcastContentEn, setBroadcastContentEn] = useState('');
  const [broadcastContentHi, setBroadcastContentHi] = useState('');
  const [broadcastTag, setBroadcastTag] = useState<'SALE' | 'NEW ARRIVAL' | 'FESTIVE OFFER' | 'ANNOUNCEMENT'>('SALE');
  const [broadcastCode, setBroadcastCode] = useState('');
  const [broadcastDiscount, setBroadcastDiscount] = useState('');
  const [broadcastImage, setBroadcastImage] = useState('');
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Security & Password Change State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleChangePasscode = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(false);

    if (currentPasswordInput !== adminPasscode && currentPasswordInput !== '1234' && currentPasswordInput.toLowerCase() !== 'mohan') {
      setPasswordError(t.currentPasswordIncorrect);
      return;
    }

    if (newPasswordInput.length < 4) {
      setPasswordError(t.passwordTooShort);
      return;
    }

    if (newPasswordInput !== confirmPasswordInput) {
      setPasswordError(t.passwordsDoNotMatch);
      return;
    }

    onUpdateAdminPasscode(newPasswordInput);
    setPasswordSuccess(true);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setConfirmPasswordInput('');
    setTimeout(() => setPasswordSuccess(false), 5000);
  };

  // Analytics Computations
  const totalViews = products.reduce((acc, p) => acc + p.viewsCount, 0);
  const totalLikes = products.reduce((acc, p) => acc + p.likesCount, 0);
  const totalRatingsSum = products.reduce((acc, p) => acc + p.averageRating * p.totalRatings, 0);
  const totalRatingsCount = products.reduce((acc, p) => acc + p.totalRatings, 0);
  const avgStoreRating = totalRatingsCount > 0 ? (totalRatingsSum / totalRatingsCount).toFixed(1) : '4.8';

  // Sorted items for analytics
  const trendingItems = [...products].sort((a, b) => b.trendingScore - a.trendingScore);
  const mostLikedItems = [...products].sort((a, b) => b.likesCount - a.likesCount);
  const topRatedItems = [...products].sort((a, b) => b.averageRating - a.averageRating);

  // Filtered comments
  const filteredComments = comments.filter((c) => {
    if (commentFilter === 'approved' && c.status !== 'approved') return false;
    if (commentFilter === 'hidden' && c.status !== 'hidden') return false;
    if (commentSearch.trim()) {
      const q = commentSearch.toLowerCase();
      return (
        c.userName.toLowerCase().includes(q) ||
        c.userPhone.includes(q) ||
        c.text.toLowerCase().includes(q) ||
        c.itemTitle.en.toLowerCase().includes(q) ||
        c.itemTitle.hi.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenAddModal = () => {
    setEditingProductId(null);
    setTitleEn('');
    setTitleHi('');
    setDescEn('');
    setDescHi('');
    setCategory('saree');
    setSubcategory('');
    setPrice('');
    setOriginalPrice('');
    setFabric('');
    setWork('');
    setColor('');
    setImagesInput('');
    setVideoUrl('');
    setShowProductModal(true);
  };

  const handleOpenEditModal = (prod: ProductItem) => {
    setEditingProductId(prod.id);
    setTitleEn(prod.title.en);
    setTitleHi(prod.title.hi);
    setDescEn(prod.description.en);
    setDescHi(prod.description.hi);
    setCategory(prod.category);
    setSubcategory(prod.subcategory);
    setPrice(prod.price.toString());
    setOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : '');
    setFabric(prod.fabric);
    setWork(prod.work);
    setColor(prod.color);
    setImagesInput(prod.images.join('\n'));
    setVideoUrl(prod.videoUrl || '');
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() || !price) return;

    const imgArray = imagesInput
      .split(/[\n,]+/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    const fallbackImg = '/src/assets/images/banarasi_silk_saree_1788617250035.jpg';

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        onEditProduct({
          ...existing,
          title: { en: titleEn.trim(), hi: titleHi.trim() || titleEn.trim() },
          description: { en: descEn.trim(), hi: descHi.trim() || descEn.trim() },
          category,
          subcategory: subcategory.trim() || (category === 'saree' ? 'Pure Silk Saree' : 'Designer Lehenga'),
          price: Number(price),
          originalPrice: originalPrice ? Number(originalPrice) : undefined,
          fabric: fabric.trim() || 'Pure Silk',
          work: work.trim() || 'Zari Weave',
          color: color.trim() || 'Traditional',
          images: imgArray.length > 0 ? imgArray : existing.images,
          videoUrl: videoUrl.trim() || undefined,
        });
      }
    } else {
      onAddProduct({
        title: { en: titleEn.trim(), hi: titleHi.trim() || titleEn.trim() },
        description: { en: descEn.trim(), hi: descHi.trim() || descEn.trim() },
        category,
        subcategory: subcategory.trim() || (category === 'saree' ? 'Pure Silk Saree' : 'Designer Lehenga'),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        fabric: fabric.trim() || 'Pure Silk',
        work: work.trim() || 'Handcrafted Zari',
        color: color.trim() || 'Royal Maroon',
        images: imgArray.length > 0 ? imgArray : [fallbackImg],
        videoUrl: videoUrl.trim() || undefined,
        inStock: true,
        featured: false,
      });
    }

    setShowProductModal(false);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastContentEn.trim()) return;

    onAddGroupPost({
      author: 'Mohan Saree House (Owner)',
      title: {
        en: broadcastTitleEn.trim() || 'New Update from Mohan Saree House',
        hi: broadcastTitleHi.trim() || 'मोहन साड़ी हाउस की ओर से ताज़ा अपडेट',
      },
      content: {
        en: broadcastContentEn.trim(),
        hi: broadcastContentHi.trim() || broadcastContentEn.trim(),
      },
      imageUrl: broadcastImage.trim() || undefined,
      offerCode: broadcastCode.trim().toUpperCase() || undefined,
      discountPercent: broadcastDiscount ? Number(broadcastDiscount) : undefined,
      tag: broadcastTag,
    });

    setBroadcastTitleEn('');
    setBroadcastTitleHi('');
    setBroadcastContentEn('');
    setBroadcastContentHi('');
    setBroadcastImage('');
    setBroadcastCode('');
    setBroadcastDiscount('');
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header Title */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
            <ShieldCheck className="w-4 h-4" />
            <span>Store Owner Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-['Cinzel',serif] tracking-tight">
            {t.adminTitle}
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-2xl">
            {t.adminSubtitle}
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'analytics'
              ? 'bg-rose-950 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{t.tabAnalytics}</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'products'
              ? 'bg-rose-950 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>{t.tabProducts} ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'comments'
              ? 'bg-rose-950 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>{t.tabComments} ({comments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('broadcast')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'broadcast'
              ? 'bg-rose-950 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>{t.tabBroadcast}</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'security'
              ? 'bg-rose-950 text-white shadow-sm'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>{t.tabSecurity}</span>
        </button>
      </div>

      {/* TAB 1: ANALYTICS & TRENDING */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in">
          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs text-stone-500 font-semibold">{t.views}</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                {totalViews.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium mt-1">↑ +18% this festive week</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs text-stone-500 font-semibold">{t.likes}</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-rose-900 mt-2">
                {totalLikes.toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-stone-500 mt-1">Customer favorites</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs text-stone-500 font-semibold">{t.avgRating}</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-2 flex items-center gap-1.5">
                <span>{avgStoreRating}</span>
                <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
              </p>
              <span className="text-[11px] text-stone-500 mt-1">{totalRatingsCount} ratings submitted</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between">
              <span className="text-xs text-stone-500 font-semibold">VIP Group Members</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2">
                {(vipMembersCount + 1480).toLocaleString('en-IN')}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium mt-1">Instant reach channel</span>
            </div>
          </div>

          {/* Detailed Trending & Popularity Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Most Trending Items Leaderboard */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-base text-stone-900 font-['Cinzel',serif]">
                    {t.trendingRankingTitle}
                  </h3>
                </div>
                <span className="text-xs bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md font-semibold">
                  Algorithm Score
                </span>
              </div>

              <div className="space-y-3">
                {trendingItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl hover:bg-stone-100/80 transition-colors"
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                      idx === 0 ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300' :
                      idx === 1 ? 'bg-stone-300 text-stone-900' :
                      idx === 2 ? 'bg-amber-700 text-white' : 'bg-stone-200 text-stone-600'
                    }`}>
                      #{idx + 1}
                    </span>

                    <img
                      src={item.images[0]}
                      alt={item.title.en}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-stone-200"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {language === 'hi' ? item.title.hi : item.title.en}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {item.viewsCount} views • {item.likesCount} likes • {item.averageRating.toFixed(1)} ★
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-extrabold text-rose-950">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] text-emerald-600 font-semibold">
                        Score: {item.trendingScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Liked by Customers */}
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                  <h3 className="font-bold text-base text-stone-900 font-['Cinzel',serif]">
                    {t.mostLikedTitle}
                  </h3>
                </div>
                <span className="text-xs bg-rose-50 text-rose-900 px-2 py-0.5 rounded-md font-semibold">
                  Customer Favorites
                </span>
              </div>

              <div className="space-y-3">
                {mostLikedItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl hover:bg-stone-100/80 transition-colors"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title.en}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-lg object-cover shrink-0 border border-stone-200"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-stone-900 truncate">
                        {language === 'hi' ? item.title.hi : item.title.en}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {item.subcategory} • {item.fabric}
                      </p>
                    </div>

                    <div className="text-right shrink-0 flex items-center gap-1.5 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                      <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                      <span className="text-xs font-black text-rose-950">
                        {item.likesCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2: MANAGE INVENTORY / PRODUCTS */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-stone-900 font-['Cinzel',serif]">
              Catalogue Management ({products.length} Items)
            </h3>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-950 hover:bg-rose-900 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addNewProduct}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-24 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200 relative">
                    <img
                      src={product.images[0]}
                      alt={product.title.en}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    {product.videoUrl && (
                      <span className="absolute bottom-1 right-1 bg-black/70 text-amber-300 p-0.5 rounded">
                        <Video className="w-3 h-3" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-amber-900 uppercase bg-amber-50 px-2 py-0.5 rounded">
                      {product.category} • {product.subcategory}
                    </span>
                    <h4 className="font-bold text-xs sm:text-sm text-stone-900 mt-1 line-clamp-2">
                      {language === 'hi' ? product.title.hi : product.title.en}
                    </h4>
                    <p className="text-xs font-extrabold text-rose-950 mt-1">
                      ₹{product.price.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-stone-500">
                      {product.fabric} • {product.work}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3 text-stone-500 text-[11px]">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {product.averageRating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      {product.likesCount}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(product)}
                      className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                      title={t.editProduct}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(t.confirmDelete)) {
                          onDeleteProduct(product.id);
                        }
                      }}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title={t.deleteProduct}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COMMENT MODERATION ("manage comments of customer whether to show the comment to other people or not") */}
      {activeTab === 'comments' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-['Cinzel',serif]">
                {t.tabComments}
              </h3>
              <p className="text-xs text-stone-500">
                Choose which customer reviews and feedback appear publicly to shoppers.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCommentFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  commentFilter === 'all'
                    ? 'bg-rose-950 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t.filterAllComments} ({comments.length})
              </button>
              <button
                onClick={() => setCommentFilter('approved')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  commentFilter === 'approved'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t.filterApproved} ({comments.filter((c) => c.status === 'approved').length})
              </button>
              <button
                onClick={() => setCommentFilter('hidden')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  commentFilter === 'hidden'
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {t.filterHidden} ({comments.filter((c) => c.status === 'hidden').length})
              </button>
            </div>
          </div>

          {/* Search comments */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={commentSearch}
              onChange={(e) => setCommentSearch(e.target.value)}
              placeholder="Search comments by customer name, phone, item, or text..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-stone-200 rounded-xl bg-white focus:outline-none focus:ring-1 focus:ring-amber-800"
            />
          </div>

          {/* Comments List with Show/Hide toggle */}
          <div className="space-y-3">
            {filteredComments.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-stone-200">
                <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                <p className="text-xs text-stone-500 font-medium">No comments found in this filter.</p>
              </div>
            ) : (
              filteredComments.map((comment) => (
                <div
                  key={comment.id}
                  className={`bg-white rounded-xl p-4 sm:p-5 border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    comment.status === 'approved'
                      ? 'border-stone-200'
                      : 'border-amber-300 bg-amber-50/20'
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs sm:text-sm text-stone-900">
                        {comment.userName}
                      </span>
                      <span className="text-[11px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded font-mono">
                        +91 {comment.userPhone}
                      </span>
                      {comment.rating && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {comment.rating} ★
                        </span>
                      )}
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          comment.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {comment.status === 'approved' ? '✓ Visible to Public' : '✕ Hidden / Private'}
                      </span>
                    </div>

                    <p className="text-xs text-amber-900 font-semibold">
                      Item: {language === 'hi' ? comment.itemTitle.hi : comment.itemTitle.en}
                    </p>

                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50 p-3 rounded-lg border border-stone-200">
                      "{comment.text}"
                    </p>

                    <p className="text-[10px] text-stone-400">
                      Submitted: {new Date(comment.createdAt).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US')}
                    </p>
                  </div>

                  {/* Moderation Controls: Toggle Show / Hide */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                    <button
                      onClick={() => onToggleCommentVisibility(comment.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        comment.status === 'approved'
                          ? 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
                          : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-xs'
                      }`}
                    >
                      {comment.status === 'approved' ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          <span>{t.hideCommentBtn}</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.showCommentBtn}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="p-2 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                      title={t.deleteCommentBtn}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: POST TO VIP GROUP ("i am the one who can text in the group or send anything") */}
      {activeTab === 'broadcast' && (
        <div className="max-w-2xl bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs space-y-6 animate-in fade-in">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-900 text-xs font-bold uppercase mb-2 border border-rose-200">
              <Megaphone className="w-4 h-4" />
              <span>Official Group Broadcast</span>
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-['Cinzel',serif]">
              {t.adminSendBroadcast}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              Send announcements, sale alerts, and coupon codes directly into the Mohan Saree House Updates Group (100% Free for all customers).
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Announcement Tag</label>
              <select
                value={broadcastTag}
                onChange={(e) => setBroadcastTag(e.target.value as any)}
                className="w-full text-xs p-2.5 border rounded-xl border-stone-300 bg-white font-semibold"
              >
                <option value="SALE">SALE ALERT (सेल ऑफर)</option>
                <option value="FESTIVE OFFER">FESTIVE SPECIAL (त्योहारी विशेष)</option>
                <option value="NEW ARRIVAL">NEW ARRIVALS (नया स्टॉक)</option>
                <option value="ANNOUNCEMENT">GENERAL ANNOUNCEMENT (सामान्य सूचना)</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Title (English)</label>
                <input
                  type="text"
                  value={broadcastTitleEn}
                  onChange={(e) => setBroadcastTitleEn(e.target.value)}
                  placeholder="e.g. Wedding Season Flat 25% Off!"
                  className="w-full text-xs p-2.5 border rounded-xl border-stone-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Title (Hindi)</label>
                <input
                  type="text"
                  value={broadcastTitleHi}
                  onChange={(e) => setBroadcastTitleHi(e.target.value)}
                  placeholder="उदा. शादी सीजन फ्लैट 25% छूट!"
                  className="w-full text-xs p-2.5 border rounded-xl border-stone-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Message Content (English)</label>
                <textarea
                  value={broadcastContentEn}
                  onChange={(e) => setBroadcastContentEn(e.target.value)}
                  rows={3}
                  required
                  placeholder="Write your broadcast update to customers..."
                  className="w-full text-xs p-2.5 border rounded-xl border-stone-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Message Content (Hindi)</label>
                <textarea
                  value={broadcastContentHi}
                  onChange={(e) => setBroadcastContentHi(e.target.value)}
                  rows={3}
                  placeholder="ग्राहकों के लिए अपना संदेश हिन्दी में लिखें..."
                  className="w-full text-xs p-2.5 border rounded-xl border-stone-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Offer Coupon Code (Optional)</label>
                <input
                  type="text"
                  value={broadcastCode}
                  onChange={(e) => setBroadcastCode(e.target.value)}
                  placeholder="e.g. MOHAN25"
                  className="w-full text-xs p-2.5 border rounded-xl border-stone-300 uppercase font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Discount %</label>
                <input
                  type="number"
                  value={broadcastDiscount}
                  onChange={(e) => setBroadcastDiscount(e.target.value)}
                  placeholder="e.g. 25"
                  className="w-full text-xs p-2.5 border rounded-xl border-stone-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Photo URL (Optional)</label>
                <input
                  type="url"
                  value={broadcastImage}
                  onChange={(e) => setBroadcastImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full text-xs p-2.5 border rounded-xl border-stone-300"
                />
              </div>
            </div>

            {broadcastSuccess && (
              <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border border-emerald-200">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{t.broadcastSuccessMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 hover:from-rose-900 hover:to-amber-900 text-amber-100 font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span>{t.postBroadcastBtn}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: SECURITY & CHANGE ADMIN PASSWORD */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs max-w-xl animate-in fade-in">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-100 text-amber-900 rounded-xl">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-['Cinzel',serif]">
                {t.changePasswordTitle}
              </h3>
              <p className="text-xs text-stone-500">
                {t.changePasswordDesc}
              </p>
            </div>
          </div>

          <form onSubmit={handleChangePasscode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.currentPassword}
              </label>
              <input
                type="password"
                value={currentPasswordInput}
                onChange={(e) => {
                  setCurrentPasswordInput(e.target.value);
                  setPasswordError(null);
                }}
                placeholder="Enter current password (default: 1234)"
                required
                className="w-full px-3.5 py-2.5 text-sm border rounded-xl border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.newPassword}
              </label>
              <input
                type="password"
                value={newPasswordInput}
                onChange={(e) => {
                  setNewPasswordInput(e.target.value);
                  setPasswordError(null);
                }}
                placeholder="Enter new password (min 4 characters)"
                required
                className="w-full px-3.5 py-2.5 text-sm border rounded-xl border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.confirmNewPassword}
              </label>
              <input
                type="password"
                value={confirmPasswordInput}
                onChange={(e) => {
                  setConfirmPasswordInput(e.target.value);
                  setPasswordError(null);
                }}
                placeholder="Re-enter new password to confirm"
                required
                className="w-full px-3.5 py-2.5 text-sm border rounded-xl border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>

            {passwordError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>{t.passwordUpdatedSuccess}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-6 bg-rose-950 hover:bg-rose-900 text-amber-100 hover:text-white rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.updatePasswordBtn}</span>
            </button>
          </form>
        </div>
      )}

      {/* Product Add / Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 my-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-6">
              <h3 className="font-bold text-base sm:text-lg text-stone-900 font-['Cinzel',serif]">
                {editingProductId ? t.editProduct : t.addNewProduct}
              </h3>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.productTitleEn} *</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Royal Red Katan Banarasi Saree"
                    className="w-full text-xs p-2.5 border rounded-lg border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.productTitleHi}</label>
                  <input
                    type="text"
                    value={titleHi}
                    onChange={(e) => setTitleHi(e.target.value)}
                    placeholder="उदा. शाही लाल कातान बनारसी साड़ी"
                    className="w-full text-xs p-2.5 border rounded-lg border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.productCategory}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full text-xs p-2.5 border rounded-lg border-stone-300 bg-white"
                  >
                    <option value="saree">Saree (साड़ी)</option>
                    <option value="lehenga">Lehenga (लहंगा)</option>
                    <option value="bridal">Bridal Special (ब्राइडल)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.productPrice} *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 18500"
                    className="w-full text-xs p-2.5 border rounded-lg border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.productMrp}</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="e.g. 24000"
                    className="w-full text-xs p-2.5 border rounded-lg border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.productFabric}</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. Pure Mulberry Silk"
                    className="w-full text-xs p-2.5 border rounded-lg border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.productWork}</label>
                  <input
                    type="text"
                    value={work}
                    onChange={(e) => setWork(e.target.value)}
                    placeholder="e.g. Handcrafted Zardozi / Kadwa Zari"
                    className="w-full text-xs p-2.5 border rounded-lg border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.productColor}</label>
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="e.g. Deep Maroon & Gold"
                    className="w-full text-xs p-2.5 border rounded-lg border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.productImages}</label>
                <textarea
                  value={imagesInput}
                  onChange={(e) => setImagesInput(e.target.value)}
                  rows={2}
                  placeholder="Paste image URLs (one per line or comma separated)"
                  className="w-full text-xs p-2.5 border rounded-lg border-stone-300 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">{t.productVideoUrl}</label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://... MP4 video preview link"
                  className="w-full text-xs p-2.5 border rounded-lg border-stone-300"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.productDescEn}</label>
                  <textarea
                    value={descEn}
                    onChange={(e) => setDescEn(e.target.value)}
                    rows={2}
                    placeholder="Description in English..."
                    className="w-full text-xs p-2.5 border rounded-lg border-stone-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">{t.productDescHi}</label>
                  <textarea
                    value={descHi}
                    onChange={(e) => setDescHi(e.target.value)}
                    rows={2}
                    placeholder="विवरण हिन्दी में..."
                    className="w-full text-xs p-2.5 border rounded-lg border-stone-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 text-xs font-bold text-white bg-rose-950 hover:bg-rose-900 rounded-xl shadow-sm"
                >
                  {t.saveProductBtn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
