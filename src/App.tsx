import { useState, useCallback } from 'react';
import BackgroundParticles from './components/BackgroundParticles';
import Header from './components/Header';
import Hero from './components/Hero';
import SkinStudio from './components/SkinStudio';
import SeedVault from './components/SeedVault';
import MotdEditor from './components/MotdEditor';
import FpsBooster from './components/FpsBooster';
import CommunityCallout from './components/CommunityCallout';
import Footer from './components/Footer';
import ToastContainer from './components/Toast';
import CommunityModal from './components/CommunityModal';
import { ToastMessage } from './types';

export default function App() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeModal, setActiveModal] = useState<'discord' | 'youtube' | null>(null);

  const showToast = useCallback(
    (message: string, type: 'success' | 'info' | 'error' = 'success') => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3200);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleCopyServerIp = useCallback(
    (ip: string) => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(ip).then(() => {
          showToast(`Server IP "${ip}" copied! Ready to paste into Minecraft.`);
        });
      } else {
        showToast(`Server IP "${ip}" copied!`);
      }
    },
    [showToast]
  );

  const handleScrollTo = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen text-slate-100 font-sans antialiased overflow-x-hidden bg-[#070b14] bg-grid-pattern">
      {/* Background with Ambient Orbs and Interactive Particles */}
      <BackgroundParticles />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Global Sticky Navigation */}
      <Header
        onOpenDiscord={() => setActiveModal('discord')}
        onOpenSubscribe={() => setActiveModal('youtube')}
      />

      {/* Hero Section */}
      <Hero onCopyIp={handleCopyServerIp} onNavigate={handleScrollTo} />

      {/* Main Modules Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pb-28">
        <div className="flex flex-col w-full">
          {/* Module 01: Skin & Totem Compiler */}
          <SkinStudio onNotify={showToast} />

          {/* Module 02: World Generation Vault */}
          <SeedVault
            onCopySeed={(text, label) => {
              navigator.clipboard?.writeText(text);
              showToast(label);
            }}
          />

          {/* Module 03: MOTD & Chat Color Encoder */}
          <MotdEditor onNotify={showToast} />

          {/* Module 04: FPS Suite & JVM Flagging */}
          <FpsBooster onNotify={showToast} />
        </div>
      </main>

      {/* Community Discord & YouTube Banner */}
      <CommunityCallout
        onOpenDiscord={() => setActiveModal('discord')}
        onOpenYoutube={() => setActiveModal('youtube')}
      />

      {/* Global Footer */}
      <Footer onNavigate={handleScrollTo} />

      {/* Interactive Modal */}
      <CommunityModal
        type={activeModal}
        onClose={() => setActiveModal(null)}
        onNotify={showToast}
      />
    </div>
  );
}
