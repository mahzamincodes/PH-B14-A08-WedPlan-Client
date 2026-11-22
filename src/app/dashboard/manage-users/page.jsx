
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import ManageUsersList from "@/components/admin/ManageUsersList";

export default async function ManageUsersPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    if (session.user.role !== "Admin") {
        redirect("/dashboard");
    }

    return (
        <div className="space-y-6">
            <ManageUsersList />
        </div>
    );
}
