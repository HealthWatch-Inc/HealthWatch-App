# Historias de Usuario - SmartWatch Inteligente de Atención Geriátrica

Este documento contiene la especificación de las Historias de Usuario (HUs) del proyecto, organizadas de acuerdo con el cronograma y los objetivos de cada Sprint.

---

### HISTORIA DE USUARIO 1 (Sprint 1)

| Campo | Detalle |
| :--- | :--- |
| **Código** | HU-01 |
| **Nombre** | Autenticación Segura y Acceso al Sistema |
| **Owner** | Jorge Gamarra |
| **Prioridad** | 10 |
| **Esfuerzo** | Alta |
| **Proyecto** | SmartWatch Inteligente de Atención Geriátrica |
| **Sprint** | Sprint 1 |
| **Roles** | • Cuidador<br>• Familiar / Adulto mayor |
| **Descripción** | El ingreso al sistema se realiza a través de credenciales seguras. Como cuidador, quiero autenticarme en la aplicación mediante proveedores de identidad (OAuth 2.0 / OpenID Connect) para asegurar la privacidad de la información sensible y el historial de salud de los pacientes a mi cargo. |
| | El sistema debe permitir el registro de nuevos usuarios, validar la persistencia de la sesión activa en el dispositivo móvil para evitar logueos constantes y desplegar una pantalla de carga (Splash Screen) mientras se verifica el estado de la sesión actual. |
| **Tareas** | 1. Configurar entorno React Native y realización de wireframes.<br>2. Implementar login/registro con Firebase Auth (OAuth 2.0).<br>3. Diseñar pantalla de carga y persistencia de sesión. |

---

### HISTORIA DE USUARIO 2 (Sprint 1)

| Campo | Detalle |
| :--- | :--- |
| **Código** | HU-02 |
| **Nombre** | Visualización de Signos Vitales en Tiempo Real |
| **Owner** | Jorge Gamarra |
| **Prioridad** | 10 |
| **Esfuerzo** | Alta |
| **Proyecto** | SmartWatch Inteligente de Atención Geriátrica |
| **Sprint** | Sprint 1 |
| **Roles** | • Cuidador<br>• Familiar / Adulto mayor |
| **Descripción** | Como usuario (cuidador o familiar), quiero visualizar los signos vitales del adulto mayor en tiempo real a través de un Dashboard interactivo, con la finalidad de monitorear su estado de salud actual de forma constante y preventiva. |
| | El sistema consumirá los endpoints REST del backend móvil para recibir de manera continua las métricas biométricas procesadas (frecuencia cardíaca, SpO2) y los datos del acelerómetro provenientes del prototipo IoT (Smartwatch). |
| **Tareas** | 1. Configurar cliente Firebase para recibir datos del backend.<br>2. Implementar Dashboard con visualización de los sensores.<br>3. Validar recepción de datos en tiempo real desde el prototipo IoT. |

---

### HISTORIA DE USUARIO 3 (Sprint 2)

| Campo | Detalle |
| :--- | :--- |
| **Código** | HU-03 |
| **Nombre** | Sistema de Alertas Inteligentes y Notificaciones Push |
| **Owner** | Jorge Gamarra |
| **Prioridad** | 10 |
| **Esfuerzo** | Alta |
| **Proyecto** | SmartWatch Inteligente de Atención Geriátrica |
| **Sprint** | Sprint 2 |
| **Roles** | • Cuidador |
| **Descripción** | Como cuidador, quiero recibir notificaciones push inmediatas en mi aplicación móvil cuando el modelo de IA/Machine Learning (desplegado en el backend) detecte una anomalía crítica o una caída del adulto mayor, para actuar de urgencia y mitigar riesgos físicos o accidentes graves. |
| | Al recibir la alerta, la aplicación debe interrumpir la interfaz con un pop-up de emergencia detallado que muestre visualmente la ubicación exacta en tiempo real del paciente (integración con redes de salud/Smart Living). |
| **Tareas** | 1. Configurar servicios de mensajería (FCM) en la aplicación móvil.<br>2. Implementar lógica de recepción de alertas del modelo ML.<br>3. Diseñar pop-ups de emergencia con ubicación del paciente. |

