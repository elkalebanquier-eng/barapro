import { ArrowRight, Check, Eye, EyeOff, LockKeyhole, ShieldCheck, BriefcaseBusiness, Code2, ImagePlus } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { createProfile, signInWithGoogle, backend, uploadProfilePhoto } from "@/lib/integrations";

type Mode = "login" | "signup";
type Role = "client" | "developer";
const countries = ["Côte d’Ivoire", "Sénégal", "Cameroun", "Bénin", "Togo", "Guinée", "Mali", "Maroc", "Nigeria", "Autre"];

export default function AuthPage() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<Mode>("login");
  const [role, setRole] = useState<Role>("client");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [country, setCountry] = useState("");
  const [company, setCompany] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [availability, setAvailability] = useState("available");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const switchMode = (next: Mode) => { setMode(next); setError(""); };
  const chooseRole = (next: Role) => { setRole(next); setError(""); };
  const handleAvatarChange = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Choisissez une image JPG, PNG ou WEBP.");
    if (file.size > 5 * 1024 * 1024) return setError("La photo doit faire moins de 5 Mo.");
    setAvatarFile(file); setAvatarPreview(URL.createObjectURL(file)); setError("");
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError("");
    if (!backend) return setError("La connexion n'est pas encore activée.");
    if (mode === "signup" && fullName.trim().length < 2) return setError("Indiquez votre nom complet.");
    if (password.length < 6) return setError("Le mot de passe doit contenir au moins 6 caractères.");
    setLoading(true);
    try {
      if (mode === "signup") {
        const metadata = { full_name: fullName.trim(), role, country, company, specialty, skills, experience, portfolio, availability };
        const { data, error: signUpError } = await backend.auth.signUp({ email: email.trim(), password, options: { data: metadata } });
        if (signUpError) throw signUpError;
        if (data.user && data.session) {
          let avatarUrl = "";
          if (avatarFile) avatarUrl = await uploadProfilePhoto(data.user.id, avatarFile);
          await createProfile({
            id: data.user.id,
            role,
            full_name: fullName.trim(),
            country: country || "À compléter",
            bio: role === "developer" ? specialty.trim() || "Développeur sur ONE-X Dev" : company.trim() || "Client sur ONE-X Dev",
            skills: role === "developer" ? skills.split(",").map((item) => item.trim()).filter(Boolean) : [],
            availability,
            avatar_url: avatarUrl || undefined,
          });
          toast.success("Votre compte est créé. Vous pourrez compléter votre profil plus tard.");
          navigate(role === "client" ? "/dashboard-client" : "/dashboard-developpeur");
        } else {
          toast.success("Compte créé. Vérifiez votre email pour continuer.");
          switchMode("login");
        }
      } else {
        const { data, error: signInError } = await backend.auth.signInWithPassword({ email: email.trim(), password });
        if (signInError) throw signInError;
        const { data: profile } = await backend.from("profiles").select("role").eq("id", data.user.id).limit(1).maybeSingle();
        toast.success("Bienvenue sur ONE-X Dev.");
        navigate(profile?.role === "developer" ? "/dashboard-developpeur" : "/dashboard-client");
      }
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Une erreur est survenue.";
      const normalizedMessage = message.toLowerCase();
      setError(normalizedMessage.includes("invalid login credentials") ? "Email ou mot de passe incorrect." : normalizedMessage.includes("already registered") ? "Cet email est déjà utilisé. Connectez-vous plutôt." : normalizedMessage.includes("email rate limit exceeded") || normalizedMessage.includes("rate limit") ? "Le service email a temporairement atteint sa limite. Attendez quelques minutes avant de réessayer, ou contactez l’administrateur du site." : message);
    } finally { setLoading(false); }
  }

  async function handleGoogleSignIn() {
    setError(""); setLoading(true);
    try {
      const { user } = await signInWithGoogle();
      const existing = await backend.from("profiles").select("role").eq("id", user.uid).maybeSingle();
      if (!existing.data) await createProfile({ id: user.uid, role, full_name: user.displayName || "Utilisateur ONE-X Dev", avatar_url: user.photoURL ?? undefined, bio: role === "developer" ? "Développeur sur ONE-X Dev" : "Client sur ONE-X Dev", country: "À compléter", skills: [], availability: "available" });
      toast.success("Connexion Google réussie.");
      navigate(existing.data?.role === "developer" || role === "developer" ? "/dashboard-developpeur" : "/dashboard-client");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "La connexion Google a échoué."); } finally { setLoading(false); }
  }

  const field = (label: string, value: string, setValue: (value: string) => void, placeholder: string, type = "text", required = false) => <label className="block"><span className="label">{label}{required && <span className="text-coral"> *</span>}</span><input required={required} type={type} value={value} onChange={(event) => setValue(event.target.value)} className="field" placeholder={placeholder} /></label>;

  return <main className="min-h-[calc(100vh-72px)] bg-[#f7f4ee] px-4 py-8 sm:py-16"><div className="mx-auto grid max-w-5xl overflow-hidden rounded-[30px] border border-ink/10 bg-white shadow-[0_20px_70px_rgba(19,28,35,.12)] lg:grid-cols-[.82fr_1.18fr]"><section className="hidden bg-ink p-10 text-white lg:flex lg:flex-col lg:justify-between"><div><Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-white/70 hover:text-white"><span className="grid h-9 w-9 place-items-center rounded-xl bg-[#b9f227] text-ink">D</span> ONE-X Dev</Link><p className="eyebrow eyebrow-light mt-20">Un espace professionnel</p><h1 className="mt-4 max-w-sm font-display text-5xl font-bold leading-[.98] tracking-[-.06em]">Des profils clairs. Des missions sérieuses.</h1><p className="mt-6 max-w-sm text-sm leading-6 text-white/55">Créez votre compte en moins d'une minute. Les détails professionnels peuvent être ajoutés ensuite.</p></div><div className="space-y-4 text-sm text-white/65"><p className="flex items-center gap-3"><Check size={17} className="text-[#b9f227]" /> Inscription rapide</p><p className="flex items-center gap-3"><Check size={17} className="text-[#b9f227]" /> Profil complétable plus tard</p><p className="flex items-center gap-3"><Check size={17} className="text-[#b9f227]" /> Données protégées par Firebase</p></div></section><section className="p-6 sm:p-10"><div className="flex items-start justify-between gap-5"><div><p className="eyebrow">{mode === "login" ? "Bon retour" : "Rejoindre ONE-X Dev"}</p><h2 className="mt-2 font-display text-3xl font-bold tracking-[-.05em]">{mode === "login" ? "Connectez-vous." : "Créez votre compte."}</h2><p className="mt-2 text-sm text-ink/50">{mode === "signup" ? "Commencez avec seulement les informations essentielles." : "Accédez à votre espace professionnel."}</p></div><span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#e9f0ff] text-[#1557f5]"><LockKeyhole size={21} /></span></div><div className="mt-8 grid grid-cols-2 rounded-2xl bg-[#f7f4ee] p-1 text-sm font-bold"><button type="button" onClick={() => switchMode("login")} className={`rounded-xl px-3 py-3 transition ${mode === "login" ? "bg-white text-ink shadow-sm" : "text-ink/45"}`}>Se connecter</button><button type="button" onClick={() => switchMode("signup")} className={`rounded-xl px-3 py-3 transition ${mode === "signup" ? "bg-white text-ink shadow-sm" : "text-ink/45"}`}>Créer un compte</button></div>{mode === "signup" && <><div className="mt-6 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => chooseRole("client")} className={`rounded-2xl border p-4 text-left transition ${role === "client" ? "border-[#1557f5] bg-[#e9f0ff]" : "border-ink/10"}`}><BriefcaseBusiness className="text-[#1557f5]" size={20} /><span className="mt-3 block font-bold">Je cherche un développeur</span><span className="mt-1 block text-xs text-ink/50">Pour un projet ou une entreprise</span></button><button type="button" onClick={() => chooseRole("developer")} className={`rounded-2xl border p-4 text-left transition ${role === "developer" ? "border-[#1557f5] bg-[#e9f0ff]" : "border-ink/10"}`}><Code2 className="text-[#1557f5]" size={20} /><span className="mt-3 block font-bold">Je suis développeur</span><span className="mt-1 block text-xs text-ink/50">Pour proposer mes compétences</span></button></div><p className="mt-4 rounded-xl bg-[#eaf7ef] px-4 py-3 text-xs leading-5 text-[#286d45]"><strong>Inscription express :</strong> seuls votre nom, votre email et votre mot de passe sont indispensables. Le reste est facultatif.</p></>}
      <button type="button" onClick={handleGoogleSignIn} disabled={loading} className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-full border border-ink/10 bg-white px-5 py-3.5 text-sm font-bold text-ink shadow-sm transition hover:bg-[#fbfaf7] disabled:opacity-60"><span className="grid h-6 w-6 place-items-center rounded-full text-sm font-bold text-[#4285f4]">G</span> Continuer avec Google</button><div className="my-5 flex items-center gap-3 text-xs text-ink/35"><span className="h-px flex-1 bg-ink/10" /> ou avec votre email <span className="h-px flex-1 bg-ink/10" /></div><form onSubmit={handleSubmit} className="space-y-5">{mode === "signup" && <>{field("Nom complet", fullName, setFullName, "Ex. Aminata Diallo", "text", true)}<details className="rounded-2xl border border-ink/10 bg-[#fbfaf7] p-4"><summary className="cursor-pointer text-sm font-bold">Ajouter les détails professionnels <span className="font-normal text-ink/40">(facultatif)</span></summary><div className="mt-5 space-y-5">{field("Pays", country, setCountry, "Choisir un pays")}<select value={country} onChange={(event) => setCountry(event.target.value)} className="field -mt-3"><option value="">Choisir un pays</option>{countries.map((item) => <option key={item}>{item}</option>)}</select>{role === "client" ? field("Entreprise ou activité", company, setCompany, "Nom de votre entreprise") : <>{field("Spécialité", specialty, setSpecialty, "Ex. Développeur React")}{field("Compétences", skills, setSkills, "React, Node.js, Firebase")}{field("Expérience", experience, setExperience, "Ex. 3 ans")}{field("Portfolio ou LinkedIn", portfolio, setPortfolio, "https://...", "url")}</>}{role === "developer" && <label className="block"><span className="label">Disponibilité</span><select value={availability} onChange={(event) => setAvailability(event.target.value)} className="field"><option value="available">Disponible maintenant</option><option value="soon">Disponible prochainement</option><option value="busy">Déjà engagé sur une mission</option></select></label>}<label className="block"><span className="label">Photo de profil <span className="font-normal text-ink/40">(facultatif)</span></span><div className="flex items-center gap-3"><div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[#e9f0ff]">{avatarPreview ? <img src={avatarPreview} alt="Aperçu" className="h-full w-full object-cover" /> : <span className="grid h-full w-full place-items-center text-[#1557f5]"><ImagePlus size={18} /></span>}</div><label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold shadow-sm ring-1 ring-ink/10"><ImagePlus size={15} /> Ajouter<input type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={(event) => handleAvatarChange(event.target.files?.[0])} /></label></div></label></div></details></>}{field("Adresse email", email, setEmail, "vous@exemple.com", "email", true)}<label className="block"><span className="label">Mot de passe <span className="text-coral">*</span></span><div className="relative"><LockKeyhole className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/35" size={17} /><input required type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} className="field pl-11 pr-12" placeholder="6 caractères minimum" autoComplete={mode === "login" ? "current-password" : "new-password"} /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-ink/40" aria-label="Afficher ou masquer le mot de passe">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>{error && <p role="alert" className="rounded-xl bg-[#fff1ed] px-4 py-3 text-sm font-semibold text-[#b64f2e]">{error}</p>}<button disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#26323a] disabled:cursor-wait disabled:opacity-60">{loading ? "Patientez..." : mode === "login" ? "Se connecter" : "Créer mon compte"} {!loading && <ArrowRight size={16} />}</button></form><p className="mt-6 flex items-start gap-2 text-xs leading-5 text-ink/45"><ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#318653]" /> Vous pourrez compléter votre profil et ajouter vos informations professionnelles après l'inscription.</p></section></div></main>;
}
