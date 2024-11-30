import React, { createContext, useState, useContext, useEffect } from 'react';

interface ListeningProgress {
  [episodeId: number]: number;
}

interface ListeningProgressContextType {
  progress: ListeningProgress;
  updateProgress: (episodeId: number, progress: number) => void;
  isCompleted: (episodeId: number) => boolean;
  resetProgress: () => void;
}

const ListeningProgressContext = createContext<ListeningProgressContextType | undefined>(undefined);

export const useListeningProgress = () => {
  const context = useContext(ListeningProgressContext);
  if (!context) {
    throw new Error('useListeningProgress must be used within a ListeningProgressProvider');
  }
  return context;
};

export const ListeningProgressProvider: React.FC = ({ children }) => {
  const [progress, setProgress] = useState<ListeningProgress>(() => {
    const savedProgress = localStorage.getItem('listeningProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  useEffect(() => {
    localStorage.setItem('listeningProgress', JSON.stringify(progress));
  }, [progress]);

  const updateProgress = (episodeId: number, currentProgress: number) => {
    setProgress((prev) => ({
      ...prev,
      [episodeId]: currentProgress
    }));
  };

  const isCompleted = (episodeId: number) => {
    return progress[episodeId] >= 90; // Consider an episode completed if 90% or more has been listened to
  };

  const resetProgress = () => {
    setProgress({});
  };

  return (
    <ListeningProgressContext.Provider value={{ progress, updateProgress, isCompleted, resetProgress }}>
      {children}
    </ListeningProgressContext.Provider>
  );
};

