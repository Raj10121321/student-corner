-- Student Corner Database Schema for Supabase (PostgreSQL)
-- This is the PostgreSQL version of the original MySQL schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_gender AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE event_status AS ENUM ('active', 'past');

--_accounts table
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phonenumber VARCHAR(15) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  dob DATE NOT NULL,
  gender user_gender NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admins table
CREATE TABLE admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deadlineDate DATE,
  eventName VARCHAR(255) NOT NULL,
  logo VARCHAR(255),
  location VARCHAR(255),
  month VARCHAR(20),
  day VARCHAR(20),
  img VARCHAR(255),
  startingTime VARCHAR(20),
  endingTime VARCHAR(20),
  description TEXT,
  age VARCHAR(20),
  country VARCHAR(100),
  status event_status DEFAULT 'active'
);

-- Hackathons table
CREATE TABLE hackathons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deadlineDate DATE,
  eventName VARCHAR(255) NOT NULL,
  logo VARCHAR(255),
  location VARCHAR(255),
  month VARCHAR(20),
  day VARCHAR(20),
  img VARCHAR(255),
  startingTime VARCHAR(20),
  endingTime VARCHAR(20),
  description TEXT,
  age VARCHAR(20),
  country VARCHAR(100),
  status event_status DEFAULT 'active'
);

-- Enrolled events table
CREATE TABLE enrolled_events (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  event_id UUID NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Enrolled hackathons table
CREATE TABLE enrolled_hackathons (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  hackathon_id UUID NOT NULL,
  enrollment_date DATE DEFAULT CURRENT_DATE,
  FOREIGN KEY (hackathon_id) REFERENCES hackathons(id) ON DELETE CASCADE
);

-- Newsletters table
CREATE TABLE newsletters (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  date_subscribed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_hackathons_status ON hackathons(status);
CREATE INDEX idx_enrolled_events_user_email ON enrolled_events(user_email);
CREATE INDEX idx_enrolled_events_event_id ON enrolled_events(event_id);
CREATE INDEX idx_enrolled_hackathons_user_email ON enrolled_hackathons(user_email);
CREATE INDEX idx_enrolled_hackathons_hackathon_id ON enrolled_hackathons(hackathon_id);
CREATE INDEX idx_accounts_email ON accounts(email);
CREATE INDEX idx_accounts_phonenumber ON accounts(phonenumber);

-- Insert default admin user (password: admin123)
-- Password hash for 'admin123' using bcrypt
INSERT INTO admins (username, password, email) VALUES
('admin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYzpLm0nxQe', 'admin@studentcorner.com');

-- Sample data for accounts
INSERT INTO accounts (name, phonenumber, email, dob, gender, password) VALUES
('Guru', '8200297639', 'gurupatel279@gmail.com', '2004-05-20', 'Male', '123'),
('Aman', '6354635821', 'amanap1108@gmail.com', '2024-07-05', 'Male', 'aman123');

-- Sample events
INSERT INTO events (id, deadlineDate, eventName, logo, location, month, day, img, startingTime, endingTime, description, age, country, status) VALUES
('0cd8129f-b175-436f-9723-7da65529d973', '2024-10-25', 'CodeFest 2024', '/images/uploads/1722333891214.avif', 'Virtual', 'May', 'Saturday', '/images/uploads/1722333891216.avif', '10:00 AM', '6:00 PM', 'Join us for a day of coding challenges and innovation!', 'all ages', 'Global', 'active'),
('222c38c4-ba5f-490a-834f-17507f347533', '2024-12-31', 'New Year Extravaganza', '/images/uploads/1721834836576.jpg', 'Times Square, New York', 'September', 'tuesday', '/images/uploads/1721834836633.jpg', '8:00 PM', '2:00 AM', 'Celebrate the New Year with us at Times Square with live music, fireworks, and more!', '21+', 'USA', 'active'),
('928dcc2d-856e-495d-8219-48397b138018', '2024-08-15', 'Summer Beats Music Festival', '/images/uploads/1721837037182.jpg', 'Central Park, New York', 'August', 'thursday', '/images/uploads/1721837037207.jpg', '2:00 PM', '11:00 PM', 'Join us for the Summer Beats Music Festival with performances from top artists, food trucks, and more!', 'All ages', 'USA', 'active');

-- Sample hackathons
INSERT INTO hackathons (id, deadlineDate, eventName, logo, location, month, day, img, startingTime, endingTime, description, age, country, status) VALUES
('1071427b-dcc7-4cd2-ba35-a019c81ed237', '2024-09-04', 'Hack the World', '/images/uploads/1721831794134.jpg', 'Gandhinagar, India', 'September', 'Tuesday', '/images/uploads/1721831794143.jpg', '8:00 AM', '8:00 PM', 'Join the biggest hackathon. compete, code, win !!', '18+', 'India', 'active'),
('6bf4e657-02fb-4315-99ad-5a6b845a4d5a', '2024-11-08', 'CodeCrunch', 'https://example.com/codecrunch.png', 'Toronto, Canada', 'November', 'Monday', '/images/hackathons/hack4.jpg', '10:00 AM', '6:00 PM', 'Crunch your way through coding challenges at CodeCrunch!', '18+', 'Canada', 'active');

-- Sample enrolled events
INSERT INTO enrolled_events (user_email, event_id, enrollment_date) VALUES
('gurupatel279@gmail.com', '222c38c4-ba5f-490a-834f-17507f347533', '2024-07-24'),
('gurupatel279@gmail.com', '928dcc2d-856e-495d-8219-48397b138018', '2024-07-24');

-- Sample enrolled hackathons
INSERT INTO enrolled_hackathons (user_email, hackathon_id, enrollment_date) VALUES
('gurupatel279@gmail.com', '6bf4e657-02fb-4315-99ad-5a6b845a4d5a', '2024-07-24');

-- Sample newsletters
INSERT INTO newsletters (email) VALUES
('work.guru@hotmail.com'),
('try.guru@hotmail.com');
