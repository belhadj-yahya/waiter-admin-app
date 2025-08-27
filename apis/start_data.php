<?php
require_once "../config/db_con.php";
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods:GET, POST,PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-type, Authorization");
header("Content-type:application/json");

class start_data
{
    public static function get_start_data($con)
    {
        $tables = $con->query("SELECT * FROM tables");
        $tables = $tables->fetchAll();
        $items = $con->query("SELECT * FROM items");
        $items = $items->fetchAll();
        echo json_encode([$tables, $items]);
        exit;
    }
    public static function get_order($con, $id)
    {
        $order = $con->prepare("SELECT orders.*,tables.table_id,tables.table_name FROM orders JOIN tables on orders.table_id = tables.table_id where orders.table_id = ? ORDER BY order_id DESC");
        $order->execute([$id]);
        $order = $order->fetch();
        $order_details = $con->prepare("SELECT items.item_name,item_amount,items.item_price FROM order_details JOIN items on order_details.item_id = items.item_id where order_id = ?");
        $order_details->execute([$order["order_id"]]);
        $order_details = $order_details->fetchAll();
        echo json_encode([
            "order" => $order,
            "order_details" => $order_details
        ]);
        exit;
    }
    public static function change_status($con, $data)
    {

        $change_order = $con->prepare("UPDATE orders set order_status = ? where order_id = ?");
        $change_order->execute([$data["new_status"], $data["order_id"]]);
        if ($data["new_status"] == "canceled" || $data["new_status"] == "done") {
            $change_order = $con->prepare("UPDATE tables set table_status = 'free' WHERE table_id = ?");
            $change_order->execute([$data["table_id"]]);
        }
        echo json_encode($data["new_status"]);
    }
    public static function edite_order($con, $data)
    {
        // echo json_encode(["status" => true, $data]);
        // exit;
        $check_item = $con->prepare("SELECT item_amount FROM order_details WHERE order_id = ? AND item_id = ?");
        $update_item = $con->prepare("UPDATE order_details SET item_amount = item_amount + ? WHERE order_id = ? AND item_id = ?");
        $insert_item = $con->prepare("INSERT INTO order_details(order_id, item_id, item_amount) VALUES (?, ?, ?)");
        // echo json_encode(["status" => false, $data["new_order_stuff"]]);
        // exit;
        for ($i = 1; $i < count($data["new_order_stuff"]); $i++) {
            $order_id = $data["order_and_table_id"]["order_id"];
            $item_id = $data["new_order_stuff"][$i]["item_id"];
            $item_amount = $data["new_order_stuff"][$i]["item_amount"];

            // 1. Check if row exists
            $check_item->execute([$order_id, $item_id]);
            $existing = $check_item->fetch();

            if ($existing) {
                // 2. Update quantity
                $update_item->execute([$item_amount, $order_id, $item_id]);
            } else {
                // 3. Insert new row
                $insert_item->execute([$order_id, $item_id, $item_amount]);
            }
        }
        echo json_encode(["status" => true, "order_id" => $data["order_and_table_id"]["table_id"]]);
    }
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    switch ($_GET["action"]) {
        case "get_data":
            start_data::get_start_data($con);
            break;
        case "get_order":
            start_data::get_order($con, $_GET["order_id"]);
            break;
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "PUT") {
    $data = json_decode(file_get_contents('php://input'), true);
    start_data::change_status($con, $data);
    exit;
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    start_data::edite_order($con, $data);
    exit;
}
