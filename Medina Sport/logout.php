<?php
session_start();
session_unset();   // Limpia las variables de sesión
session_destroy(); // Destruye la sesión

echo json_encode(["status" => "ok", "msg" => "Sesión cerrada correctamente"]);
?>
