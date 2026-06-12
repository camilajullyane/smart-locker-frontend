import { useEffect, useState } from "react";

import {
  fetchSmartLockerData,
  type SmartLockerData,
} from "@/lib/firebase-data";

const REFRESH_INTERVAL_MS = 5000;

export function useSmartLockerData() {
  const [data, setData] = useState<SmartLockerData>({
    users: [],
    lockers: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadData(showLoading: boolean) {
      if (showLoading) {
        setIsLoading(true);
      }

      try {
        const nextData = await fetchSmartLockerData(controller.signal);
        setData(nextData);
        setError(null);
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }

        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Nao foi possivel carregar os dados do Firebase.",
        );
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadData(true);

    const intervalId = window.setInterval(() => {
      void loadData(false);
    }, REFRESH_INTERVAL_MS);

    return () => {
      controller.abort();
      window.clearInterval(intervalId);
    };
  }, []);

  return { ...data, isLoading, error };
}
