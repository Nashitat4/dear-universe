
const exploreButton = document.getElementById("exploreBtn");
const planetContainer = document.getElementById("planet-container");

let allPlanets = [];

exploreButton.addEventListener("click", function () {
    document.getElementById("explore").scrollIntoView({
        behavior: "smooth"
    });
});


function formatValue(value, decimals = 2) {
    if (value === null || value === undefined) {
        return "Unknown";
    }

    return Number(value).toFixed(decimals);
}


function measurement(value, unit, decimals = 2) {
    if (value === null || value === undefined) {
        return "Unknown";
    }

    return formatValue(value, decimals) + " " + unit;
}


function createDetail(label, value) {
    const paragraph = document.createElement("p");

    const strong = document.createElement("strong");
    strong.textContent = label + ": ";

    paragraph.appendChild(strong);
    paragraph.appendChild(document.createTextNode(value));

    return paragraph;
}


// Display all floating planets
function showAllPlanets() {
    planetContainer.innerHTML = "";

    allPlanets.forEach(function (planet, index) {
        const item = document.createElement("div");
        item.className = "planet-item";

        const planetButton = document.createElement("button");
        planetButton.className = "planet-visual-button";
        planetButton.type = "button";

        planetButton.setAttribute(
            "aria-label",
            "Explore " + planet.pl_name
        );

        const planetVisual = document.createElement("span");
        planetVisual.className =
            "planet-sphere planet-style-" + (index % 10);

        planetVisual.setAttribute("aria-hidden", "true");
        planetButton.appendChild(planetVisual);

        const name = document.createElement("h3");
        name.textContent = planet.pl_name;

        const information = document.createElement("div");
        information.className = "planet-information";

        information.appendChild(
            createDetail("Host Star", planet.hostname || "Unknown")
        );

        information.appendChild(
            createDetail(
                "Radius",
                measurement(planet.pl_rade, "Earth radii")
            )
        );

        information.appendChild(
            createDetail(
                "Orbital Period",
                measurement(planet.pl_orbper, "days")
            )
        );

        const exploreLink = document.createElement("button");
        exploreLink.className = "planet-explore-link";
        exploreLink.type = "button";
        exploreLink.textContent = "Explore Planet →";

        function openDetails() {
            showPlanetDetails(planet, index);
        }

        planetButton.addEventListener("click", openDetails);
        exploreLink.addEventListener("click", openDetails);

        item.appendChild(planetButton);
        item.appendChild(name);
        item.appendChild(information);
        item.appendChild(exploreLink);

        planetContainer.appendChild(item);
    });
}


// Display one planet's details
function showPlanetDetails(planet, index) {
    planetContainer.innerHTML = "";

    const detailView = document.createElement("div");
    detailView.className = "planet-detail-view";

    const backButton = document.createElement("button");
    backButton.className = "planet-back-button";
    backButton.type = "button";
    backButton.textContent = "← Back to All Planets";

    backButton.addEventListener("click", showAllPlanets);

    const visual = document.createElement("div");
    visual.className =
        "planet-sphere planet-detail-sphere planet-style-" +
        (index % 10);

    visual.setAttribute("aria-hidden", "true");

    const content = document.createElement("div");
    content.className = "planet-detail-content";

    const title = document.createElement("h3");
    title.textContent = planet.pl_name;

    const subtitle = document.createElement("p");
    subtitle.className = "detail-subtitle";
    subtitle.textContent =
        "Explore the scientific measurements of this distant world.";

    const measurements = document.createElement("div");
    measurements.className = "planet-detail-measurements";

    const details = [
        ["Host Star", planet.hostname || "Unknown"],
        ["Radius", measurement(planet.pl_rade, "Earth radii")],
        ["Equilibrium Temperature", measurement(planet.pl_eqt, "K", 0)],
        ["Orbital Period", measurement(planet.pl_orbper, "days")],
        ["Stellar Flux", measurement(planet.pl_insol, "Earth flux")],
        ["Distance", measurement(planet.sy_dist, "parsecs")]
    ];

    details.forEach(function (detail) {
        measurements.appendChild(
            createDetail(detail[0], detail[1])
        );
    });

    const note = document.createElement("p");
    note.className = "planet-science-note";
    note.textContent =
        "Data source: NASA Exoplanet Archive. " +
        "Equilibrium temperature is an estimate, not a confirmed " +
        "surface temperature. Planet appearance is an artistic illustration.";

    // AI explanation section
    const aiSection = document.createElement("div");
    aiSection.style.marginTop = "35px";

    const aiButton = document.createElement("button");
    aiButton.type = "button";
    aiButton.className = "planet-explore-link";
    aiButton.textContent = "✦ Explain with Gemini AI";
    aiButton.style.fontSize = "15px";
    aiButton.style.padding = "14px 22px";

    const aiResult = document.createElement("div");
    aiResult.style.marginTop = "25px";
    aiResult.style.color = "#d5def4";
    aiResult.style.lineHeight = "1.9";
    aiResult.style.whiteSpace = "pre-wrap";

    aiButton.addEventListener("click", async function () {
        aiButton.disabled = true;
        aiButton.textContent = "Generating explanation...";

        aiResult.textContent =
            "Gemini is studying NASA's measurements. Please wait...";

        try {
            const response = await fetch("/api/explain", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    planet_name: planet.pl_name
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.error || "Unable to generate explanation."
                );
            }

            aiResult.textContent = result.explanation;
            aiButton.textContent = "✦ Generate Again";

        } catch (error) {
            console.error(error);

            aiResult.textContent =
                "Sorry, the AI explanation could not be generated. " +
                "Please try again.";

            aiButton.textContent = "✦ Try Again";
        } finally {
            aiButton.disabled = false;
        }
    });

    aiSection.appendChild(aiButton);
    aiSection.appendChild(aiResult);

    content.appendChild(title);
    content.appendChild(subtitle);
    content.appendChild(measurements);
    content.appendChild(note);
    content.appendChild(aiSection);

    detailView.appendChild(backButton);
    detailView.appendChild(visual);
    detailView.appendChild(content);

    planetContainer.appendChild(detailView);
}


// Retrieve NASA data through Flask
async function loadPlanets() {
    try {
        const response = await fetch("/api/planets");

        if (!response.ok) {
            throw new Error("Unable to retrieve NASA data.");
        }

        allPlanets = await response.json();

        if (allPlanets.length === 0) {
            planetContainer.textContent = "No planets were found.";
            return;
        }

        showAllPlanets();

    } catch (error) {
        console.error(error);

        planetContainer.textContent =
            "Unable to load planets. Please try again later.";
    }
}


loadPlanets();
