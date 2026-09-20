
// components/RewardsView.tsx
import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { DataContext } from '../context/DataContext';
import Card from './Card';
import { RewardItem } from '../types';
import { callGemini, Type } from '../services/geminiService';

const REWARD_ICONS: { [key: string]: React.FC<{ className?: string }> } = {
    cash: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>,
    gift: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4H5z" /></svg>,
    leaf: ({ className }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

// ================================================================================================
// NEW "MILLION DOLLAR" AI COMPONENT: AI PERSONALIZED REWARDS
// ================================================================================================
const AIPersonalizedRewards: React.FC = () => {
    const context = useContext(DataContext);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const generateRecommendations = async () => {
            if (!context) return;

            setIsLoading(true);
            setError(null);
            try {
                const transactionSummary = context.transactions.slice(0, 20).map(t => `${t.description} (${t.category})`).join(', ');
                const rewardOptions = context.rewardItems.map(r => `${r.name} (${r.cost} points, type: ${r.type})`).join('; ');

                const prompt = `You are the Sovereign OS Rewards Optimization Engine. Based on this transaction history, recommend the top 2 most relevant rewards. 
                
                User Transactions: ${transactionSummary}
                Available Rewards: ${rewardOptions}
                
                Format the response as a JSON object with a single key "recommendations", which is an array of objects. Each object should have "rewardName" and "reason" keys.`;

                const response = await callGemini('gemini-3.6-flash', prompt, {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            recommendations: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        rewardName: { type: Type.STRING },
                                        reason: { type: Type.STRING }
                                    },
                                    required: ["rewardName", "reason"]
                                }
                            }
                        },
                        required: ["recommendations"]
                    }
                });
                
                let parsedResponse;
                try {
                    parsedResponse = JSON.parse(response.text || '{"recommendations": []}');
                } catch (e) {
                    console.error("JSON Parse Error in Rewards:", e);
                    // Handle case where text might be nested differently or is already an object
                    parsedResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text 
                        ? JSON.parse(response.data.candidates[0].content.parts[0].text)
                        : { recommendations: [] };
                }

                const enrichedRecommendations = (parsedResponse.recommendations || []).map((rec: any) => {
                    const matchedItem = context.rewardItems.find(item => item.name.toLowerCase() === rec.rewardName.toLowerCase());
                    return { ...rec, ...matchedItem };
                });
                setRecommendations(enrichedRecommendations);
            } catch (err: any) {
                console.error("AI Recommendation Error:", err);
                setError(err.message || "Failed to synthesize recommendations");
                // Fallback on error
                setRecommendations([{ title: "Analysis Incomplete", description: "Could not generate personalized recommendations at this time." }]);
            } finally {
                setIsLoading(false);
            }
        };

        generateRecommendations();
    }, [context]);

    if (isLoading) {
        return <p className="text-gray-400 italic">AI is analyzing your spending habits for personalized rewards...</p>
    }

    if (error) {
        return (
            <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
                <p className="font-bold uppercase tracking-widest mb-1">Strategic Synthesis Interrupted</p>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {recommendations.map((rec, index) => {
                const Icon = rec.iconName ? REWARD_ICONS[rec.iconName] : REWARD_ICONS.gift;
                return (
                    <div key={index} className="p-4 bg-indigo-900/30 rounded-lg border border-indigo-700">
                        <div className="flex items-start space-x-3">
                             <div className="w-10 h-10 flex-shrink-0 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-300">
                                <Icon className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">{rec.rewardName || rec.title}</h4>
                                <p className="text-sm text-gray-300 italic">"{rec.reason || rec.description}"</p>
                                {rec.cost && <p className="text-xs text-indigo-300 mt-1">{rec.cost.toLocaleString()} points</p>}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};


const RewardsView: React.FC = () => {
    const context = useContext(DataContext);
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    if (!context) {
        throw new Error("RewardsView must be used within a DataProvider");
    }

    // rewardPoints is now available in context
    const { rewardPoints, rewardItems, redeemReward } = context;

    const [isBuying, setIsBuying] = useState(false);

    const handleBuyPoints = async (amount: number, priceId: string) => {
        setIsBuying(true);
        try {
            const response = await axios.post('/api/v1/stripe/create-checkout-session', { priceId });
            if (response.data.url) {
                window.location.href = response.data.url;
            }
        } catch (error) {
            console.error("Stripe Checkout Error:", error);
            setNotification({ type: 'error', message: "Failed to initiate purchase. Please check your Stripe configuration." });
        } finally {
            setIsBuying(false);
        }
    };

    const handleRedeem = (item: RewardItem) => {
        const success = redeemReward(item);
        if (success) {
            setNotification({ type: 'success', message: `Successfully redeemed "${item.name}"!` });
        } else {
            setNotification({ type: 'error', message: `Not enough points to redeem "${item.name}".` });
        }
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white tracking-wider">Rewards Hub</h2>

            {notification && (
                <div className={`p-4 rounded-lg text-white ${notification.type === 'success' ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
                    {notification.message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card title="Your Points Balance" isMetric>
                    <p className="text-5xl font-bold text-cyan-400">{rewardPoints.balance.toLocaleString()}</p>
                    <p className="text-gray-400">{rewardPoints.currency}</p>
                    <div className="mt-4 flex gap-2">
                        <button 
                            onClick={() => handleBuyPoints(1000, 'price_1000_pts')}
                            disabled={isBuying}
                            className="text-xs bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-1 rounded transition-colors disabled:opacity-50"
                        >
                            {isBuying ? 'Processing...' : '+1,000 Pts ($10)'}
                        </button>
                    </div>
                </Card>
                <Card title="Last Earned" isMetric>
                    <p className="text-5xl font-bold text-green-400">+{rewardPoints.lastEarned.toLocaleString()}</p>
                     <p className="text-gray-400">{rewardPoints.currency}</p>
                </Card>
                <Card title="Last Redeemed" isMetric>
                    <p className="text-5xl font-bold text-red-400">-{rewardPoints.lastRedeemed.toLocaleString()}</p>
                     <p className="text-gray-400">{rewardPoints.currency}</p>
                </Card>
            </div>
            
            <Card title="AI Personalized For You">
                <AIPersonalizedRewards />
            </Card>

            <Card title="Redeem Your Points">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rewardItems.map(item => {
                        const Icon = REWARD_ICONS[item.iconName] || REWARD_ICONS.gift;
                        const canAfford = rewardPoints.balance >= item.cost;
                        return (
                            <Card key={item.id} variant="interactive" className={`flex flex-col ${!canAfford ? 'opacity-50' : ''}`}>
                                <div className="flex-grow">
                                    <div className="flex justify-center mb-4">
                                        <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center text-cyan-300">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white text-center">{item.name}</h3>
                                    <p className="text-sm text-gray-400 text-center mt-2 h-16">{item.description}</p>
                                    <p className="text-2xl font-bold text-cyan-400 text-center mt-4">{item.cost.toLocaleString()} points</p>
                                </div>
                                <button
                                    onClick={() => handleRedeem(item)}
                                    disabled={!canAfford}
                                    className="w-full mt-6 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
                                >
                                    {canAfford ? 'Redeem' : 'Not enough points'}
                                </button>
                            </Card>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
};

export default RewardsView;
