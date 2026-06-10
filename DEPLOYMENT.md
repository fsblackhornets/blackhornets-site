# Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Setup
- [ ] PHP 8.2+ installed and configured
- [ ] MySQL/MariaDB installed and running
- [ ] Apache web server configured
- [ ] mod_rewrite enabled
- [ ] SSL certificate obtained (for production)
- [ ] Domain name configured

### 2. Security Configuration
- [ ] Change all default passwords
- [ ] Configure `src/config/database.php` with production credentials
- [ ] Set strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure security headers
- [ ] Set appropriate file permissions
- [ ] Disable PHP error display in production
- [ ] Enable PHP error logging

### 3. Database Setup
- [ ] Create production database
- [ ] Import all SQL schemas
- [ ] Create database user with minimal privileges
- [ ] Test database connection
- [ ] Set up automated backups

### 4. File Permissions
```bash
# Set directory permissions
chmod 755 public/
chmod 755 storage/
chmod 755 storage/uploads/
chmod -R 755 storage/uploads/*

# Set file permissions
find public/ -type f -exec chmod 644 {} \;
find src/ -type f -exec chmod 644 {} \;

# Protect sensitive files
chmod 600 src/config/database.php
```

## Production Deployment

### Option 1: Shared Hosting

#### 1. Upload Files
```bash
# Using FTP/SFTP, upload to server
# Ensure public/ is in public_html or www directory
```

#### 2. Configure .htaccess
```apache
# In root .htaccess
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

#### 3. Database Configuration
- Update `src/config/database.php` with hosting credentials
- Import database via cPanel/phpMyAdmin

#### 4. Test
- Verify homepage loads
- Test admin login
- Check file uploads
- Verify API endpoints

### Option 2: VPS/Dedicated Server

#### 1. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Apache
sudo apt install apache2 -y

# Install PHP 8.2
sudo apt install php8.2 php8.2-mysql php8.2-mbstring php8.2-xml php8.2-curl -y

# Install MySQL
sudo apt install mysql-server -y
```

#### 2. Apache Configuration
```bash
# Create virtual host
sudo nano /etc/apache2/sites-available/blackhornets.conf
```

```apache
<VirtualHost *:80>
    ServerName blackhornets.com
    ServerAlias www.blackhornets.com
    DocumentRoot /var/www/fsblackhornets/public
    
    <Directory /var/www/fsblackhornets/public>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/blackhornets-error.log
    CustomLog ${APACHE_LOG_DIR}/blackhornets-access.log combined
</VirtualHost>
```

```bash
# Enable site and mod_rewrite
sudo a2ensite blackhornets.conf
sudo a2enmod rewrite
sudo systemctl restart apache2
```

#### 3. SSL Configuration (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-apache -y

# Get certificate
sudo certbot --apache -d blackhornets.com -d www.blackhornets.com

# Auto-renewal
sudo certbot renew --dry-run
```

#### 4. Database Setup
```bash
# Secure MySQL
sudo mysql_secure_installation

# Create database and user
sudo mysql
```

```sql
CREATE DATABASE fsblackhornets CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'blackhornets'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT SELECT, INSERT, UPDATE, DELETE ON fsblackhornets.* TO 'blackhornets'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Import database
mysql -u blackhornets -p fsblackhornets < src/database/blog_tables.sql
mysql -u blackhornets -p fsblackhornets < src/database/applications.sql
mysql -u blackhornets -p fsblackhornets < src/database/contact_messages.sql
```

#### 5. Application Configuration
```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourusername/fsblackhornets.git

# Set ownership
sudo chown -R www-data:www-data /var/www/fsblackhornets

# Configure database
sudo cp src/config/database.example.php src/config/database.php
sudo nano src/config/database.php
# Update credentials
```

#### 6. Security Hardening
```bash
# Set file permissions
sudo find /var/www/fsblackhornets -type d -exec chmod 755 {} \;
sudo find /var/www/fsblackhornets -type f -exec chmod 644 {} \;
sudo chmod 600 /var/www/fsblackhornets/src/config/database.php

