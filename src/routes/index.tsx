import { createFileRoute } from "@tanstack/react-router";

function OverviewPage() {
  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Overview</h2>
        <p className="mt-1 text-sm text-slate-400">
          Acompanhe status dos armarios, entregas e operacao geral.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Lockers ativos", "24"],
          ["Portas livres", "128"],
          ["Entregas hoje", "42"],
          ["Alertas", "3"],
        ].map(([label, value]) => (
          <article
            key={label}
            className="rounded-lg border border-slate-800 bg-slate-900 p-4"
          >
            <p className="text-sm text-slate-400">{label}</p>
            <strong className="mt-3 block text-3xl">{value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

export const Route = createFileRoute("/")({
  component: OverviewPage,
});
