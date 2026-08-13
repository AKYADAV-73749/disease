// src/hooks/useHealthProfile.js
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";
import { useApp } from "../context/AppContext";

const EMPTY_PROFILE = {
  name: "", age: "", gender: "", bloodGroup: "",
  allergies: "", chronicConditions: [], medications: ""
};

export function useHealthProfile() {
  const { user, setHealthProfile } = useApp();
  const [profile,  setProfile]  = useState(EMPTY_PROFILE);
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [dirty,    setDirty]    = useState(false);

  useEffect(() => {
    if (!user) return;
    getDoc(doc(db, "profiles", user.uid)).then(snap => {
      if (snap.exists()) {
        const data = snap.data();
        setProfile(data);
        setHealthProfile(data);
      }
    });
  }, [user]);

  const updateField = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
  };

  const toggleCondition = (key) => {
    setProfile(prev => {
      const existing = prev.chronicConditions || [];
      const updated  = existing.includes(key)
        ? existing.filter(k => k !== key)
        : [...existing, key];
      return { ...prev, chronicConditions: updated };
    });
    setDirty(true);
    setSaved(false);
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "profiles", user.uid), {
        ...profile, updatedAt: serverTimestamp()
      });
      setHealthProfile(profile);
      setSaved(true);
      setDirty(false);
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  return { profile, updateField, toggleCondition, saveProfile, saving, saved, dirty };
}
