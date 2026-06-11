import { createFileRoute } from "@tanstack/react-router";

function SettingsPage() {
  return (
    <section>
      <h2 className="text-xl font-semibold">Settings</h2>
      <p className="mt-1 text-sm text-slate-400">
        Configure regras do sistema, notificacoes e parametros operacionais.
      </p>
    </section>
  );
}

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});
