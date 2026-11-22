// =============================================
//  Campus Paws - script.js
//  JavaScript for all the pages
// =============================================

// ----- List of campus dogs -----
// (The dog photos are in the "images" folder)
// Names are not given yet, so every dog is "Not Named" for now
var dogs = [
    { id: "Dog 1", name: "Not Named", age: "Unknown", gender: "Unknown", location: "Cafe Mingos",      status: "Healthy", photo: "images/dog1.jpg" },
    { id: "Dog 2", name: "Not Named", age: "Unknown", gender: "Unknown", location: "Cafe Mingos",      status: "Healthy", photo: "images/dog2.jpg" },
    { id: "Dog 3", name: "Not Named", age: "Unknown", gender: "Unknown", location: "Grand Stairs",     status: "Healthy", photo: "images/dog3.jpg" },
    { id: "Dog 4", name: "Not Named", age: "Unknown", gender: "Unknown", location: "Grand Stairs",     status: "Healthy", photo: "images/dog4.jpg" },
    { id: "Dog 5", name: "Not Named", age: "Unknown", gender: "Unknown", location: "Library MM Foods", status: "Healthy", photo: "images/dog5.jpg" },
    { id: "Dog 6", name: "Not Named", age: "Unknown", gender: "Unknown", location: "Big Mingos",       status: "Healthy", photo: "images/dog6.jpg" },
    { id: "Dog 7", name: "Not Named", age: "Unknown", gender: "Unknown", location: "B Block",          status: "Healthy", photo: "images/dog7.jpg" }
];

// Picture to show if the dog photo is not there yet
var noPhoto = "data:image/svg+xml," + encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='180'>" +
    "<rect width='100%' height='100%' fill='#dddddd'/>" +
    "<text x='50%' y='50%' font-family='Arial' font-size='16' fill='#777777' text-anchor='middle'>Photo coming soon</text>" +
    "</svg>"
);


// ----- Functions to save and load reports (localStorage) -----
function getReports() {
    var data = localStorage.getItem("campusPawsReports");
    if (data == null) {
        return [];
    }
    return JSON.parse(data);
}

function saveReports(reports) {
    localStorage.setItem("campusPawsReports", JSON.stringify(reports));
}


// =============================================
//  HOME PAGE
// =============================================
var dogCount = document.getElementById("dogCount");
if (dogCount != null) {
    dogCount.innerHTML = dogs.length;
    document.getElementById("reportCount").innerHTML = getReports().length;
}


// =============================================
//  DOGS PAGE
// =============================================
var dogList = document.getElementById("dogList");

if (dogList != null) {
    var searchBox = document.getElementById("searchBox");
    var locationFilter = document.getElementById("locationFilter");
    var genderFilter = document.getElementById("genderFilter");

    // fill the location dropdown (without repeating)
    var locations = [];
    for (var i = 0; i < dogs.length; i++) {
        if (locations.indexOf(dogs[i].location) == -1) {
            locations.push(dogs[i].location);
        }
    }
    locations.sort();
    for (var i = 0; i < locations.length; i++) {
        var option = document.createElement("option");
        option.value = locations[i];
        option.innerHTML = locations[i];
        locationFilter.appendChild(option);
    }

    // show the dogs on the page
    function showDogs() {
        var searchText = searchBox.value.toLowerCase();
        var selectedLocation = locationFilter.value;
        var selectedGender = genderFilter.value;

        dogList.innerHTML = "";
        var count = 0;

        for (var i = 0; i < dogs.length; i++) {
            var dog = dogs[i];

            // check filters (search looks at the name and the location)
            var searchIn = (dog.name + " " + dog.location).toLowerCase();
            if (searchIn.indexOf(searchText) == -1) continue;
            if (selectedLocation != "All" && dog.location != selectedLocation) continue;
            if (selectedGender != "All" && dog.gender != selectedGender) continue;

            var statusClass = "healthy";
            if (dog.status == "Needs Care") {
                statusClass = "needs-care";
            }

            var card = document.createElement("div");
            card.className = "dog-card";
            card.innerHTML =
                "<img src='" + dog.photo + "' alt='" + dog.name + "' onerror=\"this.onerror=null; this.src=noPhoto;\">" +
                "<h3>" + dog.name + " <small>(" + dog.id + ")</small></h3>" +
                "<p><b>Location:</b> " + dog.location + "</p>" +
                "<p><b>Age:</b> " + dog.age + "</p>" +
                "<p><b>Gender:</b> " + dog.gender + "</p>" +
                "<p><b>Status:</b> <span class='status " + statusClass + "'>" + dog.status + "</span></p>" +
                "<button onclick=\"reportDog('" + dog.id + "')\">Report Problem</button>";

            dogList.appendChild(card);
            count++;
        }

        document.getElementById("resultText").innerHTML = "Showing " + count + " of " + dogs.length + " dogs";

        if (count == 0) {
            dogList.innerHTML = "<p>No dogs found. Try a different search.</p>";
        }
    }

    // run showDogs whenever user types or changes a filter
    searchBox.addEventListener("keyup", showDogs);
    locationFilter.addEventListener("change", showDogs);
    genderFilter.addEventListener("change", showDogs);

    showDogs();
}

// "Report Problem" button on a dog card -> go to report page with that dog selected
function reportDog(id) {
    window.location.href = "report.html?dog=" + encodeURIComponent(id);
}


