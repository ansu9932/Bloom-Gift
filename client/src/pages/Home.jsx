import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PetalField from '../components/preview/PetalField';
import FlowerGlyph from '../components/flowers/FlowerGlyph';
import { cards, notebooks, misc } from '../data/surfaces';
import { fadeUp, stagger } from '../utils/animations';

const steps = [
  { n: '01', title: 'Pick your flowers', text: 'Compose a bouquet from hundreds of blooms — drag, scale, and arrange.' },
  { n: '02', title: 'Add your message', text: 'Choose surfaces, write notes, add photos, music, and a secret PIN.' },
  { n: '03', title: 'Share a private link', text: 'Send a link. They open it, enter the PIN, and the gift unfolds.' },
];

const galleryTags = {
  card: 'CARD · REVEAL',
  notebook: 'NOTEBOOK · PAGES',
  misc: 'MISC · SCREEN',
};

function GalleryCard({ surface }) {
  const tone =
    surface.kind === 'card'
      ? 'from-indigo-300 to-purple-500'
      : surface.kind === 'notebook'
      ? 'from-amber-200 to-amber-400'
      : 'from-teal-300 to-cyan-500';
  return (
    <div className="w-44 shrink-0">
      <div className={`grid aspect-[3/4] place-items-center rounded-2xl bg-gradient-to-br ${tone} text-4xl shadow`}>
        {surface.kind === 'notebook' ? '📓' : surface.kind === 'misc' ? '🌌' : '💌'}
      </div>
      <p className="mt-2 text-sm font-medium text-bloom-green">{surface.name}</p>
      <p className="text-[10px] font-semibold tracking-wide text-bloom-green/40">{galleryTags[surface.kind]}</p>
    </div>
  );
}

export default function Home() {
  const gallery = [...cards.slice(0, 6), ...notebooks.slice(0, 3), ...misc.slice(0, 4)];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-bloom-blush/40 to-bloom-cream" />
        <PetalField palette="pink" count={22} />
        <div className="relative mx-auto max-w-4xl px-4 py-24 text-center sm:py-32">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} className="mx-auto mb-6 flex justify-center gap-2">
              {['#e8859a', '#c9a84c', '#5fa66a'].map((c) => (
                <FlowerGlyph key={c} color={c} type="BLOOM" size={52} withStem={false} />
              ))}
            </motion.div>
            <motion.h1 variants={fadeUp} className="font-display text-5xl leading-tight text-bloom-green sm:text-6xl">
              Send flowers that<br />last forever.
            </motion.h1>
            <motion.p variants={fadeUp} className="mx-auto mt-5 max-w-xl text-lg text-bloom-green/70">
              Compose a private animated gift. Share a link. No app needed.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/compose" className="btn-primary text-base">Compose a Gift →</Link>
              <Link to="/flowers" className="btn-ghost text-base">Browse flowers</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 py-20">
        <h2 className="text-center font-display text-3xl text-bloom-green">How it works</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-surface p-6"
            >
              <span className="font-display text-4xl text-bloom-gold">{s.n}</span>
              <h3 className="mt-2 font-display text-xl text-bloom-green">{s.title}</h3>
              <p className="mt-2 text-sm text-bloom-green/60">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Surface gallery */}
      <section className="bg-white/50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl text-bloom-green">Beautiful surfaces</h2>
            <Link to="/compose" className="text-sm font-semibold text-bloom-gold">See them all →</Link>
          </div>
          <div className="no-scrollbar mt-6 flex gap-4 overflow-x-auto pb-3">
            {gallery.map((s) => (
              <GalleryCard key={s.id} surface={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="mx-auto max-w-4xl px-4 py-20 text-center">
        <h2 className="font-display text-3xl text-bloom-green">Everything, for everyone — free</h2>
        <p className="mt-2 text-bloom-green/60">
          Unlimited blooms, every surface, scratch reveal, voice notes, music & more. No plans, no paywalls.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/compose" className="btn-primary">Compose a gift</Link>
          <Link to="/flowers" className="btn-ghost">Browse flowers</Link>
        </div>
      </section>
    </div>
  );
}
