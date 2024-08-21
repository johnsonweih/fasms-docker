CREATE TABLE Administrators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Applicants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    employment_status ENUM('employed', 'unemployed') NOT NULL,
    sex ENUM('male', 'female') NOT NULL,
    date_of_birth DATE NOT NULL,
    marital_status ENUM('single', 'married', 'widowed', 'divorced') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Household (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    name VARCHAR(100) NOT NULL,
    employment_status ENUM('employed', 'unemployed') NOT NULL,
    sex ENUM('male', 'female') NOT NULL,
    date_of_birth DATE NOT NULL,
    relation ENUM('son', 'daughter', 'spouse', 'parent', 'sibling') NOT NULL,
    FOREIGN KEY (applicant_id) REFERENCES Applicants(id) ON DELETE CASCADE
);

CREATE TABLE Schemes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    criteria JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Benefits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scheme_id INT,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2),
    FOREIGN KEY (scheme_id) REFERENCES Schemes(id) ON DELETE CASCADE
);

CREATE TABLE Applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    applicant_id INT,
    scheme_id INT,
    status ENUM('pending', 'approved', 'rejected') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant_id) REFERENCES Applicants(id) ON DELETE CASCADE,
    FOREIGN KEY (scheme_id) REFERENCES Schemes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS user_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Insert into Administrators
INSERT INTO Administrators (username, password, email) 
VALUES ('admin1', 'hashed_password', 'admin1@example.com');

-- Insert into Applicants
INSERT INTO Applicants (name, employment_status, sex, date_of_birth, marital_status) 
VALUES ('James', 'unemployed', 'male', '1990-07-01', 'single');

INSERT INTO Applicants (name, employment_status, sex, date_of_birth, marital_status) 
VALUES ('Mary', 'unemployed', 'female', '1984-10-06', 'married');

-- Insert into Household
INSERT INTO Household (applicant_id, name, employment_status, sex, date_of_birth, relation) 
VALUES (2, 'Gwen', 'unemployed', 'female', '2016-02-01', 'daughter');

INSERT INTO Household (applicant_id, name, employment_status, sex, date_of_birth, relation) 
VALUES (2, 'Jayden', 'unemployed', 'male', '2018-03-15', 'son');

-- Insert into Schemes
INSERT INTO Schemes (name, criteria) 
VALUES ('Retrenchment Assistance Scheme', '{"employment_status": "unemployed"}');

INSERT INTO Schemes (name, criteria) 
VALUES ('Retrenchment Assistance Scheme (families)', '{"employment_status": "unemployed", "has_children": {"school_level": "primary"}}');

-- Insert into Benefits
INSERT INTO Benefits (scheme_id, name, amount) 
VALUES (1, 'SkillsFuture Credits', 500.00);

INSERT INTO Benefits (scheme_id, name, amount) 
VALUES (2, 'Daily School Meal Vouchers', NULL);

-- Insert into Applications
INSERT INTO Applications (applicant_id, scheme_id, status) 
VALUES (1, 1, 'approved');

INSERT INTO Applications (applicant_id, scheme_id, status) 
VALUES (2, 2, 'pending');
