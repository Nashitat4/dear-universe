
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory

from data_processing import get_planets
from gemini_ai import explain_planet


FRONTEND_FOLDER = Path(__file__).resolve().parent.parent / "frontend"

app = Flask(__name__)


@app.route("/")
def home():
    return send_from_directory(FRONTEND_FOLDER, "index.html")


@app.route("/api/planets")
def planets():
    try:
        data = get_planets()
        return jsonify(data)

    except Exception as error:
        print("NASA API error:", error)

        return jsonify({
            "error": "Could not load planet data from NASA."
        }), 503


@app.route("/api/explain", methods=["POST"])
def explain():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "error": "Please provide a planet name."
        }), 400

    planet_name = data.get("planet_name")

    if not isinstance(planet_name, str) or not planet_name.strip():
        return jsonify({
            "error": "Please select a valid planet."
        }), 400

    try:
        # Retrieve trusted measurements directly from NASA.
        # Do not accept scientific values supplied by the browser.
        all_planets = get_planets()

        selected_planet = next(
            (
                planet for planet in all_planets
                if planet["pl_name"] == planet_name
            ),
            None
        )

        if selected_planet is None:
            return jsonify({
                "error": "Planet not found."
            }), 404

        explanation = explain_planet(selected_planet)

        return jsonify({
            "planet_name": selected_planet["pl_name"],
            "explanation": explanation
        })

    except Exception as error:
        print("Gemini explanation error:", error)

        return jsonify({
            "error": "Could not generate an AI explanation. Please try again."
        }), 503


@app.route("/<path:filename>")
def frontend_files(filename):
    return send_from_directory(FRONTEND_FOLDER, filename)


if __name__ == "__main__":
    app.run(debug=True, port=5000)
