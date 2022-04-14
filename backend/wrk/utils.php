<?php

require_once("../beans/ResultBean.php");

function http_response($errorCode, $status, $result)
{
  echo json_encode(new Result($status, $result, $errorCode));
  exit();
}

function check_CORS()
{
  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Headers: http://localhost:3000");
  header("Access-Control-Allow-Credentials: true");
  if ($_SERVER['REQUEST_METHOD'] != 'OPTIONS') {
    return;
  }

  // if preflight request
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

  http_response(200, "success", "");
}

function check_request_method()
{
  if (!isset($_SERVER['REQUEST_METHOD'])) {
    http_response(400, 'error', 'Missing request method');
  }
}

function check_required_parameters($receivedParams, $requiredParams, $arrayName = false)
{
  foreach ($requiredParams as $p) {
    if ($arrayName) {
      if (!isset($receivedParams[$arrayName][$p])) {
        http_response(400, "error", "Missing parameter");
      }
    } else {
      if (!isset($receivedParams[$p])) {
        http_response(400, "error", "Missing parameter");
      }
    }
  }
}

function check_action($requestParams)
{
  if (!isset($requestParams["action"])) {
    http_response(406, "error", "Unknown action");
  }

  if ($requestParams["action"] == "") {
    http_response(406, "error", "Unknown action");
  }
}

function check_is_logged()
{
  if (!Session::getInstance()->isLogged()) {
    http_response(403, "error", "Must be logged");
  }
}

