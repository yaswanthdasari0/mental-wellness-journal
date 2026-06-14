import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your space"
      subtitle="A few details and you're in. No spam, no fuss."
    >
      <SignupForm />
    </AuthLayout>
  );
}