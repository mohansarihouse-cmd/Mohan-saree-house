export type Language = 'en' | 'hi';

export type ProductCategory = 'all' | 'saree' | 'lehenga' | 'bridal';

export interface LocalizedText {
  en: string;
  hi: string;
}

export interface RatingRecord {
  id: string;
  userId: string;
  userPhone: string;
  userName: string;
  score: number; // 1 to 5
  createdAt: string;
}

export interface CommentItem {
  id: string;
  itemId: string;
  itemTitle: LocalizedText;
  userId: string;
  userPhone: string;
  userName: string;
  text: string;
  rating?: number; // optional rating attached to review
  status: 'approved' | 'hidden'; // Admin moderates this
  createdAt: string;
}

export interface ProductItem {
  id: string;
  title: LocalizedText;
  category: 'saree' | 'lehenga' | 'bridal';
  subcategory: string; // e.g. "Pure Banarasi Silk", "Velvet Bridal Lehenga", "Kanjivaram Zari"
  price: number;
  originalPrice?: number;
  description: LocalizedText;
  fabric: string;
  work: string;
  color: string;
  images: string[];
  videoUrl?: string; // Preview video URL
  ratings: RatingRecord[];
  averageRating: number;
  totalRatings: number;
  likesCount: number;
  viewsCount: number;
  inStock: boolean;
  featured: boolean;
  trendingScore: number;
  createdAt: string;
}

export interface GroupPost {
  id: string;
  author: string;
  title: LocalizedText;
  content: LocalizedText;
  imageUrl?: string;
  offerCode?: string;
  discountPercent?: number;
  tag: 'SALE' | 'NEW ARRIVAL' | 'FESTIVE OFFER' | 'ANNOUNCEMENT';
  createdAt: string;
  reactions: {
    '❤️': number;
    '🔥': number;
    '✨': number;
    '👏': number;
    '🙏': number;
  };
  userReactions: Record<string, string>; // phone -> emoji
}

export interface CustomerUser {
  phone: string;
  name: string;
  city?: string;
  isGroupMember: boolean;
  joinedGroupAt?: string;
  likedItemIds: string[];
  ratedItems: Record<string, number>; // itemId -> rating score
  createdAt: string;
}

export interface StoreAnalytics {
  totalViews: number;
  totalLikes: number;
  totalRatingsCount: number;
  averageStoreRating: number;
  totalGroupMembers: number;
  trendingItems: ProductItem[];
  mostLikedItems: ProductItem[];
  topRatedItems: ProductItem[];
}
