import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: "",
  password: "",
  deviceType: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLogin: (state, action) => {
      state.user = action.payload.user;
      state.password = action.payload.password;
      state.deviceType = action.payload.deviceType;
    },
    logout: () => initialState, // add logout reducer
  },
});

export const { userLogin, logout } = userSlice.actions;
export default userSlice.reducer;
