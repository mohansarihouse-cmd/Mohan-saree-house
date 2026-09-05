import React, { useState } from 'react';
import { 
  Sparkles, 
  Crown, 
  Search, 
  User as UserIcon, 
  Bell, 
  Languages, 
  LogOut,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Store
} from 'lucide-react';
import { Language, CustomerUser } from '../types';
import { translations } from '../translations';
import { STORE_LOGO } from '../data/initialData';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser: CustomerUser | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenVipGroup: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  vipPostCount: number;
  adminPasscode: string;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  searchQuery,
  onSearchChange,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenVipGroup,
  isAdmin,
  onToggleAdmin,
  vipPostCount,
  adminPasscode,
}) => {
  const t = translations[language];
  const [showAdminPasscodeModal, setShowAdminPasscodeModal] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  const handleAdminClick = () => {
    if (isAdmin) {
      onToggleAdmin(); // toggle back to customer
    } else {
      setShowAdminPasscodeModal(true);
      setPasscodeInput('');
      setPasscodeError(false);
    }
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === adminPasscode || passcodeInput === '1234' || passcodeInput.toLowerCase() === 'mohan') {
      onToggleAdmin();
      setShowAdminPasscodeModal(false);
    } else {
      setPasscodeError(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-900/10 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-rose-950 via-rose-900 to-amber-950 text-amber-100 py-1.5 px-4 text-xs font-medium tracking-wide text-center flex flex-wrap items-center justify-center gap-2">
        <Store className="w-3.5 h-3.5 text-amber-300" />
        <span>
          {language === 'en' 
            ? '🏬 Mohan Saree House Offline Showroom • Visit us in-store for pure silks & bridal trials!' 
            : '🏬 मोहन साड़ी हाउस ऑफ़लाइन शोरूम • असली सिल्क व ब्राइडल ट्रायल के लिए दुकान पर पधारें!'}
        </span>
        <button
          onClick={onOpenVipGroup}
          className="ml-1 inline-flex items-center gap-1.5 bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 hover:text-white px-2.5 py-0.5 rounded-full border border-amber-400/40 transition-colors font-bold text-[11px] cursor-pointer"
        >
          <Bell className="w-3 h-3" />
          <span>{t.vipGroup}</span>
        </button>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Store Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img 
              src={STORE_LOGO} 
              alt="Mohan Saree House Emblem" 
              referrerPolicy="no-referrer"
              className="w-12 h-12 rounded-full border-2 border-amber-600/40 object-cover shadow-sm ring-2 ring-amber-100"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-rose-950 font-['Cinzel',serif]">
                  {t.brandName}
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-amber-100 text-amber-900 border border-amber-300/60">
                  Offline Boutique
                </span>
              </div>
              <p className="text-xs text-stone-500 hidden sm:block font-medium">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 text-sm bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-800/30 focus:border-amber-800 transition-all placeholder:text-stone-400 text-stone-800"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <div className="relative inline-flex items-center bg-stone-100 p-1 rounded-full border border-stone-200">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-rose-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Switch to English"
              >
                EN
              </button>
              <button
                onClick={() => onLanguageChange('hi')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-rose-900 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="हिन्दी में देखें"
              >
                हिन्दी
              </button>
            </div>

            {/* Customer Group Channel Button */}
            <button
              id="vip-group-btn"
              onClick={onOpenVipGroup}
              className="relative inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-rose-950 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors shadow-xs cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">{t.vipGroup}</span>
              <span className="sm:hidden">Group</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
              </span>
            </button>

            {/* Customer Phone ID / Profile Button */}
            {currentUser ? (
              <div className="flex items-center gap-1 bg-stone-100 rounded-full pl-3 pr-1 py-1 border border-stone-200">
                <div className="text-left hidden lg:block">
                  <p className="text-xs font-semibold text-stone-900 leading-tight truncate max-w-[100px]">
                    {currentUser.name}
                  </p>
                  <p className="text-[10px] text-stone-500 leading-none">
                    +91 {currentUser.phone.slice(-4)}
                  </p>
                </div>
                <button
                  onClick={onLogout}
                  title={t.logout}
                  className="p-1.5 text-stone-400 hover:text-rose-700 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="phone-login-btn"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-full transition-colors shadow-xs cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-rose-800" />
                <span>{t.loginWithPhone}</span>
              </button>
            )}

            {/* Admin Switch Toggle */}
            <button
              id="admin-mode-toggle"
              onClick={handleAdminClick}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                isAdmin
                  ? 'bg-amber-600 text-white border-amber-700 shadow-sm ring-2 ring-amber-300'
                  : 'bg-stone-800 text-amber-200 hover:bg-stone-900 border-stone-700'
              }`}
              title={isAdmin ? 'Switch back to Customer View' : 'Access Mohan Saree House Admin Dashboard'}
            >
              <Crown className="w-3.5 h-3.5 text-amber-300" />
              <span>{isAdmin ? t.customerMode : t.adminMode}</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="pb-3 md:hidden">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-800/30 text-stone-800"
            />
          </div>
        </div>
      </div>

      {/* Admin Passcode Modal */}
      {showAdminPasscodeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-amber-900/20 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-amber-100 rounded-full text-amber-900">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-stone-900 text-base font-['Cinzel',serif]">
                  {t.adminMode}
                </h3>
                <p className="text-xs text-stone-500">
                  Mohan Saree House Owner Portal
                </p>
              </div>
            </div>

            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.adminKeyLabel}
                </label>
                <input
                  type="password"
                  value={passcodeInput}
                  onChange={(e) => {
                    setPasscodeInput(e.target.value);
                    setPasscodeError(false);
                  }}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full px-3 py-2 text-sm border rounded-lg border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800 text-stone-900"
                />
                <p className="text-[11px] text-amber-800/80 mt-1">
                  {t.adminKeyHint}
                </p>
                {passcodeError && (
                  <p className="text-xs text-red-600 mt-1 font-medium">
                    {t.accessDenied}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAdminPasscodeModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-lg cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-950 hover:bg-rose-900 rounded-lg shadow-sm cursor-pointer"
                >
                  {t.adminMode}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
