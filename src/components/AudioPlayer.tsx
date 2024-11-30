import React, { useState, useEffect, useRef } from 'react';
import { Episode } from '../types/Show';
import { useListeningProgress } from '../contexts/ListeningProgressContext';

interface AudioPlayerProps {
  episode: Episode;
  onClose: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ episode, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { updateProgress } = useListeningProgress();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateAudioProgress = () => {
      if (audio.duration) {
        const currentProgress = (audio.currentTime / audio.duration) * 100;
        setProgress(currentProgress);
        updateProgress(episode.id, currentProgress);
      }
    };

    audio.addEventListener('timeupdate', updateAudioProgress);
    return () => audio.removeEventListener('timeupdate', updateAudioProgress);
  }, [episode.id, updateProgress]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isPlaying) {
        event.preventDefault();
        event.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isPlaying]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
        <div className="flex-1 mr-4 text-center sm:text-left">
          <h3 className="font-semibold truncate">{episode.title}</h3>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={togglePlayPause}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full sm:w-auto"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <div className="w-full sm:w-64 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">
            {Math.round(progress)}%
          </span>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={episode.file}
        onEnded={() => setIsPlaying(false)}
      />
    </div>
  );
};

export default AudioPlayer;

