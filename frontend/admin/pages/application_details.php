<?php
// Start session for admin authentication
require_once '../auth.php';
$user = checkAuth('admin');

// Database connection settings
require_once __DIR__ . '/../../../backend/config/database.php';

try {
    // Create database connection
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Get application ID from URL
    if (!isset($_GET['id'])) {
        throw new Exception("Application ID not provided");
    }

    $id = (int)$_GET['id'];

    // Get application details
    $stmt = $conn->prepare("
        SELECT 
            a.*,
            DATE_FORMAT(a.created_at, '%d %M %Y %h:%i %p') as formatted_date
        FROM applications a 
        WHERE a.id = ?
    ");
    
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    $application = $result->fetch_assoc();

    if (!$application) {
        throw new Exception("Application not found");
    }

} catch (Exception $e) {
    $error = $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/frontend/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Details - Black Hornets Admin</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../assets/css/application_details.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js"></script>
</head>
<body>
    <?php include __DIR__ . '/../components/admin_navbar.php'; ?>
    <div class="container">
        <div class="header">
            <h1>Application Details</h1>
            <div style="display: flex; gap: 0.75rem; align-items: center;">
                <button onclick="downloadApplicationPDF()" class="back-btn" style="border: none; cursor: pointer; font-family: inherit; font-size: inherit;">
                    <i class="fas fa-file-pdf"></i>
                    Download PDF
                </button>
                <a href="applications_list.php" class="back-btn">
                    <i class="fas fa-arrow-left"></i>
                    Back to List
                </a>
            </div>
        </div>

        <?php if (isset($error)): ?>
            <div class="error-message">
                <?php echo $error; ?>
            </div>
        <?php else: ?>
            <div class="application-details">
                <div class="detail-section">
                    <h2>Personal Information</h2>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Full Name</label>
                            <span><?php echo htmlspecialchars($application['first_name'] . ' ' . $application['last_name']); ?></span>
                        </div>
                        <div class="detail-item">
                            <label>Email</label>
                            <span><?php echo htmlspecialchars($application['email']); ?></span>
                        </div>
                        <div class="detail-item">
                            <label>Phone</label>
                            <span><?php echo htmlspecialchars($application['phone']); ?></span>
                        </div>
                        <div class="detail-item">
                            <label>Application Date</label>
                            <span><?php echo $application['formatted_date']; ?></span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h2>Academic Information</h2>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Student ID</label>
                            <span><?php echo htmlspecialchars($application['student_id']); ?></span>
                        </div>
                        <div class="detail-item">
                            <label>Faculty</label>
                            <span><?php echo htmlspecialchars($application['faculty'] ?? ''); ?></span>
                        </div>
                        <div class="detail-item">
                            <label>Major</label>
                            <span><?php echo htmlspecialchars($application['major']); ?></span>
                        </div>
                        <div class="detail-item">
                            <label>Academic Year</label>
                            <span><?php echo htmlspecialchars($application['academic_year']); ?></span>
                        </div>
                        <div class="detail-item">
                            <label>GPA</label>
                            <span><?php echo htmlspecialchars($application['gpa']); ?></span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h2>Position Details</h2>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>Desired Position</label>
                            <span><?php 
                                if (isset($application['desired_position'])) {
                                    $position = $application['desired_position'];
                                    $positionText = match ($position) {
                                        'mechanical' => 'Mechanical Team',
                                        'electrical' => 'Electrical Team',
                                        'software' => 'Software Team',
                                        'marketing' => 'Marketing Team',
                                        default => htmlspecialchars($position)
                                    };
                                    echo $positionText;
                                } else {
                                    echo 'N/A';
                                }
                            ?></span>
                        </div>
                        <div class="detail-item">
                            <label>Status</label>
                            <span class="status-badge status-<?php echo $application['status']; ?>">
                                <?php echo ucfirst($application['status']); ?>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="detail-section">
                    <h2>Additional Information</h2>
                    <div class="detail-item">
                        <label>Experience</label>
                        <p><?php echo nl2br(htmlspecialchars($application['experience'])); ?></p>
                    </div>
                    <div class="detail-item">
                        <label>Motivation</label>
                        <p><?php echo nl2br(htmlspecialchars($application['motivation'])); ?></p>
                    </div>
                </div>

                <?php if (isset($application['resume_path'])): ?>
                    <div class="document-section">
                        <h2>Resume</h2>
                        <?php
                            // Get resume filename
                            $resume_filename = basename($application['resume_path']);
                            $resume_full_path = __DIR__ . '/../../uploads/resumes/' . $resume_filename;
                            $resume_url = '../../view-resume.php?file=' . urlencode($resume_filename);
                            
                            if (!empty($application['resume_path']) && file_exists($resume_full_path)):
                        ?>
                            <a href="<?php echo htmlspecialchars($resume_url); ?>" class="resume-link" target="_blank">
                                <i class="fas fa-file-pdf"></i>
                                View Resume
                            </a>
                        <?php else: ?>
                            <p>Resume file not found (<?php echo htmlspecialchars($resume_filename); ?>)</p>
                        <?php endif; ?>
                    </div>
                <?php else: ?>
                    <div class="document-section">
                        <h2>Resume</h2>
                        <p>No resume uploaded</p>
                    </div>
                <?php endif; ?>

                <?php if ($application['status'] === 'pending'): ?>
                <div class="actions">
                    <button class="action-btn accept-btn" onclick="sendApplicationEmail(<?php echo $id; ?>, '<?php echo htmlspecialchars($application['email']); ?>', '<?php echo htmlspecialchars($application['first_name']); ?>', 'accept', '<?php echo htmlspecialchars($positionText); ?>')">
                        <i class="fas fa-check"></i>
                        Accept Application
                    </button>
                    <button class="action-btn reject-btn" onclick="sendApplicationEmail(<?php echo $id; ?>, '<?php echo htmlspecialchars($application['email']); ?>', '<?php echo htmlspecialchars($application['first_name']); ?>', 'reject', '<?php echo htmlspecialchars($positionText); ?>')">
                        <i class="fas fa-times"></i>
                        Reject Application
                    </button>
                </div>
                <?php endif; ?>
            </div>
        <?php endif; ?>
    </div>

    <script>
    // Applicant data for PDF generation
    const applicantData = <?php echo json_encode([
        'firstName' => $application['first_name'] ?? '',
        'lastName' => $application['last_name'] ?? '',
        'email' => $application['email'] ?? '',
        'phone' => $application['phone'] ?? '',
        'applicationDate' => $application['formatted_date'] ?? '',
        'studentId' => $application['student_id'] ?? '',
        'faculty' => $application['faculty'] ?? '',
        'major' => $application['major'] ?? '',
        'academicYear' => $application['academic_year'] ?? '',
        'gpa' => $application['gpa'] ?? '',
        'desiredPosition' => $positionText ?? ($application['desired_position'] ?? 'N/A'),
        'status' => ucfirst($application['status'] ?? ''),
        'experience' => $application['experience'] ?? '',
        'motivation' => $application['motivation'] ?? '',
        'resumeUrl' => (isset($resume_url) && !empty($application['resume_path']) && isset($resume_full_path) && file_exists($resume_full_path)) ? $resume_url : null
    ]); ?>;

    async function downloadApplicationPDF() {
        const { jsPDF } = window.jspdf;
        const pageWidth = 210;
        const margin = 20;
        const contentWidth = pageWidth - margin * 2;
        let y = 20;

        const statusColor = applicantData.status === 'Accepted' ? [76, 175, 80] :
                            applicantData.status === 'Rejected' ? [244, 67, 54] : [255, 165, 0];

        const doc = new jsPDF('p', 'mm', 'a4');

        // Helper: add text with word wrap, returns new Y
        function addWrappedText(text, x, startY, maxWidth, lineHeight) {
            const lines = doc.splitTextToSize(text, maxWidth);
            lines.forEach(line => {
                if (startY > 270) {
                    doc.addPage();
                    doc.setFillColor(26, 26, 26);
                    doc.rect(0, 0, 210, 297, 'F');
                    startY = 20;
                }
                doc.text(line, x, startY);
                startY += lineHeight;
            });
            return startY;
        }

        function addSection(title, startY) {
            if (startY > 260) {
                doc.addPage();
                doc.setFillColor(26, 26, 26);
                doc.rect(0, 0, 210, 297, 'F');
                startY = 20;
            }
            doc.setFillColor(255, 215, 0);
            doc.rect(margin, startY, 3, 8, 'F');
            doc.setTextColor(255, 215, 0);
            doc.setFontSize(14);
            doc.setFont('helvetica', 'bold');
            doc.text(title, margin + 6, startY + 6);
            doc.setDrawColor(255, 215, 0);
            doc.setLineWidth(0.3);
            doc.line(margin, startY + 10, pageWidth - margin, startY + 10);
            return startY + 16;
        }

        function addFieldRow(label1, value1, label2, value2, startY) {
            if (startY > 270) {
                doc.addPage();
                doc.setFillColor(26, 26, 26);
                doc.rect(0, 0, 210, 297, 'F');
                startY = 20;
            }
            doc.setTextColor(150, 150, 150);
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.text(label1, margin + 2, startY);
            doc.text(label2, margin + contentWidth / 2 + 2, startY);
            doc.setTextColor(240, 240, 240);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            doc.text(String(value1 || 'N/A'), margin + 2, startY + 5.5);
            doc.text(String(value2 || 'N/A'), margin + contentWidth / 2 + 2, startY + 5.5);
            return startY + 14;
        }

        // Page 1 background
        doc.setFillColor(26, 26, 26);
        doc.rect(0, 0, 210, 297, 'F');

        // Header bar
        doc.setFillColor(35, 35, 35);
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setFillColor(255, 215, 0);
        doc.rect(0, 40, pageWidth, 1.5, 'F');

        doc.setTextColor(255, 215, 0);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Black Hornets Racing', pageWidth / 2, 18, { align: 'center' });
        doc.setFontSize(13);
        doc.setTextColor(220, 220, 220);
        doc.setFont('helvetica', 'normal');
        doc.text('Application Details', pageWidth / 2, 28, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(...statusColor);
        doc.text('Status: ' + applicantData.status, pageWidth / 2, 36, { align: 'center' });

        y = 50;

        // Personal Information
        y = addSection('Personal Information', y);
        y = addFieldRow('Full Name', applicantData.firstName + ' ' + applicantData.lastName, 'Email', applicantData.email, y);
        y = addFieldRow('Phone', applicantData.phone, 'Application Date', applicantData.applicationDate, y);

        y += 4;

        // Academic Information
        y = addSection('Academic Information', y);
        y = addFieldRow('Student ID', applicantData.studentId, 'Faculty', applicantData.faculty, y);
        y = addFieldRow('Major', applicantData.major, 'Academic Year', applicantData.academicYear, y);
        y = addFieldRow('GPA', applicantData.gpa, '', '', y);

        y += 4;

        // Position Details
        y = addSection('Position Details', y);
        y = addFieldRow('Desired Position', applicantData.desiredPosition, 'Status', applicantData.status, y);

        y += 4;

        // Experience
        if (applicantData.experience) {
            y = addSection('Experience', y);
            doc.setTextColor(220, 220, 220);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            y = addWrappedText(applicantData.experience, margin + 2, y, contentWidth - 4, 5.5);
            y += 6;
        }

        // Motivation
        if (applicantData.motivation) {
            y = addSection('Motivation', y);
            doc.setTextColor(220, 220, 220);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            y = addWrappedText(applicantData.motivation, margin + 2, y, contentWidth - 4, 5.5);
            y += 6;
        }

        // Footer
        doc.setTextColor(100, 100, 100);
        doc.setFontSize(8);
        doc.text('Generated on ' + new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), pageWidth / 2, 288, { align: 'center' });

        // If resume exists, merge with it
        if (applicantData.resumeUrl) {
            try {
                // Get the info PDF as bytes
                const infoPdfBytes = doc.output('arraybuffer');

                // Fetch the resume PDF
                const resumeResponse = await fetch(applicantData.resumeUrl);
                if (!resumeResponse.ok) throw new Error('Could not fetch resume');
                const resumePdfBytes = await resumeResponse.arrayBuffer();

                // Merge using pdf-lib
                const { PDFDocument } = PDFLib;
                const mergedPdf = await PDFDocument.create();

                // Add info pages
                const infoPdf = await PDFDocument.load(infoPdfBytes);
                const infoPages = await mergedPdf.copyPages(infoPdf, infoPdf.getPageIndices());
                infoPages.forEach(page => mergedPdf.addPage(page));

                // Add resume pages
                try {
                    const resumePdf = await PDFDocument.load(resumePdfBytes);
                    const resumePages = await mergedPdf.copyPages(resumePdf, resumePdf.getPageIndices());
                    resumePages.forEach(page => mergedPdf.addPage(page));
                } catch (e) {
                    console.warn('Could not merge resume PDF:', e);
                }

                // Save merged PDF
                const mergedBytes = await mergedPdf.save();
                const blob = new Blob([mergedBytes], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${applicantData.firstName}_${applicantData.lastName}_Application.pdf`;
                a.click();
                URL.revokeObjectURL(url);
            } catch (err) {
                console.error('Error merging with resume:', err);
                // Fallback: download just the info PDF
                doc.save(`${applicantData.firstName}_${applicantData.lastName}_Application.pdf`);
            }
        } else {
            // No resume - just download the info PDF
            doc.save(`${applicantData.firstName}_${applicantData.lastName}_Application.pdf`);
        }
    }

    function sendApplicationEmail(id, email, name, action, position) {
        let subject, body;
        
        if (action === 'accept') {
            subject = encodeURIComponent("Black Hornets Racing Team - Application Accepted!");
            body = encodeURIComponent(`Dear ${name},

We are pleased to inform you that your application to join the Black Hornets Racing Team for the ${position} position has been accepted!

We were impressed with your qualifications and enthusiasm, and we believe you will be a valuable addition to our team.

Next Steps:
1. Please confirm your acceptance by replying to this email
2. Attend our orientation meeting (details will be sent separately)
3. Complete the team registration form

Welcome to the team!

Best regards,
Black Hornets Racing Team`);
        } else {
            subject = encodeURIComponent("Black Hornets Racing Team - Application Status");
            body = encodeURIComponent(`Dear ${name},

Thank you for your interest in joining the Black Hornets Racing Team and for taking the time to apply for the ${position} position.

After careful consideration of your application, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We appreciate your interest in our team and wish you the best in your future endeavors.

Best regards,
Black Hornets Racing Team`);
        }

        // Open Gmail with pre-filled email
        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;

        // Update application status after email is opened
        setTimeout(() => {
            if (confirm(`Do you want to update the application status to ${action}ed?`)) {
                processApplication(id, action);
            }
        }, 1000);
    }

    function processApplication(id, action) {
        fetch('process_application.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: id,
                action: action
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(`Application ${action}ed successfully!`);
                location.reload();
            } else {
                alert('Error processing application: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error processing application');
        });
    }
    </script>
</body>
</html>

<?php
if (isset($stmt)) {
    $stmt->close();
}
if (isset($conn)) {
    $conn->close();
}
?>
