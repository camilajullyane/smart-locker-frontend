import type {
  DeviceStatus,
  DoorState,
  Locker,
  LockerStatus,
} from "@/types/locker";
import type { User, UserAccessEvent } from "@/types/user";

const FIREBASE_DATABASE_URL =
  "https://projeto-top-redes-default-rtdb.firebaseio.com";

type FirebaseAuthorizedUser = {
  active?: boolean;
  name?: string;
};

type FirebaseLocker = {
  lastEvent?: string;
  lastUid?: string;
  state?: string;
  updatedAtMs?: number;
};

type FirebaseLog = {
  lockerId?: string;
  lockerState?: string;
  source?: string;
  status?: string;
  timestampMs?: number;
  uid?: string;
};

type FirebaseDatabase = {
  authorizedUsers?: Record<string, FirebaseAuthorizedUser>;
  lockers?: Record<string, FirebaseLocker>;
  logs?: Record<string, FirebaseLog>;
};

export type SmartLockerData = {
  users: User[];
  lockers: Locker[];
};

function normalizeUid(value: string) {
  return value.replaceAll("_", ":").toUpperCase();
}

function uidToKey(value: string) {
  return value.replaceAll(":", "_").toUpperCase();
}

function normalizeStatus(value?: string) {
  return value?.toLowerCase() === "authorized" ? "authorized" : "denied";
}

function getReferenceNow(logs: FirebaseLog[]) {
  const latestTimestampMs = Math.max(
    0,
    ...logs.map((log) => log.timestampMs ?? 0),
  );
  const now = Date.now();

  return (timestampMs?: number) => {
    if (timestampMs === undefined) {
      return new Date(now).toISOString();
    }

    return new Date(now - Math.max(0, latestTimestampMs - timestampMs)).toISOString();
  };
}

function getLockerStatus(locker: FirebaseLocker): LockerStatus {
  const state = locker.state?.toLowerCase();

  if (state === "blocked") {
    return "maintenance";
  }

  if (state === "offline") {
    return "offline";
  }

  if (state === "open") {
    return "occupied";
  }

  return "available";
}

function getDoorState(locker: FirebaseLocker): DoorState {
  return locker.state?.toLowerCase() === "open" ? "open" : "closed";
}

function getDeviceStatus(): DeviceStatus {
  return "online";
}

function getUserEvents(
  uid: string,
  logs: Array<[string, FirebaseLog]>,
  toIsoDate: (timestampMs?: number) => string,
): UserAccessEvent[] {
  return logs
    .filter(([, log]) => normalizeUid(log.uid ?? "") === uid)
    .sort(([, firstLog], [, secondLog]) => {
      return (secondLog.timestampMs ?? 0) - (firstLog.timestampMs ?? 0);
    })
    .slice(0, 5)
    .map(([id, log]) => {
      const status = normalizeStatus(log.status);

      return {
        id,
        locker: log.lockerId ?? "Locker nao informado",
        occurredAt: toIsoDate(log.timestampMs),
        status,
        description:
          status === "authorized"
            ? "Acesso autorizado por RFID"
            : "Acesso negado por RFID",
      };
    });
}

export async function fetchSmartLockerData(
  signal?: AbortSignal,
): Promise<SmartLockerData> {
  const response = await fetch(`${FIREBASE_DATABASE_URL}/.json`, { signal });

  if (!response.ok) {
    throw new Error("Nao foi possivel carregar os dados do Firebase.");
  }

  return mapFirebaseDatabase(await response.json());
}

export function mapFirebaseDatabase(database: FirebaseDatabase): SmartLockerData {
  const authorizedUsers = database.authorizedUsers ?? {};
  const lockerEntries = Object.entries(database.lockers ?? {});
  const logEntries = Object.entries(database.logs ?? {});
  const logs = logEntries.map(([, log]) => log);
  const toIsoDate = getReferenceNow(logs);

  const users = Object.entries(authorizedUsers).map(([userKey, user]) => {
    const uid = normalizeUid(userKey);
    const userLogs = logEntries.filter(([, log]) => normalizeUid(log.uid ?? "") === uid);
    const latestLog = userLogs.toSorted(([, firstLog], [, secondLog]) => {
      return (secondLog.timestampMs ?? 0) - (firstLog.timestampMs ?? 0);
    })[0]?.[1];
    const authorizedCount = userLogs.filter(
      ([, log]) => normalizeStatus(log.status) === "authorized",
    ).length;
    const deniedCount = userLogs.length - authorizedCount;
    const createdAt = toIsoDate(userLogs.at(-1)?.[1].timestampMs);
    const updatedAt = toIsoDate(latestLog?.timestampMs);

    return {
      id: userKey,
      name: user.name ?? uid,
      email: `${userKey.toLowerCase()}@rfid.local`,
      role: "Usuario",
      status: user.active === false ? "blocked" : "active",
      rfidCardNumber: uid,
      lastLockerAccess: toIsoDate(latestLog?.timestampMs),
      createdAt: new Date(createdAt),
      updatedAt: new Date(updatedAt),
      locker: latestLog?.lockerId ?? "Sem locker",
      accessCount: authorizedCount,
      deniedAccessCount: deniedCount,
      lastAccessStatus: normalizeStatus(latestLog?.status),
      recentEvents: getUserEvents(uid, logEntries, toIsoDate),
    };
  });

  const lockers = lockerEntries.map(([lockerId, locker]) => {
    const lockerLogs = logEntries.filter(([, log]) => log.lockerId === lockerId);
    const latestLog = lockerLogs.toSorted(([, firstLog], [, secondLog]) => {
      return (secondLog.timestampMs ?? 0) - (firstLog.timestampMs ?? 0);
    })[0]?.[1];
    const lastUid = locker.lastUid ?? latestLog?.uid;
    const assignedUser = lastUid
      ? authorizedUsers[uidToKey(lastUid)]?.name
      : undefined;
    const deniedAccessCount = lockerLogs.filter(
      ([, log]) => normalizeStatus(log.status) === "denied",
    ).length;
    const lastActivityMs = locker.updatedAtMs ?? latestLog?.timestampMs;

    return {
      id: lockerId,
      name: lockerId,
      zone: latestLog?.source ?? "Firebase",
      status: getLockerStatus(locker),
      doorState: getDoorState(locker),
      assignedUser,
      esp32Id: latestLog?.source ?? "ESP32",
      esp32Name: latestLog?.source ?? "ESP32",
      deviceStatus: getDeviceStatus(),
      lastHeartbeatAt: toIsoDate(lastActivityMs),
      lastAccessAt: toIsoDate(latestLog?.timestampMs ?? locker.updatedAtMs),
      lastRfidRead: lastUid ? normalizeUid(lastUid) : undefined,
      accessCount: lockerLogs.filter(
        ([, log]) => normalizeStatus(log.status) === "authorized",
      ).length,
      deniedAccessCount,
      alertsCount:
        deniedAccessCount + (locker.lastEvent === "denied_access" ? 1 : 0),
    };
  });

  return { users, lockers };
}
