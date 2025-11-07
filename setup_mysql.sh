#!/bin/bash

echo "=== Configuración de Base de Datos MySQL para XpressUTC ==="
echo ""

# Solicitar credenciales de MySQL
read -p "Usuario MySQL (default: root): " mysql_user
mysql_user=${mysql_user:-root}

read -sp "Contraseña MySQL: " mysql_password
echo ""

read -p "Nombre de la base de datos (default: xpressutc): " db_name
db_name=${db_name:-xpressutc}

# Crear base de datos
echo "Creando base de datos '$db_name'..."
mysql -u "$mysql_user" -p"$mysql_password" -e "CREATE DATABASE IF NOT EXISTS $db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Base de datos '$db_name' creada exitosamente"
else
    echo "✗ Error al crear la base de datos. Verifica las credenciales."
    exit 1
fi

# Actualizar .env
echo ""
echo "Actualizando archivo .env..."

cd api
if [ -f "../.env" ]; then
    # Backup del .env
    cp ../.env ../.env.backup
    
    # Actualizar configuración de DB
    sed -i.bak "s/DB_CONNECTION=.*/DB_CONNECTION=mysql/" ../.env
    sed -i.bak "s/DB_DATABASE=.*/DB_DATABASE=$db_name/" ../.env
    sed -i.bak "s/DB_USERNAME=.*/DB_USERNAME=$mysql_user/" ../.env
    
    read -sp "Contraseña MySQL para .env (Enter para usar la misma): " db_password
    echo ""
    db_password=${db_password:-$mysql_password}
    sed -i.bak "s/DB_PASSWORD=.*/DB_PASSWORD=$db_password/" ../.env
    
    rm ../.env.bak 2>/dev/null
    
    echo "✓ Archivo .env actualizado"
else
    echo "✗ Archivo .env no encontrado"
    exit 1
fi

# Ejecutar migraciones
echo ""
echo "Ejecutando migraciones..."
php artisan migrate --force

if [ $? -eq 0 ]; then
    echo "✓ Migraciones ejecutadas exitosamente"
    echo ""
    echo "=== Configuración completada ==="
    echo "Base de datos: $db_name"
    echo "Usuario: $mysql_user"
    echo ""
    echo "Puedes iniciar el servidor con: cd api && php artisan serve --port=8000"
else
    echo "✗ Error al ejecutar migraciones"
    exit 1
fi
