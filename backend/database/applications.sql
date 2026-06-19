CREATE TABLE applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    student_id VARCHAR(20) NOT NULL,
    faculty VARCHAR(100) NOT NULL DEFAULT '',
    major VARCHAR(50) NOT NULL,
    academic_year INT NOT NULL,
    gpa DECIMAL(3,2) NOT NULL,
    desired_position VARCHAR(50) NOT NULL,
    experience TEXT,
    motivation TEXT NOT NULL,
    resume_path VARCHAR(255) NOT NULL,
    status ENUM('pending', 'reviewing', 'accepted', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
); 