import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../../firebase";

// ── helpers ───────────────────────────────────────────────
const txCollection = (uid) => collection(db, "users", uid, "transactions");

const filtersDoc = (uid) => doc(db, "users", uid, "meta", "filters");

// ── transactions ──────────────────────────────────────────

// load all transactions for user
export async function loadTransactions(uid) {
  try {
    const q = query(txCollection(uid), orderBy("date", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({id: doc.id, firestoreId: doc.id, ...doc.data() }));
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
    console.error("Error saving transaction:", error);
  }
}

// update single transaction
export async function updateTransaction(uid, firestoreId, data) {
  try {
    const ref = doc(db, "users", uid, "transactions", firestoreId);
    await updateDoc(ref, data);
  } catch (error) {
    console.error("Error updating transaction:", error);
  }
}

// delete single transaction
export async function deleteTransaction(uid, firestoreId) {
  try {
    const ref = doc(db, "users", uid, "transactions", firestoreId);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Error deleting transaction:", error);
  }
}

// ── filters ───────────────────────────────────────────────

// save filters
export async function saveFilters(uid, filters) {
  try {
    await setDoc(filtersDoc(uid), filters);
  } catch (error) {
    console.error("Error saving filters:", error);
  }
}

// load filters
export async function loadFilters(uid) {
  try {
    const snap = await getDoc(filtersDoc(uid));
    if (snap.exists()) {
      const data = snap.data();
      return {
        month: data.month || "",
        type: data.type || "",
        category: data.category || "",
        search: data.search || "",
      };
    }
    return { month: "", type: "", category: "", search: "" };
  } catch {
    return { month: "", type: "", category: "", search: "" };
  }
}
