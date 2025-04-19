import { db } from "@/app/lib/firebase";
import stripe from "@/app/lib/stripe";
import { NextResponse } from "next/server";
import "server-only"

export async function getOrCreateCustomer(userId: string, userEmail: string){
    try {
        const userRef = db.collection("users").doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists){
            // return NextResponse.json({ error : "User not found"}, { status: 404});
            throw new Error("User not found");
        }

        const stripeCustomerId = userDoc.data()?.stripeCustomerId;

        if(stripeCustomerId){
            return stripeCustomerId
        }

        const userName = userDoc.data()?.name;

        const stripeCustomer = await stripe.customers.create({
            email: userEmail,
            ...(userName && { name: userName }),
            metadata: {
                userId,
            }
        });

        await userRef.update({
            stripeCustomerId: stripeCustomer.id,
        });

        return stripeCustomer.id;
    } catch(error) {
        console.error("Error in getOrCreateCustomer:", error);
        throw new Error("Failed to get or create customer");
    }
}