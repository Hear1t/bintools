import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[BinTools] ErrorBoundary caught', error, info)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-10 py-16">
          <div className="w-full max-w-md space-y-5 text-center">
            <p className="font-serif text-3xl text-ink">渲染出错</p>
            <p className="text-sm text-ink-muted">
              发生了一个意外错误，应用没有崩溃。
              你可以重试，或者试试更小的数据。
            </p>
            {this.state.error && (
              <pre className="text-left text-xs text-ink-subtle bg-cream-200 rounded-md px-3 py-2 overflow-x-auto">
                {this.state.error.message}
              </pre>
            )}
            <button
              onClick={this.handleReset}
              className="h-9 px-4 rounded-md bg-terracotta text-cream text-sm font-medium hover:bg-terracotta-hover transition-colors"
            >
              重试
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
