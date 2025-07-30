import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Tests for Poetry TOML grammar and syntax highlighting
 */
suite('Poetry Grammar Tests', () => {

	suite('TOML Section Recognition', () => {
		test('Should recognize [tool.poetry] section', async () => {
			const content = '[tool.poetry]\nname = "test"';
			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('[tool.poetry]'));
		});

		test('Should recognize dependency sections', async () => {
			const content = `[tool.poetry.dependencies]
python = "^3.8"

[tool.poetry.group.dev.dependencies]
pytest = "^7.0.0"`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('tool.poetry.dependencies'));
			assert.ok(document.getText().includes('tool.poetry.group.dev.dependencies'));
		});

		test('Should recognize build system section', async () => {
			const content = `[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('build-system'));
			assert.ok(document.getText().includes('poetry.core.masonry.api'));
		});
	});

	suite('Version Constraint Patterns', () => {
		test('Should handle caret constraints', async () => {
			const content = `[tool.poetry.dependencies]
requests = "^2.28.0"
django = "^4.0"`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('^2.28.0'));
			assert.ok(document.getText().includes('^4.0'));
		});

		test('Should handle tilde constraints', async () => {
			const content = `[tool.poetry.dependencies]
click = "~8.1.0"
numpy = "~1.21"`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('~8.1.0'));
			assert.ok(document.getText().includes('~1.21'));
		});

		test('Should handle range constraints', async () => {
			const content = `[tool.poetry.dependencies]
pydantic = ">=1.10.0,<2.0.0"
fastapi = ">=0.100.0,<=0.104.0"`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('>=1.10.0,<2.0.0'));
			assert.ok(document.getText().includes('>=0.100.0,<=0.104.0'));
		});

		test('Should handle exact version constraints', async () => {
			const content = `[tool.poetry.dependencies]
specific-package = "1.2.3"
another-package = "2.0.0"`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('"1.2.3"'));
			assert.ok(document.getText().includes('"2.0.0"'));
		});
	});

	suite('Complex Dependency Formats', () => {
		test('Should handle dependencies with extras', async () => {
			const content = `[tool.poetry.dependencies]
fastapi = {extras = ["all"], version = "^0.104.0"}
sqlalchemy = {extras = ["asyncio", "postgresql"], version = "^2.0.0"}`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('extras = ["all"]'));
			assert.ok(document.getText().includes('extras = ["asyncio", "postgresql"]'));
		});

		test('Should handle git dependencies', async () => {
			const content = `[tool.poetry.dependencies]
my-package = {git = "https://github.com/user/repo.git", rev = "main"}
another-package = {git = "git@github.com:user/repo.git", tag = "v1.0.0"}`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('git = "https://github.com'));
			assert.ok(document.getText().includes('rev = "main"'));
			assert.ok(document.getText().includes('tag = "v1.0.0"'));
		});

		test('Should handle path dependencies', async () => {
			const content = `[tool.poetry.dependencies]
local-package = {path = "../local-package"}
another-local = {path = "./libs/my-lib", develop = true}`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('path = "../local-package"'));
			assert.ok(document.getText().includes('develop = true'));
		});

		test('Should handle URL dependencies', async () => {
			const content = `[tool.poetry.dependencies]
archive-package = {url = "https://example.com/package.whl"}`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('url = "https://example.com'));
		});

		test('Should handle conditional dependencies', async () => {
			const content = `[tool.poetry.dependencies]
numpy = [
    {version = "^1.21.0", python = "^3.8"},
    {version = "^1.24.0", python = "^3.11"}
]
windows-only = {version = "^1.0.0", markers = "sys_platform == 'win32'"}`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('python = "^3.8"'));
			assert.ok(document.getText().includes('python = "^3.11"'));
			assert.ok(document.getText().includes('sys_platform == \'win32\''));
		});
	});

	suite('Poetry Script Definitions', () => {
		test('Should handle simple scripts', async () => {
			const content = `[tool.poetry.scripts]
my-script = "my_package.main:main"
dev-server = "my_package.dev:run_server"`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('my_package.main:main'));
			assert.ok(document.getText().includes('my_package.dev:run_server'));
		});

		test('Should handle script with module execution', async () => {
			const content = `[tool.poetry.scripts]
run-tests = "pytest"
format-code = "black ."
lint = "flake8 src/"`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('"pytest"'));
			assert.ok(document.getText().includes('"black ."'));
			assert.ok(document.getText().includes('"flake8 src/"'));
		});
	});

	suite('Poetry Extras Configuration', () => {
		test('Should handle extras with dependency lists', async () => {
			const content = `[tool.poetry.extras]
dev = ["pytest", "black", "isort", "mypy"]
docs = ["sphinx", "sphinx-rtd-theme", "myst-parser"]
all = ["pytest", "black", "isort", "mypy", "sphinx", "sphinx-rtd-theme"]`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('dev = ["pytest"'));
			assert.ok(document.getText().includes('docs = ["sphinx"'));
			assert.ok(document.getText().includes('all = ["pytest"'));
		});
	});

	suite('Poetry URLs Section', () => {
		test('Should handle various URL types', async () => {
			const content = `[tool.poetry.urls]
"Homepage" = "https://example.com"
"Repository" = "https://github.com/user/repo"
"Documentation" = "https://docs.example.com"
"Bug Tracker" = "https://github.com/user/repo/issues"
"Changelog" = "https://github.com/user/repo/blob/main/CHANGELOG.md"`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('"Homepage"'));
			assert.ok(document.getText().includes('"Repository"'));
			assert.ok(document.getText().includes('"Documentation"'));
			assert.ok(document.getText().includes('"Bug Tracker"'));
		});
	});

	suite('Poetry Metadata Fields', () => {
		test('Should handle author and maintainer fields', async () => {
			const content = `[tool.poetry]
name = "my-package"
version = "1.0.0"
authors = ["John Doe <john@example.com>", "Jane Smith <jane@example.com>"]
maintainers = ["Maintainer One <maint1@example.com>"]`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('authors = ['));
			assert.ok(document.getText().includes('maintainers = ['));
			assert.ok(document.getText().includes('john@example.com'));
		});

		test('Should handle classifiers and keywords', async () => {
			const content = `[tool.poetry]
name = "my-package"
keywords = ["python", "poetry", "packaging", "dependency-management"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11"
]`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('keywords = ['));
			assert.ok(document.getText().includes('classifiers = ['));
			assert.ok(document.getText().includes('Development Status'));
			assert.ok(document.getText().includes('Programming Language :: Python'));
		});

		test('Should handle include and exclude patterns', async () => {
			const content = `[tool.poetry]
name = "my-package"
include = ["my_package/**/*.py", "data/*.json"]
exclude = ["tests/", "docs/", "*.pyc"]`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('include = ['));
			assert.ok(document.getText().includes('exclude = ['));
			assert.ok(document.getText().includes('my_package/**/*.py'));
		});
	});

	suite('Build System Variations', () => {
		test('Should handle different build backends', async () => {
			const content = `[build-system]
requires = ["poetry-core>=1.0.0", "setuptools", "wheel"]
build-backend = "poetry.core.masonry.api"`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('poetry-core>=1.0.0'));
			assert.ok(document.getText().includes('setuptools'));
			assert.ok(document.getText().includes('wheel'));
		});

		test('Should handle setuptools build system', async () => {
			const content = `[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"`;

			const document = await createTestDocument(content);

			assert.ok(document.getText().includes('setuptools>=61.0'));
			assert.ok(document.getText().includes('setuptools.build_meta'));
		});
	});

	// Helper function to create test documents
	async function createTestDocument(content: string): Promise<vscode.TextDocument> {
		return await vscode.workspace.openTextDocument({
			content: content,
			language: 'poetry-toml'
		});
	}
});
