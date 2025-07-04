import { Injectable, NgZone } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private ws?: WebSocket;
  private messages$ = new Subject<string>();
  private status$ = new Subject<'connected' | 'disconnected' | 'error'>();
  private connected = false;

  connect(url: string) {
    if (this.ws) {
      this.ws.close();
    }
    this.ws = new WebSocket(url);
    this.ws.onopen = () => {
      this.connected = true;
      this.status$.next('connected');
    };
    this.ws.onmessage = (event) => {
      this.messages$.next(event.data);
    };
    this.ws.onclose = () => {
      this.connected = false;
      this.status$.next('disconnected');
    };
    this.ws.onerror = () => {
      this.status$.next('error');
    };
  }

  send(message: string) {
    if (this.ws && this.connected) {
      this.ws.send(message);
    }
  }

  get messages(): Observable<string> {
    return this.messages$.asObservable();
  }

  get status(): Observable<'connected' | 'disconnected' | 'error'> {
    return this.status$.asObservable();
  }

  get isConnected(): boolean {
    return this.connected;
  }
} 