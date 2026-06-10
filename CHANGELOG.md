# Changelog

All notable changes to the Black Hornets Racing Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-13

### Added
- Initial release of Black Hornets Racing Platform
- Public-facing website with homepage, team gallery, projects, and sponsors
- Member application system with online form submission
- Admin dashboard for managing team operations
- Blog system for news and updates
- Image gallery with lightbox functionality
- Contact form with email notifications
- RESTful API endpoints for posts, projects, gallery, and sponsors
- Authentication and authorization system
- File upload functionality for resumes, images, and documents
- Team member management system
- Report submission and tracking system
- Sponsor management interface
- Responsive design for mobile, tablet, and desktop
- Professional MVC-inspired architecture
- Security features (SQL injection protection, XSS prevention, CSRF tokens)
- Comprehensive documentation (README, CONTRIBUTING, SECURITY)

### Project Structure
- Organized into `public/`, `src/`, and `storage/` directories
- Separated concerns: controllers, views, models, middleware
- RESTful API structure
- Component-based UI architecture

### Performance Optimizations
- Preconnect for external resources
- Deferred non-critical scripts
- Optimized asset loading
- Browser caching configuration
- GZIP compression enabled

### Security
- Prepared statements for database queries
- Input validation and sanitization
- Secure password hashing
- Session management
- File upload restrictions
- Security headers configuration

## [1.1.0] - 2025-11-20

### Added
- **Bilingual Support**: Complete English/Serbian translation system
  - Custom JavaScript i18n implementation with 200+ translation keys
  - Real-time language switching without page reload
  - localStorage persistence for language preference
  - Responsive language switcher (desktop fixed position, mobile integrated menu)
- **3D Flipbook Feature**: Interactive partner brochure showcase
  - Turn.js 3 integration for 3D page-turning effect
  - 6-page brochure with controls and page counter
  - Repositioned navigation controls (left/right sides)
- **Sponsors Page Enhancements**:
  - "Become a Sponsor" section with CTA buttons
  - Partner Newsletter and Partner Brochure download buttons
  - Added "Institucija" sponsor tier
  - Centered and enlarged sponsor title (3rem)
- **Contact Page Updates**:
  - Replaced Leaflet map with Google Maps iframe embed
  - Centered contact info cards on desktop (CSS Grid)
  - Added FAQ section with translations
  - Updated hero section to 60vh with glow animation
- **Apply Page**:
  - Complete application form with comprehensive validation
  - 2-column card grid for Requirements and Departments sections
  - 2-column form layout on desktop
  - Full translation support for all form fields and content
  - Secure PDF resume upload with validation
- **Team Page Improvements**:
  - Fixed language persistence issue (removed forced English reset)
  - Added translation support for all team roles and departments
  - Dynamic member card translation (Team Leader, Project Leader, Sub Leader)
  - Language change event listener for automatic re-rendering
  - Adjusted hero section to 40vh height with min-height override
- **Hero Section Standardization**:
  - Consistent 60vh height across Projects, Contact, Sponsors pages
  - 40vh height on Team page for better proportion
  - Animated glowing text effect on all hero titles
  - @keyframes glow animation with alternating text-shadow
  - Enhanced overlay gradients

### Changed
- **Navbar Responsiveness**: Mobile menu now activates at 1024px (tablet) instead of 768px
- **File Upload Security**: Enhanced SecureFileUpload class
  - Skips PHP code detection for validated binary files (PDFs, images)
  - Improved PDF signature validation
  - Better error messaging
- **Application Processing**: Fixed resume path handling in application_details.php
- **Database Variable Fix**: Corrected $resume_path to $resume_filename in apply.php

### Fixed
- Team page language switching now works correctly (no forced language reset)
- Member card roles and departments now translate properly
- Sponsor images loading with correct paths (../admin/uploads/)
- Flipbook controls no longer hidden under the book
- Apply page fully translates when switching languages
- Requirements and Departments card headers now have consistent styling
- FAQ question #2 in Contact page now translates to English
- Resume file validation no longer gives false positives on legitimate PDFs
- Application form validation removed non-existent 'team' and 'department' fields
- JSON response errors resolved with output buffering in apply.php
- Resume file display in admin application details now checks correct file path

### Security
- Added output buffering to prevent HTML leakage in API responses
- Enhanced file upload validation with multi-layer MIME checking
- Improved error handling to always return proper JSON responses

## [Unreleased]

### Planned Features
- [ ] Two-factor authentication
- [ ] Advanced search functionality
- [ ] Real-time notifications
- [ ] Email newsletter system
- [ ] Event calendar integration
- [ ] Document version control
- [ ] Team performance analytics
- [ ] Mobile application
- [x] Multi-language support (English, Serbian) ✅ **Completed in v1.1.0**
- [ ] Docker containerization
- [ ] CI/CD pipeline integration
- [ ] Unit and integration tests
- [ ] API rate limiting
- [ ] Redis caching layer
- [ ] WebSocket support for real-time updates

### Improvements Planned
- [ ] Refactor to use ORM (Eloquent/Doctrine)
- [ ] Implement proper dependency injection
- [ ] Add automated testing suite
- [ ] Enhance error handling and logging
- [ ] Improve API documentation (OpenAPI/Swagger)
- [ ] Add pagination to all list views
- [ ] Implement soft deletes
- [ ] Add audit trail for admin actions
- [ ] Enhance mobile responsiveness
- [ ] Optimize database queries

---

## Version History

### [1.0.0] - 2024-11-13
- Initial stable release
- Complete feature set for Formula Student team management
- Production-ready with security measures
- Comprehensive documentation
- Professional architecture and code organization

---

**Note**: This project is actively maintained by the Black Hornets Racing Team.
For bug reports and feature requests, please create an issue on GitHub.
