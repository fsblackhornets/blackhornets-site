<?php

/** @var Router $router */

// Team
$router->get('/team',    [TeamController::class, 'index']);

// Posts
$router->get('/posts',             [PostController::class, 'index']);
$router->get('/posts/categories',  [PostController::class, 'categories']);
$router->get('/posts/{id}',        [PostController::class, 'show']);
$router->post('/posts',            [PostController::class, 'create']);

// Projects
$router->get('/projects', [ProjectController::class, 'index']);

// Sponsors
$router->get('/sponsors', [SponsorController::class, 'index']);

// Gallery
$router->get('/gallery', [GalleryController::class, 'index']);

// Brochure
$router->get('/brochure', [BrochureController::class, 'show']);

// Contact form
$router->post('/contact/send', [ContactController::class, 'send']);

// Content requests (manager workflow)
$router->get('/requests',          [RequestController::class, 'index']);
$router->post('/requests',         [RequestController::class, 'create']);
$router->post('/requests/{id}/review', [RequestController::class, 'review']);
