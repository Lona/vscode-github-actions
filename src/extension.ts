import {
  ConfigurationTarget,
  ExtensionContext,
  languages,
  window,
  workspace
} from "vscode";
import {
  WORKFLOW_FILE_GLOBAL_PATTERN,
  WORKFLOW_SCHEMA_FILE,
  YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION
} from "./yaml-support/yaml-constant";
import { registerYamlSchemaSupport } from "./yaml-support/yaml-schema";
import { YamlCompletionProvider } from "./yaml-support/yaml-snippet";

export const output = window.createOutputChannel("vscode-github-actions");
export let extensionPath: string;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
  extensionPath = context.extensionPath;
  const subscriptions = [
    // Completion providers
    languages.registerCompletionItemProvider(
      "yaml",
      new YamlCompletionProvider()
    )
  ];
  await addTocSchemaToConfig();
  await registerYamlSchemaSupport();
  subscriptions.forEach(element => {
    context.subscriptions.push(element);
  }, this);
}

async function addTocSchemaToConfig() {
  const config = workspace
    .getConfiguration()
    .inspect(YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION);
  await addSchemaToConfigAtScope(
    WORKFLOW_SCHEMA_FILE,
    WORKFLOW_FILE_GLOBAL_PATTERN,
    ConfigurationTarget.Global,
    config.globalValue
  );

  // this code should be mantian for two verison
  await removeSchemaFromConfigAtScope(
    WORKFLOW_FILE_GLOBAL_PATTERN,
    ConfigurationTarget.Workspace,
    config.workspaceValue
  );
}

async function addSchemaToConfigAtScope(
  key: string,
  value: string,
  scope: ConfigurationTarget,
  valueAtScope: any
) {
  let newValue: any = {};
  if (valueAtScope) {
    newValue = Object.assign({}, valueAtScope);
  }
  Object.keys(newValue).forEach(configKey => {
    var configValue = newValue[configKey];
    if (value === configValue) {
      delete newValue[configKey];
    }
  });
  newValue[key] = value;
  await workspace
    .getConfiguration()
    .update(YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION, newValue, scope);
}

async function removeSchemaFromConfigAtScope(
  value: string,
  scope: ConfigurationTarget,
  valueAtScope: any
) {
  if (!valueAtScope) {
    return;
  }
  let newValue: any = {};
  if (valueAtScope) {
    newValue = Object.assign({}, valueAtScope);
  }
  Object.keys(newValue).forEach(configKey => {
    var configValue = newValue[configKey];
    if (value === configValue) {
      delete newValue[configKey];
    }
  });
  await workspace
    .getConfiguration()
    .update(YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION, newValue, scope);
}

// this method is called when your extension is deactivated
export function deactivate() {}
