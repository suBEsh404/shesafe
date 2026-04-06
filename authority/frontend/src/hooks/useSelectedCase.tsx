import {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";

type SelectedCaseContextValue = {
  selectedCaseId?: string;
  setSelectedCaseId: (caseId?: string) => void;
};

const SelectedCaseContext = createContext<SelectedCaseContextValue | undefined>(
  undefined,
);

export function SelectedCaseProvider({ children }: PropsWithChildren) {
  const [selectedCaseId, setSelectedCaseId] = useState<string | undefined>(undefined);

  const value = useMemo(
    () => ({
      selectedCaseId,
      setSelectedCaseId,
    }),
    [selectedCaseId],
  );

  return (
    <SelectedCaseContext.Provider value={value}>
      {children}
    </SelectedCaseContext.Provider>
  );
}

export function useSelectedCase() {
  const context = useContext(SelectedCaseContext);

  if (!context) {
    throw new Error("useSelectedCase must be used within SelectedCaseProvider");
  }

  return context;
}
