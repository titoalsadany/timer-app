import { createContext, useContext, useState, ReactNode } from 'react';

export interface TimerSession {
  id: string;
  name: string;
  category: string;
  duration: number;
  startTime: Date;
  endTime?: Date;
  isCompleted: boolean;
  distractions: string[];
  focusScore?: number;
}

interface SessionContextType {
  sessions: TimerSession[];
  addSession: (session: TimerSession) => void;
  updateSession: (id: string, updates: Partial<TimerSession>) => void;
  getSessionsByDate: (date: Date) => TimerSession[];
  getDailyStats: (date: Date) => {
    totalSessions: number;
    completedSessions: number;
    totalTime: number;
    averageFocusScore: number;
  };
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<TimerSession[]>([]);

  const addSession = (session: TimerSession) => {
    setSessions(prev => [...prev, session]);
  };

  const updateSession = (id: string, updates: Partial<TimerSession>) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const getSessionsByDate = (date: Date) => {
    const dateString = date.toDateString();
    return sessions.filter(session => session.startTime.toDateString() === dateString);
  };

  const getDailyStats = (date: Date) => {
    const daySessions = getSessionsByDate(date);
    const completedSessions = daySessions.filter(s => s.isCompleted);
    const totalTime = completedSessions.reduce((sum, s) => sum + s.duration, 0);
    const averageFocusScore = completedSessions.length > 0 
      ? completedSessions.reduce((sum, s) => sum + (s.focusScore || 0), 0) / completedSessions.length
      : 0;

    return {
      totalSessions: daySessions.length,
      completedSessions: completedSessions.length,
      totalTime,
      averageFocusScore: Math.round(averageFocusScore)
    };
  };

  return (
    <SessionContext.Provider value={{
      sessions,
      addSession,
      updateSession,
      getSessionsByDate,
      getDailyStats
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSessionContext() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSessionContext must be used within a SessionProvider');
  }
  return context;
}
