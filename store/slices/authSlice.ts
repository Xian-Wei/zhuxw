import { createSlice } from "@reduxjs/toolkit";

export interface AuthState {
  login: boolean;
}

const initialState: AuthState = {
  login: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    connect: (state) => {
      state.login = true;
    },
    disconnect: (state) => {
      state.login = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { connect, disconnect } = authSlice.actions;

export default authSlice.reducer;
