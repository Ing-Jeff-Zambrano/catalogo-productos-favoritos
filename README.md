# Catálogo de productos con favoritos y roles

API REST con Node.js, Express y PostgreSQL. Gestiona un catálogo de productos, autenticación JWT y favoritos personales con autorización por roles.

## Integrantes

- Ing-Jeff-Zambrano (`jzambranoj8@unemi.edu.ec`)
- Piloso-Mayerly (`pilosomayerli@gmail.com`)

## Propósito

Demostrar una API con:

- consulta pública del catálogo
- escritura de productos solo para administrador
- favoritos aislados por usuario autenticado
- validaciones y códigos HTTP coherentes
- persistencia en PostgreSQL

## Elección de base de datos

Se eligió **PostgreSQL** con el driver `pg` porque el dominio es relacional (usuarios, productos y favoritos). Las claves foráneas, el `UNIQUE (usuario_id, producto_id)` y el `ON DELETE CASCADE` mantienen la consistencia al eliminar un producto.

## Requisitos

- Node.js 18+
- PostgreSQL 14+
- npm
- Postman (para ejecutar la colección)

## Instalación

```bash
git clone https://github.com/Ing-Jeff-Zambrano/catalogo-productos-favoritos.git
cd catalogo-productos-favoritos
npm install
cp .env.example .env
```

Edita `.env` con tu `DATABASE_URL` y un `JWT_SECRET` propio.

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `PORT` | Puerto HTTP (default `3000`) |
| `DATABASE_URL` | Cadena de conexión PostgreSQL |
| `JWT_SECRET` | Secreto para firmar tokens |
| `JWT_EXPIRES_IN` | Expiración del JWT (ej. `1h`) |
| `ADMIN_NOMBRE` | Nombre del admin (script) |
| `ADMIN_CORREO` | Correo del admin (script) |
| `ADMIN_PASSWORD` | Contraseña del admin (script) |

Nunca subas el archivo `.env` real.

## Inicialización de la base de datos

1. Crea la base, por ejemplo `catalogo_favoritos`.
2. Aplica el esquema:

```bash
psql -U postgres -d catalogo_favoritos -f src/db/schema.sql
```

3. Carga productos de ejemplo (≥ 5):

```bash
npm run db:seed
```

4. Crea el administrador (no se puede asignar ese rol desde el registro público):

```bash
npm run db:create-admin
```

Por defecto crea `admin@catalogo.local` / `Admin123!` (configurable por variables de entorno).

### Consistencia al eliminar un producto

Al borrar un producto, sus favoritos asociados se eliminan en cascada (`ON DELETE CASCADE`) para evitar referencias huérfanas.

## Ejecución

```bash
npm run dev
# o
npm start
```

Health check: `GET http://localhost:3000/api/health`

## Rutas principales

Prefijo `/api`.

| Método y ruta | Acceso | Descripción |
|---------------|--------|-------------|
| `POST /auth/registro` | Público | Registra usuario con rol `usuario` |
| `POST /auth/login` | Público | Emite JWT |
| `GET /productos` | Público | Lista / filtra por `?categoria=` |
| `GET /productos/:id` | Público | Consulta un producto |
| `POST /productos` | Admin | Crea producto |
| `PUT /productos/:id` | Admin | Actualiza producto |
| `DELETE /productos/:id` | Admin | Elimina producto |
| `GET /favoritos` | Autenticado | Lista favoritos propios |
| `POST /favoritos` | Autenticado | Agrega favorito (`productoId` en body) |
| `DELETE /favoritos/:productoId` | Autenticado | Quita favorito propio |

### Criterio de errores

- `400` datos inválidos (campos vacíos, precio ≤ 0, UUID inválido, correo mal formado)
- `401` sin token, token inválido o vencido
- `403` autenticado pero sin rol administrador
- `404` recurso inexistente
- `409` correo o favorito duplicado
- `201` creación, `200` consulta/actualización, `204` eliminación sin cuerpo

La identidad de favoritos se toma **solo del JWT**; no se confía en un `usuarioId` enviado por el cliente.

## Pruebas con Postman

1. Importa `postman/Catalogo-Favoritos.postman_collection.json`
2. Importa `postman/Catalogo-Favoritos.postman_environment.json`
3. Selecciona el entorno **Catalogo Favoritos Local**
4. Asegura que el servidor y el admin existan
5. Ejecuta la colección (Runner) y revisa las aserciones

Para evidenciar persistencia: crea/consulta datos, reinicia Node y vuelve a consultar.

## Estructura del proyecto

```text
src/
  config/         # entorno y conexión PostgreSQL
  controllers/    # lógica HTTP
  data/           # acceso a datos (consultas parametrizadas)
  db/schema.sql   # esquema SQL
  middlewares/    # JWT y rol admin
  routes/         # rutas Express
  scripts/        # seed y create-admin
  utils/          # helpers JWT
  app.js
  server.js
postman/          # colección y entorno de ejemplo
```

## Aportes

- **Jeff:** scaffold inicial, autenticación JWT y control de roles
- **Mayerly:** seed/admin/CRUD de productos, favoritos, Postman y documentación
