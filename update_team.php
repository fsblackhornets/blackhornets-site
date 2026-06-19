<?php
// Team update script based on Book1.xlsx data
// Run via: http://localhost/blackhornets/update_team.php

require_once __DIR__ . '/backend/config/database.php';
$conn->set_charset('utf8mb4');

// Helper to clean study field string
function cleanStudy($s) {
    $s = trim($s);
    // Remove faculty prefix (FTN, PMF, VTŠ + spaces)
    $s = preg_replace('/^(FTN|PMF|VTŠ)\s+/u', '', $s);
    return trim($s);
}

// Map role string from Excel to DB role + team + department
function mapRole($tim) {
    $tim = trim($tim);
    switch (true) {
        case $tim === 'Lider Tima':
            return ['role' => 'team_leader', 'team' => null, 'dept' => null, 'position' => 'Team Leader'];
        case $tim === 'Lider projekta - elektrotehnika':
            return ['role' => 'project_leader', 'team' => 'electrical', 'dept' => null, 'position' => 'Project Leader'];
        case $tim === 'Podlider šasija i aerodinamika':
            return ['role' => 'project_leader', 'team' => 'mechanical', 'dept' => 'chassis_aero', 'position' => 'Project Leader'];
        case $tim === 'Podlider slanjanje i upravljanje' || $tim === 'Podlider oslanjanje i upravljanje':
            return ['role' => 'sub_leader', 'team' => 'mechanical', 'dept' => 'suspension_steering', 'position' => 'Sub Leader'];
        case $tim === 'Podlider transmisija i kočenje':
            return ['role' => 'sub_leader', 'team' => 'mechanical', 'dept' => 'transmission_braking', 'position' => 'Sub Leader'];
        case $tim === 'Podlider Niski napon':
            return ['role' => 'sub_leader', 'team' => 'electrical', 'dept' => 'low_voltage', 'position' => 'Sub Leader'];
        case $tim === 'Podlider Visoki napon':
            return ['role' => 'sub_leader', 'team' => 'electrical', 'dept' => 'high_voltage', 'position' => 'Sub Leader'];
        case $tim === 'Podlider Marketing':
            return ['role' => 'sub_leader', 'team' => 'operating_business', 'dept' => 'marketing', 'position' => 'Sub Leader'];
        case $tim === 'Oslanjanje i upravljanje':
            return ['role' => 'team_member', 'team' => 'mechanical', 'dept' => 'suspension_steering', 'position' => 'Member'];
        case $tim === 'Šasija i aerodinamika':
            return ['role' => 'team_member', 'team' => 'mechanical', 'dept' => 'chassis_aero', 'position' => 'Member'];
        case $tim === 'Transmisija i kočenje':
            return ['role' => 'team_member', 'team' => 'mechanical', 'dept' => 'transmission_braking', 'position' => 'Member'];
        case $tim === 'Niski napon':
            return ['role' => 'team_member', 'team' => 'electrical', 'dept' => 'low_voltage', 'position' => 'Member'];
        case $tim === 'Visoki napon':
            return ['role' => 'team_member', 'team' => 'electrical', 'dept' => 'high_voltage', 'position' => 'Member'];
        case $tim === 'Marketing':
            return ['role' => 'team_member', 'team' => 'operating_business', 'dept' => 'marketing', 'position' => 'Member'];
        case $tim === 'Menadžment':
            return ['role' => 'team_member', 'team' => 'operating_business', 'dept' => 'management', 'position' => 'Member'];
        case $tim === 'Sponzorstva':
            return ['role' => 'team_member', 'team' => 'operating_business', 'dept' => 'sponsorships', 'position' => 'Member'];
        default:
            return ['role' => 'team_member', 'team' => null, 'dept' => null, 'position' => 'Member'];
    }
}

