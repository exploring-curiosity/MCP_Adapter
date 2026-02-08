'use client'

import { useBilling } from '@flowglad/nextjs'
import { useState } from 'react'
import { useCredits } from '@/lib/use-credits'
import { Coins, Loader2, Plus, Sparkles, AlertCircle } from 'lucide-react'

interface BillingButtonProps {
    className?: string
    showBalance?: boolean
}

export function BillingButton({
    className = '',
    showBalance = true,
}: BillingButtonProps) {
    const { balance } = useCredits()
    const {
        createCheckoutSession,
        loaded: flowgladLoaded,
        pricingModel,
    } = useBilling()
    const [isLoading, setIsLoading] = useState(false)
    const [showPurchase, setShowPurchase] = useState(false)

    // Check if Flowglad has products configured — filter out the default free product
    const products = (pricingModel?.products || []).filter(
        (p: any) => !p.default && p.slug !== 'free'
    )
    const firstProduct = products[0]
    const firstPrice = firstProduct?.defaultPrice ?? firstProduct?.prices?.[0]
    const hasFlowgladProducts = flowgladLoaded && products.length > 0 && !!firstPrice?.slug

    const handlePurchase = async () => {
        if (!hasFlowgladProducts) return
        setIsLoading(true)
        try {
            // Direct fetch to bypass SDK client-side issues
            const res = await fetch('/api/flowglad/checkout-sessions/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    priceSlug: firstPrice.slug,
                    successUrl: `${window.location.origin}/credits/success`,
                    cancelUrl: window.location.href,
                    type: 'product',
                }),
            })
            const json = await res.json()
            if (json.data?.url) {
                window.location.href = json.data.url
            } else {
                console.error('[BillingButton] Checkout failed:', json)
            }
        } catch (err) {
            console.error('[BillingButton] Purchase error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`relative ${className}`}>
            {/* Credit balance + buy button */}
            <button
                onClick={() => setShowPurchase(!showPurchase)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-border/50 hover:border-primary/40 transition-colors text-sm"
            >
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-bold text-foreground">{balance}</span>
                <span className="text-muted-foreground text-xs">credits</span>
            </button>

            {/* Purchase dropdown */}
            {showPurchase && (
                <div className="absolute right-0 top-full mt-2 w-72 p-4 rounded-xl card-glass border border-border/50 shadow-2xl z-50 space-y-3">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-foreground">Buy Credits</h4>
                        <span className="text-xs text-muted-foreground">
                            Balance: <strong className="text-foreground">{balance}</strong>
                        </span>
                    </div>

                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 space-y-1">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-primary" />
                                100 Credits
                            </span>
                            <span className="text-sm font-bold text-primary">$10.00</span>
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                            1 credit per API tool generated into MCP
                        </p>
                    </div>

                    {hasFlowgladProducts ? (
                        <button
                            onClick={handlePurchase}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold text-sm transition-all disabled:opacity-50"
                        >
                            {isLoading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Redirecting to checkout...</>
                            ) : (
                                <><Plus className="w-4 h-4" /> Buy 100 Credits — $10.00</>
                            )}
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            <p className="text-[10px] text-amber-400/80">
                                {flowgladLoaded
                                    ? 'No products configured in Flowglad. Set up a product in your Flowglad dashboard.'
                                    : 'Loading checkout...'}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
