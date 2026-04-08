// ============================================
// BloomWay — Travel Recommendation Search Logic
// ============================================

let travelData = null;
let timeUpdateInterval = null;

// ============================================
// COUNTRY ALIASES
// ============================================
const COUNTRY_ALIASES = {
  "united states": ["usa", "us", "america", "united states", "new york", "nyc", "ny"],
  "japan": ["japan", "japón", "japon", "tokyo", "kyoto"],
  "australia": ["australia", "sydney", "melbourne"],
  "brazil": ["brazil", "brasil", "rio", "sao paulo", "são paulo"]
};

// ============================================
// LOAD DATA
// ============================================
fetch("TravelData.json")
  .then((response) => {
    if (!response.ok) throw new Error("Failed to load TravelData.json");
    return response.json();
  })
  .then((data) => {
    travelData = data;
    console.log("Travel data loaded successfully");

    // If we landed on home with a ?q= URL param, run that search
    const urlParams = new URLSearchParams(window.location.search);
    const queryParam = urlParams.get("q");
    if (queryParam) {
      const input = document.getElementById("searchInput");
      if (input) input.value = queryParam;
      handleSearch();
    }

    // If we're on the booking page, populate it
    if (document.getElementById("bookingHero")) {
      populateBookingPage();
    }
  })
  .catch((error) => {
    console.error("Error loading travel data:", error);
  });

// ============================================
// SEARCH HANDLER
// ============================================
function handleSearch() {
  const input = document.getElementById("searchInput");
  if (!input) return;

  const resultsContainer = document.getElementById("results");

  // Cross-page search: redirect to home if no results container
  if (!resultsContainer) {
    const query = input.value.trim();
    if (!query) return;
    window.location.href = `index.html?q=${encodeURIComponent(query)}`;
    return;
  }

  const query = input.value.toLowerCase().trim();

  if (!query) {
    resultsContainer.innerHTML =
      '<p class="results__message">Please enter a search term.</p>';
    return;
  }

  if (!travelData) {
    resultsContainer.innerHTML =
      '<p class="results__message">Travel data is still loading. Please try again in a moment.</p>';
    return;
  }

  let recommendations = [];

  if (query.includes("beach")) {
    recommendations = travelData.beaches;
  } else if (query.includes("temple")) {
    recommendations = travelData.temples;
  } else if (query.includes("countr")) {
    recommendations = travelData.countries.flatMap((c) => c.cities);
  } else {
    let matchedCountryName = null;
    for (const [canonical, aliases] of Object.entries(COUNTRY_ALIASES)) {
      if (aliases.some((alias) => query.includes(alias))) {
        matchedCountryName = canonical;
        break;
      }
    }

    if (matchedCountryName) {
      const country = travelData.countries.find(
        (c) => c.name.toLowerCase() === matchedCountryName
      );
      if (country) recommendations = country.cities;
    } else {
      const direct = travelData.countries.find((c) =>
        c.name.toLowerCase().includes(query)
      );
      if (direct) recommendations = direct.cities;
    }
  }

  renderResults(recommendations, query);
}

// ============================================
// RENDER RESULTS
// ============================================
function renderResults(items, query) {
  const resultsContainer = document.getElementById("results");
  if (!resultsContainer) return;

  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
    timeUpdateInterval = null;
  }

  if (!items || items.length === 0) {
    resultsContainer.innerHTML = `
      <p class="results__message">
        No recommendations found for "<strong>${escapeHtml(query)}</strong>".
        Try searching for <em>beach</em>, <em>temple</em>, <em>country</em>, or a country name.
      </p>`;
    return;
  }

  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const banner = `
    <div class="results__banner">
      <i class="fa-solid fa-clock"></i>
      Your local time (<span>${userTimeZone}</span>):
      <strong id="userLocalTime">${formatTime(new Date(), userTimeZone)}</strong>
    </div>`;

  const cards = items
    .map(
      (item, idx) => `
      <article class="result-card" data-destination="${escapeHtml(item.name)}">
        <img src="${item.imageUrl}" alt="${escapeHtml(item.name)}" />
        <div class="result-card__body">
          <h3 class="result-card__title">${escapeHtml(item.name)}</h3>
          <p class="result-card__desc">${escapeHtml(item.description)}</p>
          ${
            item.timeZone
              ? `<p class="result-card__time">
                   <i class="fa-solid fa-globe"></i>
                   Local time: <strong data-tz="${item.timeZone}" id="tz-${idx}">${formatTime(
                  new Date(),
                  item.timeZone
                )}</strong>
                 </p>`
              : ""
          }
          <button class="btn btn--card-book" data-destination="${escapeHtml(item.name)}">
            <i class="fa-solid fa-plane-departure"></i> Book this trip
          </button>
        </div>
      </article>`
    )
    .join("");

  resultsContainer.innerHTML = banner + cards;

  // Update clocks every second
  timeUpdateInterval = setInterval(() => {
    const now = new Date();
    const userClock = document.getElementById("userLocalTime");
    if (userClock) userClock.textContent = formatTime(now, userTimeZone);

    document.querySelectorAll("[data-tz]").forEach((el) => {
      el.textContent = formatTime(now, el.getAttribute("data-tz"));
    });
  }, 1000);

  // Attach click handlers to cards and book buttons
  document.querySelectorAll(".result-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      // Don't double-fire if user clicked the button (it has its own listener)
      if (e.target.closest(".btn--card-book")) return;
      const dest = card.getAttribute("data-destination");
      goToBooking(dest);
    });
  });

  document.querySelectorAll(".btn--card-book").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const dest = btn.getAttribute("data-destination");
      goToBooking(dest);
    });
  });

  resultsContainer.scrollIntoView({ behavior: "smooth", block: "start" });
}