// All members from Excel (deduplicated - Samuel Benka appears twice in sheet4)
$excelMembers = [
    // Rukovodstvo
    ['ime' => 'Samuel',    'prez' => 'Benka',        'tel' => '062/782568',   'email' => 'b.samuelftn@gmail.com',            'tim' => 'Lider Tima',                           'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'Nikola',    'prez' => 'Blešić',       'tel' => '062/1995538',  'email' => 'blesicnikola01@gmail.com',         'tim' => 'Lider projekta - elektrotehnika',      'study' => 'FTN        Mehatronika'],
    // Mašinstvo
    ['ime' => 'Vuk',       'prez' => 'Cindrić',      'tel' => '061/5886712',  'email' => 'cindricvuk@gmail.com',             'tim' => 'Podlider slanjanje i upravljanje',     'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'David',     'prez' => 'Vojaković',    'tel' => '387/66522189', 'email' => 'vojakdavid123@gmail.com',          'tim' => 'Oslanjanje i upravljanje',             'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'Angelina',  'prez' => 'Vučković',     'tel' => '065/2293479',  'email' => 'angelina006sd@gmail.com',          'tim' => 'Oslanjanje i upravljanje',             'study' => 'FTN    Softversko inženjerstvo i informacione tehnologije'],
    ['ime' => 'Danilo',    'prez' => 'Ćirić',        'tel' => '062/247201',   'email' => 'danilo.g.ćirić39@gmail.com',       'tim' => 'Oslanjanje i upravljanje',             'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'Bojan',     'prez' => 'Jekić',        'tel' => '063/3376556',  'email' => 'jekicbojan.mm13@gmail.com',        'tim' => 'Oslanjanje i upravljanje',             'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'Luka',      'prez' => 'Čubrlo',       'tel' => '060/5200209',  'email' => 'cubrlo.luka03@gmail.com',          'tim' => 'Podlider šasija i aerodinamika',       'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'Jovan',     'prez' => 'Simić',        'tel' => '387/65185807', 'email' => 'simic.jovan751@gmail.com',         'tim' => 'Šasija i aerodinamika',                'study' => 'FTN       Proizvodno mašinstvo'],
    ['ime' => 'Silard',    'prez' => 'Tot',          'tel' => '066/8011741',  'email' => 'tothszilard000@gmail.com',         'tim' => 'Šasija i aerodinamika',                'study' => 'FTN         Mehatronika'],
    ['ime' => 'Bruno',     'prez' => 'Živković',     'tel' => '065/6341400',  'email' => 'brunozivkovic2006@gmail.com',      'tim' => 'Šasija i aerodinamika',                'study' => 'FTN        Energetika i procesna tehnika'],
    ['ime' => 'Barbara',   'prez' => 'Divljak',      'tel' => '065/4265663',  'email' => 'barbara.divljak@gmail.com',        'tim' => 'Šasija i aerodinamika',                'study' => 'FTN        Energetika i procesna tehnika'],
    ['ime' => 'Darko',     'prez' => 'Lazić',        'tel' => '061/4849364',  'email' => 'lazic.darko55@gmail.com',          'tim' => 'Podlider transmisija i kočenje',       'study' => ''],
    ['ime' => 'Rade',      'prez' => 'Stevanović',   'tel' => '387 66 631 452','email' => 'stevanovicrade326@gmail.com',     'tim' => 'Transmisija i kočenje',                'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'Jovana',    'prez' => 'Cvijanović',   'tel' => '069/2003034',  'email' => 'cvijanovic.mm5.2021@gmail.com',    'tim' => 'Transmisija i kočenje',                'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'Skandar',   'prez' => 'Mokni',        'tel' => '069/1568899',  'email' => 'Aleksandarrsd@gmail.com',          'tim' => 'Transmisija i kočenje',                'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'Dimitrije', 'prez' => 'Andulajević',  'tel' => '064/3230438',  'email' => 'dimandulajevic@gmail.com',         'tim' => 'Transmisija i kočenje',                'study' => 'FTN         Mehatronika'],
    ['ime' => 'Mitar',     'prez' => 'Lazarević',    'tel' => '065/2196489',  'email' => 'mitarlazarević8@gmail.com',        'tim' => 'Transmisija i kočenje',                'study' => 'FTN              Grafičko inžinjerstvo i dizajn'],
    // Elektrotehnika
    ['ime' => 'Ivan',      'prez' => 'Berenić',      'tel' => '064/5411568',  'email' => 'ivanberenic04@gmail.com',          'tim' => 'Podlider Niski napon',                 'study' => 'FTN         Računarstvo i automatika'],
    ['ime' => 'Jovan',     'prez' => 'Vukojević',    'tel' => '061/6803002',  'email' => 'jovanvukojevic88@gmail.com',       'tim' => 'Niski napon',                          'study' => 'FTN         Računarstvo i automatika'],
    ['ime' => 'Dimitrije', 'prez' => 'Roglić',       'tel' => '064/8503884',  'email' => 'dimitrijeroglic005@gmail.com',     'tim' => 'Niski napon',                          'study' => 'FTN    Energetika, elektronika i telekomunikacije'],
    ['ime' => 'Dušan',     'prez' => 'Novković',     'tel' => '065/5621914',  'email' => 'dusan.gg.ggg@gmail.com',           'tim' => 'Niski napon',                          'study' => 'FTN    Energetika, elektronika i telekomunikacije'],
    ['ime' => 'Milica',    'prez' => 'Božović',      'tel' => '062/1136405',  'email' => 'milicabozovic42@gmail.com',        'tim' => 'Niski napon',                          'study' => 'FTN    Energetika, elektronika i telekomunikacije'],
    ['ime' => 'Nikola',    'prez' => 'Popović',      'tel' => '064/3692138',  'email' => 'npopovic325@gmail.com',            'tim' => 'Niski napon',                          'study' => 'FTN    Energetika, elektronika i telekomunikacije'],
    ['ime' => 'Aleksa',    'prez' => 'Vulin',        'tel' => '060/4646535',  'email' => 'aleksavulin77@gmail.com',          'tim' => 'Niski napon',                          'study' => 'FTN    Energetika, elektronika i telekomunikacije'],
    ['ime' => 'Nemanja',   'prez' => 'Marčetić',     'tel' => '064/5656656',  'email' => 'marceticcontact@gmail.com',        'tim' => 'Niski napon',                          'study' => 'FTN         Računarstvo i automatika'],
    ['ime' => 'Vladimir',  'prez' => 'Andrić',       'tel' => '060/7114471',  'email' => 'andricvladimir44@gmail.com',       'tim' => 'Podlider Visoki napon',                'study' => 'FTN    Energetika, elektronika i telekomunikacije'],
    ['ime' => 'Marko',     'prez' => 'Stojić',       'tel' => '062/1970450',  'email' => 'markostojic19518@gmail.com',       'tim' => 'Visoki napon',                         'study' => 'FTN    Energetika, elektronika i telekomunikacije'],
    ['ime' => 'Viktor',    'prez' => 'Mertel',       'tel' => '060/7222715',  'email' => 'viktormertel@gmail.com',           'tim' => 'Visoki napon',                         'study' => 'FTN              Saobraćaj i transport'],
    ['ime' => 'Andrej',    'prez' => 'Lučić',        'tel' => '063/1691585',  'email' => 'andrejlucic16@gmail.com',          'tim' => 'Visoki napon',                         'study' => 'FTN    Energetika, elektronika i telekomunikacije'],
    ['ime' => 'Marko',     'prez' => 'Malešević',    'tel' => '064/2699700',  'email' => 'marko.males99@gmail.com',          'tim' => 'Visoki napon',                         'study' => 'FTN    Energetika, elektronika i telekomunikacije'],
    ['ime' => 'Aleksa',    'prez' => 'Mijatović',    'tel' => '062/8730900',  'email' => 'aki.mijatovic@gmail.com',          'tim' => 'Visoki napon',                         'study' => 'FTN    Energetika, elektronika i telekomunikacije'],
    // Biznis operativni tim
    ['ime' => 'Filip',     'prez' => 'Avram',        'tel' => '069/5255841',  'email' => 'filipavram997@gmail.com',          'tim' => 'Podlider Marketing',                   'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'Damjan',    'prez' => 'Nikolić',      'tel' => '061/6070682',  'email' => 'damjannikolic117@gmail.com',       'tim' => 'Marketing',                            'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'Dušan',     'prez' => 'Savić',        'tel' => '062/682098',   'email' => 'dusansavic484@gmail.com',          'tim' => 'Marketing',                            'study' => 'VTŠ                    Grafički inžinjering i dizajn'],
    ['ime' => 'Stefan',    'prez' => 'Višnić',       'tel' => '063/1731148',  'email' => 'visnicstefan1@gmail.com',          'tim' => 'Marketing',                            'study' => 'FTN              Inžinjerski menadžment'],
    ['ime' => 'Marija',    'prez' => 'Ćodo',         'tel' => '066/5226318',  'email' => 'marijacodo1207@gmail.com',         'tim' => 'Marketing',                            'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'Tamara',    'prez' => 'Grujić',       'tel' => '065/2814768',  'email' => 'tamara.grujic06@gmail.com',        'tim' => 'Marketing',                            'study' => 'FTN                Inžinjerstvo informacionih sistema'],
    ['ime' => 'Nikodin',   'prez' => 'Gregorin',     'tel' => '064/9718296',  'email' => 'nikodinwork@gmail.com',            'tim' => 'Marketing',                            'study' => 'FTN    Softversko inženjerstvo i informacione tehnologije'],
    ['ime' => 'Milica',    'prez' => 'Jeličić',      'tel' => '064/5221893',  'email' => 'milicajelicic06@gmail.com',        'tim' => 'Marketing',                            'study' => 'PMF      Primenjena matematika'],
    ['ime' => 'Marta',     'prez' => 'Ratković',     'tel' => '060/3240333',  'email' => 'martarat05@gmail.com',             'tim' => 'Marketing',                            'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
    ['ime' => 'Svetlana',  'prez' => 'Blaženović',   'tel' => '064/4582275',  'email' => 'svetlana.blazenovic@gmail.com',    'tim' => 'Marketing',                            'study' => 'PMF      Geoinformatika'],
    ['ime' => 'Dušan',     'prez' => 'Stefanović',   'tel' => '065/9446906',  'email' => 'stefanovic.dusan2001@gmail.com',   'tim' => 'Marketing',                            'study' => 'FTN       Primenjeno softversko inžinjerstvo'],
    ['ime' => 'Nikola',    'prez' => 'Crnković',     'tel' => '065/6265434',  'email' => 'crnkovicnikola05@gmail.com',       'tim' => 'Marketing',                            'study' => 'FTN          Mehatronika'],
    ['ime' => 'Ilija',     'prez' => 'Ilić',         'tel' => '060/7161755',  'email' => 'ilicilija006@gmail.com',           'tim' => 'Marketing',                            'study' => 'FTN    Softversko inženjerstvo i informacione tehnologije'],
    ['ime' => 'Marko',     'prez' => 'Derdić',       'tel' => '061/1620248',  'email' => 'mderdicc@gmail.com',               'tim' => 'Marketing',                            'study' => 'FTN          Računarstvo i automatika'],
    ['ime' => 'Sandra',    'prez' => 'Jaćimović',    'tel' => '061/4255025',  'email' => 'jacimovicsandra.school@gmail.com', 'tim' => 'Menadžment',                           'study' => 'FTN           Inžinjerski menadžment'],
    ['ime' => 'Andrea',    'prez' => 'Kolarski',     'tel' => '065/2509017',  'email' => 'andreakolarski05@gmail.com',       'tim' => 'Menadžment',                           'study' => 'FTN           Inžinjerski menadžment'],
    ['ime' => 'Tara',      'prez' => 'Terno',        'tel' => '069/1614828',  'email' => 'ternotara@gmail.com',              'tim' => 'Menadžment',                           'study' => 'FTN           Inžinjerski menadžment'],
    ['ime' => 'Jelisaveta','prez' => 'Dukić',        'tel' => '060/4774839',  'email' => 'jelisavetadukic@gmail.com',        'tim' => 'Sponzorstva',                          'study' => 'PMF      Primenjena matematika'],
    ['ime' => 'Tara',      'prez' => 'Šijan',        'tel' => '061/1684017',  'email' => 'tara.sijan4@gmail.com',            'tim' => 'Sponzorstva',                          'study' => 'FTN         Računarstvo i automatika'],
    ['ime' => 'Mina',      'prez' => 'Grković',      'tel' => '064/1170036',  'email' => 'selenaminag@gmail.com',            'tim' => 'Sponzorstva',                          'study' => 'FTN   Mehanizacija i konstrukciono mašinstvo'],
];

$updated = 0;
$inserted = 0;
$skipped = 0;

foreach ($excelMembers as $m) {
    $fullName = trim($m['ime'] . ' ' . $m['prez']);
    $email = trim(strtolower($m['email']));
    $study = cleanStudy($m['study']);
    $phone = trim($m['tel']);
    $mapped = mapRole($m['tim']);

    $role = $mapped['role'];
    $team = $mapped['team'];
    $dept = $mapped['dept'];
    $position = $mapped['position'];

    // Check if user exists by email
    $stmt = $conn->prepare("SELECT id FROM users WHERE LOWER(email) = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $res = $stmt->get_result();

    if ($res->num_rows > 0) {
        // Update existing user
        $row = $res->fetch_assoc();
        $id = $row['id'];
        $upd = $conn->prepare("UPDATE users SET full_name=?, role=?, team=?, department=?, study_field=?, position=?, status='active' WHERE id=?");
        $upd->bind_param("ssssssi", $fullName, $role, $team, $dept, $study, $position, $id);
        $upd->execute();
        echo "UPDATED: $fullName ($email) → $role / " . ($team ?? '-') . " / " . ($dept ?? '-') . "<br>\n";
        $updated++;
    } else {
        // Insert new user
        // Generate username from email
        $username = explode('@', $email)[0];
        // Default password hash for new members (they can reset)
        $pwHash = password_hash('BlackHornets2025!', PASSWORD_DEFAULT);
        $ins = $conn->prepare("INSERT INTO users (username, full_name, email, password, role, team, department, study_field, position, status, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 'default.jpg')");
        $ins->bind_param("ssssssssss", $username, $fullName, $email, $pwHash, $role, $team, $dept, $study, $position);
        if ($ins->execute()) {
            echo "INSERTED: $fullName ($email) → $role / " . ($team ?? '-') . " / " . ($dept ?? '-') . "<br>\n";
            $inserted++;
        } else {
            echo "ERROR inserting $fullName: " . $conn->error . "<br>\n";
            $skipped++;
        }
    }
}

echo "<br><strong>Done. Updated: $updated | Inserted: $inserted | Errors: $skipped</strong><br>\n";
$conn->close();
?>
