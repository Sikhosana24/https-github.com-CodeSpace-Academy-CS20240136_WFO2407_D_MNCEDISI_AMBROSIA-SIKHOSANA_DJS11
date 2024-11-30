import { Show } from '../types/Show';

const API_BASE_URL = 'https://podcast-api.netlify.app';

export const fetchShows = async (): Promise<Show[]> => {
  const response = await fetch(`${API_BASE_URL}/shows`);
  if (!response.ok) {
    throw new Error('Failed to fetch shows');
  }
  return response.json();
};

export const fetchShowDetails = async (id: string): Promise<Show> => {
  const response = await fetch(`${API_BASE_URL}/id/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch show details');
  }
  return response.json();
};

