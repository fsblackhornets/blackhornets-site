<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;
use ProjectRepository;
use ProjectService;

#[Group('unit')]
#[CoversClass(ProjectService::class)]
final class ProjectServiceTest extends TestCase
{
    private ProjectRepository $repo;
    private ProjectService $sut;

    protected function setUp(): void
    {
        $this->repo = $this->createMock(ProjectRepository::class);
        $this->sut  = new ProjectService($this->repo);
    }

    public function test_getAll_delegates_to_repository(): void
    {
        $expected = [['id' => 1, 'name' => 'Aero project']];
        $this->repo->expects(self::once())->method('findAll')->willReturn($expected);

        $result = $this->sut->getAll();

        self::assertSame($expected, $result);
    }

    public function test_getAll_returns_empty_array_when_no_projects(): void
    {
        $this->repo->method('findAll')->willReturn([]);

        self::assertSame([], $this->sut->getAll());
    }

    public function test_getById_delegates_with_correct_id(): void
    {
        $expected = ['id' => 3, 'name' => 'Suspension'];
        $this->repo->expects(self::once())->method('findById')->with(3)->willReturn($expected);

        $result = $this->sut->getById(3);

        self::assertSame($expected, $result);
    }

    public function test_getById_returns_null_when_not_found(): void
    {
        $this->repo->method('findById')->with(404)->willReturn(null);

        self::assertNull($this->sut->getById(404));
    }
}
