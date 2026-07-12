# HealthWatch App - Testing Documentation

## Resumen

Suite de tests unitarios para la aplicación HealthWatch (React Native / Expo SDK 54).

- **Total de tests:** 66
- **Suites:** 10
- **Framework:** Jest 51 con `@testing-library/react-native` v12
- **Cobertura:** utils, constants, config, services, context, validación de archivos de screens

## Ejecución

```bash
npx jest              # todos los tests
npx jest --no-cache   # sin cache (útil si hay cambios en mocks)
npx jest --coverage   # con reporte de cobertura
```

## Estructura de Tests

```
__tests__/
├── utils/
│   └── i18n.test.ts          # Tests de internacionalización
├── constants/
│   └── styles.test.ts        # Tests de constantes de estilo
├── config/
│   └── firebase.test.ts      # Tests de configuración de Firebase
├── services/
│   ├── authService.test.ts   # Tests de autenticación (login, register, logout, google)
│   └── apiService.test.ts    # Tests de API REST (GET, POST, PUT, DELETE)
├── context/
│   ├── LanguageContext.test.tsx   # Tests del proveedor de idioma
│   ├── PacienteContext.test.tsx   # Tests del proveedor de pacientes
│   ├── TelemetriaContext.test.tsx # Tests del proveedor de telemetría
│   └── NotificationContext.test.tsx # Tests del proveedor de notificaciones
└── app/
    └── screens.test.ts       # Validación de existencia de archivos de screens
```

## Detalle por Suite

### 1. `utils/i18n.test.ts` (7 tests)
- Verifica la estructura de traducciones (ES y EN)
- Verifica que `t()` retorna la clave si no hay traducción
- Verifica que las claves `common` están en ambos idiomas
- Verifica interpolación correcta de `{{key}}`
- Verifica `initI18n()` sin/setLocale guardado
- Verifica `setLocale()` cambia el locale

### 2. `constants/styles.test.ts` (6 tests)
- Verifica que `Colors` contiene todos los colores esperados
- Verifica que `globalStyles` contiene estilos específicos

### 3. `config/firebase.test.ts` (2 tests)
- Verifica que `auth` se exporta
- Verifica que `getIdToken` retorna un token mockeado

### 4. `services/authService.test.ts` (7 tests)
- `login`: éxito y error
- `register`: éxito y error
- `logout`: éxito
- `googleLogin`: éxito y error

### 5. `services/apiService.test.ts` (9 tests)
- GET sin headers, GET con headers
- POST sin body, POST con body
- PUT sin body, PUT con body
- DELETE
- Manejo de error 404

### 6. `context/LanguageContext.test.tsx` (5 tests)
- Provider renderiza children
- Provider usa locale por defecto
- `useLanguage` retorna valores por defecto fuera del provider
- `changeLanguage` cambia idioma y persiste
- `changeLanguage` con idioma inválido no cambia

### 7. `context/PacienteContext.test.tsx` (6 tests)
- Provider renderiza children
- Pacientes se cargan desde API
- `addPaciente` llama a API y actualiza estado
- `updatePaciente` llama a API y actualiza estado
- `deletePaciente` llama a API y actualiza estado
- Error en API carga lista vacía

### 8. `context/TelemetriaContext.test.tsx` (7 tests)
- Provider renderiza children
- Valores iniciales correctos
- Sensores no disponibles en test env
- `toggleMonitoreo` alterna estado
- `guardarEnLocalStorage` persiste en AsyncStorage
- `cargarDeLocalStorage` carga desde AsyncStorage
- `limpiarDatosLocales` limpia AsyncStorage
- Limitar datos a 100 entradas

### 9. `context/NotificationContext.test.tsx` (5 tests)
- Provider renderiza children
- Estado inicial correcto
- `solicitarPermiso` retorna false (mock)
- `programarNotificacionLocal` registra notificación (no expone estado)
- `cancelarNotificacionesLocales` cancela notificaciones

### 10. `app/screens.test.ts` (12 tests)
- Verifica que los 12 archivos de screens existen en `app/`

## Configuración

### `jest.config.js`
- Preset: `react-native`
- Transform ignore: `node_modules/(?!(@react-native|react-native|expo-router|react-native-vector-icons)/)`
- Module name mapper: `@/` -> `<rootDir>/`
- Setup file: `./jest.setup.js`

### `jest.setup.js`
- Mock global de `@react-native-async-storage/async-storage`
- Mock de `../config/firebase` para auth

### Mocks
- `__mocks__/` contiene mocks para: expo-router, expo-localization, expo-notifications, expo-device, expo-constants, expo-image, expo-font, expo-linking, expo-haptics, expo-system-ui, expo-web-browser, expo-splash-screen, expo-symbols, expo-status-bar, react-native-vector-icons, react-native-chart-kit

## Notas

- Los tests de screens evitan renderizar componentes nativos por limitaciones del entorno de testing con Expo SDK 54
- `@testing-library/react-native` v12 se usa en lugar de v14 por compatibilidad con `react-test-renderer`
- Los warnings de `act(...)` en context tests son esperados y no afectan la validez de los tests
- No hay modificación del código fuente de la aplicación
