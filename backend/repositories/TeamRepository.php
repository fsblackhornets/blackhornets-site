<?php

class TeamRepository {
    public function __construct(private mysqli $conn) {}

    public function findAll(): array {
        $result = $this->conn->query("
            SELECT
                u.id, u.full_name, u.email, u.role, u.team, u.department,
                CASE
                    WHEN u.role IN ('sub_leader','project_leader','team_leader')
                        THEN REPLACE(REPLACE(u.role,'_',' '),'leader','Leader')
                    ELSE t.position
                END AS position,
                t.position_en, t.study_field, t.faculty, t.academic_year,
                t.motivation, t.skills, t.profile_picture,
                CASE u.department
                    WHEN 'chassis_aero'           THEN 'Chassis and Aerodynamics'
                    WHEN 'suspension_steering'     THEN 'Suspension and Steering'
                    WHEN 'transmission_braking'    THEN 'Transmission and Braking'
                    WHEN 'high_voltage'            THEN 'High Voltage'
                    WHEN 'low_voltage'             THEN 'Low Voltage'
                    WHEN 'marketing'               THEN 'Marketing'
                    WHEN 'sponsorships'            THEN 'Sponsorships'
                    WHEN 'management'              THEN 'Management'
                    ELSE u.department
                END AS department_name
            FROM users u
            LEFT JOIN team_members t ON u.id = t.user_id
            WHERE u.status = 'active'
              AND u.role NOT IN ('admin','manager')
            ORDER BY
                FIELD(u.role,'team_leader','project_leader','sub_leader','team_member'),
                u.team, u.department, u.full_name
        ");

        if (!$result) throw new RuntimeException($this->conn->error);

        $rows = [];
        while ($row = $result->fetch_assoc()) {
            $row['id'] = (int)$row['id'];
            $row['profile_picture'] = $row['profile_picture'] ?? 'default.jpg';
            $rows[] = $row;
        }
        return $rows;
    }
}
