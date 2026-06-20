<?php require_once __DIR__ . '/../auth_check.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request: Add Member</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/frontend/assets/css/dashboard.css">
    <?php include __DIR__ . '/../_form-styles.php'; ?>
</head>
<body>
<div class="dashboard-container">
    <?php include __DIR__ . '/../_sidebar.php'; ?>
    <main class="main-content">
        <div class="page-header">
            <h1><i class="fas fa-user-plus"></i> Request: Add Team Member</h1>
            <a href="../dashboard.php" class="back-btn"><i class="fas fa-arrow-left"></i> Dashboard</a>
        </div>

        <div class="alert alert-info"><i class="fas fa-info-circle"></i> This request will be sent to an admin for approval before the member is added.</div>

        <form id="requestForm" enctype="multipart/form-data">
            <input type="hidden" name="type" value="member">
            <div class="form-grid">
                <div class="form-section">
                    <h3><i class="fas fa-id-card"></i> Personal Info</h3>
                    <div class="form-group"><label>Full Name *</label><input type="text" name="full_name" required></div>
                    <div class="form-group"><label>Email *</label><input type="email" name="email" required></div>
                    <div class="form-group"><label>Phone</label><input type="text" name="phone"></div>
                    <div class="form-group"><label>Faculty</label><input type="text" name="faculty"></div>
                    <div class="form-group"><label>Study Field</label><input type="text" name="study_field"></div>
                    <div class="form-group"><label>Academic Year</label><input type="text" name="academic_year"></div>
                    <div class="form-group"><label>Profile Picture</label><input type="file" name="profile_picture" accept="image/*"></div>
                </div>
                <div class="form-section">
                    <h3><i class="fas fa-users-cog"></i> Role & Team</h3>
                    <div class="form-group">
                        <label>Role *</label>
                        <select name="role" required>
                            <option value="team_member">Team Member</option>
                            <option value="sub_leader">Sub Leader</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Team *</label>
                        <select name="team" required>
                            <option value="">Select team</option>
                            <option value="mechanical">Mechanical Engineering</option>
                            <option value="electrical">Electrical Engineering</option>
                            <option value="operating_business">Business Team</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Department *</label>
                        <select name="department" required>
                            <option value="">Select department</option>
                            <optgroup label="Mechanical"><option value="chassis_aero">Chassis & Aero</option><option value="suspension_steering">Suspension & Steering</option><option value="transmission_braking">Transmission & Braking</option></optgroup>
                            <optgroup label="Electrical"><option value="high_voltage">High Voltage</option><option value="low_voltage">Low Voltage</option></optgroup>
                            <optgroup label="Business"><option value="marketing">Marketing</option><option value="sponsorships">Sponsorships</option><option value="management">Management</option></optgroup>
                        </select>
                    </div>
                    <div class="form-group"><label>Position</label><input type="text" name="position" placeholder="e.g. Engineer, Designer"></div>
                </div>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-submit"><i class="fas fa-paper-plane"></i> Submit Request</button>
                <a href="../dashboard.php" class="btn-cancel">Cancel</a>
            </div>
        </form>
    </main>
</div>
<?php include __DIR__ . '/../_form-script.php'; ?>
</body>
</html>
