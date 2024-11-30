import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Show, Episode } from '../types/Show';
import { fetchShowDetails } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';
import AudioPlayer from './AudioPlayer';
import { useFavorites } from '../contexts/FavoritesContext';
import { useListeningProgress } from '../contexts/ListeningProgressContext';

const ShowDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [show, setShow] = useState<Show | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { isCompleted, updateProgress } = useListeningProgress();

  useEffect(() => {
    const loadShowDetails = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const details = await fetchShowDetails(id);
        setShow(details);
        setSelectedSeason(details.seasons[0].season);
      } catch (err) {
        setError('Failed to fetch show details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadShowDetails();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!show) return <div>Show not found</div>;

  const currentSeason = show.seasons.find((s) => s.season === selectedSeason);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">← Back to Shows</Link>
      <h1 className="text-3xl font-bold mb-4">{show.title}</h1>
      <div className="flex flex-col md:flex-row md:space-x-6">
        <img
          src={show.image}
          alt={show.title}
          className="w-full md:w-1/3 max-w-md mx-auto mb-4 rounded-lg shadow-lg"
        />
        <div className="flex-1">
          <p className="text-gray-700 mb-6">{show.description}</p>
          <div className="mb-6">
            <label htmlFor="season-select" className="block text-sm font-medium text-gray-700 mb-2">
              Select Season:
            </label>
            <select
              id="season-select"
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {show.seasons.map((season) => (
                <option key={season.season} value={season.season}>
                  Season {season.season} ({season.episodes.length} episodes)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {currentSeason && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">
            Season {currentSeason.season}: {currentSeason.title}
          </h2>
          <img
            src={currentSeason.image}
            alt={`Season ${currentSeason.season}`}
            className="w-full max-w-md mx-auto mb-4 rounded-lg shadow-lg"
          />
          <ul className="space-y-4">
            {currentSeason.episodes.map((episode) => (
              <li key={episode.id} className="border p-4 rounded-lg shadow">
                <h3 className="font-semibold text-lg mb-2">{episode.title}</h3>
                <p className="text-gray-600 mb-2">{episode.description}</p>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
                  <button
                    onClick={() => {
                      setSelectedEpisode(episode);
                      updateProgress(episode.id, 0);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full sm:w-auto"
                  >
                    Play Episode
                  </button>
                  <button
                    onClick={() => isFavorite(episode.id) ? removeFavorite(episode.id) : addFavorite(episode, show.title, show.id)}
                    className={`px-4 py-2 rounded transition-colors w-full sm:w-auto ${
                      isFavorite(episode.id)
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {isFavorite(episode.id) ? 'Remove from Favorites' : 'Add to Favorites'}
                  </button>
                </div>
                {isCompleted(episode.id) && (
                  <p className="text-green-500 mt-2">✓ Listened</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedEpisode && (
        <AudioPlayer
          episode={selectedEpisode}
          onClose={() => setSelectedEpisode(null)}
        />
      )}
    </div>
  );
};

export default ShowDetails;

