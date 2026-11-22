
let accessToken = null;
let tokenExpiresAt = 0;
let tokenRequest = null;
let tokenGeneration = 0;

const TOKEN_REFRESH_BUFFER_SECONDS = 60;

/**
 * Store the access token and its expiration time in memory.
 */
export function setAccessToken(token, expiresAt) {
    if (
        typeof token !== "string" ||
        !token.trim() ||
        !Number.isSafeInteger(expiresAt) ||
        expiresAt <= Math.floor(Date.now() / 1000)
    ) {
        throw new Error("A valid access token and expiry are required.");
    }

    accessToken = token;
    tokenExpiresAt = expiresAt;
}

/**
 * Return the currently stored access token.
 */
export function getStoredAccessToken() {
    if (!accessToken) {
        return null;
    }

    const now = Math.floor(Date.now() / 1000);

    if (tokenExpiresAt - now <= TOKEN_REFRESH_BUFFER_SECONDS) {
        return null;
    }

    return accessToken;
}

/**
 * Clear the access token and invalidate pending token requests.
 */
export function clearAccessToken() {
    tokenGeneration += 1;

    accessToken = null;
    tokenExpiresAt = 0;
    tokenRequest = null;
}

/**
 * Request a new access token using the Better Auth session.
 */
export async function getAccessToken() {
    const storedToken = getStoredAccessToken();

    if (storedToken) {
        return storedToken;
    }

    if (tokenRequest) {
        return tokenRequest;
    }

    const requestGeneration = tokenGeneration;

    let currentRequest;

    currentRequest = (async () => {
        const response = await fetch("/api/auth/issue-token", {
            method: "POST",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error("Unable to obtain an access token.");
        }

        const data = await response.json();

        if (
            typeof data.token !== "string" ||
            !Number.isSafeInteger(data.expiresAt)
        ) {
            throw new Error("Invalid access token response.");
        }

        // Prevent an old request from restoring a token after logout.
        if (requestGeneration !== tokenGeneration) {
            throw new Error("Token request was cancelled.");
        }

        setAccessToken(data.token, data.expiresAt);

        return data.token;
    })();

    tokenRequest = currentRequest;

    try {
        return await currentRequest;
    } finally {
        // An older request must not clear a newer request.
        if (tokenRequest === currentRequest) {
            tokenRequest = null;
        }
    }
}
