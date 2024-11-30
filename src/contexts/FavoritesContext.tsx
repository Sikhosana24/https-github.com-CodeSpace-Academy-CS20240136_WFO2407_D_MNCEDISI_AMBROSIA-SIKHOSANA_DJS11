import React, { createContext, useState, useContext, useEffect } from 'react';
import { Episode } from '../types/Show';

interface FavoriteEpisode extends Episode {
  addedAt: string;
  showTitle: string;
  showId: string;
}

interface FavoritesContextType {
  favorites: FavoriteEpisode[];
  addFavorite: (episode: Episode, showTitle: string, showId: string) => void;
  removeFavorite: (episodeId: number) => void;
  isFavorite: (episodeId: number) => boolean;
  clearFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteEpisode[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  });

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (episode: Episode, showTitle: string, showId: string) => {
    setFavorites((prev) => [
      ...prev,
      { ...episode, addedAt: new Date().toISOString(), showTitle, showId }
    ]);
  };

  const removeFavorite = (episodeId: number) => {
    setFavorites((prev) => prev.filter((ep) => ep.id !== episodeId));
  };

  const isFavorite = (episodeId: number) => {
    return favorites.some((ep) => ep.id === episodeId);
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

