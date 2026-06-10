<?php
/**
 * Secure File Upload Handler
 * Prevents shell uploads, malware, and other malicious files
 */

class SecureFileUpload {
    
    private $allowed_mime_types = [];
    private $allowed_extensions = [];
    private $max_file_size = 0;
    private $upload_directory = '';
    private $errors = [];
    
    /**
     * Initialize secure file upload handler
     */
    public function __construct($upload_directory, $allowed_types = ['image'], $max_size = 5242880) {
        $this->upload_directory = rtrim($upload_directory, '/') . '/';
        $this->max_file_size = $max_size;
        $this->setAllowedTypes($allowed_types);
        
        // Create upload directory if it doesn't exist
        if (!file_exists($this->upload_directory)) {
            mkdir($this->upload_directory, 0755, true);
        }
    }
    
    /**
     * Set allowed file types
     */
    private function setAllowedTypes($types) {
        $type_definitions = [
            'image' => [
                'extensions' => ['jpg', 'jpeg', 'png', 'gif'],
                'mime_types' => ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
            ],
            'pdf' => [
                'extensions' => ['pdf'],
                'mime_types' => ['application/pdf']
            ],
            'document' => [
                'extensions' => ['doc', 'docx', 'pdf'],
                'mime_types' => ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf']
            ]
        ];
        
        foreach ($types as $type) {
            if (isset($type_definitions[$type])) {
                $this->allowed_extensions = array_merge($this->allowed_extensions, $type_definitions[$type]['extensions']);
                $this->allowed_mime_types = array_merge($this->allowed_mime_types, $type_definitions[$type]['mime_types']);
            }
        }
    }
    
    /**
     * Validate and upload file
     */
    public function upload($file, $custom_name = null) {
        $this->errors = [];
        
        // Check if file was uploaded
        if (!isset($file) || $file['error'] === UPLOAD_ERR_NO_FILE) {
            $this->errors[] = "No file uploaded";
            return false;
        }
        
        // Check for upload errors
        if ($file['error'] !== UPLOAD_ERR_OK) {
            $this->errors[] = $this->getUploadErrorMessage($file['error']);
            return false;
        }
        
        // Validate file size
        if ($file['size'] > $this->max_file_size) {
            $this->errors[] = "File size exceeds maximum allowed size of " . $this->formatBytes($this->max_file_size);
            return false;
        }
        
        // Validate file size (check for empty files)
        if ($file['size'] === 0) {
            $this->errors[] = "File is empty";
            return false;
        }
        
        // Get file extension
        $file_extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        
        // Validate extension
        if (!in_array($file_extension, $this->allowed_extensions)) {
            $this->errors[] = "File type not allowed. Allowed types: " . implode(', ', $this->allowed_extensions);
            return false;
        }
        
        // Validate MIME type (browser provided)
        if (!in_array($file['type'], $this->allowed_mime_types)) {
            $this->errors[] = "Invalid file MIME type: " . $file['type'];
            return false;
        }
        
        // Deep MIME type validation (server-side detection)
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $detected_mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);
        
        if (!in_array($detected_mime, $this->allowed_mime_types)) {
            $this->errors[] = "File content does not match expected type. Detected: " . $detected_mime;
            return false;
        }
        
        // Additional security checks for images
        if (in_array($file_extension, ['jpg', 'jpeg', 'png', 'gif'])) {
            if (!$this->validateImageFile($file['tmp_name'], $file_extension)) {
                return false;
            }
            // Skip PHP code check for validated images (binary data can trigger false positives)
        } elseif ($file_extension === 'pdf') {
            // Additional security checks for PDFs
            if (!$this->validatePdfFile($file['tmp_name'])) {
                return false;
            }
            // Skip PHP code check for PDFs (binary data can trigger false positives)
        } else {
            // Check for PHP code in other file types only
            if ($this->containsPhpCode($file['tmp_name'])) {
                $this->errors[] = "File contains suspicious code and cannot be uploaded";
                return false;
            }
        }
        
        // Generate secure filename
        $new_filename = $this->generateSecureFilename($file_extension, $custom_name);
        $upload_path = $this->upload_directory . $new_filename;
        
