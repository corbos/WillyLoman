package main

import (
    "log"
    "net/http"
    "os"
)

func main() {
    dir := http.Dir(os.Args[1])
    fileServer := http.FileServer(dir)
    log.Fatal(http.ListenAndServe(":8080", fileServer))
}
