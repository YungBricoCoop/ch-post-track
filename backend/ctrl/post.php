<?php

header("Access-Control-Allow-Origin: " . "http://localhost:3000");
header("Access-Control-Allow-Headers: " . "http://localhost:3000");

require_once("../wrk/PostWrk.php");


if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_GET["action"])) {
        switch ($_GET["action"]) {
            case "getEvents":
                $postWrk = new PostWrk();
                $events = $postWrk->getEventsFromTrackingNumber($_GET["trackingNumber"]);
                echo $events;
            case "getParcels":
                echo "swag";
        }
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST["action"])) {
        switch ($_POST["action"]) {
        }
    }
}
