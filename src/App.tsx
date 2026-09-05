/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Flame, 
  Crown, 
  Heart, 
  Star, 
  Bell, 
  MessageSquare, 
  Filter, 
  Phone, 
  ShieldCheck, 
  ChevronRight,
  RefreshCw,
  ShoppingBag,
  Award,
  MapPin,
  Clock,
  Send,
  Store,
  CheckCircle2
} from 'lucide-react';
import { 
  ProductItem, 
  CommentItem, 
  GroupPost, 
  CustomerUser, 
  Language, 
  ProductCategory 
} from './types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_COMMENTS, 
  INITIAL_GROUP_POSTS, 
  HERO_IMAGE, 
  STORE_LOGO 
} from './data/initialData';
import { translations } from './translations';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { VipGroupPromptModal } from './components/VipGroupPromptModal';
import { VipGroupModal } from './components/VipGroupModal';
import { PhoneAuthModal } from './components/PhoneAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SearchFilters, FilterState } from './components/SearchFilters';

export default function App() {
  // Persistent Language: default 'en' or from localStorage
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('mohan_language') as Language) || 'en';
  });

  const t = translations[language];

  // Persistent Products
  const [products, setProducts] = useState<ProductItem[]>(() => {
    try {
      const saved = localStorage.getItem('mohan_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Persistent Comments
  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem('mohan_comments');
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  // Persistent Group Posts
  const [groupPosts, setGroupPosts] = useState<GroupPost[]>(() => {
    try {
      const saved = localStorage.getItem('mohan_group_posts');
      return saved ? JSON.parse(saved) : INITIAL_GROUP_POSTS;
    } catch {
      return INITIAL_GROUP_POSTS;
    }
  });

  // Persistent Customer User (Phone ID)
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('mohan_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Liked Product IDs
  const [likedProductIds, setLikedProductIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mohan_liked_ids');
      return saved ? JSON.parse(saved) : ['saree-1', 'lehenga-1'];
    } catch {
      return ['saree-1', 'lehenga-1'];
    }
  });

  // Admin Mode & Security Passcode state
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPasscode, setAdminPasscode] = useState<string>(() => {
    return localStorage.getItem('mohan_admin_passcode') || '1234';
  });

  const handleUpdateAdminPasscode = (newPass: string) => {
    setAdminPasscode(newPass);
    localStorage.setItem('mohan_admin_passcode', newPass);
  };

  // Free Group Prompt Modal: User specifically asked:
  // "when customers open the app then ask every time to please join our group in this app for getting updated by things like we are having a sale or any offer or anything"
  const [showVipPrompt, setShowVipPrompt] = useState(true);

  // Group Full Channel Modal
  const [showVipGroupModal, setShowVipGroupModal] = useState(false);

  // Phone Auth Modal
  const [showPhoneAuthModal, setShowPhoneAuthModal] = useState(false);

  // Selected Product for Details Modal
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Filter & Search states (Type, Color, Price, Category, Sort)
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    type: 'all',
    color: 'all',
    priceRange: 'all',
    sortBy: 'trending',
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilters({
      category: 'all',
      type: 'all',
      color: 'all',
      priceRange: 'all',
      sortBy: 'trending',
    });
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mohan_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('mohan_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('mohan_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('mohan_group_posts', JSON.stringify(groupPosts));
  }, [groupPosts]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('mohan_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('mohan_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mohan_liked_ids', JSON.stringify(likedProductIds));
  }, [likedProductIds]);

  // Handle Join Free Group
  const handleJoinVipGroup = () => {
    if (currentUser) {
      const updated = {
        ...currentUser,
        isGroupMember: true,
        joinedGroupAt: new Date().toISOString(),
      };
      setCurrentUser(updated);
    } else {
      // If not logged in, prompt phone login or create default shopper profile
      const guestUser: CustomerUser = {
        phone: '9876543210',
        name: 'Valued Customer',
        isGroupMember: true,
        joinedGroupAt: new Date().toISOString(),
        likedItemIds: [],
        ratedItems: {},
        createdAt: new Date().toISOString(),
      };
      setCurrentUser(guestUser);
    }
    setShowVipPrompt(false);
    setShowVipGroupModal(true);
  };

  const handleToggleMembership = () => {
    if (!currentUser) {
      setShowPhoneAuthModal(true);
      return;
    }
    const updated = {
      ...currentUser,
      isGroupMember: !currentUser.isGroupMember,
      joinedGroupAt: !currentUser.isGroupMember ? new Date().toISOString() : undefined,
    };
    setCurrentUser(updated);
  };

  // Toggle Like on Item
  const handleToggleLike = (productId: string) => {
    const isAlreadyLiked = likedProductIds.includes(productId);
    let nextLikes: string[];

    if (isAlreadyLiked) {
      nextLikes = likedProductIds.filter((id) => id !== productId);
    } else {
      nextLikes = [...likedProductIds, productId];
    }

    setLikedProductIds(nextLikes);

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const newLikesCount = isAlreadyLiked ? Math.max(0, p.likesCount - 1) : p.likesCount + 1;
          const newTrendingScore = Math.min(
            100,
            Math.round((p.viewsCount * 0.02) + (newLikesCount * 0.4) + (p.averageRating * 10))
          );
          return {
            ...p,
            likesCount: newLikesCount,
            trendingScore: newTrendingScore,
          };
        }
        return p;
      })
    );
  };

  // Customer Rate Product (1-5 stars)
  const handleRateProduct = (productId: string, score: number) => {
    const targetProduct = products.find((p) => p.id === productId);
    if (!targetProduct) return;

    const userPhone = currentUser?.phone || '9876543210';
    const userName = currentUser?.name || 'Customer';

    const existingRatingIndex = targetProduct.ratings.findIndex((r) => r.userPhone === userPhone);
    let newRatings = [...targetProduct.ratings];

    if (existingRatingIndex >= 0) {
      newRatings[existingRatingIndex] = {
        ...newRatings[existingRatingIndex],
        score,
        createdAt: new Date().toISOString(),
      };
    } else {
      newRatings.push({
        id: `r-${Date.now()}`,
        userId: currentUser?.phone || 'guest',
        userPhone,
        userName,
        score,
        createdAt: new Date().toISOString(),
      });
    }

    const avg = newRatings.reduce((acc, r) => acc + r.score, 0) / newRatings.length;
    const trending = Math.min(
      100,
      Math.round((targetProduct.viewsCount * 0.02) + (targetProduct.likesCount * 0.4) + (avg * 10))
    );

    const updatedProduct: ProductItem = {
      ...targetProduct,
      ratings: newRatings,
      averageRating: parseFloat(avg.toFixed(1)),
      totalRatings: newRatings.length,
      trendingScore: trending,
    };

    setProducts((prev) => prev.map((p) => (p.id === productId ? updatedProduct : p)));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(updatedProduct);
    }

    // Update current user's rating history
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        ratedItems: {
          ...currentUser.ratedItems,
          [productId]: score,
        },
      });
    }
  };

  // Customer Add Comment
  const handleAddComment = (productId: string, text: string, rating: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;

    const newComment: CommentItem = {
      id: `c-${Date.now()}`,
      itemId: productId,
      itemTitle: prod.title,
      userId: currentUser?.phone || 'guest',
      userPhone: currentUser?.phone || '9876543210',
      userName: currentUser?.name || 'Customer',
      text,
      rating,
      status: 'approved', // Auto-approved or visible, but admin can toggle visibility anytime
      createdAt: new Date().toISOString(),
    };

    setComments((prev) => [newComment, ...prev]);

    // Also register rating if provided
    if (rating > 0) {
      handleRateProduct(productId, rating);
    }
  };

  // Admin Toggle Comment Visibility (Approved / Hidden)
  const handleToggleCommentVisibility = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            status: c.status === 'approved' ? 'hidden' : 'approved',
          };
        }
        return c;
      })
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  // Product Add / Edit / Delete
  const handleAddProduct = (
    newProdData: Omit<
      ProductItem,
      'id' | 'ratings' | 'averageRating' | 'totalRatings' | 'likesCount' | 'viewsCount' | 'trendingScore' | 'createdAt'
    >
  ) => {
    const newProduct: ProductItem = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      ratings: [],
      averageRating: 5.0,
      totalRatings: 1,
      likesCount: 12,
      viewsCount: 150,
      trendingScore: 85,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
  };

  const handleEditProduct = (updatedProd: ProductItem) => {
    setProducts((prev) => prev.map((p) => (p.id === updatedProd.id ? updatedProd : p)));
    if (selectedProduct?.id === updatedProd.id) {
      setSelectedProduct(updatedProd);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setComments((prev) => prev.filter((c) => c.itemId !== productId));
    if (selectedProduct?.id === productId) {
      setSelectedProduct(null);
    }
  };

  // Group Broadcast Add
  const handleAddGroupPost = (
    newPostData: Omit<GroupPost, 'id' | 'createdAt' | 'reactions' | 'userReactions'>
  ) => {
    const newPost: GroupPost = {
      ...newPostData,
      id: `gp-${Date.now()}`,
      createdAt: new Date().toISOString(),
      reactions: { '❤️': 1, '🔥': 0, '✨': 0, '👏': 0, '🙏': 0 },
      userReactions: {},
    };
    setGroupPosts((prev) => [newPost, ...prev]);
  };

  // Group Post React
  const handleReactToGroupPost = (
    postId: string,
    emoji: '❤️' | '🔥' | '✨' | '👏' | '🙏'
  ) => {
    if (!currentUser) return;
    const userPhone = currentUser.phone;

    setGroupPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const currentReaction = post.userReactions?.[userPhone];
          const updatedReactions = { ...post.reactions };
          const updatedUserReactions = { ...post.userReactions };

          if (currentReaction === emoji) {
            // Unreact
            updatedReactions[emoji] = Math.max(0, updatedReactions[emoji] - 1);
            delete updatedUserReactions[userPhone];
          } else {
            // If already reacted with another emoji, decrease previous
            if (currentReaction && updatedReactions[currentReaction as keyof typeof post.reactions]) {
              updatedReactions[currentReaction as keyof typeof post.reactions] = Math.max(
                0,
                updatedReactions[currentReaction as keyof typeof post.reactions] - 1
              );
            }
            updatedReactions[emoji] = (updatedReactions[emoji] || 0) + 1;
            updatedUserReactions[userPhone] = emoji;
          }

          return {
            ...post,
            reactions: updatedReactions,
            userReactions: updatedUserReactions,
          };
        }
        return post;
      })
    );
  };

  // Dynamically extract available Saree & Lehenga types
  const availableTypes = useMemo(() => {
    const typesSet = new Set<string>();
    // Pre-populate core traditional saree and lehenga types
    typesSet.add('Banarasi Silk');
    typesSet.add('Kanjivaram Silk');
    typesSet.add('Bridal Velvet');
    typesSet.add('Pure Organza');
    typesSet.add('Georgette Zari');
    typesSet.add('Chanderi Silk');

    products.forEach((p) => {
      if (p.subcategory) typesSet.add(p.subcategory);
    });
    return Array.from(typesSet);
  }, [products]);

  // Type, Color and Price Matching Helpers
  const matchColorFilter = (productColor: string, filterColorId: string) => {
    if (filterColorId === 'all') return true;
    const col = productColor.toLowerCase();
    switch (filterColorId) {
      case 'red':
        return col.includes('red') || col.includes('crimson') || col.includes('scarlet');
      case 'maroon':
        return col.includes('maroon') || col.includes('burgundy') || col.includes('wine');
      case 'pink':
        return col.includes('pink') || col.includes('blush') || col.includes('rose') || col.includes('rani');
      case 'blue':
        return col.includes('blue') || col.includes('peacock') || col.includes('indigo') || col.includes('navy') || col.includes('royal');
      case 'green':
        return col.includes('green') || col.includes('emerald') || col.includes('mint') || col.includes('olive');
      case 'gold':
        return col.includes('gold') || col.includes('yellow') || col.includes('mustard') || col.includes('antique');
      case 'pastel':
        return col.includes('pastel') || col.includes('peach') || col.includes('mint') || col.includes('blush') || col.includes('mauve');
      default:
        return col.includes(filterColorId.toLowerCase());
    }
  };

  const matchPriceFilter = (price: number, priceRangeId: string) => {
    if (priceRangeId === 'all') return true;
    if (priceRangeId === 'under25k') return price < 25000;
    if (priceRangeId === '25k-50k') return price >= 25000 && price <= 50000;
    if (priceRangeId === '50k-80k') return price > 50000 && price <= 80000;
    if (priceRangeId === 'above80k') return price > 80000;
    return true;
  };

  const matchTypeFilter = (prod: ProductItem, typeFilter: string) => {
    if (typeFilter === 'all') return true;
    const tf = typeFilter.toLowerCase();
    return (
      prod.subcategory.toLowerCase().includes(tf) ||
      prod.fabric.toLowerCase().includes(tf) ||
      prod.title.en.toLowerCase().includes(tf) ||
      prod.title.hi.toLowerCase().includes(tf)
    );
  };

  // Filter & Sort Products
  const filteredProducts = products.filter((prod) => {
    // Category check
    if (filters.category === 'saree' && prod.category !== 'saree') return false;
    if (filters.category === 'lehenga' && prod.category !== 'lehenga') return false;
    if (filters.category === 'bridal' && prod.category !== 'bridal') return false;

    // Type filter
    if (!matchTypeFilter(prod, filters.type)) return false;

    // Color filter
    if (!matchColorFilter(prod.color, filters.color)) return false;

    // Price range filter
    if (!matchPriceFilter(prod.price, filters.priceRange)) return false;

    // Search query check (title, subcategory, fabric, work, color, price)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      // Handle numeric price search e.g. "under 35000", "50k", "20000"
      const priceNumbers = q.match(/\d+/g);
      if (priceNumbers && (q.includes('under') || q.includes('below') || q.includes('less') || q.includes('kam') || q.includes('se kam'))) {
        const maxPrice = parseInt(priceNumbers[0], 10) * (priceNumbers[0].length <= 2 ? 1000 : 1);
        if (prod.price > maxPrice) return false;
      }
      const matchTitle =
        prod.title.en.toLowerCase().includes(q) || prod.title.hi.toLowerCase().includes(q);
      const matchSub = prod.subcategory.toLowerCase().includes(q);
      const matchFabric = prod.fabric.toLowerCase().includes(q);
      const matchWork = prod.work.toLowerCase().includes(q);
      const matchColor = prod.color.toLowerCase().includes(q);
      const matchCategory = prod.category.toLowerCase().includes(q);
      if (!matchTitle && !matchSub && !matchFabric && !matchWork && !matchColor && !matchCategory) {
        return false;
      }
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (filters.sortBy === 'trending') return b.trendingScore - a.trendingScore;
    if (filters.sortBy === 'highestRated') return b.averageRating - a.averageRating;
    if (filters.sortBy === 'priceLowHigh') return a.price - b.price;
    if (filters.sortBy === 'priceHighLow') return b.price - a.price;
    return 0;
  });

  // Track product view on click
  const handleSelectProduct = (product: ProductItem) => {
    setSelectedProduct(product);
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              viewsCount: p.viewsCount + 1,
              trendingScore: Math.min(
                100,
                Math.round(((p.viewsCount + 1) * 0.02) + (p.likesCount * 0.4) + (p.averageRating * 10))
              ),
            }
          : p
      )
    );
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        currentUser={currentUser}
        onOpenAuth={() => setShowPhoneAuthModal(true)}
        onLogout={() => setCurrentUser(null)}
        onOpenVipGroup={() => setShowVipGroupModal(true)}
        isAdmin={isAdmin}
        onToggleAdmin={() => setIsAdmin(!isAdmin)}
        vipPostCount={groupPosts.length}
        adminPasscode={adminPasscode}
      />

      {/* Main Content: Admin Dashboard OR Customer Boutique View */}
      {isAdmin ? (
        <main className="flex-1">
          <AdminDashboard
            language={language}
            products={products}
            comments={comments}
            groupPosts={groupPosts}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onToggleCommentVisibility={handleToggleCommentVisibility}
            onDeleteComment={handleDeleteComment}
            onAddGroupPost={handleAddGroupPost}
            vipMembersCount={currentUser?.isGroupMember ? 1 : 0}
            adminPasscode={adminPasscode}
            onUpdateAdminPasscode={handleUpdateAdminPasscode}
          />
        </main>
      ) : (
        <main className="flex-1">
          
          {/* Hero Boutique Banner - Offline Showroom Showcase */}
          <section className="relative overflow-hidden bg-rose-950 text-white">
            <div className="absolute inset-0 z-0">
              <img
                src={HERO_IMAGE}
                alt="Mohan Saree House Showroom"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-35 filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-rose-950 via-rose-950/80 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 flex flex-col justify-center min-h-[360px]">
              <div className="max-w-2xl space-y-4">
                
                <div className="inline-flex items-center gap-2 bg-amber-400/20 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-400/40 text-amber-200 text-xs font-bold tracking-wider uppercase shadow-xs">
                  <Store className="w-3.5 h-3.5 text-amber-300" />
                  <span>{t.storeSubtitle}</span>
                </div>

                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Cinzel',serif] text-amber-50 drop-shadow-md leading-tight">
                  {language === 'hi' ? 'मोहन साड़ी हाउस' : 'Mohan Saree House'}
                </h2>

                <p className="text-sm sm:text-base text-rose-100/90 leading-relaxed font-medium max-w-xl">
                  {language === 'hi'
                    ? 'हमारी दुकान केवल ऑफ़लाइन रिटेल शोरूम है। शुद्ध कातान बनारसी साड़ियाँ, कांचीपुरम सिल्क, और शाही दुल्हन लहंगों की असलियत खुद दुकान पर पधारकर महसूस करें।'
                    : 'We are an exclusive offline showroom. Discover authentic handloom Banarasi silks, heirloom Kanjivarams, and handcrafted bridal lehengas in person at our store.'}
                </p>

                {/* Hero Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setShowVipGroupModal(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-rose-950 px-5 py-3 rounded-full font-bold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer"
                  >
                    <Bell className="w-4 h-4 text-rose-900" />
                    <span>{t.vipGroup}</span>
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById('collections-grid');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-5 py-3 rounded-full font-semibold text-xs sm:text-sm border border-white/20 transition-colors cursor-pointer"
                  >
                    <span>{t.all}</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Sticky Quick Customer Group Prompt Banner */}
          <div className="bg-amber-100/90 border-y border-amber-300/70 py-2.5 px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold text-amber-950">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <Bell className="w-4 h-4 text-rose-900 shrink-0" />
                <span>{t.groupPromptToast}</span>
              </div>
              <button
                onClick={() => setShowVipPrompt(true)}
                className="inline-flex items-center gap-1 text-rose-900 hover:text-rose-950 underline font-bold cursor-pointer shrink-0"
              >
                <span>{currentUser?.isGroupMember ? t.alreadyJoined : t.joinGroupBtn}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Collections Catalog & Filtering Bar */}
          <section id="collections-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            
            {/* Search, Type, Color, Price & Category Filter Component */}
            <SearchFilters
              language={language}
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              availableTypes={availableTypes}
              totalMatches={sortedProducts.length}
            />

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
                <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="font-bold text-stone-900 text-base font-['Cinzel',serif]">
                  {language === 'hi' ? 'कोई साड़ी या लहंगा नहीं मिला' : 'No collections found'}
                </h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  {language === 'hi'
                    ? 'कृपया अन्य कीवर्ड खोजें या फ़िल्टर रीसेट करें।'
                    : 'Try clearing your search query or switching filters to explore our full boutique.'}
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 px-4 py-2 bg-rose-950 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {language === 'hi' ? 'फ़िल्टर रीसेट करें' : 'Reset All Filters'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {sortedProducts.map((product) => {
                  const productCommentsCount = comments.filter(
                    (c) => c.itemId === product.id && c.status === 'approved'
                  ).length;
                  const isLiked = likedProductIds.includes(product.id);

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      language={language}
                      onSelect={handleSelectProduct}
                      onToggleLike={handleToggleLike}
                      isLiked={isLiked}
                      commentCount={productCommentsCount}
                    />
                  );
                })}
              </div>
            )}
          </section>

          {/* Offline Showroom Brand Highlights */}
          <section className="bg-gradient-to-r from-amber-50 via-rose-50 to-amber-50 border-t border-amber-200/60 py-12 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 p-5 rounded-2xl border border-amber-200 shadow-2xs">
                <div className="p-3 bg-rose-100 text-rose-900 rounded-2xl shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm font-['Cinzel',serif]">
                    {language === 'hi' ? '100% शुद्ध सिल्क गारंटी' : '100% Pure Silk Certified'}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'hi' ? 'सीधे बनारस व कांचीपुरम के असली बुनकरों से' : 'Direct handloom weaves from master weavers'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 p-5 rounded-2xl border border-amber-200 shadow-2xs">
                <div className="p-3 bg-amber-100 text-amber-900 rounded-2xl shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm font-['Cinzel',serif]">
                    {language === 'hi' ? 'दुकान पर ब्राइडल ट्रायल व फिटिंग' : 'In-Store Bridal Trial & Fitting'}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'hi' ? 'दुकान पर प्राइवेट लाउंज में लहंगा पहनकर देखें' : 'Private lounge trials with master tailors'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/80 p-5 rounded-2xl border border-amber-200 shadow-2xs">
                <div className="p-3 bg-emerald-100 text-emerald-900 rounded-2xl shrink-0">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm font-['Cinzel',serif]">
                    {language === 'hi' ? 'ऑफ़लाइन बुटीक शोरूम' : 'Offline Retail Showroom'}
                  </h4>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {language === 'hi' ? 'कपड़े को छूकर, देखकर और परखकर खरीदें' : 'Touch & feel fabric quality in person before purchase'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Store Footer */}
      <footer className="bg-stone-950 text-stone-300 pt-12 pb-8 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-stone-800 text-xs">
            
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-3">
                <img
                  src={STORE_LOGO}
                  alt="Mohan Saree House"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full border border-amber-500 object-cover"
                />
                <span className="text-lg font-bold font-['Cinzel',serif] text-amber-200 tracking-wide">
                  {t.brandName}
                </span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed max-w-md">
                {language === 'hi'
                  ? 'मोहन साड़ी हाउस - केवल ऑफ़लाइन रिटेल प्रतिष्ठान। 1994 से आपके हर शुभ अवसर को शाही और यादगार बनाने के लिए समर्पित। हमारी दुकान पर पधारकर कपड़े की असलियत का अनुभव करें।'
                  : 'Mohan Saree House - Physical retail showroom since 1994. Dedicated to authentic handloom silks and bespoke bridal lehengas for your in-store shopping experience.'}
              </p>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-stone-400 pt-1">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  +91 98765 43210
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  10:30 AM - 9:00 PM (Daily)
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  Main Market, Saree Mandi
                </span>
              </div>
            </div>

            <div>
              <h5 className="font-bold text-amber-200 uppercase tracking-wider mb-3 font-['Cinzel',serif]">
                {language === 'hi' ? 'कलेक्शंस' : 'Collections'}
              </h5>
              <ul className="space-y-2 text-stone-400">
                <li>Pure Katan Banarasi Silks</li>
                <li>Temple Border Kanjivaram</li>
                <li>Heritage Velvet Bridal Lehengas</li>
                <li>Sangeet & Cocktail Georgettes</li>
                <li>Pastel Organza Sarees</li>
              </ul>
            </div>

            <div>
              <h5 className="font-bold text-amber-200 uppercase tracking-wider mb-3 font-['Cinzel',serif]">
                {t.vipGroup}
              </h5>
              <p className="text-stone-400 leading-relaxed mb-3">
                {language === 'hi'
                  ? 'दुकान की सेल, नई साड़ियों के आगमन और विशेष ऑफ़र के लिए हमारे ग्राहक ग्रुप से जुड़ें।'
                  : 'Join our customer updates group for showroom sales, bridal previews, and exclusive in-store announcements.'}
              </p>
              <button
                onClick={() => setShowVipGroupModal(true)}
                className="px-4 py-2 bg-rose-900 hover:bg-rose-800 text-amber-100 font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                {t.vipGroup}
              </button>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-2">
            <p>© 2026 Mohan Saree House • Offline Retail Showroom. All Rights Reserved.</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className="text-stone-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                {isAdmin ? t.customerMode : t.adminMode}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Customer Group Button for Quick Access */}
      {!isAdmin && (
        <div className="fixed bottom-5 right-5 z-30">
          <button
            onClick={() => setShowVipGroupModal(true)}
            className="group flex items-center gap-2 bg-gradient-to-r from-rose-950 to-amber-900 hover:from-rose-900 hover:to-amber-800 text-amber-200 hover:text-white px-4 py-3 rounded-full shadow-2xl border border-amber-400/40 transition-all hover:scale-105 cursor-pointer"
          >
            <div className="relative">
              <Bell className="w-5 h-5 text-amber-300 animate-bounce" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-rose-950" />
            </div>
            <span className="text-xs font-extrabold tracking-wide">
              {t.vipGroup}
            </span>
          </button>
        </div>
      )}

      {/* 1. Free Group Prompt Modal (Prompted every time on app open as requested) */}
      <VipGroupPromptModal
        isOpen={showVipPrompt}
        onClose={() => setShowVipPrompt(false)}
        language={language}
        onJoin={handleJoinVipGroup}
        isAlreadyMember={!!currentUser?.isGroupMember}
      />

      {/* 2. Free Group Full Channel Modal */}
      <VipGroupModal
        isOpen={showVipGroupModal}
        onClose={() => setShowVipGroupModal(false)}
        language={language}
        posts={groupPosts}
        onAddPost={handleAddGroupPost}
        onReact={handleReactToGroupPost}
        currentUser={currentUser}
        isAdmin={isAdmin}
        isMember={!!currentUser?.isGroupMember}
        onToggleMembership={handleToggleMembership}
        onOpenAuth={() => setShowPhoneAuthModal(true)}
      />

      {/* 3. Product Detail Modal (Photos, Video, Ratings, Moderated Reviews, In-Store WhatsApp) */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        language={language}
        comments={comments}
        currentUser={currentUser}
        onOpenAuth={() => setShowPhoneAuthModal(true)}
        onRateProduct={handleRateProduct}
        onAddComment={handleAddComment}
        onToggleLike={handleToggleLike}
        isLiked={selectedProduct ? likedProductIds.includes(selectedProduct.id) : false}
        isAdmin={isAdmin}
      />

      {/* 4. Phone Auth Modal (Create customer ID with mobile number) */}
      <PhoneAuthModal
        isOpen={showPhoneAuthModal}
        onClose={() => setShowPhoneAuthModal(false)}
        language={language}
        onSaveUser={(user) => {
          setCurrentUser(user);
        }}
      />
    </div>
  );
}
