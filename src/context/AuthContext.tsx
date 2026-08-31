import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  updateProfile,
  type User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/firebase/config';
import type { UserProfile } from '@/types';

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  loginAdmin: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string, phone: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export const DEMO_ADMIN_EMAIL = 'demo.admin@tapar.az';
export const DEMO_ADMIN_PASSWORD = 'TaparDemo123!';

async function ensureUserDoc(user: User) {
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      displayName: user.displayName ?? 'İstifadəçi',
      email: user.email ?? '',
      photoURL: user.photoURL ?? '',
      createdAt: serverTimestamp(),
    });
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        await ensureUserDoc(u);
        const snap = await getDoc(doc(db, 'users', u.uid));
        if (snap.exists()) setProfile(snap.data() as UserProfile);
        const emailKey = u.email?.trim().toLowerCase() ?? '';
        const roleDoc = emailKey ? await getDoc(doc(db, 'tapar_admins', emailKey)) : null;
        const uidRoleDoc = await getDoc(doc(db, 'tapar_admins', u.uid));
        setIsAdmin(Boolean(roleDoc?.exists() && roleDoc.data()?.active !== false) || Boolean(uidRoleDoc.exists() && uidRoleDoc.data()?.active !== false));
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, displayName: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    await ensureUserDoc(cred.user);
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginAdmin = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (error) {
      const code = (error as { code?: string }).code;
      if (cleanEmail !== DEMO_ADMIN_EMAIL || !['auth/user-not-found', 'auth/invalid-credential'].includes(code ?? '')) throw error;
      try {
        const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        await updateProfile(cred.user, { displayName: 'TAPAR Demo Admin' });
        await ensureUserDoc(cred.user);
      } catch (createError) {
        if ((createError as { code?: string }).code === 'auth/email-already-in-use') {
          throw new Error('Demo hesabı artıq mövcuddur, lakin parol uyğun deyil. Firebase Authentication bölməsində demo hesabının parolunu TaparDemo123! olaraq yeniləyin.');
        }
        throw createError;
      }
    }
    if (cleanEmail === DEMO_ADMIN_EMAIL) await setDoc(doc(db, 'tapar_admins', DEMO_ADMIN_EMAIL), { email: DEMO_ADMIN_EMAIL, name: 'TAPAR Demo Admin', active: true, demo: true, updatedAt: Date.now() }, { merge: true });
  };

  const logout = async () => {
    await fbSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (displayName: string, phone: string) => {
    if (!auth.currentUser) throw new Error('İstifadəçi daxil olmayıb.');
    const cleanName = displayName.trim();
    if (!cleanName) throw new Error('Ad Soyad boş ola bilməz.');
    await updateProfile(auth.currentUser, { displayName: cleanName });
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      displayName: cleanName,
      phone: phone.trim(),
    });
    setProfile((previous) => previous ? { ...previous, displayName: cleanName, phone: phone.trim() } : previous);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, loginAdmin, login, register, loginWithGoogle, logout, resetPassword, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
