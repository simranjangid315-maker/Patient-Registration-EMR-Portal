CREATE DATABASE `Patient Registration & EMR Portal`;
USE `Patient Registration & EMR Portal`;

CREATE TABLE users(
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);

CREATE TABLE patients(
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(100),
  gender VARCHAR(20),
  age INT,
  phone VARCHAR(20),
  address TEXT,
  bloodgroup VARCHAR(10)   --  Added column
);
