import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '40px',
          maxWidth: '800px',
          margin: '0 auto',
          fontFamily: 'system-ui, sans-serif'
        }}>
          <h1 style={{ color: '#ef4444', marginBottom: '20px' }}>
            ⚠️ Something went wrong
          </h1>
          <div style={{
            background: '#fee2e2',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h2 style={{ fontSize: '18px', marginBottom: '10px' }}>Error:</h2>
            <pre style={{
              background: 'white',
              padding: '12px',
              borderRadius: '4px',
              overflow: 'auto',
              fontSize: '14px'
            }}>
              {this.state.error && this.state.error.toString()}
            </pre>
          </div>
          {this.state.errorInfo && (
            <details style={{ marginTop: '20px' }}>
              <summary style={{ cursor: 'pointer', fontWeight: '600' }}>
                Stack trace
              </summary>
              <pre style={{
                background: '#f9fafb',
                padding: '12px',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '12px',
                marginTop: '10px'
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
