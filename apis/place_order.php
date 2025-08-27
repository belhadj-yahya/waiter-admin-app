<?php
require_once "../config/db_con.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods:GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");
header("Content-type:application/json");

class place_order
{

    public static function place_order($con, $data)
    {
        $con->beginTransaction();
        try {
            $add_order = $con->prepare("INSERT INTO orders(table_id,order_status,order_date) values(?,'pending',NOW())");
            $add_order->execute([$data[0]]);
            $order_id = $con->lastInsertId();
            $add_order_details = $con->prepare("INSERT INTO order_details(order_id,item_id,item_amount ) values(?,?,?)");
            for ($i = 1; $i < count($data); $i++) {
                $add_order_details->execute([$order_id, $data[$i]["item_id"], $data[$i]["item_amount"]]);
            }
            $change_table_statuse = $con->prepare("UPDATE tables set table_status = 'not free' WHERE table_id = ?");
            $change_table_statuse->execute([$data[0]]);
            $con->commit();
            echo json_encode([
                "status" => true,
                "message" => "order and its details"
            ]);
            exit;
        } catch (\Throwable $th) {
            $con->rollBack();
        }
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    place_order::place_order($con, $data);
    echo json_encode([
        "status" => true,
        $data
    ]);
    exit;
}
