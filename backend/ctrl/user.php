<?php
session_set_cookie_params(['samesite' => 'None', 'secure' => true]);
session_start();

require_once('../wrk/Session.php');
require_once("../wrk/utils.php");
require_once("../wrk/UserWrk.php");

check_CORS();
check_request_method();

$session = Session::getInstance();
$userWrk = new UserWrk();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST["action"])) {
        switch ($_POST["action"]) {
            case "login":
                check_required_parameters($_POST, ["username", "password"]);
                $user = $userWrk->loginWithUsername($_POST["username"]);
                if (!empty($user)) {
                    if (password_verify($_POST["password"], $user["password"])) {
                        $session->setPK_user($user['PK_user']);
                        http_response(200, "success", array("loginToken" => $user["loginToken"]));
                    }
                    http_response(200, "error", "Wrong credentials");
                }
                http_response(200, "error", "Username not found");
                break;

            case "tokenLogin":
                check_required_parameters($_POST, ["token"]);

                $user = $userWrk->loginWithToken($_POST["token"]);
                if (!empty($user)) {
                    $session->setPK_user($user['PK_user']);
                    http_response(200, "success", array("loginToken" => $user["loginToken"]));
                }
                http_response(200, "error", "Invalid login token");

                break;

            case "register":
                check_required_parameters($_POST, ["username", "password"]);
                $lokinToken = openssl_random_pseudo_bytes(16);
                $lokinToken = bin2hex($lokinToken);

                if ($userWrk->alredyExist($_POST["username"])) {
                    http_response(400, "error", "Username already exist");
                }

                $result = $userWrk->register($_POST["username"], password_hash($_POST["password"], PASSWORD_DEFAULT), $lokinToken);

                if ($result) {
                    http_response(200, "success", "Successfully registered");
                } else {
                    http_response(400, "error", "Error while registering");
                }

                break;

            case "logout":
                $session->logout();
                http_response(200, "success", "Successfully logged out");
                break;
        }
    }
}