// =============================================
//  REPORT PAGE
// =============================================
var reportForm = document.getElementById("reportForm");

if (reportForm != null) {
    var dogSelect = document.getElementById("dogName");
    var photoInput = document.getElementById("photo");
    var preview = document.getElementById("preview");
    var description = document.getElementById("description");
    var charCount = document.getElementById("charCount");
    var formMessage = document.getElementById("formMessage");
    var photoData = "";

    // fill dog name dropdown
    for (var i = 0; i < dogs.length; i++) {
        var opt = document.createElement("option");
        opt.value = dogs[i].id;
        opt.innerHTML = dogs[i].id + " (" + dogs[i].location + ")";
        dogSelect.appendChild(opt);
    }

    // if we came from the dogs page, select that dog and fill its location
    var params = new URLSearchParams(window.location.search);
    var dogFromUrl = params.get("dog");
    if (dogFromUrl != null) {
        dogSelect.value = dogFromUrl;
        fillLocation();
    }

    // when a dog is chosen, put its usual location in the box
    function fillLocation() {
        for (var i = 0; i < dogs.length; i++) {
            if (dogs[i].id == dogSelect.value) {
                document.getElementById("location").value = dogs[i].location;
            }
        }
    }
    dogSelect.addEventListener("change", fillLocation);

    // character counter for the description
    description.addEventListener("input", function () {
        var length = description.value.length;
        if (length > 300) {
            description.value = description.value.substring(0, 300);
            length = 300;
        }
        charCount.innerHTML = length + " / 300 characters";
    });

    // show photo preview when a file is chosen
    photoInput.addEventListener("change", function () {
        var file = photoInput.files[0];
        if (!file) {
            preview.style.display = "none";
            photoData = "";
            return;
        }

        var reader = new FileReader();
        reader.onload = function (e) {
            // make the photo smaller so it fits in localStorage
            var img = new Image();
            img.onload = function () {
                var canvas = document.createElement("canvas");
                var maxWidth = 400;
                var scale = Math.min(1, maxWidth / img.width);
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
                photoData = canvas.toDataURL("image/jpeg", 0.7);
                preview.src = photoData;
                preview.style.display = "block";
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });

    // when the form is submitted
    reportForm.addEventListener("submit", function (event) {
        event.preventDefault(); // stop page from reloading

        var reporter = document.getElementById("reporterName").value.trim();
        var location = document.getElementById("location").value.trim();
        var problem = document.getElementById("problemType").value;
        var desc = description.value.trim();

        // form validation
        if (reporter == "") {
            showMessage("Please enter your name.", "error");
            return;
        }
        if (location == "") {
            showMessage("Please enter the location.", "error");
            return;
        }
        if (problem == "") {
            showMessage("Please select the type of problem.", "error");
            return;
        }
        if (photoData == "") {
            showMessage("Please upload a photo of the dog.", "error");
            return;
        }
        if (desc.length < 10) {
            showMessage("Please describe the problem (at least 10 characters).", "error");
            return;
        }

        var newReport = {
            reporter: reporter,
            dog: dogSelect.value,
            location: location,
            problem: problem,
            description: desc,
            photo: photoData,
            date: new Date().toLocaleString()
        };

        var reports = getReports();
        reports.unshift(newReport); // newest first

        try {
            saveReports(reports);
        } catch (err) {
            showMessage("Could not save the report. Storage is full, try deleting old reports.", "error");
            return;
        }

        showMessage("Thank you! Your report has been submitted.", "success");
        reportForm.reset();
        preview.style.display = "none";
        photoData = "";
        charCount.innerHTML = "0 / 300 characters";
        showReports();
    });

    // clear button also hides the preview
    reportForm.addEventListener("reset", function () {
        preview.style.display = "none";
        photoData = "";
        charCount.innerHTML = "0 / 300 characters";
    });

    function showMessage(text, type) {
        formMessage.innerHTML = text;
        formMessage.className = type;
    }

    // show all saved reports
    function showReports() {
        var reports = getReports();
        var reportList = document.getElementById("reportList");

        if (reports.length == 0) {
            reportList.innerHTML = "<p>No reports yet.</p>";
            return;
        }

        reportList.innerHTML = "";
        for (var i = 0; i < reports.length; i++) {
            var r = reports[i];
            var div = document.createElement("div");
            div.className = "report-item";
            div.innerHTML =
                "<img src='" + r.photo + "' alt='Report photo'>" +
                "<p><b>Dog:</b> " + escapeHtml(r.dog) + "</p>" +
                "<p><b>Problem:</b> " + escapeHtml(r.problem) + "</p>" +
                "<p><b>Location:</b> " + escapeHtml(r.location) + "</p>" +
                "<p><b>Description:</b> " + escapeHtml(r.description) + "</p>" +
                "<p><small>Reported by " + escapeHtml(r.reporter) + " on " + r.date + "</small></p>" +
                "<button class='delete-btn' onclick='deleteReport(" + i + ")'>Delete</button>";
            reportList.appendChild(div);
        }
    }

    showReports();
}

function deleteReport(index) {
    if (confirm("Are you sure you want to delete this report?")) {
        var reports = getReports();
        reports.splice(index, 1);
        saveReports(reports);
        location.reload();
    }
}

// stops people from typing HTML code into the form
function escapeHtml(text) {
    var div = document.createElement("div");
    div.innerText = text;
    return div.innerHTML;
}
