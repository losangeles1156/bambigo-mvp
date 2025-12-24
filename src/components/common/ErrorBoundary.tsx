'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(_: Error): State {
        return { hasError: true };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="p-4 m-4 bg-red-50 border border-red-100 rounded-xl text-center">
                    <h4 className="text-xs font-bold text-red-800 uppercase tracking-widest mb-1">Error</h4>
                    <p className="text-[10px] text-red-600">Component failed to load.</p>
                </div>
            );
        }

        return this.props.children;
    }
}
