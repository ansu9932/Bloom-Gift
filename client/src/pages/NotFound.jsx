import { Link } from 'react-router-dom';
import FlowerGlyph from '../components/flowers/FlowerGlyph';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <FlowerGlyph color="#e8859a" type="BLOOM" size={96} />
      <h1 className="mt-4 font-display text-4xl text-bloom-green">404</h1>
      <p className="mt-2 text-bloom-green/60">This petal drifted away. The page you're looking for isn't here.</p>
      <Link to="/" className="btn-primary mt-6">Back home</Link>
    </div>
  );
}
