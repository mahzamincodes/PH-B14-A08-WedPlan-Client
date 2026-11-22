
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileSettingsForm from "@/components/profile/ProfileSettingsForm";

export default async function ProfileSettingsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/sign-in");
    }

    const user = session.user;

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-10">
            <div className="mx-auto max-w-3xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900">
                        Profile Settings
                    </h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Manage and update your personal profile information.
                    </p>
                </div>

                <ProfileSettingsForm user={user} />
            </div>
        </main>
    );
}
