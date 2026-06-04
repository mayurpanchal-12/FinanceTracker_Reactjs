import { useState } from "react";

import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth as getSecondaryAuth,
  signOut as secondarySignOut,
  sendEmailVerification,
} from "firebase/auth";

import { deleteApp, initializeApp } from "firebase/app";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "../../../firebase";

export default function useAddViewer(user, onSuccess) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddViewer = async (e) => {
    e.preventDefault();

    let trimmedEmail = email.trim();
    let trimmedName = name.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedName) {
      toast.error("Please enter a name.");
      return;
    }

    if (!trimmedEmail) {
      toast.error("Please enter an email.");
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Please enter a valid email.");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (trimmedEmail.toLowerCase() === user.email.toLowerCase()) {
      toast.error("You cannot add yourself as a viewer.");
      return;
    }

    const confirmed = window.confirm(
      `Add "${trimmedEmail}" as a viewer?\n\nMake sure this is a real email — they will use it to log in.`,
    );

    if (!confirmed) return;

    setLoading(true);

    // spin up a secondary Firebase app so creating the viewer account
    // does not sign out the current admin
    const secondaryApp = initializeApp(
      auth.app.options,
      "SecondaryApp" + Date.now(),
    );
    const secondaryAuthInstance = getSecondaryAuth(secondaryApp);

    try {
      const adminUser = auth.currentUser;
      const { user: newViewer } = await createUserWithEmailAndPassword(
        secondaryAuthInstance,
        trimmedEmail,
        password,
      );
      const viewerUid = newViewer.uid;

      try {
        await setDoc(doc(db, "viewerProfiles", viewerUid), {
          linkedAdminUid: adminUser.uid,
          adminEmail: adminUser.email,
          role: "viewer",
          name: trimmedName,
          email: trimmedEmail,
          createdAt: new Date().toISOString(),
        });

        await setDoc(doc(db, "users", adminUser.uid, "viewers", viewerUid), {
          name: trimmedName,
          email: trimmedEmail,
          createdAt: new Date().toISOString(),
        });
      } catch (dbErr) {
        // rollback the created auth user if Firestore writes fail
        await deleteUser(newViewer).catch(() => {});
        throw dbErr;
      }

      await sendEmailVerification(newViewer);

      onSuccess({ id: viewerUid, name: trimmedName, email: trimmedEmail });
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      const errMes = {
        "auth/email-already-in-use": "This email is already registered.",
        "auth/invalid-email": "Please enter a valid email.",
        default: "Something went wrong. Try again.",
      };
      toast.error(errMes[err.code] || errMes.default);
    } finally {
      // always clean up the secondary app regardless of success or failure
      await secondarySignOut(secondaryAuthInstance).catch(() => {});
      await deleteApp(secondaryApp).catch(() => {});
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    handleAddViewer,
  };
}
