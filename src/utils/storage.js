import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

// ── Cloudinary config ─────────────────────────────────────
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// ── helpers ───────────────────────────────────────────────
const txCollection = (uid) =>
  collection(db, 'users', uid, 'transactions');

const filtersDoc = (uid) =>
  doc(db, 'users', uid, 'meta', 'filters');

const vaultCollection = (uid) =>
  collection(db, 'users', uid, 'vault');

// ── transactions ──────────────────────────────────────────

// load all transactions for user
export async function loadTransactions(uid) {
  try {
    const q = query(txCollection(uid), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ firestoreId: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

// add single transaction
export async function saveTransaction(uid, transaction) {
  try {
    const docRef = await addDoc(txCollection(uid), transaction);
    return docRef.id;
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
}

// update single transaction
export async function updateTransaction(uid, firestoreId, data) {
  try {
    const ref = doc(db, 'users', uid, 'transactions', firestoreId);
    await updateDoc(ref, data);
  } catch (error) {
    console.error('Error updating transaction:', error);
  }
}

// delete single transaction
export async function deleteTransaction(uid, firestoreId) {
  try {
    const ref = doc(db, 'users', uid, 'transactions', firestoreId);
    await deleteDoc(ref);
  } catch (error) {
    console.error('Error deleting transaction:', error);
  }
}

// ── filters ───────────────────────────────────────────────

// save filters
export async function saveFilters(uid, filters) {
  try {
    await setDoc(filtersDoc(uid), filters);
  } catch (error) {
    console.error('Error saving filters:', error);
  }
}

// load filters
export async function loadFilters(uid) {
  try {
    const snap = await getDoc(filtersDoc(uid));
    if (snap.exists()) {
      const data = snap.data();
      return {
        month: data.month || '',
        type: data.type || '',
        category: data.category || '',
        search: data.search || '',
      };
    }
    return { month: '', type: '', category: '', search: '' };
  } catch {
    return { month: '', type: '', category: '', search: '' };
  }
}

// ── vault (Cloudinary + Firestore) ────────────────────────

// upload file to Cloudinary + save metadata to Firestore
export async function uploadVaultFile(uid, file, type, linkedTxId = null) {
  try {
    // 1. upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);
    formData.append('folder', `financeapp/${uid}/${type}s`);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`,
      { method: 'POST', body: formData }
    );

    if (!res.ok) throw new Error('Cloudinary upload failed');
    const data = await res.json();

    // 2. save metadata to Firestore
    const meta = {
      name: file.name,
      type,                        // receipt | document | image
      url: data.secure_url,        // Cloudinary URL
      storagePath: data.public_id, // Cloudinary public_id for reference
      size: file.size,
      fileType: file.type,         // image/jpeg, application/pdf etc
      uploadedAt: serverTimestamp(),
      linkedTxId,                  // null unless attached to a transaction
    };

    const docRef = await addDoc(vaultCollection(uid), meta);
    return { id: docRef.id, ...meta };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// load all vault files for user
export async function loadVaultFiles(uid) {
  try {
    const q = query(vaultCollection(uid), orderBy('uploadedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch {
    return [];
  }
}

// delete vault file — removes from Firestore only
// Cloudinary delete requires backend — skipped for free tier
export async function deleteVaultFile(uid, fileId) {
  try {
    await deleteDoc(doc(db, 'users', uid, 'vault', fileId));
  } catch (error) {
    console.error('Error deleting vault file:', error);
    throw error;
  }
}

// upload receipt directly from transaction form
export async function uploadReceipt(uid, file, txId) {
  return uploadVaultFile(uid, file, 'receipt', txId);
}