
const exploreButton = document.getElementById("exploreBtn");
const planetContainer = document.getElementById("planet-container");

let allPlanets = [];

// Scroll to the planet gallery
exploreButton.addEventListener("click", function () {
    document.getElementById("explore").scrollIntoView({
        behavior: "smooth"
    });
});


// Format numbers
function formatValue(value, decimals = 2) {
    if (value === null || value === undefined) {
        return "Unknown";
    }

    return Number(value).toFixed(decimals);
}


// Format NASA measurements
function measurement(value, unit, decimals = 2) {
    if (value === null || value === undefined) {
        return "Unknown";
    }

    return formatValue(value, decimals) + " " + unit;
}


// Create a measurement label and value
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
        exploreLink.textContent = "Explore Planet";

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


// Display Gemini's explanation in separate sections
function displayExplanation(container, explanation) {
    container.replaceChildren();

    const headings = [
        "A WORLD BEYOND EARTH",
        "WHAT SCIENCE TELLS US",
        "COULD LIFE EXIST HERE?"
    ];

    // Remove Markdown formatting
    const cleaned = explanation
        .replace(/[*#]/g, "")
        .replace(/\r/g, "")
        .trim();

    // Find the three headings
    const headingPattern =
        /(A WORLD BEYOND EARTH|WHAT SCIENCE TELLS US|COULD LIFE EXIST HERE\?)/gi;

    const parts = cleaned.split(headingPattern);

    let currentSection = null;

    parts.forEach(function (part) {
        const text = part.trim();

        if (!text) {
            return;
        }

        const normalized = text
            .replace(/^\d+\.\s*/, "")
            .replace(/:$/, "")
            .trim()
            .toUpperCase();

        if (headings.includes(normalized)) {
            currentSection = document.createElement("section");
            currentSection.className = "planet-ai-story-section";

            const heading = document.createElement("h3");
            heading.textContent = text.replace(/:$/, "");

            currentSection.appendChild(heading);
            container.appendChild(currentSection);
        } else {
            const paragraph = document.createElement("p");
            paragraph.textContent = text;

            if (currentSection) {
                currentSection.appendChild(paragraph);
            } else {
                container.appendChild(paragraph);
            }
        }
    });
}


// Display one planet's details
function showPlanetDetails(planet, index) {
    planetContainer.innerHTML = "";

    const detailView = document.createElement("div");
    detailView.className = "planet-detail-view";

    // Back button
    const backButton = document.createElement("button");
    backButton.className = "planet-back-button";
    backButton.type = "button";
    backButton.textContent = "Back to All Planets";

    backButton.addEventListener("click", showAllPlanets);

    // Artistic planet illustration
    const visual = document.createElement("div");
    visual.className =
        "planet-sphere planet-detail-sphere planet-style-" +
        (index % 10);

    visual.setAttribute("aria-hidden", "true");

    // Planet information
    const content = document.createElement("div");
    content.className = "planet-detail-content";

    const title = document.createElement("h3");
    title.textContent = planet.pl_name;

    const subtitle = document.createElement("p");
    subtitle.className = "detail-subtitle";
    subtitle.textContent =
        "Explore the scientific measurements of this distant world.";

    // NASA measurements
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

    // Scientific disclaimer
    const note = document.createElement("p");
    note.className = "planet-science-note";
    note.textContent =
        "Data source: NASA Exoplanet Archive. " +
        "Equilibrium temperature is an estimate, not a confirmed " +
        "surface temperature. Planet appearance is an artistic illustration.";

    // A Letter from the Universe section
    const aiSection = document.createElement("section");
    aiSection.className = "planet-ai-section";

    const aiEyebrow = document.createElement("p");
    aiEyebrow.className = "planet-ai-eyebrow";
    aiEyebrow.textContent = "THE STORY BEHIND THE SCIENCE";

    const aiHeading = document.createElement("h2");
    aiHeading.className = "planet-ai-heading";
    aiHeading.textContent = "A Letter from the Universe";

    const aiDescription = document.createElement("p");
    aiDescription.className = "planet-ai-description";
    aiDescription.textContent =
        "Every planet has a story. Discover what science reveals " +
        "about " + planet.pl_name + ".";

    // Gemini explanation button
    const aiButton = document.createElement("button");
    aiButton.type = "button";
    aiButton.className = "planet-ai-button";
    aiButton.textContent = "Unfold Its Story";

    // Explanation results
    const aiResult = document.createElement("div");
    aiResult.className = "planet-ai-result";
    aiResult.setAttribute("aria-live", "polite");

    // Gemini and NASA attribution
    const aiCredit = document.createElement("p");
    aiCredit.className = "planet-ai-credit";
    aiCredit.textContent =
        "Powered by Gemini AI · Data from NASA Exoplanet Archive";

    // Generate explanation using Flask and Gemini
    aiButton.addEventListener("click", async function () {
        aiButton.disabled = true;
        aiButton.textContent = "Discovering this world...";

        aiResult.textContent =
            "Reading the measurements of this distant world...";

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

            if (
                typeof result.explanation !== "string" ||
                !result.explanation.trim()
            ) {
                throw new Error("Gemini returned an empty explanation.");
            }

            displayExplanation(aiResult, result.explanation);

            aiButton.textContent = "Story Unfolded";
            aiButton.disabled = true;

        } catch (error) {
            console.error(error);

            aiResult.textContent =
                "The story could not be loaded. Please try again.";

            aiButton.textContent = "Try Again";

            } finally {
                if (aiButton.textContent === "Try Again") {
                    aiButton.disabled = false;
                }
            }
    });

    // Build AI section
    aiSection.appendChild(aiEyebrow);
    aiSection.appendChild(aiHeading);
    aiSection.appendChild(aiDescription);
    aiSection.appendChild(aiButton);
    aiSection.appendChild(aiResult);
    aiSection.appendChild(aiCredit);

    // Build planet information
    content.appendChild(title);
    content.appendChild(subtitle);
    content.appendChild(measurements);
    content.appendChild(note);

    // Build individual planet page
    detailView.appendChild(backButton);
    detailView.appendChild(visual);
    detailView.appendChild(content);
    detailView.appendChild(aiSection);

    planetContainer.appendChild(detailView);

    // Move to the top of the planet section
    document.getElementById("explore").scrollIntoView({
        behavior: "smooth"
    });
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


// Start the application
loadPlanets();
