# System Architecture Documentation

## Overview

Black Hornets Racing Platform is a full-stack web application built using a modern MVC-inspired architecture with clear separation of concerns, RESTful API design, and professional coding standards.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │   Mobile     │  │   Tablet     │      │
│  │  (Desktop)   │  │   Device     │  │   Device     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Static Assets (HTML, CSS, JavaScript)                │  │
│  │  - Responsive UI Components                           │  │
│  │  - Client-side Validation                             │  │
│  │  - AJAX Requests                                      │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      WEB SERVER LAYER                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Apache HTTP Server                                    │  │
│  │  - URL Rewriting (.htaccess)                          │  │
│  │  - Security Headers                                    │  │
│  │  - Static File Serving                                │  │
│  │  - GZIP Compression                                   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION LAYER                         │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │   Middleware        │  │   Controllers       │          │
│  │  ┌──────────────┐  │  │  ┌──────────────┐  │          │
│  │  │ Auth Check   │  │  │  │ Login        │  │          │
│  │  │ Session Mgmt │  │  │  │ Application  │  │          │
│  │  │ Validation   │  │  │  │ Dashboard    │  │          │
│  │  └──────────────┘  │  │  │ Contact      │  │          │
│  └─────────────────────┘  │  │ Reports      │  │          │
│                            │  └──────────────┘  │          │
│  ┌─────────────────────┐  └─────────────────────┘          │
│  │   API Endpoints     │                                    │
│  │  ┌──────────────┐  │  ┌─────────────────────┐          │
│  │  │ Posts        │  │  │   Utilities         │          │
│  │  │ Projects     │  │  │  ┌──────────────┐  │          │
│  │  │ Gallery      │  │  │  │ Email        │  │          │
│  │  │ Sponsors     │  │  │  │ Team Data    │  │          │
│  │  └──────────────┘  │  │  │ Helpers      │  │          │
│  └─────────────────────┘  │  └──────────────┘  │          │
│                            └─────────────────────┘          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       DATA LAYER                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  MySQL Database                                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │ Users       │  │ Posts       │  │ Applications│  │  │
│  │  │ Teams       │  │ Projects    │  │ Messages    │  │  │
│  │  │ Members     │  │ Gallery     │  │ Reports     │  │  │
│  │  │ Sponsors    │  │ Contacts    │  │ Sessions    │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      STORAGE LAYER                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  File System (public/uploads/ + public/admin/uploads/)│  │
│  │  - Resumes (.pdf) - .htaccess protected              │  │
│  │  - Profile Images (.jpg, .png) - .htaccess protected │  │
│  │  - Gallery Images - Publicly accessible              │  │
│  │  - Project Images - Publicly accessible              │  │
│  │  - Sponsor Logos - Publicly accessible               │  │
│  │  - Blog Images - Publicly accessible                 │  │
│  │  - Team Reports - .htaccess protected                │  │
│  │                                                        │  │
│  │  Security: SecureFileUpload class + .htaccess files  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Directory Structure

### Root Level
```
fsblackhornets/
├── public/          # Document root (web-accessible)
├── src/             # Backend source code
├── .htaccess        # Apache configuration
├── .gitignore       # Git ignore rules
└── *.md             # Documentation files
```

### Public Directory (Document Root)
```
public/
├── index.html       # Homepage
├── assets/          # Static resources
│   ├── css/        # Stylesheets
│   ├── js/         # Client-side JavaScript
│   ├── images/     # Images and media
│   └── fonts/      # Web fonts
├── pages/          # HTML pages
│   ├── about.html
│   ├── team.html
│   ├── projects.html
│   ├── gallery.html
│   ├── sponsors.html
│   ├── blog.html
│   ├── contact.html
│   └── apply.html
├── admin/          # Admin panel
│   ├── pages/      # Admin management pages
│   └── uploads/    # Admin uploaded content
├── api/            # API endpoints
└── uploads/        # User-uploaded files (web-accessible with security)
    ├── profiles/   # Profile pictures (.htaccess protected)
    ├── resumes/    # Application resumes (.htaccess protected)
    ├── gallery/    # Gallery images
    ├── projects/   # Project images
    ├── sponsors/   # Sponsor logos
    ├── blog/       # Blog images
    └── reports/    # Team reports
```

### Source Directory (Backend)
```
src/
├── api/            # RESTful API endpoints
│   ├── posts/     # Blog posts CRUD
│   ├── projects/  # Projects CRUD
│   ├── gallery/   # Gallery CRUD
│   └── sponsors/  # Sponsors CRUD
├── config/        # Configuration
│   ├── database.php
│   └── database.example.php
├── utils/         # Utility classes and functions
│   ├── SecureFileUpload.php  # Comprehensive file upload security
│   ├── email_sender.php      # Email utilities
│   └── team_data.php         # Team data helpers
├── services/      # Business services
│   └── send_acceptance_email.php
└── database/      # SQL schemas
    ├── blog_tables.sql
    ├── applications.sql
    └── contact_messages.sql
```

### File Upload Security

All file uploads are handled through the `SecureFileUpload` utility class located at `src/utils/SecureFileUpload.php`. This class provides:

- **Multi-layer validation**: MIME type detection, file extension whitelist, file size limits
- **Image integrity check**: Uses `getimagesize()` to verify actual image files
- **Malware detection**: Pattern matching for PHP code and shell scripts
- **Secure file naming**: Unique prefixed filenames to prevent overwrites
- **GD extension fallback**: Works without GD extension loaded

Uploads are stored in `public/uploads/` with `.htaccess` protection preventing direct PHP execution.

## Design Patterns

### 1. MVC-Inspired Architecture
- **Model**: Database schemas and data access (to be fully implemented)
- **View**: HTML templates and components
- **Controller**: Business logic and request handling

