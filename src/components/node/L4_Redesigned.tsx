'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { StationUIProfile } from '@/lib/types/stationStandard';
import { getLocaleString } from '@/lib/utils/localeUtils';
import { Sparkles, Send, User, Bot, Loader2, MapPin, Luggage, Wheelchair, Clock, DollarSign } from 'lucide-react';

interface L4_RedesignedProps {
    data: StationUIProfile;
    seedQuestion?: string;
    onSeedConsumed?: () => void;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

/**
 * 重新设计的L4界面 - 极简对话优先
 *
 * 设计原则：
 * 1. 对话优先 - 用户直接说出需求
 * 2. 极简主义 - 移除所有教学文字和复杂流程
 * 3. 情境感知 - 自动显示相关建议
 * 4. 渐进式展示 - 只在需要时显示高级选项
 */
export function L4_Redesigned({ data, seedQuestion, onSeedConsumed }: L4_RedesignedProps) {
    const tL4 = useTranslations('l4');
    const tCommon = useTranslations('common');
    const locale = useLocale();
    const { id: stationId, name } = data || {};

    // 简化的站点名称
    const displayName = (name?.zh && name?.zh !== '車站' && name?.zh !== 'Station')
        ? name.zh
        : (name?.en || name?.ja || (stationId?.split(':').pop()?.split('.').pop()) || tCommon('station'));

    // 核心状态
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const lastSeedQuestionRef = useRef<string>('');
    const [hasGreeted, setHasGreeted] = useState(false);

    // 初始欢迎消息
    useEffect(() => {
        if (displayName && !hasGreeted) {
            setMessages([{
                role: 'assistant',
                content: `嗨！我在 ${displayName}。你想去哪里？我可以为你查询路线、票价和时刻表。`
            }]);
            setHasGreeted(true);
        }
    }, [displayName, hasGreeted]);

    // 自动滚动到底部
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 发送消息
    const handleSend = useCallback(async (text: string) => {
        if (!text.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsLoading(true);

        try {
            // 构建用户profile（基于选中的需求）
            let userProfile = 'general';
            if (selectedNeeds.includes('wheelchair')) userProfile = 'wheelchair';
            else if (selectedNeeds.includes('luggage')) userProfile = 'luggage';

            const response = await fetch('/api/agent/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    nodeId: stationId,
                    inputs: {
                        user_profile: userProfile,
                        locale,
                        needs: selectedNeeds
                    }
                })
            });

            if (!response.ok) throw new Error('Network error');
            if (!response.body) throw new Error('No body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedResponse = '';

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.slice(6));
                            if (data.event === 'message') {
                                accumulatedResponse += data.answer;
                                setMessages(prev => {
                                    const newMsgs = [...prev];
                                    newMsgs[newMsgs.length - 1].content = accumulatedResponse;
                                    return newMsgs;
                                });
                            }
                        } catch (e) {
                            // Ignore parse errors
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Chat Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '抱歉，发生了错误。请稍后再试。'
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [isLoading, locale, messages, stationId, selectedNeeds]);

    // 处理种子问题
    useEffect(() => {
        const text = String(seedQuestion || '').trim();
        if (!text) return;
        if (!hasGreeted) return;
        if (isLoading) return;
        if (lastSeedQuestionRef.current === text) return;

        lastSeedQuestionRef.current = text;
        handleSend(text);
        onSeedConsumed?.();
    }, [seedQuestion, hasGreeted, isLoading, handleSend, onSeedConsumed]);

    // 简化的需求按钮（只保留最重要的4个）
    const needs = [
        { id: 'luggage', icon: Luggage, label: '大行李', color: 'blue' },
        { id: 'wheelchair', icon: Wheelchair, label: '无障碍', color: 'green' },
        { id: 'rush', icon: Clock, label: '赶时间', color: 'orange' },
        { id: 'budget', icon: DollarSign, label: '省钱', color: 'purple' }
    ];

    // 示例问题
    const exampleQuestions = [
        '去成田机场最快的路线',
        '到淺草的票价',
        '附近的置物櫃'
    ];

    // 获取最佳推荐卡片（如果有）
    const bestCard = data?.l4_cards?.find(c => c.type === 'primary') || data?.l4_cards?.[0];

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-slate-50 to-indigo-50/30 relative overflow-hidden">

            {/* 简化的顶部上下文指示器 */}
            <div className="bg-white/80 backdrop-blur-sm px-5 py-3 border-b border-indigo-100/50 shadow-sm">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
                        <MapPin size={16} className="text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800">{displayName}</h3>
                        <p className="text-[10px] text-slate-500 font-bold">ルタグ 智能助理</p>
                    </div>
                </div>
            </div>

            {/* 对话区域 */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide">

                {/* 智能推荐卡片（只在有明确建议时显示） */}
                {bestCard && (
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-3xl p-5 shadow-xl border border-white/20 animate-in fade-in slide-in-from-top-2 duration-500">
                        <div className="flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                                <div className="text-[9px] font-black uppercase tracking-wider text-white/60 mb-1.5">
                                    💡 智能推荐
                                </div>
                                <h4 className="text-base font-black text-white leading-snug mb-2">
                                    {getLocaleString(bestCard.title, locale)}
                                </h4>
                                <p className="text-xs font-medium text-white/90 leading-relaxed line-clamp-3">
                                    {getLocaleString(bestCard.description, locale)}
                                </p>
                            </div>
                        </div>
                        {bestCard.actionUrl && (
                            <button
                                onClick={() => window.open(bestCard.actionUrl, '_blank', 'noopener,noreferrer')}
                                className="mt-4 w-full py-2.5 bg-white/90 hover:bg-white text-indigo-700 rounded-xl font-black text-xs tracking-wide transition-all active:scale-[0.98] shadow-sm"
                            >
                                {getLocaleString(bestCard.actionLabel, locale) || '查看详情'}
                            </button>
                        )}
                    </div>
                )}

                {/* 对话消息 */}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-1 duration-300`}>
                        <div className={`max-w-[82%] rounded-2xl px-4 py-3 shadow-sm ${
                            msg.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-tr-md'
                                : 'bg-white text-slate-700 rounded-tl-md border border-slate-100'
                        }`}>
                            <div className="flex items-center gap-1.5 mb-1.5 opacity-60">
                                {msg.role === 'user' ? <User size={11} /> : <Bot size={11} />}
                                <span className="text-[9px] font-bold uppercase tracking-tight">
                                    {msg.role === 'user' ? '你' : 'ルタグ'}
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}

                {/* 加载指示器 */}
                {isLoading && (
                    <div className="flex justify-start animate-in fade-in duration-200">
                        <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100 flex items-center gap-2.5">
                            <Loader2 size={14} className="text-indigo-600 animate-spin" />
                            <span className="text-xs font-medium text-slate-500">正在思考...</span>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* 简化的输入区域 */}
            <div className="bg-white/90 backdrop-blur-sm border-t border-slate-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
                <div className="max-w-2xl mx-auto space-y-3">

                    {/* 需求快捷按钮（简化为4个图标） */}
                    {selectedNeeds.length > 0 || messages.length <= 1 ? (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide whitespace-nowrap">
                                特殊需求:
                            </span>
                            {needs.map(need => {
                                const isSelected = selectedNeeds.includes(need.id);
                                return (
                                    <button
                                        key={need.id}
                                        onClick={() => {
                                            setSelectedNeeds(prev =>
                                                isSelected
                                                    ? prev.filter(id => id !== need.id)
                                                    : [...prev, need.id]
                                            );
                                        }}
                                        disabled={isLoading}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                            isSelected
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-105'
                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                        }`}
                                    >
                                        <need.icon size={12} />
                                        <span>{need.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : null}

                    {/* 主输入框 */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="你想去哪里？"
                            value={input}
                            disabled={isLoading}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if ((e.nativeEvent as any)?.isComposing) return;
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSend(input);
                                }
                            }}
                            className="w-full pl-4 pr-12 py-3.5 bg-slate-100 border-2 border-transparent focus:border-indigo-400 focus:bg-white rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        <button
                            onClick={() => handleSend(input)}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl flex items-center justify-center transition-all disabled:cursor-not-allowed active:scale-95 shadow-sm"
                        >
                            {isLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <Send size={16} />
                            )}
                        </button>
                    </div>

                    {/* 示例问题提示（只在初始状态显示） */}
                    {messages.length <= 1 && !input && (
                        <div className="text-center animate-in fade-in duration-500">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">
                                💡 试试问我
                            </p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {exampleQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(q)}
                                        disabled={isLoading}
                                        className="text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
