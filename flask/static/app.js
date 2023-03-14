$(document).ready(function () {
  const geocoding_url = `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyAQb5xT6gDIRGuhXOvTcnU_E2lvQaS5GuU`;
  const locationCheckbox = document.querySelector(".loc-checkbox");
  const locationBox = $("#location");

  var locationInput = document.querySelector(".location-input-field");
  var categoryInput = document.querySelector(".category-input-field");
  var distanceInput = document.querySelector(".distance-input-field");
  var keywordInput = document.querySelector(".keyword-input-field");
  var eventDetailsHeading = document.querySelector(".event-details-heading");
  var events;
  var event_details;
  var venue_details;

  const eventsTableConatiner = document.querySelector(
    ".events-table-container"
  );
  const eventDetails = document.querySelector(".event-details");
  const venue_details_container = document.querySelector(
    ".venue-details-container"
  );

  const cardHolder = eventDetails.querySelector(".card-holder");

  const arrow = document.querySelector(".arrow");
  const arrow_container = document.querySelector(".arrow-container");

  var venue_name_holder = document.querySelector(".venue-details-heading");
  var venue_address_line1_holder = document.querySelector(".address-line1");
  var venue_city_state_code = document.querySelector(".city-state-code");
  var postal_code = document.querySelector(".postal-code");
  var venue_details_url = document.querySelector(".venue-more-events-link");
  var google_maps_link_holder = document.querySelector(".address-google-link");
  var venue_image = document.querySelector(".venue-image");
  var venue_image_div = document.querySelector(".venue-image-div");

  const form = $("#searchForm");
  const errorMessage = document.querySelector(".error-paragraph");
  const ipKey = "158f827e48dd95";
  const backend = "https://ticketmaster-377704.wl.r.appspot.com";
  let lat;
  let lng;
  let ipData;

  function setContainersDisplayNone() {
    eventsTableConatiner.style.display = "none";
    eventDetails.style.display = "none";
    venue_details_container.style.display = "none";
    arrow_container.style.display = "none";
    errorMessage.style.display = "none";
  }

  setContainersDisplayNone();

  //   const submit_button = document.querySelector(".submit-btn");
  console.log("Hello");
  async function displayVenueDetails() {
    console.log("Arrow container");
    arrow_container.style.display = "none";
    venue_details_container.style.display = "flex";
    console.log("Venue Name is ", event_details._embedded.venues[0].name);
    venue_details = await getVenueDetails(
      event_details._embedded.venues[0].name
    );
    venue_details = venue_details.data;
    console.log("Venue Details", venue_details);

    console.log("Venue Details Below ");
    console.log("Name:", venue_details.name);
    console.log("Address:", venue_details.address.line1);
    console.log("City:", venue_details.city.name);
    console.log("State Code:", venue_details.state.stateCode);
    console.log("Postal Code:", venue_details.postalCode);
    console.log("Url:", venue_details.url);

    var google_query = "";
    const google_link = "https://www.google.com/maps/search/?api=1&query=";

    if (venue_details.name != "N/A") {
      venue_name_holder.textContent = venue_details.name;
      google_query += venue_details.name;
      venue_name_holder.style.display = "flex";
    } else {
      venue_name_holder.style.display = "none";
    }
    if (venue_details.address.line1 != "N/A") {
      venue_address_line1_holder.textContent = venue_details.address.line1;
      venue_address_line1_holder.style.display = "flex";
      if (google_query == "") {
        google_query = venue_details.address.line1;
      } else {
        google_query += ", " + venue_details.address.line1;
      }
    } else {
      venue_address_line1_holder.style.display = "none";
    }
    let city_state = "";
    if (venue_details.city.name != "N/A") {
      city_state += venue_details.city.name;
      if (google_query == "") {
        google_query = venue_details.city.name;
      } else {
        google_query += ", " + venue_details.city.name;
      }
    }
    if (venue_details.state.stateCode != "N/A") {
      city_state += ", " + venue_details.state.stateCode;
      if (google_query == "") {
        google_query = venue_details.state.stateCode;
      } else {
        google_query += ", " + venue_details.state.stateCode;
      }
    }
    if (city_state != "") {
      venue_city_state_code.textContent = city_state;
      venue_city_state_code.style.display = "flex";
    } else {
      venue_city_state_code.style.display = "none";
    }
    if (venue_details.postalCode != "N/A") {
      postal_code.textContent = venue_details.postalCode;
      postal_code.style.display = "flex";
      if (google_query == "") {
        google_query = venue_details.postalCode;
      } else {
        google_query += ", " + venue_details.postalCode;
      }
    } else {
      postal_code.style.display = "none";
    }
    if (venue_details.url != "N/A") {
      venue_details_url.href = venue_details.url;
      venue_details_url.target = "_blank";
      venue_details_url.style.display = "flex";
    } else {
      venue_details_url.style.display = "none";
    }

    if (venue_details.images && venue_details.images[0].url != "N/A") {
      console.log("Inside image scope");
      console.log("The url is ", venue_details.images[0].url);
      venue_image_div.style.display = "flex";
      venue_image.setAttribute("src", venue_details.images[0].url);
      venue_image.setAttribute("alt", "venue_image");
    } else {
      console.log("Inside no image url");
      venue_image_div.style.display = "none";
    }

    if (google_query != "") {
      google_maps_link_holder.href =
        google_link + encodeURIComponent(google_query);
      google_maps_link_holder.target = "_blank";
    } else {
      google_maps_link_holder.href = "#";
    }
    // window.scrollTo(0, document.body.scrollHeight);
    document.documentElement.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }

  async function getVenueDetails(venueName) {
    try {
      let venueNameQuery;
      venue_name_list = venueName.split(" ");
      venueNameQuery = venue_name_list.join("+");
      console.log("Venue Name Query is ", venueNameQuery);
      const response = await fetch(backend + `/venues/${venueName}`);
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async function sendEventDetailApiRequest(event_id) {
    const response = await fetch(backend + "/event/" + event_id);
    event_details = await response.json();
    console.log(event_details);
  }

  async function displayEventDetails(event_id) {
    await sendEventDetailApiRequest(event_id);
    venue_details_container.style.display = "none";
    arrow_container.style.display = "flex";
    eventDetails.style.display = "flex";
    const eventData = event_details;
    // clear any existing content in card holder
    cardHolder.innerHTML = "";

    // create a card element
    const card = document.createElement("div");
    card.classList.add("card");

    const seatMapImgUrl = eventData.seatmap && eventData.seatmap.staticUrl;
    if (seatMapImgUrl) {
      const seatMapImg = document.createElement("img");
      seatMapImg.classList.add("seatmap");
      seatMapImg.src = seatMapImgUrl;
      card.appendChild(seatMapImg);
    }

    // create a content element to hold all the event details
    const content = document.createElement("div");
    content.classList.add("card-content");

    // add event date and time
    if (eventData.dates && eventData.dates.start) {
      const header = document.createElement("p");
      header.classList.add("event-detail-headers");
      header.textContent = "Date";
      content.append(header);
      const dateTime = document.createElement("p");
      dateTime.classList.add("event-detail-values");
      const date = eventData.dates.start.localDate;
      const time = eventData.dates.start.localTime;
      dateTime.textContent = `${date} ${time}`;
      content.appendChild(dateTime);
    }

    // add event name
    if (eventData.name) {
      eventDetailsHeading.textContent = eventData.name;
    }

    // add artist/team name
    if (eventData._embedded && eventData._embedded.attractions) {
      const header = document.createElement("p");
      header.classList.add("event-detail-headers");
      header.textContent = "Artist/Team";
      content.append(header);

      const attractions = eventData._embedded.attractions;
      attractions
        .map((attraction) => {
          return { name: attraction.name, url: attraction.url };
        })
        .forEach((artist, index) => {
          let suffix = "";
          if (index < attractions.length - 1) {
            suffix = " | ";
          }
          const artistElement = document.createElement("a");
          artistElement.classList.add("event-detail-anchor");
          artistElement.href = artist.url;
          artistElement.textContent = artist.name + suffix;
          artistElement.target = "_blank";
          content.appendChild(artistElement);
        });
    }

    // add venue name
    if (
      eventData._embedded &&
      eventData._embedded.venues &&
      eventData._embedded.venues.length > 0
    ) {
      const header = document.createElement("p");
      header.classList.add("event-detail-headers");
      header.textContent = "Venue";
      content.append(header);

      const venue = eventData._embedded.venues[0];
      const venueName = document.createElement("p");
      venueName.classList.add("event-detail-values");
      venueName.textContent = venue.name;
      content.appendChild(venueName);
    }

    // add genre
    if (eventData.classifications) {
      const header = document.createElement("p");
      header.classList.add("event-detail-headers");
      header.textContent = "Genres";
      content.append(header);

      const classifications = eventData.classifications[0];
      const genres = [];
      console.log("Inside Classification");
      console.log(classifications);
      if (
        classifications.segment &&
        classifications.segment.name != "Undefined"
      ) {
        genres.push(classifications.segment.name);
      }
      if (classifications.genre && classifications.genre.name != "Undefined") {
        genres.push(classifications.genre.name);
      }
      if (
        classifications.subGenre &&
        classifications.subGenre.name != "Undefined"
      ) {
        genres.push(classifications.subGenre.name);
      }
      if (
        classifications.subType &&
        classifications.subType.name != "Undefined"
      ) {
        genres.push(classifications.subType.name);
      }
      if (classifications.type && classifications.type.name != "Undefined") {
        genres.push(classifications.type.name);
      }
      if (genres.length > 0) {
        const genre = document.createElement("p");
        genre.classList.add("event-detail-values");
        genre.textContent = genres.join(" | ");
        content.appendChild(genre);
      }
    }

    // add price range
    if (eventData.priceRanges && eventData.priceRanges.length > 0) {
      const header = document.createElement("p");
      header.classList.add("event-detail-headers");
      header.textContent = "Price Ranges";
      content.append(header);

      const priceRange = eventData.priceRanges[0];
      const price = document.createElement("p");
      price.classList.add("event-detail-values");
      price.textContent = `${priceRange.min} - ${priceRange.max} USD`;
      content.appendChild(price);
    }

    // add ticket status
    if (eventData.dates && eventData.dates.status) {
      const header = document.createElement("p");
      header.classList.add("event-detail-headers");
      header.textContent = "Ticket Status";
      content.append(header);

      const status = eventData.dates.status;
      const ticketStatus = document.createElement("p");
      ticketStatus.classList.add("event-detail-values");
      ticketStatus.textContent = status.code;

      switch (status.code) {
        case "onsale": {
          console.log("Inside On Sale");
          ticketStatus.classList.add(
            "event-details-card__ticket-status--onsale"
          );
          ticketStatus.textContent = "On Sale";
          break;
        }
        case "offsale": {
          ticketStatus.classList.add(
            "event-details-card__ticket-status--offsale"
          );
          ticketStatus.textContent = "Off Sale";
          break;
        }
        case "cancelled": {
          ticketStatus.classList.add(
            "event-details-card__ticket-status--cancelled"
          );
          ticketStatus.textContent = "Cancelled";
          break;
        }
        case "postponed": {
          ticketStatus.classList.add(
            "event-details-card__ticket-status--postponed"
          );
          ticketStatus.textContent = "Postponed";
          break;
        }

        case "rescheduled": {
          ticketStatus.classList.add(
            "event-details-card__ticket-status--postponed"
          );
          ticketStatus.textContent = "Rescheduled";
          break;
        }

        default:
          break;
      }

      content.appendChild(ticketStatus);
    }

    // add buy ticket url
    if (eventData.url) {
      const header = document.createElement("p");
      header.classList.add("event-detail-headers");
      header.textContent = "Buy Ticket At";
      content.append(header);

      const buyTicket = document.createElement("a");
      buyTicket.classList.add("event-detail-anchor");
      buyTicket.href = eventData.url;
      buyTicket.textContent = "Ticketmaster";
      buyTicket.target = "_blank";
      content.appendChild(buyTicket);
    }

    cardHolder.appendChild(content);
    cardHolder.appendChild(card);
    arrow.removeEventListener("click", displayVenueDetails);
    arrow.addEventListener("click", displayVenueDetails);
    document.documentElement.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }

  async function sendApiRequest(radius, category, keyword, geopoint) {
    let response = await fetch(
      backend +
        `/events?radius=${radius}&category=${category}&keyword=${keyword}&geoPoint=${geopoint}`
    );
    response = await response.json();
    if (!response.hasOwnProperty("error")) {
      events = response.map((event) => {
        return {
          venue: event["_embedded"]["venues"][0]["name"],
          genre: event["classifications"][0]["segment"]["name"],
          ...event,
        };
      });
    } else {
      events = response;
    }
  }
  async function getIpData() {
    const url = "https://ipinfo.io/json?token=" + ipKey;
    const response = await fetch(url);
    const jsonData = await response.json();
    return jsonData;
  }

  async function fetchIpData() {
    ipData = await getIpData(); // assign the value returned by getData() to the global variable
  }

  locationCheckbox.addEventListener("change", async function () {
    if (locationCheckbox.checked) {
      await fetchIpData();
      [lat, lng] = ipData.loc.split(",");
      locationInput.value = "auto-detect";
      locationInput.required = false;
      locationBox[0].style.display = "none";
    } else {
      locationBox[0].style.display = "flex";
      locationInput.value = "";
      locationInput.required = true;
    }
  });

  form.on("reset", (e) => {
    // e.preventDefault();
    // On form reset
    setContainersDisplayNone();
    const tableBody = document.querySelector(".eventsTable tbody");
    tableBody.innerHTML = "";
    locationInput.value = "";
    // locationInput.style.display = "flex";
    console.log(locationBox[0].style.display);
    locationBox[0].style.display = "flex";
  });

  function eventSorter(key, order) {
    return function (a, b) {
      if (a[key] > b[key]) return order === "asc" ? 1 : -1;
      else if (a[key] < b[key]) return order === "asc" ? -1 : 1;
      return 0;
    };
  }

  document
    .querySelector("#event-header")
    .addEventListener("click", async function (e) {
      renderTable("name");
    });

  document
    .querySelector("#venue-header")
    .addEventListener("click", async function (e) {
      renderTable("venue");
    });

  document
    .querySelector("#genre-header")
    .addEventListener("click", async function (e) {
      renderTable("genre");
    });

  let sortBy = "";
  let sortOrder = "desc";

  function renderTable(property) {
    if (property) {
      if (property == sortBy) {
        sortOrder = sortOrder == "asc" ? "desc" : "asc";
      } else {
        sortBy = property;
      }
      events = events.sort(eventSorter(sortBy, sortOrder));
    }

    const tableBody = document.querySelector(".eventsTable tbody");
    tableBody.innerHTML = "";

    events.forEach((event) => {
      const row = document.createElement("tr");

      // Create date cell
      const dateCell = document.createElement("td");
      const localDate = event["dates"]["start"]["localDate"];
      const localTime = event["dates"]["start"]["localTime"];
      dateCell.textContent = `${localDate}\n${localTime}`;
      dateCell.style.width = "90px";
      row.appendChild(dateCell);

      // Create icon cell
      const iconCell = document.createElement("td");
      const images = event["images"];
      if (images && images.length > 0) {
        const imageUrl = images[0]["url"];
        const imageAlt = images[0]["alt"];
        const icon = document.createElement("img");
        icon.src = imageUrl;
        icon.alt = imageAlt;
        icon.style.height = "50px";
        iconCell.appendChild(icon);
      }
      row.appendChild(iconCell);

      // Create event cell
      const eventCell = document.createElement("td");
      const eventCellText = document.createElement("p");
      eventCellText.setAttribute("class", "event-details-name-cell-text");
      const eventName = event["name"];
      eventCellText.textContent = eventName;
      eventCell.appendChild(eventCellText);

      // Attach event listener to event cell
      eventCellText.addEventListener("click", async function (e) {
        console.log(`Clicked on ${eventName}`);
        await displayEventDetails(event.id);
      });
      row.appendChild(eventCell);

      // Create genre cell
      const genreCell = document.createElement("td");
      genreCell.textContent = event.genre;
      genreCell.style.width = "90px";
      row.appendChild(genreCell);

      // Create venue cell
      const venueCell = document.createElement("td");
      venueCell.textContent = event.venue;
      venueCell.style.width = "250px";
      row.appendChild(venueCell);
      tableBody.appendChild(row);
    });
  }

  form.on("submit", async function (e) {
    e.preventDefault();
    setContainersDisplayNone();
    eventDetails.style.display = "none";
    venue_details_container.style.display = "none";
    console.log("In Submit");
    const dataArray = $(this).serializeArray();
    let address = dataArray[3]["value"];
    if (locationInput.value != "auto-detect") {
      const geohashval = await axios.get(
        geocoding_url + "&address=" + encodeURIComponent(address)
      );
      lat = geohashval.data.results[0].geometry.location.lat;
      lng = geohashval.data.results[0].geometry.location.lng;
    }
    geohash = Geohash.encode(lat, lng, 7);

    await sendApiRequest(
      distanceInput.value,
      categoryInput.value,
      keywordInput.value,
      geohash
    );

    if ("error" in events) {
      errorMessage.style.display = "block";
    } else {
      renderTable("");
      eventsTableConatiner.style.display = "flex";
    }
  });
});
