

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();


  useEffect(() => {
  if (user !== undefined && user !== null) {
    navigate('/', { replace: true });
  }
}, [user, navigate]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 6;

  const getFirebaseError = (code) => {
    switch (code) {
      case 'auth/user-not-found': return 'No account found with this email. Please register first.';
      case 'auth/wrong-password': return 'Incorrect password. Please try again.';
      case 'auth/email-already-in-use': return 'An account with this email already exists. Please login.';
      case 'auth/weak-password': return 'Password must be at least 6 characters.';
      case 'auth/invalid-email': return 'Please enter a valid email address.';
      case 'auth/invalid-credential': return 'Invalid email or password. Please try again.';
      case 'auth/too-many-requests': return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed': return 'Network error. Please check your connection.';
      default: return 'Something went wrong. Please try again.';
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    if (!validatePassword(password)) { setError('Password must be at least 6 characters.'); return; }
    if (isRegister && password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      }
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      setError(getFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setSuccess('');
    if (!email) { setError('Please enter your email address first.'); return; }
    if (!validateEmail(email)) { setError('Please enter a valid email address.'); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess('Password reset email sent! Check your inbox and spam folder.');
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('No account found with this email.');
      else setError('Failed to send reset email. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-white/80 px-8 py-10">

          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl font-bold text-primary opacity-60">₹</span>
              <span className="text-2xl font-extrabold tracking-tight text-text-main">
                Finance <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Tracker</span>
              </span>
            </div>
            <p className="text-text-light text-xs font-medium tracking-wide">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-600 text-xs font-medium rounded-xl px-3 py-2.5 mb-5">
              <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-start gap-2 bg-green-50 border border-green-100 text-green-600 text-xs font-medium rounded-xl px-3 py-2.5 mb-5">
              <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-text-main text-sm font-semibold shadow-sm transition-all duration-200 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed mb-5"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? 'Please wait...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-text-light font-medium">or continue with email</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-3">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/60 text-sm text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 transition-all duration-200 disabled:opacity-60"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/60 text-sm text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 transition-all duration-200 disabled:opacity-60"
            />
            {isRegister && (
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50/60 text-sm text-text-main placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 transition-all duration-200 disabled:opacity-60"
              />
            )}
            {!isRegister && (
              <p
                onClick={handleForgotPassword}
                className="text-xs text-primary font-semibold text-right cursor-pointer hover:opacity-70 transition-opacity duration-150 -mt-1"
              >
                Forgot password?
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-sm font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 mt-1"
            >
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Login'}
            </button>
          </form>

          {/* Toggle */}
          <p
            onClick={() => { setIsRegister(p => !p); setError(''); setSuccess(''); }}
            className="text-center text-xs text-text-light mt-6 cursor-pointer hover:text-primary transition-colors duration-150 font-medium"
          >
            {isRegister
              ? 'Already have an account? '
              : "Don't have an account? "}
            <span className="text-primary font-semibold">
              {isRegister ? 'Sign in' : 'Register'}
            </span>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-text-light/60 mt-5">
          Income · Expenses · Balance — beautifully organised
        </p>
      </div>
    </div>
  );
}