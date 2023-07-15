import { configureStore } from '@reduxjs/toolkit';
import { persistedReducer, persistStore } from './persist-config';

const initialState = {
  forms: {
    allForms: [],
  },
};

const store = configureStore({
  reducer: persistedReducer,
  preloadedState: initialState,
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    });
  },
});

const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export { store, persistor };
