<?php

/** @var Router $router */

$router->get('/team',    [TeamController::class, 'index']);

$router->get('/posts',             [PostController::class, 'index']);
$router->get('/posts/categories',  [PostController::class, 'categories']);
$router->get('/posts/{id}',        [PostController::class, 'show']);
$router->post('/posts',            [PostController::class, 'create']);

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
