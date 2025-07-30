import * as vscode from 'vscode';

/**
 * Test utilities and helper functions
 */
export class TestUtils {

	/**
	 * Create a test document with Poetry TOML content
	 */
	static async createPoetryDocument(content: string): Promise<vscode.TextDocument> {
		return await vscode.workspace.openTextDocument({
			content,
			language: 'poetry-toml'
		});
	}

	/**
	 * Create a pyproject.toml file URI
	 */
	static createPyprojectUri(filename: string = 'pyproject.toml'): vscode.Uri {
		return vscode.Uri.parse(`untitled:${filename}`);
	}

	/**
	 * Wait for extension to activate
	 */
	static async waitForExtensionActivation(extensionId: string, timeout: number = 5000): Promise<vscode.Extension<any> | undefined> {
		const extension = vscode.extensions.getExtension(extensionId);
		if (!extension) {
			return undefined;
		}

		if (extension.isActive) {
			return extension;
		}

		const startTime = Date.now();
		while (!extension.isActive && (Date.now() - startTime) < timeout) {
			await new Promise(resolve => setTimeout(resolve, 100));
		}

		if (!extension.isActive) {
			await extension.activate();
		}

		return extension;
	}

	/**
	 * Clean up test documents
	 */
	static async cleanup(): Promise<void> {
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	}

	/**
	 * Generate a basic Poetry project structure
	 */
	static generateBasicPoetryProject(name: string, version: string = '0.1.0'): string {
		return `[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"

[tool.poetry]
name = "${name}"
version = "${version}"
description = "A sample Poetry project"
authors = ["Test Author <test@example.com>"]
license = "MIT"
readme = "README.md"

[tool.poetry.dependencies]
python = "^3.8"

[tool.poetry.group.dev.dependencies]
pytest = "^7.0.0"
`;
	}

	/**
	 * Generate a complex Poetry project with multiple dependency groups
	 */
	static generateComplexPoetryProject(name: string): string {
		return `[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"

[tool.poetry]
name = "${name}"
version = "1.0.0"
description = "A complex Poetry project for testing"
authors = ["Test Author <test@example.com>"]
maintainers = ["Maintainer <maintainer@example.com>"]
license = "MIT"
readme = "README.md"
homepage = "https://example.com"
repository = "https://github.com/user/repo"
documentation = "https://docs.example.com"
keywords = ["python", "poetry", "testing"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11"
]

[tool.poetry.dependencies]
python = "^3.8"
requests = "^2.31.0"
pydantic = "^2.5.0"
fastapi = {extras = ["all"], version = "^0.104.0"}
sqlalchemy = ">=2.0.0,<3.0.0"
redis = "~5.0.0"

# Git dependencies
git-package = {git = "https://github.com/user/package.git", rev = "main"}

# Path dependencies
local-package = {path = "../local-package", develop = true}

# URL dependencies
url-package = {url = "https://example.com/package.whl"}

# Conditional dependencies
windows-only = {version = "^1.0.0", markers = "sys_platform == 'win32'"}
unix-only = {version = "^1.0.0", markers = "sys_platform != 'win32'"}

# Python version specific
typing-extensions = {version = "^4.8.0", python = "<3.10"}

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

[tool.poetry.group.lint.dependencies]
flake8 = "^6.1.0"
bandit = "^1.7.5"
safety = "^2.3.0"

[tool.poetry.scripts]
main = "${name}.main:main"
dev-server = "${name}.dev:run_server"
migrate = "${name}.db:migrate"
seed = "${name}.db:seed"
test = "pytest"
lint = "flake8 src/"
format = "black src/ && isort src/"
type-check = "mypy src/"

[tool.poetry.extras]
dev = ["pytest", "black", "isort", "mypy"]
test = ["pytest", "factory-boy", "freezegun"]
docs = ["sphinx", "sphinx-rtd-theme", "myst-parser"]
lint = ["flake8", "bandit", "safety"]
all = ["pytest", "black", "isort", "mypy", "sphinx", "flake8"]

[tool.poetry.urls]
"Bug Tracker" = "https://github.com/user/repo/issues"
"Documentation" = "https://docs.example.com"
"Source Code" = "https://github.com/user/repo"
"Changelog" = "https://github.com/user/repo/blob/main/CHANGELOG.md"

[tool.black]
line-length = 88
target-version = ['py38']
include = '\\.pyi?$'

[tool.isort]
profile = "black"
multi_line_output = 3

[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true

[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py", "*_test.py"]
addopts = [
    "--strict-markers",
    "--strict-config",
    "--cov=src",
    "--cov-report=term-missing"
]
`;
	}

	/**
	 * Generate Poetry project with syntax errors for testing error handling
	 */
	static generateMalformedPoetryProject(): string {
		return `[tool.poetry
name = "malformed-project"
version = 0.1.0
description = "A project with syntax errors"

[tool.poetry.dependencies
python = "^3.8
requests = "^2.28.0"
missing-quote = ^1.0.0

[tool.poetry.group.dev.dependencies]
pytest = "^7.0.0
`;
	}

