import { useState } from 'react';


import {
  getAuth as getSecondaryAuth,
  signOut as secondarySignOut,
  createUserWithEmailAndPassword,
  deleteUser,
  sendEmailVerification,
} from 'firebase/auth';

import { initializeApp, deleteApp } from 'firebase/app';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import toast from 'react-hot-toast';

export default function useAddViewer(user, onSuccess) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddViewer = async (e) => {
    e.preventDefault();

    if (!name.trim()) { toast.error('Please enter a name.'); return; }
   if (!email.trim()) { toast.error('Please enter an email.'); return; }
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email.trim())) { toast.error('Please enter a valid email.'); return; }
if (password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    if (email.trim().toLowerCase() === user.email.toLowerCase()) {
      toast.error('You cannot add yourself as a viewer.');
      return;
    }

    const confirmed = window.confirm(
  `Add "${email.trim()}" as a viewer?\n\nMake sure this is a real email — they will use it to log in.`
);
if (!confirmed) return;

setLoading(true);

    // spin up a secondary Firebase app so creating the viewer account
    // does not sign out the current admin
    const secondaryApp = initializeApp(auth.app.options, 'SecondaryApp' + Date.now());
    const secondaryAuthInstance = getSecondaryAuth(secondaryApp);

    try {
      const adminUser = auth.currentUser;
      const { user: newViewer } = await createUserWithEmailAndPassword(
        secondaryAuthInstance,
        email,
        password
      );
      const viewerUid = newViewer.uid;

      try {
        await setDoc(doc(db, 'viewerProfiles', viewerUid), {
          linkedAdminUid: adminUser.uid,
          adminEmail: adminUser.email,
          role: 'viewer',
          name: name.trim(),
          email: email.trim(),
          createdAt: new Date().toISOString(),
        });

        await setDoc(doc(db, 'users', adminUser.uid, 'viewers', viewerUid), {
          name: name.trim(),
          email: email.trim(),
          createdAt: new Date().toISOString(),
        });
      } catch (dbErr) {
        // rollback the created auth user if Firestore writes fail
        await deleteUser(newViewer).catch(() => {});
        throw dbErr;
      }

      await sendEmailVerification(newViewer);
toast.success(`Viewer "${name}" added! They must verify their email before logging in.`);
      onSuccess({ id: viewerUid, name: name.trim(), email: email.trim() });
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      switch (err.code) {
        case 'auth/email-already-in-use':
          toast.error('This email is already registered.');
          break;
        case 'auth/invalid-email':
          toast.error('Please enter a valid email.');
          break;
        default:
          toast.error('Something went wrong. Try again.');
      }
    } finally {
      // always clean up the secondary app regardless of success or failure
      await secondarySignOut(secondaryAuthInstance).catch(() => {});
      await deleteApp(secondaryApp).catch(() => {});
      setLoading(false);
    }
  };

  return { name, setName, email, setEmail, password, setPassword, loading, handleAddViewer };
}
