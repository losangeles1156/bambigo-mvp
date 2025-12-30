'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center p-6 bg-white">
          <div className="max-w-md w-full space-y-4 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">糟了！系統發生錯誤</h2>
            <p className="text-sm font-bold text-slate-500 leading-relaxed">
              我們在載入頁面時遇到了一些問題。請嘗試重新整理頁面。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-8 py-3 rounded-2xl bg-slate-900 text-white font-black text-sm tracking-wide hover:bg-slate-800 transition-colors active:scale-[0.99]"
            >
              重新整理
            </button>
            {process.env.NODE_ENV !== 'production' && this.state.error && (
              <pre className="mt-8 p-4 bg-slate-50 rounded-xl text-left text-[10px] font-mono text-slate-400 overflow-auto max-h-40 border border-slate-100">
                {this.state.error.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
