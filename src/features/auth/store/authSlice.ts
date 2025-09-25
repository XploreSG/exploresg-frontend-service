import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  userRole: "guest" | "user" | "admin" | "fleet";
  userName: string;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userRole: "guest",
  userName: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{ role: AuthState["userRole"]; name: string }>,
    ) => {
      state.isLoggedIn = true;
      state.userRole = action.payload.role;
      state.userName = action.payload.name;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userRole = "guest";
      state.userName = "";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
