from http.server import SimpleHTTPRequestHandler, HTTPServer
import json
import csv
import os

CSV_FILE = "tmp/data.csv"

class MyHandler(SimpleHTTPRequestHandler):

    def do_HEAD(self):
        if self.path == "/save":
            self.send_response(200)
            self.end_headers()
        else:
            self.send_response(404)
            self.end_headers()


    def do_POST(self):
        if self.path != "/save":
            self.send_response(404)
            self.end_headers()
            return

        content_length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(content_length)

        data = json.loads(body.decode("utf-8"))
        rows = data.get("rows", [])

        file_exists = os.path.isfile(CSV_FILE)

        with open(CSV_FILE, "a", newline="") as f:
            writer = csv.writer(f)
            if not file_exists and rows:
                # write header from first row keys
                writer.writerow(rows[0].keys())
            for row in rows:
                writer.writerow(row.values())

        try:
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(b'{"status": "ok"}')
        except BrokenPipeError:
            pass


if __name__ == "__main__":
    server = HTTPServer(("0.0.0.0", 8000), MyHandler)
    print("Server running on http://0.0.0.0:8000")
    server.serve_forever()
