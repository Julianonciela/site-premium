import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const ACCESS_CODE = import.meta.env.VITE_ACCESS_CODE || 'cabane2026';

function AuthGate({ children }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('cabane_auth') === 'true') {
      setAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input === ACCESS_CODE) {
      sessionStorage.setItem('cabane_auth', 'true');
      setAuthenticated(true);
    } else {
      setError(true);
      setInput('');
      setTimeout(() => setError(false), 3000);
    }
  };

  if (authenticated) return children;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F0E9E1]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center px-6 max-w-sm w-full"
      >
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full border-4 border-[#819b57] flex items-center justify-center">
            <Lock className="w-8 h-8 text-[#819b57]" />
          </div>
          <h1 className="text-3xl font-bold text-[#3F3733]" style={{ fontFamily: "'Playfair Display', serif" }}>
            La Cabane des Saveurs
          </h1>
          <p className="text-[#574e49] mt-2 text-sm">Site en construction</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Code d'accès"
            autoFocus
            className="w-full px-5 py-3.5 rounded-xl border-2 border-[#d5c9b5] bg-white text-[#3F3733] text-center text-lg focus:border-[#819b57] focus:outline-none transition-colors"
          />
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[#C1440E] text-sm font-semibold"
            >
              Code incorrect
            </motion.p>
          )}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#819b57] text-white rounded-xl font-semibold hover:bg-[#6b8248] transition-colors"
          >
            Accéder au site
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default AuthGate;
