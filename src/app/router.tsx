import { createBrowserRouter } from "react-router";
import Posts from "@/features/posts/pages/Posts";
import Bookmarks from "@/features/posts/pages/Bookmarks";
import PostDetail from "@/features/posts/pages/PostDetail";
import Notifications from "@/features/notifications/pages/Notifications";
import Profile from "@/features/users/pages/Profile";
import UserProfile from "@/features/users/pages/UserProfile";
import ExplorePeople from "@/features/users/pages/ExplorePeople";
import AccountSettings from "@/features/users/pages/AccountSettings";
import Login from "@/features/auth/login/Login";
import Register from "@/features/auth/register/Register";
import NotFound from "@/app/pages/NotFound";
import Layout from "@/app/layout/Layout";
import ProtectedPageLayout from "@/app/routing/ProtectedPageLayout";
import AuthProtected from "@/app/routing/AuthProtected";

export const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        element: <ProtectedPageLayout />,
        children: [
          { index: true, element: <Posts /> },
          { path: "posts", element: <Posts /> },
          { path: "posts/:postId", element: <PostDetail /> },
          { path: "bookmarks", element: <Bookmarks /> },
          { path: "profile", element: <Profile /> },
          { path: "profile/:userId", element: <UserProfile /> },
          { path: "explore", element: <ExplorePeople /> },
          { path: "settings", element: <AccountSettings /> },
          { path: "notifications", element: <Notifications /> },
        ],
      },
      {
        path: "login",
        element: (
          <AuthProtected>
            <Login />
          </AuthProtected>
        ),
      },
      {
        path: "register",
        element: (
          <AuthProtected>
            <Register />
          </AuthProtected>
        ),
      },
      { path: "*", element: <NotFound /> },
    ],
  },
], { basename: import.meta.env.BASE_URL });
