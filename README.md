# GitHub Actions YAML Extension

Provides Github Actions YAML support via [yaml-language-server](https://github.com/redhat-developer/yaml-language-server).

## Features

### 1. YAML validation

- Apply schema validation to GitHub Actions
- Detects errors such as:
  - Invalid property value type
  - Out of enum scope
  - Required property is missing
  - Unexpected property

### 2. Auto completion

- Generate input template for whole GitHub Action
- Generate input template for an object (_if provided by schema_)

> **Including required properties and optional properties with default value**

- Support properties intellisense (_if provided by schema_)
- Enumerated property value recommendation (_if provided by schema_)

> **Intellisense is automatically triggered by what you have typed, but you can also hit _<kbd>Ctrl</kbd> + <kbd>Space</kbd>_ to get what you can type**.

### 3. Hover support

- Hovering over a property shows description (_if provided by schema_)

## Developer support

1. Install prerequisites:
   - latest [Visual Studio Code](https://code.visualstudio.com/)
   - [Node.js](https://nodejs.org/) v6.0.0 or higher
2. Fork this repository.
3. Build this project.

   ```bash
   # clone your forked repository
   $ git clone https://github.com/{your-github-name}/vscode-github-actions
   $ cd vscode-github-actions
   # install npm dependencies
   $ npm install
   # compile
   $ npm run compile
   # open the project in vscode
   $ code .
   ```

4. Make changes as necessary and the run the code using F5.
   Refer to VS Code [documentation](https://code.visualstudio.com/docs/extensions/debugging-extensions) on how to run and debug the extension.
5. Create a pull-request to this repository and we will review, merge it and publish new version extension regularly.

## License

MIT

**All contributions are welcome!**
