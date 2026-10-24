import AuthLayout from "@/components/auth/AuthLayout";

export const metadata = {
  title: "Sign Up — Spotwise | Space Discovery Engine",
  description: "Create your free demo workspace account to start discovering quiet study sanctuaries.",
};

export default function SignUpPage() {
  return <AuthLayout mode="sign-up" />;
}
