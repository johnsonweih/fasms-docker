CREATE TABLE IF NOT EXISTS administrators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    employment_status ENUM('employed', 'unemployed') NOT NULL,
    sex ENUM('male', 'female') NOT NULL,
    date_of_birth DATE NOT NULL,
    marital_status ENUM('single', 'married', 'widowed', 'divorced') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS household (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    name VARCHAR(100) NOT NULL,
    employment_status ENUM('employed', 'unemployed') NOT NULL,
    sex ENUM('male', 'female') NOT NULL,
    date_of_birth DATE NOT NULL,
    relation ENUM('son', 'daughter', 'spouse', 'parent', 'sibling') NOT NULL,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS schemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS criteria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_id INT NOT NULL,
    employment_status ENUM('employed', 'unemployed') DEFAULT NULL,
    has_children BOOLEAN DEFAULT NULL,
    children_school_level ENUM('primary', 'secondary', 'tertiary') DEFAULT NULL,
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS benefits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_id INT,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2),
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    scheme_id INT,
    status ENUM('pending', 'approved', 'rejected') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
);

-- Create the users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- You should hash the passwords
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create the roles table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- Create the user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Insert into Administrators
INSERT INTO administrators (username, password, email) 
VALUES ('admin1', 'hashed_password', 'admin1@example.com');

-- Insert into Applicants
INSERT INTO applicants (name, employment_status, sex, date_of_birth, marital_status) 
VALUES ('James', 'unemployed', 'male', '1990-07-01', 'single');

INSERT INTO applicants (name, employment_status, sex, date_of_birth, marital_status) 
VALUES ('Mary', 'unemployed', 'female', '1984-10-06', 'married');

-- Insert into Household
INSERT INTO household (applicant_id, name, employment_status, sex, date_of_birth, relation) 
VALUES (2, 'Gwen', 'unemployed', 'female', '2016-02-01', 'daughter');

INSERT INTO household (applicant_id, name, employment_status, sex, date_of_birth, relation) 
VALUES (2, 'Jayden', 'unemployed', 'male', '2018-03-15', 'son');

-- Insert into Schemes
INSERT INTO schemes (name, criteria) 
VALUES ('Retrenchment Assistance Scheme', '{"employment_status": "unemployed"}');

INSERT INTO schemes (name, criteria) 
VALUES ('Retrenchment Assistance Scheme (families)', '{"employment_status": "unemployed", "has_children": {"school_level": "primary"}}');

-- Insert into Benefits
INSERT INTO benefits (scheme_id, name, amount) 
VALUES (1, 'SkillsFuture Credits', 500.00);

INSERT INTO benefits (scheme_id, name, amount) 
VALUES (2, 'SkillsFuture Credits', 500.00);

INSERT INTO benefits (scheme_id, name, amount) 
VALUES (2, 'Daily School Meal Vouchers', NULL);

-- Insert into Applications
INSERT INTO applications (applicant_id, scheme_id, status) 
VALUES (1, 1, 'approved');

INSERT INTO applications (applicant_id, scheme_id, status) 
VALUES (2, 2, 'pending');

INSERT INTO roles (role_name, description) VALUES ('Admin', 'Administrator with full access');
INSERT INTO roles (role_name, description) VALUES ('User', 'Regular user with limited access');

INSERT INTO applicants (name, employment_status, sex, date_of_birth, role_id)
VALUES ('John Doe', 'Employed', 'Male', '1990-01-01', 1);

INSERT INTO schemes (scheme_name, description) VALUES ('Financial Assistance Scheme', 'Helps low-income families');


-- Insert dummy data into the roles table
INSERT INTO roles (role_name, description) VALUES
('Reviewer', 'Can review applications'),
('Processor', 'Can process applications'),
('Approver', 'Can approve applications');

-- Insert dummy data into the users table
INSERT INTO users (username, password, email) VALUES
('john_doe', 'hashed_password1', 'john@example.com'),
('jane_doe', 'hashed_password2', 'jane@example.com'),
('admin', 'hashed_password3', 'admin@example.com');

-- Associate users with roles
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1), -- john_doe as Reviewer
(2, 2), -- jane_doe as Processor
(3, 3); -- admin as Approver
