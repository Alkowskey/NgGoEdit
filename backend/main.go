package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(request *http.Request) bool {
		return true
	},
}

func main() {
	hub := newHub()
	go hub.run()
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		wsHandler(hub, w, r)
	})

	fmt.Println("Server started on http://localhost:8080")
	serverError := http.ListenAndServe(":8080", nil)
	if serverError != nil {
		panic("Server failed to start: " + serverError.Error())
	}
}
