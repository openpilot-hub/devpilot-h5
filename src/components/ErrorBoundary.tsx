import React, { Component, ReactNode } from 'react';
// import VConsole from 'vconsole';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  count: number;
  error?: Error;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // private vConsole: VConsole | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      count: 0,
    };
    // this.vConsole = new VConsole();
    // this.vConsole.hideSwitch();
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
      count: 0,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught in ErrorBoundary:', error, errorInfo);
    setTimeout(() => {
      throw error; // 抛出，让六翼捕获到
    }, 0);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{ color: '#f87171', padding: '10px', margin: '0px' }}
          onClick={() => {
            this.setState({ count: this.state.count + 1 });
            // if (this.state.count >= 10 && this.vConsole && this.state.hasError) {
            //   this.vConsole.showSwitch();
            // }
          }}
        >
          <h2>Ops, something went wrong!</h2>
          <div style={{ padding: '8px 0' }}>Please screenshot this and contact the developer.</div>
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            <code>{this.state.error?.stack}</code>
          </pre>
          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <button onClick={() => this.setState({ hasError: false })}>Ignore and continue</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
