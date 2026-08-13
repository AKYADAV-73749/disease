// src/components/auth/LoginScreen.jsx
import React, { useState, useRef } from "react";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, signInWithPhoneNumber, RecaptchaVerifier,
  sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from "../../config/firebase";
import { Stethoscope, Mail, Lock, ArrowRight, AlertTriangle, Loader2, Phone, KeyRound, RotateCcw } from "lucide-react";
import { Languages, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../../context/AppContext";

export default function LoginScreen() {
  const { lang, setLang, darkMode, setDarkMode, t } = useApp();
  const [isLogin,        setIsLogin]        = useState(true);
  const [email,          setEmail]          = useState("");
  const [password,       setPassword]       = useState("");
  const [isLoading,      setIsLoading]      = useState(false);
  const [error,          setError]          = useState("");
  const [showTerms,      setShowTerms]      = useState(false);

  // Phone OTP state
  const [authMethod,       setAuthMethod]       = useState("email"); // email | phone
  const [phoneNumber,      setPhoneNumber]      = useState("");
  const [otp,              setOtp]              = useState("");
  const [otpSent,          setOtpSent]          = useState(false);
  const [confirmResult,    setConfirmResult]    = useState(null);
  const recaptchaRef = useRef(null);

  // Forgot password
  const [showForgot,   setShowForgot]   = useState(false);
  const [resetEmail,   setResetEmail]   = useState("");
  const [resetSent,    setResetSent]    = useState(false);

  const dm = darkMode;

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError("");
    try {
      if (isLogin) { await signInWithEmailAndPassword(auth, email, password); }
      else         { await createUserWithEmailAndPassword(auth, email, password); }
    } catch (err) {
      let msg = "Authentication failed.";
      if (err.code === "auth/invalid-credential")   msg = "Invalid email or password.";
      if (err.code === "auth/email-already-in-use") msg = "Email already in use.";
      if (err.code === "auth/weak-password")        msg = "Password must be at least 6 characters.";
      if (err.code === "auth/user-not-found")       msg = "No account found. Please sign up.";
      setError(msg);
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true); setError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err.code !== "auth/popup-closed-by-user") setError("Google sign-in failed. Try again.");
    }
    setIsLoading(false);
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {}
      });
    }
  };

  const handleSendOTP = async () => {
    const phone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
    if (phone.length < 10) { setError("Enter a valid phone number."); return; }
    setIsLoading(true); setError("");
    try {
      setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
      setConfirmResult(result);
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      setError("Could not send OTP. Check the phone number and try again.");
      if (window.recaptchaVerifier) { window.recaptchaVerifier.clear(); window.recaptchaVerifier = null; }
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) { setError("Enter the 6-digit OTP."); return; }
    setIsLoading(true); setError("");
    try {
      await confirmResult.confirm(otp);
    } catch (err) {
      setError("Invalid OTP. Please try again.");
    }
    setIsLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true); setError("");
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch (err) {
      setError("Could not send reset email. Check the address.");
    }
    setIsLoading(false);
  };

  const inputClass = `w-full pl-12 pr-4 py-3.5 border rounded-xl focus:ring-4 outline-none transition-all font-medium ${dm ? "bg-slate-800 border-slate-700 text-white focus:ring-teal-500/20 focus:border-teal-500" : "bg-slate-50 border-slate-200 text-slate-700 focus:ring-teal-500/20 focus:border-teal-500"}`;
  const btnPrimary = "w-full py-4 bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/30 transition-all flex items-center justify-center gap-2 mt-2 active:scale-[0.98]";
  const btnSecondary = `w-full py-3.5 border rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-[0.98] ${dm ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`;

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 ${dm ? "bg-slate-950" : "bg-gradient-to-br from-teal-50 via-white to-indigo-50"}`}>
      <div className={`absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full blur-3xl animate-pulse ${dm ? "bg-teal-900/20" : "bg-teal-200/20"}`} />
      <div className={`absolute bottom-[-10%] left-[-5%] w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 ${dm ? "bg-indigo-900/20" : "bg-indigo-200/20"}`} />

      {/* Toggles */}
      <div className="absolute top-6 right-6 z-50 flex gap-2">
        <button onClick={() => setDarkMode(!dm)} className={`flex items-center justify-center p-2.5 rounded-full shadow-lg border transition-all ${dm ? "bg-slate-800 border-slate-700 text-yellow-400" : "bg-white/80 border-white text-slate-700"}`}>
          {dm ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button onClick={() => setLang(l => l === "en" ? "hi" : "en")} className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg border text-sm font-bold transition-all ${dm ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-white/80 border-white text-slate-700"}`}>
          <Languages className="w-4 h-4 text-teal-600" />
          {lang === "en" ? "English" : "हिंदी"}
        </button>
      </div>

      {/* Invisible reCAPTCHA anchor */}
      <div id="recaptcha-container" ref={recaptchaRef} />

      <AnimatePresence>
        {/* Terms Modal */}
        {showTerms && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-3xl p-8 max-w-sm w-full shadow-2xl border ${dm ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100"}`}
            >
              <h3 className={`text-xl font-bold mb-4 ${dm ? "text-white" : "text-slate-800"}`}>Terms of Service</h3>
              <div className={`h-48 overflow-y-auto text-sm space-y-4 mb-6 pr-2 leading-relaxed ${dm ? "text-slate-400" : "text-slate-600"}`}>
                <p>1. <strong>Not a Medical Device:</strong> MediScan AI is a prototype for informational purposes only.</p>
                <p>2. <strong>Data Privacy:</strong> Your data is stored securely in the cloud using Firebase.</p>
                <p>3. <strong>Accuracy:</strong> AI analysis may be incorrect. Always consult a real doctor.</p>
                <p>4. <strong>Emergency:</strong> This app is NOT for emergencies. Call 112 for life-threatening situations.</p>
              </div>
              <button onClick={() => setShowTerms(false)} className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-teal-500 text-white rounded-xl font-bold hover:shadow-lg transition-all active:scale-95">
                I Understand
              </button>
            </motion.div>
          </div>
        )}

        {/* Forgot Password Modal */}
        {showForgot && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`rounded-3xl p-8 max-w-sm w-full shadow-2xl border ${dm ? "bg-slate-900 border-slate-700" : "bg-white border-slate-100"}`}
            >
              <button onClick={() => { setShowForgot(false); setResetSent(false); setResetEmail(""); }} className={`mb-4 text-xs flex items-center gap-1 font-bold ${dm ? "text-slate-400" : "text-slate-500"}`}>
                <RotateCcw className="w-3 h-3" /> Back
              </button>
              <h3 className={`text-xl font-bold mb-2 ${dm ? "text-white" : "text-slate-800"}`}>{t.reset_password}</h3>
              {resetSent ? (
                <p className="text-sm text-emerald-500 font-bold mt-4">{t.reset_sent}</p>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
                  <input type="email" required value={resetEmail} onChange={e => setResetEmail(e.target.value)}
                    placeholder="name@example.com"
                    className={`w-full px-4 py-3.5 border rounded-xl focus:ring-4 outline-none transition-all font-medium ${dm ? "bg-slate-800 border-slate-700 text-white focus:ring-teal-500/20 focus:border-teal-500" : "bg-slate-50 border-slate-200 text-slate-700 focus:border-teal-500"}`} />
                  <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {t.reset_password}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={`backdrop-blur-xl max-w-md w-full rounded-[2rem] shadow-2xl border overflow-hidden z-10 transition-colors duration-500 ${dm ? "bg-slate-900/60 border-slate-800" : "bg-white/80 border-white"}`}>
        {/* Header */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-800 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent)]" />
          <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-xl ring-4 ring-white/10">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 tracking-tight">{t.welcome}</h2>
          <p className="text-teal-100 font-medium">{t.subtitle}</p>
        </div>

        <div className="p-8 space-y-5">
          {/* Sign In / Sign Up toggle */}
          <div className={`flex p-1.5 rounded-xl ${dm ? "bg-slate-800" : "bg-slate-100"}`}>
            {[{ v: true, l: t.sign_in }, { v: false, l: t.sign_up }].map(({ v, l }) => (
              <button key={l} onClick={() => { setIsLogin(v); setError(""); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${isLogin === v ? (dm ? "bg-slate-700 text-white shadow-md" : "bg-white text-teal-700 shadow-md") : (dm ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-700")}`}>
                {l}
              </button>
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="overflow-hidden"
              >
                <div className={`p-4 border rounded-xl flex items-start gap-3 text-sm font-bold ${dm ? "bg-rose-900/30 border-rose-800 text-rose-300" : "bg-rose-50 border-rose-100 text-rose-600"}`}>
                  <AlertTriangle className="w-5 h-5 shrink-0" />{error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Auth Method Tabs */}
          <div className="flex gap-2">
            {[{ id: "email", icon: Mail, label: "Email" }, { id: "phone", icon: Phone, label: "Phone" }].map(({ id, icon: Icon, label }) => (
              <button key={id} onClick={() => { setAuthMethod(id); setError(""); setOtpSent(false); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all border ${authMethod === id ? "bg-teal-600 text-white border-teal-600" : (dm ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-white border-slate-200 text-slate-500")}`}>
                <Icon className="w-3.5 h-3.5" />{label}
              </button>
            ))}
          </div>

          {/* Email Form */}
          {authMethod === "email" && (
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div className="relative group">
                <Mail className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${dm ? "text-slate-500 group-focus-within:text-teal-400" : "text-slate-400 group-focus-within:text-teal-500"}`} />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com" className={inputClass} />
              </div>
              <div className="relative group">
                <Lock className={`absolute left-4 top-3.5 w-5 h-5 transition-colors ${dm ? "text-slate-500 group-focus-within:text-teal-400" : "text-slate-400 group-focus-within:text-teal-500"}`} />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" className={inputClass} />
              </div>
              {isLogin && (
                <div className="text-right">
                  <button type="button" onClick={() => setShowForgot(true)}
                    className="text-xs text-teal-600 font-bold hover:underline">
                    {t.forgot_password}
                  </button>
                </div>
              )}
              <button type="submit" disabled={isLoading} className={btnPrimary}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isLoading ? (isLogin ? t.verifying : t.creating) : (isLogin ? t.sign_in : t.create_account)}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          )}

          {/* Phone OTP Form */}
          {authMethod === "phone" && (
            <div className="space-y-4">
              {!otpSent ? (
                <>
                  <div className="relative">
                    <Phone className={`absolute left-4 top-3.5 w-5 h-5 ${dm ? "text-slate-500" : "text-slate-400"}`} />
                    <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="+91 XXXXX XXXXX" className={inputClass} />
                  </div>
                  <button onClick={handleSendOTP} disabled={isLoading || !phoneNumber} className={btnPrimary}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Phone className="w-5 h-5" />}
                    {isLoading ? t.sending_otp : t.send_otp}
                  </button>
                </>
              ) : (
                <>
                  <p className={`text-sm font-medium text-center ${dm ? "text-slate-400" : "text-slate-500"}`}>
                    OTP sent to {phoneNumber}
                  </p>
                  <div className="relative">
                    <KeyRound className={`absolute left-4 top-3.5 w-5 h-5 ${dm ? "text-slate-500" : "text-slate-400"}`} />
                    <input type="number" value={otp} onChange={e => setOtp(e.target.value)}
                      placeholder="Enter 6-digit OTP" className={inputClass} maxLength={6} />
                  </div>
                  <button onClick={handleVerifyOTP} disabled={isLoading || otp.length < 6} className={btnPrimary}>
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                    {t.verify_otp}
                  </button>
                  <button onClick={() => { setOtpSent(false); setOtp(""); }} className={`text-xs w-full text-center font-bold ${dm ? "text-slate-400" : "text-slate-500"} hover:text-teal-600 transition-colors`}>
                    Resend OTP
                  </button>
                </>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className={`flex-1 h-px ${dm ? "bg-slate-700" : "bg-slate-200"}`} />
            <span className={`text-xs font-bold ${dm ? "text-slate-500" : "text-slate-400"}`}>{t.or_continue}</span>
            <div className={`flex-1 h-px ${dm ? "bg-slate-700" : "bg-slate-200"}`} />
          </div>

          {/* Google Sign-In */}
          <button onClick={handleGoogleSignIn} disabled={isLoading} className={btnSecondary}>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            {t.google_sign_in}
          </button>

          <p className={`text-xs font-medium text-center ${dm ? "text-slate-500" : "text-slate-400"}`}>
            By continuing, you agree to our{" "}
            <button onClick={() => setShowTerms(true)} className="text-teal-600 font-bold hover:underline">
              {t.terms}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
