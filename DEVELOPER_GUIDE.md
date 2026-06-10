# Developer Guide - Black Hornets Racing Platform

## Table of Contents
1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Development Workflow](#development-workflow)
4. [Common Tasks](#common-tasks)
5. [Code Standards](#code-standards)
6. [Database Management](#database-management)
7. [Troubleshooting](#troubleshooting)
8. [FAQs](#faqs)

---

## Getting Started

### Prerequisites
- PHP 8.2+ installed
- MySQL/MariaDB running
- Apache with mod_rewrite enabled
- Text editor (VS Code recommended)
- Basic knowledge of HTML, CSS, JavaScript, PHP

### Initial Setup
```bash
# 1. Navigate to project directory
cd c:\xampp\htdocs\fsblackhornets

# 2. Copy database configuration
cp src/config/database.example.php src/config/database.php

# 3. Edit database credentials
# Open src/config/database.php and update:
# - $host (usually 'localhost')
# - $database (your database name)
# - $username (your MySQL username)
# - $password (your MySQL password)

# 4. Import database schemas
mysql -u root -p < src/database/blog_tables.sql
mysql -u root -p < src/database/applications.sql
mysql -u root -p < src/database/contact_messages.sql

# 5. Set permissions (Linux/Mac)
chmod -R 755 storage/
chmod 644 src/config/database.php

# 6. Access the site
# http://localhost/fsblackhornets/public/
```

---

## Project Structure

### Directory Overview
```
fsblackhornets/
│
├── public/                    # WEB-ACCESSIBLE FILES (Document Root)
│   ├── index.html            # Homepage
│   ├── apply.html            # Application form
│   ├── assets/               # Static resources
│   │   ├── css/             # All stylesheets
│   │   ├── js/              # Client-side JavaScript
│   │   ├── images/          # Images, logos, photos
│   │   └── fonts/           # Web fonts
│   ├── pages/               # Public HTML pages
│   │   ├── about.html       # About page
│   │   ├── team.html        # Team members display
│   │   ├── projects.html    # Projects showcase
│   │   ├── gallery.html     # Image gallery
│   │   ├── sponsors.html    # Sponsors page
│   │   ├── blog.html        # Blog listing
│   │   └── contact.html     # Contact form
│   └── admin/               # Admin panel pages
│       ├── posts.php        # Manage blog posts
│       ├── manage-projects.php
│       ├── manage-gallery.php
│       └── manage-sponsors.php
│
├── src/                      # BACKEND SOURCE CODE (Not web-accessible)
│   ├── api/                 # RESTful API endpoints
│   │   ├── posts/          # Blog API
│   │   │   ├── read.php   # GET all posts
│   │   │   └── create.php # POST new post
│   │   ├── projects/       # Projects API
│   │   ├── gallery/        # Gallery API
│   │   └── sponsors/       # Sponsors API
│   │
│   ├── controllers/         # Business logic
│   │   ├── LoginController.php           # User authentication
│   │   ├── ApplicationController.php     # Handle applications
│   │   ├── DashboardController.php       # Admin dashboard
│   │   ├── ContactController.php         # Contact form processing
│   │   └── ...                          # Other controllers
│   │
│   ├── middleware/          # Request processing
│   │   ├── auth.php        # Authentication check
│   │   └── auth_check.php  # Session validation
│   │
│   ├── config/             # Configuration files
│   │   ├── database.php    # Database connection (DO NOT COMMIT)
│   │   └── database.example.php  # Template for database config
│   │
│   ├── utils/              # Helper functions
│   │   ├── email_sender.php     # Email functionality
│   │   └── team_data.php        # Team data helpers
│   │
│   ├── views/              # Server-side views
│   │   └── components/     # Reusable UI components
│   │       ├── header-inner.html
│   │       └── footer.html
│   │
│   ├── models/             # Data models (to be implemented)
│   │   └── .gitkeep
│   │
│   └── database/           # Database schemas
│       ├── blog_tables.sql
│       ├── applications.sql
│       └── contact_messages.sql
│
├── storage/                # FILE STORAGE (Not web-accessible)
│   └── uploads/           # User-uploaded files
│       ├── resumes/       # Application resumes (.pdf)
│       ├── profiles/      # Profile pictures
│       ├── gallery/       # Gallery images
│       ├── projects/      # Project images
│       ├── sponsors/      # Sponsor logos
│       ├── blog/          # Blog post images
│       └── reports/       # Team reports
│
├── .htaccess              # Apache configuration (routing, security)
├── .gitignore            # Git ignore rules
├── README.md             # Project overview
├── ARCHITECTURE.md       # System architecture documentation
├── DEPLOYMENT.md         # Deployment instructions
├── CONTRIBUTING.md       # Contribution guidelines
├── SECURITY.md          # Security policies
├── CHANGELOG.md         # Version history
└── LICENSE              # MIT License
```

---

## Development Workflow

### Adding a New Page

#### 1. Create HTML File
```bash
# Create in public/pages/
# Example: public/pages/events.html
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Events - Black Hornets Racing</title>
    
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preconnect" href="https://cdnjs.cloudflare.com">
    
    <!-- Preload critical resources -->
    <link rel="preload" href="../assets/js/header-footer.js" as="script">
    <link rel="preload" href="../assets/css/events.css" as="style">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- CSS -->
    <link rel="stylesheet" href="../assets/css/header.css">
    <link rel="stylesheet" href="../assets/css/style.css">
    <link rel="stylesheet" href="../assets/css/events.css">
    <link rel="stylesheet" href="../assets/css/footer.css">
</head>
<body>
    <!-- Header will be loaded dynamically -->
    <header></header>

    <!-- Your page content here -->
    <section class="events-hero">
        <h1>Events</h1>
    </section>

    <!-- Footer will be loaded dynamically -->
    <footer></footer>

    <!-- Scripts -->
    <script src="../assets/js/header-footer.js"></script>
    <script src="../assets/js/events.js" defer></script>
</body>
</html>
```

#### 2. Create CSS File
```css
/* public/assets/css/events.css */

/* Hero Section */
.events-hero {
    padding: 100px 20px;
    background: linear-gradient(135deg, #000000, #1a1a1a);
    text-align: center;
}

.events-hero h1 {
    font-family: 'Orbitron', sans-serif;
    color: var(--primary-color); /* #FFD700 */
    font-size: 3rem;
    margin-bottom: 1rem;
}

/* Use existing color variables */
:root {
    --primary-color: #FFD700;
    --dark-bg: #000000;
    --text-light: #FFFFFF;
}
```

#### 3. Create JavaScript File
```javascript
// public/assets/js/events.js

document.addEventListener('DOMContentLoaded', function() {
    console.log('Events page loaded');
    
    // Your page logic here
    loadEvents();
});

function loadEvents() {
    // Example: Fetch events from API
    fetch('/fsblackhornets/src/api/events/read.php')
        .then(response => response.json())
        .then(data => {
            console.log('Events loaded:', data);
            // Update DOM with events
        })
        .catch(error => {
            console.error('Error loading events:', error);
        });
}
```

#### 4. Update Navigation
Add link to `src/views/components/header-inner.html` and in `public/assets/js/header-footer.js`:

```javascript
// In header-footer.js, add to nav links:
<a href="${getPagePath()}pages/events.html" class="nav-link">
    <i class="fas fa-calendar"></i>
    <span>Events</span>
</a>
```

---

### Creating a New API Endpoint

#### 1. Create API Directory and File
```bash
# Create directory
mkdir src/api/events

# Create endpoint file
touch src/api/events/read.php
```

#### 2. Implement API Endpoint
```php
<?php
// src/api/events/read.php

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: GET');

// Include database connection
require_once '../../config/database.php';

try {
    // Query database
    $sql = "SELECT id, title, description, date, location, image 
            FROM events 
            ORDER BY date DESC";
    
    $stmt = $conn->prepare($sql);
    $stmt->execute();
    $events = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Return JSON response
    echo json_encode([
        'success' => true,
        'data' => $events,
        'count' => count($events)
    ]);
    
} catch(PDOException $e) {
    // Error handling
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage()
    ]);
}

// Close connection
$conn = null;
?>
```

#### 3. Create Database Table
```sql
-- Add to src/database/events.sql

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    location VARCHAR(255),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

---

### Adding a New Controller

#### 1. Create Controller File
```php
<?php
// src/controllers/EventController.php

session_start();

// Include dependencies
require_once '../config/database.php';
require_once '../middleware/auth_check.php';

class EventController {
    private $conn;
    
    public function __construct($connection) {
        $this->conn = $connection;
    }
    
    /**
     * Create a new event
     * @param array $data Event data
     * @return bool Success status
     */
    public function create($data) {
        try {
            $sql = "INSERT INTO events (title, description, date, location, image) 
                    VALUES (:title, :description, :date, :location, :image)";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':title', $data['title']);
            $stmt->bindParam(':description', $data['description']);
            $stmt->bindParam(':date', $data['date']);
            $stmt->bindParam(':location', $data['location']);
            $stmt->bindParam(':image', $data['image']);
            
            return $stmt->execute();
            
        } catch(PDOException $e) {
            error_log("Event creation error: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Get all events
     * @return array Events list
     */
    public function getAll() {
        try {
            $sql = "SELECT * FROM events ORDER BY date DESC";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
            
        } catch(PDOException $e) {
            error_log("Event fetch error: " . $e->getMessage());
            return [];
        }
    }
    
    /**
     * Update event
     * @param int $id Event ID
     * @param array $data Updated data
     * @return bool Success status
     */
    public function update($id, $data) {
        // Implementation here
    }
    
    /**
     * Delete event
     * @param int $id Event ID
     * @return bool Success status
     */
    public function delete($id) {
        // Implementation here
    }
}

// Initialize controller
$eventController = new EventController($conn);

// Handle request based on method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create event
    $result = $eventController->create($_POST);
    // Return response
}

?>
```

---

## Common Tasks

### 1. Changing Colors/Theme

All colors are defined in `public/assets/css/style.css`:

```css
:root {
    --primary-color: #FFD700;      /* Gold - Main brand color */
    --accent-yellow: #FFC107;      /* Light yellow */
    --dark-bg: #000000;            /* Black background */
    --dark-gray: #1a1a1a;          /* Dark gray */
    --text-light: #FFFFFF;         /* White text */
    --text-gray: #e0e0e0;          /* Light gray text */
}

/* To change theme, update these values */
/* Example: Blue theme */
:root {
    --primary-color: #0066FF;
    --accent-yellow: #3399FF;
}
```

### 2. Updating Logo

1. Replace image files:
   - `public/assets/images/logo.png` (Main logo)
   - `public/assets/images/W logo.png` (White version)
   
2. Update references in:
   - `src/views/components/header-inner.html`
   - `public/assets/js/header-footer.js`

```javascript
// In header-footer.js
const imagePath = getImagePath();
<img src="${imagePath}YOUR-NEW-LOGO.png" alt="Black Hornets Logo">
```

### 3. Adding New Team Member

**Option A: Through Admin Panel**
1. Go to `/public/admin/manage-members.php`
2. Click "Add New Member"
3. Fill in details and upload photo
4. Assign department

**Option B: Database Direct**
```sql
INSERT INTO team_members 
(name, position, department, sub_department, email, phone, image, bio)
VALUES 
('John Doe', 'Engineer', 'mechanical', 'carbody', 'john@email.com', '+123456789', 'path/to/image.jpg', 'Bio text');
```

### 4. Managing Blog Posts

**Create Post via API:**
```javascript
fetch('/fsblackhornets/src/api/posts/create.php', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: 'New Post Title',
        content: 'Post content here...',
        author: 'Author Name',
        image: 'path/to/image.jpg'
    })
})
.then(response => response.json())
.then(data => console.log('Post created:', data));
```

**Or use Admin Panel:**
- Navigate to `/public/admin/posts.php`

### 5. File Upload Handling

**All file uploads MUST use the SecureFileUpload class for security:**

```php
// Include the SecureFileUpload class
require_once __DIR__ . '/../../src/utils/SecureFileUpload.php';

// Example: Upload profile picture
if (isset($_FILES['profile_picture'])) {
    $upload_dir = __DIR__ . '/../../public/uploads/profiles/';
    $uploader = new SecureFileUpload($upload_dir, ['image'], 5 * 1024 * 1024); // 5MB max
    
    $filename = $uploader->upload($_FILES['profile_picture']);
    
    if ($filename) {
        echo "Upload successful: " . $filename;
        // Save filename to database
    } else {
        echo "Upload failed: " . $uploader->getLastError();
    }
}

// Example: Upload resume/CV
if (isset($_FILES['resume'])) {
    $upload_dir = __DIR__ . '/../../public/uploads/resumes/';
    $uploader = new SecureFileUpload($upload_dir, ['document'], 10 * 1024 * 1024); // 10MB max
    
    $filename = $uploader->upload($_FILES['resume']);
    
    if ($filename) {
        echo "Resume uploaded: " . $filename;
    } else {
        echo "Error: " . $uploader->getLastError();
    }
}
```

**SecureFileUpload Features:**
- Multi-layer MIME type validation
- Image integrity verification (getimagesize)
- PHP code/malware detection
- Automatic unique filename generation
- Works without GD extension
- Supports: images (jpg, jpeg, png, gif, webp), documents (pdf, doc, docx)

**Upload Directory Structure:**
```
public/uploads/
├── profiles/    # Profile pictures (.htaccess protected)
├── resumes/     # Application resumes (.htaccess protected)
├── gallery/     # Gallery images
├── projects/    # Project images
├── sponsors/    # Sponsor logos
├── blog/        # Blog images
└── reports/     # Team reports (.htaccess protected)
```

**Important:** All upload directories contain `.htaccess` files to prevent PHP execution.

### 6. Database Queries - Best Practices

**Always use prepared statements:**

```php
// GOOD - Secure
$sql = "SELECT * FROM users WHERE email = :email";
$stmt = $conn->prepare($sql);
$stmt->bindParam(':email', $email);
$stmt->execute();

// BAD - Vulnerable to SQL injection
$sql = "SELECT * FROM users WHERE email = '$email'";
$result = $conn->query($sql);
```

### 7. Adding JavaScript Functionality

```javascript
// public/assets/js/your-script.js

// Use DOMContentLoaded to ensure DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    
    // Select elements
    const button = document.querySelector('.my-button');
    const form = document.querySelector('#myForm');
    
    // Add event listeners
    button.addEventListener('click', handleButtonClick);
    form.addEventListener('submit', handleFormSubmit);
    
});

function handleButtonClick(event) {
    event.preventDefault();
    // Your logic
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    // Get form data
    const formData = new FormData(event.target);
    
    // Validate
    if (!validateForm(formData)) {
        return;
    }
    
    // Submit via AJAX
    fetch('/api/endpoint', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Handle success
        console.log('Success:', data);
    })
    .catch(error => {
        // Handle error
        console.error('Error:', error);
    });
}

function validateForm(formData) {
    // Validation logic
    return true;
}
```

---

## Code Standards

### PHP Coding Standards

```php
<?php
/**
 * Class description
 * 
 * @author Your Name
 * @version 1.0
 */
class MyController {
    
    // Properties
    private $connection;
    protected $tableName = 'users';
    
    /**
     * Constructor
     * 
     * @param PDO $conn Database connection
     */
    public function __construct($conn) {
        $this->connection = $conn;
    }
    
    /**
     * Method description
     * 
     * @param string $email User email
     * @param string $password User password
     * @return bool Success status
     */
    public function authenticate($email, $password) {
        // Use meaningful variable names
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        // Use prepared statements
        $sql = "SELECT * FROM {$this->tableName} WHERE email = :email";
        $stmt = $this->connection->prepare($sql);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        
        // Error handling
        try {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            return password_verify($password, $user['password']);
        } catch (Exception $e) {
            error_log("Authentication error: " . $e->getMessage());
            return false;
        }
    }
}
?>
```

### JavaScript Coding Standards

```javascript
/**
 * Load user data from API
 * @param {number} userId - The user ID
 * @returns {Promise<Object>} User data object
 */
async function loadUserData(userId) {
    try {
        // Use const/let instead of var
        const response = await fetch(`/api/users/${userId}`);
        
        // Check response status
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        // Always handle errors
        console.error('Failed to load user data:', error);
        throw error;
    }
}

// Use arrow functions for callbacks
const numbers = [1, 2, 3, 4, 5];
const doubled = numbers.map(num => num * 2);

// Use template literals
const message = `Hello, ${userName}! Welcome to ${siteName}.`;
```

### CSS Coding Standards

```css
/* Use BEM methodology */
.block {}
.block__element {}
.block__element--modifier {}

/* Example */
.nav-menu {}
.nav-menu__item {}
.nav-menu__item--active {}

/* Use CSS variables for consistency */
.button {
    background-color: var(--primary-color);
    color: var(--text-light);
    padding: 1rem 2rem;
    border-radius: 4px;
}

/* Mobile-first approach */
.container {
    width: 100%;
    padding: 1rem;
}

@media (min-width: 768px) {
    .container {
        padding: 2rem;
    }
}

@media (min-width: 1024px) {
    .container {
        max-width: 1200px;
        margin: 0 auto;
    }
}
```

---

## Database Management

### Connection Configuration

File: `src/config/database.php`

```php
<?php
// Database credentials
$host = 'localhost';
$database = 'fsblackhornets';
$username = 'root';
$password = '';

try {
    // Create PDO connection
    $conn = new PDO(
        "mysql:host=$host;dbname=$database;charset=utf8mb4",
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]
    );
} catch(PDOException $e) {
    error_log("Connection failed: " . $e->getMessage());
    die("Database connection failed");
}
?>
```

### Creating New Tables

1. Create SQL file in `src/database/`:

```sql
-- src/database/events.sql

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    location VARCHAR(255),
    image VARCHAR(255),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_date (date),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

2. Import to database:
```bash
mysql -u root -p fsblackhornets < src/database/events.sql
```

### Database Backup

```bash
# Manual backup
mysqldump -u root -p fsblackhornets > backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u root -p fsblackhornets < backup_20241113.sql
```

---

## Troubleshooting

### Common Issues

#### 1. "Page Not Found" / 404 Errors

**Cause**: Incorrect paths after restructuring

**Solution**: Check file paths in HTML files
```html
<!-- If page is in public/pages/, use: -->
<link rel="stylesheet" href="../assets/css/style.css">
<script src="../assets/js/header-footer.js"></script>

<!-- If page is in public/, use: -->
<link rel="stylesheet" href="assets/css/style.css">
<script src="assets/js/header-footer.js"></script>
```

#### 2. "Database Connection Failed"

**Cause**: Wrong credentials in `src/config/database.php`

**Solution**:
1. Verify MySQL is running
2. Check credentials match your MySQL setup
3. Ensure database exists
4. Test connection:
```bash
mysql -u root -p
# Then: USE fsblackhornets;
```

#### 3. "Headers Already Sent" Error

**Cause**: Output before header() function

**Solution**:
- Check for whitespace before `<?php`
- Check for `echo` before `header()`
- Use output buffering: `ob_start()` at file beginning

#### 4. File Upload Fails

**Cause**: Permissions or file size

**Solution**:
```bash
# Check permissions
chmod 755 storage/uploads/

# Check PHP settings in php.ini
upload_max_filesize = 10M
post_max_size = 10M
```

#### 5. Styles Not Loading

**Cause**: Path issues or caching

**Solution**:
- Clear browser cache (Ctrl+F5)
- Check CSS file path
- Verify file exists
- Check console for 404 errors

#### 6. JavaScript Not Working

**Cause**: Script loading order or errors

**Solution**:
- Open browser console (F12) to see errors
- Ensure scripts load after DOM: use `defer` or `DOMContentLoaded`
- Check script paths are correct

---

## FAQs

### Q: How do I change the database name?
**A:** 
1. Update `src/config/database.php`
2. Create new database: `CREATE DATABASE new_name;`
3. Import tables to new database

### Q: How do I add a new admin user?
**A:**
```sql
-- Hash password first (use online tool or PHP)
INSERT INTO users (username, email, password, role)
VALUES ('admin', 'admin@email.com', '$2y$10$hashedpassword', 'admin');
```

### Q: How do I disable a feature temporarily?
**A:** Comment out navigation link and set page to maintenance:
```html
<!-- Comment out in navigation -->
<!-- <a href="events.html">Events</a> -->

<!-- Add to page -->
<div style="text-align:center; padding:100px;">
    <h1>Under Maintenance</h1>
    <p>This feature is temporarily unavailable.</p>
</div>
```

### Q: How do I optimize images?
**A:**
- Use online tools: TinyPNG, Squoosh
- Recommended sizes:
  - Hero images: 1920x1080px
  - Profile photos: 500x500px
  - Thumbnails: 300x300px
- Format: JPG for photos, PNG for logos, WebP for modern browsers

### Q: How do I add Google Analytics?
**A:** Add to all pages before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Q: How do I test on mobile devices?
**A:**
1. Browser DevTools (F12) → Device toolbar
2. Use your phone on same network:
   - Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
   - Access: `http://YOUR_IP/fsblackhornets/public/`

### Q: How do I update PHP version?
**A:**
1. Download new PHP version
2. Update Apache configuration
3. Test compatibility
4. Update composer dependencies

---

## Quick Reference

### File Paths
```
Current page in /public/pages/
  - CSS:    ../assets/css/style.css
  - JS:     ../assets/js/script.js
  - Images: ../assets/images/logo.png
  - API:    ../../src/api/endpoint.php

Current page in /public/
  - CSS:    assets/css/style.css
  - JS:     assets/js/script.js
  - Images: assets/images/logo.png
  - API:    ../src/api/endpoint.php
```

### Database Connection
```php
require_once '../config/database.php';
// $conn is now available
```

### Authentication Check
```php
require_once '../middleware/auth_check.php';
// Will redirect if not authenticated
```

### Common Functions
```javascript
// Get data from API
fetch('/fsblackhornets/src/api/posts/read.php')
  .then(res => res.json())
  .then(data => console.log(data));

// Post data to API
fetch('/fsblackhornets/src/api/posts/create.php', {
  method: 'POST',
  body: JSON.stringify({title: 'Test'}),
  headers: {'Content-Type': 'application/json'}
});
```

---

## Getting Help

### Documentation
- README.md - Project overview
- ARCHITECTURE.md - System design
- DEPLOYMENT.md - Deployment guide
- SECURITY.md - Security practices

### Resources
- [PHP Manual](https://www.php.net/manual/en/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [W3Schools](https://www.w3schools.com/)

### Contact
- Email: formulastudentftn@gmail.com
- University: Faculty of Technical Sciences, Novi Sad

---

**Document Version**: 1.0  
**Last Updated**: November 13, 2024  
**Maintainer**: Black Hornets Racing Development Team

---

## Maintenance Checklist

- [ ] Update this guide when adding new features
- [ ] Document all major changes in CHANGELOG.md
- [ ] Keep database schemas up to date
- [ ] Test all code examples before documenting
- [ ] Review and update annually
- [ ] Add new troubleshooting cases as they arise

---

*This guide should be kept up-to-date by all developers. If you find errors or have suggestions, please update this document.*
