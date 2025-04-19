import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/firebase";
import stripe from "@/app/lib/stripe";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) {
        return NextResponse.json({error: "Unauthorized"}, { status: 410});
    }

    try{
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if(!userDoc.exists){
            return NextResponse.json({ error: "User not found"}, { status: 404 });
        }

        const customerId = userDoc.data()?.stripeCustomerId;

        if(!customerId){
            return NextResponse.json({ error: "Customer not found"}, { status: 404 });
        }

        const origin = req.headers.get("origin") || "http://localhost:3000";

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${origin}/dashboard`,
        })

        return NextResponse.json({ url: portalSession.url }, { status: 200 });

    } catch (error) {
        console.error("Error creating Stripe portal:", error);
        return NextResponse.json(
            { error: "Portal creation failed", details: (error as Error).message },
            { status: 500 }
        );
    }
}