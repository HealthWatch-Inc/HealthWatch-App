import { auth } from '../config/firebase';

const API_BASE_URL = 'https://healthwatch-backend.onrender.com';

export const apiService = {
  // GET
  get: async (endpoint: string) => {
    if (!auth.currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const token = await auth.currentUser.getIdToken(true);

    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, 20000);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      return await response.json();
    } finally {
      clearTimeout(timeout);
    }
  },

  // POST
  post: async (endpoint: string, data: any) => {
    try {
      if (!auth.currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      const token = await auth.currentUser.getIdToken(true);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // PUT
  put: async (endpoint: string, data: any) => {
    try {
      if (!auth.currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      const token = await auth.currentUser.getIdToken(true);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // DELETE
  delete: async (endpoint: string) => {
    try {
      if (!auth.currentUser) {
        throw new Error('Usuario no autenticado');
      }
      
      const token = await auth.currentUser.getIdToken(true);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      return await response.json();
    } catch (error) {
      throw error;
    }
  },
};
