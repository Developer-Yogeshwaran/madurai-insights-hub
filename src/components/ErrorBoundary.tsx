import * as React from 'react';

type State = { hasError: boolean; error?: Error };

export default class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    // You could log to an error reporting service here
    // console.error('ErrorBoundary caught', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border rounded bg-red-50">
          <h3 className="text-lg font-semibold">Something went wrong</h3>
          <div className="text-sm text-muted-foreground mt-2">{String(this.state.error)}</div>
        </div>
      );
    }
    return this.props.children as any;
  }
}
