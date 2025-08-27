<?php
require_once "../config/db_con.php";
header("Access-Control-Allow-Origin:*");
header("Access-Control-Allow-Methods:POST");
header("Access-Control-Allow-Headers: Content-type, Authorization");

class log_in
{
    public static function log_in($con, $data)
    {
        $sheck_email = $con->prepare("SELECT * FROM admins where admin_email = ?");
        $sheck_email->execute([$data["user_email"]]);
        $sheck_email = $sheck_email->fetch();
        if (!empty($sheck_email)) {
            if (password_verify($data["user_password"], $sheck_email["admin_password"])) {
                echo json_encode([
                    "status" => true,
                    "admin_id" => $sheck_email["admin_id"]
                ]);
            } else {
                echo json_encode([
                    "status" => false,
                    "message" => "email or password are not currect"
                ]);
                exit;
            }
        } else {
            echo json_encode([
                "status" => false,
                "message" => "email or password are not currect"
            ]);
            exit;
        }
    }
    public static function get_orders_for_admin($con, $data)
    {
        $dateString = $data["date"] ?? null;

        if ($dateString) {
            $date = new DateTime(str_replace('/', '-', $dateString));
        } else {
            $date = new DateTime();
        }
        $date = $date->format('Y-m-d');
        $order_stmt = $con->prepare("SELECT orders.*, tables.table_id, tables.table_name FROM orders JOIN tables ON orders.table_id = tables.table_id WHERE DATE(orders.order_date) = ? ORDER BY order_id DESC");
        $order_stmt->execute([$date]);
        $orders = $order_stmt->fetchAll(PDO::FETCH_ASSOC);

        $result = [];
        foreach ($orders as $order) {
            $details_stmt = $con->prepare("SELECT items.item_name, item_amount, items.item_price FROM order_details JOIN items ON order_details.item_id = items.item_id WHERE order_id = ?");
            $details_stmt->execute([$order["order_id"]]);
            $details = $details_stmt->fetchAll(PDO::FETCH_ASSOC);
            $total = 0;
            foreach ($details as $d) {
                $total += $d["item_price"] * $d["item_amount"];
            }
            $result[] = [
                "order" => $order,
                "order_details" => $details,
                "total_price" => $total
            ];
        }

        echo json_encode($result);
        exit;
    }
    public static function change_item_data($con, $data)
    {
        $change_item = $con->prepare("UPDATE items SET item_name = ?,descrption = ?,item_price = ? WHERE item_id = ?");
        $change_item->execute([$data["item_name"], $data["descrption"], $data["item_price"], $data["item_id"]]);
    }
}
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if ($data !== null && isset($data['action'])) {
        if ($data['action'] == "log_in") {
            log_in::log_in($con, $data);
        } elseif ($data['action'] == "change_item") {
            log_in::change_item_data($con, $data);
            exit;
        }
    } else {
        log_in::get_orders_for_admin($con, $data);
        exit;
    }
}
