import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "../../../context/AuthContext";
import { db } from "../../../firebase";

const BudgetContext = createContext(null);

export function BudgetProvider({ children }) {
  const { user, role, linkedAdminUid } = useAuth();
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const targetUid = role === "viewer" ? linkedAdminUid : user?.uid;
  const canEdit = role === "admin";
//set budgets from Firestore on component mount or when targetUid changes
  useEffect(() => {
    if (!targetUid) {
      setBudgets({});
      setLoading(false);
      return;
    }
    setLoading(true);
    const ref = doc(db, "users", targetUid, "meta", "budgets");
    getDoc(ref)
      .then((snap) => {
        if (snap.exists()) setBudgets(snap.data());
        else setBudgets({});
      })
      .catch(() => setBudgets({}))
      .finally(() => setLoading(false));
  }, [targetUid]);

  // save updated budgets to Firestore
  const persist =
    async (next) => {
      if (!canEdit || !user?.uid) return;
      const ref = doc(db, "users", user.uid, "meta", "budgets");
      await setDoc(ref, next);
    }

  // update budget for a specific category and persist the change
  const setBudgetForCategory =  async (cat, amount) => {
      const next = { ...budgets, [cat]: Number(amount) };
      setBudgets(next);
      await persist(next);
    }
  
//remove budget for a specific category and persist the change
  const removeBudgetForCategory =  async (cat) => {
      const next = { ...budgets };
      delete next[cat];
      setBudgets(next);
      await persist(next);
    }

  return (
    <BudgetContext.Provider
      value={{
        budgets,
        loading,
        canEdit,
        setBudgetForCategory,
        removeBudgetForCategory,
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error("useBudget must be used within BudgetProvider");
  return ctx;
}