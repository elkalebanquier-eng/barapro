import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, type User } from "firebase/auth";
import { addDoc, collection, doc, getDoc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, setDoc, where, type Unsubscribe } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "AIzaSyBtZi5TQ_NXH-v_RcmX0GH881gQyMg_uUI",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "devconect-e6a5d.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "devconect-e6a5d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "devconect-e6a5d.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "236553916467",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "1:236553916467:web:62cb4f34e21af795031346",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export type FirebaseUser = User;

export async function signInWithGoogle() { return signInWithPopup(auth, googleProvider); }
export async function signInWithPassword(email: string, password: string) { return signInWithEmailAndPassword(auth, email, password); }
export async function signUpWithPassword(email: string, password: string, name: string) { const credential = await createUserWithEmailAndPassword(auth, email, password); await updateProfile(credential.user, { displayName: name }); return credential; }
export function observeAuth(callback: (user: FirebaseUser | null) => void) { return onAuthStateChanged(auth, callback); }

export type Profile = { id: string; role: "client" | "developer"; full_name: string; username?: string; avatar_url?: string; bio?: string; country?: string; skills?: string[]; availability?: string; email?: string };
export type Project = { id: string; client_id: string; title: string; slug: string; description: string; category: string; budget_min: number | null; budget_max: number | null; currency: string; status: string; deadline?: string | null; created_at?: string };
export type Proposal = { id: string; project_id: string; developer_id: string; status: string; amount: number; delivery_days: number; cover_letter: string; created_at?: string };
export type Message = { id: string; sender_id: string; recipient_id: string; body: string; created_at?: string; read_at?: string | null };

const toData = <T extends { id: string }>(snapshot: { id: string; data: () => Record<string, unknown> }) => ({ id: snapshot.id, ...snapshot.data() }) as T;
export async function getProfile(id: string) { const snapshot = await getDoc(doc(db, "profiles", id)); return snapshot.exists() ? toData<Profile>(snapshot) : null; }
export async function saveProfile(profile: Profile) { await setDoc(doc(db, "profiles", profile.id), profile, { merge: true }); return profile; }
export async function getDevelopers() { const snapshot = await getDocs(query(collection(db, "profiles"), where("role", "==", "developer"), limit(60))); return snapshot.docs.map((item) => toData<Profile>(item)); }
export async function getProjects() { const snapshot = await getDocs(query(collection(db, "projects"), where("status", "==", "open"), limit(60))); return snapshot.docs.map((item) => toData<Project>(item)); }
export async function createProject(project: Omit<Project, "id" | "created_at">) { const reference = await addDoc(collection(db, "projects"), { ...project, created_at: new Date().toISOString() }); return { id: reference.id, ...project }; }
export async function createProposal(proposal: Omit<Proposal, "id" | "created_at" | "status">) { const reference = await addDoc(collection(db, "proposals"), { ...proposal, status: "pending", created_at: new Date().toISOString() }); return { id: reference.id, ...proposal, status: "pending" }; }
export async function getMyProposals(developerId: string) { const snapshot = await getDocs(query(collection(db, "proposals"), where("developer_id", "==", developerId), limit(100))); return snapshot.docs.map((item) => toData<Proposal>(item)); }
export async function getContacts(userId: string) { const sent = await getDocs(query(collection(db, "messages"), where("sender_id", "==", userId), limit(50))); const received = await getDocs(query(collection(db, "messages"), where("recipient_id", "==", userId), limit(50))); const ids = Array.from(new Set([...sent.docs.map((item) => item.data().recipient_id as string), ...received.docs.map((item) => item.data().sender_id as string)])); if (!ids.length) return []; const profiles = await Promise.all(ids.map((id) => getProfile(id))); return profiles.filter(Boolean) as Profile[]; }
export async function getConversation(userId: string, contactId: string) { const sent = await getDocs(query(collection(db, "messages"), where("sender_id", "==", userId), where("recipient_id", "==", contactId), limit(100))); const received = await getDocs(query(collection(db, "messages"), where("sender_id", "==", contactId), where("recipient_id", "==", userId), limit(100))); return [...sent.docs, ...received.docs].map((item) => toData<Message>(item)).sort((a, b) => (a.created_at ?? "").localeCompare(b.created_at ?? "")); }
export function subscribeConversation(userId: string, contactId: string, callback: (message: Message) => void): Unsubscribe { return onSnapshot(query(collection(db, "messages"), where("sender_id", "==", userId), where("recipient_id", "==", contactId), limit(100)), (snapshot) => snapshot.docChanges().filter((change) => change.type === "added").forEach((change) => callback(toData<Message>(change.doc)))); }
export async function sendMessage(message: Omit<Message, "id" | "created_at">) { const reference = await addDoc(collection(db, "messages"), { ...message, created_at: new Date().toISOString(), read_at: null }); return { id: reference.id, ...message, created_at: new Date().toISOString(), read_at: null }; }

export async function uploadMediaToCloudinary(file: File, folder = "devconnect") { const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME; const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET; if (!cloudName || !uploadPreset) throw new Error("Cloudinary n'est pas encore configuré."); const body = new FormData(); body.append("file", file); body.append("upload_preset", uploadPreset); body.append("folder", folder); const resourceType = file.type.startsWith("video/") ? "video" : "image"; const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`, { method: "POST", body }); if (!response.ok) throw new Error("Le média n'a pas pu être envoyé à Cloudinary."); return response.json() as Promise<{ secure_url: string; public_id: string; resource_type: string }>;
}
