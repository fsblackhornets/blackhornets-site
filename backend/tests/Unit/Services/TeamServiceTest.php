<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;
use TeamRepository;
use TeamService;

#[Group('unit')]
#[CoversClass(TeamService::class)]
final class TeamServiceTest extends TestCase
{
    private TeamRepository $repo;
    private TeamService $sut;

    protected function setUp(): void
    {
        $this->repo = $this->createMock(TeamRepository::class);
        $this->sut  = new TeamService($this->repo);
    }

    public function test_getAll_returns_all_required_keys(): void
    {
        $this->repo->method('findAll')->willReturn([]);

        $result = $this->sut->getAll();

        self::assertArrayHasKey('members', $result);
        self::assertArrayHasKey('organized_data', $result);
        self::assertArrayHasKey('team_leader', $result);
        self::assertArrayHasKey('mechanical_project_leader', $result);
        self::assertArrayHasKey('electrical_project_leader', $result);
        self::assertArrayHasKey('business_project_leader', $result);
    }

    public function test_getAll_with_empty_members_returns_null_leaders(): void
    {
        $this->repo->method('findAll')->willReturn([]);

        $result = $this->sut->getAll();

        self::assertNull($result['team_leader']);
        self::assertNull($result['mechanical_project_leader']);
        self::assertNull($result['electrical_project_leader']);
        self::assertNull($result['business_project_leader']);
    }

    public function test_getAll_with_empty_members_returns_empty_organized_data(): void
    {
        $this->repo->method('findAll')->willReturn([]);

        $result = $this->sut->getAll();

        self::assertEmpty($result['organized_data']['mechanical']);
        self::assertEmpty($result['organized_data']['electrical']);
        self::assertEmpty($result['organized_data']['operating_business']);
    }

    public function test_getAll_identifies_team_leader(): void
    {
        $leader = ['id' => 1, 'name' => 'Ana', 'role' => 'team_leader', 'team' => 'mechanical'];
        $this->repo->method('findAll')->willReturn([$leader]);

        $result = $this->sut->getAll();

        self::assertSame($leader, $result['team_leader']);
    }

    public function test_getAll_identifies_mechanical_project_leader(): void
    {
        $mechPL = ['id' => 2, 'name' => 'Marko', 'role' => 'project_leader', 'team' => 'mechanical'];
        $this->repo->method('findAll')->willReturn([$mechPL]);

        $result = $this->sut->getAll();

        self::assertSame($mechPL, $result['mechanical_project_leader']);
        self::assertNull($result['electrical_project_leader']);
        self::assertNull($result['business_project_leader']);
    }

    public function test_getAll_identifies_electrical_project_leader(): void
    {
        $elecPL = ['id' => 3, 'name' => 'Sara', 'role' => 'project_leader', 'team' => 'electrical'];
        $this->repo->method('findAll')->willReturn([$elecPL]);

        $result = $this->sut->getAll();

        self::assertSame($elecPL, $result['electrical_project_leader']);
        self::assertNull($result['mechanical_project_leader']);
    }

    public function test_getAll_identifies_business_project_leader(): void
    {
        $bizPL = ['id' => 4, 'name' => 'Jovan', 'role' => 'project_leader', 'team' => 'operating_business'];
        $this->repo->method('findAll')->willReturn([$bizPL]);

        $result = $this->sut->getAll();

        self::assertSame($bizPL, $result['business_project_leader']);
    }

    public function test_getAll_identifies_all_project_leaders_simultaneously(): void
    {
        $mechPL = ['id' => 1, 'role' => 'project_leader', 'team' => 'mechanical'];
        $elecPL = ['id' => 2, 'role' => 'project_leader', 'team' => 'electrical'];
        $bizPL  = ['id' => 3, 'role' => 'project_leader', 'team' => 'operating_business'];
        $this->repo->method('findAll')->willReturn([$mechPL, $elecPL, $bizPL]);

        $result = $this->sut->getAll();

        self::assertSame($mechPL, $result['mechanical_project_leader']);
        self::assertSame($elecPL, $result['electrical_project_leader']);
        self::assertSame($bizPL, $result['business_project_leader']);
    }

    public function test_getAll_organizes_members_by_team(): void
    {
        $mech = ['id' => 1, 'role' => 'member', 'team' => 'mechanical'];
        $elec = ['id' => 2, 'role' => 'member', 'team' => 'electrical'];
        $biz  = ['id' => 3, 'role' => 'member', 'team' => 'operating_business'];
        $this->repo->method('findAll')->willReturn([$mech, $elec, $biz]);

        $result = $this->sut->getAll();

        self::assertContains($mech, $result['organized_data']['mechanical']);
        self::assertContains($elec, $result['organized_data']['electrical']);
        self::assertContains($biz, $result['organized_data']['operating_business']);
    }

    public function test_getAll_excludes_unknown_team_from_organized_data(): void
    {
        $unknown = ['id' => 99, 'role' => 'member', 'team' => 'management'];
        $this->repo->method('findAll')->willReturn([$unknown]);

        $result = $this->sut->getAll();

        self::assertEmpty($result['organized_data']['mechanical']);
        self::assertEmpty($result['organized_data']['electrical']);
        self::assertEmpty($result['organized_data']['operating_business']);
    }

    public function test_getAll_returns_raw_members_list_unchanged(): void
    {
        $members = [
            ['id' => 1, 'role' => 'member', 'team' => 'mechanical'],
            ['id' => 2, 'role' => 'member', 'team' => 'electrical'],
        ];
        $this->repo->method('findAll')->willReturn($members);

        $result = $this->sut->getAll();

        self::assertSame($members, $result['members']);
    }

    public function test_getAll_with_no_team_leader_returns_null(): void
    {
        $regularMember = ['id' => 1, 'role' => 'member', 'team' => 'mechanical'];
        $this->repo->method('findAll')->willReturn([$regularMember]);

        $result = $this->sut->getAll();

        self::assertNull($result['team_leader']);
    }
}
