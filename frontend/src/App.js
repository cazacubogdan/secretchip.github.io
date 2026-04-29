import { useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Shield, CheckCircle, XCircle, ArrowRight, Mail, Building2, User, MessageSquare } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Noise Overlay Component
const NoiseOverlay = () => <div className="noise-overlay" aria-hidden="true" />;

// Navigation Component
const Navigation = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
    <div className="section-container">
      <div className="flex items-center justify-between h-20">
        <a href="#hero" className="logo-text" data-testid="logo">
          [Your Name]
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#problem" className="text-slate-400 hover:text-slate-50 transition-colors text-sm">The Problem</a>
          <a href="#offer" className="text-slate-400 hover:text-slate-50 transition-colors text-sm">The Offer</a>
          <a href="#approach" className="text-slate-400 hover:text-slate-50 transition-colors text-sm">Approach</a>
          <a href="#contact" className="btn-secondary text-sm py-2 px-5" data-testid="nav-contact-btn">Get in Touch</a>
        </div>
      </div>
    </div>
  </nav>
);

// Hero Section
const HeroSection = () => (
  <section id="hero" className="relative min-h-screen flex items-center pt-20" data-testid="hero-section">
    <div className="hero-bg" />
    <div className="hero-glow" />
    <div className="section-container relative z-10 py-24 md:py-32">
      <div className="max-w-4xl">
        <p className="caption-text mb-6 animate-fade-in-up opacity-0" style={{ animationFillMode: 'forwards' }}>
          Fractional CISO Services · EU
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium text-slate-50 mb-8 animate-fade-in-up opacity-0 animation-delay-100" style={{ animationFillMode: 'forwards' }}>
          I own your security risk.
        </h1>
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-6 max-w-2xl animate-fade-in-up opacity-0 animation-delay-200" style={{ animationFillMode: 'forwards' }}>
          Interim Head of Security and fractional CISO for founders and boards who need senior leadership, not another consultant.
        </p>
        <p className="text-base text-slate-500 mb-10 animate-fade-in-up opacity-0 animation-delay-300" style={{ animationFillMode: 'forwards' }}>
          This is not assessment work. I take accountability for decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0 animation-delay-400" style={{ animationFillMode: 'forwards' }}>
          <a href="#contact" className="btn-primary inline-flex items-center justify-center gap-2" data-testid="hero-cta">
            Start a Conversation
            <ArrowRight size={18} />
          </a>
          <a href="#offer" className="btn-secondary inline-flex items-center justify-center">
            Learn More
          </a>
        </div>
      </div>
    </div>
  </section>
);

// Problem Section
const ProblemSection = () => (
  <section id="problem" className="py-24 md:py-32 relative" data-testid="problem-section">
    <div className="section-container">
      <div className="max-w-3xl mb-16">
        <p className="caption-text mb-4">The Reality</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-slate-50 mb-6">
          Security becomes a leadership problem.
        </h2>
        <p className="text-lg text-slate-400 leading-relaxed">
          At some point, security stops being something your engineers handle on the side. It becomes a topic in board meetings, investor calls, and customer due diligence.
        </p>
      </div>
      
      <div className="bento-grid">
        <div className="glass-card p-8">
          <h3 className="text-xl text-slate-50 mb-4">Audit Pressure</h3>
          <p className="text-slate-400 text-base leading-relaxed">
            SOC 2, ISO 27001, or industry certifications are suddenly on the roadmap. Someone needs to own the program, not just fill out questionnaires.
          </p>
        </div>
        <div className="glass-card p-8">
          <h3 className="text-xl text-slate-50 mb-4">Investor Scrutiny</h3>
          <p className="text-slate-400 text-base leading-relaxed">
            Your next funding round includes security due diligence. Investors want to see governance, not just firewalls. They expect someone accountable.
          </p>
        </div>
        <div className="glass-card p-8">
          <h3 className="text-xl text-slate-50 mb-4">Incident Response</h3>
          <p className="text-slate-400 text-base leading-relaxed">
            Something happened. Maybe a breach, maybe a close call. Now you need someone who can lead the response and fix what broke.
          </p>
        </div>
      </div>

      <div className="mt-16 glass-card p-8 md:p-12 max-w-3xl">
        <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
          These moments reveal a gap. You need someone senior enough to make decisions and communicate with executives. Not someone who writes reports and waits for approval.
        </p>
      </div>
    </div>
  </section>
);

