<?php
// Database connection
$host = 'localhost';
$db_name = 'your_database_name';
$username = 'your_username';
$password = 'your_password';

try {
  $db = new PDO("mysql:host=$host;dbname=$db_name", $username, $password);
  $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
  die("Database connection failed: " . $e->getMessage());
}

// Login logic
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $username = $_POST['username'];
  $password = $_POST['password'];

  // Validate username and password
  // ... (Add your validation logic here)

  // Check if the user exists in the database
  $query = $db->prepare("SELECT * FROM users WHERE username = :username AND password = :password");
  $query->bindParam(':username', $username);
  $query->bindParam(':password', $password);
  $query->execute();

  if ($query->rowCount() > 0) {
    // Successful login, redirect to a different page
    header("Location: welcome.html");
    exit();
  } else {
    $error = "Invalid username or password";
  }
}
?>

<!DOCTYPE html>
<html>
<head>
  <title>Login/Signup Page</title>
  <!-- Add your CSS styles here -->
</head>
<body>
  <div class="container">
    <h1>Login</h1>
   
