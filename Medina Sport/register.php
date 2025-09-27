<?php
include "conexion.php";

$name      = $_POST['name'];
$lastname  = $_POST['lastname'];
$email     = $_POST['email'];
$password  = password_hash($_POST['password'], PASSWORD_DEFAULT);

$sql = "INSERT INTO usuarios (nombre, apellido, email, password, provider) 
        VALUES ('$name', '$lastname', '$email', '$password', 'local')";

if ($conexion->query($sql) === TRUE) {
    echo json_encode(["status" => "ok", "msg" => "Usuario registrado"]);
} else {
    echo json_encode(["status" => "error", "msg" => $conexion->error]);
}
?>
