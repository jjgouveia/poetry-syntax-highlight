# Changelog

All notable changes to the **Poetry Syntax Highlight** extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Add support for Poetry plugin configurations
- Enhanced autocomplete for Poetry commands
- Integration with Poetry CLI

---

## [0.0.1] - 2025-07-30

### 🎉 Initial Release

This is the first release of Poetry Syntax Highlight extension for Visual Studio Code!
It provides comprehensive syntax highlighting for `pyproject.toml` files used in Poetry projects, enhancing the development experience with better readability and structure recognition.

#### ✨ Added
- **Core Syntax Highlighting**: Enhanced syntax highlighting for `pyproject.toml` files with Poetry-specific grammar
- **Poetry Language Support**: Custom `poetry-toml` language definition for enhanced tooling integration
- **Advanced Grammar Definition**: Comprehensive TextMate grammar with 200+ syntax patterns
- **File Association**: Automatic recognition and language assignment for `pyproject.toml` files
- **Zero Configuration**: Works out of the box without any setup required
- **Extension Commands**: Hello World command for testing extension activation
- **Support for Poetry workspaces and monorepos**:
  - Recognizes multiple `pyproject.toml` files in a single workspace
  - Handles nested project structures with proper syntax highlighting

#### 🎨 Comprehensive Syntax Highlighting Features

##### **Project Metadata & Configuration**
- **Project Information**: Enhanced highlighting for `[tool.poetry]` section
  - Project name, version, description with semantic coloring
  - Author and maintainer information with email recognition
  - License, readme, homepage, repository, and documentation URLs
  - Keywords and classifiers arrays with proper formatting
  - Include/exclude patterns for package files
  
##### **Dependencies & Dependency Management**
- **Main Dependencies**: `[tool.poetry.dependencies]` with intelligent package recognition
- **Dependency Groups**: Full support for `[tool.poetry.group.<name>.dependencies]`
  - Development dependencies (`dev`, `test`, `docs`, `lint`, etc.)
  - Custom named groups for specialized workflows
- **Advanced Dependency Formats**:
  - **Git Dependencies**: `{git = "https://github.com/user/repo.git", rev = "main"}`
  - **Path Dependencies**: `{path = "../local-package", develop = true}`
  - **URL Dependencies**: `{url = "https://example.com/package.whl"}`
  - **Dependencies with Extras**: `{extras = ["all"], version = "^0.104.0"}`
  - **Conditional Dependencies**: Platform and Python version markers
  
##### **Version Constraints & Specifications**
- **Caret Constraints**: `^1.0.0` - Compatible version updates
- **Tilde Constraints**: `~1.21.0` - Patch-level updates  
- **Range Constraints**: `>=1.10.0,<2.0.0` - Complex version ranges
- **Exact Versions**: `"1.2.3"` - Pinned versions
- **Multiple Constraints**: Comma-separated version specifications

##### **Scripts, Extras & URLs**
- **Scripts Configuration**: `[tool.poetry.scripts]` with command highlighting
  - Entry point specifications (`package.module:function`)
  - Shell command definitions
- **Extras Configuration**: `[tool.poetry.extras]` for optional dependencies
  - Named extra groups with dependency arrays
  - All/combined extras support
- **URLs Section**: `[tool.poetry.urls]` with link validation
  - Homepage, repository, documentation, bug tracker
  - Custom URL categories with proper escaping

##### **Build System & Tool Integration**
- **Build System**: `[build-system]` section with backend highlighting
  - Poetry-core, setuptools, and custom build backends
  - Requirements arrays with version constraints
- **Tool Configurations**: Enhanced support for tool-specific sections
  - `[tool.black]`, `[tool.isort]`, `[tool.mypy]`, `[tool.pytest.ini_options]`
  - Nested configuration with proper syntax recognition

#### 📁 File Support & Language Features
- **Primary Support**: `pyproject.toml` files with automatic detection
- **Language ID**: `poetry-toml` for VS Code language services integration
- **Language Configuration**: Complete language definition with:
  - Comment support (`#` line comments)
  - Bracket matching and auto-closing pairs
  - Code folding for sections and arrays
  - Word pattern recognition for Poetry-specific terms
  - Indentation rules for TOML structure

#### 🛠️ Technical Implementation
- **TypeScript Architecture**: Robust extension built with TypeScript
- **TextMate Grammar**: Comprehensive `.tmLanguage.json` with repository patterns
- **Performance Optimized**: Efficient handling of large files (1000+ dependencies tested)
- **Error Tolerance**: Graceful handling of malformed TOML syntax
- **VS Code Integration**: Compatible with VS Code 1.102.0 and above
- **Memory Efficient**: Minimal performance impact on editor responsiveness

#### 🧪 Quality Assurance & Testing
- **Comprehensive Test Suite**: 50+ test cases covering all functionality
  - Extension activation and lifecycle tests
  - Grammar pattern validation tests
  - Language configuration and file association tests
  - Integration tests with real-world Poetry projects
  - Performance tests with large configuration files
- **Real-World Testing**: Validated with popular project types:
  - FastAPI and Django web applications
  - Data Science projects (NumPy, Pandas, Jupyter)
  - CLI applications (Click, Typer)
  - Library and package projects
  - Monorepo workspaces with multiple packages

#### 🎯 Developer Experience
- **Immediate Activation**: Extension activates automatically on `pyproject.toml` files
- **Visual Feedback**: Clear syntax coloring for better code readability
- **Navigation Support**: Section folding and symbol recognition
- **Error Prevention**: Syntax highlighting helps identify configuration errors
- **IDE Integration**: Works seamlessly with VS Code's TOML and Python extensions

---

## Release Notes Format

### Types of Changes
- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` in case of vulnerabilities

### Emoji Guide
- 🎉 Major release or significant milestone
- ✨ New features
- 🎨 Improvements to syntax highlighting
- 🐛 Bug fixes
- 📚 Documentation updates
- 🔧 Configuration changes
- ⚡ Performance improvements
- 🛡️ Security fixes
- 🗑️ Deprecations and removals

---

## Contributing

When contributing to this project, please:

1. **Update this changelog** with your changes
2. **Follow the format** established above
3. **Use semantic versioning** for version numbers
4. **Add appropriate emojis** to make entries more readable
5. **Reference issues/PRs** when applicable

### Example Entry Format

```markdown
## [1.1.0] - 2025-08-15

### ✨ Added
- New syntax highlighting for Poetry plugin configurations (#123)
- Support for inline table syntax in dependencies
- Enhanced color scheme for better accessibility

### 🐛 Fixed
- Fixed highlighting issue with complex version constraints (#456)
- Resolved performance issue with large pyproject.toml files

### 📚 Documentation
- Updated README with new examples
- Added troubleshooting section
```

For more information about contributing, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

**[Full Changelog](https://github.com/your-username/poetry-syntax-highlight/blob/main/CHANGELOG.md)**
