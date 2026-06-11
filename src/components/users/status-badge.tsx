import { Badge } from "../ui/badge";

const statusOptions = [
  { value: "active", label: "Ativo" },
  { value: "blocked", label: "Bloqueado" },
  { value: "deleted", label: "Excluido" },
] as const;

export function StatusBadge({ status }: { status: string }) {
  function getStatusLabel(status: string) {
    return (
      statusOptions.find((option) => option.value === status)?.label ?? status
    );
  }

  function getStatusBadgeVariant(status: string) {
    if (status === "active") {
      return "default";
    }

    if (status === "blocked") {
      return "destructive";
    }

    return "secondary";
  }

  return (
    <Badge variant={getStatusBadgeVariant(status)}>
      {getStatusLabel(status)}
    </Badge>
  );
}
