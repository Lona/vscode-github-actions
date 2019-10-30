import { join } from "path";
import { Uri } from "vscode";

export const VSCODE_YAML_EXTENSION_ID = "redhat.vscode-yaml";

export const SNIPPETS_ROOT_PATH = join(__dirname, "../../../snippets");

export const YAML_SCHEMA_CONFIG_NAME_OF_VSCODE_YAML_EXTENSION = "yaml.schemas";

export const WORKFLOW_SCHEMA_FILENAME = "workflow.schema.json";

export const WORKFLOW_SCHEMA_FILE = Uri.file(
  join(__dirname, `../../../schemas/${WORKFLOW_SCHEMA_FILENAME}`)
).toString();

export const WORKFLOW_FILE_GLOBAL_PATTERN = "/.github/workflows/*.yml";