// ============================================
// CLEAR HANDLER
// ============================================
function handleClear() {
  const input = document.getElementById("searchInput");
  const resultsContainer = document.getElementById("results");

  if (input) input.value = "";
  if (resultsContainer) resultsContainer.innerHTML = "";

  if (timeUpdateInterval) {
    clearInterval(timeUpdateInterval);
    timeUpdateInterval = null;
  }
}

// ============================================
// BOOKING NAVIGATION
// ============================================
function goToBooking(destinationName) {
  if (!destinationName) return;
  window.location.href = `booking.html?destination=${encodeURIComponent(destinationName)}`;
}

function bookRandomDestination() {
  if (!travelData) {
    alert("Travel data is still loading. Please try again in a moment.");
    return;
  }
  const all = [
    ...travelData.countries.flatMap((c) => c.cities),
    ...travelData.temples,
    ...travelData.beaches
  ];
  const random = all[Math.floor(Math.random() * all.length)];
  goToBooking(random.name);
}

// ============================================
// BOOKING PAGE POPULATION
// ============================================
function populateBookingPage() {
  const params = new URLSearchParams(window.location.search);
  const destinationName = params.get("destination");

  if (!destinationName) {
    document.getElementById("bookingTitle").textContent = "No destination selected";
    document.getElementById("bookingDates").textContent = "Please go back and pick a trip.";
    return;
  }

  // Search the destination across all categories
  const all = [
    ...travelData.countries.flatMap((c) => c.cities),
    ...travelData.temples,
    ...travelData.beaches
  ];
  const item = all.find((i) => i.name === destinationName);

  if (!item) {
    document.getElementById("bookingTitle").textContent = "Destination not found";
    return;
  }

  // Generate deterministic booking details from the name
  const details = getBookingDetails(item.name);

  // Set hero background image
  const hero = document.getElementById("bookingHero");
  hero.style.backgroundImage = `url("${item.imageUrl}")`;

  // Strip ", Country" from the display title
  const cleanName = item.name.split(",")[0].trim().toUpperCase();
  const region = item.name.split(",").slice(1).join(",").trim();

  document.getElementById("bookingLabel").textContent = region || "DESTINATION";
  document.getElementById("bookingTitle").textContent = cleanName;
  document.getElementById("bookingDates").textContent = details.dateString;

  // Info icons
  document.getElementById("infoDuration").textContent = `${details.duration} days`;
  document.getElementById("infoSpots").textContent = `${details.spots} available`;
  document.getElementById("infoPrice").textContent = formatPrice(details.price);

  // Quote
  document.getElementById("bookingQuote").textContent = `"${item.description}"`;

  // Payment summary
  document.getElementById("summaryDestination").textContent = item.name;
  document.getElementById("summaryDates").textContent = details.dateString;
  document.getElementById("summaryPrice").textContent = formatPrice(details.price);
  document.getElementById("payAmount").textContent = formatPrice(details.price);

  // Page title
  document.title = `${cleanName} — BloomWay`;
}

// ============================================
// DETERMINISTIC BOOKING DETAILS GENERATOR
// ============================================
function getBookingDetails(name) {
  // Simple hash from string
  const hash = name.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  const dateOptions = [
    "September 12 — 23, 2026",
    "September 26 — October 7, 2026",
    "October 4 — 15, 2026",
    "October 18 — 29, 2026",
    "November 8 — 19, 2026",
    "November 22 — December 3, 2026",
    "December 6 — 17, 2026"
  ];

  // Price between 8000 and 16000, rounded to nearest 100
  const priceRaw = 8000 + ((hash * 137) % 8001);
  const price = Math.round(priceRaw / 100) * 100;

  // Spots between 4 and 18
  const spots = 4 + (hash % 15);

  return {
    dateString: dateOptions[hash % dateOptions.length],
    duration: 12,
    spots: spots,
    price: price
  };
}

// ============================================
// HELPERS
// ============================================
function formatTime(date, timeZone) {
  try {
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }).format(date);
  } catch (e) {
    return "—";
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ============================================
// EVENT LISTENERS
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearBtn");
  const searchInput = document.getElementById("searchInput");
  const bookNowBtn = document.querySelector(".btn--book");

  if (searchBtn) searchBtn.addEventListener("click", handleSearch);
  if (clearBtn) clearBtn.addEventListener("click", handleClear);

  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSearch();
    });
  }

  // Hero "BOOK NOW" button → random destination
  if (bookNowBtn) {
    bookNowBtn.addEventListener("click", bookRandomDestination);
  }
});
