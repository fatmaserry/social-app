import { Link } from "react-router";
import AuthLayout from "../AuthLayout";
import RegisterForm from "./RegisterForm";

function Register() {
  return (
    <AuthLayout
      eyebrow="Get started"
      title="Create your account"
      subtitle="It takes less than a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-main-color">
            Log in
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthLayout>
  );
}

export default Register;