        // Move uploaded file
        if (move_uploaded_file($file['tmp_name'], $upload_path)) {
            // Set secure file permissions
            chmod($upload_path, 0644);
            return $new_filename;
        } else {
            $this->errors[] = "Failed to move uploaded file";
            return false;
        }
    }
    
    /**
     * Validate image file integrity
     */
    private function validateImageFile($file_path, $extension) {
        // Try to get image info
        $image_info = @getimagesize($file_path);
        
        if ($image_info === false) {
            $this->errors[] = "File is not a valid image";
            return false;
        }
        
        // Verify image type matches extension
        $valid_types = [
            'jpg' => [IMAGETYPE_JPEG],
            'jpeg' => [IMAGETYPE_JPEG],
            'png' => [IMAGETYPE_PNG],
            'gif' => [IMAGETYPE_GIF]
        ];
        
        if (!isset($valid_types[$extension]) || !in_array($image_info[2], $valid_types[$extension])) {
            $this->errors[] = "Image type does not match file extension";
            return false;
        }
        
        // Check if GD extension is loaded before trying to use it
        if (extension_loaded('gd')) {
            // Additional check: try to load the image
            $image = null;
            switch ($image_info[2]) {
                case IMAGETYPE_JPEG:
                    $image = @imagecreatefromjpeg($file_path);
                    break;
                case IMAGETYPE_PNG:
                    $image = @imagecreatefrompng($file_path);
                    break;
                case IMAGETYPE_GIF:
                    $image = @imagecreatefromgif($file_path);
                    break;
            }
            
            if ($image === false) {
                $this->errors[] = "Corrupted or invalid image file";
                return false;
            }
            
            imagedestroy($image);
        }
        // If GD is not loaded, getimagesize is sufficient for basic validation
        
        return true;
    }
    
    /**
     * Validate PDF file
     */
    private function validatePdfFile($file_path) {
        // Read first few bytes to check PDF signature
        $handle = fopen($file_path, 'rb');
        $header = fread($handle, 5);
        fclose($handle);
        
        // PDF files should start with %PDF-
        if (strpos($header, '%PDF-') !== 0) {
            $this->errors[] = "File is not a valid PDF";
            return false;
        }
        
        return true;
    }
    
    /**
     * Check if file contains PHP code
     */
    private function containsPhpCode($file_path) {
        $content = file_get_contents($file_path);
        
        // Check for PHP tags
        $php_patterns = [
            '/<\?php/i',
            '/<\?=/i',
            '/<\?/i',
            '/<script\s+language\s*=\s*["\']?php["\']?/i',
            '/eval\s*\(/i',
            '/base64_decode\s*\(/i',
            '/gzinflate\s*\(/i',
            '/system\s*\(/i',
            '/exec\s*\(/i',
            '/shell_exec\s*\(/i',
            '/passthru\s*\(/i',
            '/proc_open\s*\(/i',
            '/popen\s*\(/i',
            '/assert\s*\(/i',
            '/preg_replace\s*\(.*\/e["\']?\s*\)/i'
        ];
        
        foreach ($php_patterns as $pattern) {
            if (preg_match($pattern, $content)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Generate secure random filename
     */
    private function generateSecureFilename($extension, $custom_name = null) {
        if ($custom_name) {
            // Sanitize custom name
            $custom_name = preg_replace('/[^a-zA-Z0-9_-]/', '', $custom_name);
            return $custom_name . '_' . uniqid() . '.' . $extension;
        }
        
        return uniqid() . '_' . bin2hex(random_bytes(8)) . '.' . $extension;
    }
    
    /**
     * Get upload error message
     */
    private function getUploadErrorMessage($error_code) {
        $messages = [
            UPLOAD_ERR_INI_SIZE => 'File exceeds upload_max_filesize directive in php.ini',
            UPLOAD_ERR_FORM_SIZE => 'File exceeds MAX_FILE_SIZE directive in HTML form',
            UPLOAD_ERR_PARTIAL => 'File was only partially uploaded',
            UPLOAD_ERR_NO_FILE => 'No file was uploaded',
            UPLOAD_ERR_NO_TMP_DIR => 'Missing temporary folder',
            UPLOAD_ERR_CANT_WRITE => 'Failed to write file to disk',
            UPLOAD_ERR_EXTENSION => 'A PHP extension stopped the file upload'
        ];
        
        return isset($messages[$error_code]) ? $messages[$error_code] : 'Unknown upload error';
    }
    
    /**
     * Format bytes to human readable
     */
    private function formatBytes($bytes) {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, 2) . ' ' . $units[$pow];
    }
    
    /**
     * Get errors
     */
    public function getErrors() {
        return $this->errors;
    }
    
    /**
     * Get last error
     */
    public function getLastError() {
        return !empty($this->errors) ? end($this->errors) : null;
    }
    
    /**
     * Delete file
     */
    public function deleteFile($filename) {
        $file_path = $this->upload_directory . $filename;
        if (file_exists($file_path)) {
            return unlink($file_path);
        }
        return false;
    }
}
