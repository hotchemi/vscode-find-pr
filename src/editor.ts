import { window, TextDocument, workspace, TextEditor } from "vscode";

export function activeFile(): TextDocument | undefined {
  return window.activeTextEditor && window.activeTextEditor.document;
}

export function activeLineNumber(): number | undefined {
  return (
    window.activeTextEditor && window.activeTextEditor.selection.active.line
  );
}

export function rootPath(): string | undefined {
  return workspace.rootPath;
}

export function isActiveEditorValid(): boolean {
  const doc = window.activeTextEditor && window.activeTextEditor.document;
  return doc && !doc.isUntitled;
}
