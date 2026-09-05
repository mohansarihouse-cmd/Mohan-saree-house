import React, { useState } from 'react';
import { X, Phone, User, MapPin, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { CustomerUser, Language } from '../types';
import { translations } from '../translations';
import { STORE_LOGO } from '../data/initialData';

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSaveUser: (user: CustomerUser) => void;
}

export const PhoneAuthModal: React.FC<PhoneAuthModalProps> = ({
  isOpen,
  onClose,
  language,
  onSaveUser,
}) => {
  if (!isOpen) return null;
  const t = translations[language];

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError(t.phoneRequired);
      return;
    }
    if (!name.trim()) {
      setError(t.nameRequired);
      return;
    }

    setError('');
    setStep('otp');
    setOtp('1234'); // Pre-fill sample OTP for instant customer testing
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter a 4-digit code.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const newUser: CustomerUser = {
      phone: cleanPhone,
      name: name.trim(),
      city: city.trim() || undefined,
      isGroupMember: true, // Automatically joins VIP group upon creating customer ID
      joinedGroupAt: new Date().toISOString(),
      likedItemIds: [],
      ratedItems: {},
      createdAt: new Date().toISOString(),
    };

    setIsSuccess(true);
    setTimeout(() => {
      onSaveUser(newUser);
      setIsSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-amber-900/20 relative animate-in fade-in zoom-in-95">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Crest */}
        <div className="flex flex-col items-center text-center mb-6">
          <img
            src={STORE_LOGO}
            alt="Mohan Saree House Logo"
            referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-full border-2 border-amber-500 mb-2 object-cover shadow-xs"
          />
          <h3 className="text-xl font-bold text-rose-950 font-['Cinzel',serif]">
            {t.phoneModalTitle}
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-xs">
            {t.phoneModalSubtitle}
          </p>
        </div>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-stone-900 text-base">
              {t.idCreatedSuccess}
            </h4>
            <p className="text-xs text-stone-500">
              Welcome, {name}! Your mobile ID is registered with VIP benefits.
            </p>
          </div>
        ) : step === 'details' ? (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.enterPhone} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500">
                  +91
                </span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError('');
                  }}
                  placeholder={t.phonePlaceholder}
                  maxLength={10}
                  className="w-full pl-12 pr-4 py-2.5 text-sm border rounded-xl border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800 text-stone-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.enterName} *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setError('');
                  }}
                  placeholder={t.namePlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800 text-stone-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.enterCity}
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder={t.cityPlaceholder}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border rounded-xl border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-800 text-stone-900"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-medium">
                {error}
              </p>
            )}

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Creating your phone ID automatically unlocks access to VIP discounts and verified review ratings.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-rose-950 hover:bg-rose-900 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
            >
              {t.saveIdBtn}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="text-center mb-2">
              <span className="text-xs text-stone-500">
                Enter the 4-digit verification code sent to
              </span>
              <p className="font-mono text-xs font-bold text-stone-900">
                +91 {phone}
              </p>
            </div>

            <div>
              <input
                type="text"
                value={otp}
                onChange={(e) => {
                  setOtp(e.target.value);
                  setError('');
                }}
                maxLength={4}
                className="w-36 mx-auto tracking-widest text-center text-xl font-bold py-2 border-2 rounded-xl border-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
              <p className="text-[11px] text-stone-400 text-center mt-1">
                (Demo auto-fill: 1234)
              </p>
            </div>

            {error && (
              <p className="text-xs text-red-600 font-medium text-center">
                {error}
              </p>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="flex-1 py-2.5 text-xs font-medium text-stone-600 hover:bg-stone-100 rounded-xl"
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 bg-rose-950 hover:bg-rose-900 text-white font-bold text-xs rounded-xl shadow-sm"
              >
                Confirm & Enter
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
