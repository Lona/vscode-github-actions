import {
  ConfigurationTarget,
  ExtensionContext,
  languages,
  window,
  workspace
} from "vscode";
import {
  ACTION_FILE_GLOBAL_PATTERN,
  ACTION_SCHEMA_FILE,
  WORKFLOW_FILE_GLOBAL_PATTERN,
  WORKFLOW_SCHEMA_FILE,
  YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION
} from "./yaml-support/yaml-constant";
import {
  addSchemaToConfigAtScope,
  registerYamlSchemaSupport
} from "./yaml-support/yaml-schema";
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
  await addSchemasToConfig();
  await registerYamlSchemaSupport();
  subscriptions.forEach(element => {
    context.subscriptions.push(element);
  }, this);
}

async function addSchemasToConfig() {
  const config = workspace
    .getConfiguration()
    .inspect(YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION);
  await addSchemaToConfigAtScope(
    WORKFLOW_SCHEMA_FILE,
    WORKFLOW_FILE_GLOBAL_PATTERN,
    ConfigurationTarget.Global,
    config.globalValue
  );
  await addSchemaToConfigAtScope(
    ACTION_SCHEMA_FILE,
    ACTION_FILE_GLOBAL_PATTERN,
    ConfigurationTarget.Global,
    config.globalValue
  );
}

export function deactivate() {
  // this method is called when your extension is deactivated
}
