import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { Wine, Utensils, Coffee, ChevronRight, ChevronLeft, Plus, Send, Leaf, Phone, MapPin, Clock, Menu, X, ChevronDown } from 'lucide-react';
import './index.css';
import horairesData from './data/horaires.json';
import ReservationSection from './ReservationSection.jsx';
import AuthGate from './AuthGate.jsx';

/* ═══════════════════════════════════════════
   ROTATING STAMP SVG (Le tampon qui tourne)
   ═══════════════════════════════════════════ */
function RotatingStamp({ className = '' }) {
  return (
    <div className={`rotating-stamp ${className}`}>
      <svg viewBox="0 0 260 260" className="w-full h-full animate-spin-slow">
        <defs>
          <path id="circlePath" d="M 130, 130 m -100, 0 a 100,100 0 1,1 200,0 a 100,100 0 1,1 -200,0" />
        </defs>
        {/* Double outer ring — thick */}
        <circle cx="130" cy="130" r="122" fill="none" stroke="currentColor" strokeWidth="5" />
        <circle cx="130" cy="130" r="116" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Inner ring */}
        <circle cx="130" cy="130" r="90" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        {/* Rotating text */}
        <text fontSize="14" fontFamily="'Playfair Display', serif" fontWeight="700" letterSpacing="6" fill="currentColor">
          <textPath href="#circlePath" startOffset="0%">
            FAIT MAISON • LA CABANE DES SAVEURS • GUINGUETTE • BEAULIEU-SUR-LAYON •
          </textPath>
        </text>
        {/* Decorative leaves — left */}
        <text x="32" y="135" textAnchor="middle" fontSize="22" fill="currentColor" opacity="0.8">🌿</text>
        {/* Decorative leaves — right */}
        <text x="228" y="135" textAnchor="middle" fontSize="22" fill="currentColor" opacity="0.8">🌿</text>
        {/* Center logo */}
        <text x="130" y="120" textAnchor="middle" fontSize="48" fontFamily="'Playfair Display', serif" fontWeight="900" fill="currentColor">CS</text>
        <text x="130" y="148" textAnchor="middle" fontSize="12" fontFamily="'Outfit', sans-serif" fontWeight="600" letterSpacing="4" fill="currentColor" opacity="0.7">EST. 2024</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════
   REVEAL TEXT COMPONENT (GSAP SplitText style)
   ═══════════════════════════════════════════ */
function RevealText({ text, className = "", delay = 0 }) {
  const words = text.split(" ");
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.02,
        delayChildren: delay
      }
    }
  };

  const child = {
    hidden: { opacity: 0, y: "115%", rotate: 8 },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: {
        duration: 0.9,
        ease: [0.215, 0.610, 0.355, 1.000]
      }
    }
  };

  return (
    <motion.span
      className={`inline-flex flex-wrap justify-center md:justify-start ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-block overflow-hidden mr-[0.25em] py-0.5">
          {Array.from(word).map((char, charIdx) => (
            <motion.span
              key={charIdx}
              className="inline-block origin-bottom-left"
              variants={child}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.span>
  );
}

/* ═══════════════════════════════════════════
   BACKGROUND MARQUEE (Défilement arrière-plan)
   ═══════════════════════════════════════════ */
function BackgroundMarquee({ text }) {
  const items = Array(8).fill(text);
  return (
    <div className="marquee-bg">
      <div className="marquee-bg-inner">
        {items.map((t, i) => (
          <span key={i}>{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   IMAGE CAROUSEL SLIDER (Diaporama)
   ═══════════════════════════════════════════ */
function ImageSlider({ images, autoPlay = true, interval = 5000, stampColor = 'text-white' }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images.length, autoPlay, interval]);

  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full h-full min-h-[400px] overflow-hidden group">
      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`Slide ${currentIndex + 1}`}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/20" />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx); }}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-white scale-125' : 'bg-white/50'}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MARQUEE / TICKER BANNER (Bandeau défilant)
   ═══════════════════════════════════════════ */
function MarqueeBanner({ text, speed = 45 }) {
  const items = Array(6).fill(text);
  return (
    <div className="overflow-hidden bg-[#819b57] text-white py-4 whitespace-nowrap">
      <motion.div
        className="inline-flex gap-16 text-lg md:text-xl font-serif tracking-wider"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((t, i) => (
          <span key={i} className="flex items-center gap-8">
            <span>{t}</span>
            <Leaf className="w-5 h-5 opacity-50" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COOKIE BANNER
   ═══════════════════════════════════════════ */
function CookieBanner() {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.8, delay: 2 }}
      className="fixed bottom-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 p-5 shadow-2xl z-50 flex flex-col sm:flex-row justify-between items-center gap-4"
    >
      <div className="text-sm text-gray-700 max-w-3xl">
        <p className="font-bold text-gray-900 mb-1 font-serif text-base">Nous respectons votre vie privée.</p>
        <p>Nous utilisons des cookies pour améliorer votre expérience de navigation et analyser notre trafic.</p>
      </div>
      <div className="flex gap-3 shrink-0">
        <button onClick={() => setIsVisible(false)} className="px-5 py-2 border border-[#819b57] text-[#819b57] rounded-full hover:bg-[#819b57] hover:text-white transition-all text-sm font-medium">
          Personnaliser
        </button>
        <button onClick={() => setIsVisible(false)} className="px-5 py-2 bg-[#819b57] text-white rounded-full hover:bg-[#6b8248] transition-all text-sm font-medium shadow-md">
          Tout accepter
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   STICKY HEADER / NAVIGATION
   ═══════════════════════════════════════════ */
function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { label: 'Menu', href: '#menus' },
    { label: 'Boissons', href: '#boissons' },
    { label: 'Vins', href: '#vins' },
    { label: 'Enfants', href: '#enfants' },
    { label: 'Infos', href: '#infos' },
  ];

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent border-b border-white/20'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between h-20">
        <a href="#menus" className={`text-2xl font-serif font-bold transition-colors ${scrolled ? 'text-[#3F3733]' : 'text-white'}`} style={{ fontFamily: "'Playfair Display', serif" }}>
          La Cabane des Saveurs
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map(item => (
            <a key={item.label} href={item.href} className={`text-sm font-medium uppercase tracking-widest transition-colors hover:text-[#819b57] ${scrolled ? 'text-[#3F3733]/80' : 'text-white/90'}`}>
              {item.label}
            </a>
          ))}
          <a href="#reserver" className="px-5 py-2 bg-[#819b57] text-white rounded-full text-sm font-medium hover:bg-[#6b8248] transition-colors">
            Réserver
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className={`md:hidden transition-colors ${scrolled ? 'text-[#3F3733]' : 'text-white'}`}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-xl overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map(item => (
                <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="text-[#212121] font-medium text-lg border-b border-gray-100 pb-3">
                  {item.label}
                </a>
              ))}
              <a href="#reserver" className="mt-2 px-5 py-3 bg-[#819b57] text-white rounded-full text-center font-medium">
                Réserver
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ═══════════════════════════════════════════
   HERO SECTION (with Parallax + Stamp)
   ═══════════════════════════════════════════ */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img src="/images/hero.webp" alt="Guinguette La Cabane des Saveurs" className="absolute inset-0 w-full h-full object-cover" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-20 text-center px-4 max-w-5xl flex flex-col items-center text-white">
        <div className="flex flex-col items-center mb-6">
          <motion.p 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
            className="text-sm md:text-base uppercase tracking-[0.3em] mb-4 text-gray-200"
          >
            Guinguette à Beaulieu-sur-Layon
          </motion.p>
          <h1 className="text-5xl md:text-8xl lg:text-9xl mb-2 leading-none flex flex-col items-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            <RevealText text="Inspirer les gens," delay={0.2} />
            <RevealText text="inspirer la table" delay={0.5} />
          </h1>
        </div>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.2, delay: 0.9, ease: [0.25, 1, 0.5, 1] }} 
          className="text-base md:text-xl mb-12 text-gray-200 max-w-2xl leading-relaxed"
        >
          Découvrez La Cabane des Saveurs, restaurant-guinguette, fait maison, amoureux du terroir angevin et des bons moments partagés.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1.2, delay: 1.2, ease: [0.25, 1, 0.5, 1] }} 
          className="flex gap-4 flex-col sm:flex-row"
        >
          <a href="#menus" className="inline-flex items-center gap-2 px-8 py-4 bg-[#819b57] text-white font-semibold rounded-full shadow-xl hover:bg-[#6b8248] transition-all hover:scale-105">
            Découvrir nos cartes <ChevronRight className="w-5 h-5" />
          </a>
          <a href="tel:+33668293258" className="inline-flex items-center gap-2 px-8 py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#212121] transition-all">
            <Phone className="w-4 h-4" /> Réserver
          </a>
        </motion.div>
      </motion.div>

      {/* Rotating Stamp */}
      <div className="absolute bottom-12 right-12 z-20 hidden md:block">
        <RotatingStamp className="w-32 h-32 text-white" />
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <ChevronDown className="w-8 h-8 text-white/60" />
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PHILOSOPHY SECTION (Texte + Tampon animé)
   ═══════════════════════════════════════════ */
function PhilosophySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-28 bg-[#2C3B1E] text-white relative overflow-hidden">
      {/* Background Marquee behind text */}
      <BackgroundMarquee text="LA CABANE DES SAVEURS • LA TABLE INSPIRÉE • FAIT MAISON • " />

      <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 15 }} 
          animate={isInView ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className="text-[#a8c47a] font-semibold tracking-[0.3em] uppercase text-xs mb-6"
        >
          La Cabane des Saveurs
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-3xl md:text-5xl mb-8 leading-snug text-white" style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Nous savons qu'il y a des façons plus faciles de cuisiner.
          Mais nous préférons la meilleure façon.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-10"
        >
          Chez nous, la qualité est le fruit d'une recherche et non un accident de parcours.
          Des produits frais, de la patience et beaucoup de passion : voilà la recette de La Cabane.
        </motion.p>
      </div>

      {/* Rotating Stamp positioned at transition */}
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-10">
        <RotatingStamp className="w-36 h-36 text-[#a8c47a]" />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PANIERS SECTION (Pique-nique & Produits locaux)
   ═══════════════════════════════════════════ */
function PaniersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const images = ['/images/salad.webp', '/images/vins.webp', '/images/burger.webp'];

  return (
    <section ref={ref} className="py-0 bg-white relative overflow-hidden" id="paniers">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px] border-b border-gray-100">
        {/* Left: Image Carousel Slider */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="relative aspect-square w-full"
        >
          <ImageSlider images={images} stampColor="text-[#f7e88c]" />
        </motion.div>

        {/* Right: Text Content */}
        <div className="flex flex-col justify-center px-10 md:px-20 py-20 bg-[#F0E9E1]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          >
            <p className="text-[#819b57] font-semibold tracking-[0.3em] uppercase text-xs mb-6">Paniers de Saison</p>
            <h2 className="text-4xl md:text-5xl text-[#3F3733] mb-6 leading-snug flex flex-col items-start" style={{ fontFamily: "'Playfair Display', serif" }}>
              <RevealText text="Paniers pique-nique &" delay={0.1} />
              <RevealText text="Épicerie du terroir" delay={0.3} />
            </h2>
            <p className="text-[#574e49] text-lg leading-relaxed mb-8">
              Commandez nos paniers pique-nique exclusifs garnis de spécialités locales : rillauds d'Anjou, terrines artisanales, fromages de pays, pain croustillant et une sélection de vins de Loire. Parfait pour vos escapades le long du Layon et dans les vignes environnantes.
            </p>
            <a href="tel:+33668293258" className="inline-flex items-center gap-3 text-[#3F3733] font-medium hover:text-[#819b57] transition-colors group">
              <span className="w-10 h-10 rounded-full border-2 border-[#3F3733] group-hover:border-[#819b57] flex items-center justify-center transition-colors">
                <Plus className="w-4 h-4" />
              </span>
              Réserver mon panier
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   MENU DU JOUR (Plat du jour / Card style)
   ═══════════════════════════════════════════ */
function MenuDuJour() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const today = new Date();
  const dateStr = today.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

  return (
    <section ref={ref} className="py-0 bg-white" id="menu-du-jour">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
        {/* Left: Menu — Green background */}
        <div className="bg-[#819b57] text-white p-10 md:p-16 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-[#f7e88c] uppercase tracking-[0.3em] text-xs font-semibold mb-2">Le Petit Café</p>
            <h2 className="text-4xl md:text-5xl mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
              Menu du jour
            </h2>
            <p className="text-white/70 text-sm mb-10 italic" style={{ fontFamily: "'Playfair Display', serif" }}>
              {dateStr}
            </p>

            <div className="space-y-6 max-w-sm mx-auto text-left">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.2 }}>
                <p className="uppercase tracking-[0.2em] text-xs text-white/60 font-semibold mb-1">Soupe</p>
                <p className="text-lg italic" style={{ fontFamily: "'Playfair Display', serif" }}>Velouté de légumes du jardin</p>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.35 }}
                className="flex justify-between items-baseline border-b border-white/15 pb-4">
                <div>
                  <p className="uppercase tracking-[0.2em] text-xs text-white/60 font-semibold mb-1">Menu principal</p>
                  <p className="text-lg italic" style={{ fontFamily: "'Playfair Display', serif" }}>Burger Cabane, frites maison</p>
                </div>
                <span className="text-2xl font-bold ml-4" style={{ fontFamily: "'Playfair Display', serif" }}>14,90</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5 }}
                className="flex justify-between items-baseline border-b border-white/15 pb-4">
                <div>
                  <p className="uppercase tracking-[0.2em] text-xs text-white/60 font-semibold mb-1">Salade repas</p>
                  <p className="text-lg italic" style={{ fontFamily: "'Playfair Display', serif" }}>Tartare saumon, fraises et avocat</p>
                </div>
                <span className="text-2xl font-bold ml-4" style={{ fontFamily: "'Playfair Display', serif" }}>16,90</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.65 }}>
                <p className="uppercase tracking-[0.2em] text-xs text-white/60 font-semibold mb-1">Dessert</p>
                <p className="text-lg italic" style={{ fontFamily: "'Playfair Display', serif" }}>Moelleux au chocolat, glace vanille</p>
              </motion.div>
            </div>

            <motion.p initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}
              className="mt-10 text-white/50 text-sm uppercase tracking-wider text-center">
              Mercredi au dimanche • Midi & soir
            </motion.p>
          </motion.div>
        </div>

        {/* Right: Food Photos — Stacked */}
        <div className="flex flex-col min-h-[600px]">
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex-1 overflow-hidden"
          >
            <img src="/images/salad.webp" alt="Salade repas" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm px-5 py-2 rounded-full text-sm font-semibold text-[#3F3733]">
              Salade repas
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 1.05 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative flex-1 overflow-hidden"
          >
            <img src="/images/burger.webp" alt="Burger Cabane" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/15" />
            <div className="absolute bottom-6 right-6">
              <a href="#menus" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#819b57] text-white rounded-full font-medium hover:bg-[#6b8248] transition-colors shadow-lg text-sm">
                Tous nos menus <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FEATURE GRID (Nos Cartes - Bento Grid)
   ═══════════════════════════════════════════ */
function FeatureGrid() {
  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVariants = { 
    hidden: { opacity: 0, scale: 0.94, y: 30 }, 
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { duration: 1.2, ease: [0.25, 1, 0.5, 1] } 
    } 
  };

  return (
    <section className="py-28 bg-[#F0E9E1] text-[#3F3733]" id="menus">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-20">
          <p className="text-[#819b57] font-semibold tracking-[0.3em] uppercase text-xs mb-4">Notre savoir-faire</p>
          <h2 className="text-4xl md:text-6xl flex justify-center" style={{ fontFamily: "'Playfair Display', serif" }}>
            <RevealText text="Découvrez nos cartes" delay={0.1} />
          </h2>
        </div>

        <motion.div variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Menu - Large */}
          <motion.div variants={itemVariants} className="md:col-span-8 group relative overflow-hidden rounded-3xl shadow-xl min-h-[450px]" id="menu-principal">
            <img src="/images/burger.webp" alt="Menu Principal" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10 w-full text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#819b57] rounded-full"><Utensils className="w-5 h-5" /></div>
                <span className="text-[#819b57] uppercase tracking-widest text-xs font-semibold">Restaurant</span>
              </div>
              <h3 className="text-3xl md:text-4xl mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Le Menu Principal</h3>
              <p className="text-gray-300 text-lg mb-6 max-w-lg">Burgers gourmands, viandes de caractère et plats mijotés — 100% fait maison.</p>
              <a href="#menus" className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-white/50 rounded-full hover:bg-white hover:text-black transition-all text-sm font-medium">
                Voir le menu <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Wines - Tall */}
          <motion.div variants={itemVariants} className="md:col-span-4 group relative overflow-hidden rounded-3xl shadow-xl min-h-[450px]" id="vins">
            <img src="/images/vins.webp" alt="Cave à Vins" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
            <div className="absolute inset-0 flex flex-col justify-end p-10 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#f7e88c]/20 rounded-full"><Wine className="w-5 h-5 text-[#f7e88c]" /></div>
                <span className="text-[#f7e88c] uppercase tracking-widest text-xs font-semibold">Cave</span>
              </div>
              <h3 className="text-3xl mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Vins de Loire</h3>
              <p className="text-gray-200 mb-6">Sélection pointue de vins natures, bio et locaux, d'Anjou et du Layon.</p>
              <a href="#vins" className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 rounded-full hover:bg-white hover:text-black transition-all text-sm font-medium">
                Découvrir <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Drinks */}
          <motion.div variants={itemVariants} className="md:col-span-5 group relative overflow-hidden rounded-3xl shadow-xl min-h-[350px]" id="boissons">
            <img src="/images/drinks.webp" alt="Boissons" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10 text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white/10 rounded-full"><Coffee className="w-5 h-5" /></div>
                <span className="uppercase tracking-widest text-xs font-semibold text-white/80">Rafraîchissements</span>
              </div>
              <h3 className="text-2xl mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Carte des Boissons</h3>
              <p className="text-gray-300 mb-4">Jus pressés, bières artisanales, sirops maison et cocktails sans alcool.</p>
              <a href="#boissons" className="text-[#819b57] font-semibold flex items-center gap-1 hover:gap-2 transition-all text-sm">Voir la carte <ChevronRight className="w-4 h-4" /></a>
            </div>
          </motion.div>

          {/* Kids */}
          <motion.div variants={itemVariants} className="md:col-span-7 group relative overflow-hidden rounded-3xl shadow-xl min-h-[350px]" id="enfants">
            <img src="/images/kids.webp" alt="Menu Enfant" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-10 text-white max-w-lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-[#819b57]/30 rounded-full"><Leaf className="w-5 h-5 text-[#819b57]" /></div>
                <span className="text-[#819b57] uppercase tracking-widest text-xs font-semibold">Famille</span>
              </div>
              <h3 className="text-2xl mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Les P'tits Cabaniers</h3>
              <p className="text-gray-300 mb-4">Des portions adaptées et des surprises pour régaler les plus jeunes dans un cadre sécurisé.</p>
              <a href="#enfants" className="text-[#819b57] font-semibold flex items-center gap-1 hover:gap-2 transition-all text-sm">Voir le menu enfant <ChevronRight className="w-4 h-4" /></a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   AMBIANCE / TRAITEUR SECTION (Texte + Image)
   ═══════════════════════════════════════════ */
function AmbianceSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const images = ['/images/hero.webp', '/images/drinks.webp', '/images/burger.webp'];

  return (
    <section ref={ref} className="py-0 bg-white relative overflow-hidden" id="privatisation">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
        {/* Left: Text */}
        <div className="flex flex-col justify-center px-10 md:px-20 py-20 bg-white">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={isInView ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          >
            <p className="text-[#819b57] font-semibold tracking-[0.3em] uppercase text-xs mb-6">Privatisation</p>
            <h2 className="text-4xl md:text-5xl text-[#3F3733] mb-6 leading-snug flex flex-col items-start" style={{ fontFamily: "'Playfair Display', serif" }}>
              <RevealText text="Toutes les occasions" delay={0.1} />
              <RevealText text="sont bonnes" delay={0.3} />
            </h2>
            <p className="text-[#574e49] text-lg leading-relaxed mb-8">
              Pour un anniversaire, un mariage champêtre, un repas de famille ou un séminaire d'entreprise, privatisez la Cabane des Saveurs. Notre équipe s'occupe de tout : buffet traiteur fait maison, vins locaux, animation musicale et cadre guinguette idyllique au bord de l'eau.
            </p>
            <a href="tel:+33668293258" className="inline-flex items-center gap-3 text-[#3F3733] font-medium hover:text-[#819b57] transition-colors group">
              <span className="w-10 h-10 rounded-full border-2 border-[#3F3733] group-hover:border-[#819b57] flex items-center justify-center transition-colors">
                <Plus className="w-4 h-4" />
              </span>
              Nous contacter
            </a>
          </motion.div>
        </div>

        {/* Right: Image Carousel Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }} 
          animate={isInView ? { opacity: 1, scale: 1 } : {}} 
          transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="relative min-h-[400px]"
        >
          <ImageSlider images={images} stampColor="text-white" />
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   LES CARNETS DE LA CABANE (Blog section)
   ═══════════════════════════════════════════ */
function BlogSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const scrollRef = useRef(null);

  const posts = [
    {
      title: "Le secret d'un bon vin de Loire : rencontre avec nos vignerons",
      category: "Inspirations",
      date: "9 juin 2026",
      image: "/images/vins.webp"
    },
    {
      title: "La recette de nos rillauds d'Anjou traditionnels fait maison",
      category: "Recettes",
      date: "2 juin 2026",
      image: "/images/burger.webp"
    },
    {
      title: "Les soirées concert de l'été 2026 : le programme complet",
      category: "Événements",
      date: "24 mai 2026",
      image: "/images/hero.webp"
    },
    {
      title: "Cocktails d'été : 3 sirops maison à réaliser soi-même",
      category: "Recettes",
      date: "15 mai 2026",
      image: "/images/drinks.webp"
    }
  ];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - 320 : scrollLeft + 320;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section ref={ref} className="py-28 bg-[#F0E9E1] text-[#3F3733]" id="blog">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          >
            <p className="text-[#819b57] font-semibold tracking-[0.3em] uppercase text-xs mb-4">Le blogue nature</p>
            <h2 className="text-4xl md:text-5xl flex justify-center md:justify-start" style={{ fontFamily: "'Playfair Display', serif" }}>
              <RevealText text="Les Carnets de la Cabane" delay={0.1} />
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="flex gap-3"
          >
            <button
              onClick={() => scroll('left')}
              className="w-12 h-12 rounded-full border border-gray-300 hover:border-[#819b57] hover:text-[#819b57] flex items-center justify-center bg-white transition-colors shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-12 h-12 rounded-full border border-gray-300 hover:border-[#819b57] hover:text-[#819b57] flex items-center justify-center bg-white transition-colors shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>

        {/* Scrolling Cards Wrapper */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 1, 0.5, 1] }}
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-8 no-scrollbar scroll-smooth"
        >
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[290px] sm:w-[350px] bg-white rounded-3xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300"
            >
              {/* Card Image */}
              <div className="h-56 relative overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider text-[#3F3733] z-10">
                  {post.category}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6">
                <time className="text-xs text-gray-400 block mb-3 font-medium uppercase tracking-wider">{post.date}</time>
                <h3 className="text-xl mb-4 group-hover:text-[#819b57] transition-colors leading-snug line-clamp-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {post.title}
                </h3>
                <a href="#blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#819b57] hover:text-[#6b8248] transition-colors">
                  Lire l'article <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   PRE-FOOTER SECTION (Carrières & Newsletter)
   ═══════════════════════════════════════════ */
function PreFooterSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-0 bg-[#F0E9E1] overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-gray-200">
        {/* Left Card: Recrutement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
          className="relative bg-[#3F3733] text-white p-12 md:p-20 min-h-[450px] flex flex-col justify-between overflow-hidden group"
        >
          {/* Subtle background image or overlay */}
          <div className="absolute inset-0 bg-black/20 z-0" />
          <img src="/images/hero.webp" alt="Recrutement" className="absolute inset-0 w-full h-full object-contain opacity-15 p-4 transition-transform duration-700 group-hover:scale-105" />

          <div className="relative z-10">
            <p className="text-[#819b57] font-semibold tracking-[0.3em] uppercase text-xs mb-6">Carrières</p>
            <h2 className="text-3xl md:text-4xl mb-6 font-serif leading-snug flex flex-col items-start">
              <RevealText text="Faites partie d’une équipe" delay={0.1} />
              <RevealText text="dynamique et passionnée" delay={0.3} />
            </h2>
            <p className="text-gray-400 max-w-md text-base leading-relaxed">
              Nous recherchons des personnes passionnées pour la cuisine faite maison et l'accueil chaleureux de nos clients dans un cadre unique.
            </p>
          </div>

          <div className="relative z-10 mt-8">
            <a href="tel:+33668293258" className="inline-flex items-center gap-3 text-white font-semibold hover:text-[#819b57] transition-colors group/btn">
              <span className="w-12 h-12 rounded-full border-2 border-white/50 group-hover/btn:border-[#819b57] flex items-center justify-center transition-colors bg-white/5">
                <Plus className="w-5 h-5 text-white" />
              </span>
              Je veux travailler
            </a>
          </div>
        </motion.div>

        {/* Right Card: Infolettre */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="relative bg-[#819b57] text-white p-12 md:p-20 min-h-[450px] flex flex-col justify-between overflow-hidden"
        >
          <div className="relative z-10">
            <p className="text-[#f7e88c] font-semibold tracking-[0.3em] uppercase text-xs mb-6">Infolettre la Cabane</p>
            <h2 className="text-3xl md:text-4xl mb-6 font-serif leading-snug">
              Laissez-vous inspirer<br />par la Cabane
            </h2>
            <p className="text-white/80 max-w-md text-base leading-relaxed">
              Inscrivez-vous pour recevoir nos recettes exclusives, nos dates de concerts et les nouveautés de nos cartes de saison.
            </p>
          </div>

          <form onSubmit={e => e.preventDefault()} className="relative z-10 mt-8 w-full">
            <div className="flex items-center border-b-2 border-white/50 focus-within:border-white py-3 transition-colors max-w-md">
              <input
                type="email"
                placeholder="Inscrivez votre email"
                className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none placeholder-white/60 text-lg"
                required
              />
              <button
                type="submit"
                className="flex-shrink-0 w-12 h-12 rounded-full bg-white text-[#819b57] hover:bg-[#f7e88c] hover:text-[#3F3733] flex items-center justify-center transition-colors shadow-md cursor-pointer"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   FOOTER (Infos Pratiques)
   ═══════════════════════════════════════════ */
function Footer() {
  const JOURS_FR = {
    lundi: 'Lundi', mardi: 'Mardi', mercredi: 'Mercredi',
    jeudi: 'Jeudi', vendredi: 'Vendredi', samedi: 'Samedi', dimanche: 'Dimanche'
  };

  const saison = horairesData.saison_2026;
  const today = new Date();
  let horairesTexte = "D'avril à octobre";

  if (saison?.periodes) {
    const active = saison.periodes.find(p => {
      const debut = new Date(p.debut);
      const fin = new Date(p.fin);
      return today >= debut && today <= fin;
    });

    if (active) {
      const jours = (active.jours_ouverts || []).map(j => JOURS_FR[j] || j).join(', ');
      const midi = active.horaires_midi ? `${active.horaires_midi.ouverture}–${active.horaires_midi.fermeture}` : '';
      const soir = active.horaires_soir ? `${active.horaires_soir.ouverture}–${active.horaires_soir.fermeture}` : '';
      horairesTexte = `Saison ${active.label} — ${jours}\nMidi ${midi}` + (soir ? ` • Soir ${soir}` : '');
    } else {
      const ouverture = new Date('2026-04-18');
      if (today < ouverture) {
        const diff = Math.ceil((ouverture - today) / (1000 * 60 * 60 * 24));
        horairesTexte = `Ouverture dans ${diff} jour${diff > 1 ? 's' : ''} !`;
      }
    }
  }

  return (
    <footer className="bg-[#1a1a1a] text-white" id="infos">
      {/* Main Footer */}
      <div className="container mx-auto px-6 max-w-6xl py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {/* Brand */}
          <div>
            <h2 className="text-3xl mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>La Cabane<br />des Saveurs</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              Guinguette authentique sur les bords du Layon, au cœur du vignoble angevin.
              100% fait maison, du terroir dans l'assiette.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/lacabanedessaveurs" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:border-[#819b57] hover:text-[#819b57] transition-colors text-sm">FB</a>
              <a href="https://www.instagram.com/cabane_des_saveurs" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-gray-600 flex items-center justify-center text-gray-400 hover:border-[#819b57] hover:text-[#819b57] transition-colors text-sm">IG</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-[#819b57] mb-6 font-semibold">Contact</h3>
            <div className="space-y-4 text-gray-300">
              <p className="flex items-start gap-3"><MapPin className="w-5 h-5 text-[#819b57] shrink-0 mt-0.5" /> Route de Cholet<br />49750 Beaulieu-sur-Layon</p>
              <p className="flex items-center gap-3"><Phone className="w-5 h-5 text-[#819b57] shrink-0" /> <a href="tel:+33668293258" className="hover:text-white transition-colors">06 68 29 32 58</a></p>
              <p className="text-sm text-gray-500">Réservation conseillée</p>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-sm uppercase tracking-widest text-[#819b57] mb-6 font-semibold">Horaires</h3>
            <div className="space-y-3 text-gray-300">
              <p className="flex items-start gap-3"><Clock className="w-5 h-5 text-[#819b57] shrink-0 mt-0.5" /> {horairesTexte}</p>
              <p className="text-sm text-gray-500">Consultez Google pour les horaires du jour.</p>
              <a href="https://maps.google.com/?q=Route+de+Cholet+Beaulieu-sur-Layon+49750" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 px-5 py-2 border border-gray-600 rounded-full text-sm hover:border-[#819b57] hover:text-[#819b57] transition-colors">
                Itinéraire Google Maps <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/10 py-6">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-sm">© {new Date().getFullYear()} La Cabane des Saveurs — Tous droits réservés</p>
          <a href="#" className="text-gray-600 text-sm hover:text-gray-400 transition-colors">Politique de confidentialité</a>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   APP MAIN
   ═══════════════════════════════════════════ */
function App() {
  return (
    <div className="min-h-screen bg-[#F0E9E1] selection:bg-[#819b57] selection:text-white overflow-x-hidden">
      <Header />
      <CookieBanner />
      <HeroSection />
      <PhilosophySection />
      <PaniersSection />
      <MenuDuJour />
      <FeatureGrid />
      <AmbianceSection />
      <BlogSection />
      <ReservationSection />
      <PreFooterSection />
      <Footer />
    </div>
  );
}

export default App;
