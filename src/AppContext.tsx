import React, { createContext, useContext, useMemo, useRef, useState } from "react";
import { AppData } from "./types";
import { loadData, resetData, saveData } from "./services/storage";

interface AppContextValue {
  data: AppData;
  setData: (next: AppData) => void;
  updateData: (updater: (data: AppData) => AppData) => void;
  updateDataAsync: <Result extends { data: AppData }>(
    updater: (data: AppData) => Promise<Result>
  ) => Promise<Result>;
  reset: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setDataState] = useState<AppData>(() => loadData());
  const dataRef = useRef(data);
  const asyncUpdateQueueRef = useRef<Promise<void>>(Promise.resolve());

  const commitData = (next: AppData) => {
    dataRef.current = next;
    setDataState(next);
    saveData(next);
  };

  const waitForQueuedUpdates = () => asyncUpdateQueueRef.current.catch(() => undefined);

  const value = useMemo<AppContextValue>(
    () => ({
      data,
      setData(next) {
        commitData(next);
      },
      updateData(updater) {
        const run = waitForQueuedUpdates().then(() => {
          const next = updater(dataRef.current);
          commitData(next);
        });
        asyncUpdateQueueRef.current = run.then(
          () => undefined,
          () => undefined
        );
      },
      updateDataAsync(updater) {
        const run = waitForQueuedUpdates().then(async () => {
          const result = await updater(dataRef.current);
          commitData(result.data);
          return result;
        });
        asyncUpdateQueueRef.current = run.then(
          () => undefined,
          () => undefined
        );
        return run;
      },
      reset() {
        commitData(resetData());
      }
    }),
    [data]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppData = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppData must be used inside AppProvider");
  return context;
};
