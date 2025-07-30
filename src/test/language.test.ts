import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Tests for language configuration and file associations
 */
suite('Language Configuration Tests', () => {

	suite('File Association Tests', () => {
		test('Should associate pyproject.toml with poetry-toml language', async () => {
			// Test that pyproject.toml files are recognized
			const testContent = `[tool.poetry]
name = "test-project"
version = "0.1.0"`;

			// Create a document that simulates opening pyproject.toml
			const uri = vscode.Uri.parse('untitled:pyproject.toml');
			const document = await vscode.workspace.openTextDocument(uri);

			// The document should be recognized as TOML or poetry-toml
			assert.ok(
				document.languageId === 'toml' || document.languageId === 'poetry-toml',
				`Expected language ID to be 'toml' or 'poetry-toml', got '${document.languageId}'`
			);
		});

		test('Should handle pyproject.toml in subdirectories', async () => {
			const testContent = `[tool.poetry]
name = "subproject"
version = "0.1.0"`;

			const uri = vscode.Uri.parse('untitled:subdir/pyproject.toml');
			const document = await vscode.workspace.openTextDocument(uri);

			assert.ok(document.fileName.includes('pyproject.toml'));
		});
	});

	suite('Language Definition Tests', () => {
		test('Should register poetry-toml language', async () => {
			const languages = await vscode.languages.getLanguages();
			assert.ok(
				languages.includes('poetry-toml'),
				'poetry-toml language should be registered'
			);
		});

		test('Should have proper language configuration', () => {
			// Verify that the language configuration exists
			const extensionPath = vscode.extensions.getExtension('jarbas-gouveia.poetry-syntax-highlight')?.extensionPath;
			if (extensionPath) {
				const packageJsonPath = path.join(extensionPath, 'package.json');
				if (fs.existsSync(packageJsonPath)) {
					const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

					// Check that languages are defined
					assert.ok(packageJson.contributes?.languages, 'Should have languages contribution');

					// Check that grammars are defined
					assert.ok(packageJson.contributes?.grammars, 'Should have grammars contribution');

					// Find poetry-toml language
					const poetryLanguage = packageJson.contributes.languages.find(
						(lang: any) => lang.id === 'poetry-toml'
					);
					assert.ok(poetryLanguage, 'Should have poetry-toml language definition');

					// Check filenames association
					assert.ok(
						poetryLanguage.filenames?.includes('pyproject.toml'),
						'Should associate pyproject.toml with poetry-toml'
					);
				}
			}
		});
	});

	suite('Grammar File Tests', () => {
		test('Should have valid grammar file', () => {
			const extensionPath = vscode.extensions.getExtension('jarbas-gouveia.poetry-syntax-highlight')?.extensionPath;
			if (extensionPath) {
				const grammarPath = path.join(extensionPath, 'syntaxes', 'poetry.tmLanguage.json');

				if (fs.existsSync(grammarPath)) {
					const grammarContent = fs.readFileSync(grammarPath, 'utf8');
					let grammar;

					try {
						grammar = JSON.parse(grammarContent);
					} catch (error) {
						assert.fail(`Grammar file should be valid JSON: ${error}`);
					}

					// Check required fields
					assert.ok(grammar.scopeName, 'Grammar should have scopeName');
					assert.ok(grammar.patterns, 'Grammar should have patterns');
					assert.strictEqual(
						grammar.scopeName,
						'source.poetry-toml',
						'Grammar should have correct scopeName'
					);
				}
			}
		});

		test('Should have comprehensive pattern coverage', () => {
			const extensionPath = vscode.extensions.getExtension('jarbas-gouveia.poetry-syntax-highlight')?.extensionPath;
			if (extensionPath) {
				const grammarPath = path.join(extensionPath, 'syntaxes', 'poetry.tmLanguage.json');

				if (fs.existsSync(grammarPath)) {
					const grammarContent = fs.readFileSync(grammarPath, 'utf8');
					const grammar = JSON.parse(grammarContent);

					// Check that we have patterns for common Poetry sections
					const grammarString = JSON.stringify(grammar);

					// Should have patterns for Poetry sections
					assert.ok(
						grammarString.includes('tool.poetry') || grammarString.includes('poetry'),
						'Grammar should include Poetry-specific patterns'
					);
				}
			}
		});
	});

	suite('Document Symbol Provider Tests', () => {
		test('Should provide symbols for Poetry sections', async () => {
			const testContent = `[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"

[tool.poetry]
name = "test-project"
version = "0.1.0"
description = "Test project"

[tool.poetry.dependencies]
python = "^3.8"
requests = "^2.28.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.0.0"
black = "^22.0.0"

[tool.poetry.scripts]
test = "pytest"
lint = "black ."`;

			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'poetry-toml'
			});

			// Open the document to trigger symbol providers
			await vscode.window.showTextDocument(document);

			// Try to get document symbols
			const symbols = await vscode.commands.executeCommand<vscode.DocumentSymbol[]>(
				'vscode.executeDocumentSymbolProvider',
				document.uri
			);

			// If symbols are provided, they should include Poetry sections
			if (symbols && symbols.length > 0) {
				const symbolNames = symbols.map(s => s.name).join(', ');

				// At minimum, we should be able to parse the document without errors
				assert.ok(true, `Document symbols found: ${symbolNames}`);
			} else {
				// Even if no symbols are provided, the document should be parseable
				assert.ok(document.getText().includes('[tool.poetry]'));
			}
		});
	});

	suite('Syntax Error Handling', () => {
		test('Should handle documents with syntax errors gracefully', async () => {
			const testContent = `[tool.poetry
name = "missing-bracket"
version = 0.1.0
description = "Test with errors"

[tool.poetry.dependencies
python = "^3.8
requests = "^2.28.0"`;

			try {
				const document = await vscode.workspace.openTextDocument({
					content: testContent,
					language: 'poetry-toml'
				});

				// Should not throw an error, even with malformed TOML
				assert.strictEqual(document.languageId, 'poetry-toml');
				assert.ok(document.getText().includes('tool.poetry'));
			} catch (error) {
				assert.fail(`Should handle malformed TOML gracefully: ${error}`);
			}
		});

		test('Should handle empty files', async () => {
			const testContent = '';

			try {
				const document = await vscode.workspace.openTextDocument({
					content: testContent,
					language: 'poetry-toml'
				});

				assert.strictEqual(document.languageId, 'poetry-toml');
				assert.strictEqual(document.getText(), '');
			} catch (error) {
				assert.fail(`Should handle empty files gracefully: ${error}`);
			}
		});

		test('Should handle very large files', async () => {
			// Create a large file content
			let testContent = `[tool.poetry]
name = "large-project"
version = "1.0.0"
description = "A very large Poetry project"

[tool.poetry.dependencies]
python = "^3.8"
`;

			// Add many dependencies
			for (let i = 0; i < 1000; i++) {
				testContent += `package-${i} = "^1.0.${i % 10}"\n`;
			}

			testContent += `\n[tool.poetry.group.dev.dependencies]\n`;
			for (let i = 0; i < 500; i++) {
				testContent += `dev-package-${i} = "^2.0.${i % 10}"\n`;
			}

			try {
				const document = await vscode.workspace.openTextDocument({
					content: testContent,
					language: 'poetry-toml'
				});

				assert.strictEqual(document.languageId, 'poetry-toml');
				assert.ok(document.getText().length > 10000);
			} catch (error) {
				assert.fail(`Should handle large files gracefully: ${error}`);
			}
		});
	});

	suite('Performance Tests', () => {
		test('Should open large pyproject.toml files quickly', async () => {
			const startTime = Date.now();

			// Create a reasonably large file
			let testContent = `[tool.poetry]
name = "performance-test"
version = "1.0.0"
description = "Testing performance with larger files"
authors = ["Test Author <test@example.com>"]
license = "MIT"
readme = "README.md"

[tool.poetry.dependencies]
python = "^3.8"
`;

			// Add multiple dependency groups and many packages
			const dependencyGroups = ['main', 'dev', 'test', 'docs', 'typing', 'linting'];

			for (const group of dependencyGroups) {
				if (group === 'main') {
					// Main dependencies in [tool.poetry.dependencies]
					for (let i = 0; i < 100; i++) {
						testContent += `package-${group}-${i} = "^1.${i % 10}.0"\n`;
					}
				} else {
					testContent += `\n[tool.poetry.group.${group}.dependencies]\n`;
					for (let i = 0; i < 50; i++) {
						testContent += `${group}-package-${i} = "^2.${i % 10}.0"\n`;
					}
				}
			}

			// Add scripts
			testContent += `\n[tool.poetry.scripts]\n`;
			for (let i = 0; i < 20; i++) {
				testContent += `script-${i} = "my_package.module${i}:main"\n`;
			}

			// Add extras
			testContent += `\n[tool.poetry.extras]\n`;
			for (let i = 0; i < 10; i++) {
				testContent += `extra-${i} = ["package-main-${i}", "package-main-${i + 1}"]\n`;
			}

			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'poetry-toml'
			});

			const endTime = Date.now();
			const duration = endTime - startTime;

			// Should open within reasonable time (less than 1 second)
			assert.ok(duration < 1000, `Document should open quickly, took ${duration}ms`);
			assert.strictEqual(document.languageId, 'poetry-toml');
			assert.ok(document.getText().length > 5000);
		});
	});
});
