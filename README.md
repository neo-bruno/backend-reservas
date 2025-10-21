# Bookly API 🟢

Backend del sistema de reservas **Bookly**, diseñado para gestionar disponibilidad y reservas de múltiples negocios: hoteles, peluquerías, saunas, médicos privados, etc.

Este proyecto está desarrollado con **Node.js**, **Express** y **PostgreSQL**, siguiendo buenas prácticas de estructura modular.

---

## 📂 Estructura del proyecto

│
├── app/ # Rutas, controladores y modelos
├── config/ # Configuración de la base de datos y variables
├── schemas/ # Scripts SQL de creación de tablas
├── server.js # Archivo principal del servidor
├── package.json
├── .env # Variables de entorno (no subir a GitHub)
├── .gitignore


---

## ⚙️ Requisitos

- Node.js >= 18.x
- npm >= 9.x
- PostgreSQL 9.x o superior
- Git

---

## 🔧 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/neo-bruno/backend-reservas.git
cd backend-reservas

npm install

DB_USER=postgres
DB_PASS=tu_password
DB_HOST=localhost
DB_NAME=bookly_db
PORT=7000
JWT_SECRET=tu_clave_secreta

psql -U postgres -d bookly_db -f schemas/schemas_v2.sql
