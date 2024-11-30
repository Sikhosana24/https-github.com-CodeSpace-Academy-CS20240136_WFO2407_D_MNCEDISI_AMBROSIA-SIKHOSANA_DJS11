import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import AudioPlayer from './AudioPlayer';
import { Episode } from '../types/Show';

const Favorites: React.FC = () => {
  const { favorites, removeFavorite } = useFavorites();
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'recent' | 'oldest'>('asc');

  const sortedFavorites = [...favorites].sort((a, b) => {
    switch (sortOrder) {
      case 'asc':
        return a.title.localeCompare(b.title);
      case 'desc':
        return b.title.localeCompare(a.title);
      case 'recent':
        return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      case 'oldest':
        return new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
      default:
        return 0;
    }
  });

  const groupedFavorites = sortedFavorites.reduce((acc, episode) => {
    const key = `${episode.showId}-${episode.season}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(episode);
    return acc;
  }, {} as Record<string, Episode[]>);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Favorites</h1>
      {favorites.length === 0 ? (
        <p>You haven't added any favorites yet.</p>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-1">Sort by:</label>
            <select
              id="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | 'recent' | 'oldest')}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="asc">Title (A-Z)</option>
              <option value="desc">Title (Z-A)</option>
              <option value="recent">Most Recently Added</option>
              <option value="oldest">Oldest Added</option>
            </select>
          </div>
          {Object.entries(groupedFavorites).map(([key, episodes]) => {
            const [showId, season] = key.split('-');
            const firstEpisode = episodes[0];
            return (
              <div key={key} className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                  <Link to={`/show/${showId}`} className="text-blue-500 hover:underline">
                    {firstEpisode.showTitle}
                  </Link>
                  {' - '}
                  Season {season}
                </h2>
                <ul className="space-y-4">
                  {episodes.map((episode) => (
                    <li key={episode.id} className="bg-white shadow-md rounded-lg p-4">
                      <h3 className="text-xl font-semibold mb-2">{episode.title}</h3>
                      <p className="text-gray-600 mb-2">{episode.description}</p>
                      <p className="text-sm text-gray-500 mb-4">Added on: {new Date(episode.addedAt).toLocaleDateString()}</p>
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => setCurrentEpisode(episode)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                          Play
                        </button>
                        <button
                          onClick={() => removeFavorite(episode.id)}
                          className="text-red-500 hover:text-red-600 transition-colors"
                        >
                          Remove from favorites
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </>
      )}
      {currentEpisode && (
        <AudioPlayer
          episode={currentEpisode}
          onClose={() => setCurrentEpisode(null)}
        />
      )}
    </div>
  );
};

export default Favorites;

