<?php


class Session
{
    private static $_instance = null;

    public static function getInstance()
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new Session();
        }
        return self::$_instance;
    }


    private function __construct()
    {
        session_start();
    }


    public function logout()
    {
        session_destroy();
    }


    public function isLogged()
    {
        return (isset($_SESSION["PK_user"]));
    }

    public function setPK_user($PK_user)
    {
        $_SESSION["PK_user"] = strtolower($PK_user);
    }

    public function getPK_user()
    {
        $res = -1;
        if (isset($_SESSION["PK_user"] )) {
            $res = $_SESSION["PK_user"] ;
        }
        return $res;
    }

    public function getSession()
    {
        return $_SESSION;
    }


}