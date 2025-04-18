import { auth } from "@/app/lib/auth";

import { handleAuth } from "@/app/actions/handle-auth";
import { redirect } from "next/navigation"
import Link from "next/link";

export default async function Dashboard() {

    const session = await auth();
    if (!session) {
        redirect("/login");
    }

    return (
        <div className="flex flex-col gap-10 items-center justify-center h-screen">
            <h1 className="text-4x1 font-bold">Protected Dashboard</h1>
            <p>
                {session?.user?.email ? session?.user?.email : "User is not logged"}
            </p>
            {session?.user?.email && (
                <form action={handleAuth}>
                    <button type="submit" className="border rounded-md px-2 py-1 cursor-pointer">
                        Logout
                    </button>
                </form>
            )}
            <Link href="/payments">Payments</Link>
        </div>
    );
}