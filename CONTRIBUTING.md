# Contributing to Black Hornets Racing Platform

Thank you for considering contributing to our project! This document provides guidelines for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported
2. Use the bug report template
3. Provide detailed steps to reproduce
4. Include error messages and screenshots
5. Specify your environment (OS, PHP version, browser)

### Suggesting Enhancements

1. Check if the enhancement has been suggested
2. Provide clear description and use cases
3. Explain why this would be useful

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development Guidelines

### Coding Standards

#### PHP
- Follow PSR-12 coding standards
- Use meaningful variable and function names
- Add comments for complex logic
- Use type hints where possible

```php
// Good
function getUserById(int $id): ?User {
    // Implementation
}

// Bad
function get($x) {
    // Implementation
}
```

#### JavaScript
- Use ES6+ features
- Use const/let instead of var
- Use arrow functions where appropriate
- Follow consistent naming conventions

```javascript
// Good
const getUserData = async (userId) => {
    const response = await fetch(`/api/users/${userId}`);
    return response.json();
};

// Bad
function getUserData(userId) {
    $.get('/api/users/' + userId, function(data) {
        return data;
    });
}
```

#### CSS
- Use BEM methodology for class naming
- Mobile-first approach
- Use CSS variables for colors and spacing
- Keep specificity low

```css
/* Good */
.nav-item__link--active {
    color: var(--primary-color);
}

/* Bad */
#nav ul li a.active {
    color: #FFD700;
}
```

### Git Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

```
feat: Add user authentication system

- Implement login/logout functionality
- Add session management
- Create auth middleware

Closes #123
```

### Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Include both unit and integration tests
- Aim for >80% code coverage

### Documentation

- Update README.md for significant changes
- Add inline comments for complex logic
- Update API documentation
- Include examples for new features

## Project Structure Guidelines

### File Organization
```
src/
├── api/           # API endpoints only
├── controllers/   # Business logic
├── models/        # Data models
├── views/         # UI templates
├── middleware/    # Auth, validation, etc.
├── config/        # Configuration files
└── utils/         # Helper functions
```

### Naming Conventions

- **Controllers**: `PascalCase` + `Controller` suffix
  - Example: `UserController.php`
- **API Files**: `snake_case`
  - Example: `read.php`, `create.php`
- **CSS Classes**: `kebab-case`
  - Example: `.nav-item`, `.hero-section`
- **JavaScript Functions**: `camelCase`
  - Example: `getUserData()`, `validateForm()`

## Review Process

1. Code review by at least one maintainer
2. All tests must pass
3. Documentation must be updated
4. No merge conflicts
5. Follows coding standards

## Questions?

Feel free to reach out to the maintainers:
- Email: formulastudentftn@gmail.com
- Create an issue for discussions

Thank you for contributing! 🚀
