import os
from typing import Any, Dict, Tuple, Optional
from dotenv import load_dotenv
from flask import Flask, request, jsonify, abort
from flask_cors import CORS

load_dotenv()  # optional .env support

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
TABLE_NAME = os.getenv("SUPABASE_TABLE", "items")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set in environment")

# It's better to import and create the client after checking the env vars
from supabase import create_client, Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes and origins


def _unwrap_response(res: Any) -> Tuple[Optional[Any], Optional[Any]]:
    """
    Normalize supabase-py response objects/dicts to (data, error).
    """
    if res is None:
        return None, {"message": "no response"}
    if hasattr(res, "data") or hasattr(res, "error"):
        return getattr(res, "data", None), getattr(res, "error", None)
    if isinstance(res, dict):
        return res.get("data"), res.get("error")
    return res, None


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


@app.route("/items", methods=["POST"])
def create_item():
    payload: Dict[str, Any] = request.get_json(force=True, silent=True) or {}
    name = payload.get("name")
    if not name:
        return jsonify({"error": "name is required"}), 400

    record = {"name": name, "description": payload.get("description")}
    res = supabase.table(TABLE_NAME).insert(record).select("*").execute()
    data, error = _unwrap_response(res)
    if error:
        return jsonify({"error": str(error)}), 500
    return jsonify({"item": data[0] if isinstance(data, list) and data else data}), 201


@app.route("/items", methods=["GET"])
def list_items():
    res = supabase.table(TABLE_NAME).select("*").execute()
    data, error = _unwrap_response(res)
    if error:
        return jsonify({"error": str(error)}), 500
    return jsonify({"items": data or []}), 200


@app.route("/items/<int:item_id>", methods=["GET"])
def get_item(item_id: int):
    res = supabase.table(TABLE_NAME).select("*").eq("id", item_id).execute()
    data, error = _unwrap_response(res)
    if error:
        return jsonify({"error": str(error)}), 500
    if not data:
        return jsonify({"error": "not found"}), 404
    return jsonify({"item": data[0]}), 200


@app.route("/items/<int:item_id>", methods=["PUT", "PATCH"])
def update_item(item_id: int):
    payload: Dict[str, Any] = request.get_json(force=True, silent=True) or {}
    if not payload:
        return jsonify({"error": "no data provided"}), 400

    res = (
        supabase.table(TABLE_NAME)
        .update(payload)
        .eq("id", item_id)
        .select("*")
        .execute()
    )
    data, error = _unwrap_response(res)
    if error:
        return jsonify({"error": str(error)}), 500
    if not data:
        return jsonify({"error": "not found or not updated"}), 404
    return jsonify({"item": data[0]}), 200


@app.route("/items/<int:item_id>", methods=["DELETE"])
def delete_item(item_id: int):
    res = supabase.table(TABLE_NAME).delete().eq("id", item_id).select("*").execute()
    data, error = _unwrap_response(res)
    if error:
        return jsonify({"error": str(error)}), 500
    if not data:
        return jsonify({"error": "not found"}), 404
    return jsonify({"deleted": data[0]}), 200


if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    app.run(host="0.0.0.0", port=port)