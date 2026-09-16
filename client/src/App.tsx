import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ArrowRight, Bell, BriefcaseBusiness, ChevronDown, Compass, FileText, Heart, LayoutDashboard, Menu, MessageCircle, Search, ShieldCheck, Sparkles, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

const navItems = [
  { label: "Freelances", href: "/explorer" },
  { label: "Projets", href: "/projets" },
  { label: "Comment ça marche", href: "/#fonctionnement" },
];

function BrandMark({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link href="/" className="group flex items-center gap-2.5" aria-label="DevConnect, accueil">
      <span className={`grid h-9 w-9 place-items-center rounded-xl text-lg font-black shadow-sm transition-transform duration-200 group-hover:-rotate-6 ${inverse ? "bg-white text-[#1557f5]" : "bg-[#1557f5] text-white"}`}>B</span>
      <span className={`font-display text-[1.3rem] font-bold tracking-[-0.04em] ${inverse ? "text-white" : "text-ink"}`}>Bara<span className={inverse ? "text-[#f4a35d]" : "text-[#e4793f]"}>Pro</span></span>
    </Link>
  );
}

function AppHeader() {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();
  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-[#fbfaf7]/90 backdrop-blur-xl">
      <div className="container flex h-[72px] items-center justify-between gap-5">
        <BrandMark />
        <nav className="hidden items-center gap-7 text-sm font-semibold text-ink/60 lg:flex" aria-label="Navigation principale">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={`transition-colors hover:text-ink ${location === item.href ? "text-ink" : ""}`}>{item.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 sm:flex">
          <Link href="/connexion" className="rounded-full px-4 py-2.5 text-sm font-semibold text-ink/70 transition-colors hover:bg-ink/[0.04] hover:text-ink">Se connecter</Link>
          <Link href="/publier" className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(19,28,35,.12)] transition-all hover:-translate-y-0.5 hover:bg-[#26323a]">Publier un projet <ArrowRight size={15} /></Link>
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 text-ink sm:hidden" onClick={() => setOpen(!open)} aria-label="Ouvrir le menu">
          {open ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {open && <div className="border-t border-black/[0.06] bg-[#fbfaf7] px-5 py-4 sm:hidden">
        <nav className="container flex flex-col gap-1 text-sm font-semibold text-ink/70">
          {navItems.map((item) => <Link onClick={() => setOpen(false)} key={item.href} href={item.href} className="rounded-xl px-3 py-3 hover:bg-black/[0.04]">{item.label}</Link>)}
          <div className="mt-2 grid grid-cols-2 gap-2 border-t border-black/[0.06] pt-3">
            <Link onClick={() => setOpen(false)} href="/connexion" className="rounded-xl border border-ink/10 px-3 py-3 text-center">Se connecter</Link>
            <Link onClick={() => setOpen(false)} href="/publier" className="rounded-xl bg-ink px-3 py-3 text-center text-white">Publier un projet</Link>
          </div>
        </nav>
      </div>}
    </header>
  );
}

function MobileBar() {
  const [location] = useLocation();
  const items = [
    { href: "/", icon: Compass, label: "Accueil" },
    { href: "/explorer", icon: Search, label: "Explorer" },
    { href: "/publier", icon: BriefcaseBusiness, label: "Publier" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Espace" },
  ];
  return <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 rounded-2xl border border-black/10 bg-white/95 p-1.5 shadow-[0_12px_40px_rgba(19,28,35,.16)] backdrop-blur-xl sm:hidden" aria-label="Navigation mobile">
    {items.map(({ href, icon: Icon, label }) => <Link key={href} href={href} className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[10px] font-semibold transition ${location === href ? "bg-ink text-white" : "text-ink/45"}`}><Icon size={17} strokeWidth={2.1} /><span>{label}</span></Link>)}
  </nav>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#fbfaf7] text-ink"><AppHeader />{children}<MobileBar /></div>;
}

function ExplorePage() {
  const [active, setActive] = useState("Tous les talents");
  const categories = ["Tous les talents", "Développement web", "Design", "Marketing", "IA & automatisation"];
  const freelancers = [
    { name: "Awa Diop", role: "Product designer", city: "Dakar, Sénégal", rating: "4.9", price: "35 € / h", initials: "AD", accent: "bg-[#eec6a8]" },
    { name: "Koffi Mensah", role: "Full-stack developer", city: "Abidjan, Côte d’Ivoire", rating: "5.0", price: "42 € / h", initials: "KM", accent: "bg-[#a8c6d8]" },
    { name: "Nia Okafor", role: "Brand strategist", city: "Lagos, Nigeria", rating: "4.8", price: "28 € / h", initials: "NO", accent: "bg-[#cfc3e4]" },
    { name: "Yannick Mba", role: "Motion designer", city: "Douala, Cameroun", rating: "4.9", price: "31 € / h", initials: "YM", accent: "bg-[#e6d18d]" },
    { name: "Fatou Sow", role: "Copywriter bilingue", city: "Conakry, Guinée", rating: "4.9", price: "24 € / h", initials: "FS", accent: "bg-[#b9d5bf]" },
    { name: "Samira El Fassi", role: "No-code builder", city: "Casablanca, Maroc", rating: "5.0", price: "38 € / h", initials: "SE", accent: "bg-[#e5b6c3]" },
  ];
  return <AppLayout><main className="container py-10 sm:py-16"><div className="mb-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><p className="eyebrow">Explorer les talents</p><h1 className="mt-3 max-w-2xl font-display text-4xl font-bold tracking-[-0.055em] text-ink sm:text-6xl">Des profils qui font <span className="text-coral">avancer</span> les idées.</h1><p className="mt-4 max-w-xl text-base leading-7 text-ink/55">Découvrez des créatifs et experts du numérique sélectionnés dans toute l'Afrique.</p></div><button className="inline-flex w-fit items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-3 text-sm font-semibold text-ink shadow-sm"><span className="h-2 w-2 rounded-full bg-[#38a169]" /> 1 240 talents disponibles <ChevronDown size={16} /></button></div><div className="mb-8 flex gap-2 overflow-x-auto pb-2">{categories.map((category) => <button onClick={() => setActive(category)} key={category} className={`shrink-0 rounded-full px-4 py-2.5 text-sm font-semibold transition ${active === category ? "bg-ink text-white" : "bg-white text-ink/55 ring-1 ring-ink/10 hover:text-ink"}`}>{category}</button>)}</div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{freelancers.map((person, i) => <div key={person.name} className="group rounded-[24px] border border-ink/[0.08] bg-white p-5 shadow-[0_6px_24px_rgba(19,28,35,.04)] transition-all hover:-translate-y-1 hover:shadow-[0_16px_34px_rgba(19,28,35,.1)]" style={{ animationDelay: `${i * 50}ms` }}><div className="flex items-start justify-between"><div className={`grid h-14 w-14 place-items-center rounded-2xl ${person.accent} font-display text-lg font-bold text-ink`}>{person.initials}</div><button className="rounded-full p-2 text-ink/30 transition hover:bg-[#fff1ed] hover:text-coral" aria-label={`Ajouter ${person.name} aux favoris`}><Heart size={18} /></button></div><div className="mt-5"><div className="flex items-center gap-2"><h2 className="font-display text-lg font-bold">{person.name}</h2><span className="h-1.5 w-1.5 rounded-full bg-[#38a169]" /></div><p className="mt-1 text-sm font-semibold text-ink/55">{person.role}</p><p className="mt-3 text-xs text-ink/40">{person.city}</p></div><div className="mt-5 flex items-center justify-between border-t border-ink/[0.08] pt-4 text-sm"><span className="font-semibold text-ink"><span className="text-[#d58c27]">★</span> {person.rating}</span><span className="font-semibold text-ink/60">{person.price}</span></div></div>)}</div></main></AppLayout>;
}

function ProjectsPage() {
  const projects = [
    { title: "Refonte e-commerce pour une marque de cosmétiques", category: "Développement web", budget: "1 500 – 2 500 €", time: "Il y a 2 h", proposals: 8, tag: "Nouveau" },
    { title: "Identité visuelle pour une startup climate-tech", category: "Design graphique", budget: "800 – 1 200 €", time: "Il y a 5 h", proposals: 14, tag: "Populaire" },
    { title: "Assistant WhatsApp pour service client", category: "IA & automatisation", budget: "2 000 – 4 000 €", time: "Hier", proposals: 6, tag: "Urgent" },
    { title: "Montage de 12 vidéos courtes pour les réseaux", category: "Montage vidéo", budget: "500 – 800 €", time: "Hier", proposals: 21, tag: "" },
  ];
  return <AppLayout><main className="container py-10 sm:py-16"><div className="flex flex-col gap-6 border-b border-ink/10 pb-8 lg:flex-row lg:items-end lg:justify-between"><div><p className="eyebrow">Projets à saisir</p><h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.055em] sm:text-6xl">Les bonnes missions, <span className="text-coral">au bon moment.</span></h1></div><div className="flex gap-2"><button className="rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white">Tous les projets</button><button className="rounded-full bg-white px-4 py-2.5 text-sm font-semibold text-ink/55 ring-1 ring-ink/10">Mes favoris</button></div></div><div className="mt-8 grid gap-4">{projects.map((project) => <article key={project.title} className="group grid gap-5 rounded-[24px] border border-ink/[0.08] bg-white p-5 shadow-[0_6px_24px_rgba(19,28,35,.04)] transition hover:border-[#1557f5]/30 hover:shadow-[0_12px_30px_rgba(19,28,35,.08)] sm:grid-cols-[1fr_auto] sm:items-center sm:p-7"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#f2f0eb] px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-ink/50">{project.category}</span>{project.tag && <span className="rounded-full bg-[#eaf0ff] px-3 py-1 text-xs font-bold text-[#1557f5]">{project.tag}</span>}</div><h2 className="mt-4 max-w-2xl font-display text-xl font-bold tracking-[-0.03em] sm:text-2xl">{project.title}</h2><div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/45"><span>{project.time}</span><span>{project.proposals} propositions</span></div></div><div className="flex items-center justify-between gap-6 sm:block sm:text-right"><div><p className="text-xs font-semibold uppercase tracking-[0.1em] text-ink/35">Budget estimé</p><p className="mt-1 font-display text-lg font-bold">{project.budget}</p></div><button className="mt-0 inline-flex items-center gap-2 text-sm font-bold text-[#1557f5] transition group-hover:gap-3 sm:mt-4">Voir le projet <ArrowRight size={16} /></button></div></article>)}</div></main></AppLayout>;
}

function PublishPage() {
  return <AppLayout><main className="container max-w-5xl py-10 sm:py-16"><div className="grid gap-10 lg:grid-cols-[1fr_320px]"><div><p className="eyebrow">Lancer un projet</p><h1 className="mt-3 font-display text-4xl font-bold tracking-[-0.055em] sm:text-6xl">Décrivez ce que vous voulez <span className="text-coral">construire.</span></h1><p className="mt-4 max-w-xl text-base leading-7 text-ink/55">Les meilleurs talents d'Afrique vous répondent avec une proposition claire, un délai et un budget.</p><div className="mt-10 space-y-5 rounded-[28px] border border-ink/10 bg-white p-5 shadow-[0_12px_40px_rgba(19,28,35,.06)] sm:p-8"><label className="block"><span className="label">Titre du projet</span><input className="field" placeholder="Ex. Créer le site vitrine de ma marque" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="block"><span className="label">Catégorie</span><select className="field"><option>Choisir une catégorie</option><option>Développement web</option><option>Design graphique</option><option>Marketing digital</option><option>IA & automatisation</option></select></label><label className="block"><span className="label">Budget estimé</span><select className="field"><option>Choisir une fourchette</option><option>Moins de 500 €</option><option>500 – 1 500 €</option><option>1 500 – 4 000 €</option><option>Plus de 4 000 €</option></select></label></div><label className="block"><span className="label">Décrivez votre besoin</span><textarea className="field min-h-[140px] resize-y" placeholder="Objectifs, livrables attendus, contexte..."></textarea></label><div className="flex flex-col justify-between gap-4 border-t border-ink/10 pt-5 sm:flex-row sm:items-center"><p className="flex items-center gap-2 text-xs leading-5 text-ink/45"><ShieldCheck size={16} className="shrink-0 text-[#38a169]" /> Aucune carte bancaire demandée pour publier.</p><button className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#26323a]">Publier le projet <ArrowRight size={16} /></button></div></div></div><aside className="hidden lg:block"><div className="sticky top-28 rounded-[28px] bg-[#eef2ff] p-6"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#1557f5] text-white"><Sparkles size={20} /></span><h2 className="mt-5 font-display text-xl font-bold">Un brief clair attire les bons profils.</h2><ul className="mt-5 space-y-4 text-sm leading-6 text-ink/60"><li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1557f5]" />Décrivez le résultat que vous souhaitez obtenir.</li><li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1557f5]" />Ajoutez des références ou des fichiers si besoin.</li><li className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1557f5]" />Indiquez un budget et un délai réalistes.</li></ul></div></aside></div></main></AppLayout>;
}

function DashboardPage() {
  const stats = [{ label: "Projets actifs", value: "04", icon: BriefcaseBusiness, color: "bg-[#eaf0ff] text-[#1557f5]" }, { label: "Propositions reçues", value: "28", icon: FileText, color: "bg-[#fff1ed] text-[#e4793f]" }, { label: "Messages non lus", value: "07", icon: MessageCircle, color: "bg-[#edf8f0] text-[#318653]" }];
  return <AppLayout><main className="container py-10 sm:py-14"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><p className="eyebrow">Espace client · Démo</p><h1 className="mt-2 font-display text-4xl font-bold tracking-[-0.055em]">Bonjour, <span className="text-coral">Moussa.</span></h1><p className="mt-2 text-ink/50">Voici ce qui se passe sur vos projets cette semaine.</p></div><button className="inline-flex w-fit items-center gap-2 rounded-full bg-ink px-4 py-3 text-sm font-bold text-white">Nouveau projet <ArrowRight size={15} /></button></div><div className="mt-8 grid gap-4 md:grid-cols-3">{stats.map(({ label, value, icon: Icon, color }) => <div key={label} className="rounded-[22px] border border-ink/[0.08] bg-white p-5 shadow-[0_6px_24px_rgba(19,28,35,.04)]"><div className={`grid h-10 w-10 place-items-center rounded-xl ${color}`}><Icon size={18} /></div><p className="mt-5 text-sm font-semibold text-ink/45">{label}</p><p className="mt-1 font-display text-4xl font-bold">{value}</p></div>)}</div><div className="mt-8 grid gap-5 lg:grid-cols-[1fr_340px]"><section className="rounded-[26px] border border-ink/[0.08] bg-white p-5 shadow-[0_6px_24px_rgba(19,28,35,.04)] sm:p-7"><div className="flex items-center justify-between"><div><h2 className="font-display text-xl font-bold">Projets en cours</h2><p className="mt-1 text-sm text-ink/45">Suivez l'avancement de vos missions.</p></div><button className="text-sm font-bold text-[#1557f5]">Tout voir</button></div><div className="mt-6 space-y-3">{["Refonte du site Kora", "Campagne lancement Dakar Eats", "Assistant WhatsApp support"].map((title, i) => <div className="flex items-center gap-4 rounded-2xl bg-[#fbfaf7] p-4" key={title}><div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl font-display font-bold ${["bg-[#eaf0ff] text-[#1557f5]", "bg-[#fff1ed] text-[#e4793f]", "bg-[#edf8f0] text-[#318653]"][i]}`}>{["RK", "DE", "AW"][i]}</div><div className="min-w-0 flex-1"><p className="truncate font-semibold">{title}</p><p className="mt-1 text-xs text-ink/40">{["Design · 65% terminé", "Marketing · 42% terminé", "Développement · En attente"][i]}</p></div><div className="hidden text-right sm:block"><p className="font-semibold">{["1 200 €", "680 €", "2 400 €"][i]}</p><p className="mt-1 text-xs text-ink/40">{["14 juin", "21 juin", "30 juin"][i]}</p></div><ArrowRight size={17} className="text-ink/25" /></div>)}</div></section><aside className="rounded-[26px] bg-ink p-6 text-white sm:p-7"><div className="flex items-center justify-between"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"><Bell size={18} /></span><span className="rounded-full bg-[#f4a35d] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-ink">À découvrir</span></div><h2 className="mt-8 font-display text-2xl font-bold leading-tight">Trouvez votre prochain talent en quelques minutes.</h2><p className="mt-3 text-sm leading-6 text-white/55">Parcourez les profils disponibles et invitez directement les freelances qui vous inspirent.</p><Link href="/explorer" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#f4a35d]">Explorer les talents <ArrowRight size={16} /></Link></aside></div></main></AppLayout>;
}

function SimplePage({ title, description, icon: Icon = UserRound }: { title: string; description: string; icon?: typeof UserRound }) {
  return <AppLayout><main className="container flex min-h-[70vh] items-center justify-center py-16"><div className="max-w-lg text-center"><span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#eaf0ff] text-[#1557f5]"><Icon size={24} /></span><h1 className="mt-6 font-display text-4xl font-bold tracking-[-0.05em]">{title}</h1><p className="mt-4 leading-7 text-ink/55">{description}</p><Link href="/" className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-bold text-white">Retour à l'accueil <ArrowRight size={16} /></Link></div></main></AppLayout>;
}

function Router() {
  return <Switch><Route path="/" component={Home} /><Route path="/explorer" component={ExplorePage} /><Route path="/projets" component={ProjectsPage} /><Route path="/publier" component={PublishPage} /><Route path="/dashboard" component={DashboardPage} /><Route path="/connexion" component={() => <SimplePage title="Votre espace, en toute simplicité." description="La connexion et l'inscription seront activées avec Firebase lorsque vous aurez ajouté vos variables d'environnement. Cette page est une structure de démonstration, aucun compte n'est créé pour le moment." icon={UserRound} />} /><Route path="/admin" component={() => <SimplePage title="Espace administration" description="Cette zone est réservée aux comptes administrateurs vérifiés. L'accès sera contrôlé par des règles Firebase, jamais par l'URL seule." icon={ShieldCheck} />} /><Route path="/messages" component={() => <SimplePage title="Messagerie" description="Retrouvez ici vos échanges avec les clients et freelances une fois Firebase connecté." icon={MessageCircle} />} /><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}

export default App;
