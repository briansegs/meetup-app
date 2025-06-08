import { RegisterForm } from "@/features/auth/components/RegisterForm";
import Card from "@/features/shared/components/ui/Card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <main>
      <Card>
        <RegisterForm />
      </Card>
    </main>
  );
}
