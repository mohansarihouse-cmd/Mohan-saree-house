import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Tag, 
  Copy, 
  Check, 
  Bell, 
  Crown, 
  Users, 
  Sparkles, 
  Image as ImageIcon,
  ShieldCheck,
  Megaphone,
  CheckCircle2,
  MapPin
} from 'lucide-react';
import { GroupPost, Language, CustomerUser } from '../types';
import { translations } from '../translations';
import { STORE_LOGO } from '../data/initialData';

interface VipGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  posts: GroupPost[];
  onAddPost: (post: Omit<GroupPost, 'id' | 'createdAt' | 'reactions' | 'userReactions'>) => void;
  onReact: (postId: string, emoji: '❤️' | '🔥' | '✨' | '👏' | '🙏') => void;
  currentUser: CustomerUser | null;
  isAdmin: boolean;
  isMember: boolean;
  onToggleMembership: () => void;
  onOpenAuth: () => void;
}

export const VipGroupModal: React.FC<VipGroupModalProps> = ({
  isOpen,
  onClose,
  language,
  posts,
  onAddPost,
  onReact,
  currentUser,
  isAdmin,
  isMember,
  onToggleMembership,
  onOpenAuth,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Admin Broadcast Composer State
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newTitleHi, setNewTitleHi] = useState('');
  const [newContentEn, setNewContentEn] = useState('');
  const [newContentHi, setNewContentHi] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newOfferCode, setNewOfferCode] = useState('');
  const [newDiscount, setNewDiscount] = useState<number | undefined>(undefined);
  const [newTag, setNewTag] = useState<'SALE' | 'NEW ARRIVAL' | 'FESTIVE OFFER' | 'ANNOUNCEMENT'>('SALE');
  const [isComposing, setIsComposing] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContentEn.trim()) return;

    onAddPost({
      author: 'Mohan Saree House (Owner)',
      title: {
        en: newTitleEn.trim() || 'Showroom Update from Mohan Saree House',
        hi: newTitleHi.trim() || 'मोहन साड़ी हाउस की ओर से शोरूम अपडेट',
      },
      content: {
        en: newContentEn.trim(),
        hi: newContentHi.trim() || newContentEn.trim(),
      },
      imageUrl: newImageUrl.trim() || undefined,
      offerCode: newOfferCode.trim().toUpperCase() || undefined,
      discountPercent: newDiscount ? Number(newDiscount) : undefined,
      tag: newTag,
    });

    // Reset Form
    setNewTitleEn('');
    setNewTitleHi('');
    setNewContentEn('');
    setNewContentHi('');
    setNewImageUrl('');
    setNewOfferCode('');
    setNewDiscount(undefined);
    setIsComposing(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-stone-50 rounded-2xl max-w-2xl w-full h-[90vh] flex flex-col shadow-2xl border border-amber-900/20 overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-white p-4 sm:p-5 flex items-center justify-between shrink-0 shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={STORE_LOGO}
                alt="Mohan Saree House Logo"
                referrerPolicy="no-referrer"
                className="w-12 h-12 rounded-full border-2 border-amber-400 object-cover shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 border-rose-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold font-['Cinzel',serif] tracking-tight text-amber-100">
                  {t.groupChannelTitle}
                </h3>
              </div>
              <p className="text-xs text-rose-200/80 flex items-center gap-2 mt-0.5">
                <span>{t.groupMemberCount}</span>
                <span>•</span>
                <span className="text-amber-300 font-medium">{t.groupBroadcastOnly}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleMembership}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                isMember
                  ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/40 hover:bg-emerald-600/50'
                  : 'bg-amber-400 text-stone-900 hover:bg-amber-300 shadow-xs'
              }`}
            >
              {isMember ? t.alreadyJoined : t.joinGroupBtn}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Group Description Notice - Explicitly Offline & Free */}
        <div className="bg-amber-100/90 border-b border-amber-200 px-4 py-2.5 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center gap-2">
            <Megaphone className="w-4 h-4 text-rose-900 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-[11px] sm:text-xs leading-relaxed font-medium">
              {t.groupIntroText}
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsComposing(!isComposing)}
              className="shrink-0 inline-flex items-center gap-1 px-3 py-1 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer self-end sm:self-auto"
            >
              <Send className="w-3 h-3" />
              <span>{isComposing ? t.cancel : t.adminSendBroadcast}</span>
            </button>
          )}
        </div>

        {/* Admin Broadcast Compose Box */}
        {isAdmin && isComposing && (
          <div className="bg-white border-b border-amber-200 p-4 shrink-0 shadow-inner">
            <form onSubmit={handleCreatePost} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  Showroom Broadcast Announcement (Mohan Saree House)
                </span>
                <select
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value as any)}
                  className="text-xs border rounded-md px-2 py-1 bg-stone-50 border-stone-300 font-semibold"
                >
                  <option value="SALE">SALE ALERT</option>
                  <option value="FESTIVE OFFER">FESTIVE OFFER</option>
                  <option value="NEW ARRIVAL">NEW ARRIVAL</option>
                  <option value="ANNOUNCEMENT">ANNOUNCEMENT</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newTitleEn}
                  onChange={(e) => setNewTitleEn(e.target.value)}
                  placeholder="Title in English (e.g. In-Store Festive Sale 25% Off)"
                  className="w-full text-xs px-3 py-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
                <input
                  type="text"
                  value={newTitleHi}
                  onChange={(e) => setNewTitleHi(e.target.value)}
                  placeholder="शीर्षक हिन्दी में (जैसे: दुकान पर त्योहारी 25% छूट)"
                  className="w-full text-xs px-3 py-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <textarea
                  value={newContentEn}
                  onChange={(e) => setNewContentEn(e.target.value)}
                  placeholder="Showroom announcement message in English..."
                  rows={2}
                  required
                  className="w-full text-xs px-3 py-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
                <textarea
                  value={newContentHi}
                  onChange={(e) => setNewContentHi(e.target.value)}
                  placeholder="संदेश हिन्दी में..."
                  rows={2}
                  className="w-full text-xs px-3 py-2 border rounded-lg border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newOfferCode}
                  onChange={(e) => setNewOfferCode(e.target.value)}
                  placeholder="Shop Coupon Code (e.g. MOHAN30)"
                  className="text-xs px-3 py-1.5 border rounded-lg border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-800 font-mono uppercase"
                />
                <input
                  type="number"
                  value={newDiscount || ''}
                  onChange={(e) => setNewDiscount(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Discount % (e.g. 20)"
                  className="text-xs px-3 py-1.5 border rounded-lg border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="Photo link (optional)"
                  className="text-xs px-3 py-1.5 border rounded-lg border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsComposing(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-950 hover:bg-rose-900 rounded-lg shadow-sm flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>{t.postBroadcastBtn}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Posts Scroll Feed */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {posts.map((post) => {
            const currentTitle = language === 'hi' ? post.title.hi : post.title.en;
            const currentContent = language === 'hi' ? post.content.hi : post.content.en;

            return (
              <div 
                key={post.id}
                className="bg-white rounded-xl p-4 sm:p-5 shadow-xs border border-stone-200 hover:border-amber-300 transition-all space-y-3"
              >
                {/* Post Header with Tag & Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-900 border border-rose-200">
                      {post.tag}
                    </span>
                    <span className="text-xs font-bold text-stone-900">
                      {post.author}
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    {new Date(post.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Post Title & Content */}
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-stone-900 mb-1 leading-snug">
                    {currentTitle}
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                    {currentContent}
                  </p>
                </div>

                {/* Attached Image if any */}
                {post.imageUrl && (
                  <div className="rounded-lg overflow-hidden border border-stone-100 max-h-64 bg-stone-100">
                    <img
                      src={post.imageUrl}
                      alt={currentTitle}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover max-h-64"
                    />
                  </div>
                )}

                {/* Offer Coupon Card if any - specifically for offline store checkout */}
                {post.offerCode && (
                  <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-300/80 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-black text-rose-950 tracking-wider flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-600" />
                        {language === 'hi' ? 'दुकान पर छूट कूपन (बिलिंग काउंटर पर दिखाएं)' : 'In-Store Shop Coupon (Show at Billing Counter)'}
                      </span>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-base font-black text-rose-950 tracking-wider">
                          {post.offerCode}
                        </span>
                        {post.discountPercent && (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            {post.discountPercent}% OFF
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleCopyCode(post.offerCode!)}
                      className="px-3 py-1.5 bg-rose-900 hover:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs shrink-0 cursor-pointer"
                    >
                      {copiedCode === post.offerCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-300" />
                          <span>{t.couponCopied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>{t.copyCoupon}</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* Reactions Bar */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400 font-medium">
                    {t.reactToUpdate}:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {(['❤️', '🔥', '✨', '👏', '🙏'] as const).map((emoji) => {
                      const count = post.reactions[emoji] || 0;
                      const hasReacted = currentUser && post.userReactions[currentUser.phone] === emoji;

                      return (
                        <button
                          key={emoji}
                          onClick={() => {
                            if (!currentUser) {
                              onOpenAuth();
                            } else {
                              onReact(post.id, emoji);
                            }
                          }}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                            hasReacted
                              ? 'bg-rose-100 border border-rose-300 text-rose-950 scale-105'
                              : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span className="text-[10px] text-stone-500 font-semibold">{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="bg-white border-t border-stone-200 p-3 px-4 text-center text-xs text-stone-500 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Customer Group Updates • Mohan Saree House Offline Showroom</span>
          </span>
          <span>{posts.length} {language === 'hi' ? 'अपडेट्स' : 'Broadcasts'}</span>
        </div>
      </div>
    </div>
  );
};
