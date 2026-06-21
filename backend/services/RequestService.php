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
        $image    = $d['image_url'] ?? '';
        $stmt = $this->conn->prepare("INSERT INTO projects (name,description,status,progress,due_date,duration,image,created_at) VALUES (?,?,?,?,?,?,?,NOW())");
        $stmt->bind_param('sssisss', $d['name'], $d['description'], $d['status'], $progress, $d['due_date'], $d['duration'], $image);
        $stmt->execute();
    }

    private function insertPost(array $d): void {
        $title    = $d['title_sr'];
        $content  = $d['content_sr'];
        $featured = (int)($d['featured'] ?? 0);
        $image    = $d['image'] ?? '';
        $category = $d['category'] ?? '';
        $author   = $d['author'] ?? 'Manager';
        $stmt = $this->conn->prepare("INSERT INTO posts (title,title_sr,title_en,content,content_sr,content_en,author,category,featured,image,status,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,'published',NOW())");
        $stmt->bind_param('ssssssssis', $title,$d['title_sr'],$d['title_en'],$content,$d['content_sr'],$d['content_en'],$author,$category,$featured,$image);
        $stmt->execute();
    }

    private function insertSponsor(array $d): void {
        $desc = $d['description_sr'] ?? '';
        $logo = $d['logo'] ?? '';
        $stmt = $this->conn->prepare("INSERT INTO sponsors (name,tier,website,description,description_en,logo,created_at) VALUES (?,?,?,?,?,?,NOW())");
        $stmt->bind_param('ssssss', $d['name'],$d['tier'],$d['website'],$desc,$d['description_en']??'',$logo);
        $stmt->execute();
    }

    private function insertMember(array $d): void {
        $hash = password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
        $base = preg_replace('/_+/','_',trim(strtolower(preg_replace('/[^a-zA-Z0-9]/','_',$d['full_name'])),'_'));
        $username = $base; $suffix = 1;
        $ck = $this->conn->prepare("SELECT id FROM users WHERE username=?");
        $ck->bind_param('s',$username); $ck->execute();
        while ($ck->get_result()->num_rows > 0) { $username = $base.'_'.$suffix++; $ck->bind_param('s',$username); $ck->execute(); }

        $role = $d['role'] ?? 'team_member';
        $stmt = $this->conn->prepare("INSERT INTO users (username,password,email,full_name,role,team,department,phone,status,created_at) VALUES (?,?,?,?,?,?,?,?,'active',NOW())");
        $stmt->bind_param('ssssssss',$username,$hash,$d['email'],$d['full_name'],$role,$d['team'],$d['department'],$d['phone']??'');
        $stmt->execute();
        $uid = $this->conn->insert_id;

        $pic = $d['profile_picture'] ?? 'default.jpg';
        $m = $this->conn->prepare("INSERT INTO team_members (user_id,position,profile_picture,faculty,study_field,academic_year,department,team,created_at) VALUES (?,?,?,?,?,?,?,?,NOW())");
        $m->bind_param('isssssss',$uid,$d['position']??'',$pic,$d['faculty']??'',$d['study_field']??'',$d['academic_year']??'',$d['department'],$d['team']);
        $m->execute();
    }
}
