<?php
$sdn = "mysql:host=localhost;dbname=resturent";
$user = "root";
$pass = "";

try {
    $con = new PDO($sdn, $user, $pass);
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $con->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $th) {
    echo $th->getMessage();
}
