import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Show } from '../types/Show';
import { fetchShows } from '../utils/api';
import LoadingSpinner from './LoadingSpinner';

const genreTitles: { [key: number]: string } = {
  1: 'Personal Growth',
  2: 'Investigative Journalism',
  3: 'History',
  4: 'Comedy',
  5: 'Entertainment',
  6: 'Business',
  7: 'Fiction',
  8: 'News',
  9: 'Kids and Family'
};

const ShowList: React.FC = () => {
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'recent' | 'oldest'>('asc');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);

  useEffect(() => {
    const loadShows = async () => {
      try {
        setIsLoading(true);
        const fetchedShows = await fetchShows();
        setShows(fetchedShows);
      } catch (err) {
        setError('Failed to fetch shows. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    loadShows();
  }, []);

  const sortedAndFilteredShows = shows
    .filter(show => !selectedGenre || show.genres.includes(selectedGenre))
    .sort((a, b) => {
      switch (sortOrder) {
        case 'asc':
          return a.title.localeCompare(b.title);
        case 'desc':
          return b.title.localeCompare(a.title);
        case 'recent':
          return new Date(b.updated).getTime() - new Date(a.updated).getTime();
        case 'oldest':
          return new Date(a.updated).getTime() - new Date(b.updated).getTime();
        default:
          return 0;
      }
    });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Podcast Shows</h1>
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-auto">
          <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-1">Sort by:</label>
          <select
            id="sort-select"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc' | 'recent' | 'oldest')}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="asc">Title (A-Z)</option>
            <option value="desc">Title (Z-A)</option>
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        <div className="w-full sm:w-auto">
          <label htmlFor="genre-select" className="block text-sm font-medium text-gray-700 mb-1">Filter by Genre:</label>
          <select
            id="genre-select"
            value={selectedGenre || ''}
            onChange={(e) => setSelectedGenre(e.target.value ? Number(e.target.value) : null)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">All Genres</option>
            {Object.entries(genreTitles).map(([id, title]) => (
              <option key={id} value={id}>{title}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedAndFilteredShows.map((show) => (
          <Link
            key={show.id}
            to={`/show/${show.id}`}
            className="card bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <img
              src={show.image}
              alt={show.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-xl mb-2">{show.title}</h3>
              <p className="text-gray-700 text-base mb-2">{show.description}</p>
              <p className="text-sm text-gray-600">Seasons: {show.seasons}</p>
              <p className="text-sm text-gray-600">
                Last updated: {new Date(show.updated).toLocaleDateString()}
              </p>
              <div className="mt-2 flex flex-wrap">
                {show.genres.map((genreId) => (
                  <span
                    key={genreId}
                    className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                  >
                    {genreTitles[genreId]}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ShowList;

