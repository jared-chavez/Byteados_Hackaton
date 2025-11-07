#!/bin/bash

echo "=== Reseteo de Contraseña MySQL ==="
echo ""
echo "Este script detendrá MySQL, la iniciará en modo seguro y permitirá resetear la contraseña"
echo ""
read -p "¿Continuar? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Cancelado"
    exit 0
fi

echo ""
echo "1. Deteniendo MySQL..."
brew services stop mysql

echo "2. Iniciando MySQL en modo seguro (sin autenticación)..."
mysqld_safe --skip-grant-tables --skip-networking &

sleep 3

echo "3. Reseteando contraseña..."
mysql -u root << SQL
FLUSH PRIVILEGES;
ALTER USER 'root'@'localhost' IDENTIFIED BY '';
FLUSH PRIVILEGES;
SQL

echo "4. Deteniendo MySQL en modo seguro..."
mysqladmin -u root shutdown

echo "5. Reiniciando MySQL normalmente..."
brew services start mysql

sleep 3

echo ""
echo "✓ MySQL reiniciado. Ahora puedes crear la base de datos sin contraseña:"
echo "  mysql -u root -e \"CREATE DATABASE xpressutc CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;\""
