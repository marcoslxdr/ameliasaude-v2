"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Sobre nós", href: "#origem" },
  { label: "Planos", href: "#experiencia-planos" },
  { label: "Rede", href: "#rede" },
  { label: "Telemedicina", href: "#telemedicina" },
  { label: "Fale conosco", href: "#contato" },
  { label: "Saúde e bem estar", href: "/blog" },
];

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const isBlogPage = pathname?.startsWith("/blog") ?? false;

  const visibleLinks = (() => {
    let links = navLinks.map((link) =>
      !isHomePage && link.href.startsWith("#")
        ? { ...link, href: `/${link.href}` }
        : link
    );

    if (isBlogPage) {
      links = links.filter((link) => link.href !== "/blog");
      links = [{ label: "Início", href: "/" }, ...links];
    }

    return links;
  })();

  const isBannerHero = isHomePage && !scrolled;
  const useSolidHeader = isBlogPage || scrolled;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  /** Toggle always purple */
  const toggleBorder = "rgba(123,107,178,0.5)";
  const toggleStroke = "#7b6bb2";
  const toggleBg = "transparent";

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: menuOpen
            ? "transparent"
            : useSolidHeader
            ? "rgba(255,255,255,0.94)"
            : "transparent",
          backdropFilter:
            !menuOpen && useSolidHeader ? "blur(20px) saturate(180%)" : "none",
          WebkitBackdropFilter:
            !menuOpen && useSolidHeader ? "blur(20px) saturate(180%)" : "none",
          borderBottom:
            !menuOpen && useSolidHeader
              ? "1px solid rgba(123,107,178,0.1)"
              : "1px solid transparent",
        }}
      >
        <div
          className="max-w-[1440px] mx-auto flex items-center justify-between"
          style={{ padding: "1.1rem clamp(1.5rem, 5vw, 5rem)" }}
        >
          {/* Logo — maior */}
          <a
            href="/"
            aria-label="Amélia Saúde — início"
            onClick={closeMenu}
            className="relative z-[60] flex items-center"
          >
            <Image
              src={menuOpen ? "/logo-amelia-site-branca.png" : "/logo-amelia-site.png"}
              alt="Amélia Saúde"
              width={200}
              height={56}
              priority
              className={`h-14 w-auto object-contain transition-transform duration-300 ${
                menuOpen ? "scale-[1.15] origin-left" : "scale-100 origin-left"
              }`}
            />
          </a>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Menu principal">
            {visibleLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium tracking-wide transition-colors duration-300 ${
                  isBannerHero
                    ? "text-black hover:text-[#7b6bb2]"
                    : "text-gray-700 hover:text-[#7b6bb2]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile toggle — hidden on desktop */}
          <div className="flex items-center lg:hidden">
            <motion.button
              className="relative z-[60] flex flex-col justify-center items-center gap-[5px] rounded-full border transition-[border-color,background-color] duration-300"
              style={{
                width: 48,
                height: 48,
                borderColor: toggleBorder,
                background: toggleBg,
              }}
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              aria-expanded={menuOpen}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <motion.span
                animate={
                  menuOpen
                    ? { rotate: 45, y: 6, backgroundColor: "#7b6bb2" }
                    : { rotate: 0, y: 0, backgroundColor: toggleStroke }
                }
                transition={{ duration: 0.3 }}
                className="block w-5 h-[1.5px] rounded-full"
              />
              <motion.span
                animate={
                  menuOpen
                    ? { opacity: 0, x: -4, backgroundColor: "#7b6bb2" }
                    : { opacity: 1, x: 0, backgroundColor: toggleStroke }
                }
                transition={{ duration: 0.2 }}
                className="block w-5 h-[1.5px] rounded-full"
              />
              <motion.span
                animate={
                  menuOpen
                    ? { rotate: -45, y: -6, backgroundColor: "#7b6bb2" }
                    : { rotate: 0, y: 0, backgroundColor: toggleStroke }
                }
                transition={{ duration: 0.3 }}
                className="block w-5 h-[1.5px] rounded-full"
              />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Fullscreen overlay menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
            exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 flex flex-col"
            style={{
              background:
                "linear-gradient(165deg, #3d2a6e 0%, #5e4985 42%, #6b5aa3 100%)",
              backdropFilter: "blur(24px) saturate(140%)",
              WebkitBackdropFilter: "blur(24px) saturate(140%)",
            }}
          >
            {/* Background decorative elements */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              aria-hidden
            >
              <div
                className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)",
                }}
              />
              <div
                className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 70%)",
                }}
              />
            </div>

            {/* Nav links — centered */}
            <nav
              className="flex flex-col justify-center items-center flex-1 gap-2"
              aria-label="Menu fullscreen"
            >
              {visibleLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  initial={{ opacity: 0, y: 32 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.1 + i * 0.07,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-display text-[clamp(1.75rem,5vw,3.5rem)] font-light text-white/90 hover:text-white tracking-wider leading-[1.15] transition-colors duration-300 focus-visible:outline-none"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {/* Footer line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="pb-10 text-center"
            >
              <p
                className="font-sans text-xs tracking-[0.08em]"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                Amélia Saúde · Rio de Janeiro
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
