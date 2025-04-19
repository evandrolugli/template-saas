import { useEffect, useState } from "react"
import { loadStripe, Stripe } from "@stripe/stripe-js"

export function useStripe(){

    const [stripe, setStripe] = useState<Stripe | null>(null)

    useEffect(() => {
        async function loadStripeAsync(){
            const stripeInstance = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUB_KEY!)
            setStripe(stripeInstance);
            console.log("Stripe loaded:", stripeInstance);
        }
        loadStripeAsync();
    }, [])

    async function createPaymentStripeCheckout(checkoutData: any){
        
        if (!stripe) {
            console.warn("Stripe not loaded yet");
            return;
        }

        try{
            const response = await fetch("/api/stripe/create-pay-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(checkoutData),
            })

            const data = await response.json();

            console.log(data)

            await stripe.redirectToCheckout({ sessionId: data.sessionId });

        } catch (error) {
            console.log(error);
        }
    };

    async function createSubscriptionStripeCheckout(checkoutData: any){
        if(!stripe) return;
            console.log(checkoutData)

        try{
            const response = await fetch("/api/stripe/create-subscription-checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(checkoutData),
            })

            // Check if the response is valid
            if (!response.ok) {
                const errorText = await response.json();
                console.error("Server error response:", errorText);
                return;
            }

            const data = await response.json();

            if (!data.sessionId) {
                console.error("Missing sessionId in response:", data);
                return;
            }

            await stripe.redirectToCheckout({ sessionId: data.sessionId });

        } catch (error) {
            console.error("Stripe checkout error:", error);
        }
    }

    async function handleCreateStripePortal(){
        const response = await fetch("/api/stripe/create-portal", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();
        
        window.location.href = data.url;
    }

    return {
        createPaymentStripeCheckout,
        createSubscriptionStripeCheckout,
        handleCreateStripePortal,
    };
}