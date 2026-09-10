# API Profesor

## 1. Perfil del Profesor (/profesor)

*Todos los endpoints requieren el header Authorization: Bearer <accessToken>.*

### PUT /profesor/me
Actualiza los datos del perfil del profesor autenticado.

**Request Schema:**
`json
{
  "type": "object",
  "properties": {
    "nombre": { "type": "string" },
    "apellido": { "type": "string" },
    "email": { "type": "string", "format": "email" }
  }
}
`

**Response 200 (Success):**
`json
{
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "nombre": { "type": "string" },
    "apellido": { "type": "string" },
    "email": { "type": "string" },
    "googleId": { "type": "string" }
  }
}
`

**Response 401 (Unauthorized):**
No autorizado (token JWT faltante o expirado).
