# Black Hornets Racing - Formula Student Team Platform

[![PHP](https://img.shields.io/badge/PHP-8.2+-blue.svg)](https://www.php.net/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://www.javascript.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Languages](https://img.shields.io/badge/Languages-EN%20%7C%20SR-orange.svg)](README.md)

A comprehensive bilingual (English/Serbian) web platform for managing Formula Student team operations, including team member management, project tracking, sponsor relations, and public engagement.

**Made and currently powered by Software Engineer: Ali Benaisha**

## 🏗️ System Architecture

```
fsblackhornets/
├── public/                 # Web-accessible files (Document Root)
│   ├── index.html         # Homepage
│   ├── assets/            # Static resources
│   │   ├── css/          # Stylesheets
│   │   ├── js/           # Client-side JavaScript
│   │   ├── images/       # Images and media
│   │   └── fonts/        # Web fonts
│   ├── pages/            # Public pages
│   │   ├── about.html
│   │   ├── team.html
│   │   ├── projects.html
│   │   ├── gallery.html
│   │   ├── sponsors.html
│   │   ├── blog.html
│   │   ├── contact.html
│   │   └── apply.html
│   ├── admin/            # Admin panel
│   │   ├── pages/       # Admin management pages
│   │   └── uploads/     # Admin uploaded content
│   ├── api/             # API endpoints
│   └── uploads/         # User uploads (secured with .htaccess)
│
├── src/                   # Backend source code
│   ├── api/              # RESTful API endpoints
│   ├── config/           # Configuration files
│   ├── utils/            # Utility classes
│   │   └── SecureFileUpload.php  # File upload security
│   ├── services/         # Business services
│   └── database/         # Database schemas & migrations
│
├── .htaccess            # Apache configuration
└── README.md            # Documentation
```

## 🚀 Features

### Public Features
- **Bilingual Support**: Full English and Serbian language support with real-time switching
- **Dynamic homepage** with team highlights and racing animations
- **Team gallery** organized by departments (Business Operations, Mechanical Engineering, Electrical Engineering)
- **Projects showcase** with detailed views and 60vh hero sections
- **Sponsor management** with tier system (F1-Platinum, F2-Gold, F3-Silver, F4-Bronze, Institucija, Friends)
  - Interactive 3D flipbook for partner brochure (6 pages)
  - "Become a Sponsor" section with Partner Newsletter and Brochure CTA buttons
- **Blog system** for news and updates
- **Image gallery** with lightbox and filtering
- **Contact page** with Google Maps integration and FAQ section
- **Online application portal** with comprehensive form validation and secure PDF resume upload

### Admin Features
- **Dashboard**: Real-time analytics, member statistics, application overview, activity tracking
- **Member Management**: Add/Edit/Delete members, role assignment, profile management
- **Application Processing**: Review applications, accept/reject with automated emails, resume viewing
- **Content Management**: 
  - Blog posts (create, edit, delete, publish)
  - Projects showcase (add, update, manage gallery)
  - Image gallery (upload, categorize, organize)
- **Sponsor Management**: Add/Edit/Delete sponsors, tier assignment, logo management
- **Report System**: View member reports, track contributions, department analytics
- **Message Center**: Contact form submissions, read/unread tracking, message management
- **User Roles**: Admin, Team Leader, Member with appropriate permissions

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: PHP 8.2+
- **Database**: MySQL/MariaDB
- **Server**: Apache 2.4+
- **Translation System**: Vanilla JavaScript with localStorage persistence
- **Libraries**: 
  - Font Awesome 6.0.0 (Icons)
  - Lightbox2 (Gallery)
  - Google Maps API (Contact page)
  - AOS (Animations)
  - Turn.js 3 (3D Flipbook)
  - jQuery 3.6.0 (Turn.js dependency)

### 🌐 Internationalization (i18n)

The platform supports **English** and **Serbian** languages using a custom client-side translation system:

- **Technology**: Pure JavaScript (no external i18n libraries)
- **Storage**: localStorage for language preference persistence
- **Architecture**: 
  - Centralized translation object in `header-footer.js` with 200+ keys
  - Page-specific update functions for dynamic content translation
  - Global API (`window.getTranslations()`, `window.getCurrentLanguage()`)
  - Dynamic content translation for team members, projects, and sponsors
- **Implementation**: Real-time language switching without page reload
- **Coverage**: All 8 pages (Home, Team, About, Projects, Gallery, Sponsors, Contact, Apply)
- **Language Switcher UI**:
  - Desktop: Fixed position in top-right corner (below navbar)
  - Mobile: Integrated at top of mobile navigation menu
  - Smooth transitions and active state indication
  - EN/SR toggle buttons with visual feedback

## 🎨 UI/UX Features

### Navigation
- **Responsive Navbar**:
  - Sticky header with scroll effects and glowing border
  - Mobile-friendly hamburger menu (activates at tablet size: 1024px)
  - Active page indication
  - Login and Apply buttons prominently displayed
  - Smooth transitions between desktop/tablet/mobile views
- **Language Switcher**:
  - Desktop: Fixed position (top-right, below navbar)
  - Mobile/Tablet: Integrated at top of mobile menu
  - Visual feedback for active language
  - Smooth animations and hover effects
- **Accessibility**:
  - Icon + text labels for clarity
  - Touch-friendly button sizes (minimum 44px touch targets)
  - Keyboard navigation support
  - High contrast design (Gold #FFD700 on Black #000000)

### Visual Design
- **Racing-inspired aesthetic** with gold (#FFD700) accents and black (#000000) background
- **Hero sections** with consistent styling:
  - 60vh height on Projects, Contact, Sponsors pages
  - 40vh height on Team page
  - Animated glowing text effect on all titles
  - Video backgrounds with gradient overlays
- **Smooth animations**:
  - AOS scroll animations
  - CSS keyframe animations (glow effect, racing lines)
  - Hover transitions on cards and buttons
- **Consistent design system**:
  - Orbitron font for headings
  - Rajdhani font for body text
  - 2-column card grid layouts on desktop
  - Mobile-first responsive design
- **Loading states** and comprehensive error handling

## 📋 Prerequisites

- PHP 8.2 or higher
- MySQL 5.7+ / MariaDB 10.3+
- Apache 2.4+
- Modern web browser

## 💻 Installation

### 1. Clone & Setup
```bash
git clone https://github.com/fsblackhornets/fsproject.git
cd fsblackhornets
```

### 2. Configure Database
```bash
# Open src/config/database.php and update the credentials
```

**Important:** Update the database configuration file with your credentials:

**For Local Development:**
```php
$servername = "localhost";
$username = "root";
$password = "";  // Empty for XAMPP default
$dbname = "fsblaacy_blackhornets";
```

**For Production/Hosting:**
```php
$servername = "localhost";  // Or your hosting provider's server
$username = "your_database_username";  // Replace with actual username
$password = "your_secure_password";    // Replace with actual password
$dbname = "your_database_name";        // Replace with actual database name
```

⚠️ **Security Note:** Never commit `src/config/database.php` with real credentials to version control. The file is already in `.gitignore`.

### 3. Import Database
```bash
mysql -u root -p < src/database/blog_tables.sql
mysql -u root -p < src/database/applications.sql
mysql -u root -p < src/database/contact_messages.sql
```

### 4. Set Permissions
```bash
chmod -R 755 storage/
chmod -R 755 public/assets/
```

### 5. Access
**Local:**
```
Public Website: http://localhost/fsblackhornets/public/
Admin Panel: http://localhost/fsblackhornets/public/admin/login.php
```

**Production:**
```
Public Website: https://yourdomain.com
Admin Panel: https://yourdomain.com/admin/login.php
```

## 🔑 Admin Panel & User Roles

The platform supports three user roles with different permission levels:

### User Roles
- **Admin**: Full system access (manage members, applications, content, sponsors, messages)
- **Team Leader**: Department management access (view team, manage reports)
- **Member**: Basic access (personal profile, submit reports)

### Access URLs
- **Admin Panel:** `/public/admin/login.php`
- **Team Dashboard:** `/public/admin/pages/team_dashboard.php`

---

## 👨‍💼 Admin Panel Features

### 1. **Dashboard** (`/public/admin/pages/dashboard.php`)
- **Overview Statistics:**
  - Total team members count
  - Pending applications count
  - Unread messages count
  - Recent activity log
- **Quick Actions:**
  - Add new member
  - View applications
  - Check messages
  - Manage content
- **Visual Analytics:**
  - Department distribution chart
  - Application status breakdown
  - Monthly activity graph

### 2. **Member Management** (`/public/admin/pages/manage_members.php`)
- **View All Members:**
  - Searchable and filterable member list
  - Sort by department, position, join date
  - View member profiles with full details
- **Add New Members:** (`/public/admin/pages/add_user.php`)
  - Full registration form
  - Department and position assignment
  - Role assignment (Admin/Team Leader/Member)
  - Profile picture upload
  - Academic information tracking
- **Edit Members:** (`/public/admin/pages/edit_member.php`)
  - Update member information
  - Change department/position
  - Modify role permissions
  - Update contact details
  - Profile photo management
- **Delete Members:**
  - Remove members from system
  - Archive member data (optional)

### 3. **Application Management** (`/public/admin/pages/applications_list.php`)
- **View Applications:**
  - All submitted applications
  - Filter by status (Pending/Accepted/Rejected)
  - Sort by date, department, GPA
  - View applicant details
- **Process Applications:** (`/public/admin/pages/process_application.php`)
  - Accept applications → Automatically creates member account
  - Reject applications with reason
  - Send automated acceptance emails
  - View application details and resume/CV
- **Application Details:** (`/public/admin/pages/application_details.php`)
  - Full applicant information
  - Academic background
  - Motivation statement
  - Skills and experience
  - Download resume/CV
  - Review application history

### 4. **Content Management**

#### Blog Posts Management (`/public/admin/pages/posts.php`)
- **Create Posts:** (`/public/admin/pages/add-edit-post.php`)
  - Rich text editor for content
  - Featured image upload
  - Category selection
  - Publish/Draft status
  - SEO metadata
- **Edit Posts:**
  - Update existing content
  - Change featured images
  - Modify categories
  - Update publication status
- **Delete Posts:** (`/public/admin/pages/delete-post.php`)
  - Remove posts from blog
  - Confirmation before deletion

#### Projects Management (`/public/admin/pages/manage-projects.php`)
- **Add Projects:** (`/public/admin/pages/add-edit-project.php`)
  - Project title and description
  - Technical specifications
  - Project images gallery
  - Team members involved
  - Competition results
  - Timeline and milestones
- **Edit Projects:**
  - Update project information
  - Add/remove images
  - Update team assignments
  - Modify specifications
- **Delete Projects:** (`/public/admin/pages/delete-project.php`)
  - Remove projects from showcase

#### Gallery Management (`/public/admin/pages/manage-gallery.php`)
- **Upload Images:**
  - Bulk image upload
  - Category assignment (Events/Workshop/Competitions)
  - Image descriptions
  - Date and location metadata
- **Organize Gallery:**
  - Create albums/categories
  - Reorder images
  - Set featured images
- **Delete Images:**
  - Remove images from gallery

#### Sponsors Management (`/public/admin/pages/manage-sponsors.php`)
- **Add Sponsors:** (`/public/admin/pages/add-edit-sponsor.php`)
  - Sponsor name and logo
  - Website URL
  - Sponsorship tier (F1-Platinum, F2-Gold, F3-Silver, F4-Bronze, Friends)
  - Contact information
  - Sponsorship description
- **Edit Sponsors:**
  - Update sponsor details
  - Change sponsorship tier
  - Modify logos
- **Delete Sponsors:** (`/public/admin/pages/delete-sponsor.php`)
  - Remove sponsors from list

### 5. **Messages Center** (`/public/admin/pages/messages.php`)
- **View Messages:**
  - All contact form submissions
  - Filter by read/unread status
  - Sort by date, sender
  - Mark as read/unread
- **Message Details:**
  - Full message content
  - Sender information
  - Submission timestamp
  - Reply directly via email client
- **Delete Messages:** (`/public/admin/pages/delete_message.php`)
  - Remove processed messages

### 6. **Reports System** (`/public/admin/pages/reports.php`)
- **View All Reports:**
  - Team member activity reports
  - Department-wise report listing
  - Filter by date range, department
- **Report Details:** (`/public/admin/pages/view_report.php`)
  - Full report content
  - Submitted by member name
  - Department and date
  - Attachments and media
- **Member Reports:** (`/public/admin/pages/view_member_reports.php`)
  - View all reports by specific member
  - Track individual contribution
  - Report history timeline

### 7. **Profile Management** (`/public/admin/pages/edit_profile.php`)
- **Update Personal Information:**
  - Change profile photo
  - Update contact details
  - Modify bio and description
  - Change password
  - Update academic information

---

## 👥 Team Dashboard (For Team Leaders & Members)

### Access
- **URL:** `/public/admin/pages/team_dashboard.php`
- **Login:** Same credentials as admin panel
- **Automatic Redirect:** Members and Team Leaders see appropriate dashboard based on role

### Team Leader Features
- **Department Overview:**
  - View all members in their department
  - Track member activity
  - Monitor report submissions
- **Member Reports:**
  - View reports from department members
  - Track contribution and progress
  - Export reports for evaluation
- **Team Statistics:**
  - Department member count
  - Active members count
  - Report submission rate

### Member Features
- **Personal Dashboard:**
  - View personal profile
  - Access personal statistics
  - Quick links to submit reports
- **Submit Reports:** (`/public/admin/pages/add_report.php`)
  - Create activity reports
  - Document work progress
  - Upload supporting files
  - Track submission history
- **Profile Management:**
  - Update profile information
  - Change password
  - Upload profile picture
  - Update contact details
- **View Own Reports:**
  - Access submitted reports history
  - Track report status
  - Edit pending reports

---

## 🔐 Authentication & Security

### Login System (`/public/admin/login.php`, `/public/admin/process_login.php`)
- **Secure Authentication:**
  - Password hashing (bcrypt)
  - Session management
  - Login attempt tracking
  - Remember me functionality
  - Automatic session timeout
- **Role-Based Access Control:**
  - Admin: Full access to all features
  - Team Leader: Department management only
  - Member: Personal dashboard and reports only
- **Security Features:**
  - SQL injection prevention
  - XSS protection
  - CSRF token validation
  - Secure session handling

### Password Management
- **Password Requirements:**
  - Minimum 8 characters
  - Mix of letters and numbers recommended
  - Case-sensitive
- **Password Reset:** (Contact administrator)
- **Update Password:** Available in profile settings

---

## 📊 User Workflow Examples

### Admin Workflow: Processing New Application
1. Login to Admin Panel
2. Navigate to Dashboard → View pending applications
3. Click on "Applications" in sidebar
4. Review application details
5. Click "View Details" for complete information
6. Click "Accept" → System creates member account automatically
7. Send acceptance email with credentials
8. New member appears in Members list

### Team Leader Workflow: Managing Department
1. Login to Team Dashboard
2. View department members
3. Check recent reports submitted
4. Review individual member contributions
5. Track department statistics

### Member Workflow: Submitting Report
1. Login to Team Dashboard
2. Navigate to "Add Report"
3. Fill report details (title, description, date)
4. Upload supporting documents (optional)
5. Submit report
6. View in "My Reports" section

---

## 🔑 Default Access Credentials

**First-time setup requires creating users in the database:**

```sql
-- Create Admin User
INSERT INTO users (student_id, password, role, name, email, department) 
VALUES ('admin', '$2y$10$hashed_password_here', 'admin', 'Admin User', 'admin@example.com', 'Management');

-- Create Team Leader
INSERT INTO users (student_id, password, role, name, email, department) 
VALUES ('TL001', '$2y$10$hashed_password_here', 'team_leader', 'Team Leader Name', 'leader@example.com', 'Mechanical');

-- Create Member
INSERT INTO users (student_id, password, role, name, email, department) 
VALUES ('M001', '$2y$10$hashed_password_here', 'member', 'Member Name', 'member@example.com', 'Electrical');
```

**Note:** Use PHP's `password_hash()` function to generate password hashes.

## 🔐 Security Features

- **SQL injection protection** (prepared statements with parameter binding)
- **XSS prevention** (input sanitization with htmlspecialchars)
- **CSRF token validation** for form submissions
- **Secure password hashing** (bcrypt with PASSWORD_DEFAULT)
- **Comprehensive file upload security:**
  - SecureFileUpload utility class with multi-layer validation
  - MIME type verification (browser + server-side detection)
  - File extension whitelist enforcement
  - Image integrity verification (getimagesize, GD library validation)
  - PDF signature validation (%PDF- header check)
  - Malware/PHP shell pattern detection (skipped for validated binary files)
  - .htaccess protection in all upload directories
  - Unique filename generation (uniqid + random_bytes)
  - File size limits (5MB for resumes, configurable per use case)
- **Authentication middleware** with session management
- **Security headers** (Content-Type, Access-Control policies)
- **Role-based access control** (Admin, Team Leader, Member roles)
- **Output buffering** to prevent HTML leakage in API responses

## 📁 Key Directories

- `public/` - All publicly accessible files (Document Root)
  - `index.html` - Homepage
  - `pages/` - Public pages (Team, About, Projects, Gallery, Sponsors, Contact, Apply)
  - `assets/` - CSS, JavaScript, images, fonts
  - `api/` - RESTful API endpoints
  - `uploads/` - User-uploaded files (secured with .htaccess)
    - `profiles/` - Profile pictures
    - `resumes/` - Application resumes
    - `gallery/` - Gallery images
    - `projects/` - Project images
    - `sponsors/` - Sponsor logos
    - `blog/` - Blog images
    - `reports/` - Team reports
  - `admin/` - Admin panel
    - `login.php` - Admin login page
    - `pages/` - Admin dashboard and management pages
    - `uploads/` - Admin-specific uploads
    - Authentication files (auth.php, process_login.php, logout.php)
- `src/` - Backend source code
  - `api/` - RESTful API endpoints
  - `config/` - Configuration files (database.php)
  - `utils/` - Utility classes
    - `SecureFileUpload.php` - Comprehensive file upload security handler
  - `services/` - Business services
  - `database/` - Database schemas & migrations

## 🎨 Design System

- **Primary Color**: #FFD700 (Gold)
- **Background**: #000000 (Black)
- **Text**: #FFFFFF (White)
- **Font (Headings)**: Orbitron
- **Font (Body)**: Rajdhani

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (single column, hamburger menu)
- **Tablet**: 768px - 1024px (hamburger menu, adjusted layouts)
- **Desktop**: > 1024px (full navigation, multi-column grids)

### Key Responsive Features
- Navbar switches to mobile menu at 1024px
- Hero sections adjust height for mobile (50vh on mobile, 40-60vh on desktop)
- Card grids adapt: 2-3 columns on desktop → 1 column on mobile
- Form layouts: 2-column on desktop → single column on mobile
- Language switcher repositions: fixed desktop → integrated mobile menu
- Images and videos scale responsively with object-fit
- Touch-optimized button sizes on mobile devices

## 🔄 API Endpoints

- `GET /src/api/posts/read.php` - Blog posts
- `GET /src/api/projects/read.php` - Projects
- `GET /src/api/gallery/read.php` - Gallery images
- `GET /src/api/sponsors/read.php` - Sponsors

## 📈 Future Enhancements

- [ ] ORM implementation
- [ ] Unit tests (PHPUnit)
- [ ] CI/CD pipeline
- [ ] Real-time notifications
- [ ] Docker containerization
- [ ] Redis caching
- [ ] Search functionality
- [x] Multi-language support (English/Serbian) ✅

## 📧 Contact

**Black Hornets Racing**
- Email: formulastudentftn@gmail.com
- Phone: +381 62 782 568
- University: University of Novi Sad

## 👨‍💻 Developer

**Ali Benaisha** - Software Engineer  
*Made and currently powered by Ali Benaisha*

## 📝 License

MIT License - see LICENSE file for details

---

**Final Year Software Engineering Project - 2024/2025**

*Developed with ❤️ by the Black Hornets Racing Team*  
*Platform Engineering & Bilingual Implementation by Ali Benaisha*
