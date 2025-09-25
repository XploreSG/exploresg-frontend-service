// Auth Service for ExploreSG Backend Integration
// Backend URL: http://localhost:8080

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  pictureUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

class AuthService {
  private baseURL = "http://localhost:8080/api/v1/auth";

  // Get stored JWT token
  getToken(): string | null {
    return localStorage.getItem("jwt");
  }

  // Set token in localStorage
  setToken(token: string): void {
    console.log("💾 Storing JWT token in localStorage");
    console.log("Token length:", token.length);
    localStorage.setItem("jwt", token);
  }

  // Remove token
  removeToken(): void {
    localStorage.removeItem("jwt");
  }

  // Check service health
  async checkHealth(): Promise<{
    status: string;
    timestamp?: string;
    [key: string]: unknown;
  }> {
    const response = await fetch(`${this.baseURL}/health`);
    return response.json();
  }

  // Start Google OAuth login (redirect to backend)
  startGoogleLogin(): void {
    console.log("🔄 Starting Google OAuth login flow...");
    console.log("Redirecting to:", `${this.baseURL}/login`);
    window.location.href = `${this.baseURL}/login`;
  }

  // Get current user info (requires JWT)
  async getCurrentUser(): Promise<User> {
    const token = this.getToken();
    if (!token) throw new Error("No token found");

    console.log("📡 Fetching user data from backend...");
    console.log("Endpoint:", `${this.baseURL}/me`);

    const response = await fetch(`${this.baseURL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("❌ Failed to fetch user data:", response.status);
      throw new Error("Failed to get user");
    }

    const userData = await response.json();
    console.log("✅ User data fetched successfully:", userData);
    return userData;
  }

  // Validate JWT token
  async validateToken(token: string): Promise<boolean> {
    const response = await fetch(`${this.baseURL}/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });

    const result = await response.json();
    return result.valid;
  }

  // Logout
  async logout(): Promise<void> {
    await fetch(`${this.baseURL}/logout`, { method: "POST" });
    this.removeToken();
  }
}

export const authService = new AuthService();