	/**
	 * Generate a performance test project with many dependencies
	 */
	static generateLargePoetryProject(name: string, dependencyCount: number = 100): string {
		let content = `[tool.poetry]
name = "${name}"
version = "1.0.0"
description = "A large project for performance testing"

[tool.poetry.dependencies]
python = "^3.8"
`;

		// Add many dependencies
		for (let i = 0; i < dependencyCount; i++) {
			content += `package-${i} = "^${1 + (i % 5)}.${i % 10}.0"\n`;
		}

		// Add development dependencies
		content += '\n[tool.poetry.group.dev.dependencies]\n';
		for (let i = 0; i < Math.floor(dependencyCount / 2); i++) {
			content += `dev-package-${i} = "^${2 + (i % 3)}.${i % 10}.0"\n`;
		}

		return content;
	}

	/**
	 * Measure execution time of a function
	 */
	static async measureTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
		const startTime = Date.now();
		const result = await fn();
		const duration = Date.now() - startTime;
		return { result, duration };
	}

	/**
	 * Assert that execution time is within acceptable limits
	 */
	static assertPerformance(duration: number, maxDuration: number, operation: string): void {
		if (duration > maxDuration) {
			throw new Error(`${operation} took ${duration}ms, expected less than ${maxDuration}ms`);
		}
	}

	/**
	 * Get list of available languages in VS Code
	 */
	static async getAvailableLanguages(): Promise<string[]> {
		return await vscode.languages.getLanguages();
	}

	/**
	 * Check if a language is registered
	 */
	static async isLanguageRegistered(languageId: string): Promise<boolean> {
		const languages = await TestUtils.getAvailableLanguages();
		return languages.includes(languageId);
	}

	/**
	 * Get extension by ID
	 */
	static getExtension(extensionId: string): vscode.Extension<any> | undefined {
		return vscode.extensions.getExtension(extensionId);
	}

	/**
	 * Execute a VS Code command and return the result
	 */
	static async executeCommand<T = any>(command: string, ...args: any[]): Promise<T> {
		return await vscode.commands.executeCommand<T>(command, ...args);
	}

	/**
	 * Create multiple test documents for batch testing
	 */
	static async createMultipleDocuments(contents: string[]): Promise<vscode.TextDocument[]> {
		const documents: vscode.TextDocument[] = [];

		for (const content of contents) {
			const document = await TestUtils.createPoetryDocument(content);
			documents.push(document);
		}

		return documents;
	}

	/**
	 * Validate that a document contains specific Poetry sections
	 */
	static validatePoetryDocument(document: vscode.TextDocument, expectedSections: string[]): void {
		const content = document.getText();

		for (const section of expectedSections) {
			if (!content.includes(section)) {
				throw new Error(`Document should contain section: ${section}`);
			}
		}
	}

	/**
	 * Generate Poetry URL section with various link types
	 */
	static generateUrlSection(): string {
		return `[tool.poetry.urls]
"Homepage" = "https://example.com"
"Repository" = "https://github.com/user/repo"
"Documentation" = "https://docs.example.com"
"Bug Tracker" = "https://github.com/user/repo/issues"
"Changelog" = "https://github.com/user/repo/blob/main/CHANGELOG.md"
"Funding" = "https://github.com/sponsors/user"
"Discussion" = "https://github.com/user/repo/discussions"
`;
	}

	/**
	 * Generate Poetry build system configuration
	 */
	static generateBuildSystem(backend: string = 'poetry.core.masonry.api'): string {
		return `[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "${backend}"
`;
	}
}

/**
 * Constants for testing
 */
export const TEST_CONSTANTS = {
	EXTENSION_ID: 'jarbasgouveia.poetry-syntax-highlight',
	LANGUAGE_ID: 'poetry-toml',
	PYPROJECT_FILENAME: 'pyproject.toml',
	DEFAULT_TIMEOUT: 5000,
	PERFORMANCE_TIMEOUT: 2000
};

/**
 * Common test assertions
 */
export class TestAssertions {

	static assertExtensionExists(): vscode.Extension<any> {
		const extension = TestUtils.getExtension(TEST_CONSTANTS.EXTENSION_ID);
		if (!extension) {
			throw new Error(`Extension ${TEST_CONSTANTS.EXTENSION_ID} should be installed`);
		}
		return extension;
	}

	static async assertExtensionActive(): Promise<vscode.Extension<any>> {
		const extension = TestAssertions.assertExtensionExists();

		if (!extension.isActive) {
			await extension.activate();
		}

		if (!extension.isActive) {
			throw new Error(`Extension ${TEST_CONSTANTS.EXTENSION_ID} should be active`);
		}

		return extension;
	}

	static assertDocumentLanguage(document: vscode.TextDocument, expectedLanguage: string = TEST_CONSTANTS.LANGUAGE_ID): void {
		if (document.languageId !== expectedLanguage) {
			throw new Error(`Document language should be ${expectedLanguage}, got ${document.languageId}`);
		}
	}

	static assertDocumentContent(document: vscode.TextDocument, expectedContent: string): void {
		if (!document.getText().includes(expectedContent)) {
			throw new Error(`Document should contain: ${expectedContent}`);
		}
	}

	static async assertLanguageRegistered(languageId: string = TEST_CONSTANTS.LANGUAGE_ID): Promise<void> {
		const isRegistered = await TestUtils.isLanguageRegistered(languageId);
		if (!isRegistered) {
			throw new Error(`Language ${languageId} should be registered`);
		}
	}

	static assertPerformance(duration: number, maxDuration: number, operation: string): void {
		if (duration > maxDuration) {
			throw new Error(`${operation} took ${duration}ms, should be less than ${maxDuration}ms`);
		}
	}
}
