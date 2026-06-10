<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

// Prevent any HTML output
ob_start();

// Include database connection
try {
    require_once '../../../src/config/database.php';

    // Auto-migrate: ensure required columns exist in team_members
    foreach ([
        'age'           => "ALTER TABLE team_members ADD COLUMN age INT DEFAULT 0",
        'academic_year' => "ALTER TABLE team_members ADD COLUMN academic_year VARCHAR(20) DEFAULT NULL",
        'motivation'    => "ALTER TABLE team_members ADD COLUMN motivation TEXT DEFAULT NULL",
        'skills'        => "ALTER TABLE team_members ADD COLUMN skills TEXT DEFAULT NULL",
    ] as $col => $sql) {
        $r = $conn->query("SHOW COLUMNS FROM team_members LIKE '$col'");
        if ($r && $r->num_rows === 0) $conn->query($sql);
    }
} catch (Exception $e) {
    // Clear any output buffer
    ob_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database configuration error'
    ]);
    exit;
}

try {
    // Get team members organized by team and department
    $query = "
        SELECT
            u.id,
            u.full_name,
            u.email,
            u.role,
            u.team,
            u.department,
            CASE 
                WHEN u.role = 'sub_leader' THEN 'Sub Leader'
                WHEN u.role = 'project_leader' THEN 'Project Leader'
                WHEN u.role = 'team_leader' THEN 'Team Leader'
                ELSE t.position
            END as position,
            t.position_en,
            t.study_field,
            t.faculty,
            t.academic_year,
            t.age,
            t.motivation,
            t.skills,
            t.profile_picture,
            CASE 
                WHEN u.team = 'operating_business' THEN 'Business Operating Team'
                WHEN u.team = 'mechanical' THEN 'Mechanical Engineering'
                WHEN u.team = 'electrical' THEN 'Electrical Engineering'
                ELSE u.team
            END as team_name,
            CASE
                WHEN u.department = 'chassis_aero' THEN 'Chassis and Aerodynamics'
                WHEN u.department = 'suspension_steering' THEN 'Suspension and Steering'
                WHEN u.department = 'transmission_braking' THEN 'Transmission and Braking'
                WHEN u.department = 'high_voltage' THEN 'High Voltage'
                WHEN u.department = 'low_voltage' THEN 'Low Voltage'
                WHEN u.department = 'marketing' THEN 'Marketing'
                WHEN u.department = 'sponsorships' THEN 'Sponsorships'
                WHEN u.department = 'management' THEN 'Management'
                ELSE u.department
            END as department_name
        FROM users u
        LEFT JOIN team_members t ON u.id = t.user_id
        WHERE u.status = 'active'
        ORDER BY 
            CASE 
                WHEN u.role = 'project_leader' THEN 0
                WHEN u.role = 'team_leader' THEN 1
                WHEN u.role = 'sub_leader' THEN 2
                ELSE 3
            END,
            u.team,
            u.department,
            u.full_name
    ";

    $result = $conn->query($query);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }

    // Organize data into array
    $members = [];
    while ($row = $result->fetch_assoc()) {
        $members[] = [
            'id' => (int)$row['id'],
            'full_name' => $row['full_name'],
            'email' => $row['email'],
            'role' => $row['role'],
            'position' => $row['position'],
            'team' => $row['team'],
            'team_name' => $row['team_name'],
            'department' => $row['department'],
            'department_name' => $row['department_name'],
            'study_field' => $row['study_field'],
            'faculty' => $row['faculty'],
            'academic_year' => $row['academic_year'],
            'age' => (int)$row['age'],
            'motivation' => $row['motivation'],
            'skills' => $row['skills'],
            'profile_picture' => $row['profile_picture'] ?? 'default.jpg',
            'position_en' => $row['position_en'] ?? null
        ];
    }

    // Organize members by team and department
    $organized_data = [
        'mechanical' => [],
        'electrical' => [],
        'operating_business' => []
    ];

    foreach ($members as $member) {
        if (isset($member['team']) && array_key_exists($member['team'], $organized_data)) {
            $organized_data[$member['team']][] = $member;
        }
    }

    // Get team and project leaders
    $mechanical_project_leader = null;
    $electrical_project_leader = null;
    $business_project_leader = null;
    $team_leader = null;

    foreach ($members as $member) {
        if ($member['role'] === 'project_leader') {
            if ($member['team'] === 'mechanical') {
                $mechanical_project_leader = $member;
            } elseif ($member['team'] === 'electrical') {
                $electrical_project_leader = $member;
            } elseif ($member['team'] === 'operating_business') {
                $business_project_leader = $member;
            }
        }
        if ($member['role'] === 'team_leader') {
            $team_leader = $member;
        }
    }

    // Clear any unwanted output and send JSON
    ob_clean();
    echo json_encode([
        'success' => true,
        'members' => $members,
        'organized_data' => $organized_data,
        'mechanical_project_leader' => $mechanical_project_leader,
        'electrical_project_leader' => $electrical_project_leader,
        'business_project_leader' => $business_project_leader,
        'team_leader' => $team_leader
    ]);

} catch (Exception $e) {
    // Clear any output buffer
    ob_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred'
    ]);
}

// End output buffering
ob_end_flush();
?>
