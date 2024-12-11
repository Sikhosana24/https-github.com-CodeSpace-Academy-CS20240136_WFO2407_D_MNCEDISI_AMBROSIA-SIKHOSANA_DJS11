// src/context/AudioPlayerContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface AudioPlayerContextProps {
  currentTrack: string;
  isPlaying: boolean;
  playTrack: (track: string, episodeId: string) => void;
  pauseTrack: () => void;
  listenedEpisodes: string[];
  resetListeningHistory: () => void;
}

export const AudioPlayerContext = createContext<AudioPlayerContextProps | undefined>(undefined);

export const AudioPlayerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [listenedEpisodes, setListenedEpisodes] = useState<string[]>(() => {
    const storedEpisodes = localStorage.getItem('listenedEpisodes');
    return storedEpisodes ? JSON.parse(storedEpisodes) : [];
  });

  const playTrack = (track: string, episodeId: string) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (!listenedEpisodes.includes(episodeId)) {
      setListenedEpisodes([...listenedEpisodes, episodeId]);
    }
  };

  const pauseTrack = () => {
    setIsPlaying(false);
  };

  const resetListeningHistory = () => {
    setListenedEpisodes([]);
    localStorage.removeItem('listenedEpisodes');
  };

  useEffect(() => {
    localStorage.setItem('listenedEpisodes', JSON.stringify(listenedEpisodes));
  }, [listenedEpisodes]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isPlaying) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isPlaying]);

  return (
    <AudioPlayerContext.Provider value={{ currentTrack, isPlaying, playTrack, pauseTrack, listenedEpisodes, resetListeningHistory }}>
      {children}
    </AudioPlayerContext.Provider>
  );
};