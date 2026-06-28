import { Component, type ErrorInfo, type ReactNode } from 'react';
import { WarningIcon } from '@phosphor-icons/react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      this.props.fallback ?? (
        <EmptyState
          icon={<WarningIcon size={28} weight="fill" />}
          title="Something went wrong"
          description="An unexpected error occurred while rendering this view. Try reloading the page."
          action={<Button onClick={() => window.location.reload()}>Reload</Button>}
        />
      )
    );
  }
}
