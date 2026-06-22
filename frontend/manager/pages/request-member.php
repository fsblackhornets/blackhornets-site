<?php require_once __DIR__ . '/../auth_check.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Request: Add Member</title>
    
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="/frontend/manager/manager.css">
    <?php include __DIR__ . '/../_form-styles.php'; ?>
</head>
<body>
<div class="m-layout">
    <?php include __DIR__ . '/../_sidebar.php'; ?>
    <main class="m-main">
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
                        <select id="teamSelect" name="team" required>
                            <option value="">Select team</option>
                            <option value="mechanical">Mechanical Engineering</option>
                            <option value="electrical">Electrical Engineering</option>
                            <option value="operating_business">Business Team</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Department *</label>
                        <select id="deptSelect" name="department" required>
                            <option value="">Select department</option>
                            <optgroup label="Mechanical" data-team="mechanical">
                                <option value="chassis_aero" data-team="mechanical">Chassis &amp; Aero</option>
                                <option value="suspension_steering" data-team="mechanical">Suspension &amp; Steering</option>
                                <option value="transmission_braking" data-team="mechanical">Transmission &amp; Braking</option>
                            </optgroup>
                            <optgroup label="Electrical" data-team="electrical">
                                <option value="high_voltage" data-team="electrical">High Voltage</option>
                                <option value="low_voltage" data-team="electrical">Low Voltage</option>
                            </optgroup>
                            <optgroup label="Business" data-team="operating_business">
                                <option value="marketing" data-team="operating_business">Marketing</option>
                                <option value="sponsorships" data-team="operating_business">Sponsorships</option>
                                <option value="management" data-team="operating_business">Management</option>
                            </optgroup>
                        </select>
                    </div>
                    <div class="form-group"><label>Position</label><input type="text" name="position" placeholder="e.g. Engineer, Designer"></div>

                    <!-- Live Preview -->
                    <div class="preview-wrap">
                        <div class="preview-label">Live Preview</div>
                        <div class="member-card preview-card" id="previewCard">
                            <div class="card-inner">
                                <div class="card-front">
                                    <div class="member-image">
                                        <img id="previewImg" src="/frontend/assets/images/W logo.png" alt="Preview">
                                    </div>
                                    <div class="member-info">
                                        <h3 id="previewName">Full Name</h3>
                                        <p class="position" id="previewPosition">Position</p>
                                        <p class="department" id="previewDept">Department</p>
                                    </div>
                                </div>
                                <div class="card-back">
                                    <div class="info-item">
                                        <div class="info-label"><i class="fas fa-university"></i> Faculty</div>
                                        <div class="info-value" id="previewFaculty">—</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label"><i class="fas fa-graduation-cap"></i> Study Field</div>
                                        <div class="info-value" id="previewStudyField">—</div>
                                    </div>
                                    <div class="info-item">
                                        <div class="info-label"><i class="fas fa-sitemap"></i> Department</div>
                                        <div class="info-value" id="previewDeptBack">—</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
