let currentIndex = 0;
const slides = document.querySelectorAll(".slides img");
const stamp = document.getElementById("stamp");
let slideStatus = JSON.parse(localStorage.getItem("slideStatus")) || new Array(slides.length).fill("");

function moveSlide(step) {
    slides[currentIndex].classList.remove("active");
    currentIndex = (currentIndex + step + slides.length) % slides.length;
    slides[currentIndex].classList.add("active");
    updateStamp();
}

function markSold() {
    slideStatus[currentIndex] = "sold";
    saveStatus();
    updateStamp();
}

function markUnsold() {
    slideStatus[currentIndex] = "unsold";
    saveStatus();
    updateStamp();
}

function updateStamp() {
    if (slideStatus[currentIndex] === "sold") {
        stamp.textContent = "SOLD";
        stamp.className = "stamp sold-stamp";
        stamp.style.display = "block";
    } else if (slideStatus[currentIndex] === "unsold") {
        stamp.textContent = "UNSOLD";
        stamp.className = "stamp unsold-stamp";
        stamp.style.display = "block";
    } else {
        stamp.style.display = "none";
    }
}

function saveStatus() {
    localStorage.setItem("slideStatus", JSON.stringify(slideStatus));
}

document.addEventListener("DOMContentLoaded", () => {
    updateStamp();
});
