import React, { ErrorInfo } from 'react';

interface Props {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.log({ error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent != null) {
        return <>{this.props.fallbackComponent}</>;
      }

      return <div>문제가 발생했어요.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
