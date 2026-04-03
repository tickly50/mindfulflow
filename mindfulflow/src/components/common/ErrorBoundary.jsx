import React from 'react';
import { devError } from '../../utils/devLog';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    devError('Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] flex items-center justify-center p-8 text-white text-center">
          <div className="max-w-md">
            <div className="text-5xl mb-4">😵</div>
            <h2 className="text-2xl font-bold mb-3">Něco se pokazilo</h2>
            <p className="text-white/60 mb-6 text-sm leading-relaxed">
              Došlo k neočekávané chybě. Zkus stránku znovu načíst.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition-colors"
            >
              Znovu načíst
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
