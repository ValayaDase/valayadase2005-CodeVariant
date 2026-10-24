import AuthLayout from "@/components/auth/AuthLayout";

export const metadata = {
  title: "Sign In — Spotwise | Space Discovery Engine",
  description: "Sign in to access your saved spots, quiet forecasts, and sensory workspace telemetry.",
};

export default function SignInPage() {
  return <AuthLayout mode="sign-in" />;
}
