import { Link } from "react-router";
import AuthLayout from "../AuthLayout";
import LoginForm from "./LoginForm";

function Login() {
  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in to Pulse"
      subtitle="Pick up right where you left off."
      footer={
        <>
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-main-color">
            Sign up
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
}

export default Login;
