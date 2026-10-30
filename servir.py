"""Servidor local para el sitio de Tashi."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Timer
import os
import webbrowser

ROOT = Path(__file__).resolve().parent
PORT = 4173

os.chdir(ROOT)


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(f"[tashi] {fmt % args}")


def open_browser():
    webbrowser.open(f"http://127.0.0.1:{PORT}/")


if __name__ == "__main__":
    print(f"Tashi: http://127.0.0.1:{PORT}/")
    print("Ctrl+C para detener el servidor.")
    Timer(0.8, open_browser).start()
    with ThreadingHTTPServer(("127.0.0.1", PORT), Handler) as server:
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor detenido.")
