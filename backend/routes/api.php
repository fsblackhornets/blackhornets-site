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

$router->get('/gallery',              [GalleryController::class, 'index']);
$router->post('/gallery',             [GalleryController::class, 'create']);
$router->get('/admin/gallery',        [GalleryController::class, 'adminIndex']);
$router->delete('/gallery/{id}',      [GalleryController::class, 'delete']);
$router->post('/gallery/{id}/toggle', [GalleryController::class, 'toggle']);
$router->put('/gallery/{id}',         [GalleryController::class, 'update']);

$router->get('/brochure', [BrochureController::class, 'show']);

// Admin — projects
$router->get('/admin/projects',         [ProjectController::class, 'adminIndex']);
$router->get('/admin/projects/{id}',    [ProjectController::class, 'adminShow']);
$router->post('/admin/projects',        [ProjectController::class, 'adminCreate']);
$router->post('/admin/projects/{id}',   [ProjectController::class, 'adminUpdate']);
$router->delete('/admin/projects/{id}', [ProjectController::class, 'adminDelete']);

// Admin — sponsors
$router->get('/admin/sponsors',         [SponsorController::class, 'adminIndex']);
$router->get('/admin/sponsors/{id}',    [SponsorController::class, 'adminShow']);
$router->post('/admin/sponsors',        [SponsorController::class, 'adminCreate']);
$router->post('/admin/sponsors/{id}',   [SponsorController::class, 'adminUpdate']);
$router->delete('/admin/sponsors/{id}', [SponsorController::class, 'adminDelete']);

// Admin — brochure
$router->get('/admin/brochure',  [BrochureController::class, 'showAll']);
$router->post('/admin/brochure', [BrochureController::class, 'upload']);

$router->post('/contact/send', [ContactController::class, 'send']);

$router->post('/applications', [ApplicationController::class, 'submit']);

$router->get('/requests',              [RequestController::class, 'index']);
$router->get('/requests/{id}',         [RequestController::class, 'show']);
$router->post('/requests',             [RequestController::class, 'create']);
$router->post('/requests/{id}/review', [RequestController::class, 'review']);

// Admin
$router->get('/admin/stats',                       [AdminController::class, 'stats']);
$router->get('/admin/messages',                    [AdminController::class, 'messages']);
$router->delete('/admin/messages/{id}',            [AdminController::class, 'deleteMessage']);
$router->get('/admin/members',                     [AdminController::class, 'members']);
$router->get('/admin/members/{id}',                [AdminController::class, 'memberDetail']);
$router->post('/admin/members',                    [AdminController::class, 'createMember']);
$router->put('/admin/members/{id}',                [AdminController::class, 'updateMember']);
$router->delete('/admin/members/{id}',             [AdminController::class, 'deleteMember']);
$router->post('/admin/members/{id}/toggle',        [AdminController::class, 'toggleMemberStatus']);
$router->get('/admin/applications',                [AdminController::class, 'applications']);
$router->get('/admin/applications/{id}',           [AdminController::class, 'applicationDetail']);
$router->post('/admin/applications/{id}/review',   [AdminController::class, 'reviewApplication']);