<style>
.preview-wrap { margin-top: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.6rem; }
.preview-label { font-size: 0.7rem; letter-spacing: 2px; text-transform: uppercase; color: #555; font-family: 'Michroma', sans-serif; }

/* Flip card */
.member-card { width: 240px; height: 320px; perspective: 1000px; cursor: pointer; border-radius: 14px; }
.card-inner { position: relative; width: 100%; height: 100%; text-align: center; transition: transform 0.7s; transform-style: preserve-3d; }
.member-card:hover .card-inner { transform: rotateY(180deg); }
.card-front, .card-back { position: absolute; width: 100%; height: 100%; backface-visibility: hidden; -webkit-backface-visibility: hidden; border-radius: 14px; overflow: hidden; background: #1a1a1a; border: 2px solid rgba(255,215,0,0.25); }
.card-front { display: flex; flex-direction: column; }
.card-back { transform: rotateY(180deg); padding: 1.2rem 1rem; display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 0.8rem; background: linear-gradient(145deg,#1a1a1a,#222); }
.member-image { width: 100%; height: 185px; overflow: hidden; }
.member-image img { width: 100%; height: 100%; object-fit: cover; }
.member-info { padding: 12px; flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px; }
.member-info h3 { color: #FFD700; font-size: 1rem; margin: 0; font-family: 'Rajdhani', sans-serif; font-weight: 700; }
.member-info .position { color: #ccc; font-size: 0.85rem; margin: 0; }
.member-info .department { color: #777; font-size: 0.8rem; margin: 0; }
.info-item { width: 100%; text-align: left; }
.info-label { color: #666; font-size: 0.72rem; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 2px; }
.info-value { color: #e0e0e0; font-size: 0.88rem; font-family: 'Rajdhani', sans-serif; }

/* Team colour borders */
.team--mechanical .card-front, .team--mechanical .card-back { border-color: rgba(76,175,80,0.4); }
.team--electrical .card-front, .team--electrical .card-back { border-color: rgba(33,150,243,0.4); }
.team--business   .card-front, .team--business   .card-back  { border-color: rgba(255,179,0,0.4); }
</style>
<script>
(function () {
    const teamSel = document.getElementById('teamSelect');
    const deptSel = document.getElementById('deptSelect');

    const deptToTeam = {
        chassis_aero: 'mechanical', suspension_steering: 'mechanical', transmission_braking: 'mechanical',
        high_voltage: 'electrical', low_voltage: 'electrical',
        marketing: 'operating_business', sponsorships: 'operating_business', management: 'operating_business',
    };

    function filterDepts(team) {
        const groups  = deptSel.querySelectorAll('optgroup');
        const options = deptSel.querySelectorAll('option[data-team]');

        if (!team) {
            groups.forEach(g => g.style.display = '');
            options.forEach(o => o.style.display = '');
            return;
        }

        groups.forEach(g => {
            g.style.display = g.dataset.team === team ? '' : 'none';
        });
        options.forEach(o => {
            o.style.display = o.dataset.team === team ? '' : 'none';
        });

        // Reset dept if current value doesn't belong to selected team
        if (deptSel.value && deptToTeam[deptSel.value] !== team) {
            deptSel.value = '';
        }
    }

    teamSel.addEventListener('change', () => filterDepts(teamSel.value));

    deptSel.addEventListener('change', () => {
        const team = deptToTeam[deptSel.value];
        if (team) {
            teamSel.value = team;
            filterDepts(team);
        }
        updatePreview();
    });

    // ── Live preview ──
    const card    = document.getElementById('previewCard');
    const pImg    = document.getElementById('previewImg');
    const pName   = document.getElementById('previewName');
    const pPos    = document.getElementById('previewPosition');
    const pDept   = document.getElementById('previewDept');
    const pDeptB  = document.getElementById('previewDeptBack');
    const pFac    = document.getElementById('previewFaculty');
    const pStudy  = document.getElementById('previewStudyField');

    const deptLabels = {
        chassis_aero: 'Chassis & Aero', suspension_steering: 'Suspension & Steering',
        transmission_braking: 'Transmission & Braking', high_voltage: 'High Voltage',
        low_voltage: 'Low Voltage', marketing: 'Marketing',
        sponsorships: 'Sponsorships', management: 'Management',
    };
    const teamClass = {
        mechanical: 'team--mechanical', electrical: 'team--electrical',
        operating_business: 'team--business',
    };

    function updatePreview() {
        const name     = document.querySelector('[name="full_name"]').value.trim()  || 'Full Name';
        const position = document.querySelector('[name="position"]').value.trim()   || 'Position';
        const faculty  = document.querySelector('[name="faculty"]').value.trim()    || '—';
        const study    = document.querySelector('[name="study_field"]').value.trim()|| '—';
        const dept     = deptSel.value;
        const team     = teamSel.value;
        const deptLbl  = deptLabels[dept] || '—';

        pName.textContent  = name;
        pPos.textContent   = position;
        pDept.textContent  = deptLbl;
        pDeptB.textContent = deptLbl;
        pFac.textContent   = faculty;
        pStudy.textContent = study;

        card.className = 'member-card preview-card ' + (teamClass[team] || '');
    }

    // Picture preview
    document.querySelector('[name="profile_picture"]').addEventListener('change', function () {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => { pImg.src = e.target.result; };
            reader.readAsDataURL(file);
        } else {
            pImg.src = '/frontend/assets/images/W logo.png';
        }
    });

    // Wire all text inputs
    ['full_name','position','faculty','study_field'].forEach(n => {
        document.querySelector(`[name="${n}"]`)?.addEventListener('input', updatePreview);
    });
    teamSel.addEventListener('change', updatePreview);

    updatePreview();
})();
</script>
</body>
</html>
