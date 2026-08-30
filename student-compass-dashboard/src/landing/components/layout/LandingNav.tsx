import { CTA, FOOTER } from "@/landing/content/shared";
import { ArrowLeft, GraduationCap, Menu, X } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const primaryColor = "var(--color-primary)";

export default function LandingNav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const navBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(0,0,0,0)", "rgba(var(--landing-bg-rgb, 248,250,252), 0.92)"],
  );

  useEffect(() => {
    const unsub = scrollY.on("change", (v) => setScrolled(v > 20));
    return unsub;
  }, [scrollY]);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
        style={{ backdropFilter: scrolled ? "blur(16px)" : "none" }}
      >
        <div
          className="border-b transition-all duration-300"
          style={{
            borderColor: scrolled ? "var(--landing-line)" : "transparent",
            backgroundColor: scrolled
              ? "color-mix(in srgb, var(--landing-bg) 92%, transparent 8%)"
              : "transparent",
          }}
        >
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link to={ROUTES.PUBLIC.LANDING} className="flex items-center gap-2.5 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm text-[var(--landing-text)] hidden sm:block">
                {FOOTER.BRAND}
              </span>
            </Link>

            {/* Desktop CTA */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to={ROUTES.PUBLIC.LOGIN}
                className="group inline-flex items-center gap-2 px-5 py-2 rounded-xl font-bold text-sm text-white transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                style={{ backgroundColor: primaryColor }}
              >
                {CTA.ENTER_SYSTEM}
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="sm:hidden w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-200"
              style={{
                borderColor: "var(--landing-line)",
                color: "var(--landing-text)",
              }}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="فتح القائمة"
            >
              {menuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="fixed top-16 inset-x-0 z-40 border-b shadow-lg backdrop-blur-xl"
          style={{
            borderColor: "var(--landing-line)",
            backgroundColor:
              "color-mix(in srgb, var(--landing-bg) 95%, transparent 5%)",
          }}
        >
          <div className="p-4">
            <Link
              to={ROUTES.PUBLIC.LOGIN}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white"
              style={{ backgroundColor: primaryColor }}
              onClick={() => setMenuOpen(false)}
            >
              {CTA.ENTER_SYSTEM}
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      )}
    </>
  );
}
