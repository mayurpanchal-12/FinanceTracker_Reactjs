import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [role, setRole] = useState(null);
  const [linkedAdminUid, setLinkedAdminUid] = useState(null);
  const [adminEmail, setAdminEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setRole(null);
        setLinkedAdminUid(null);
        setAdminEmail(null);
        return;
      }

      setRole(null);

   const viewerDoc = await getDoc(doc(db, 'viewerProfiles', firebaseUser.uid));
if (viewerDoc.exists()) {
  // viewer — block if email not verified
  if (!firebaseUser.emailVerified) {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setLinkedAdminUid(null);
    setAdminEmail(null);
    return;
  }
  const data = viewerDoc.data();
  setRole('viewer');
  setLinkedAdminUid(data.linkedAdminUid);
  setAdminEmail(data.adminEmail || null);
} else {
  // admin — block if email not verified
  if (!firebaseUser.emailVerified && firebaseUser.providerData[0]?.providerId === 'password') {
    await signOut(auth);
    setUser(null);
    setRole(null);
    setLinkedAdminUid(null);
    setAdminEmail(null);
    return;
  }
  setRole('admin');
  setLinkedAdminUid(null);
  setAdminEmail(null);
}

setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
  const handleFocus = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const viewerDoc = await getDoc(doc(db, 'viewerProfiles', currentUser.uid));
    if (!viewerDoc.exists() && role === 'viewer') {
      signOut(auth);
    }
  };

  window.addEventListener('focus', handleFocus);
  return () => window.removeEventListener('focus', handleFocus);
}, [role]);

  const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error('Logout failed:', err);
  }
};

  return (
    <AuthContext.Provider value={{ user, role, linkedAdminUid, adminEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}