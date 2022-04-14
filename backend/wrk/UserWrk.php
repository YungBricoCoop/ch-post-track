<?php

include_once('../db/db.php');

class UserWrk
{
  public function loginWithUsername($username)
  {
    $query = "SELECT * FROM T_User WHERE username = :username";
    $params = array('username' => $username);
    $result = Db::getInstance()->selectQuery($query, $params);

    $user = array();
    if(!empty($result)){
        $user = $result[0];
    }
    
    return $user;
  }

  public function loginWithToken($loginToken)
  {
    $query = "SELECT * FROM T_User WHERE loginToken = :loginToken";
    $params = array('loginToken' => $loginToken);
    $result = Db::getInstance()->selectQuery($query, $params);

    $user = array();
    if(!empty($result)){
        $user = $result[0];
    }

    return $user;
  }

  public function register($username, $password, $loginToken)
  {
    $query = "INSERT INTO T_User (username, password, loginToken) VALUES (:username, :password, :loginToken)";
    $params = array('username' => $username, 'password' => $password, 'loginToken' => $loginToken);
    return Db::getInstance()->executeQuery($query, $params);
  }

  public function alredyExist($username)
  {
    $query = "SELECT * FROM T_User WHERE username = :username";
    $params = array('username' => $username);
    $result = Db::getInstance()->selectQuery($query, $params);
    return count($result) != 0;
  }

}
