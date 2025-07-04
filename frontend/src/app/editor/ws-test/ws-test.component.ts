import { Component, Inject, NgZone, PLATFORM_ID } from '@angular/core';
import { WebSocketService } from '../code-editor/websocket.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ws-test',
  imports: [CommonModule],
  templateUrl: './ws-test.component.html',
  styleUrl: './ws-test.component.scss'
})
export class WsTestComponent {
  isBrowser = false;
  wsMessages: string[] = [];
  wsConnected = false;
  private wsUrl = 'ws://localhost:8080/ws';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private wsService: WebSocketService, private ngZone: NgZone) {}

  ngOnInit() {
    this.isBrowser = isPlatformBrowser(this.platformId);
    if (this.isBrowser) {
      this.wsService.connect(this.wsUrl);
      this.wsService.status.subscribe(status => {
        this.ngZone.run(() => {
          this.wsConnected = status === 'connected';
          this.wsMessages.push('WebSocket ' + status);
        });
      });
      this.wsService.messages.subscribe(msg => {
        this.ngZone.run(() => {
          this.wsMessages.push('Received: ' + msg);
        });
      });
    }
  }

  sendTestMessage() {
    if (this.wsConnected) {
      const msg = 'Hello from Angular!';
      this.wsService.send(msg);
      this.wsMessages.push('Sent: ' + msg);
    }
  }
}
