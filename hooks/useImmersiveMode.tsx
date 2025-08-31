import { createContext, useContext, useState, ReactNode } from 'react';

interface ImmersiveModeContextType {
  isImmersive: boolean;
  setIsImmersive: (value: boolean) => void;
}

const ImmersiveModeContext = createContext<ImmersiveModeContextType | undefined>(undefined);

export function ImmersiveModeProvider({ children }: { children: ReactNode }) {
  const [isImmersive, setIsImmersive] = useState(false);

  return (
    <ImmersiveModeContext.Provider value={{ isImmersive, setIsImmersive }}>
      {children}
    </ImmersiveModeContext.Provider>
  );
}

export function useImmersiveMode() {
  const context = useContext(ImmersiveModeContext);
  if (context === undefined) {
    throw new Error('useImmersiveMode must be used within an ImmersiveModeProvider');
  }
  return context;
}
