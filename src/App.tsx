import { StrictMode, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { LoginContainer } from "./pages/LoginContainer";
import { RegisterContainer } from "./pages/RegisterContainer";
import { ForumContainer } from "./pages/ForumContainer";
import { ThreadDetail } from "./pages/ThreadDetail";
import { Toaster } from "./components/ui/sonner";
import { useAppDispatch } from "./store/hooks";
import { loadAuthFromStorage } from "./store/slices/authSlice";

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadAuthFromStorage());
  }, [dispatch]);

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginContainer />} />
      <Route path="/register" element={<RegisterContainer />} />
      <Route path="/" element={<ForumContainer />} />
      <Route path="/threads/:id" element={<ThreadDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <AppInitializer>
            <AppRoutes />
            <Toaster />
          </AppInitializer>
        </BrowserRouter>
      </Provider>
    </StrictMode>
  );
}
