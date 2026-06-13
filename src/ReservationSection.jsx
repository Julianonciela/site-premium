import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Calendar, Clock, Users, Send } from 'lucide-react';

const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbcwCuNIgKbCHQgFS4ezj7zDFROh2g8SlrIMzA46In7RVDBH-YsGpujr3YbxJgiPxg_Ex/exec';

function ReservationSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [status, setStatus] = useState(null); // null | 'sending' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));

    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        mode: 'no-cors'
      });
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <section ref={ref} className="py-28 bg-white" id="reserver">
      <div className="container mx-auto px-6 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[#819b57] font-semibold tracking-[0.3em] uppercase text-xs mb-4">Réservez votre table</p>
          <h2 className="text-4xl md:text-5xl text-[#3F3733]" style={{ fontFamily: "'Playfair Display', serif" }}>
            Une table vous attend
          </h2>
        </motion.div>

        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <p className="text-6xl mb-6">🎉</p>
            <h3 className="text-2xl font-bold text-[#3F3733] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Réservation envoyée !</h3>
            <p className="text-[#574e49] text-lg">Nous vous confirmerons par téléphone sous 24h.</p>
            <button onClick={() => setStatus(null)} className="mt-8 px-8 py-3 bg-[#819b57] text-white rounded-full font-medium hover:bg-[#6b8248] transition-colors">
              Nouvelle réservation
            </button>
          </motion.div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-[#F0E9E1] rounded-3xl p-8 md:p-12 shadow-xl space-y-6"
          >
            {/* Nom + Téléphone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#3F3733] mb-2" htmlFor="resa-nom">Nom complet *</label>
                <input id="resa-nom" name="nom" type="text" required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#d5c9b5] bg-white focus:border-[#819b57] focus:outline-none transition-colors text-[#3F3733]"
                  placeholder="Marie Dupont" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#3F3733] mb-2" htmlFor="resa-tel">Téléphone *</label>
                <input id="resa-tel" name="telephone" type="tel" required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#d5c9b5] bg-white focus:border-[#819b57] focus:outline-none transition-colors text-[#3F3733]"
                  placeholder="06 12 34 56 78" />
              </div>
            </div>

            {/* Date + Heure */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#3F3733] mb-2" htmlFor="resa-date">
                  <Calendar className="w-4 h-4 inline mr-2 text-[#819b57]" />Date *
                </label>
                <input id="resa-date" name="date" type="date" required min="2026-04-18"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#d5c9b5] bg-white focus:border-[#819b57] focus:outline-none transition-colors text-[#3F3733]" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#3F3733] mb-2" htmlFor="resa-heure">
                  <Clock className="w-4 h-4 inline mr-2 text-[#819b57]" />Heure *
                </label>
                <select id="resa-heure" name="heure" required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#d5c9b5] bg-white focus:border-[#819b57] focus:outline-none transition-colors text-[#3F3733] appearance-none">
                  <option value="" disabled selected>Choisir un horaire</option>
                  <optgroup label="Déjeuner">
                    <option value="12:00">12h00</option>
                    <option value="12:30">12h30</option>
                    <option value="13:00">13h00</option>
                  </optgroup>
                  <optgroup label="Dîner">
                    <option value="19:00">19h00</option>
                    <option value="19:30">19h30</option>
                    <option value="20:00">20h00</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Couverts + Message */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-[#3F3733] mb-2" htmlFor="resa-couverts">
                  <Users className="w-4 h-4 inline mr-2 text-[#819b57]" />Couverts *
                </label>
                <select id="resa-couverts" name="couverts" required
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#d5c9b5] bg-white focus:border-[#819b57] focus:outline-none transition-colors text-[#3F3733] appearance-none">
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1} personne{i > 0 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#3F3733] mb-2" htmlFor="resa-occasion">Occasion</label>
                <select id="resa-occasion" name="occasion"
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#d5c9b5] bg-white focus:border-[#819b57] focus:outline-none transition-colors text-[#3F3733] appearance-none">
                  <option value="Aucune">Aucune occasion particulière</option>
                  <option value="Anniversaire">Anniversaire</option>
                  <option value="Famille">Repas de famille</option>
                  <option value="Groupe">Sortie de groupe</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold text-[#3F3733] mb-2" htmlFor="resa-message">Message</label>
              <textarea id="resa-message" name="message" rows="3"
                className="w-full px-4 py-3 rounded-xl border-2 border-[#d5c9b5] bg-white focus:border-[#819b57] focus:outline-none transition-colors text-[#3F3733] resize-none"
                placeholder="Allergie, chaise bébé, table en terrasse…" />
            </div>

            {status === 'error' && (
              <p className="text-[#C1440E] text-sm font-semibold text-center">Une erreur est survenue. Veuillez réessayer ou nous appeler.</p>
            )}

            <button type="submit" disabled={status === 'sending'}
              className="w-full py-4 bg-[#819b57] text-white rounded-full font-semibold text-lg hover:bg-[#6b8248] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {status === 'sending' ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Send className="w-5 h-5" /> Confirmer la réservation</>
              )}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  );
}

export default ReservationSection;
