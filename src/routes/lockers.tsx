import { createFileRoute } from "@tanstack/react-router";

function LockersPage() {
  return (
    <section>
      <h2 className="text-xl font-semibold">Lockers</h2>
      <p className="mt-1 text-sm text-slate-400">
        Liste e gerencie unidades, portas, disponibilidade e manutencoes.
      </p>
    </section>
  );
}

export const Route = createFileRoute("/lockers")({
  component: LockersPage,
});
