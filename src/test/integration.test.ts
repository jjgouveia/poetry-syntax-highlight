import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Integration tests for the Poetry Syntax Highlight extension
 */
suite('Integration Tests', () => {

	suite('Extension Lifecycle', () => {
		test('Should activate extension when opening pyproject.toml', async () => {
			const extension = vscode.extensions.getExtension('jarbas-gouveia.poetry-syntax-highlight');
			assert.ok(extension, 'Extension should be installed');

			// Create a pyproject.toml document
			const testContent = `[tool.poetry]
name = "integration-test"
version = "0.1.0"
description = "Integration test project"

[tool.poetry.dependencies]
python = "^3.8"
`;

			const document = await vscode.workspace.openTextDocument({
				content: testContent,
				language: 'poetry-toml'
			});

			await vscode.window.showTextDocument(document);

			// Extension should be active after opening a Poetry file
			if (extension && !extension.isActive) {
				await extension.activate();
			}

			assert.ok(extension?.isActive, 'Extension should be active');
		});

		test('Should handle multiple pyproject.toml files', async () => {
			const files = [
				{
					name: 'project1',
					content: `[tool.poetry]
name = "project-one"
version = "1.0.0"

[tool.poetry.dependencies]
python = "^3.8"
requests = "^2.28.0"`
				},
				{
					name: 'project2',
					content: `[tool.poetry]
name = "project-two"
version = "2.0.0"

[tool.poetry.dependencies]
python = "^3.9"
fastapi = "^0.104.0"`
				}
			];

			const documents: vscode.TextDocument[] = [];

			// Open multiple documents
			for (const file of files) {
				const document = await vscode.workspace.openTextDocument({
					content: file.content,
					language: 'poetry-toml'
				});
				documents.push(document);
			}

			// All documents should be recognized as poetry-toml
			for (const doc of documents) {
				assert.strictEqual(doc.languageId, 'poetry-toml');
			}

			// Clean up
			await vscode.commands.executeCommand('workbench.action.closeAllEditors');
		});
	});

	suite('Real-world pyproject.toml Files', () => {
		test('Should handle FastAPI project structure', async () => {
			const fastapiProject = `[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"

[tool.poetry]
name = "fastapi-app"
version = "0.1.0"
description = "A FastAPI application"
authors = ["Developer <dev@example.com>"]
readme = "README.md"
packages = [{include = "app"}]

[tool.poetry.dependencies]
python = "^3.8"
fastapi = "^0.104.0"
uvicorn = {extras = ["standard"], version = "^0.24.0"}
pydantic = "^2.5.0"
sqlalchemy = "^2.0.0"
alembic = "^1.13.0"
python-multipart = "^0.0.6"
python-jose = {extras = ["cryptography"], version = "^3.3.0"}
passlib = {extras = ["bcrypt"], version = "^1.7.4"}

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.21.0"
httpx = "^0.25.0"
black = "^23.0.0"
isort = "^5.12.0"
mypy = "^1.7.0"
pre-commit = "^3.5.0"

[tool.poetry.scripts]
dev = "uvicorn app.main:app --reload"
start = "uvicorn app.main:app --host 0.0.0.0 --port 8000"

[tool.black]
line-length = 88
target-version = ['py38']
include = '\\.pyi?$'

[tool.isort]
profile = "black"
multi_line_output = 3
`;

			const document = await vscode.workspace.openTextDocument({
				content: fastapiProject,
				language: 'poetry-toml'
			});

			assert.strictEqual(document.languageId, 'poetry-toml');
			assert.ok(document.getText().includes('fastapi'));
			assert.ok(document.getText().includes('uvicorn'));
			assert.ok(document.getText().includes('tool.black'));
		});

		test('Should handle Django project structure', async () => {
			const djangoProject = `[tool.poetry]
name = "django-app"
version = "0.1.0"
description = "A Django web application"
authors = ["Developer <dev@example.com>"]
license = "MIT"

[tool.poetry.dependencies]
python = "^3.9"
Django = "^4.2.0"
djangorestframework = "^3.14.0"
django-cors-headers = "^4.3.0"
celery = "^5.3.0"
redis = "^5.0.0"
psycopg2-binary = "^2.9.0"
pillow = "^10.1.0"
django-environ = "^0.11.0"

[tool.poetry.group.dev.dependencies]
pytest-django = "^4.7.0"
pytest-cov = "^4.1.0"
factory-boy = "^3.3.0"
django-debug-toolbar = "^4.2.0"
flake8 = "^6.1.0"
black = "^23.0.0"

[tool.poetry.group.production.dependencies]
gunicorn = "^21.2.0"
whitenoise = "^6.6.0"

[tool.poetry.scripts]
manage = "python manage.py"
runserver = "python manage.py runserver"
migrate = "python manage.py migrate"
collectstatic = "python manage.py collectstatic --noinput"

[tool.pytest.ini_options]
DJANGO_SETTINGS_MODULE = "myproject.settings.test"
python_files = ["tests.py", "test_*.py", "*_tests.py"]
`;

			const document = await vscode.workspace.openTextDocument({
				content: djangoProject,
				language: 'poetry-toml'
			});

			assert.strictEqual(document.languageId, 'poetry-toml');
			assert.ok(document.getText().includes('Django'));
			assert.ok(document.getText().includes('djangorestframework'));
			assert.ok(document.getText().includes('tool.pytest'));
		});

		test('Should handle Data Science project structure', async () => {
			const dataScienceProject = `[tool.poetry]
name = "data-science-project"
version = "0.1.0"
description = "A data science and ML project"
authors = ["Data Scientist <ds@example.com>"]

[tool.poetry.dependencies]
python = "^3.9"
numpy = "^1.24.0"
pandas = "^2.1.0"
matplotlib = "^3.8.0"
seaborn = "^0.13.0"
scikit-learn = "^1.3.0"
jupyter = "^1.0.0"
ipykernel = "^6.26.0"
plotly = "^5.17.0"
streamlit = "^1.28.0"

[tool.poetry.group.ml.dependencies]
tensorflow = "^2.14.0"
torch = "^2.1.0"
transformers = "^4.35.0"
xgboost = "^2.0.0"
lightgbm = "^4.1.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
jupyter-lab = "^4.0.0"
black = "^23.0.0"
isort = "^5.12.0"
nbformat = "^5.9.0"

[tool.poetry.scripts]
notebook = "jupyter lab"
app = "streamlit run app.py"
train = "python src/train.py"
evaluate = "python src/evaluate.py"

[tool.poetry.extras]
tensorflow = ["tensorflow"]
pytorch = ["torch"]
all-ml = ["tensorflow", "torch", "transformers", "xgboost", "lightgbm"]
`;

			const document = await vscode.workspace.openTextDocument({
				content: dataScienceProject,
				language: 'poetry-toml'
			});

			assert.strictEqual(document.languageId, 'poetry-toml');
			assert.ok(document.getText().includes('numpy'));
			assert.ok(document.getText().includes('tensorflow'));
			assert.ok(document.getText().includes('tool.poetry.group.ml'));
		});
	});

	suite('Complex Dependency Scenarios', () => {
		test('Should handle monorepo with multiple packages', async () => {
			const monorepoProject = `[tool.poetry]
name = "monorepo-workspace"
version = "0.1.0"
description = "A monorepo with multiple Python packages"
authors = ["Team <team@example.com>"]

[tool.poetry.dependencies]
python = "^3.9"
# Shared dependencies
requests = "^2.31.0"
pydantic = "^2.5.0"

# Local packages
core-package = {path = "./packages/core", develop = true}
api-package = {path = "./packages/api", develop = true}
worker-package = {path = "./packages/worker", develop = true}
cli-package = {path = "./packages/cli", develop = true}

[tool.poetry.group.api.dependencies]
fastapi = "^0.104.0"
uvicorn = "^0.24.0"

[tool.poetry.group.worker.dependencies]
celery = "^5.3.0"
redis = "^5.0.0"

[tool.poetry.group.cli.dependencies]
click = "^8.1.0"
rich = "^13.7.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.21.0"
pytest-cov = "^4.1.0"
black = "^23.0.0"
isort = "^5.12.0"
mypy = "^1.7.0"

[tool.poetry.scripts]
# API commands
api-dev = "uvicorn api_package.main:app --reload"
api-start = "uvicorn api_package.main:app"

# Worker commands
worker-start = "celery -A worker_package.celery worker --loglevel=info"
worker-beat = "celery -A worker_package.celery beat --loglevel=info"

# CLI commands
cli = "cli_package.main:main"

# Development commands
test = "pytest"
lint = "black . && isort . && mypy ."
`;

			const document = await vscode.workspace.openTextDocument({
				content: monorepoProject,
				language: 'poetry-toml'
			});

			assert.strictEqual(document.languageId, 'poetry-toml');
			assert.ok(document.getText().includes('path = "./packages/'));
			assert.ok(document.getText().includes('develop = true'));
			assert.ok(document.getText().includes('tool.poetry.group.api'));
		});

		test('Should handle conditional dependencies with markers', async () => {
			const conditionalProject = `[tool.poetry]
name = "cross-platform-app"
version = "0.1.0"
description = "An app with platform-specific dependencies"

[tool.poetry.dependencies]
python = "^3.8"

# Cross-platform dependencies
requests = "^2.31.0"
click = "^8.1.0"

# Platform-specific dependencies
pywin32 = {version = "^306", markers = "sys_platform == 'win32'"}
python-magic = {version = "^0.4.27", markers = "sys_platform != 'win32'"}

# Python version specific
typing-extensions = {version = "^4.8.0", python = "<3.10"}
importlib-metadata = {version = "^6.8.0", python = "<3.8"}

# Complex conditions
uvloop = {version = "^0.19.0", markers = "sys_platform != 'win32' and python_version >= '3.7'"}

# Optional dependencies with extras
scipy = {version = "^1.11.0", optional = true}
matplotlib = {version = "^3.8.0", optional = true}

[tool.poetry.extras]
scientific = ["scipy", "matplotlib"]
windows = ["pywin32"]
unix = ["python-magic"]

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.0"
pytest-cov = "^4.1.0"
tox = "^4.11.0"
`;

			const document = await vscode.workspace.openTextDocument({
				content: conditionalProject,
				language: 'poetry-toml'
			});

			assert.strictEqual(document.languageId, 'poetry-toml');
			assert.ok(document.getText().includes('sys_platform'));
			assert.ok(document.getText().includes('python_version'));
			assert.ok(document.getText().includes('optional = true'));
		});
	});

	suite('Performance with Large Files', () => {
		test('Should handle very large dependency lists efficiently', async function() {
			// Increase timeout for this test
			this.timeout(5000);

			const startTime = Date.now();

			// Generate a very large pyproject.toml file
			let largeProject = `[build-system]
requires = ["poetry-core>=1.0.0"]
build-backend = "poetry.core.masonry.api"

[tool.poetry]
name = "large-enterprise-project"
version = "1.0.0"
description = "A large enterprise project with many dependencies"
authors = ["Enterprise Team <team@enterprise.com>"]
license = "MIT"
readme = "README.md"
homepage = "https://enterprise.com"
repository = "https://github.com/enterprise/large-project"
documentation = "https://docs.enterprise.com"
keywords = ["enterprise", "large", "python", "microservices"]
classifiers = [
    "Development Status :: 5 - Production/Stable",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
]

[tool.poetry.dependencies]
python = "^3.8"
`;

			// Add many main dependencies
			const mainPackages = [
				'fastapi', 'django', 'flask', 'requests', 'httpx', 'aiohttp', 'urllib3',
				'pydantic', 'sqlalchemy', 'alembic', 'psycopg2-binary', 'redis',
				'celery', 'kombu', 'amqp', 'billiard', 'numpy', 'pandas', 'matplotlib',
				'seaborn', 'plotly', 'scikit-learn', 'tensorflow', 'torch', 'pillow',
				'opencv-python', 'boto3', 'botocore', 'azure-storage-blob', 'google-cloud-storage'
			];

			for (let i = 0; i < 200; i++) {
				const pkg = mainPackages[i % mainPackages.length];
				const version = `${1 + (i % 5)}.${i % 10}.${i % 5}`;
				largeProject += `${pkg}-${i} = "^${version}"\n`;
			}

			// Add multiple dependency groups
			const groups = ['dev', 'test', 'docs', 'lint', 'typing', 'security', 'monitoring', 'deploy'];

			for (const group of groups) {
				largeProject += `\n[tool.poetry.group.${group}.dependencies]\n`;

				for (let i = 0; i < 50; i++) {
					const version = `${2 + (i % 3)}.${i % 10}.${i % 3}`;
					largeProject += `${group}-package-${i} = "^${version}"\n`;
				}
			}

			// Add many scripts
			largeProject += '\n[tool.poetry.scripts]\n';
			for (let i = 0; i < 50; i++) {
				largeProject += `script-${i} = "myproject.commands.command${i}:main"\n`;
			}

			// Add many extras
			largeProject += '\n[tool.poetry.extras]\n';
			for (let i = 0; i < 20; i++) {
				const deps = Array.from({length: 5}, (_, j) => `"package-${i}-${j}"`).join(', ');
				largeProject += `extra-${i} = [${deps}]\n`;
			}

			// Add tool configurations
			largeProject += `
[tool.black]
line-length = 88
target-version = ['py38', 'py39', 'py310', 'py311']
include = '\\.pyi?$'
extend-exclude = '''
/(
    \\.eggs
  | \\.git
  | \\.mypy_cache
  | \\.tox
  | \\.venv
  | build
  | dist
)/
'''

[tool.isort]
profile = "black"
multi_line_output = 3
line_length = 88
known_first_party = ["myproject"]
known_third_party = ["pytest", "requests", "fastapi"]

[tool.mypy]
python_version = "3.8"
warn_return_any = true
warn_unused_configs = true
disallow_untyped_defs = true
`;

			const document = await vscode.workspace.openTextDocument({
				content: largeProject,
				language: 'poetry-toml'
			});

			const loadTime = Date.now() - startTime;

			// Verify the document loaded correctly
			assert.strictEqual(document.languageId, 'poetry-toml');
			assert.ok(document.getText().length > 20000, 'Document should be large');
			assert.ok(loadTime < 2000, `Document should load quickly, took ${loadTime}ms`);

			// Try to open it in an editor
			const editorStartTime = Date.now();
			await vscode.window.showTextDocument(document);
			const editorLoadTime = Date.now() - editorStartTime;

			assert.ok(editorLoadTime < 1000, `Editor should open quickly, took ${editorLoadTime}ms`);
		});
	});
});
