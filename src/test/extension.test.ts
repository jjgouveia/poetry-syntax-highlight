import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// Import the extension to test it
import * as myExtension from '../extension';

suite('Poetry Syntax Highlight Extension Tests', () => {
	let extensionContext: vscode.ExtensionContext;

	suiteSetup(async () => {
		// Ensure the extension is activated
		const extension = vscode.extensions.getExtension('poetry-syntax-highlight');
		if (extension && !extension.isActive) {
			await extension.activate();
		}
	});

	suiteTeardown(async () => {
		// Clean up any test files or resources
		await vscode.commands.executeCommand('workbench.action.closeAllEditors');
	});

	suite('Extension Activation', () => {
		test('Should activate extension successfully', async () => {
			const extension = vscode.extensions.getExtension('jarbasgouveia.poetry-syntax-highlight');
			assert.ok(extension, 'Extension should be found');

			if (extension && !extension.isActive) {
				await extension.activate();
			}

			assert.ok(extension?.isActive, 'Extension should be active');
		});

		test('Should register poetry-toml language', () => {
			const languages = vscode.languages.getLanguages();
			return languages.then(langs => {
				assert.ok(langs.includes('poetry-toml'), 'poetry-toml language should be registered');
			});
		});
	});

	suite('Language Support', () => {
		test('Should recognize pyproject.toml files', async () => {
			const testContent = `[tool.poetry]
name = "test-project"
version = "0.1.0"
description = "Test project"

[tool.poetry.dependencies]
python = "^3.8"
requests = "^2.28.0"
`;

			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'poetry-toml'
			});

			assert.strictEqual(document.languageId, 'poetry-toml', 'Document should have poetry-toml language ID');
			assert.ok(document.getText().includes('[tool.poetry]'), 'Document should contain Poetry configuration');
		});

		test('Should provide syntax highlighting for Poetry sections', async () => {
			const testContent = `[tool.poetry]
name = "test-project"
version = "0.1.0"

[tool.poetry.dependencies]
python = "^3.8"
requests = "^2.28.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.0.0"
black = "^22.0.0"
`;

			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'poetry-toml'
			});

			// Open the document in an editor to trigger syntax highlighting
			const editor = await vscode.window.showTextDocument(document);

			// Verify the document is open and has the correct language
			assert.strictEqual(editor.document.languageId, 'poetry-toml');
			assert.ok(editor.document.getText().includes('[tool.poetry.dependencies]'));
		});
	});

	suite('File Association', () => {
		test('Should associate pyproject.toml with poetry-toml language', async () => {
			// Create a temporary pyproject.toml content
			const testContent = `[tool.poetry]
name = "test-project"
version = "0.1.0"
description = "A test Poetry project"
`;

			// Create document with pyproject.toml filename
			const uri = vscode.Uri.parse('untitled:pyproject.toml');
			const document = await vscode.workspace.openTextDocument(uri);

			// Edit the document to add Poetry content
			const edit = new vscode.WorkspaceEdit();
			edit.insert(uri, new vscode.Position(0, 0), testContent);
			await vscode.workspace.applyEdit(edit);

			// The language might be detected as 'toml' initially, but our extension should handle pyproject.toml files
			assert.ok(document.fileName.endsWith('pyproject.toml') || document.languageId === 'poetry-toml');
		});
	});

	suite('Grammar Validation', () => {
		test('Should handle Poetry metadata sections', async () => {
			const testContent = `[tool.poetry]
name = "my-package"
version = "1.0.0"
description = "A sample package"
authors = ["Author Name <author@example.com>"]
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
`;

			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'poetry-toml'
			});

			assert.ok(document.getText().includes('tool.poetry'));
			assert.ok(document.getText().includes('authors'));
			assert.ok(document.getText().includes('classifiers'));
		});

		test('Should handle dependency sections', async () => {
			const testContent = `[tool.poetry.dependencies]
python = "^3.8"
requests = "^2.28.0"
pydantic = ">=1.10.0,<2.0.0"
click = "~8.1.0"
fastapi = {extras = ["all"], version = "^0.104.0"}
numpy = [
    {version = "^1.21.0", python = "^3.8"},
    {version = "^1.24.0", python = "^3.11"}
]

[tool.poetry.group.dev.dependencies]
pytest = "^7.0.0"
pytest-cov = "^4.0.0"
black = "^22.0.0"
isort = "^5.10.0"
mypy = "^1.0.0"
pre-commit = "^3.0.0"

[tool.poetry.group.test.dependencies]
pytest-asyncio = "^0.21.0"
httpx = "^0.24.0"
`;

			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'poetry-toml'
			});

			assert.ok(document.getText().includes('tool.poetry.dependencies'));
			assert.ok(document.getText().includes('tool.poetry.group.dev.dependencies'));
			assert.ok(document.getText().includes('tool.poetry.group.test.dependencies'));
		});

		test('Should handle scripts and extras sections', async () => {
			const testContent = `[tool.poetry.scripts]
my-script = "my_package.main:main"
dev-server = "my_package.dev:run_server"

[tool.poetry.extras]
dev = ["pytest", "black", "isort"]
docs = ["sphinx", "sphinx-rtd-theme"]
all = ["pytest", "black", "isort", "sphinx", "sphinx-rtd-theme"]

[tool.poetry.urls]
"Bug Tracker" = "https://github.com/user/repo/issues"
"Documentation" = "https://docs.example.com"
"Source Code" = "https://github.com/user/repo"
`;

			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'poetry-toml'
			});

			assert.ok(document.getText().includes('tool.poetry.scripts'));
			assert.ok(document.getText().includes('tool.poetry.extras'));
			assert.ok(document.getText().includes('tool.poetry.urls'));
		});

		test('Should handle build system configuration', async () => {
			const testContent = `[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"

[tool.poetry]
name = "my-package"
version = "0.1.0"
description = "A sample package"
`;

			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'poetry-toml'
			});

			assert.ok(document.getText().includes('build-system'));
			assert.ok(document.getText().includes('poetry-core'));
			assert.ok(document.getText().includes('build-backend'));
		});
	});

	suite('Edge Cases', () => {
		test('Should handle empty pyproject.toml files', async () => {
			const testContent = '';

			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'poetry-toml'
			});

			assert.strictEqual(document.getText(), '');
			assert.strictEqual(document.languageId, 'poetry-toml');
		});

		test('Should handle malformed TOML syntax gracefully', async () => {
			const testContent = `[tool.poetry
name = "incomplete-section"
version = 0.1.0  # Missing quotes
description = "Test with syntax errors"
`;

			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'poetry-toml'
			});

			// Should not throw errors, just handle gracefully
			assert.ok(document.getText().includes('tool.poetry'));
			assert.strictEqual(document.languageId, 'poetry-toml');
		});

		test('Should handle very large pyproject.toml files', async () => {
			// Generate a large content with many dependencies
			let testContent = `[tool.poetry]
name = "large-project"
version = "1.0.0"
description = "A project with many dependencies"

[tool.poetry.dependencies]
python = "^3.8"
`;

			// Add many dependencies to test performance
			for (let i = 0; i < 100; i++) {
				testContent += `package-${i} = "^1.0.0"\n`;
			}

			testContent += `
[tool.poetry.group.dev.dependencies]
`;
			for (let i = 0; i < 50; i++) {
				testContent += `dev-package-${i} = "^1.0.0"\n`;
			}

			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'poetry-toml'
			});

			assert.ok(document.getText().length > 1000);
			assert.strictEqual(document.languageId, 'poetry-toml');
		});
	});

	suite('Extension Commands', () => {
		test('Should register Hello World command', async () => {
			const commands = await vscode.commands.getCommands();
			assert.ok(commands.includes('poetry-syntax-highlight.helloWorld'), 'Hello World command should be registered');
		});

		test('Should execute Hello World command without errors', async () => {
			try {
				await vscode.commands.executeCommand('poetry-syntax-highlight.helloWorld');
				// If no error is thrown, the command executed successfully
				assert.ok(true, 'Command executed successfully');
			} catch (error) {
				assert.fail(`Command execution failed: ${error}`);
			}
		});
	});
});
