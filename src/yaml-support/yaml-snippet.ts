import { readdirSync, readFileSync } from "fs";
import * as Fuse from "fuse.js";
import { safeLoad } from "js-yaml";
import { join } from "path";
import {
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  Position,
  SnippetString,
  TextDocument
} from "vscode";
import { SNIPPETS_ROOT_PATH } from "./yaml-constant";

/// Internal representation of a yaml code snippet corresponding to CompletionItemProvider
interface ICodeSnippet {
  readonly name: string;
  readonly label: string;
  readonly description: string;
  readonly body: string;
}

/**
 * A yaml completion provider provides yaml code snippets for GitHub Actions.
 */
export class YamlCompletionProvider implements CompletionItemProvider {
  // Storing all loaded yaml code snippets from snippets folder
  private snippets: ICodeSnippet[] = [];

  // Default constructor
  public constructor() {
    this.loadCodeSnippets();
  }

  // Provide code snippets for vscode
  public provideCompletionItems(doc: TextDocument, pos: Position) {
    const wordPos = doc.getWordRangeAtPosition(pos);
    const word = doc.getText(wordPos);

    return this.filterCodeSnippets(word).map(snippet => {
      const item = new CompletionItem(
        snippet.label,
        CompletionItemKind.Snippet
      );
      item.insertText = new SnippetString(snippet.body);
      item.documentation = snippet.description;
      return item;
    });
  }

  // Load yaml code snippets from snippets folder
  private loadCodeSnippets(): void {
    this.snippets = readdirSync(SNIPPETS_ROOT_PATH)
      .filter(filename => filename.endsWith(".yaml"))
      .map(filename =>
        this.readYamlCodeSnippet(join(SNIPPETS_ROOT_PATH, filename))
      );
  }

  // Filter all internal code snippets using the parameter word
  private filterCodeSnippets(word: string): ICodeSnippet[] {
    const searcher = new Fuse(this.snippets, { keys: ["name"] });
    return searcher.search(word.toLowerCase());
  }

  // Parse a yaml snippet file into a CodeSnippet
  private readYamlCodeSnippet(filename: string): ICodeSnippet {
    return safeLoad(readFileSync(filename, "utf-8")) as ICodeSnippet;
  }
}
