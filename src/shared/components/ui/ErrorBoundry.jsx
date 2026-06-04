import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.children !== this.props.children) {
      this.setState({ hasError: false, error: null });
    }
  }

  reset() {
    this.setState({ hasError: false, error: null });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '40vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <div style={{
            width: '56px', height: '56px', borderRadius: '50%',
            background: 'rgba(229,62,62,0.10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px',
          }}>
            ⚠️
          </div>

          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text-main)', margin: 0 }}>
            Something went wrong
          </h2>

          {this.state.error?.message && (
            <p style={{
              fontSize: '0.8rem', color: 'var(--color-text-light)',
              background: 'var(--color-surface)', border: '1px solid var(--color-border)',
              borderRadius: '10px', padding: '8px 16px',
              maxWidth: '420px', wordBreak: 'break-word', margin: 0,
            }}>
              {this.state.error.message}
            </p>
          )}

          <button
            onClick={this.reset}
            className="btn-primary"
            style={{ marginTop: '4px', fontSize: '0.875rem' }}
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}