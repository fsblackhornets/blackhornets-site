<?php
require_once '../auth.php';
$user = checkAuth('admin');

require_once __DIR__ . '/../../../src/config/database.php';
require_once __DIR__ . '/../../../src/helpers/csrf_helper.php';

try {
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Get all projects
    $projects_result = $conn->query("SELECT * FROM projects ORDER BY created_at DESC");
    
} catch (Exception $e) {
    $error_message = $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <script src="/public/assets/js/favicon.js"></script>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Manage Projects - Admin Dashboard</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="stylesheet" href="../../assets/css/dashboard.css">
    <style>
        .projects-container {
            background: rgba(30,30,30,0.95);
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 0 18px #0005;
            margin-bottom: 40px;
        }
        
        .projects-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 24px;
        }
        
        .add-project-btn {
            background: #FFD700;
            color: #222;
            font-weight: 600;
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 1em;
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            transition: background 0.2s;
        }
        
        .add-project-btn:hover {
            background: #ffe066;
        }
        
        .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }
        
        .project-card {
            background: #181818;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: box-shadow 0.2s, transform 0.2s;
            border: 1px solid rgba(255, 215, 0, 0.1);
        }
        
        .project-card:hover {
            box-shadow: 0 6px 24px rgba(255,215,0,0.13), 0 2px 8px rgba(0,0,0,0.18);
            transform: translateY(-2px);
        }
        
        .project-image {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: 8px;
            margin-bottom: 16px;
        }
        
        .project-placeholder {
            width: 100%;
            height: 200px;
            background: linear-gradient(145deg, #FFD700, #ffed4e);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            font-size: 3rem;
            color: #222;
            font-weight: bold;
        }
        
        .project-name {
            font-weight: 700;
            color: #FFD700;
            font-size: 1.3em;
            margin-bottom: 8px;
        }
        
        .project-status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .status-active {
            background: #4CAF50;
            color: white;
        }
        
        .status-completed {
            background: #2196F3;
            color: white;
        }
        
        .status-pending {
            background: #FF9800;
            color: white;
        }
        
        .project-description {
            color: #ddd;
            font-size: 0.95em;
            margin-bottom: 16px;
            line-height: 1.4;
        }
        
        .project-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            font-size: 0.9em;
            color: #bbb;
        }
        
        .progress-container {
            margin-bottom: 16px;
        }
        
        .progress-bar {
            width: 100%;
            height: 8px;
            background: #333;
            border-radius: 4px;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: #FFD700;
            transition: width 0.3s ease;
        }
        
        .progress-text {
            color: #FFD700;
            font-size: 0.9em;
            font-weight: 600;
            margin-top: 4px;
        }
        
        .project-actions {
            display: flex;
            gap: 10px;
        }
        
        .btn-edit-project {
            background: #FFD700;
            color: #222;
            font-weight: 600;
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 0.9em;
            display: flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
            transition: background 0.2s;
        }
        
        .btn-edit-project:hover {
            background: #ffe066;
        }
        
        .btn-delete-project {
            background: #e53935;
            color: #fff;
            font-weight: 600;
            border: none;
            border-radius: 6px;
            padding: 8px 16px;
            font-size: 0.9em;
            display: flex;
            align-items: center;
            gap: 6px;
            text-decoration: none;
            transition: background 0.2s;
        }
        
        .btn-delete-project:hover {
            background: #b71c1c;
        }
        
        .no-projects {
            text-align: center;
            color: #aaa;
            padding: 40px;
            font-size: 1.1em;
        }
        
        @media (max-width: 768px) {
            .projects-header {
                flex-direction: column;
                gap: 16px;
                align-items: stretch;
            }
            
            .projects-grid {
                grid-template-columns: 1fr;
            }
            
            .project-actions {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <?php include __DIR__ . '/../components/admin_navbar.php'; ?>

        <div class="projects-container">
            <div class="projects-header">
                <h2 data-i18n="projectsManagement">Projects Management</h2>
                <a href="add-edit-project.php" class="add-project-btn">
                    <i class="fas fa-plus"></i>
                    <span data-i18n="addNewProject">Add New Project</span>
                </a>
            </div>

            <div class="projects-grid">
                <?php if ($projects_result && $projects_result->num_rows > 0): ?>
                    <?php while ($project = $projects_result->fetch_assoc()): ?>
                        <div class="project-card">
                            <?php if ($project['image']): ?>
                                <img src="../uploads/projects/<?= htmlspecialchars($project['image']) ?>" 
                                     alt="<?= htmlspecialchars($project['name']) ?>" 
                                     class="project-image">
                            <?php else: ?>
                                <div class="project-placeholder">
                                    <?= strtoupper(substr($project['name'], 0, 1)) ?>
                                </div>
                            <?php endif; ?>
                            
                            <div class="project-name"><?= htmlspecialchars($project['name']) ?></div>
                            
                            <div class="project-status status-<?= strtolower($project['status']) ?>">
                                <?= htmlspecialchars($project['status']) ?>
                            </div>
                            
                            <div class="project-description"><?= htmlspecialchars($project['description']) ?></div>
                            
                            <div class="project-meta">
                                <span><i class="fas fa-calendar"></i> <span data-i18n="due">Due</span>: <?= htmlspecialchars($project['due_date']) ?></span>
                                <span><i class="fas fa-clock"></i> <?= htmlspecialchars($project['duration']) ?></span>
                            </div>
                            
                            <div class="progress-container">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: <?= $project['progress'] ?>%"></div>
                                </div>
                                <div class="progress-text"><?= $project['progress'] ?>% <span data-i18n="complete">Complete</span></div>
                            </div>
                            
                            <div class="project-actions">
                                <a href="add-edit-project.php?id=<?= $project['id'] ?>" class="btn-edit-project">
                                    <i class="fas fa-edit"></i> <span data-i18n="edit">Edit</span>
                                </a>
                                <a href="delete-project.php?id=<?= $project['id'] ?>&csrf_token=<?= htmlspecialchars(csrf_generate_token()) ?>"
                                   class="btn-delete-project"
                                   onclick="return confirm(getT().confirmDeleteProject);">
                                    <i class="fas fa-trash"></i> <span data-i18n="delete">Delete</span>
                                </a>
                            </div>
                        </div>
                    <?php endwhile; ?>
                <?php else: ?>
                    <div class="no-projects">
                        <i class="fas fa-project-diagram" style="font-size: 3em; margin-bottom: 16px; color: #666;"></i>
                        <p data-i18n="noProjectsFound">No projects found.</p>
                        <p data-i18n="addFirstProject">Add your first project to get started!</p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <div class="loading-overlay">
        <div class="loading-spinner"></div>
    </div>

    <script>
        function getT() {
            const lang = localStorage.getItem('language') || 'en';
            return adminTranslations[lang] || adminTranslations.en;
        }

        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('a')) {
                    e.preventDefault();
                }
            });
        });

        window.addEventListener('load', function() {
            document.querySelector('.loading-overlay').style.display = 'none';
        });
    </script>
</body>
</html>

<?php
if (isset($conn)) {
    $conn->close();
}
?> 