import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CodeEditorComponent } from './editor/code-editor/code-editor.component';
import { WsTestComponent } from "./editor/ws-test/ws-test.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CodeEditorComponent, WsTestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
