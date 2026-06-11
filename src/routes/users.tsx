import { createFileRoute } from "@tanstack/react-router";

function UsersPage() {
  return (
    <section>
      <h2 className="text-xl font-semibold">Users</h2>
      <p className="mt-1 text-sm text-slate-400">
        Organize administradores, operadores e permissao de acesso.
      </p>
    </section>
  );
}

export const Route = createFileRoute("/users")({
  component: UsersPage,
});
