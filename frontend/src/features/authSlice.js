import { createSlice } from "@reduxjs/toolkit";
// create initial states
const initialState = {
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  role: localStorage.getItem("role") || null,
  id: null,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token, role,id } = action.payload;
      state.token = token;
      state.role = role;
      state.id = id
      state.isAuthenticated = true;
      state.error = null;
        console.log(id)
    },
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.id = null;
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, setError } = authSlice.actions;
export default authSlice.reducer;
