import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Search,
  Menu,
  X,
  ArrowUpRight,
  Mail,
  MapPin,
  ChevronRight,
  Facebook,
  Instagram,
  Music2,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { Button } from "@/components/ui/button";
import { nav, pageInfo, pagePaths } from "@/lib/portal/content";
export function Brand() {
  return (
    <Link to="/" className="brand" aria-label="Accueil — Direction des arts et de la culture">
      <img className="brand-logo" src={logo} alt="" />
      <span>
        <span className="brand-title block">
          Direction régionale des arts
          <br />
          et de la culture
        </span>
        <span className="brand-sub block">Région des Plateaux · Togo</span>
      </span>
    </Link>
  );
}
export function SocialLinks() {
  return (
    <div className="social-links flex gap-3" role="group" aria-label="Réseaux sociaux">
      <a
        href="https://www.tiktok.com"
        aria-label="TikTok (plateforme externe)"
        target="_blank"
        rel="noreferrer"
      >
        <Music2 size={17} />
      </a>
      <a
        href="https://www.instagram.com"
        aria-label="Instagram (plateforme externe)"
        target="_blank"
        rel="noreferrer"
      >
        <Instagram size={17} />
      </a>
      <a
        href="https://www.facebook.com"
        aria-label="Facebook (plateforme externe)"
        target="_blank"
        rel="noreferrer"
      >
        <Facebook size={17} />
      </a>
    </div>
  );
}
export function Header() {
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  return (
    <>
      <a href="#contenu" className="skip-link">
        Aller au contenu
      </a>
      <div className="topbar">
        <div className="wrap flex items-center justify-between">
          <span>
            RÉPUBLIQUE TOGOLAISE <span className="mx-3 opacity-50">|</span> Travail · Liberté ·
            Patrie
          </span>
          <span className="top-links flex gap-5">
            <Link to="/faq">Questions fréquentes</Link>
            <span>Français</span>
          </span>
        </div>
      </div>
      <header>
        <div className="wrap brandrow">
          <Brand />
          <div className="flex items-center gap-4">
            <span className="header-contact text-xs text-muted-foreground">
              La culture, un patrimoine à partager.
            </span>
            <Button variant="outline" asChild className="header-contact">
              <Link to="/contact">
                Nous contacter <ArrowUpRight />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="mobile-toggle"
              aria-label={menu ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
        <nav aria-label="Navigation principale" className={`header-nav ${menu ? "open" : ""}`}>
          <div className="wrap nav-inner">
            {nav.map(([label, path]) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenu(false)}
                className={`nav-link ${pathname === path ? "active" : ""}`}
              >
                {label}
              </Link>
            ))}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Ouvrir la recherche"
              aria-expanded={search}
              onClick={() => setSearch(!search)}
            >
              <Search size={17} />
            </Button>
          </div>
        </nav>
        {search && (
          <div className="search-panel">
            <form
              className="wrap flex gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSearch(false);
                navigate({ to: "/recherche", search: { q: query } });
              }}
            >
              <label className="search-field">
                <span className="sr-only">Rechercher sur le site</span>
                <Search />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Que recherchez-vous ?"
                  autoFocus
                />
              </label>
              <Button type="submit">Rechercher</Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Fermer la recherche"
                onClick={() => setSearch(false)}
              >
                <X />
              </Button>
            </form>
          </div>
        )}
      </header>
    </>
  );
}
export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Brand />
            <p className="mt-5 max-w-xs">
              Promouvoir la création, préserver les héritages et faire vivre les cultures des
              Plateaux.
            </p>
            <div className="mt-4">
              <SocialLinks />
            </div>
          </div>
          <div>
            <h3>La Direction</h3>
            <ul>
              <li>
                <Link to="/la-direction">Présentation</Link>
              </li>
              <li>
                <Link to="/missions">Missions et attributions</Link>
              </li>
              <li>
                <Link to="/organisation">Organisation et équipe</Link>
              </li>
              <li>
                <Link to="/partenaires">Nos partenaires</Link>
              </li>
              <li>
                <Link to="/contact">Nous contacter</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Explorer la culture</h3>
            <ul>
              <li>
                <Link to="/actualites">Actualités</Link>
              </li>
              <li>
                <Link to="/agenda">Agenda culturel</Link>
              </li>
              <li>
                <Link to="/patrimoine">Patrimoine et cultures</Link>
              </li>
              <li>
                <Link to="/mediatheque">Médiathèque</Link>
              </li>
              <li>
                <Link to="/projets">Projets et programmes</Link>
              </li>
            </ul>
          </div>
          <div>
            <h3>Restons en contact</h3>
            <p className="flex items-center gap-2">
              <MapPin size={14} />
              Région des Plateaux, Togo
            </p>
            <p className="mt-3">
              Coordonnées et horaires officiels
              <br />à confirmer auprès de la Direction.
            </p>
            <Link to="/contact" className="section-link mt-4">
              <Mail size={14} />
              Écrire à la Direction
            </Link>
            <ul className="mt-4">
              <li>
                <Link to="/faq">Questions fréquentes</Link>
              </li>
              <li>
                <Link to="/archives">Archives</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>
            © 2026 Arts & Cultures des Plateaux. Version de présentation — contenus indicatifs et
            visuels illustratifs.
          </span>
          <div className="flex flex-wrap gap-5">
            <Link to="/mentions-legales">Mentions légales</Link>
            <Link to="/confidentialite">Confidentialité</Link>
            <Link to="/plan-du-site">Plan du site</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
export function PageBanner({
  title,
  intro,
  parent,
}: {
  title: string;
  intro: string;
  parent?: { label: string; path: keyof typeof pageInfo };
}) {
  return (
    <div className="page-banner">
      <div className="wrap">
        <div className="breadcrumb">
          <Link to="/">Accueil</Link>
          <ChevronRight size={12} />
          {parent && (
            <>
              <Link to={pagePaths[parent.path]}>{parent.label}</Link>
              <ChevronRight size={12} />
            </>
          )}
          <span>{title}</span>
        </div>
        <h1>{title}</h1>
        <p>{intro}</p>
      </div>
    </div>
  );
}
export function ContactBand() {
  return (
    <section className="contact-band">
      <div className="wrap">
        <div>
          <h2>La culture se construit ensemble.</h2>
          <p className="text-sm mt-2 opacity-80">
            Un projet, une question, une envie de participer ? Échangeons.
          </p>
        </div>
        <Button variant="hero" size="lg" asChild>
          <Link to="/contact">
            Contactez-nous <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}
