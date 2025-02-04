-- SQL schema for Church Control

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Insert test users
INSERT INTO users (email, password, role) VALUES
('master@example.com', 'password123', 'master'),
('pastor@example.com', 'password123', 'pastor'),
('lider@example.com', 'password123', 'lider'),
('tesoreiro@example.com', 'password123', 'tesoreiro');

CREATE TABLE Members (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NOT NULL,
    baptized BOOLEAN NOT NULL,
    baptism_date DATE,
    church_of_baptism VARCHAR(255),
    marital_status VARCHAR(50),
    phone_number VARCHAR(15),
    address VARCHAR(255),
    rg VARCHAR(20),
    cpf VARCHAR(20),
    personality_test VARCHAR(255)[],
    love_language VARCHAR(255)[],
    is_pastor BOOLEAN DEFAULT FALSE,
    is_leader BOOLEAN DEFAULT FALSE,
    is_co_leader BOOLEAN DEFAULT FALSE,
    spouse_name VARCHAR(255)
);
