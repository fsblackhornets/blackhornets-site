<?php
/**
 * Database Configuration Template
 * 
 * Instructions:
 * 1. Copy this file and rename it to 'db_connect.php'
 * 2. Update the database credentials below with your actual values
 * 3. Never commit the actual db_connect.php file to version control
 */

$servername = "localhost";
$username = "your_database_username";  // Change this
$password = "your_database_password";  // Change this
$dbname = "your_database_name";        // Change this (default: fsblaacy_blackhornets)

try {
    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    // Set charset to utf8mb4 for better Unicode support
    $conn->set_charset("utf8mb4");
} catch (Exception $e) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Database connection failed. Please check your configuration.'
    ]));
}
?>
