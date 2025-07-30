# Poetry Syntax Highlight

<div align="center">

[![Version](https://img.shields.io/visual-studio-marketplace/v/jarbas-gouveia.poetry-syntax-highlight)](https://marketplace.visualstudio.com/items?itemName=jarbas-gouveia.poetry-syntax-highlight)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/jarbas-gouveia.poetry-syntax-highlight)](https://marketplace.visualstudio.com/items?itemName=jarbas-gouveia.poetry-syntax-highlight)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/jarbas-gouveia.poetry-syntax-highlight)](https://marketplace.visualstudio.com/items?itemName=jarbas-gouveia.poetry-syntax-highlight)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Enhanced syntax highlighting for Poetry `pyproject.toml` files in Visual Studio Code**

[Installation](#installation) • [Features](#features) • [Usage](#usage) • [Contributing](#contributing) • [Changelog](#changelog)

</div>

---

## 🚀 Overview

Poetry Syntax Highlight is a Visual Studio Code extension designed to provide rich syntax highlighting and improved readability for Poetry project configuration files (`pyproject.toml`). This extension enhances your development experience by making Poetry configurations more visually appealing and easier to navigate.

Poetry is the modern dependency management and packaging tool for Python projects, and this extension ensures that your `pyproject.toml` files are properly highlighted with accurate syntax coloring, making it easier to work with complex Poetry configurations.

## ✨ Features

- **🎨 Enhanced Syntax Highlighting**: Rich color coding for Poetry-specific TOML sections and syntax elements
- **📝 Poetry-Aware Language Support**: Custom language definition (`poetry-toml`) with intelligent recognition of Poetry configuration blocks
- **🔍 Improved Readability**: Better visual distinction between different configuration sections with specialized highlighting
- **⚡ Zero Configuration**: Works out of the box with any `pyproject.toml` file - automatic file association
- **🎯 Focused on Poetry**: Optimized specifically for Poetry project structures and conventions
- **🚀 Performance Optimized**: Efficiently handles large `pyproject.toml` files with hundreds of dependencies

### Comprehensive Syntax Highlighting

#### **Poetry Sections**

- **Project Metadata**: `[tool.poetry]` with highlighting for name, version, description, authors, etc.
- **Dependencies**: `[tool.poetry.dependencies]` with special highlighting for Python and package dependencies
- **Dependency Groups**: `[tool.poetry.group.<name>.dependencies]` for dev, test, docs, and custom groups
- **Scripts**: `[tool.poetry.scripts]` with command highlighting
- **Extras**: `[tool.poetry.extras]` for optional dependency groups
- **URLs**: `[tool.poetry.urls]` for project links and references

#### **Version Constraints & Dependency Formats**

- **Caret Constraints**: `^2.28.0` - Compatible version updates
- **Tilde Constraints**: `~1.21.0` - Patch-level updates
- **Range Constraints**: `>=1.10.0,<2.0.0` - Version ranges
- **Exact Versions**: `"1.2.3"` - Pinned versions
- **Complex Dependencies**: Support for extras, git, path, and URL dependencies
- **Conditional Dependencies**: Platform and Python version specific dependencies

#### **Advanced Dependency Types**

- **Git Dependencies**: `{git = "https://github.com/user/repo.git", rev = "main"}`
- **Path Dependencies**: `{path = "../local-package", develop = true}`
- **URL Dependencies**: `{url = "https://example.com/package.whl"}`
- **Dependencies with Extras**: `{extras = ["all"], version = "^0.104.0"}`
- **Conditional Dependencies**: `{version = "^1.0.0", markers = "sys_platform == 'win32'"}`

#### **Build System Support**

- **Build System**: `[build-system]` section highlighting
- **Requirements**: Poetry-core, setuptools, and other build backends
- **Backend Configuration**: Proper highlighting for build-backend specifications

#### **Tool Configuration**

- **Poetry Tools**: Enhanced highlighting for Poetry-specific tool configurations
- **Third-party Tools**: Support for `[tool.black]`, `[tool.isort]`, `[tool.mypy]`, etc.
- **Nested Configurations**: Proper handling of complex nested tool settings

### Language Features

- **File Association**: Automatic recognition of `pyproject.toml` files
- **Custom Language ID**: `poetry-toml` for enhanced tooling integration
- **Comment Support**: Proper highlighting for TOML comments (`#`)
- **Bracket Matching**: Auto-closing pairs for brackets, quotes, and parentheses
- **Code Folding**: Collapsible sections for better navigation
- **Error Tolerance**: Graceful handling of malformed TOML syntax

## 📦 Installation

### From VS Code Marketplace

1. Open Visual Studio Code
2. Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X`)
3. Search for "Poetry Syntax Highlight"
4. Click **Install**

### From Command Line

```bash
code --install-extension jarbas-gouveia.poetry-syntax-highlight
```

### Manual Installation

1. Download the `.vsix` file from the [releases page](https://github.com/jjgouveia/poetry-syntax-highlight/releases)
2. Open VS Code
3. Go to Extensions view
4. Click the `...` menu and select "Install from VSIX..."
5. Select the downloaded file

## 🛠️ Usage

The extension automatically activates when you open a `pyproject.toml` file. No additional configuration is required.

### Supported Files

- `pyproject.toml` (Poetry configuration files)
- Files with `.toml` extension containing Poetry sections

### Comprehensive Example

```toml
[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"

[tool.poetry]
name = "my-awesome-project"
version = "1.0.0"
description = "An awesome Python project with comprehensive configuration"
authors = ["Developer <dev@example.com>"]
maintainers = ["Maintainer <maintainer@example.com>"]
license = "MIT"
readme = "README.md"
homepage = "https://example.com"
repository = "https://github.com/user/repo"
documentation = "https://docs.example.com"
keywords = ["python", "poetry", "package"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
]

[tool.poetry.dependencies]
python = "^3.8"
# Basic dependencies with version constraints
requests = "^2.31.0"
pydantic = ">=2.0.0,<3.0.0"
click = "~8.1.0"

# Dependencies with extras
fastapi = {extras = ["all"], version = "^0.104.0"}
sqlalchemy = {extras = ["asyncio", "postgresql"], version = "^2.0.0"}

# Git dependencies
my-git-package = {git = "https://github.com/user/package.git", rev = "main"}

# Path dependencies
local-package = {path = "../local-package", develop = true}

# URL dependencies
wheel-package = {url = "https://example.com/package.whl"}

# Conditional dependencies
windows-only = {version = "^1.0.0", markers = "sys_platform == 'win32'"}
python-specific = {version = "^2.0.0", python = ">=3.9"}

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.21.0"
pytest-cov = "^4.1.0"
black = "^23.0.0"
isort = "^5.12.0"
mypy = "^1.7.0"
pre-commit = "^3.5.0"

[tool.poetry.group.test.dependencies]
factory-boy = "^3.3.0"
freezegun = "^1.2.2"
httpx = "^0.25.0"

[tool.poetry.group.docs.dependencies]
sphinx = "^7.2.0"
sphinx-rtd-theme = "^1.3.0"
myst-parser = "^2.0.0"

[tool.poetry.scripts]
main = "my_project.main:main"
dev-server = "my_project.dev:run_server"
migrate = "my_project.db:migrate"
test = "pytest"
lint = "black . && isort . && mypy ."

[tool.poetry.extras]
dev = ["pytest", "black", "isort", "mypy"]
test = ["pytest", "factory-boy", "freezegun"]
docs = ["sphinx", "sphinx-rtd-theme", "myst-parser"]
all = ["pytest", "black", "sphinx", "factory-boy"]

[tool.poetry.urls]
"Bug Tracker" = "https://github.com/user/repo/issues"
"Documentation" = "https://docs.example.com"
"Source Code" = "https://github.com/user/repo"
"Changelog" = "https://github.com/user/repo/blob/main/CHANGELOG.md"

# Tool configurations with enhanced highlighting
[tool.black]
line-length = 88
target-version = ['py38']
include = '\.pyi?$'

[tool.isort]
profile = "black"
multi_line_output = 3

[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true
```

### Real-World Project Examples

The extension works seamlessly with various types of Poetry projects:

- **Web Applications** (FastAPI, Django, Flask)
- **Data Science Projects** (NumPy, Pandas, Jupyter)
- **CLI Applications** (Click, Typer)
- **Libraries and Packages**
- **Monorepo Workspaces**

## ⚙️ Configuration

This extension works out of the box and doesn't require any configuration. The syntax highlighting is automatically applied to all `pyproject.toml` files.

### Language Features

- **Language ID**: Files are automatically assigned the `poetry-toml` language
- **File Association**: `pyproject.toml` files are automatically recognized
- **Syntax Highlighting**: Enhanced colors for Poetry-specific sections
- **Code Folding**: Collapse sections for better navigation
- **Auto-closing**: Brackets, quotes, and parentheses are automatically closed

## 🐛 Known Issues

Currently, there are no known issues. If you encounter any problems, please [open an issue](https://github.com/jjgouveia/poetry-syntax-highlight/issues) on our GitHub repository.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Clone the repository
2. Run `npm install` to install dependencies
3. Open the project in VS Code
4. Press `F5` to launch a new Extension Development Host window
5. Open a `pyproject.toml` file to test the syntax highlighting

## 📝 Changelog

### 0.0.1 (Initial Release)

- ✨ Initial release with basic Poetry syntax highlighting
- 🎨 Support for `pyproject.toml` files
- 📦 Poetry-specific TOML grammar definitions

For detailed changelog, see [CHANGELOG.md](CHANGELOG.md).

## 📄 License

This extension is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Poetry](https://python-poetry.org/) - The inspiration for this extension
- [VS Code Team](https://code.visualstudio.com/) - For the excellent extensibility platform
- [TextMate Grammar](https://macromates.com/manual/en/language_grammars) - For the syntax highlighting foundation

---

<div align="center">

**Made with ❤️ for the Python community**

[Report Bug](https://github.com/jjgouveia/poetry-syntax-highlight/issues) • [Request Feature](https://github.com/jjgouveia/poetry-syntax-highlight/issues) • [Contribute](https://github.com/jjgouveia/poetry-syntax-highlight/pulls)

</div>