---

### HISTORIA DE USUARIO 4 (Sprint 2)

| Campo | Detalle |
| :--- | :--- |
| **Código** | HU-04 |
| **Nombre** | Seguimiento Histórico y Reportes Estadísticos |
| **Owner** | Jorge Gamarra |
| **Prioridad** | 9 |
| **Esfuerzo** | Media |
| **Proyecto** | SmartWatch Inteligente de Atención Geriátrica |
| **Sprint** | Sprint 2 |
| **Roles** | • Cuidador<br>• Familiar / Adulto mayor |
| **Descripción** | Como cuidador o familiar, quiero ver gráficos estadísticos e históricos en la sección de perfil del paciente para analizar de manera minuciosa la evolución de su salud y comportamiento biométrico durante intervalos específicos. |
| | La aplicación debe consumir el histórico del servidor web y procesar los datos utilizando librerías de componentes gráficos móviles, permitiendo al usuario aplicar filtros dinámicos para segmentar las métricas de salud por día y por semana. |
| **Tareas** | 1. Implementar librerías de gráficos (ej. react-native-chart-kit).<br>2. Consumir datos históricos del servidor de internet.<br>3. Crear filtros por día y semana para métricas de salud. |

---

### HISTORIA DE USUARIO 5 (Sprint 3)

| Campo | Detalle |
| :--- | :--- |
| **Código** | HU-05 |
| **Nombre** | Gestión y Control de Medicación |
| **Owner** | Jorge Gamarra |
| **Prioridad** | 9 |
| **Esfuerzo** | Media |
| **Proyecto** | SmartWatch Inteligente de Atención Geriátrica |
| **Sprint** | Sprint 3 |
| **Roles** | • Cuidador<br>• Familiar / Adulto mayor |
| **Descripción** | Como cuidador, quiero gestionar el cumplimiento del tratamiento médico mediante un cronograma interactivo de medicación, con el propósito de reducir drásticamente los riesgos por olvidos o dosis incorrectas en el adulto mayor. |
| | El usuario (o el propio paciente si tiene autonomía) interactuará con un checklist de confirmación de toma. Cada registro de cumplimiento o incumplimiento debe sincronizarse de inmediato con el backend para construir un patrón de cumplimiento clínico. |
| **Tareas** | 1. Desarrollar cronograma interactivo de medicación.<br>2. Implementar checklist de confirmación de toma.<br>3. Sincronizar registros de cumplimiento con el backend para análisis. |

---

### HISTORIA DE USUARIO 6 (Sprint 3)

| Campo | Detalle |
| :--- | :--- |
| **Código** | HU-06 |
| **Nombre** | Validación Integral del Ecosistema e Informe Técnico |
| **Owner** | Jorge Gamarra |
| **Prioridad** | 10 |
| **Esfuerzo** | Alta |
| **Proyecto** | SmartWatch Inteligente de Atención Geriátrica |
| **Sprint** | Sprint 3 |
| **Roles** | • Stakeholder |
| **Descripción** | Como stakeholder (evaluador académico o directivo del centro geriátrico), quiero ver una validación funcional del ecosistema completo (Smartwatch, IoT, modelo IA en Backend y Aplicación móvil) para evaluar técnicamente la precisión y la latencia del sistema bajo la metodología de Ciencia del Diseño. |
| | Se deben realizar pruebas rigurosas de integración de extremo a extremo, calculando métricas cuantitativas clave como el tiempo de respuesta urbana y la exactitud del algoritmo ante eventos críticos (detección de caídas). Los resultados consolidarán el informe técnico definitivo. |
| **Tareas** | 1. Ejecutar pruebas finales de integración Smartwatch-App.<br>2. Medir tiempos de respuesta en detección de caídas.<br>3. Preparar la presentación final y el informe técnico del proyecto. |
