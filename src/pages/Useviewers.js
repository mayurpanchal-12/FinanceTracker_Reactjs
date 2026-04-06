import { useState, useEffect } from 'react';
import { doc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import toast from 'react-hot-toast';

export default function useViewers(user) {
  const [viewers, setViewers] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchViewers = async () => {
      const snap = await getDocs(collection(db, 'users', user.uid, 'viewers'));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setViewers(list);
    };
    fetchViewers();
  }, [user]);

  const handleRemoveViewer = async (viewerId, viewerName) => {
    if (!window.confirm(`Remove ${viewerName} as a viewer?`)) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'viewers', viewerId));
      await deleteDoc(doc(db, 'viewerProfiles', viewerId));
      setViewers((prev) => prev.filter((v) => v.id !== viewerId));
      toast.success(`${viewerName} removed.`);
    } catch {
      toast.error('Failed to remove viewer.');
    }
  };

  return { viewers, setViewers, handleRemoveViewer };
}