### 2. RESTful API Design
```
POST   /api/posts/create.php    # Create post
GET    /api/posts/read.php      # Read posts
PUT    /api/posts/update.php    # Update post (to be implemented)
DELETE /api/posts/delete.php    # Delete post (to be implemented)
```

### 3. Middleware Pattern
```
Request → Middleware (Auth) → Controller → Response
```

### 4. Component-Based UI
Reusable components:
- Header navigation
- Footer
- Form elements
- Card components

## Data Flow

### 1. Public Page Request
```
1. User requests page (e.g., /pages/team.html)
2. Apache serves static HTML
3. Browser loads assets (CSS, JS, images)
4. JavaScript makes AJAX call to API
5. PHP API queries database
6. JSON response sent to client
7. JavaScript updates DOM dynamically
```

### 2. Form Submission
```
1. User fills form and submits
2. Client-side validation (JavaScript)
3. AJAX POST to controller
4. Server-side validation (PHP)
5. Database insert/update
6. File upload to storage (if applicable)
7. Success/error response to client
8. UI feedback to user
```

### 3. Admin Authentication
```
1. User submits login form
2. Controller validates credentials
3. Password hash verification
4. Session created on success
5. Middleware checks session for protected routes
6. Dashboard loaded on successful auth
```

## Security Architecture

### Input Validation
- **Client-side**: JavaScript validation for UX
- **Server-side**: PHP validation for security
- **Database**: Prepared statements prevent SQL injection

### Authentication Flow
```
Login → Hash Verification → Session Creation → Middleware Check → Protected Resource
```

### File Upload Security
```
Upload → SecureFileUpload Class → Multi-layer Validation:
  1. MIME Type Detection (finfo)
  2. File Extension Whitelist
  3. File Size Check
  4. Image Integrity Validation (getimagesize)
  5. PHP Code Pattern Detection
  6. Unique Filename Generation
  7. Move to public/uploads/ with .htaccess Protection
```

**SecureFileUpload Class Features:**
- Accepts image, PDF, and document types
- Maximum file size configurable (default 5MB for images, 10MB for documents)
- Prevents PHP shell uploads through content scanning
- No GD extension dependency (uses fallback validation)
- Returns sanitized filename or false on failure

### Headers Configuration
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
```

## Database Schema

### Key Tables
1. **users** - Admin and member accounts
2. **applications** - Team applications
3. **posts** - Blog posts
4. **projects** - Team projects
5. **gallery** - Image gallery
6. **sponsors** - Sponsor information
7. **messages** - Contact messages
8. **reports** - Team member reports
9. **sessions** - User sessions

### Relationships
```
users 1:N applications
users 1:N reports
posts 1:1 images
projects 1:N images
members N:N departments
```

## API Architecture

### Endpoints Structure
```
/api/
├── posts/
│   ├── create.php   # POST - Create post
│   └── read.php     # GET - List all posts
├── projects/
│   └── read.php     # GET - List all projects
├── gallery/
│   └── read.php     # GET - List gallery images
└── sponsors/
    └── read.php     # GET - List sponsors
```

### Response Format
```json
{
  "success": true,
  "data": [...],
  "message": "Success",
  "timestamp": "2024-11-13T12:00:00Z"
}
```

### Error Handling
```json
{
  "success": false,
  "error": "Error message",
  "code": 400,
  "timestamp": "2024-11-13T12:00:00Z"
}
```

## Performance Optimization

### Client-Side
- Minified CSS and JavaScript
- Image optimization
- Lazy loading for images
- Browser caching
- CDN for external libraries

### Server-Side
- PHP OPcache enabled
- Database query optimization
- GZIP compression
- Static file caching
- Connection pooling

### Database
- Indexed columns
- Query optimization
- Connection reuse
- Prepared statements

## Scalability Considerations

### Current Architecture
- Single server deployment
- Shared hosting compatible
- File-based uploads

### Future Scalability Options
1. **Database**: Master-slave replication
2. **Files**: CDN for static assets, S3 for uploads
3. **Caching**: Redis/Memcached layer
4. **Load Balancing**: Multiple app servers
5. **Microservices**: Separate API services

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with Flexbox/Grid
- **JavaScript ES6+**: Vanilla JS for logic
- **Font Awesome 6**: Icons
- **Lightbox2**: Image gallery
- **Leaflet**: Maps
- **GSAP**: Animations

### Backend
- **PHP 8.2+**: Server-side logic
- **Apache 2.4+**: Web server
- **MySQL 5.7+**: Database

### DevOps
- **Git**: Version control
- **Apache**: Web server
- **.htaccess**: URL rewriting
- **File permissions**: Security

## Deployment Architecture

### Development
```
localhost → XAMPP → Development Database
```

### Production
```
Domain → SSL → Apache → PHP → MySQL
              ↓
         Static Files (CDN)
```

## Monitoring & Logging

### Application Logs
- Error logs: PHP errors
- Access logs: Apache access
- Custom logs: Application events

### Monitoring Points
- Server uptime
- Response times
- Error rates
- Database performance
- Storage usage

## Backup Strategy

### Daily Backups
- Database dump
- File system snapshot
- Configuration files

### Retention Policy
- Daily backups: 7 days
- Weekly backups: 4 weeks
- Monthly backups: 12 months

## Maintenance

### Regular Tasks
- Security updates
- Dependency updates
- Database optimization
- Log rotation
- Backup verification

---

**Document Version**: 1.1  
**Last Updated**: November 17, 2025  
**Author**: Black Hornets Racing Team  
**Latest Changes**: Moved uploads to public directory, added SecureFileUpload security class, removed storage folder
