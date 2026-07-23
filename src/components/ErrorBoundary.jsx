import { Component } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center gap-3 py-8 text-center bg-parchment-200/30 rounded-card">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <p className="text-sm text-parchment-700">
              {this.props.fallbackMessage || 'Something went wrong loading this section.'}
            </p>
            <button
              onClick={this.handleRetry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                         text-parchment-700 bg-white border border-parchment-300 rounded-lg
                         hover:bg-parchment-100 transition-colors"
            >
              <RefreshCw size={12} />
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
