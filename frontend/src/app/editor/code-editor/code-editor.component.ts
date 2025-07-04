import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CodeEditor } from '@acrodata/code-editor';
import { LanguageDescription } from "@codemirror/language"

import { FormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WebSocketService } from './websocket.service';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-code-editor',
  imports: [FormsModule, CodeEditor, CommonModule],
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.scss'
})
export class CodeEditorComponent {
  isBrowser = false;
  private updatingFromSocket = false;
  private blockSendUntil: number = 0;

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
      this.wsService.messages.subscribe((msg) => {
        this.blockSendUntil = Date.now() + 5000;
        this.code = msg;
      });
    }
  }

  code = `
  function hello(who = "world") {
    console.log('Hello world!');
    console.log(who);
  }
  `;

  onCodeChange(newCode: string) {
    if (Date.now() > this.blockSendUntil) {
      this.wsService.send(newCode);
    }
  }
}
