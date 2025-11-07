#!/bin/bash

echo "=== Crear Base de Datos XpressUTC ==="
echo ""

# Intentar sin contraseña primero
mysql -u root -e "CREATE DATABASE IF NOT EXISTS xpressutc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Base de datos 'xpressutc' creada exitosamente (sin contraseña)"
    exit 0
fi

# Si falla, pedir contraseña
echo "MySQL requiere contraseña para root"
read -sp "Contraseña MySQL root: " mysql_password
echo ""

mysql -u root -p"$mysql_password" -e "CREATE DATABASE IF NOT EXISTS xpressutc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Base de datos 'xpressutc' creada exitosamente"
else
    echo "✗ Error al crear la base de datos"
    echo ""
    echo "Opciones:"
    echo "1. Verificar que la contraseña sea correcta"
    echo "2. Si no tienes contraseña, configurar una: mysql_secure_installation"
    echo "3. Si olvidaste la contraseña, puedes resetearla"
    exit 1
fi
