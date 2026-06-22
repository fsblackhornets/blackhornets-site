<?php

class RequestService {
    public function __construct(
        private RequestRepository $repo,
        private mysqli $conn
    ) {}

    public function create(string $type, array $data, int $userId, string $submitterName): int {
        return $this->repo->create($type, json_encode($data), $userId, $submitterName);
    }

    public function getAll(?string $status, ?string $type, ?int $userId): array {
        return $this->repo->findAll($status, $type, $userId);
    }

    public function approve(int $id, ?string $notes, int $reviewedBy): void {
        $request = $this->repo->findPendingById($id);
        if (!$request) throw new RuntimeException('Request not found or already reviewed');

        $this->conn->begin_transaction();
        try {
            $this->insertContent($request['type'], $request['data']);
            $this->repo->markReviewed($id, 'approved', $notes, $reviewedBy);
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
    }

    public function decline(int $id, ?string $notes, int $reviewedBy): void {
        $request = $this->repo->findPendingById($id);
        if (!$request) throw new RuntimeException('Request not found or already reviewed');
        $this->repo->markReviewed($id, 'declined', $notes, $reviewedBy);
    }

    private function insertContent(string $type, array $data): void {
        match ($type) {
            'project'  => $this->insertProject($data),
            'post'     => $this->insertPost($data),
            'sponsor'  => $this->insertSponsor($data),
            'member'   => $this->insertMember($data),
            default    => throw new RuntimeException("Unknown type: $type"),
        };
    }

    private function insertProject(array $d): void {
        $progress = (int)($d['progress'] ?? 0);
        $image    = $d['image'] ?? $d['image_url'] ?? '';
        $imgPos   = $d['image_position'] ?? '50% 50%';
        $stmt = $this->conn->prepare("INSERT INTO projects (name,description,status,progress,due_date,duration,image,image_position,created_at) VALUES (?,?,?,?,?,?,?,?,NOW())");
        $stmt->bind_param('sssissss', $d['name'], $d['description'], $d['status'], $progress, $d['due_date'], $d['duration'], $image, $imgPos);
        $stmt->execute();
    }

    private function insertPost(array $d): void {
        $title    = $d['title_sr'];
        $content  = $d['content_sr'];
        $featured = (int)($d['featured'] ?? 0);
        $image    = $d['image'] ?? '';
        $imagePos = $d['image_position'] ?? '50% 50%';
        $category = $d['category'] ?? '';
        $author   = $d['author'] ?? 'Manager';
        $stmt = $this->conn->prepare("INSERT INTO posts (title,title_sr,title_en,content,content_sr,content_en,author,category,featured,image,image_position,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,'published',NOW())");
        $stmt->bind_param('ssssssssiss', $title,$d['title_sr'],$d['title_en'],$content,$d['content_sr'],$d['content_en'],$author,$category,$featured,$image,$imagePos);
        $stmt->execute();
    }

    private function insertSponsor(array $d): void {
        $desc    = $d['description_sr']  ?? '';
        $descEn  = $d['description_en']  ?? '';
        $logo    = $d['logo']            ?? '';
        $imgPos  = $d['image_position']  ?? '50% 50%';
        $name    = $d['name']            ?? '';
        $tier    = $d['tier']            ?? '';
        $website = $d['website']         ?? '';
        $stmt = $this->conn->prepare("INSERT INTO sponsors (name,tier,website,description,description_en,logo,image_position,created_at) VALUES (?,?,?,?,?,?,?,NOW())");
        $stmt->bind_param('sssssss', $name, $tier, $website, $desc, $descEn, $logo, $imgPos);
        $stmt->execute();
    }

    private function insertMember(array $d): void {
        $hash = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
        $base = preg_replace('/_+/','_',trim(strtolower(preg_replace('/[^a-zA-Z0-9]/','_',$d['full_name'])),'_'));
        $username = $base; $suffix = 1;
        $ck = $this->conn->prepare("SELECT id FROM users WHERE username=?");
        $ck->bind_param('s',$username); $ck->execute();
        while ($ck->get_result()->num_rows > 0) { $username = $base.'_'.$suffix++; $ck->bind_param('s',$username); $ck->execute(); }

        $role     = $d['role']     ?? 'team_member';
        $phone    = $d['phone']    ?? '';
        $email    = $d['email']    ?? '';
        $fullName = $d['full_name'] ?? '';
        $team     = $d['team']     ?? '';
        $dept     = $d['department'] ?? '';
        $stmt = $this->conn->prepare("INSERT INTO users (username,password,email,full_name,role,team,department,phone,status,created_at) VALUES (?,?,?,?,?,?,?,?,'active',NOW())");
        $stmt->bind_param('ssssssss', $username, $hash, $email, $fullName, $role, $team, $dept, $phone);
        $stmt->execute();
        $uid = $this->conn->insert_id;

        $pic          = $d['profile_picture'] ?? 'default.jpg';
        $imgPos       = $d['image_position']  ?? '50% 50%';
        $position     = $d['position']     ?? '';
        $faculty      = $d['faculty']      ?? '';
        $studyField   = $d['study_field']  ?? '';
        $academicYear = $d['academic_year'] ?? '';
        $m = $this->conn->prepare("INSERT INTO team_members (user_id,position,profile_picture,image_position,faculty,study_field,academic_year,department,team,created_at) VALUES (?,?,?,?,?,?,?,?,?,NOW())");
        $m->bind_param('issssssss', $uid, $position, $pic, $imgPos, $faculty, $studyField, $academicYear, $dept, $team);
        $m->execute();
    }
}
