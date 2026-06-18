import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';

const links = [
  { to: '/', label: 'Home' },
  { to: '/flowers', label: 'Flowers' },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-bloom-green text-bloom-cream">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <circle cx="12" cy="9" r="3" fill="#e8b4b8" />
          <circle cx="8" cy="11" r="2.4" fill="#c9a84c" />
          <circle cx="16" cy="11" r="2.4" fill="#c9a84c" />
          <circle cx="12" cy="13" r="2.4" fill="#f9e4e7" />
          <path d="M12 14 q-1 4 0 8" stroke="#9ec79e" strokeWidth="1.4" fill="none" />
        </svg>
      </span>
      <span className="font-display text-xl font-semibold text-bloom-green">BloomGift</span>
    </Link>
  );
}

export default function Navbar() {
  const { isAuthed, user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-bloom-green/10 bg-bloom-cream/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActive ? 'text-bloom-green' : 'text-bloom-green/60 hover:text-bloom-green'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthed ? (
            <>
              <Link to="/dashboard" className="btn-ghost py-2 text-sm">
                {user?.username || 'Dashboard'}
              </Link>
              <button onClick={handleLogout} className="text-sm text-bloom-green/60 hover:text-bloom-green">
                Log out
              </button>
              <Link to="/compose" className="btn-primary py-2 text-sm">
                Compose →
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-bloom-green/70 hover:text-bloom-green">
                Log in
              </Link>
              <Link to="/compose" className="btn-primary py-2 text-sm">
                Compose a Gift →
              </Link>
            </>
          )}
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-lg text-bloom-green md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </nav>

      {open && (
        <div className="border-t border-bloom-green/10 bg-bloom-cream px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2 text-bloom-green/80 hover:bg-bloom-green/5"
              >
                {l.label}
              </NavLink>
            ))}
            <div className="my-2 h-px bg-bloom-green/10" />
            {isAuthed ? (
              <>
                <Link to="/dashboard" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-bloom-green/80">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="rounded-lg px-3 py-2 text-left text-bloom-green/80">
                  Log out
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-bloom-green/80">
                Log in
              </Link>
            )}
            <Link to="/compose" onClick={() => setOpen(false)} className="btn-primary mt-2">
              Compose a Gift →
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
