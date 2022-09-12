let shortForm = document.getElementById("shortener-form");
let urlInput = document.querySelector(".input-link");
let showError = document.querySelector(".show-url-error");
let showLinks = document.getElementById("show-links");
let showErrorMobile = document.querySelector(".show-url-error-mobile");
let checkEmailRegex = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;

/**
 * Shorten url entered by the user
 * @param {string} url url from user to shorten
 * @returns stops function if the url is incorrect
 */
const shortenUrl = async (url) => {
    const res = await fetch(`https://www.shareaholic.com/v2/share/shorten_link?apikey=8943b7fd64cd8b1770ff5affa9a9437b&url=${url}`);
    const result = await res.json();
    if (!localStorage.getItem("short-links")) {
        let shortLinks = [];
        var newObjUrl = {
            link: urlInput.value,
            id: new Date(),
            shortLink: result.data
        };
        shortLinks.push(newObjUrl);
        localStorage.setItem("short-links", JSON.stringify(shortLinks));
    } else {
        let flag = false;
        let shortLinksLocal = JSON.parse(localStorage.getItem("short-links"));
        shortLinksLocal.forEach(link => {
            if (link.link == urlInput.value) {
                flag = true;
            }
        })
        if (flag) {
            urlEnteredIncorreclty("url already entered");
            return
        }
        var newObjUrl = {
            link: urlInput.value,
            id: new Date(),
            shortLink: result.data
        };
        shortLinksLocal.push(newObjUrl);
        localStorage.setItem("short-links", JSON.stringify(shortLinksLocal));
    }
    urlEnteredSuccessfully();
    displayShortenedLinks(newObjUrl);
}

/**
 * Displays a span underneath the input with a success message
 */
function urlEnteredSuccessfully() {
    urlInput.style.borderColor = "#2bd0d0";
    showError.innerHTML = "Url shortened successfully";
    showError.style.color = "#2bd0d0";
    showErrorMobile.innerHTML = "Url shortened successfully";
    showErrorMobile.style.color = "#2bd0d0";
};

/**
 * Displays a span underneath the input with a failed message
 * @param {string} msg message to be displayed beneath input if the input was entered incorrectly
 */
function urlEnteredIncorreclty(msg) {
    showError.innerHTML = msg;
    showErrorMobile.innerHTML = msg;
    showErrorMobile.style.color = "red"
    showError.style.color = "red";
    urlInput.style.borderColor = "red";
    urlInput.value = "";
};

/**
 * Displays the short links that user inputted
 * @param {object} obj object that contains the lonk url and the short url
 */
function displayShortenedLinks(obj) {
    showLinks.insertAdjacentHTML("afterbegin", `<div class="short-links-div">
        <span class="show-links-div-link">${obj.link}</span>
        <hr class="short-links-line" />
        <div class="individualShortLink">
          <a class="new-shortened-link" href="${obj.shortLink}" target="_blank">${obj.shortLink}</a>
          <button class="copy-link">Copy</button>
        </div>
      </div>`)
};


window.onload = () => {
    if (localStorage.getItem("short-links")) {
        let linksFromLocal = JSON.parse(localStorage.getItem("short-links"));
        linksFromLocal.forEach(link => {
            displayShortenedLinks(link);
        })
    };
};

shortForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!urlInput.value.match(checkEmailRegex)) {
        urlEnteredIncorreclty("Please Enter a valid url");
        return
    }
    shortenUrl(urlInput.value);
});

showLinks.addEventListener("click", function (e) {
    if (e.target.classList.contains("copy-link")) {
        e.target.innerText = "copied";
        e.target.style.background = 'green';
        let copiedLink = e.target.parentElement.firstElementChild.href;
        navigator.clipboard.writeText(copiedLink);
    }
})