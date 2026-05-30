# HealtWatch - SmartWatch Inteligente de Atención Geriátrica

## Descripción General

Esta plataforma IoT está diseñada para el monitoreo continuo de adultos mayores, mejorando la calidad de vida y optimizando la respuesta médica en centros especializados. El sistema integra hardware IoT (ESP32 con sensores biométricos y de movimiento), una capa de ingesta de datos en tiempo real, un backend con análisis de Machine Learning y una aplicación móvil para cuidadores.

Esta organización centraliza los componentes críticos del sistema:

- **App Móvil**: React Native (Expo) para el monitoreo y gestión de medicación.
- **IoT Firmware**: Lógica de control para ESP32.
- **Backend**: FastAPI para gestión de datos, usuarios y alertas.
- **Machine Learning**: Modelos predictivos para detección de anomalías y estabilidad.

## Repositorios del Proyecto

- [IoT Firmware](https://github.com/HealthWatch-Inc/HealthWatch-IoT)
- [Backend API](https://github.com/HealthWatch-Inc/HealthWatch-Backend)
- [Modelos ML](https://github.com/HealthWatch-Inc/HealthWatch-ML)

## Estructura del proyecto

- `README.md`: Este archivo.
- `docs/`:
  - `architecture.puml`: Diagrama general del sistema.
  - `hardware-connections.json`: Esquema de conexiones de sensores al ESP32 (Wokwi).
  - `user-stories.md`: Requerimientos funcionales del sistema.

## Componentes Teconológicos

- **Hardware**: ESP32, MAX30100 (HR/$SpO_2$), MPU6050 (Caídas), SSD1306 (OLED).
- **Infraestructura**: Mosquitto (Broker MQTT), Telegraf (Ingesta), InfluxDB 3 (Timeseries), Firebase (OAuth & Firestore).
- **Backend**: Python/FastAPI para lógica de negocio y consumo de modelos ML.
- **Frontend**: React Native + Expo para interfaz de usuario.
- **Visualización**: Grafana para analítica de administradores.

## Uso

1. **IoT**: Flashear firmware desde el repositorio IoT Firmware.

2. **Backend**: Ejecutar uvicorn main:app --reload tras configurar las variables de entorno de InfluxDB y Firebase.

3. **App**: Correr npx expo start para visualizar la app en el emulador o dispositivo físico.

## Autores

- Chavez Ccahuana Alvaro Andres
- Montenegro Cajahuaman Carlos Andres
- Obando Salinas Enmanuel Jose
- Torres Rivera Richard Maycol
- Vera Alva Miguel Angel
