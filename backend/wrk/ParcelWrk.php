<?php

include_once('../db/db.php');

class ParcelWrk
{
    public function getParcels($FK_user)
    {
        $query = "SELECT * FROM T_Parcel WHERE FK_user = :FK_user";
        $params = array('FK_user' => $FK_user);
        return Db::getInstance()->selectQuery($query, $params);;
    }

    public function addParcel($FK_user, $name, $number)
    {
        $query = "INSERT INTO T_Parcel (FK_user, name, number) VALUES (:FK_user, :name, :number)";
        $params = array('FK_user' => $FK_user, 'name' => $name, 'number' => $number);
        return Db::getInstance()->executeQuery($query, $params);
    }

    public function updateParcel($FK_user, $PK_parcel, $name, $number)
    {
        $query = "UPDATE T_Parcel SET name = :name, number = :number WHERE PK_parcel = :PK_parcel AND FK_user = :FK_user";
        $params = array('FK_user' => $FK_user, 'PK_parcel' => $PK_parcel, 'name' => $name, 'number' => $number);
        return Db::getInstance()->executeQuery($query, $params);
    }

    public function removeParcel($FK_user, $PK_parcel)
    {
        $query = "DELETE FROM T_Parcel WHERE PK_parcel = :PK_parcel AND FK_user = :FK_user";
        $params = array('FK_user' => $FK_user, 'PK_parcel' => $PK_parcel);
        return Db::getInstance()->executeQuery($query, $params);
    }
}
