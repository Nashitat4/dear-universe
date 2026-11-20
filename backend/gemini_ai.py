
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
You are a friendly science educator and space storyteller
for a website called "Dear Universe."

Your job is to make exoplanets exciting to explore while
keeping all scientific information accurate.

NASA Exoplanet Archive data:
{json.dumps(planet, indent=2)}

Write an explanation using these three sections:

1. A WORLD BEYOND EARTH
Start with 2-3 interesting sentences that introduce the
planet. Make the reader curious about what makes it unique.
Use a fun, imaginative tone, but do not invent facts.

2. WHAT SCIENCE TELLS US
Explain the planet's available NASA measurements in
simple English.

Include:
- How its size compares with Earth, if known.
- What its orbital period means.
- What its equilibrium temperature means, if available.
- What stellar flux tells us about energy from its star,
  if available.

Use easy comparisons to help beginners understand.

3. COULD LIFE EXIST HERE?
Explain whether the available measurements suggest
conditions that might be suitable for life.

Clearly explain:
- What scientists know from the supplied data.
- What remains unknown.
- Why habitability cannot be confirmed from these
  measurements alone.

IMPORTANT SCIENTIFIC RULES:
- Use NASA measurements supplied above.
- Never invent numbers or missing measurements.
- Do not claim that life has been discovered.
- Do not assume that a planet has water or an atmosphere.
- Equilibrium temperature is an estimate, not a
  confirmed surface temperature.
- Distinguish measurements from scientific possibilities.
- Do not invent historical facts or discovery details.
- If data is missing, explain that it is unknown.
- Do not assume that every planet is potentially habitable.
- Avoid repeating the same information in different sections.

WRITING STYLE:
- Simple English suitable for beginners.
- Friendly, exciting, and scientifically responsible.
- Use short paragraphs.
- Avoid complicated astronomy terms without explanation.
- Around 180-220 words total.
- Use the three section headings exactly as written.

- Start directly with the first section heading.
- Do not add greetings or introductory text before it.
- Do not use Markdown symbols such as ### or **.
- Do not assume a planet is rocky, gaseous, ocean-covered,
  or has a solid surface based only on its radius.
- A planet's size alone does not confirm its composition.
- If NASA data does not provide enough information about
  composition, say that its composition is uncertain.
- You may use terms like "super-Earth" to describe a
  planet's size, but explain that this does not mean
  it is confirmed to be rocky or Earth-like.
- Do not claim that a planet has an atmosphere, liquid
  water, or life unless supported by the supplied data.
- Clearly distinguish measurements, scientific
  interpretations, and unknown information.
- Do not describe a planet as a major research target
  unless the supplied data supports that statement.
- Do not claim that a planet has a solid surface.
- Avoid definite statements about melting, oceans,
  weather, or surface conditions when these are unknown.
- Do not add dramatic scientific claims just to make
  the explanation sound exciting.
- Keep the introduction interesting, but make sure
  every scientific claim is supported by the data.
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
