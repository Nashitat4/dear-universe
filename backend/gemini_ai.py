
import os
import json
from pathlib import Path

from dotenv import load_dotenv
from google import genai

from data_processing import get_planets


BASE_FOLDER = Path(__file__).resolve().parent.parent
load_dotenv(BASE_FOLDER / ".env")

API_KEY = os.getenv("GEMINI_API_KEY")

MODEL_NAME = "gemini-2.5-flash"


def explain_planet(planet):
    if not API_KEY:
        raise ValueError("GEMINI_API_KEY is missing from .env")

    client = genai.Client(api_key=API_KEY)

    prompt = f"""
You are a science educator explaining exoplanets
to someone who has no astronomy background.

Use the following NASA Exoplanet Archive data:

{json.dumps(planet, indent=2)}

Write a short, friendly explanation of this planet.

Explain:
1. What makes this planet interesting.
2. How its size compares with Earth.
3. What its orbital period means.
4. What its equilibrium temperature and stellar
   flux may tell us about its environment.
5. What we know and do not know about its
   potential habitability.

Important rules:
- Use simple English.
- Only use the supplied NASA measurements
  for planet-specific scientific claims.
- Do not invent missing measurements.
- Explain that equilibrium temperature is
  not the confirmed surface temperature.
- Do not claim that the planet supports life.
- If information is unknown, say so.
- Keep the response around 150 to 200 words.
"""

    response = client.models.generate_content(
        model=MODEL_NAME,
        contents=prompt
    )

    if not response.text:
        raise ValueError("Gemini returned an empty explanation.")

    return response.text


if __name__ == "__main__":
    planets = get_planets()

    if not planets:
        print("No planets were found.")
    else:
        planet = planets[0]

        print("Generating AI explanation for:", planet["pl_name"])
        print()

        explanation = explain_planet(planet)

        print(explanation)
