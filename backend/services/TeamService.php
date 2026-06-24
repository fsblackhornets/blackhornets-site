<?php

class TeamService {
    public function __construct(private TeamRepository $repo) {}

    public function getAll(): array {
        $members = $this->repo->findAll();

        $organized  = ['mechanical' => [], 'electrical' => [], 'operating_business' => []];
        $teamLeader = $mechPL = $elecPL = $bizPL = null;

        foreach ($members as $m) {
            if (isset($organized[$m['team']])) $organized[$m['team']][] = $m;
            if ($m['role'] === 'team_leader') $teamLeader = $m;
            if ($m['role'] === 'project_leader') {
                match ($m['team']) {
                    'mechanical'        => $mechPL = $m,
                    'electrical'        => $elecPL = $m,
                    'operating_business' => $bizPL  = $m,
                    default             => null,
                };
            }
        }

        return [
            'members'                    => $members,
            'organized_data'             => $organized,
            'team_leader'                => $teamLeader,
            'mechanical_project_leader'  => $mechPL,
            'electrical_project_leader'  => $elecPL,
            'business_project_leader'    => $bizPL,
        ];
    }
}
