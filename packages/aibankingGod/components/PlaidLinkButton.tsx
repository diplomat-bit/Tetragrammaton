import React, { useState, useEffect, useCallback } from 'react';
import { usePlaidLink, PlaidLinkOptions, PlaidLinkOnSuccess } from 'react-plaid-link';
import axios from 'axios';
import { Shield, Link as LinkIcon, CheckCircle, Loader2 } from 'lucide-react';

export interface PlaidLinkButtonProps {
    onSuccess: (accessToken: string, metadata: any) => void;
    className?: string;
    products?: string[];
    label?: string;
    disabled?: boolean;
}

const PlaidLinkButton: React.FC<PlaidLinkButtonProps> = ({ 
    onSuccess, 
    className = "", 
    label = "Connect Bank Account",
    disabled = false
}) => {
    const [linkToken, setLinkToken] = useState<string | null>(() => {
        return sessionStorage.getItem('plaid_link_token');
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const isOAuthRedirect = typeof window !== 'undefined' && (
        window.location.search.includes('oauth_state_id') ||
        window.location.search.includes('link_token')
    );

    const createLinkToken = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.post('/api/v1/plaid/create-link-token');
            const token = response.data.link_token;
            if (token) {
                setLinkToken(token);
                sessionStorage.setItem('plaid_link_token', token);
            }
        } catch (err: any) {
            console.error('Error creating link token:', err);
            setError('Failed to initialize bank connection. Please check your Plaid configuration.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!linkToken) {
            createLinkToken();
        }
    }, [linkToken, createLinkToken]);

    const onPlaidSuccess = useCallback<PlaidLinkOnSuccess>(async (public_token, metadata) => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/v1/plaid/exchange-public-token', { public_token, metadata });
            setIsSuccess(true);
            sessionStorage.removeItem('plaid_link_token');
            // Clean URL query string
            if (window.history.replaceState) {
                window.history.replaceState({}, document.title, window.location.pathname);
            }
            onSuccess(response.data.access_token, metadata);
        } catch (err: any) {
            console.error('Error exchanging public token:', err);
            setError('Failed to complete bank connection.');
        } finally {
            setIsLoading(false);
        }
    }, [onSuccess]);

    const config: PlaidLinkOptions = {
        token: linkToken,
        onSuccess: onPlaidSuccess,
        ...(isOAuthRedirect ? { receivedRedirectUri: window.location.href } : {}),
        onExit: (err, metadata) => {
            if (err) {
                console.error('Plaid Link Exit Error:', err);
                setError(err.display_message || 'Connection cancelled.');
            }
        },
    };

    const { open, ready } = usePlaidLink(config);

    return (
        <div className={`flex flex-col items-center gap-4 ${className}`}>
            <button
                onClick={() => open()}
                disabled={!ready || isLoading || disabled || isSuccess}
                className={`
                    relative group flex items-center gap-3 px-6 py-3 rounded-xl font-bold transition-all duration-300
                    ${isSuccess 
                        ? 'bg-green-600/20 text-green-400 border border-green-500/50 cursor-default' 
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
                    }
                `}
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : isSuccess ? (
                    <CheckCircle className="w-5 h-5" />
                ) : (
                    <LinkIcon className="w-5 h-5" />
                )}
                <span>{isSuccess ? 'Bank Connected' : isLoading ? 'Initializing...' : label}</span>
            </button>

            {error && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg border border-red-400/20">
                    <Shield className="w-4 h-4" />
                    <span>{error}</span>
                </div>
            )}

            {!linkToken && !isLoading && !error && (
                <button 
                    onClick={createLinkToken}
                    className="text-cyan-400 text-xs hover:underline"
                >
                    Retry initialization
                </button>
            )}
        </div>
    );
};

export default PlaidLinkButton;
