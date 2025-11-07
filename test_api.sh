#!/bin/bash

# Script de pruebas API con curl
# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:8000/api"
USER_TOKEN=""
ADMIN_TOKEN=""

echo "=========================================="
echo "Pruebas API - XpressUTC"
echo "=========================================="
echo ""

# Función para hacer peticiones y mostrar resultados
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local token=$4
    local description=$5
    
    echo -e "${YELLOW}▶ $description${NC}"
    echo "  $method $endpoint"
    
    if [ -n "$token" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            -H "Authorization: Bearer $token" \
            ${data:+-d "$data"})
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -H "Accept: application/json" \
            ${data:+-d "$data"})
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "  ${GREEN}✓ HTTP $http_code${NC}"
        echo "$body" | jq '.' 2>/dev/null || echo "$body" | head -10
    else
        echo -e "  ${RED}✗ HTTP $http_code${NC}"
        echo "$body" | head -10
    fi
    echo ""
}

echo "=========================================="
echo "1. AUTENTICACIÓN DE USUARIOS"
echo "=========================================="

# Registrar usuario
test_endpoint "POST" "/auth/register" '{
  "name": "Juan Pérez",
  "email": "21000001@alumno.utc.edu.mx",
  "password": "password123",
  "password_confirmation": "password123",
  "user_type": "student",
  "phone": "8441234567"
}' "" "Registrar usuario estudiante"

# Extraer token (simplificado - en producción usar jq)
USER_TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{"email":"21000001@alumno.utc.edu.mx","password":"password123"}' | \
    grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -n "$USER_TOKEN" ]; then
    echo -e "${GREEN}✓ Token de usuario obtenido${NC}"
    echo "  Token: ${USER_TOKEN:0:20}..."
    echo ""
else
    echo -e "${RED}✗ No se pudo obtener token${NC}"
    echo ""
fi

# Login
test_endpoint "POST" "/auth/login" '{
  "email": "21000001@alumno.utc.edu.mx",
  "password": "password123"
}' "" "Login de usuario"

# Obtener usuario autenticado
test_endpoint "GET" "/auth/me" "" "$USER_TOKEN" "Obtener usuario autenticado"

echo "=========================================="
echo "2. PRODUCTOS Y CATEGORÍAS (Públicos)"
echo "=========================================="

# Listar categorías
test_endpoint "GET" "/categories" "" "" "Listar categorías"

# Listar productos
test_endpoint "GET" "/products" "" "" "Listar productos"

echo "=========================================="
echo "3. AUTENTICACIÓN DE ADMINISTRADORES"
echo "=========================================="

# Login admin (necesitamos crear un admin primero)
echo -e "${YELLOW}⚠ Necesitamos crear un admin primero${NC}"
echo ""

echo "=========================================="
echo "4. CARRITO (Requiere Autenticación)"
echo "=========================================="

# Obtener carrito
test_endpoint "GET" "/cart" "" "$USER_TOKEN" "Obtener carrito"

# Resumen del carrito
test_endpoint "GET" "/cart/summary" "" "$USER_TOKEN" "Resumen del carrito"

echo "=========================================="
echo "5. ÓRDENES (Requiere Autenticación)"
echo "=========================================="

# Listar órdenes
test_endpoint "GET" "/orders" "" "$USER_TOKEN" "Listar mis órdenes"

echo ""
echo "=========================================="
echo "Pruebas completadas"
echo "=========================================="

