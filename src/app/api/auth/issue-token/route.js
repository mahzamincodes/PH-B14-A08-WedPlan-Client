
import { auth } from "@/lib/auth";
import { createHmac } from "crypto";

/** Default token lifetime: 15 minutes (900 seconds). */
const DEFAULT_TTL_SECONDS = 900;

/** Minimum JWT secret length in bytes. */
const MIN_SECRET_BYTES = 32;

/**
 * Base64url-encode a UTF-8 string.
 */
function base64urlEncode(input) {
    return Buffer.from(input, "utf8").toString("base64url");
}

/**
 * Validate a strict positive integer string.
 */
function isPositiveIntegerString(value) {
    if (typeof value !== "string" || value.length === 0) {
        return false;
    }

    if (!/^\d+$/.test(value)) {
        return false;
    }

    const num = Number(value);

    return Number.isSafeInteger(num) && num > 0;
}

/**
 * Strictly validate and compare request Origin with CLIENT_ORIGIN.
 */
function isAllowedOrigin(requestOrigin, configuredOrigin) {
    if (
        typeof requestOrigin !== "string" ||
        typeof configuredOrigin !== "string" ||
        !requestOrigin ||
        !configuredOrigin
    ) {
        return false;
    }

    try {
        const expectedUrl = new URL(configuredOrigin);
        const requestUrl = new URL(requestOrigin);

        if (
            !["http:", "https:"].includes(expectedUrl.protocol) ||
            expectedUrl.username ||
            expectedUrl.password ||
            expectedUrl.pathname !== "/" ||
            expectedUrl.search ||
            expectedUrl.hash ||
            configuredOrigin !== expectedUrl.origin
        ) {
            return false;
        }

        if (
            !["http:", "https:"].includes(requestUrl.protocol) ||
            requestUrl.username ||
            requestUrl.password ||
            requestUrl.pathname !== "/" ||
            requestUrl.search ||
            requestUrl.hash ||
            requestOrigin !== requestUrl.origin
        ) {
            return false;
        }

        return requestUrl.origin === expectedUrl.origin;
    } catch {
        return false;
    }
}

/**
 * Sign a short-lived HS256 JWT.
 * Returns the token and its exact expiration timestamp.
 */
function issueJwt({ userId, secret, issuer, audience, ttlSeconds }) {
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + ttlSeconds;

    const header = base64urlEncode(
        JSON.stringify({
            alg: "HS256",
            typ: "JWT",
        })
    );

    const payload = base64urlEncode(
        JSON.stringify({
            sub: userId,
            iss: issuer,
            aud: audience,
            iat,
            exp,
        })
    );

    const signingInput = `${header}.${payload}`;

    const signature = createHmac("sha256", secret)
        .update(signingInput, "utf8")
        .digest("base64url");

    return {
        token: `${signingInput}.${signature}`,
        expiresAt: exp,
    };
}

/**
 * POST /api/auth/issue-token
 *
 * Validates the current Better Auth session and issues
 * a short-lived HS256 JWT.
 */
export async function POST(request) {
    try {
        // Origin / CSRF validation
        const clientOrigin = process.env.CLIENT_ORIGIN;
        const requestOrigin = request.headers.get("origin");

        if (!isAllowedOrigin(requestOrigin, clientOrigin)) {
            return Response.json(
                { error: "unauthenticated" },
                { status: 401 }
            );
        }

        // Required server-side environment variables
        const jwtSecret = process.env.JWT_SECRET;
        const jwtIssuer = process.env.JWT_ISSUER;
        const jwtAudience = process.env.JWT_AUDIENCE;
        const ttlEnv = process.env.JWT_TTL_SECONDS;

        if (!jwtSecret || !jwtIssuer || !jwtAudience) {
            return Response.json(
                { error: "internal" },
                { status: 500 }
            );
        }

        // Validate JWT secret length
        if (Buffer.byteLength(jwtSecret, "utf8") < MIN_SECRET_BYTES) {
            return Response.json(
                { error: "internal" },
                { status: 500 }
            );
        }

        // Validate token lifetime
        let ttlSeconds = DEFAULT_TTL_SECONDS;

        if (ttlEnv !== undefined) {
            if (!isPositiveIntegerString(ttlEnv)) {
                return Response.json(
                    { error: "internal" },
                    { status: 500 }
                );
            }

            ttlSeconds = Number(ttlEnv);
        }

        // Verify Better Auth session using authoritative DB lookup
        const result = await auth.api.getSession({
            headers: request.headers,
            query: { disableCookieCache: true },
            asResponse: false,
        });

        if (!result || !result.session || !result.user) {
            return Response.json(
                { error: "unauthenticated" },
                { status: 401 }
            );
        }

        const userId = result.user.id || result.session.userId;

        if (!userId || typeof userId !== "string") {
            return Response.json(
                { error: "unauthenticated" },
                { status: 401 }
            );
        }

        // Issue JWT
        const { token, expiresAt } = issueJwt({
            userId,
            secret: jwtSecret,
            issuer: jwtIssuer,
            audience: jwtAudience,
            ttlSeconds,
        });

        return Response.json(
            {
                token,
                expiresAt,
            },
            { status: 200 }
        );
    } catch {
        // Never log tokens, cookies, credentials, or secrets.
        return Response.json(
            { error: "internal" },
            { status: 500 }
        );
    }
}
