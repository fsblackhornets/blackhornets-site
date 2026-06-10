# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. DO NOT
- Open a public issue
- Disclose the vulnerability publicly
- Exploit the vulnerability

### 2. DO
Send details to: **formulastudentftn@gmail.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Timeline
- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Based on severity
  - Critical: 24-48 hours
  - High: 3-7 days
  - Medium: 7-14 days
  - Low: 14-30 days

## Security Measures

### Implemented
- SQL injection protection via prepared statements
- XSS prevention through input sanitization
- CSRF token validation
- Secure password hashing (bcrypt)
- **Comprehensive file upload security (SecureFileUpload class)**
  - Multi-layer MIME type validation
  - Image integrity verification
  - Malware/shell detection
  - .htaccess protection in upload directories
- Session management and expiry
- Authentication middleware
- Security headers (CSP, X-Frame-Options, etc.)
- Input validation on both client and server
- Rate limiting on sensitive endpoints

### Best Practices
1. **Database**
   - Use prepared statements
   - Principle of least privilege for DB users
   - Regular backups
   - No sensitive data in version control

2. **Authentication**
   - Strong password requirements
   - Session timeout after inactivity
   - Secure session cookies
   - Password reset with email verification

3. **File Uploads**
   - Comprehensive SecureFileUpload class with multi-layer validation
   - MIME type detection using finfo
   - File extension whitelist (images: jpg, jpeg, png, gif, webp; documents: pdf, doc, docx)
   - File size limits (5MB for images, 10MB for documents)
   - Image integrity validation using getimagesize()
   - PHP code pattern detection to prevent shell uploads
   - .htaccess protection in all upload directories (prevents PHP execution)
   - Unique filename generation to prevent overwrites
   - GD extension optional (fallback validation available)

4. **API Security**
   - Rate limiting
   - Input validation
   - Output encoding
   - CORS configuration

## Known Security Considerations

### Current Limitations
1. No two-factor authentication (planned)
2. No password strength meter (planned)
3. No automated vulnerability scanning (planned)

### Dependencies
Keep dependencies updated:
```bash
# Check for updates
composer outdated
npm outdated
```

## Security Checklist for Deployment

- [ ] Change default credentials
- [ ] Enable HTTPS/SSL
- [ ] Update `database.php` with strong credentials
- [ ] Set appropriate file permissions (755 for directories, 644 for files)
- [ ] Disable PHP error display in production
- [ ] Enable PHP error logging
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Enable security headers
- [ ] Configure CORS appropriately
- [ ] Remove test/debug endpoints
- [ ] Update all dependencies
- [ ] Enable rate limiting
- [ ] Configure fail2ban or similar

## Disclosure Policy

- Security vulnerabilities will be disclosed after a fix is available
- Credit will be given to researchers who report vulnerabilities responsibly
- Public disclosure will occur 90 days after fix or by mutual agreement

## Contact

For security concerns:
- **Email**: formulastudentftn@gmail.com
- **Subject**: [SECURITY] Brief description
- **PGP Key**: Available upon request

Thank you for helping keep Black Hornets Racing Platform secure!
