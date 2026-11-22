
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.BETTER_AUTH_DB_URL);
const db = client.db("wedplan");

export const auth = betterAuth({
    emailAndPassword: {
        enabled: true,
        minPasswordLength: 6,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
    },

    user: {
        modelName: "users",

        additionalFields: {
            role: {
                type: ["Customer", "Vendor"],
                required: false,
                defaultValue: "Customer",
                input: true,
            },

            businessName: {
                type: "string",
                required: false,
                input: true,
            },
        },
    },

    databaseHooks: {
        user: {
            update: {
                before: async (user) => {
                    const protectedFields = [
                        "role",
                        "subscriptionPlan",
                        "subscriptionStatus",
                        "subscriptionExpiresAt",
                        "stripeCustomerId",
                        "stripeSubscriptionId",
                        "isBlocked",
                    ];

                    const isChangingProtectedField =
                        protectedFields.some((field) =>
                            Object.prototype.hasOwnProperty.call(user, field),
                        );

                    if (isChangingProtectedField) {
                        return false;
                    }

                    return { data: user };
                },
            },
        },
    },

    database: mongodbAdapter(db, {
        client,
    }),
});
