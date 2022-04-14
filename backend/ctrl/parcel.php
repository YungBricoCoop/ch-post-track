<?php
session_set_cookie_params(['samesite' => 'None', 'secure' => true]);
session_start();

require_once('../wrk/Session.php');
require_once("../wrk/utils.php");
require_once("../wrk/ParcelWrk.php");
require_once("../wrk/PostWrk.php");

check_CORS();
check_request_method();

$session = Session::getInstance();
$parcelWrk = new ParcelWrk();
$postWrk = new PostWrk();


if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    switch ($_GET["action"]) {
        case "getEvents":
            check_required_parameters($_GET, ["number"]);
            check_is_logged();
            $events = $postWrk->getEventsFromTrackingNumber($_GET["number"]);
            http_response(200, "success", $events);

        case "getParcels":
            check_is_logged();
            $PK_user = $session->getPK_user();
            $result = $parcelWrk->getParcels($PK_user);
            http_response(200, "success", $result);
    }
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST["action"])) {
        switch ($_POST["action"]) {
            case "addParcel":
                check_required_parameters($_POST, ["name", "number"]);
                check_is_logged();
                $PK_user = $session->getPK_user();
                $result = $parcelWrk->addParcel($PK_user, $_POST["name"], $_POST["number"]);
                if ($result) {
                    $result = $parcelWrk->getParcels($PK_user);
                    http_response(200, "success", $result);
                }
                http_response(400, "error", "Error while adding parcel");
                break;
            case "updateParcel":
                check_required_parameters($_POST, ["PK_parcel", "name", "number"]);
                check_is_logged();
                $PK_user = $session->getPK_user();
                $result = $parcelWrk->updateParcel($PK_user, $_POST["PK_parcel"], $_POST["name"], $_POST["number"]);
                if ($result) {
                    http_response(200, "success", "Parcel updated");
                }
                http_response(400, "error", "Error while updating parcel");
                break;
            case "removeParcel":
                check_required_parameters($_POST, ["PK_parcel"]);
                check_is_logged();
                $PK_user = $session->getPK_user();
                $result = $parcelWrk->removeParcel($PK_user, $_POST["PK_parcel"]);
                if ($result) {
                    http_response(200, "success", "Parcel removed");
                }
                http_response(400, "error", "Error while removing parcel");
                break;
        }
    }
}
