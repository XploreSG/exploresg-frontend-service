export interface JWTPayload {
  role?: string;
  roles?: string | string[];
  authorities?: string[];
  scope?: string;
  userId?: number;
  email?: string;
  exp?: number;
  iat?: number;
  sub?: string;
  [key: string]: unknown;
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    // Split the token into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT: Expected 3 parts, got", parts.length);
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if necessary for proper base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Decode from base64
    const decodedPayload = atob(paddedPayload);

    // Parse JSON
    const parsed = JSON.parse(decodedPayload);
    console.log("Full JWT Payload:", parsed);
    return parsed;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

export const getUserRole = (token: string | null): string | null => {
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded) return null;

  // Check multiple possible role field names
  let role: string | null = null;

  // Check 'role' field
  if (decoded.role && typeof decoded.role === "string") {
    role = decoded.role;
  }
  // Check 'roles' field (could be string or array)
  else if (decoded.roles) {
    if (typeof decoded.roles === "string") {
      role = decoded.roles;
    } else if (Array.isArray(decoded.roles) && decoded.roles.length > 0) {
      role = decoded.roles[0]; // Take first role
    }
  }
  // Check 'authorities' field (Spring Security style)
  else if (
    decoded.authorities &&
    Array.isArray(decoded.authorities) &&
    decoded.authorities.length > 0
  ) {
    role = decoded.authorities[0];
  }
  // Check 'scope' field
  else if (decoded.scope && typeof decoded.scope === "string") {
    // Scopes are often space-separated, take first one that looks like a role
    const scopes = decoded.scope.split(" ");
    const roleScope = scopes.find(
      (s) =>
        s.toLowerCase().includes("role") ||
        s.toLowerCase() === "user" ||
        s.toLowerCase() === "admin",
    );
    if (roleScope) {
      role = roleScope;
    }
  }

  console.log("Extracted role:", role);
  console.log("Available fields:", Object.keys(decoded));

  return role;
};
