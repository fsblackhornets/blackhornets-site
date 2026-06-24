<?php

declare(strict_types=1);

namespace Tests\Unit;

use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Group;
use PHPUnit\Framework\TestCase;
use Router;

#[Group('unit')]
#[CoversClass(Router::class)]
final class RouterTest extends TestCase
{
    private Router $sut;

    protected function setUp(): void
    {
        $this->sut = new Router();
    }

    public function test_get_registers_get_route(): void
    {
        $this->sut->get('/api/posts', ['PostController', 'index']);

        $routes = $this->getRoutes();
        self::assertCount(1, $routes);
        self::assertSame('GET', $routes[0][0]);
        self::assertSame('/api/posts', $routes[0][1]);
    }

    public function test_post_registers_post_route(): void
    {
        $this->sut->post('/api/posts', ['PostController', 'create']);

        $routes = $this->getRoutes();
        self::assertSame('POST', $routes[0][0]);
        self::assertSame('/api/posts', $routes[0][1]);
    }

    public function test_delete_registers_delete_route(): void
    {
        $this->sut->delete('/api/posts/{id}', ['PostController', 'destroy']);

        $routes = $this->getRoutes();
        self::assertSame('DELETE', $routes[0][0]);
        self::assertSame('/api/posts/{id}', $routes[0][1]);
    }

    public function test_multiple_routes_are_all_registered(): void
    {
        $this->sut->get('/api/posts', ['PostController', 'index']);
        $this->sut->post('/api/posts', ['PostController', 'create']);
        $this->sut->delete('/api/posts/{id}', ['PostController', 'destroy']);

        self::assertCount(3, $this->getRoutes());
    }

    public function test_match_exact_path_returns_true(): void
    {
        $params = [];
        $result = $this->invokeMatch('/api/posts', '/api/posts', $params);

        self::assertTrue($result);
        self::assertEmpty($params);
    }

    public function test_match_different_path_returns_false(): void
    {
        $params = [];
        $result = $this->invokeMatch('/api/posts', '/api/teams', $params);

        self::assertFalse($result);
    }

    public function test_match_extracts_single_param(): void
    {
        $params = [];
        $result = $this->invokeMatch('/api/posts/{id}', '/api/posts/42', $params);

        self::assertTrue($result);
        self::assertSame('42', $params['id']);
    }

    public function test_match_extracts_multiple_params(): void
    {
        $params = [];
        $result = $this->invokeMatch('/api/{resource}/{id}', '/api/posts/99', $params);

        self::assertTrue($result);
        self::assertSame('posts', $params['resource']);
        self::assertSame('99', $params['id']);
    }

    public function test_match_does_not_match_partial_path(): void
    {
        $params = [];
        $result = $this->invokeMatch('/api/posts', '/api/posts/extra', $params);

        self::assertFalse($result);
    }

    public function test_match_does_not_match_shorter_path(): void
    {
        $params = [];
        $result = $this->invokeMatch('/api/posts/{id}', '/api/posts', $params);

        self::assertFalse($result);
    }

    public function test_dispatch_returns_404_json_for_unknown_route(): void
    {
        ob_start();
        $this->sut->dispatch('GET', '/no/such/route', null);
        $output = ob_get_clean();

        $decoded = json_decode($output, true);
        self::assertFalse($decoded['success']);
        self::assertStringContainsString('Route not found', $decoded['message']);
        self::assertStringContainsString('GET /no/such/route', $decoded['message']);
    }

    public function test_dispatch_404_includes_method_and_path(): void
    {
        ob_start();
        $this->sut->dispatch('DELETE', '/api/unknown', null);
        $output = ob_get_clean();

        $decoded = json_decode($output, true);
        self::assertStringContainsString('DELETE /api/unknown', $decoded['message']);
    }

    private function getRoutes(): array
    {
        $prop = new \ReflectionProperty(Router::class, 'routes');
        return $prop->getValue($this->sut);
    }

    private function invokeMatch(string $routePath, string $requestPath, array &$params): bool
    {
        $closure = \Closure::bind(
            function (string $routePath, string $requestPath, array &$params): bool {
                return $this->match($routePath, $requestPath, $params);
            },
            $this->sut,
            Router::class
        );
        return $closure($routePath, $requestPath, $params);
    }
}
