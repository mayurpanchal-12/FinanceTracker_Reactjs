import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
} from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';

export default function DeleteAccount() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const deleteAllUserData = async (uid) => {
    const txSnap = await getDocs(collection(db, 'users', uid, 'transactions'));
    await Promise.all(txSnap.docs.map((d) => deleteDoc(d.ref)));

    const viewerSnap = await getDocs(collection(db, 'users', uid, 'viewers'));
    await Promise.all(viewerSnap.docs.map(async (d) => {
      await deleteDoc(d.ref);
      await deleteDoc(doc(db, 'viewerProfiles', d.id)).catch(() => {});
    }));

    await deleteDoc(doc(db, 'users', uid, 'meta', 'filters')).catch(() => {});
    await deleteDoc(doc(db, 'users', uid)).catch(() => {});
    await deleteDoc(doc(db, 'viewerProfiles', uid)).catch(() => {});
  };

  const handleDelete = async () => {
    setError('');
    setLoading(true);
    try {
      const user = auth.currentUser;
      const isGoogleUser = user?.providerData?.some(p => p.providerId === 'google.com');

      if (isGoogleUser) {
        await reauthenticateWithPopup(user, googleProvider);
      } else {
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      }

      await deleteAllUserData(user.uid);
      await deleteUser(user);
      navigate('/login');
    } catch (err) {
      switch (err.code) {
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Incorrect password.');
          break;
        case 'auth/too-many-requests':
          setError('Too many attempts. Try again later.');
          break;
        case 'auth/requires-recent-login':
          setError('For security, please log out and log back in to delete your account.');
          break;
        case 'auth/popup-closed-by-user':
          setError('Google sign-in was cancelled. Please try again.');
          break;
        default:
          setError('Failed to delete account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isGoogleUser = auth.currentUser?.providerData?.some(p => p.providerId === 'google.com');

  return (
    <>
      {!showConfirm ? (
        <button
          onClick={(e) => { e.stopPropagation(); setShowConfirm(true); }}
          className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors duration-150 whitespace-nowrap"
        >
          Delete Account
        </button>
      ) : createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => { setShowConfirm(false); setError(''); setPassword(''); }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl px-6 py-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-text-main mb-1">Delete Account</h3>
            <p className="text-sm text-text-light mb-4">
              This will permanently delete your account and all your transactions. This cannot be undone.
            </p>

            {error && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            {!isGoogleUser && (
              <input
                type="password"
                placeholder="Enter your password to confirm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="field mb-4"
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={loading || (!isGoogleUser && !password)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting...' : isGoogleUser ? 'Confirm with Google' : 'Delete my account'}
              </button>
              <button
                onClick={() => { setShowConfirm(false); setError(''); setPassword(''); }}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-text-light text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}