<?php

include_once 'config.php';

class Db
{

	private static $_instance = null;
	private $pdo;

	public static function getInstance()
	{
		if (is_null(self::$_instance)) {

			self::$_instance = new Db();
		}
		return self::$_instance;
	}


	private function __construct()
	{
		$dsn = DB_TYPE . ':host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
		$options = [
			PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			PDO::ATTR_EMULATE_PREPARES   => false,
		];
		try {
			$this->pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
		} catch (\PDOException $e) {
			return "Error !: " . $e->getMessage();
			die();
		}
	}


	public function __destruct()
	{
		$this->pdo = null;
	}


	public function selectQuery($query, $params)
	{
		try {
			$queryPrepared = $this->pdo->prepare($query);
			$queryPrepared->execute($params);
			return $queryPrepared->fetchAll();
		} catch (PDOException $e) {
			return "Error !: " . $e->getMessage();
			die();
		}
	}


	public function executeQuery($query, $params)
	{
		try {
			$queryPrepared = $this->pdo->prepare($query);
			$queryRes = $queryPrepared->execute($params);
			return $queryRes;
		} catch (PDOException $e) {
			return "Error !: " . $e->getMessage();
			die();
		}
	}



	public function getLastId($table)
	{
		try {
			$lastId = $this->pdo->lastInsertId($table);
			return $lastId;
		} catch (PDOException $e) {
			return "Error !: " . $e->getMessage();
			die();
		}
	}


	public function startTransaction()
	{
		return $this->pdo->beginTransaction();
	}


	public function addQueryToTransaction($query, $params)
	{
		$res = false;
		if ($this->pdo->inTransaction()) {
			$maQuery = $this->pdo->prepare($query);
			$res = $maQuery->execute($params);
		}
		return $res;
	}


	public function commitTransaction()
	{
		$res = false;
		if ($this->pdo->inTransaction()) {
			$res = $this->pdo->commit();
		}
		return $res;
	}


	public function rollbackTransaction()
	{
		$res = false;
		if ($this->pdo->inTransaction()) {
			$res = $this->pdo->rollBack();
		}
		return $res;
	}
}
