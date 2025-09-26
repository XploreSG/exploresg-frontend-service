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

  // Clear all localStorage (complete cleanup)
  clearAllStorage(): void {
    console.log("🧹 Clearing ALL localStorage...");
    localStorage.clear();
    console.log("✅ All localStorage cleared");
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
  startGoogleLogin(forceAccountSelection: boolean = false): void {
    console.log("🔄 Starting Google OAuth login flow...");

    let loginUrl = `${this.baseURL}/login`;

    // Add parameter to force account selection (shows Google picker every time)
    if (forceAccountSelection) {
      loginUrl += "?prompt=select_account";
      console.log("🔄 Forcing Google account selection...");
    }

    console.log("Redirecting to:", loginUrl);
    window.location.href = loginUrl;
  }

  // Start Google OAuth with forced account selection (always shows Google page)
  startGoogleLoginWithSelection(): void {
    this.startGoogleLogin(true);
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
    try {
      const token = this.getToken();

      // Only call backend logout if we have a token
      if (token) {
        console.log("🔄 Calling backend logout...");
        await fetch(`${this.baseURL}/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("✅ Backend logout successful");
      }
    } catch (error) {
      console.warn("⚠️ Backend logout failed (this is OK):", error);
      // Continue with local logout even if backend fails
    } finally {
      // Clear ALL localStorage data (complete cleanup)
      console.log("🧹 Clearing ALL local storage data...");
      this.removeToken(); // Remove JWT token specifically

      // Clear any other auth-related data that might exist
      localStorage.removeItem("user");
      localStorage.removeItem("authState");
      localStorage.removeItem("exploresg_jwt");
      localStorage.removeItem("exploresg_user");

      // Option 1: Clear all localStorage (uncomment next line for complete cleanup)
      // this.clearAllStorage();

      // Option 2: Or manually clear everything with:
      // localStorage.clear();

      console.log("✅ Local storage cleared - Logout completed");
    }
  }
}

export const authService = new AuthService();
