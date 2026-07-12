import { apiService } from '../../services/apiService';

const mockFetch = jest.fn();
global.fetch = mockFetch;

const mockGetIdToken = jest.fn();
const mockCurrentUser = {
  uid: 'test-uid',
  email: 'test@test.com',
  getIdToken: mockGetIdToken,
};

jest.mock('../../config/firebase', () => ({
  auth: {
    currentUser: null as any,
  },
}));

const setCurrentUser = (user: any) => {
  const { auth } = require('../../config/firebase');
  auth.currentUser = user;
};

beforeEach(() => {
  jest.clearAllMocks();
  mockGetIdToken.mockResolvedValue('mock-id-token');
});

describe('apiService', () => {
  describe('autenticación', () => {
    it('lanza error si no hay usuario autenticado en GET', async () => {
      setCurrentUser(null);
      await expect(apiService.get('/api/test')).rejects.toThrow(
        'Usuario no autenticado',
      );
    });

    it('lanza error si no hay usuario autenticado en POST', async () => {
      setCurrentUser(null);
      await expect(apiService.post('/api/test', {})).rejects.toThrow(
        'Usuario no autenticado',
      );
    });

    it('lanza error si no hay usuario autenticado en PUT', async () => {
      setCurrentUser(null);
      await expect(apiService.put('/api/test', {})).rejects.toThrow(
        'Usuario no autenticado',
      );
    });

    it('lanza error si no hay usuario autenticado en DELETE', async () => {
      setCurrentUser(null);
      await expect(apiService.delete('/api/test')).rejects.toThrow(
        'Usuario no autenticado',
      );
    });
  });

  describe('GET', () => {
    beforeEach(() => {
      setCurrentUser(mockCurrentUser);
    });

    it('hace fetch con método GET, headers correctos y retorna JSON', async () => {
      const mockResponse = { pacientes: [{ id: 1, nombre: 'Paciente 1' }] };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService.get('/api/pacientes/');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://healthwatch-backend.onrender.com/api/pacientes/',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-id-token',
          },
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it('lanza error si response no es ok', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 401,
      });
      await expect(apiService.get('/api/pacientes/')).rejects.toThrow(
        'Error: 401',
      );
    });
  });

  describe('POST', () => {
    beforeEach(() => {
      setCurrentUser(mockCurrentUser);
    });

    it('hace fetch con método POST y body JSON', async () => {
      const postData = { nombre: 'Med 1', horas: ['08:00'], frecuencia: 'daily' };
      const mockResponse = { id: 'new-id', ...postData };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await apiService.post('/api/medicamentos/123', postData);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://healthwatch-backend.onrender.com/api/medicamentos/123',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-id-token',
          },
          body: JSON.stringify(postData),
        },
      );
      expect(result).toEqual(mockResponse);
    });

    it('lanza error si POST falla', async () => {
      mockFetch.mockResolvedValue({
        ok: false,
        status: 500,
      });
      await expect(apiService.post('/api/test', {})).rejects.toThrow(
        'Error: 500',
      );
    });
  });

  describe('PUT', () => {
    beforeEach(() => {
      setCurrentUser(mockCurrentUser);
    });

    it('hace fetch con método PUT y retorna JSON', async () => {
      const putData = { pasos_diarios: 5000 };
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(putData),
      });

      const result = await apiService.put('/api/actividad-fisica/123', putData);
      expect(mockFetch).toHaveBeenCalledWith(
        'https://healthwatch-backend.onrender.com/api/actividad-fisica/123',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-id-token',
          },
          body: JSON.stringify(putData),
        },
      );
      expect(result).toEqual(putData);
    });
  });

  describe('DELETE', () => {
    beforeEach(() => {
      setCurrentUser(mockCurrentUser);
    });

    it('hace fetch con método DELETE', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: 'deleted' }),
      });

      const result = await apiService.delete('/api/medicamentos/123/med-1');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://healthwatch-backend.onrender.com/api/medicamentos/123/med-1',
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer mock-id-token',
          },
        },
      );
      expect(result).toEqual({ message: 'deleted' });
    });
  });
});
