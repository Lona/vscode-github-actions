import { ExtensionContext, languages, window } from "vscode";
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
    ),
  ];
  await registerYamlSchemaSupport();
  subscriptions.forEach((element) => {
    context.subscriptions.push(element);
  }, this);
}

export function deactivate() {
  // this method is called when your extension is deactivated
}
