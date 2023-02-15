<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', 'On');

/**
 * CRUD operation with the DB
 * and read information when needed
 */
class DBManager
{
  private $db;
  /**
   * Construct class DBManager
   * create a new connection with the database
   */
  public function __construct()
  {

    $host = 'localhost';
    $db_name = 'cms';
    $username = 'root';
    $password = 'your db password';

    try {
      $this->db = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
      $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);
      $this->db->exec("set names utf8");
    } catch (Exception $e) {
      die('Error is: ' . $e->getMessage());
    }
  }
  /**
   * insert row in a table
   *
   * @param [any] $data: data to be inserted in the each column
   * @param [string] $table_name: name of the table
   *
   * @return false : an error occur / the latest row inserted
   */
  public function create($data, $table_name)
  {
    // create mapper 
    $columns = '';

    // loop trough all key to set columns 
    foreach ($data as $key => $value) {
      $columns .= ":$key,";
    }

    // remove latest ',' from the String.
    $columns = rtrim($columns, ',');
    // prepare query
    $query = $this->db->prepare("INSERT INTO $table_name VALUES(DEFAULT, {$columns}, DEFAULT)");

    // execute query 
    if ($query->execute($data))
      return $this->db->lastInsertId();
    else
      return false;
  }

  /**
   * Function to update in the database
   *
   * @param [any] $data data to be updated in specific table 
   * @param [string] $table_name name of the table where the operation will proceed
   * @param [string] $column_name column name for where condition
   * @param [string] $id value to identify the column
   *
   * @return void
   */
  public function update($data, $table_name, $column_name, $id)
  {
    if (count($data) == 1 && isset($data['password'])) $data['password'] = md5($data['password']);
    $set  = '';
    $data_to_update = [];

    //Only use data keys that exist in table columns
    if ($table_name == 'users') {
      foreach ($data as $key => $value) {
        // check for id
        if ($key === 'id') continue;

        $set        .= "$key = :$key,";
        $data_to_update[$key] = $value;
      }
    } elseif ($table_name == 'templates') {
      foreach ($data as $key => $value) {
        // check for id
        if ($key === 'id') continue;

        $set        .= "$key = :$key,";
        $data_to_update[$key] = json_encode($value);
      }
    }


    try {

      if (empty($set))
        throw new Error('No relevant data to update found');

      // remove latest ',' from array 
      $set = rtrim($set, ',');
      // prepare query 
      $query = $this->db->prepare("UPDATE $table_name SET $set WHERE $column_name = :id");
      // execute query
      $is_row_updated = $query->execute(['id' => $id, ...$data_to_update]);

      // check if table was updated
      if (!$is_row_updated)
        throw new Error('Error updating the table');

      // get updated row
      $query = $this->db->prepare("SELECT * FROM $table_name WHERE $column_name = :id");

      // execute select query
      if ($query->execute(['id' => $id])) {
        return $query->fetch(PDO::FETCH_ASSOC);
      } else {
        throw new Error('Error getting updated data');
      }
    } catch (Error $e) {
      error_log($e->getMessage());
      $this->db->rollback();
      return false;
    }
  }

  /**
   * Function soft delete in a table of the database ... setting status to 0.
   *
   * @param [any] $id value to identify with what row want to proceed
   * @param [string] $table_name table name where the operation will proceed
   * @param [string] $column_name column name for where condition
   *
   * @return void
   */
  public function delete($table_name, $column_name, $id)
  {
    $query = $this->db->prepare("UPDATE `{$table_name}` SET `status` = 0 WHERE `{$column_name}` = :id");
    return $query->execute(['id' => $id]);
  }


  /**
   * Read data from a specific table
   *
   * @param boolean $id true: get one row, otherwise read all table
   * @param [string]  $table_name : name of the table where want to read
   * @param boolean $column_name : true set column name to identify row, otherwise read all table
   * 
   * @return read data / false if any error occur
   */
  public function read($table_name, $column_name = false, $id = false)
  {
    try {
      if ($id && $column_name) {
        $query = $this->db->prepare("SELECT * FROM {$table_name} WHERE $column_name = ? AND status = 1");
        if ($query->execute(array($id)))
          return $query->fetch(PDO::FETCH_ASSOC);
        else
          throw new Error('Error reading data');
      } else {
        $query = $this->db->prepare("SELECT * FROM {$table_name} WHERE status = 1");
        if ($query->execute())
          return $query->fetchAll(PDO::FETCH_ASSOC);
        else
          throw new Error('Error reading data');
      }
    } catch (Error $e) {
      error_log($e->getMessage());
      $this->db->rollback();
      return false;
    }
  }

  /**
   * login function
   *
   * @param [string] $username
   * @param [string] $password
   *
   * @return void
   */
  public function login($username, $password)
  {
    $query = $this->db->prepare("SELECT * FROM users WHERE username = ? AND password = ? AND status = 1");
    if ($query->execute(array(md5($username), md5($password)))) {
      return $query->fetch(PDO::FETCH_ASSOC);
    } else {
      error_log('Wrong credentials');
      return false;
    }
  }
}
