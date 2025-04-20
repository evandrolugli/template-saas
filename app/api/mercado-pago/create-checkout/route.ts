import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/app/lib/mercado-pago";

export async function POST(req: NextRequest){
    const { testId, userEmail } = await req.json();

    try {
        const preference = new Preference(mpClient)

        const createPreference = await preference.create({
            body: {
                external_reference: testId, // important to the rating points
                metadata: {
                    testId, // this var is converted to snake_case -> test_id
                    userEmail,
                },
                ...(userEmail && { payer: { email: userEmail}}), // important to the rating points
                items: [
                    {
                        id: "",
                        description: "",
                        title: "",
                        quantity: 1,
                        unit_price: 1,
                        currency_id: "BRL",
                        category_id: "services",
                    }
                ],
                payment_methods: {
                    installments: 12,
                    // excluded_payment_methods: [
                    //     {
                    //         id: "bolBradesco",
                    //     },
                    //     {
                    //         id: "pec",
                    //     },
                    // ],
                    // excluded_payment_types: [
                    //     {
                    //         id: "debit_card",
                    //     },
                    //     {
                    //         id: "credit_card",
                    //     },
                    // ],
                },
                auto_return: "approved",
                back_urls: {
                    success: `${req.headers.get("origin")}/api/mercado-pago/success`,
                    failure: `${req.headers.get("origin")}/api/mercado-pago/failure`,
                    pending: `${req.headers.get("origin")}/api/mercado-pago/pending`
                },
            }
        });

        if(!createPreference.id){
            return NextResponse.json({error: "Error due to create checkout with MercadoPago"}, {status: 500});
        }

        return NextResponse.json({
            preferenceId: createPreference.id,
            initPoint: createPreference.init_point,
        })

    } catch (error){
        console.error(error);
        return NextResponse.json({ error: "Error due to create checkout with MercadoPago" }, { status: 500});
    }
}