import { Link } from 'react-router-dom';

const VARIANTS = {
  primary: 'btn-primary',
  gold: 'btn-gold',
  ghost: 'btn-ghost',
};

// Polymorphic button: renders an <a> via react-router when `to` is provided,
// otherwise a native <button>.
export default function Button({
  variant = 'primary',
  to,
  href,
  className = '',
  children,
  ...props
}) {
  const cls = `${VARIANTS[variant] || VARIANTS.primary} ${className}`.trim();
  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
