import { useMemo, useState } from "react";
import {
  PlusIcon,
  SearchIcon,
  ShieldAlertIcon,
  Trash2Icon,
  UserCheckIcon,
  UsersIcon,
} from "lucide-react";

import type { User, UserFormValues } from "@/types/user";
import { UserFormSheet } from "@/components/users/user-form-sheet";
import { UsersTable } from "@/components/users/users-table";
import { useSmartLockerData } from "@/hooks/use-smart-locker-data";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { SummaryCard } from "../SummaryCard";
import { UserDetailsSheet } from "./user-detail-sheet";

const emptyFormValues: UserFormValues = {
  name: "",
  email: "",
  role: "Usuario",
  status: "active",
  rfidCardNumber: "",
  locker: "",
  phone: "",
  department: "",
};

function userToFormValues(user: User): UserFormValues {
  return {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    rfidCardNumber: user.rfidCardNumber,
    locker: user.locker,
    phone: user.phone ?? "",
    department: user.department ?? "",
  };
}

function createUser(values: UserFormValues): User {
  const now = new Date();

  return {
    id: `usr-${crypto.randomUUID()}`,
    name: values.name,
    email: values.email,
    role: values.role,
    status: values.status,
    rfidCardNumber: values.rfidCardNumber,
    locker: values.locker,
    phone: values.phone,
    department: values.department,
    createdAt: now,
    updatedAt: now,
    lastLockerAccess: now.toISOString(),
    accessCount: 0,
    deniedAccessCount: 0,
    lastAccessStatus: "authorized",
    recentEvents: [],
  };
}

function matchesSearch(user: User, search: string) {
  const normalizedSearch = search.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [user.name, user.email, user.rfidCardNumber]
    .join(" ")
    .toLowerCase()
    .includes(normalizedSearch);
}

export function UsersDashboard() {
  const { users: firebaseUsers, isLoading, error } = useSmartLockerData();
  const [createdUsers, setCreatedUsers] = useState<User[]>([]);
  const [userOverrides, setUserOverrides] = useState<
    Record<string, Partial<User>>
  >({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit" | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formValues, setFormValues] = useState<UserFormValues>(emptyFormValues);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

  const users = useMemo(() => {
    return [...createdUsers, ...firebaseUsers].map((user) => ({
      ...user,
      ...userOverrides[user.id],
    }));
  }, [createdUsers, firebaseUsers, userOverrides]);

  const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const statusMatches =
        statusFilter === "all"
          ? user.status !== "deleted"
          : user.status === statusFilter;

      return statusMatches && matchesSearch(user, search);
    });
  }, [search, statusFilter, users]);

  const stats = useMemo(() => {
    return {
      total: users.length,
      active: users.filter((user) => user.status === "active").length,
      blocked: users.filter((user) => user.status === "blocked").length,
      deleted: users.filter((user) => user.status === "deleted").length,
    };
  }, [users]);

  function openCreateForm() {
    setEditingUser(null);
    setFormValues(emptyFormValues);
    setFormMode("create");
  }

  function openEditForm(user: User) {
    setEditingUser(user);
    setFormValues(userToFormValues(user));
    setFormMode("edit");
  }

  function handleSubmitUser(values: UserFormValues) {
    if (formMode === "edit" && editingUser) {
      const updatedUser = {
        ...editingUser,
        ...values,
        deletedAt:
          values.status === "deleted"
            ? (editingUser.deletedAt ?? new Date())
            : undefined,
        updatedAt: new Date(),
      };

      setCreatedUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingUser.id ? updatedUser : user,
        ),
      );
      setUserOverrides((currentOverrides) => ({
        ...currentOverrides,
        [editingUser.id]: updatedUser,
      }));
      setSelectedUserId(editingUser.id);
    }

    if (formMode === "create") {
      const newUser = createUser(values);
      setCreatedUsers((currentUsers) => [newUser, ...currentUsers]);
      setSelectedUserId(newUser.id);
    }

    setFormMode(null);
    setEditingUser(null);
  }

  function handleSoftDelete(user: User) {
    const deletedUser = {
      ...user,
      status: "deleted",
      deletedAt: new Date(),
      updatedAt: new Date(),
    };

    setCreatedUsers((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === user.id ? deletedUser : currentUser,
      ),
    );
    setUserOverrides((currentOverrides) => ({
      ...currentOverrides,
      [user.id]: deletedUser,
    }));
    setDeleteTarget(null);
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Usuarios</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie cadastros, cartoes RFID e permissao de acesso ao locker.
          </p>
        </div>

        <Button onClick={openCreateForm}>
          <PlusIcon />
          Novo usuario
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={UsersIcon}
          label="Total cadastrados"
          value={stats.total}
        />
        <SummaryCard icon={UserCheckIcon} label="Ativos" value={stats.active} />
        <SummaryCard
          icon={ShieldAlertIcon}
          label="Bloqueados"
          value={stats.blocked}
        />
        <SummaryCard
          icon={Trash2Icon}
          label="Excluidos"
          value={stats.deleted}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">
          Carregando usuarios do Firebase...
        </p>
      ) : null}

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Card className="bg-neutral-950/60">
        <CardHeader className="gap-4 border-b border-border pb-4 md:flex md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>Usuarios cadastrados</CardTitle>
            <CardDescription>
              Clique em uma linha para visualizar detalhes e ultimos acessos.
            </CardDescription>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative sm:w-80">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nome, email ou RFID"
                className="pl-8"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Ativos e bloqueados</SelectItem>
                <SelectItem value="active">Ativos</SelectItem>
                <SelectItem value="blocked">Bloqueados</SelectItem>
                <SelectItem value="deleted">Excluidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <UsersTable
            users={filteredUsers}
            onView={(user) => setSelectedUserId(user.id)}
            onEdit={openEditForm}
            onDelete={setDeleteTarget}
          />
        </CardContent>
      </Card>

      <UserDetailsSheet
        user={selectedUser}
        open={Boolean(selectedUser)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUserId(null);
          }
        }}
        onEdit={openEditForm}
        onDelete={setDeleteTarget}
      />

      <UserFormSheet
        mode={formMode}
        values={formValues}
        open={Boolean(formMode)}
        onOpenChange={(open) => {
          if (!open) {
            setFormMode(null);
            setEditingUser(null);
          }
        }}
        onValuesChange={setFormValues}
        onSubmit={handleSubmitUser}
      />

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa acao fara um soft delete em {deleteTarget?.name}. O registro
              continua salvo para auditoria, mas sai da lista principal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => deleteTarget && handleSoftDelete(deleteTarget)}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
}
