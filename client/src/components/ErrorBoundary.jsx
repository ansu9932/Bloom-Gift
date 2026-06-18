import { Component } from 'react';

// Catches render-time crashes anywhere in the tree so a thrown error shows a
// friendly fallback instead of a blank white screen.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong' };
  }

  componentDidCatch(error, info) {
    // Surface details in the console for debugging; never crash to a blank page.
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught an error:', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, message: '' });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback({ message: this.state.message, reset: this.handleReset });
      }
      return (
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
          <div className="text-5xl">🌧️</div>
          <h1 className="mt-4 font-display text-2xl text-bloom-green">Something went wrong</h1>
          <p className="mt-2 text-sm text-bloom-green/60">
            {this.state.message || 'An unexpected error occurred while rendering this page.'}
          </p>
          <div className="mt-6 flex gap-2">
            <button onClick={this.handleReset} className="btn-ghost py-2 text-sm">
              Try again
            </button>
            <a href="/" className="btn-primary py-2 text-sm">
              Back home
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
