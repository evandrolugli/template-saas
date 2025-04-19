"use client";

import { useStripe } from "@/app/hooks/useStripe";

export default function Payments() {

    const { createPaymentStripeCheckout, createSubscriptionStripeCheckout, handleCreateStripePortal } = useStripe();

    return (
        <div className="flex flex-col gap-10 items-center justify-center h-screen">
            <h1 className="text-4x1 font-bold">Payments</h1>
            <button className="border rounded-md px-1" onClick={() => createPaymentStripeCheckout({ testId: "123" })}>
                Create Stripe Payment
            </button>
            <button className="border rounded-md px-1" onClick={() => createSubscriptionStripeCheckout({ testId: "123" })}>
                Create Stripe Subscription
            </button>
            <button className="border rounded-md px-1" onClick={() => handleCreateStripePortal}>
                Create Portal Payment
            </button>
        </div>
    )
}