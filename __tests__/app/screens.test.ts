const fs = require('fs');
const path = require('path');

describe('app screens - file existence validation', () => {
  const appDir = path.join(__dirname, '../../app');

  const expectedFiles = [
    'index.tsx',
    'InicioSesionScreen.tsx',
    'CrearCuentaScreen.tsx',
    'MisPacientesScreen.tsx',
    'PrincipalScreen.tsx',
    'SignosVitalesScreen.tsx',
    'ActividadFisicaScreen.tsx',
    'AlertasScreen.tsx',
    'ContactosScreen.tsx',
    'AjustesScreen.tsx',
    '_layout.tsx',
    'footernav.tsx',
  ];

  expectedFiles.forEach(file => {
    it(`archivo ${file} existe`, () => {
      const filePath = path.join(appDir, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });
});
