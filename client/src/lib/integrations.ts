import { auth, db, getContacts, getConversation, getDevelopers, getMyProposals, getProfile, getProjects, saveProfile, sendMessage, signInWithGoogle, signInWithPassword, signUpWithPassword, uploadMediaToCloudinary } from "./firebase";
import { addDoc, collection, doc, getDocs, limit, query, setDoc, where } from "firebase/firestore";

export { auth, db, signInWithGoogle, signInWithPassword, signUpWithPassword, uploadMediaToCloudinary };
export const isFirebaseConfigured = true;
export const integrationStatus = { firebase: "ready", cloudinary: "configured-by-env" } as const;

const currentUser = () => auth.currentUser;
const firebaseAuth = {
  getUser: async () => ({ data: { user: currentUser() } }),
  signUp: async ({ email, password, options }: { email: string; password: string; options?: { data?: Record<string, string> } }) => {
    const credential = await signUpWithPassword(email, password, options?.data?.full_name ?? "");
    return { data: { user: credential.user, session: credential.user ? { user: credential.user } : null }, error: null };
  },
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    const credential = await signInWithPassword(email, password);
    return { data: { user: credential.user }, error: null };
  },
};

class QueryAdapter {
  private filters: Array<[string, "==" | "in", unknown]> = [];
  private max = 100;
  private insertPayload: Record<string, unknown> | null = null;
  private selectedFields = "";
  private sortField = "";
  constructor(private readonly table: string) {}
  select(fields?: string) { this.selectedFields = fields ?? ""; return this; }
  eq(field: string, value: unknown) { this.filters.push([field, "==", value]); return this; }
  in(field: string, value: unknown[]) { this.filters.push([field, "in", value]); return this; }
  limit(value: number) { this.max = value; return this; }
  order(field: string) { this.sortField = field; return this; }
  or() { return this; }
  insert(payload: Record<string, unknown>) { this.insertPayload = payload; return this; }
  async execute() {
    if (this.insertPayload) {
      const reference = await addDoc(collection(db, this.table), { ...this.insertPayload, created_at: new Date().toISOString() });
      return { data: [{ id: reference.id, ...this.insertPayload }], error: null };
    }
    const constraints = this.filters.map(([field, operator, value]) => operator === "in" ? where(field, "in", value) : where(field, "==", value));
    const snapshot = await getDocs(query(collection(db, this.table), ...constraints, limit(this.max)));
    let data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as Record<string, unknown>[];
    if (this.sortField) data = data.sort((a, b) => String(a[this.sortField] ?? "").localeCompare(String(b[this.sortField] ?? "")));
    return { data, error: null };
  }
  then(resolve: (value: { data: Record<string, unknown>[]; error: null }) => unknown) { return this.execute().then(resolve); }
  async single() { const result = await this.execute(); return { data: result.data[0] ?? null, error: result.data[0] ? null : new Error("Document introuvable") }; }
  async maybeSingle() { const result = await this.execute(); return { data: result.data[0] ?? null, error: null }; }
}

export const backend: any = {
  auth: firebaseAuth,
  from: (table: string) => new QueryAdapter(table),
  channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
  removeChannel: () => undefined,
};

export async function createProfile(profile: { id: string; role: "client" | "developer"; full_name: string; username?: string; avatar_url?: string; bio?: string; country?: string; skills?: string[]; availability?: string }) {
  const value = { ...profile, email: auth.currentUser?.email ?? "" };
  await saveProfile(value);
  return value;
}
export async function createProject(project: { client_id: string; title: string; slug: string; description: string; category: string; budget_min: number | null; budget_max: number | null; currency: string; status: string; deadline: string | null }) {
  const reference = await addDoc(collection(db, "projects"), { ...project, created_at: new Date().toISOString() });
  return { id: reference.id, ...project };
}
export async function createProposal(proposal: { project_id: string; developer_id: string; cover_letter: string; amount: number; delivery_days: number }) {
  const reference = await addDoc(collection(db, "proposals"), { ...proposal, status: "pending", created_at: new Date().toISOString() });
  return { id: reference.id, ...proposal, status: "pending" };
}
export async function uploadProfilePhoto(_userId: string, file: File) { return (await uploadMediaToCloudinary(file, "devconnect/profiles")).secure_url; }

export { getProfile, getContacts, getConversation, getDevelopers, getProjects, getMyProposals, sendMessage };
