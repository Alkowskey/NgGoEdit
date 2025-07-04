import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CodeEditor } from '@acrodata/code-editor';
import { LanguageDescription } from "@codemirror/language"

import { FormsModule } from '@angular/forms';
import { AsyncPipe, CommonModule, isPlatformBrowser } from '@angular/common';
import { WebSocketService } from './websocket.service';
import { Observable, filter, of, startWith, tap } from 'rxjs';

const STATIC_JS_CODE_EXAMPLE = `
  function hello(name = "test") {
    console.log("hello", name);
    console.log("test");
  }
`

@Component({
  selector: 'app-code-editor',
  imports: [FormsModule, CodeEditor, CommonModule, AsyncPipe],
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.scss'
})
export class CodeEditorComponent {
  isBrowser = false;

  code!: Observable<string>;

  languages : LanguageDescription[] = [
    LanguageDescription.of({
      name: "JavaScript",
      alias: ["ecmascript","js","node"],
      extensions: ["js", "mjs", "cjs"],
      load() {
        return import("@codemirror/lang-javascript").then(m => m.javascript())
      }
    }),
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private wsService: WebSocketService) {}

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.wsService.connect('ws://localhost:8080/ws');
      this.code = this.wsService.messages.pipe(
        startWith(STATIC_JS_CODE_EXAMPLE),
        filter((message) => message.length > 3)
      );
    }
  }

  onCodeChange(newCode: string) {
    this.wsService.send(newCode);
  }
}
