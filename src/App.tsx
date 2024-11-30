import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ShowList from './components/ShowList';
import ShowDetails from './components/ShowDetails';
import Favorites from './components/Favorites';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ListeningProgressProvider } from './contexts/ListeningProgressContext';
import './index.css';

function App() {
  return (
    <FavoritesProvider>
      <ListeningProgressProvider>
        <Router>
          <div className="App min-h-screen bg-gray-100">
            <Helmet>
              <title>Podcast App</title>
              <meta name="description" content="Listen to your favorite podcasts and discover new shows." />
              <link rel="icon" href="/favicon.ico" />
              {/* Add more meta tags as needed */}
            </Helmet>
            <header className="bg-white shadow-md">
              <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-blue-600">Podcast App</Link>
                <nav>
                  <Link to="/" className="text-gray-600 hover:text-blue-600 mr-4">Home</Link>
                  <Link to="/favorites" className="text-gray-600 hover:text-blue-600">Favorites</Link>
                </nav>
              </div>
            </header>
            <main className="container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<ShowList />} />
                <Route path="/show/:id" element={<ShowDetails />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </main>
            <footer className="bg-white border-t mt-12">
              <div className="container mx-auto px-4 py-6 text-center text-gray-600">
                <p>&copy; 2023 Podcast App. All rights reserved.</p>
              </div>
            </footer>
          </div>
        </Router>
      </ListeningProgressProvider>
    </FavoritesProvider>
  );
}

export default App;

