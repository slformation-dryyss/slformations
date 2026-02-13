
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

    // Sanitize domain: ensure it starts with https:// and remove trailing slash
    let domain = rawDomain.includes("://") ? rawDomain : `https://${rawDomain}`;
    domain = domain.replace(/\/$/, "");

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

    let domain = rawDomain.includes("://") ? rawDomain : `https://${rawDomain}`;
    domain = domain.replace(/\/$/, "");

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
        const error = await response.json().catch(() => ({}));
        console.error("Auth0 Password Change Ticket Error:", error);
        throw new Error(`Auth0 Error: ${error.message || error.error || response.statusText}`);
    }

    const data = await response.json();
    return data.ticket;
}

export async function triggerPasswordResetEmail(email: string) {
    const rawDomain = process.env.AUTH0_ISSUER_BASE_URL;
    const clientId = process.env.AUTH0_CLIENT_ID;
    if (!rawDomain || !clientId) throw new Error("Missing Auth0 configuration");

    let domain = rawDomain.includes("://") ? rawDomain : `https://${rawDomain}`;
    domain = domain.replace(/\/$/, "");

    const response = await fetch(`${domain}/dbconnections/change_password`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            client_id: clientId,
            email: email,
            connection: "Username-Password-Authentication",
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        console.error("Auth0 Password Reset Email Error:", error);
        throw new Error(`Auth0 Reset Error: ${error.message || error.error || response.statusText}`);
    }

    return true;
}

export async function createAuth0User(data: { email: string; firstName: string; lastName: string; password?: string, roles?: string[] }) {
    const token = await getManagementApiToken();
    const rawDomain = process.env.AUTH0_ISSUER_BASE_URL;
    if (!rawDomain) throw new Error("Missing AUTH0_ISSUER_BASE_URL");

    const domain = rawDomain.replace(/\/$/, "");

    const body: any = {
        connection: "Username-Password-Authentication",
        email: data.email,
        password: data.password || Math.random().toString(36).slice(-12) + "A1!",
        given_name: data.firstName,
        family_name: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        email_verified: true,
        verify_email: false,
    };

    if (data.roles && data.roles.length > 0) {
        body.app_metadata = {
            roles: data.roles
        };
    }

    const response = await fetch(`${domain}/api/v2/users`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Auth0 User Creation Error:", error);
        throw new Error(`Failed to create Auth0 user: ${error.message || error.error}`);
    }

    return await response.json();
    return await response.json();
}

export async function deleteAuth0User(auth0UserId: string) {
    const token = await getManagementApiToken();
    const rawDomain = process.env.AUTH0_ISSUER_BASE_URL;
    if (!rawDomain) throw new Error("Missing AUTH0_ISSUER_BASE_URL");

    const domain = rawDomain.replace(/\/$/, "");

    const response = await fetch(`${domain}/api/v2/users/${auth0UserId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Auth0 User Deletion Error:", error);
        throw new Error(`Failed to delete Auth0 user: ${error.message || error.error}`);
    }

    return true;
}

export async function updateAuth0UserBlockStatus(auth0UserId: string, blocked: boolean) {
    const token = await getManagementApiToken();
    const rawDomain = process.env.AUTH0_ISSUER_BASE_URL;
    if (!rawDomain) throw new Error("Missing AUTH0_ISSUER_BASE_URL");

    const domain = rawDomain.replace(/\/$/, "");

    const response = await fetch(`${domain}/api/v2/users/${auth0UserId}`, {
        method: "PATCH",
        headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            blocked: blocked
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        console.error("Auth0 User Block/Unblock Error:", error);
        throw new Error(`Failed to update Auth0 user block status: ${error.message || error.error}`);
    }

    return await response.json();
}
