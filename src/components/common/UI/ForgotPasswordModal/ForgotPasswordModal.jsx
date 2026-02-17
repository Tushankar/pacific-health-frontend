import React from 'react';
import { Mail, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ForgotPasswordModal = ({ 
  isOpen, 
  onClose, 
  email, 
  setEmail, 
  forgotOtp, 
  setForgotOtp, 
  newPassword, 
  setNewPassword, 
  onSendOtp, 
  onVerifyOtp, 
  isSending, 
  isVerifying 
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
            <h2 className="text-2xl font-black text-slate-800 tracking-tight text-center">Access Recovery</h2>
            <p className="text-slate-500 text-sm font-medium mt-1 text-center">Verify your identity to secure your account</p>
          </div>
          
          <div className="space-y-5 relative z-10">
            {/* Email Input */}
            <div>
              <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-1.5 ml-1 text-left">Account Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail && setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-none outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder:text-slate-400"
                />
              </div>
            </div>
            
            <button
              onClick={onSendOtp}
              disabled={isSending || !email}
              className="w-full bg-gradient-to-r from-blue-700 to-blue-900 text-white py-4 rounded-none text-sm font-bold hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95 disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {isSending ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Send Verification OTP'}
            </button>
            
            <div className="h-px bg-slate-100 w-full my-2"></div>

            {/* OTP Input */}
            <div>
               <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-3 ml-1 text-left">Verification Code</label>
               <div className="flex justify-center gap-2">
                 {[...Array(5)].map((_, index) => (
                   <input
                     key={index}
                     type="text"
                     maxLength={1}
                     value={forgotOtp[index] || ''}
                     onChange={(e) => {
                       const value = e.target.value;
                       if (/^[0-9]$/.test(value) || value === '') {
                         const newOtp = forgotOtp.split('');
                         newOtp[index] = value;
                         setForgotOtp && setForgotOtp(newOtp.join(''));
                         
                         // Auto focus next
                         if (value !== '' && index < 4) {
                           const nextInput = e.target.nextElementSibling;
                           if (nextInput) nextInput.focus();
                         }
                       }
                     }}
                     onKeyDown={(e) => {
                       if (e.key === 'Backspace' && !forgotOtp[index] && index > 0) {
                         const prevInput = e.currentTarget.previousElementSibling;
                         if (prevInput) prevInput.focus();
                       }
                     }}
                     className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-none outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-bold text-center text-xl flex-shrink-0"
                   />
                 ))}
               </div>
            </div>
            
            {/* New Password Input */}
            <div>
               <label className="block text-[10px] font-bold text-slate-900 uppercase tracking-widest mb-1.5 ml-1 text-left">New Secure Password</label>
               <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword && setNewPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-none outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-slate-800 font-medium placeholder:text-slate-400"
                />
              </div>
            </div>
            
            <button
              onClick={onVerifyOtp}
              disabled={isVerifying || !forgotOtp || !newPassword}
              className="w-full bg-gradient-to-r from-indigo-800 to-blue-950 text-white py-4 rounded-none text-sm font-bold hover:shadow-lg hover:shadow-blue-900/20 transition-all active:scale-95 disabled:opacity-50 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : 'Complete Recovery'}
            </button>
          </div>

          
          <button 
            onClick={onClose} 
            className="mt-6 w-full text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Go Back
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