// Offer Section
const OfferSection = () => (
  <section id="offer" className="py-24 md:py-32 bg-[#0a0f1a]" data-testid="offer-section">
    <div className="section-container">
      <div className="max-w-3xl mb-16">
        <p className="caption-text mb-4">The Offer</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-slate-50 mb-6">
          Fractional security leadership.
        </h2>
        <p className="text-lg text-slate-400 leading-relaxed">
          I serve as your Head of Security or CISO on a fractional basis. This means I hold decision authority, attend your executive meetings, and take accountability for outcomes.
        </p>
      </div>

      <div className="two-col-grid">
        <div>
          <div className="glass-card p-8 tracing-beam mb-6">
            <h3 className="text-xl text-slate-50 mb-4">First-line Ownership</h3>
            <p className="text-slate-400 leading-relaxed">
              I do not report findings and wait for someone else to act. I make decisions, set priorities, and own the results. Security becomes my responsibility, not a recommendation I hand over.
            </p>
          </div>
          <div className="glass-card p-8">
            <h3 className="text-xl text-slate-50 mb-4">Temporary by Design</h3>
            <p className="text-slate-400 leading-relaxed">
              This engagement replaces the need for a full-time CISO while you build capability or navigate a specific phase. When you are ready to hire permanently, I help with the transition.
            </p>
          </div>
        </div>
        <div className="glass-card p-8 md:p-10 flex flex-col justify-center">
          <p className="caption-text mb-6">What this replaces</p>
          <ul className="space-y-4 text-slate-300">
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-sky-400 mt-1 flex-shrink-0" />
              <span>A security leader seat in your org chart</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-sky-400 mt-1 flex-shrink-0" />
              <span>Executive-level security communication</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-sky-400 mt-1 flex-shrink-0" />
              <span>Board reporting and investor discussions</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="text-sky-400 mt-1 flex-shrink-0" />
              <span>Incident leadership when things go wrong</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

// How It Works Section
const HowItWorksSection = () => (
  <section id="approach" className="py-24 md:py-32" data-testid="approach-section">
    <div className="section-container">
      <div className="max-w-3xl mb-16">
        <p className="caption-text mb-4">How It Works</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-slate-50 mb-6">
          A clear engagement model.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card p-8">
          <p className="text-sky-400 text-sm font-medium mb-3">Structure</p>
          <h3 className="text-lg text-slate-50 mb-2">Retainer-based</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Monthly retainer with predictable costs. No surprises, no scope creep.
          </p>
        </div>
        <div className="glass-card p-8">
          <p className="text-sky-400 text-sm font-medium mb-3">Commitment</p>
          <h3 className="text-lg text-slate-50 mb-2">1 to 2 days per week</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Regular presence in your organization. Enough to lead, not just advise.
          </p>
        </div>
        <div className="glass-card p-8">
          <p className="text-sky-400 text-sm font-medium mb-3">Duration</p>
          <h3 className="text-lg text-slate-50 mb-2">3 to 6 month minimum</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Meaningful impact requires sustained engagement. Quick fixes do not work.
          </p>
        </div>
        <div className="glass-card p-8">
          <p className="text-sky-400 text-sm font-medium mb-3">Exit</p>
          <h3 className="text-lg text-slate-50 mb-2">Clear handover</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Defined exit conditions and transition plan. No dependency lock-in.
          </p>
        </div>
      </div>
    </div>
  </section>
);

// What I Do / Don't Do Section
const ScopeSection = () => (
  <section className="py-24 md:py-32 bg-[#0a0f1a]" data-testid="scope-section">
    <div className="section-container">
      <div className="two-col-grid">
        <div>
          <p className="caption-text mb-4">What I Do</p>
          <h2 className="text-2xl md:text-3xl text-slate-50 mb-8">
            Leadership, decisions, accountability.
          </h2>
          <ul className="check-list text-slate-300 space-y-4">
            <li>Define and own your security strategy</li>
            <li>Make risk decisions with executive authority</li>
            <li>Lead incident response from start to close</li>
            <li>Represent security to your board and investors</li>
            <li>Build and manage your security program</li>
            <li>Hire and develop your security team</li>
            <li>Communicate risk in business terms</li>
            <li>Own compliance programs and certifications</li>
          </ul>
        </div>
        <div>
          <p className="caption-text mb-4">What I Do Not Do</p>
          <h2 className="text-2xl md:text-3xl text-slate-50 mb-8">
            Explicit exclusions.
          </h2>
          <ul className="cross-list text-slate-400 space-y-4">
            <li>Assessment-only engagements without follow-through</li>
            <li>Checkbox compliance that ignores real risk</li>
            <li>Reporting without decision authority</li>
            <li>Second-line GRC work that duplicates your team</li>
            <li>Tool implementation or vendor management as primary focus</li>
            <li>Body leasing or staff augmentation</li>
          </ul>
          <div className="mt-10 p-6 border border-slate-800 rounded-xl">
            <p className="text-slate-400 text-sm leading-relaxed">
              If you need a penetration test, an audit, or someone to fill a seat temporarily, I am not the right fit. I work with clients who want a leader, not a consultant.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Pricing Section
const PricingSection = () => (
  <section className="py-24 md:py-32" data-testid="pricing-section">
    <div className="section-container">
      <div className="max-w-3xl mb-16">
        <p className="caption-text mb-4">Investment</p>
        <h2 className="text-3xl sm:text-4xl md:text-5xl text-slate-50 mb-6">
          Scope-based pricing.
        </h2>
        <p className="text-lg text-slate-400 leading-relaxed">
          Pricing reflects scope and complexity, not hours logged. Each engagement is scoped individually based on your organization size, risk profile, and objectives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="investment-card">
          <p className="text-slate-500 text-sm mb-2">Monthly Investment</p>
          <p className="text-3xl md:text-4xl text-slate-50 font-medium mb-4">EUR 8,000+</p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Typical range for growth-stage companies with existing security foundations. Includes regular executive presence and strategic leadership.
          </p>
        </div>
        <div className="investment-card">
          <p className="text-slate-500 text-sm mb-2">Higher Complexity</p>
          <p className="text-3xl md:text-4xl text-slate-50 font-medium mb-4">EUR 15,000+</p>
          <p className="text-slate-400 text-sm leading-relaxed">
            Regulated industries, larger organizations, or situations requiring intensive involvement such as incident response or M&A due diligence.
          </p>
        </div>
      </div>

      <p className="mt-10 text-slate-500 text-sm max-w-2xl">
        Day rates are not published. Pricing is discussed after an initial conversation to understand your specific situation and requirements.
      </p>
    </div>
  </section>
);

// Fit Section
const FitSection = () => (
  <section className="py-24 md:py-32 bg-[#0a0f1a]" data-testid="fit-section">
    <div className="section-container">
      <div className="two-col-grid">
        <div>
          <p className="caption-text mb-4">Who This Is For</p>
          <h2 className="text-2xl md:text-3xl text-slate-50 mb-8">
            Ideal client profiles.
          </h2>
          <ul className="check-list text-slate-300 space-y-4">
            <li>Series A to C companies ready to formalize security</li>
            <li>Regulated businesses facing compliance requirements</li>
            <li>Organizations navigating a security incident</li>
            <li>Companies preparing for acquisition or IPO</li>
            <li>Boards seeking security leadership without a full-time hire</li>
            <li>Founders who want a trusted security advisor</li>
          </ul>
        </div>
        <div>
          <p className="caption-text mb-4">Who This Is Not For</p>
          <h2 className="text-2xl md:text-3xl text-slate-50 mb-8">
            Not the right fit.
          </h2>
          <ul className="cross-list text-slate-400 space-y-4">
            <li>Early-stage startups without product-market fit</li>
            <li>Organizations seeking assessment-only work</li>
            <li>Companies looking for the cheapest option</li>
            <li>Teams that need hands-on technical implementation</li>
            <li>Situations where security reports to IT operations</li>
            <li>Engagements without executive sponsorship</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
);

// Contact Section
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`${API}/contact`, formData);
      setIsSubmitted(true);
      toast.success("Message sent successfully");
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32" data-testid="contact-section">
      <div className="section-container">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <p className="caption-text mb-4">Get in Touch</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl text-slate-50 mb-6">
              Start a conversation.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              A brief call to understand your situation. No pitch, no pressure. If there is a fit, we discuss next steps.
            </p>
          </div>

          <div className="contact-form-container">
            {isSubmitted ? (
              <div className="form-success" data-testid="form-success">
                <div className="form-success-icon">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl text-slate-50 mb-4">Message received.</h3>
                <p className="text-slate-400">
                  I will respond within two business days.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} data-testid="contact-form">
                <div className="space-y-6">
                  <div className="relative">
                    <User size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-minimal pl-8"
                      data-testid="input-name"
                    />
                  </div>
                  <div className="relative">
                    <Mail size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-minimal pl-8"
                      data-testid="input-email"
                    />
                  </div>
                  <div className="relative">
                    <Building2 size={18} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-600" />
                    <input
                      type="text"
                      name="company"
                      placeholder="Company (optional)"
                      value={formData.company}
                      onChange={handleChange}
                      className="input-minimal pl-8"
                      data-testid="input-company"
                    />
                  </div>
                  <div className="relative">
                    <MessageSquare size={18} className="absolute left-0 top-4 text-slate-600" />
                    <textarea
                      name="message"
                      placeholder="Tell me about your situation"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="input-minimal pl-8 resize-none"
                      data-testid="input-message"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full mt-8 flex items-center justify-center gap-2"
                  data-testid="submit-btn"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm mb-4">Or reach out directly</p>
            <a href="mailto:hello@example.com" className="text-slate-300 hover:text-slate-50 transition-colors hover-underline" data-testid="email-link">
              hello@example.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => (
  <footer className="footer py-12" data-testid="footer">
    <div className="section-container">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-slate-500" />
          <span className="logo-text text-base">[Your Name]</span>
        </div>
        <div className="flex items-center gap-8 text-sm text-slate-500">
          <span>[City], EU</span>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
            LinkedIn
          </a>
        </div>
        <p className="text-slate-600 text-sm">
          © 2024 All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

// Main Landing Page
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#020617]" data-testid="landing-page">
      <NoiseOverlay />
      <Navigation />
      <main>
        <HeroSection />
        <div className="section-divider" />
        <ProblemSection />
        <OfferSection />
        <HowItWorksSection />
        <ScopeSection />
        <PricingSection />
        <FitSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <Toaster position="top-right" theme="dark" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
