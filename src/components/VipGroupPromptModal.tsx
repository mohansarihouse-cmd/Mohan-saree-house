import React from 'react';
import { Sparkles, Users, Bell, Tag, ArrowRight, X, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { STORE_LOGO } from '../data/initialData';

interface VipGroupPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onJoin: () => void;
  isAlreadyMember: boolean;
}

export const VipGroupPromptModal: React.FC<VipGroupPromptModalProps> = ({
  isOpen,
  onClose,
  language,
  onJoin,
  isAlreadyMember,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-gradient-to-b from-white via-amber-50/40 to-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-amber-900/20 relative animate-in fade-in zoom-in-95">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
          title={t.close}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Icon & Heading */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="relative mb-3">
            <img
              src={STORE_LOGO}
              alt="Mohan Saree House Logo"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-full border-2 border-amber-500 shadow-md object-cover ring-4 ring-amber-100"
            />
            <div className="absolute -bottom-1 -right-1 bg-rose-900 text-amber-300 p-1 rounded-full shadow-xs">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
          </div>

          {/* Customer Group Tag */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-950 text-xs font-bold tracking-wide mb-2 border border-amber-300 shadow-2xs">
            <Bell className="w-3.5 h-3.5 text-amber-800" />
            <span>{t.vipGroup}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-rose-950 font-['Cinzel',serif] tracking-tight">
            {t.vipPromptTitle}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1.5 max-w-md leading-relaxed">
            {t.vipPromptSubtitle}
          </p>
        </div>

        {/* Value Propositions */}
        <div className="space-y-3 mb-5 bg-white p-4 rounded-xl border border-amber-900/10 shadow-2xs">
          <div className="flex items-start gap-3 text-left">
            <div className="p-1.5 bg-rose-100 text-rose-800 rounded-lg shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-stone-700 font-medium">
              {t.vipPerk1}
            </p>
          </div>

          <div className="flex items-start gap-3 text-left">
            <div className="p-1.5 bg-amber-100 text-amber-900 rounded-lg shrink-0 mt-0.5">
              <Tag className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-stone-700 font-medium">
              {t.vipPerk2}
            </p>
          </div>

          <div className="flex items-start gap-3 text-left">
            <div className="p-1.5 bg-rose-100 text-rose-900 rounded-lg shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-stone-700 font-medium">
              {t.vipPerk3}
            </p>
          </div>
        </div>

        {/* Offline Showroom Reminder */}
        <div className="mb-5 bg-amber-50/80 p-2.5 rounded-xl border border-amber-200 text-center text-xs text-amber-950">
          <p className="font-semibold">
            {language === 'hi' 
              ? '🏬 हमारी ऑफ़लाइन दुकान है: शोरूम पर आकर देखें, ट्रायल करें और कूपन छूट पाएं!' 
              : '🏬 Offline Retail Store: Visit our showroom to feel the fabric in person & redeem coupons!'}
          </p>
        </div>

        {/* Member Counter */}
        <div className="text-center text-xs text-stone-500 font-medium mb-5 flex items-center justify-center gap-1.5">
          <HeartHandshake className="w-4 h-4 text-rose-700" />
          <span>{t.groupMemberCount}</span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            id="join-vip-group-btn"
            onClick={onJoin}
            className="w-full sm:flex-1 py-3 px-6 bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 hover:from-rose-900 hover:to-amber-900 text-amber-100 hover:text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>{isAlreadyMember ? t.alreadyJoined : t.joinGroupBtn}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-300" />
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            {t.maybeLater}
          </button>
        </div>
      </div>
    </div>
  );
};
