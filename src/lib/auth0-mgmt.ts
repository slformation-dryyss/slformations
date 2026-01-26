
/**
 * Utility for Auth0 Management API interactions
 */

export async function getManagementApiToken() {
    const rawDomain = process.env.AUTH0_ISSUER_BASE_URL;
    const clientId = process.env.AUTH0_CLIENT_ID;
    const clientSecret = process.env.AUTH0_CLIENT_SECRET;

    if (!rawDomain || !clientId || !clientSecret) {
        throw new Error("Missing Auth0 credentials in environment variables");
    }

    // Sanitize domain: remove trailing slash
    const domain = rawDomain.replace(/\/$/, "");

    const response = await fetch(`${domain}/oauth/token`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            audience: `${domain}/api/v2/`,
            grant_type: "client_credentials",
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Auth0 Management API Token Error:", error);
        throw new Error(`Failed to get Management API token: ${error.error_description || error.error}`);
    }

    const data = await response.json();
    return data.access_token;
}

export async function createPasswordChangeTicket(auth0UserId: string, resultUrl: string) {
    const token = await getManagementApiToken();
    const rawDomain = process.env.AUTH0_ISSUER_BASE_URL;
    if (!rawDomain) throw new Error("Missing AUTH0_ISSUER_BASE_URL");
    
    const domain = rawDomain.replace(/\/$/, "");

    const response = await fetch(`${domain}/api/v2/tickets/password-change`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            user_id: auth0UserId,
            result_url: resultUrl,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Auth0 Password Change Ticket Error:", error);
        throw new Error(`Failed to create password change ticket: ${error.message || error.error}`);
    }

    const data = await response.json();
    return data.ticket;
}
