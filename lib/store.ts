import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userSlice from "./userSlice";
import dataSlice from "./dataSlice";
import adminSlice from "./adminSlice";

// Combine reducers
const rootReducer = combineReducers({
  userAuth: userSlice,
  dataAuth: dataSlice,
  adminAuth: adminSlice
});

// Persist config
const persistConfig = {
  key: "root",
  storage,
};

// Wrap rootReducer with persist
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // needed for redux-persist
    }),
});

// Persistor
export const persistor = persistStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
