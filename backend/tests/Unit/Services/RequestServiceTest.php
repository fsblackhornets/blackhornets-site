<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;
use RequestRepository;
use RequestService;

#[Group('unit')]
#[CoversClass(RequestService::class)]
final class RequestServiceTest extends TestCase
{
    private RequestRepository $repo;
    private \mysqli $conn;
    private RequestService $sut;

    protected function setUp(): void
    {
        $this->repo = $this->createMock(RequestRepository::class);
        $this->conn = $this->getMockBuilder(\mysqli::class)
            ->disableOriginalConstructor()
            ->getMock();
        $this->sut  = new RequestService($this->repo, $this->conn);
    }

    public function test_create_json_encodes_data_before_delegating(): void
    {
        $data = ['field' => 'value', 'count' => 3];
        $this->repo
            ->expects(self::once())
            ->method('create')
            ->with('project', json_encode($data), 5, 'John Doe')
            ->willReturn(10);

        $id = $this->sut->create('project', $data, 5, 'John Doe');

        self::assertSame(10, $id);
    }

    public function test_create_returns_repository_id(): void
    {
        $this->repo->method('create')->willReturn(99);

        $id = $this->sut->create('post', [], 1, 'author');

        self::assertSame(99, $id);
    }

    public function test_getAll_delegates_with_all_filters(): void
    {
        $expected = [['id' => 1, 'type' => 'project', 'status' => 'pending']];
        $this->repo
            ->expects(self::once())
            ->method('findAll')
            ->with('pending', 'project', 3)
            ->willReturn($expected);

        $result = $this->sut->getAll('pending', 'project', 3);

        self::assertSame($expected, $result);
    }

    public function test_getAll_passes_null_filters_to_repository(): void
    {
        $this->repo
            ->expects(self::once())
            ->method('findAll')
            ->with(null, null, null)
            ->willReturn([]);

        $result = $this->sut->getAll(null, null, null);

        self::assertSame([], $result);
    }

    public function test_decline_throws_when_request_not_found(): void
    {
        $this->repo->method('findPendingById')->with(99)->willReturn(null);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Request not found or already reviewed');

        $this->sut->decline(99, null, 1);
    }

    public function test_decline_marks_request_as_declined(): void
    {
        $request = ['id' => 5, 'type' => 'project', 'data' => '{}'];
        $this->repo->method('findPendingById')->with(5)->willReturn($request);
        $this->repo
            ->expects(self::once())
            ->method('markReviewed')
            ->with(5, 'declined', 'Not eligible', 2);

        $this->sut->decline(5, 'Not eligible', 2);
    }

    public function test_decline_passes_null_notes_to_repository(): void
    {
        $request = ['id' => 7, 'type' => 'post', 'data' => '{}'];
        $this->repo->method('findPendingById')->willReturn($request);
        $this->repo
            ->expects(self::once())
            ->method('markReviewed')
            ->with(7, 'declined', null, 1);

        $this->sut->decline(7, null, 1);
    }

    public function test_approve_throws_when_request_not_found(): void
    {
        $this->repo->method('findPendingById')->with(42)->willReturn(null);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Request not found or already reviewed');

        $this->sut->approve(42, null, 1);
    }

    public function test_updateRequestData_json_encodes_data_and_delegates(): void
    {
        $data = ['name' => 'Updated Project', 'status' => 'active'];
        $this->repo
            ->expects(self::once())
            ->method('updateData')
            ->with(7, json_encode($data));

        $this->sut->updateRequestData(7, $data);
    }

    public function test_updateRequestData_with_empty_array_passes_empty_json(): void
    {
        $this->repo
            ->expects(self::once())
            ->method('updateData')
            ->with(1, '[]');

        $this->sut->updateRequestData(1, []);
    }
}
