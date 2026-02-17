import React from 'react';
import { Mail, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const OtpVerifyModal = ({ 
  isOpen, 
  onClose, 
  email, 
  otp, 
  setOtp, 
  onVerify, 
  isLoading, 
  onResend, 
  isResending 
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 transition-all"
        onClick={onClose}
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-none p-8 md:p-10 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] relative overflow-hidden group border border-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Subtle Background Accent */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-70 transition-opacity duration-1000"></div>
          
          {/* Close Button */}
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-none transition-all z-10"
          >
            <X size={20} />
          </button>

          {/* Header Logo */}
          <div className="flex flex-col items-center mb-8 relative z-10">
            <div className="mb-4 animate-in zoom-in duration-500">
              <img 
                src="https://www.pacifichealthsystems.net/wp-content/themes/pacifichealth/images/logo.png" 
                alt="Pacific Health Logo" 
                className="h-10 w-auto object-contain drop-shadow-sm"
              />
            </div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight text-center">Verify Identity</h2>
            <p className="text-slate-500 text-sm font-medium mt-1 text-center">
              We've sent a code to <span className="text-blue-700 font-bold">{email}</span>
            </p>
          </div>
          
          <div className="space-y-6 relative z-10">
            {/* OTP Input */}
            <div>
               <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-3 ml-1 text-left">Security Code</label>
               <div className="flex justify-center gap-2">
                 {[...Array(5)].map((_, index) => (
                   <input
                     key={index}
                     type="text"
                     maxLength={1}
                     value={otp[index] || ''}
                     onChange={(e) => {
                       const value = e.target.value;
                       if (/^[0-9]$/.test(value) || value === '') {
                         const newOtp = otp.split('');
                         newOtp[index] = value;
                         setOtp(newOtp.join(''));
                         
                         // Auto focus next
                         if (value !== '' && index < 4) {
                           const nextInput = e.target.nextElementSibling;
                           if (nextInput) nextInput.focus();
                         }
                       }
                     }}
                     onKeyDown={(e) => {
                       if (e.key === 'Backspace' && !otp[index] && index > 0) {
                         const prevInput = e.currentTarget.previousElementSibling;
                         if (prevInput) prevInput.focus();
                       }
                     }}
                     className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-none outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-bold text-center text-xl uppercase flex-shrink-0"
                   />
                 ))}
               </div>
            </div>
            
            <button
              onClick={onVerify}
              disabled={isLoading || !otp}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 rounded-none text-sm font-bold hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Confirm Verification'}
            </button>
            
            <div className="pt-2 text-center">
              <button 
                onClick={onResend}
                disabled={isResending}
                className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-blue-700 transition-colors disabled:opacity-50"
              >
                {isResending ? (
                  <span className="flex items-center gap-2 justify-center">
                    <div className="h-3 w-3 border-2 border-blue-700/30 border-t-blue-700 rounded-full animate-spin"></div>
                    Sending...
                  </span>
                ) : "Didn't receive code? Resend"}
              </button>
            </div>
          </div>
          
          <button 
            onClick={onClose} 
            className="mt-8 w-full text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] hover:text-slate-600 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
