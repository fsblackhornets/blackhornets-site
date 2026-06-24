<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;
use PostRepository;
use PostService;

#[Group('unit')]
#[CoversClass(PostService::class)]
final class PostServiceTest extends TestCase
{
    private PostRepository $repo;
    private PostService $sut;

    protected function setUp(): void
    {
        $this->repo = $this->createMock(PostRepository::class);
        $this->sut  = new PostService($this->repo);
    }

    public function test_getAll_delegates_to_repository(): void
    {
        $expected = [['id' => 1, 'title' => 'Test post']];
        $this->repo->expects(self::once())->method('findAll')->willReturn($expected);

        $result = $this->sut->getAll();

        self::assertSame($expected, $result);
    }

    public function test_getAll_returns_empty_array_when_no_posts(): void
    {
        $this->repo->method('findAll')->willReturn([]);

        self::assertSame([], $this->sut->getAll());
    }

    public function test_getById_delegates_with_correct_id(): void
    {
        $expected = ['id' => 5, 'title' => 'Hello'];
        $this->repo->expects(self::once())->method('findById')->with(5)->willReturn($expected);

        $result = $this->sut->getById(5);

        self::assertSame($expected, $result);
    }

    public function test_getById_returns_null_when_not_found(): void
    {
        $this->repo->method('findById')->with(999)->willReturn(null);

        self::assertNull($this->sut->getById(999));
    }

    public function test_getCategories_delegates_to_repository(): void
    {
        $expected = ['news', 'events', 'technical'];
        $this->repo->expects(self::once())->method('findCategories')->willReturn($expected);

        $result = $this->sut->getCategories();

        self::assertSame($expected, $result);
    }

    public function test_create_maps_all_fields_and_returns_id(): void
    {
        $data = [
            'title_sr'   => 'Naslov',
            'title_en'   => 'Title',
            'content_sr' => 'Sadrzaj',
            'content_en' => 'Content',
            'category'   => 'news',
            'featured'   => '1',
            'image'      => 'photo.jpg',
        ];

        $this->repo
            ->expects(self::once())
            ->method('create')
            ->with(self::callback(function (array $mapped): bool {
                return $mapped['title'] === 'Naslov'
                    && $mapped['title_sr'] === 'Naslov'
                    && $mapped['title_en'] === 'Title'
                    && $mapped['content'] === 'Sadrzaj'
                    && $mapped['content_sr'] === 'Sadrzaj'
                    && $mapped['content_en'] === 'Content'
                    && $mapped['author'] === 'editor'
                    && $mapped['category'] === 'news'
                    && $mapped['featured'] === 1
                    && $mapped['image'] === 'photo.jpg';
            }))
            ->willReturn(42);

        $id = $this->sut->create($data, 'editor');

        self::assertSame(42, $id);
    }

    public function test_create_uses_empty_defaults_for_missing_fields(): void
    {
        $this->repo
            ->expects(self::once())
            ->method('create')
            ->with(self::callback(function (array $mapped): bool {
                return $mapped['title'] === ''
                    && $mapped['title_sr'] === ''
                    && $mapped['title_en'] === ''
                    && $mapped['content'] === ''
                    && $mapped['content_sr'] === ''
                    && $mapped['content_en'] === ''
                    && $mapped['category'] === ''
                    && $mapped['featured'] === 0
                    && $mapped['image'] === '';
            }))
            ->willReturn(1);

        $this->sut->create([], 'author');
    }

    public function test_create_title_mirrors_title_sr(): void
    {
        $this->repo
            ->method('create')
            ->with(self::callback(fn(array $m) => $m['title'] === $m['title_sr']))
            ->willReturn(1);

        $this->sut->create(['title_sr' => 'Test naslov'], 'author');
    }

    public function test_create_content_mirrors_content_sr(): void
    {
        $this->repo
            ->method('create')
            ->with(self::callback(fn(array $m) => $m['content'] === $m['content_sr']))
            ->willReturn(1);

        $this->sut->create(['content_sr' => 'Test sadrzaj'], 'author');
    }

    public function test_create_casts_featured_string_to_int(): void
    {
        $this->repo
            ->method('create')
            ->with(self::callback(fn(array $m) => $m['featured'] === 1 && is_int($m['featured'])))
            ->willReturn(1);

        $this->sut->create(['featured' => '1'], 'author');
    }

    public function test_create_passes_author_to_repository(): void
    {
        $this->repo
            ->method('create')
            ->with(self::callback(fn(array $m) => $m['author'] === 'janedoe'))
            ->willReturn(1);

        $this->sut->create([], 'janedoe');
    }
}
