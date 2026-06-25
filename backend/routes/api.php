<?php

/** @var Router $router */

$router->get('/team',    [TeamController::class, 'index']);

$router->get('/posts',             [PostController::class, 'index']);
$router->get('/posts/categories',  [PostController::class, 'categories']);
$router->get('/posts/{id}',        [PostController::class, 'show']);
$router->post('/posts',            [PostController::class, 'create']);
$router->put('/posts/{id}',        [PostController::class, 'update']);
$router->delete('/posts/{id}',     [PostController::class, 'delete']);
$router->post('/posts/{id}/toggle', [PostController::class, 'toggleStatus']);

$router->get('/projects',      [ProjectController::class, 'index']);
$router->get('/projects/{id}', [ProjectController::class, 'show']);

$router->get('/sponsors', [SponsorController::class, 'index']);

$router->get('/gallery',  [GalleryController::class, 'index']);
$router->post('/gallery', [GalleryController::class, 'create']);

$router->get('/brochure', [BrochureController::class, 'show']);

$router->post('/contact/send', [ContactController::class, 'send']);

$router->post('/applications', [ApplicationController::class, 'submit']);

$router->get('/requests',              [RequestController::class, 'index']);
$router->post('/requests',             [RequestController::class, 'create']);
$router->post('/requests/{id}/review', [RequestController::class, 'review']);

// Admin
$router->get('/admin/stats',                       [AdminController::class, 'stats']);
$router->get('/admin/messages',                    [AdminController::class, 'messages']);
$router->delete('/admin/messages/{id}',            [AdminController::class, 'deleteMessage']);
$router->get('/admin/applications',                [AdminController::class, 'applications']);
$router->get('/admin/applications/{id}',           [AdminController::class, 'applicationDetail']);
$router->post('/admin/applications/{id}/review',   [AdminController::class, 'reviewApplication']);
