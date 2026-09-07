import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "../components/layouts/app-layout";
import { ProtectedRoute, PublicOnlyRoute } from "../features/auth/auth-guards";
import { LoginPage } from "../pages/login-page";
import { FilesPage } from "../pages/files-page";
import { NotFoundPage } from "../pages/not-found-page";
import { ProfilePage } from "../pages/profile-page";
import { RegisterPage } from "../pages/register-page";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        /* anyone can visit */
        element: <PublicOnlyRoute />,
        children: [
          { path: "login", element: <LoginPage /> },
          { path: "register", element: <RegisterPage /> },
        ],
      },
      {
        /* auth routes basically */
        element: <ProtectedRoute />,
        children: [
          { path: "files", element: <FilesPage /> },
          { path: "profile", element: <ProfilePage /> },
        ],
      },
      { index: true, element: <Navigate replace to="/files" /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
