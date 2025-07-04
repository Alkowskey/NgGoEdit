package main

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan BroadcastMessage
	register   chan *Client
	unregister chan *Client
}

type BroadcastMessage struct {
	message []byte
	sender  *Client
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan BroadcastMessage),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case bmsg := <-h.broadcast:
			for client := range h.clients {
				if client == bmsg.sender {
					continue
				}
				select {
				case client.send <- bmsg.message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
