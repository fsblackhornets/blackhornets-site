<?php

class Router {
    private array $routes = [];

    public function get(string $path, array $handler): void {
        $this->routes[] = ['GET', $path, $handler];
    }

    public function post(string $path, array $handler): void {
        $this->routes[] = ['POST', $path, $handler];
    }

    public function delete(string $path, array $handler): void {
        $this->routes[] = ['DELETE', $path, $handler];
    }

    public function dispatch(string $method, string $path, $conn): void {
        foreach ($this->routes as [$routeMethod, $routePath, [$class, $action]]) {
            $params = [];
            if ($routeMethod === $method && $this->match($routePath, $path, $params)) {
                $controller = new $class($conn);
                $controller->$action($params);
                return;
            }
        }
        http_response_code(404);
        echo json_encode(['success' => false, 'message' => "Route not found: $method $path"]);
    }

    private function match(string $routePath, string $requestPath, array &$params): bool {
        $pattern = preg_replace('/\{(\w+)\}/', '(?P<$1>[^/]+)', $routePath);
        $pattern = '#^' . $pattern . '$#';
        if (preg_match($pattern, $requestPath, $matches)) {
            foreach ($matches as $key => $value) {
                if (is_string($key)) $params[$key] = $value;
            }
            return true;
        }
        return false;
    }
}
