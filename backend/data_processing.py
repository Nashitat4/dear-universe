
import requests

NASA_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync"

PLANET_NAMES = [
    "Kepler-186 f",
    "Kepler-452 b",
    "Kepler-22 b",
    "TRAPPIST-1 e",
    "TRAPPIST-1 f",
    "TRAPPIST-1 g",
    "Proxima Cen b",
    "TOI-700 d",
    "TOI-700 e",
    "LHS 1140 b"
]


def get_planets():
    names = ", ".join(
        "'" + name.replace("'", "''") + "'"
        for name in PLANET_NAMES
    )

    query = f"""
    SELECT
        pl_name,
        pl_rade,
        pl_eqt,
        pl_orbper,
        pl_insol,
        sy_dist,
        hostname
    FROM pscomppars
    WHERE pl_name IN ({names})
    """

    response = requests.get(
        NASA_URL,
        params={
            "query": query,
            "format": "json"
        },
        timeout=30
    )

    response.raise_for_status()

    planets = response.json()

    # Keep the planets in our chosen order
    planet_lookup = {
        planet["pl_name"]: planet
        for planet in planets
    }

    return [
        planet_lookup[name]
        for name in PLANET_NAMES
        if name in planet_lookup
    ]


if __name__ == "__main__":
    planets = get_planets()

    print(f"Retrieved {len(planets)} planets from NASA.")

    for planet in planets:
        print(planet)