# Install fail2ban
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Configure firewall
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp
sudo ufw enable
```

### Option 3: Docker Deployment

#### 1. Create Dockerfile
```dockerfile
FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# Enable Apache modules
RUN a2enmod rewrite

# Copy application
COPY . /var/www/html/

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage

EXPOSE 80
```

#### 2. Create docker-compose.yml
```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    volumes:
      - ./:/var/www/html
    depends_on:
      - db
    environment:
      - DB_HOST=db
      - DB_NAME=fsblackhornets
      - DB_USER=root
      - DB_PASSWORD=password
      
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: fsblackhornets
    volumes:
      - db_data:/var/lib/mysql

volumes:
  db_data:
```

#### 3. Deploy
```bash
docker-compose up -d
```

## Post-Deployment

### 1. Testing
- [ ] Homepage loads correctly
- [ ] All navigation works
- [ ] Forms submit successfully
- [ ] File uploads work
- [ ] API endpoints respond
- [ ] Admin panel accessible
- [ ] SSL certificate valid
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

### 2. Monitoring
```bash
# Set up log rotation
sudo nano /etc/logrotate.d/blackhornets
```

```
/var/www/fsblackhornets/storage/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    notifempty
    create 0640 www-data www-data
}
```

### 3. Backups
```bash
# Create backup script
sudo nano /usr/local/bin/backup-blackhornets.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backups/blackhornets"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
mysqldump -u blackhornets -p'password' fsblackhornets > "$BACKUP_DIR/db_$DATE.sql"

# Backup files
tar -czf "$BACKUP_DIR/files_$DATE.tar.gz" /var/www/fsblackhornets

# Delete old backups (keep 30 days)
find $BACKUP_DIR -type f -mtime +30 -delete
```

```bash
# Make executable and add to cron
sudo chmod +x /usr/local/bin/backup-blackhornets.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-blackhornets.sh
```

### 4. Performance Optimization
```bash
# Enable PHP OPcache
sudo nano /etc/php/8.2/apache2/php.ini
```

```ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
opcache.revalidate_freq=60
```

### 5. Monitoring & Alerts
Consider setting up:
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Analytics (Google Analytics)
- Server monitoring (New Relic, Datadog)

## Rollback Procedure

If deployment fails:
```bash
# Restore database
mysql -u blackhornets -p fsblackhornets < backup.sql

# Restore files
tar -xzf backup.tar.gz -C /var/www/

# Restart services
sudo systemctl restart apache2
sudo systemctl restart mysql
```

## Maintenance

### Regular Tasks
- **Daily**: Check error logs
- **Weekly**: Review security logs, update content
- **Monthly**: Update dependencies, review backups
- **Quarterly**: Security audit, performance review

### Update Procedure
```bash
# Pull latest changes
cd /var/www/fsblackhornets
sudo git pull origin main

# Run migrations (if any)
# php artisan migrate

# Clear cache (if implemented)
# php artisan cache:clear

# Restart services
sudo systemctl restart apache2
```

## Troubleshooting

### Common Issues

**500 Internal Server Error**
- Check file permissions
- Review Apache error logs
- Verify .htaccess syntax

**Database Connection Failed**
- Verify credentials in `src/config/database.php`
- Check MySQL service status
- Verify user privileges

**File Upload Fails**
- Check directory permissions (775 for uploads)
- Verify PHP upload_max_filesize
- Check disk space

**Slow Performance**
- Enable OPcache
- Optimize database queries
- Enable GZIP compression
- Use CDN for static assets

## Support

For deployment assistance:
- Email: formulastudentftn@gmail.com
- Documentation: See README.md
- Issues: GitHub Issues

---

**Last Updated**: November 13, 2024
