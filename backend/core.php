<?php
include_once './config.php';

if (session_status() === PHP_SESSION_NONE) session_start();

// include db manager to work with the database
include "DBManager.class.php";
// create a new instance of db manager
$db = new DBManager();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $post = json_decode(file_get_contents("php://input"), true);
  if (isset($post)) {
    switch ($post['action']) {
      case 'create':
        $data = $post['data'];
        $table = $post['table'];
        if ($table == 'users') {
          $data['username'] = md5($data['username']);
          $data['password'] = md5($data['password']);
        }
        $result = $db->create($data, $table);
        if ($result) echo json_encode(true);
        else echo json_encode(false);
        break;
      case 'update':
        $data = $post['data'];
        $table = $post['table'];
        $column = $post['column'];
        $id = $post['id'];

        $result = $db->update($data, $table, $column, $id);
        if (!$result) {
          echo json_encode(false);
          break;
        }
        echo json_encode($result);
        break;
      case 'delete':
        $table = $post['table'];
        $column = $post['column'];
        $id = $post['id'];
        if ($db->delete($table, $column, $id)) {
          echo json_encode(true);
        } else {
          echo json_encode(false);
        }
        break;
      case 'read':
        $table = $post['table'];
        if (isset($post['column']) && $post['column'] == 'username') $post['id'] = md5($post['id']);
        $column_name = isset($post['column']) ? $post['column'] : false;
        $id = isset($post['id']) ? $post['id'] : false;

        // read from db
        $result = $db->read($table, $column_name, $id);
        if ($result) {
          echo json_encode($result);
        } else {
          echo json_encode(false);
        }
        break;
      case 'login':
        $username = $post['username'];
        $password = $post['password'];
        $result = $db->login($username, $password);
        if (!$result) {
          echo json_encode(false);
          break;
        }
        echo json_encode($result);
        break;
      case 'validate_password':
        $table = $post['table'];
        $column_name = isset($post['column']) ? $post['column'] : false;
        $id = isset($post['id']) ? $post['id'] : false;
        $result = $db->read($table, $column_name, $id);
        if (!$result) {
          echo json_encode(false);
          break;
        }
        if (md5($post['data']) == $result['password']) echo json_encode(true);
        else echo json_encode(false);
        break;
    }
  }
  if (isset($_FILES) && count($_FILES) > 0) {
    $errors = [];
    $extensions = ['jpg', 'jpeg', 'png', 'gif'];
    foreach ($_FILES as $name => $file) {

      $file_name = $file['name'];
      $file_tmp = $file['tmp_name'];
      $file_type = $file['type'];
      $file_size = $file['size'];
      $tmp = explode('.', $file['name']);
      $file_ext = end($tmp);
      $finished_file = $path . $file_name;

      if (!in_array($file_ext, $extensions)) {
        $errors[] = 'Extension not allowed: ' . $file_name . ' ' . $file_type;
      }

      if ($file_size > 2097152) {
        $errors[] = 'File size exceeds limit: ' . $file_name . ' ' . $file_type;
      }

      if (empty($errors)) {
        move_uploaded_file($file_tmp, $finished_file);
      }
    }
    if ($errors) {
      foreach ($errors as $error) error_log($error);
    } else {
      echo json_encode(true);
    }
  }
}
