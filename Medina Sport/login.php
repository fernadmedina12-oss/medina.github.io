<?php
include "conexion.php";

$email    = $_POST['email'];
$password = $_POST['password'];

$result = $conexion->query("SELECT * FROM usuarios WHERE email='$email'");

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user['password'])) {
        echo json_encode(["status" => "ok", "user" => $user]);
    } else {
        echo json_encode(["status" => "error", "msg" => "Contraseña incorrecta"]);
    }
} else {
    echo json_encode(["status" => "error", "msg" => "Usuario no encontrado"]);
}
?>
