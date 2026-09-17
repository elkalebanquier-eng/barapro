import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { createProfile, supabase } from "@/lib/integrations";

type Mode = "login" | "signup";
type Role = "client" | "developer";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const switchMode = (next: Mode) => { setMode(next); setError(""); };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!supabase) { setError("La connexion n'est pas encore activée dans cette version du site."); return; }
    if (mode === "signup" && fullName.trim().length < 2) { setError("Indiquez votre nom complet."); return; }
    if (password.length < 6) { setError("Le mot de passe doit contenir au moins 6 caractères."); return; }
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { full_name: fullName.trim(), role } } });
        if (signUpError) throw signUpError;
        if (data.user && data.session) await createProfile({ id: data.user.id, role, full_name: fullName.trim() });
        toast.success(data.session ? "Votre compte est prêt." : "Vérifiez votre email pour confirmer votre compte.");
        if (data.session) navigate(role === "client" ? "/dashboard-client" : "/dashboard-developpeur");
        else switchMode("login");
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (signInError) throw signInError;
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", data.user.id).limit(1).maybeSingle();
        toast.success("Bienvenue sur DevConnect.");
        navigate(profile?.role === "developer" ? "/dashboard-developpeur" : "/dashboard-client");
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Une erreur est survenue.";
      setError(message.includes("Invalid login credentials") ? "Email ou mot de passe incorrect." : message);
    } finally { setLoading(false); }
  }

  return <main className="min-h-[calc(100vh-72px)] bg-[#f7f4ee] px-4 py-8 sm:py-16"><div className="mx-auto grid max-w-5xl overflow-hidden rounded-[30px] border border-ink/10 bg-white shadow-[0_20px_70px_rgba(19,28,35,.12)] lg:grid-cols-[.82fr_1.18fr]"><section className="hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between"><div><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f4a35d] text-ink">D</span> DevConnect</Link><p className="eyebrow eyebrow-light mt-20">Un espace pour avancer</p><h1 className="mt-4 max-w-sm font-display text-5xl font-bold leading-[.98] tracking-[-.06em]">Votre prochain chapitre commence ici.</h1><p className="mt-6 max-w-sm text-sm leading-6 text-white/55">Trouvez les bons talents, développez votre réputation et gardez vos projets au même endroit.</p></div><div className="space-y-4 text-sm text-white/65"><p className="flex items-center gap-3"><Check size={17} className="text-[#f4a35d]" /> Profils et projets sécurisés</p><p className="flex items-center gap-3"><Check size={17} className="text-[#f4a35d]" /> Une communauté africaine ambitieuse</p><p className="flex items-center gap-3"><Check size={17} className="text-[#f4a35d]" /> Aucun paiement demandé à l'inscription</p></div></section><section className="p-6 sm:p-10"><div className="flex items-center justify-between"><div><p className="eyebrow">{mode === "login" ? "Bon retour" : "Rejoindre DevConnect"}</p><h2 className="mt-2 font-display text-3xl font-bold tracking-[-.05em]">{mode === "login" ? "Connectez-vous." : "Créez votre espace."}</h2></div><span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eaf0ff] text-[#1557f5]"><LockKeyhole size={21} /></span></div><div className="mt-8 grid grid-cols-2 rounded-2xl bg-[#f7f4ee] p-1 text-sm font-bold"><button type="button" onClick={() => switchMode("login")} className={`rounded-xl px-3 py-3 transition ${mode === "login" ? "bg-white text-ink shadow-sm" : "text-ink/45"}`}>Se connecter</button><button type="button" onClick={() => switchMode("signup")} className={`rounded-xl px-3 py-3 transition ${mode === "signup" ? "bg-white text-ink shadow-sm" : "text-ink/45"}`}>S'inscrire</button></div>{mode === "signup" && <div className="mt-6"><p className="label">Je suis...</p><div className="grid grid-cols-2 gap-3"><button type="button" onClick={() => setRole("client")} className={`rounded-2xl border p-4 text-left transition ${role === "client" ? "border-[#1557f5] bg-[#eaf0ff]" : "border-ink/10"}`}><span className="font-bold">Un client</span><span className="mt-1 block text-xs text-ink/50">Je cherche un talent</span></button><button type="button" onClick={() => setRole("developer")} className={`rounded-2xl border p-4 text-left transition ${role === "developer" ? "border-[#1557f5] bg-[#eaf0ff]" : "border-ink/10"}`}><span className="font-bold">Un développeur</span><span className="mt-1 block text-xs text-ink/50">Je propose mes services</span></button></div></div>}<form onSubmit={handleSubmit} className="mt-6 space-y-5">{mode === "signup" && <label className="block"><span className="label">Nom complet</span><div className="relative"><UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={17} /><input required value={fullName} onChange={(event) => setFullName(event.target.value)} className="field pl-11" placeholder="Ex. Awa Diop" autoComplete="name" /></div></label>}<label className="block"><span className="label">Adresse email</span><div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={17} /><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="field pl-11" placeholder="vous@exemple.com" autoComplete="email" /></div></label><label className="block"><span className="label">Mot de passe</span><div className="relative"><LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={17} /><input required type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className="field pl-11 pr-12" placeholder="6 caractères minimum" autoComplete={mode === "login" ? "current-password" : "new-password"} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink/40" aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>{error && <p role="alert" className="rounded-xl bg-[#fff1ed] px-4 py-3 text-sm font-semibold text-[#b64f2e]">{error}</p>}<button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#26323a] disabled:cursor-wait disabled:opacity-60">{loading ? "Patientez..." : mode === "login" ? "Se connecter" : "Créer mon compte"} {!loading && <ArrowRight size={16} />}</button></form><p className="mt-6 flex items-start gap-2 text-xs leading-5 text-ink/45"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#318653]" /> Vos données sont protégées par les règles de sécurité Supabase.</p></section></div></main>;
}
