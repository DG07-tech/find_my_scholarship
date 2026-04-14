import { useState, useEffect } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Zap,
  Globe2,
  LockKeyhole,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const sliderImages = [
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599596564619-75f8541e4dcb?q=80&w=2070&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1627556704290-2b1f5853ff78?q=80&w=2070&auto=format&fit=crop"
];

const LandingPage = () => {
  const { token } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % sliderImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-shell pb-16 pt-4 md:pb-20">
      {/* Hero Section */}
      <section className="hero-card overflow-hidden p-8 md:p-12 xl:p-16 mb-16 relative">
        {/* Sliding Background Images */}
        {sliderImages.map((src, index) => {
          const isActive = index === currentImageIndex;
          const isPrevious = index === (currentImageIndex - 1 + sliderImages.length) % sliderImages.length;
          let visibilityClasses = 'opacity-0 -z-10';
          
          if (isActive) {
            visibilityClasses = 'opacity-100 z-10';
          } else if (isPrevious) {
            visibilityClasses = 'opacity-100 z-0';
          }

          return (
            <div
              key={src}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${visibilityClasses}`}
            >
              <img src={src} alt="Graduation background" className="w-full h-full object-cover blur-[5px]" />
            </div>
          );
        })}

        <div className="max-w-4xl relative z-10 mx-auto text-center flex flex-col items-center pt-8">
          <div className="section-eyebrow reveal-in">
            <Sparkles className="h-4 w-4" />
            Empowering Education
          </div>
          
          <h1 className="section-heading mt-6 reveal-in delay-1">
            Discover the funding you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-strong)] to-[var(--accent)]">fuel your future</span>.
          </h1>
          
          <p className="section-subtitle mt-6 reveal-in delay-2 mx-auto">
            A premium, algorithm-driven scholarship discovery platform designed to connect ambitious students with life-changing opportunities across India. Secure your academic journey in minutes.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center reveal-in delay-3">
            {!token ? (
              <>
                <Link to="/login" className="primary-button scale-110">
                  Create free account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/login" className="secondary-button scale-110">
                  Sign in to explore
                </Link>
              </>
            ) : (
              <Link to="/user/scheme" className="primary-button scale-110">
                Explore Scholarships
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="page-section">
        <div className="text-center mb-12">
          <div className="section-eyebrow">
            <Zap className="h-4 w-4" />
            Platform Features
          </div>
          <h2 className="display-font mt-4 text-3xl font-bold text-[var(--ink)]">
            Everything you need. Nothing you don't.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="section-card p-6 md:p-8 card-hover">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary-soft)] text-[var(--primary-strong)] mb-6">
              <Globe2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--ink)] mb-3">Pan-India Support</h3>
            <p className="text-[var(--ink-soft)] leading-relaxed">
              We aggregate and organize scholarships across all Indian states, boards, and curriculums for centralized access.
            </p>
          </div>

          <div className="section-card p-6 md:p-8 card-hover">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] mb-6">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--ink)] mb-3">Verified Sources</h3>
            <p className="text-[var(--ink-soft)] leading-relaxed">
              Every scheme is tagged with official verification statuses, ensuring you only apply to legitimate programs.
            </p>
          </div>

          <div className="section-card p-6 md:p-8 card-hover">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--secondary-soft)] text-[var(--secondary)] mb-6">
              <LockKeyhole className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-[var(--ink)] mb-3">Private & Protected</h3>
            <p className="text-[var(--ink-soft)] leading-relaxed">
              The entire platform operates behind a secure login system. Your search preferences and filters remain private.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="page-section two-column-layout">
        <div className="section-card p-8 md:p-10 flex flex-col justify-center bg-[linear-gradient(135deg,var(--bg-strong),var(--surface-muted))] border-none relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/10 blur-[80px]" />
          <h2 className="display-font text-3xl font-bold text-[var(--ink)] relative z-10">About Us</h2>
          <p className="mt-4 text-[var(--ink-soft)] leading-relaxed relative z-10">
            Find My Scholarship was created to eliminate the barrier of awareness in higher education. Thousands of grants go unutilized every year simply because students don't know they exist.
          </p>
          <p className="mt-4 text-[var(--ink-soft)] leading-relaxed relative z-10">
            Our algorithmic engine aligns student demographics, socioeconomic status, and academic merit directly with scheme requirements, making discovery an effortless process.
          </p>
        </div>

        <div className="grid gap-4">
          {[
            "1,200+ Scholarships curated",
            "50+ Government boards supported",
            "100% Free for students",
            "Real-time eligibility checking"
          ].map((text, idx) => (
            <div key={idx} className="panel-soft p-5 flex items-center gap-4">
              <CheckCircle2 className="h-5 w-5 text-[var(--success)]" />
              <span className="font-bold text-[var(--ink)]">{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Footer */}
      <footer className="page-section mt-20">
        <div className="section-card p-10 md:p-16 text-center bg-[var(--surface-strong)] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--primary-soft),transparent)]" />
          <h2 className="display-font text-3xl md:text-5xl font-bold text-[var(--ink)] relative z-10">
            Ready to find your scholarship?
          </h2>
          <p className="mt-6 text-[var(--ink-soft)] max-w-2xl mx-auto relative z-10 text-lg">
            Join the platform today to unlock instant access to our expansive directory and smart matching engine.
          </p>
          <div className="mt-8 relative z-10">
            {!token ? (
              <Link to="/login" className="primary-button scale-110">
                Unlock the Directory
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link to="/user/scheme" className="primary-button scale-110">
                Explore Directory
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
