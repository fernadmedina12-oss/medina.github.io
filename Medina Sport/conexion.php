<?php
$host = "localhost";
$user = "root";   // Usuario por defecto de XAMPP
$pass = "";       // Contraseña vacía en XAMPP
$db   = "medina sport"; // El nombre de la BD que creaste

$conexion = new mysqli($host, $user, $pass, $db);

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}
?>
