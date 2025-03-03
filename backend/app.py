from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
import uuid

app = Flask(__name__)
CORS(app)

DB_FILE = 'db.json'

def load_db():
    if not os.path.exists(DB_FILE):
        with open(DB_FILE, 'w') as f:
            json.dump({"todos": []}, f)
    with open(DB_FILE, 'r') as f:
        return json.load(f)

def save_db(data):
    with open(DB_FILE, 'w') as f:
        json.dump(data, f, indent=4)

# Alle ToDos abrufen
@app.route('/todos', methods=['GET'])
def get_todos():
    data = load_db()
    return jsonify(data["todos"])

# Neues ToDo hinzufügen
@app.route('/todos', methods=['POST'])
def add_todo():
    data = load_db()
    new_todo = {
        "id": str(uuid.uuid4()),
        "text": request.json.get("text"),
        "completed": False
    }
    print("Neues Todo empfangen:", new_todo)  # Debug-Ausgabe
    data["todos"].append(new_todo)
    save_db(data)
    return jsonify(new_todo)

# ToDo löschen
@app.route('/todos/<todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    data = load_db()
    data["todos"] = [todo for todo in data["todos"] if todo["id"] != todo_id]
    save_db(data)
    return jsonify({"success": True})

# ToDo aktualisieren (z. B. zum Abhaken)
@app.route('/todos/<todo_id>', methods=['PUT'])
def update_todo(todo_id):
    data = load_db()
    updated_todo = None
    for todo in data["todos"]:
        if todo["id"] == todo_id:
            todo["completed"] = request.json.get("completed", todo["completed"])
            updated_todo = todo
            break
    save_db(data)
    return jsonify(updated_todo)

if __name__ == '__main__':
    app.run(debug=True, port=5000)