import {
  ConfigurationTarget,
  Extension,
  extensions,
  window,
  workspace
} from "vscode";
import {
  VSCODE_YAML_EXTENSION_ID,
  YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION
} from "./yaml-constant";

// The function signature exposed by vscode-yaml:
// 1. the requestSchema api will be called by vscode-yaml extension to decide whether the schema can be handled by this
// contributor, if it returns undefined, means it doesn't support this yaml file, vscode-yaml will ask other contributors
// 2. the requestSchemaContent api  will give the parameter uri returned by the first api, and ask for the json content(after stringify) of
// the schema
declare type YamlSchemaContributor = (
  schema: string,
  requestSchema: (resource: string) => string,
  requestSchemaContent: (uri: string) => string
) => void;

export async function registerYamlSchemaSupport(): Promise<void> {
  await activateYamlExtension();
}

// Find redhat.vscode-yaml extension and try to activate it to get the yaml contributor
async function activateYamlExtension(): Promise<{
  registerContributor: YamlSchemaContributor;
}> {
  const ext: Extension<any> = extensions.getExtension(VSCODE_YAML_EXTENSION_ID);
  if (!ext) {
    window.showWarningMessage(
      "Please install 'YAML Support by Red Hat' via the Extensions pane."
    );
    return;
  }
  const yamlPlugin = await ext.activate();

  if (!yamlPlugin || !yamlPlugin.registerContributor) {
    window.showWarningMessage(
      "The installed Red Hat YAML extension doesn't support Kubernetes Intellisense. Please upgrade 'YAML Support by Red Hat' via the Extensions pane."
    );
    return;
  }
  return yamlPlugin;
}

export async function addSchemaToConfigAtScope(
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
    const configValue = newValue[configKey];
    if (value === configValue) {
      delete newValue[configKey];
    }
  });
  newValue[key] = value;
  await workspace
    .getConfiguration()
    .update(YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION, newValue, scope);
}
