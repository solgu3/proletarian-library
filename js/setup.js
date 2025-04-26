var root;
var intl;
var home;
var language;
var relativeHomeDirectory;
var locations = [];
var locationBar;
var locationText;
var positionStorage;
var currentLocation;
var isSavingPosition;
var locationElements;
var isMultiArticle;
var offset = "4.25rem";
var paragraphOffset = "4.25rem";
var menuHeight = "2.5rem";
var borderHeight = "0.25rem";
var totalMenuHeight = "3rem";
var marginSize = "1.25rem";
var intersectionMarginError = "0.125rem";
var intersectionMargin;
var searchedLocation = "";
var recentlySearched = false;
var recentlyScrolled = false;
var recentlyLoaded;
var searchedElement;
var relativePosition;
var percentIndicator;
var deleteDataCount = 3;
var settingsEnabled;
var timer;

/*****************
*** page setup ***
*****************/
window.onload = function () {
    setInitialVariables();
    if (intl) { // temporary
        createHeader();
        createFooter();
        createSides();
    }

    if (!intl) {
        enableSettings();
    } else {
        randomizeSpacePositions();
        setLanguage();
        // randomizeMenu();
    }
    setInitialSettings();
    roundTheCenterColumn();
    scrollToStoredPosition();
    addResizeListener();
    enableCloseMenu();
    if (!intl) {
        addMenuObserver();
    }
    enableSides();
    generateNeocitiesThumbnail();
    if (intl) {
        enableIntl();
    } else if (!home) {
        setLocationElements();
        setLocations();
        setIntersectionMargin();
        enableIntersectionObserver();
        setRelativePosition();
        addPercentIndicator();
        addLocationBar();
        enableLocationBar();
        addScrollListener();
        loadResources();
    }
}

function loadResources() {
    for (pdfResource of document.getElementsByClassName("pdf resource")) {
        var link = pdfResource.getAttribute("href");
        var viewLink = document.createElement("a");
        var downloadLink = document.createElement("a");
        var viewText;
        var downloadText;

        if (language.includes('en')) {
            viewText = "View";
            downloadText = "Download";
        } else if (language.includes('es')) {
            viewText = "Ver";
            downloadText = "Descargar";
        } else if (language.includes('fr')) {
            viewText = "Voir";
            downloadText = "Télécharger";
        } else if (language.includes('pt')) {
            viewText = "Ver";
            downloadText = "Baixar";
        }

        pdfResource.innerHTML += "PDF: ";

        viewLink.setAttribute('href', "../pdfjs/web/viewer.html?file=../../" + language + "/" + link);
        viewLink.innerHTML = "[" + viewText + "]";
        pdfResource.appendChild(viewLink);

        pdfResource.innerHTML += " — ";


        downloadLink.setAttribute('href', link);
        downloadLink.setAttribute('download', '');
        downloadLink.innerHTML = "[" + downloadText + "]";
        pdfResource.appendChild(downloadLink);
    }
}

function generateNeocitiesThumbnail() {
    if (/headless/i.test(window.navigator.userAgent) && localStorage.length === 0) {
        var head = document.getElementsByTagName('head')[0];
        var link = document.createElement('link');
        link.id = 'theme-neocities';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = relativeHomeDirectory + 'css/theme-dark.css';
        link.media = 'all';
        head.appendChild(link);
    }
}

function createHeader() {
    var bodyCenter = document.getElementsByClassName("body-center")[0];
    var main = document.getElementsByTagName("main")[0];
    var header = document.createElement("header");
    bodyCenter.insertBefore(header, main);

    if (intl) {
    header.innerHTML = '<details id="menu"> \
        <summary> \
            <span class="container-bar-button"> \
                <svg class="cover" width="788" height="60" viewBox="0 0 788 60"> \
                    <path id="menu-cover" /> \
                </svg> \
                <span>Menu</span> \
                <img width="42" height="42" src="img/inti.svg" alt=""> \
                <img width="42" height="42" src="img/inti.svg" alt=""> \
            </span> \
        </summary> \
        <div id="container-menu"> \
            <nav class="navigation section"> \
                <ul style="display: flex; justify-content: space-between; margin: 0;"> \
                    <li><a href="en/index.html">[English]</a></li> \
                    <li><a href="es/index.html">[Español]</a></li> \
                    <li><a href="fr/index.html">[Français]</a></li> \
                    <li><a href="pt/index.html">[Português]</a></li> \
                </ul> \
            </nav> \
            <ul class="archives section" style="display: flex; justify-content: space-between; margin: 0;"> \
                <li style="margin-bottom: 0;"><a href="https://neocities.org/site/proletarian-library" target="_blank">[Neocities]</a></li> \
                <li style="margin-bottom: 0;"><a href="https://github.com/solgu3/proletarian-library" target="_blank">[GitHub]</a></li> \
            </ul> \
        </div> \
        </details>';
    }
}

function createFooter() {
    var bodyCenter = document.getElementsByClassName("body-center")[0];
    var main = document.getElementsByTagName("main")[0];
    var footer = document.createElement("footer");
    bodyCenter.insertBefore(footer, main.nextSibling);

    if (intl) {
    footer.innerHTML = '<div class="container-bar-button"> \
        <svg class="cover" width="788" height="60" viewBox="0 0 788 60"> \
            <use href="#menu-cover" /> \
        </svg> \
        <img width="42" height="42" src="img/inti.svg" alt=""> \
        <img width="42" height="42" src="img/inti.svg" alt=""> \
        </div>';
    }
}

function createSides() {
    var bodyCenter = document.getElementsByClassName("body-center")[0];
    var bodySideLeft = document.createElement("div");
    bodySideLeft.classList.add("body-side");
    var bodySideRight = document.createElement("div");
    bodySideRight.classList.add("body-side");
    document.body.insertBefore(bodySideLeft, bodyCenter);
    document.body.insertBefore(bodySideRight, bodyCenter.nextSibling);
}


function randomizeSpacePositions() {
    var spaces = document.querySelectorAll('.language');
    var spaceIndexes = Array.from(Array(spaces.length).keys());
    var randomIndexes = shuffleArray(spaceIndexes);
    var languageSpace = document.querySelector('.languages');

    for (space of spaces) {
        space.remove();
    }
    for (randomIndex of randomIndexes) {
        languageSpace.innerHTML += spaces[randomIndex].outerHTML;
    }
}

function shuffleArray(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {
        var randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function setLanguage() {
    var firstLanguage = document.querySelector('.language:first-child a').innerHTML;
    if (firstLanguage.includes('English')) {
        language = 'en';
    } else if (firstLanguage.includes('Español')) {
        language = 'es';
    } else if (firstLanguage.includes('Français')) {
        language = 'fr';
    } else if (firstLanguage.includes('Português')) {
        language = 'pt';
    }
    document.documentElement.lang = language;
}

function randomizeMenu() {
    var menuText = document.querySelector('#menu .container-bar-button span');
    var navigation = document.querySelector('#container-menu nav ul');
    if (language.includes('en')) {
        menuText.innerHTML = 'Menu';
        navigation.innerHTML = '<li><a href="en/index.html">English</a></li> \
            <li><a href="es/index.html">Español</a></li> \
            <li><a href="fr/index.html">Français</a></li> \
            <li><a href="pt/index.html">Português</a></li>';
    } else if (language.includes('es')) {
        menuText.innerHTML = 'Menú';
        navigation.innerHTML = '<li><a href="es/index.html">Español</a></li> \
            <li><a href="fr/index.html">Français</a></li> \
            <li><a href="pt/index.html">Português</a></li> \
            <li><a href="en/index.html">English</a></li>';
    } else if (language.includes('fr')) {
        menuText.innerHTML = 'Menu';
        navigation.innerHTML = '<li><a href="fr/index.html">Français</a></li> \
            <li><a href="pt/index.html">Português</a></li> \
            <li><a href="en/index.html">English</a></li> \
            <li><a href="es/index.html">Español</a></li>';
    } else if (language.includes('pt')) {
        menuText.innerHTML = 'Menu';
        navigation.innerHTML = '<li><a href="pt/index.html">Português</a></li> \
            <li><a href="fr/index.html">Français</a></li> \
            <li><a href="es/index.html">Español</a></li> \
            <li><a href="en/index.html">English</a></li>';
    }
}

// Text fix for address bar resizing during scrolling.
window.onscroll = function () {
    if (!recentlyLoaded) {
        recentlyScrolled = true;
        clearTimeout(timer);
        timer = setTimeout(() => {
            recentlyScrolled = false;
        }, 50);
    }
}

function addMenuObserver() {
    var mutationObserver = new MutationObserver(mutations => {
        for (var mutation of mutations) {
            if (mutation.oldValue !== null && deleteDataCount != 3) {
                deleteDataCount = 3;
                setSettingTextByLanguage("settings-data", "Reinitialize Settings", "Press 3 Times", "Reiniciar Ajustes", "Apretar 3 Veces", "Réinitialiser Options", "Appuyer 3 Fois", "Reiniciar Configurações", "Pressione 3 Vezes");
            }
        }
    });

    mutationObserver.observe(document.querySelector("#menu"), {
        attributeFilter: ["open"],
        attributeOldValue: true
    });
}

function setRelativePosition() {
    relativePosition = window.scrollY / document.body.offsetHeight;
    if (isSavingPosition) {
        storeRelativePosition();
    }
}

function getRelativePositionInText() {
    return ((relativePosition * document.body.offsetHeight) + window.innerHeight - 2 * getPixels(totalMenuHeight)) / (document.body.offsetHeight - 2 * getPixels(totalMenuHeight));
}

function scrollToRelativePosition() {
    if (!home && !intl) {
        scroll(0, Math.round(relativePosition * document.body.offsetHeight));
    }
}

function scrollToStoredPosition() {
    if (!home && !intl) {
        if (isSavingPosition && localStorage.getItem(positionStorage)) {
            scroll(0, Math.round(localStorage.getItem(positionStorage) * document.body.offsetHeight));
        }
    }
}

function storeRelativePosition() {
    localStorage.setItem(positionStorage, relativePosition.toFixed(7));
}

function updatePercentIndicator() {
    var newPercent = Math.min(getRelativePositionInText().toFixed(3), 1) * 1000 / 10;
    if (!percentIndicator.innerText.includes(newPercent.toString())) {
        percentIndicator.innerText = newPercent + '%';
    }
}

function setInitialVariables() {
    positionStorage = "position-" + window.location.pathname;
    if (window.location.hash) positionStorage += window.location.hash;
    root = document.querySelector(":root");
    intl = document.getElementById("intl");
    home = document.getElementById("home");
    language = document.documentElement.lang;
    setRelativeHomeDirectory();
    recentlyLoaded = true;
    setTimeout(() => {
        recentlyLoaded = false;
    }, 1000);
    isMultiArticle = (document.getElementsByTagName("article").length > 0 ? true : false);
}

function setRelativeHomeDirectory() {
    if (intl) {
        relativeHomeDirectory = "";
    } else {
        relativeHomeDirectory = "../";
    }
}

function setLocationElements() {
    if (!home) {
        locationElements = (isMultiArticle ? document.querySelectorAll('[data-location-include], p:not([data-location-exclude]), blockquote, .text li:not([data-location-exclude]), .notes li:not([data-location-exclude]), h1, h2') 
        : document.querySelectorAll('[data-location-include], p:not([data-location-exclude]), blockquote, .text li:not([data-location-exclude]), .notes li:not([data-location-exclude]), h1'));
    }
}

function addResizeListener() {
    window.addEventListener('resize', function () {
        if (!recentlyScrolled) {
            roundTheCenterColumn();
            scrollToRelativePosition();
            setIntersectionMargin();
        }

        if (recentlyLoaded) {
            if (window.location.hash && document.getElementById(window.location.hash.slice(1))) {
                if (isSavingPosition && localStorage.getItem(positionStorage)) {
                    scrollToStoredPosition();
                } else {
                    document.getElementById(window.location.hash.slice(1)).scrollIntoView();
                }
                recentlyLoaded = false;
            }
        }

        if (recentlySearched && searchedElement) {
            scroll(0, searchedElement.getBoundingClientRect().top + window.scrollY - getPixels(paragraphOffset));
            setCurrentLocation(searchedElement.dataset.location);
            recentlySearched = false;
            searchedElement = "undefined";
        }
    });
}

function roundTheCenterColumn() {
    if (window.matchMedia('(min-aspect-ratio: 2/3)').matches) {
        root.style.setProperty("--size-column", Math.floor(2 * document.documentElement.clientHeight / 3) + "px");
    } else {
        root.style.setProperty("--size-column", document.documentElement.clientWidth + "px");
    }
}

function getPixels(remValue) {
    return convertRemToPixels(Number(remValue.slice(0, -3)));
}

function convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function setIntersectionMargin() {
    intersectionMargin = -1 * (getPixels(menuHeight) + 2 * getPixels(borderHeight) + getPixels("0.125rem"));
}

function enableIntersectionObserver() {
    const intersectionObserver = new IntersectionObserver(entries => {
        for (var entry of entries) {
            var elementBounds = entry.boundingClientRect;
            if ((elementBounds.top + elementBounds.height) >= 0 && elementBounds.top <= window.innerHeight) {
                addLocation(entry.target.dataset.location);
            }
        }
        if (recentlyLoaded) {
            setCurrentLocation();
        }
    }, { rootMargin: intersectionMargin + "px" });

    for (element of locationElements) {
        intersectionObserver.observe(element);
    }

}

function addScrollListener() {
    window.addEventListener('scroll', function () {
        setRelativePosition();
        updatePercentIndicator();
        removeLocations();
        setCurrentLocation();
    });
}

function addPercentIndicator() {
    this.document.querySelector('body > div.body-center > footer > a > div > img:nth-child(4)').outerHTML = '';
    this.document.querySelector('body > div.body-center > footer > a > div > img:nth-child(2)').outerHTML = '';
    this.document.querySelector("footer .container-bar-button").innerHTML += '<span id="footer-span-right"></span>';
    percentIndicator = document.getElementById("footer-span-right");
    updatePercentIndicator();
    
}

function addLocationBar() {
    document.querySelector("footer > a").removeAttribute("href");

    this.document.querySelector("footer .container-bar-button span").innerHTML = '<input type="text" id="location" />';
    locationBar = document.getElementById("location");
    locationBar.addEventListener('focus', () => {
        locationText = locationBar.getAttribute("placeholder");
    });
}

function enableLocationBar() {
    locationBar.addEventListener('change', (event) => {
        var search = event.target.value.trim().replace(/\s+/g, ' ');
        if (search.match('[0-9]')) {
            if (search.match('[a-zA-Z]') && !search.match('[a-zA-Z]{2}')) {
                if (search.match('[a-z]')) {
                    search = search.toUpperCase();
                }
                if (!search.match('\\s')) {
                    search = search.replace(/([0-9])([A-Z])/g, '$1 $2');
                }
            }

            for (element of locationElements) {
                if (element.dataset.location.localeCompare(search) == 0) {
                    searchedLocation = search;
                    event.target.value = "";
                    event.target.blur();
                    searchedElement = element;
                    scroll(0, element.getBoundingClientRect().top + window.scrollY - getPixels(paragraphOffset));
                    setCurrentLocation(element.dataset.location);
                    recentlySearched = true;
                    setTimeout(() => {
                        recentlySearched = false;
                        searchedElement = null;
                    }, 1000);
                    return;
                }
            }
        }
        event.target.value = "";
        event.target.blur();
        setCurrentLocation(locationText);
    });
}

function setCurrentLocation(location = null) {
    var setLocation = function (location = null) {
        if (location) {
            locationBar.setAttribute("placeholder", location);
            addLocation(location);
            currentLocation = location;
        }
    }

    if (location) {
        setLocation(location);
        return;
    }

    if (searchedLocation) {
        setLocation(searchedLocation);
        searchedLocation = "";
        return;
    }

    if (locations.length < 1) {
        setLocation();
        return;
    }

    if (!isMultiArticle) {
        setLocation(Math.min(...locations).toString());
    } else {
        if (locations.length < 1) return;
        var temp = [...locations];
        temp = temp.reduce(function (a, b) {
            a1 = a.split(' ');
            b1 = b.split(' ');
            if (!a1[1]) return a;
            if (!b1[1]) return b;
            if (a1[1].localeCompare(b1[1]) == -1) return a;
            if (a1[1].localeCompare(b1[1]) == 1) return b;
            if (a1[1].localeCompare(b1[1]) == 0) {
                return (Number(a1[0]) < Number(b1[0]) ? a : b);
            }
        });
        setLocation(temp);
    }

}

function addLocation(location) {
    if (!locations.find((storedLocation) => storedLocation === location)) {
        locations.push(location);
    }
}

function removeLocations() {
    if (locations.length < 1) return;
    for (element of locations) {
        var elementBounds = document.querySelector('[data-location = "' + element + '"]').getBoundingClientRect();
        if ((elementBounds.top + elementBounds.height) + intersectionMargin < 0 || elementBounds.top - intersectionMargin > window.innerHeight) {
            locations.splice(locations.indexOf(element), 1);
        }
    }
}

function setLocations() {
    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    var articleCounter = -1;
    var textCounter = 0;
    if (isMultiArticle) {
        for (element of locationElements) {
            if (!element.tagName.includes('H')) {
                textCounter++;
                element.dataset.location = textCounter + " " + letters[articleCounter];
            } else if (element.tagName.includes('2')) {
                articleCounter++;
                textCounter = 0;
                element.dataset.location = 0 + " " + letters[articleCounter];
            } else {
                element.dataset.location = 0;
            }
        }
    } else {
        for (element of locationElements) {
            if (!element.tagName.includes('H1')) {
                textCounter++;
                element.dataset.location = textCounter;
            } else {
                element.dataset.location = 0;
            }
        }
    }
}

function setInitialSettings() {
    var desiredTheme = localStorage.getItem("theme");
    if (desiredTheme) {
        document.getElementById(desiredTheme).removeAttribute('disabled');
        disableTheme("theme-system");
        setSettingTextByLanguage("settings-theme", "Light Or Dark", (desiredTheme.includes("light") ? 'Light' : 'Dark'), "Claro U Oscuro", (desiredTheme.includes("light") ? 'Claro' : 'Oscuro'), "Clair Ou Obscur", (desiredTheme.includes("light") ? 'Clair' : 'Obscur'), "Claro Ou Escuro", (desiredTheme.includes("light") ? 'Claro' : 'Escuro'));
    } else {
        enableTheme("theme-system");
        disableTheme("theme-dark");
        disableTheme("theme-light");
        setSettingTextByLanguage("settings-theme", "Light Or Dark", "Auto", "Claro U Oscuro", "Auto", "Clair Ou Obscur", "Auto", "Claro Ou Escuro", "Auto");
    }

    var size = localStorage.getItem("size");
    if (size) {
        if (size.includes('large')) {
            root.style.setProperty("--size-text", "0.15rem");
            root.style.setProperty("--size-line", "0.70rem");
            setSettingTextByLanguage("settings-size", "Size", "Large", "Tamaño", "Grande", "Taille", "Grand", "Tamanho", "Grande");
        } else if (size.includes('small')) {
            root.style.setProperty("--size-text", "-0.10rem");
            root.style.setProperty("--size-line", "0.50rem");
            setSettingTextByLanguage("settings-size", "Size", "Small", "Tamaño", "Pequeño", "Taille", "Petit", "Tamanho", "Pequeno");
        }
    } else {
        root.style.setProperty("--size-text", "0.00rem");
        root.style.setProperty("--size-line", "0.60rem");
        setSettingTextByLanguage("settings-size", "Size", "Regular", "Tamaño", "Regular", "Taille", "Régulier", "Tamanho", "Regular");
    }

    var margins = localStorage.getItem("margins");
    if (margins) {
        if (margins.includes('large')) {
            root.style.setProperty("--size-margin-text", "0.75rem");
            setSettingTextByLanguage("settings-margins", "Margins", "Large", "Márgenes", "Grande", "Marges", "Grand", "Margens", "Grande");
        } else if (margins.includes('small')) {
            root.style.setProperty("--size-margin-text", "-0.75rem");
            setSettingTextByLanguage("settings-margins", "Margins", "Small", "Márgenes", "Pequeño", "Marges", "Petit", "Margens", "Pequeno");
        }
    } else {
        root.style.setProperty("--size-margin-text", "-0.25rem");
        setSettingTextByLanguage("settings-margins", "Margins", "Regular", "Márgenes", "Regular", "Marges", "Régulier", "Margens", "Regular");
    }

    var spacing = localStorage.getItem("spacing");
    if (spacing) {
        if (spacing.includes('large')) {
            root.style.setProperty("--size-spacing", "0.25rem");
            setSettingTextByLanguage("settings-spacing", "Spacing", "Large", "Espaciamiento", "Grande", "Espacement", "Grand", "Espaçamento", "Grande");
        } else if (spacing.includes('small')) {
            root.style.setProperty("--size-spacing", "0.00rem");
            setSettingTextByLanguage("settings-spacing", "Spacing", "Small", "Espaciamiento", "Pequeño", "Espacement", "Petit", "Espaçamento", "Pequeno");
        }
    } else {
        root.style.setProperty("--size-spacing", "0.125rem");
        setSettingTextByLanguage("settings-spacing", "Spacing", "Regular", "Espaciamiento", "Regular", "Espacement", "Régulier", "Espaçamento", "Regular");
    }

    if (localStorage.getItem("numbers") && localStorage.getItem("numbers").includes('off')) {
        root.style.setProperty('--paragraph-numbers', 'none');
        setSettingTextByLanguage("settings-numbers", "Page Numbers", "Off", "Números De Páginas", "Apagado", "Numéros De Pages", "Désactivé", "Números De Páginas", "Desligado");
    } else {
        root.style.setProperty('--paragraph-numbers', 'attr(data-location)');
        setSettingTextByLanguage("settings-numbers", "Page Numbers", "On", "Números De Páginas", "Prendido", "Numéros De Pages", "Activé", "Números De Páginas", "Ligado");
    }

    if (localStorage.getItem("alignment")) {
        if (localStorage.getItem("alignment").includes('left')) {
            root.style.setProperty('--text-alignment', "left");
            setSettingTextByLanguage("settings-alignment", "Alignment", "Left", "Alineación", "Izquierda", "Alignement", "Gauche", "Alinhamento", "Esquerda");
        }
    } else {
        root.style.setProperty('--text-alignment', "justify");
        setSettingTextByLanguage("settings-alignment", "Alignment", "Justified", "Alineación", "Justificado", "Alignement", "Justifié", "Alinhamento", "Justificado");
    }

    if (intl || localStorage.getItem("delimiters")) {
        if (intl || localStorage.getItem("delimiters").includes('on')) {
            root.style.setProperty('--delimiter', "var(--image-border)");
            root.style.setProperty('--delimiter-alt', "var(--image-border-alt)");
            setSettingTextByLanguage("settings-delimiters", "Delimiters", "On", "Delimitadores", "Prendido", "Délimiteurs", "Activé", "Delimitadores", "Ligado");
        }
    } else {
        root.style.setProperty('--delimiter', "none");
        root.style.setProperty('--delimiter-alt', "none");
        setSettingTextByLanguage("settings-delimiters", "Delimiters", "Off", "Delimitadores", "Apagado", "Délimiteurs", "Désactivé", "Delimitadores", "Desligado");
    }

    if (localStorage.getItem("hyphens")) {
        if (localStorage.getItem("hyphens").includes('on')) {
            root.style.setProperty('--text-hyphenation', "auto");
            setSettingTextByLanguage("settings-hyphenation", "Hyphens", "On", "Guiones", "Prendido", "Tirets", "Activé", "Hífens", "Ligado");
        }
    } else {
        root.style.setProperty('--text-hyphenation', "none");
        setSettingTextByLanguage("settings-hyphenation", "Hyphens", "Off", "Guiones", "Apagado", "Tirets", "Désactivé", "Hífens", "Desligado");
    }

    var background = localStorage.getItem("background");
    if (background) {
        if (background.includes('animated')) {
            root.style.setProperty("--image-background", "var(--image-background-animated)");
            setSettingTextByLanguage("settings-background", "Background", "Animated", "Fondo", "Animado", "Fond", "Animé", "Fundo", "Animado");
        } else if (background.includes('static')) {
            root.style.setProperty("--image-background", "var(--image-background-static)");
            setSettingTextByLanguage("settings-background", "Background", "Static", "Fondo", "Estático", "Fond", "Statique", "Fundo", "Estático");
            }
    } else {
        root.style.setProperty("--image-background", "none");
        setSettingTextByLanguage("settings-background", "Background", "None", "Fondo", "Nada", "Fond", "Aucun", "Fundo", "Nenhum");
    }

    if (localStorage.getItem("position") && localStorage.getItem("position").includes("off")) {
        setSettingTextByLanguage("settings-position", "Save Position", "Off", "Guardar Posición", "Apagado", "Sauvegarder Position", "Désactivé", "Salvar Posição", "Desligado");
        isSavingPosition = false;
    } else {
        setSettingTextByLanguage("settings-position", "Save Position", "On", "Guardar Posición", "Prendido", "Sauvegarder Position", "Activé", "Salvar Posição", "Ligado");
        isSavingPosition = true;
    }

    setSettingTextByLanguage("settings-data", "Reinitialize Settings", "Press 3 Times", "Reiniciar Ajustes", "Apretar 3 Veces", "Réinitialiser Options", "Appuyer 3 Fois", "Reiniciar Configurações", "Pressione 3 Vezes");
}

function enableCloseMenu() {
    var closeText;
    if (language.includes('en')) {
        closeText = "Close";
    } else if (language.includes('es')) {
        closeText = "Cerrar";
    } else if (language.includes('fr')) {
        closeText = "Fermer";
    } else if (language.includes('pt')) {
        closeText = "Fechar";
    }
    var closeMenu = ' \
    <div id="close-menu" class="container-bar-button" onclick="return closeMenu();" onkeydown="return closeMenu(event);" tabindex=0> \
        <svg class="cover" width="788" height="60" viewBox="0 0 788 60"> \
            <use href="#menu-cover" /> \
        </svg> \
        <img width="48" height="48" src="' + relativeHomeDirectory + 'img/inti.svg" alt="Animation of Inti with rays rotating."> \
        <span>' + closeText + '</span> \
        <img width="48" height="48" src="' + relativeHomeDirectory + 'img/inti.svg" alt="Animation of Inti with rays rotating."> \
    </div>';
    document.getElementById("menu").innerHTML = document.getElementById("menu").innerHTML + closeMenu;
}

function enableSettings() {
    for (setting of document.querySelectorAll('#settings [id^="settings-"]')) {
        setting.style.color = "unset";
    }

    enableElementSetting(document.getElementById("settings-size"), "changeSize");
    enableElementSetting(document.getElementById("settings-margins"), "changeTextMargins");
    enableElementSetting(document.getElementById("settings-spacing"), "changeSpacing");
    enableElementSetting(document.getElementById("settings-alignment"), "changeAlignment");
    enableElementSetting(document.getElementById("settings-delimiters"), "changeDelimiters");
    enableElementSetting(document.getElementById("settings-hyphenation"), "changeHyphenation");
    enableElementSetting(document.getElementById("settings-numbers"), "changeParagraphNumbers");
    enableElementSetting(document.getElementById("settings-theme"), "changeTheme");
    enableElementSetting(document.getElementById("settings-background"), "changeBackground");
    enableElementSetting(document.getElementById("settings-position"), "savePosition");
    enableElementSetting(document.getElementById("settings-data"), "deleteData");

    // if (language.includes('en')) {
    //     document.querySelector('#settings-description').textContent = "All settings data is stored in your browser and is not collected by the library.";
    // } else if (language.includes('es')) {
    //     document.querySelector('#settings-description').textContent = "Todos los datos de configuración se guardan en su navegador y la biblioteca no los recopila.";
    // }
    document.querySelector('#settings-description').remove();
    settingsEnabled = true;
}

function enableIntl() {
    for (glowsickle of document.querySelectorAll('.container-banner > svg')) {
        enableElementSetting(glowsickle, "glow");
    }
    enableElementSetting(document.querySelector('#inti + .cover'), "changeTheme");
    enableElementSetting(document.querySelector('#crimsonearth + .cover'), "changeBackground");
}

function enableSides() {
    for (side of document.getElementsByClassName("body-side")) {
        enableElementSetting(side, "changeBackground");
    }
}

function enableElementSetting(element, setting) {
    element.setAttribute("onclick", 'return ' + setting + '();');
    element.setAttribute("onkeydown", 'return ' + setting + '(event);');
    element.setAttribute("tabindex", "0");
    element.style.cursor = "pointer";
}

/************
*** close ***
************/
function closeMenu(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;
    document.getElementById("menu").removeAttribute("open");
}

/***************
*** settings ***
***************/
function savePosition(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;

    var onText;
    if (language.includes('en')) {
        onText = "On";
    } else if (language.includes('es')) {
        onText = "Prendido"
    } else if (language.includes('fr')) {
        onText = "Activé"
    } else if (language.includes('pt')) {
        onText = "Ligado"
    }

    var offText;
    if (language.includes('en')) {
        offText = "Off";
    } else if (language.includes('es')) {
        offText = "Apagado"
    } else if (language.includes('fr')) {
        offText = "Désactivé"
    } else if (language.includes('pt')) {
        offText = "Desligado"
    }

    if (document.getElementById("settings-position").textContent.includes(offText)) {
        localStorage.removeItem("position");
        if (!home) {
            storeRelativePosition();
        }
        setSettingTextByLanguage("settings-position", "Save Position", "On", "Guardar Posición", "Prendido", "Sauvegarder Position", "Activé", "Salvar Posição", "Ligado");
        isSavingPosition = true;
    } else if (document.getElementById("settings-position").textContent.includes(onText)) {
        localStorage.removeItem(positionStorage);
        localStorage.setItem("position", "off");
        setSettingTextByLanguage("settings-position", "Save Position", "Off", "Guardar Posición", "Apagado", "Sauvegarder Position", "Désactivé", "Salvar Posição", "Desligado");
        isSavingPosition = false;
    }
}

function changeSize(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;

    var sizeText = "--size-text";
    var sizeLine = "--size-line";
    var size = window.getComputedStyle(document.documentElement).getPropertyValue(sizeText);
    
    if (size.includes('-0.10rem')) {
        root.style.setProperty(sizeText, "0.00rem");
        root.style.setProperty(sizeLine, "0.60rem");
        localStorage.removeItem("size");
        setSettingTextByLanguage("settings-size", "Size", "Regular", "Tamaño", "Regular", "Taille", "Régulier", "Tamanho", "Regular");
    } else if (size.includes('0.00rem')) {
        console.log(size);
        root.style.setProperty(sizeText, "0.15rem");
        root.style.setProperty(sizeLine, "0.70rem");
        localStorage.setItem("size", "large");
        setSettingTextByLanguage("settings-size", "Size", "Large", "Tamaño", "Grande", "Taille", "Grand", "Tamanho", "Grande");
    } else if (size.includes('0.15rem')) {
        
        root.style.setProperty(sizeText, "-0.10rem");
        root.style.setProperty(sizeLine, "0.50rem");
        localStorage.setItem("size", "small");
        setSettingTextByLanguage("settings-size", "Size", "Small", "Tamaño", "Pequeño", "Taille", "Petit", "Tamanho", "Pequeno");
    }
    scrollToRelativePosition();
}

function changeTextMargins(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;

    var sizeTextMargin = "--size-margin-text";
    var margins = window.getComputedStyle(document.documentElement).getPropertyValue(sizeTextMargin);
    if (margins.includes('-0.75rem')) {
        root.style.setProperty(sizeTextMargin, "-0.25rem");
        localStorage.removeItem("margins");
        setSettingTextByLanguage("settings-margins", "Margins", "Regular", "Márgenes", "Regular", "Marges", "Régulier", "Margens", "Regular");
    } else if (margins.includes('-0.25rem')) {
        root.style.setProperty(sizeTextMargin, "0.75rem");
        localStorage.setItem("margins", "large");
        setSettingTextByLanguage("settings-margins", "Margins", "Large", "Márgenes", "Grande", "Marges", "Grand", "Margens", "Grande");
    } else if (margins.includes('0.75rem')) {
        root.style.setProperty(sizeTextMargin, "-0.75rem");
        localStorage.setItem("margins", "small");
        setSettingTextByLanguage("settings-margins", "Margins", "Small", "Márgenes", "Pequeño", "Marges", "Petit", "Margens", "Pequeno");
    }
    scrollToRelativePosition();
}

function changeSpacing(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;

    var sizeSpacing = "--size-spacing";
    var spacing = window.getComputedStyle(document.documentElement).getPropertyValue(sizeSpacing);
    if (spacing.includes('0.125rem')) {
        root.style.setProperty(sizeSpacing, "0.25rem");
        localStorage.setItem("spacing", "large");
        setSettingTextByLanguage("settings-spacing", "Spacing", "Large", "Espaciamiento", "Grande", "Espacement", "Grand", "Espaçamento", "Grande");
    } else if (spacing.includes('0.25rem')) {
        root.style.setProperty(sizeSpacing, "0.00rem");
        localStorage.setItem("spacing", "small");
        setSettingTextByLanguage("settings-spacing", "Spacing", "Small", "Espaciamiento", "Pequeño", "Espacement", "Petit", "Espaçamento", "Pequeno");
    } else if (spacing.includes('0.00rem')) {
        root.style.setProperty(sizeSpacing, "0.125rem");
        localStorage.removeItem("spacing");
        setSettingTextByLanguage("settings-spacing", "Spacing", "Regular", "Espaciamiento", "Regular", "Espacement", "Régulier", "Espaçamento", "Regular");
    }
    scrollToRelativePosition();
}

function changeParagraphNumbers(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;

    var isCounting = window.getComputedStyle(document.documentElement).getPropertyValue('--paragraph-numbers').includes("attr");
    if (isCounting) {
        root.style.setProperty('--paragraph-numbers', 'none');
        localStorage.setItem("numbers", "off");
        setSettingTextByLanguage("settings-numbers", "Page Numbers", "Off", "Números De Páginas", "Apagado", "Numéros De Pages", "Désactivé", "Números De Páginas", "Desligado");
    } else {
        root.style.setProperty('--paragraph-numbers', 'attr(data-location)');
        localStorage.removeItem("numbers");
        setSettingTextByLanguage("settings-numbers", "Page Numbers", "On", "Números De Páginas", "Prendido", "Numéros De Pages", "Activé", "Números De Páginas", "Ligado");
    }
}

function changeAlignment(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;

    var align = "--text-alignment";

    var alignment = window.getComputedStyle(document.documentElement).getPropertyValue(align);
    if (alignment.includes('left')) {
        root.style.setProperty(align, "justify");
        localStorage.removeItem("alignment");
        setSettingTextByLanguage("settings-alignment", "Alignment", "Justified", "Alineación", "Justificado", "Alignement", "Justifié", "Alinhamento", "Justificado");
    } else {
        root.style.setProperty(align, "left");
        localStorage.setItem("alignment", "left");
        setSettingTextByLanguage("settings-alignment", "Alignment", "Left", "Alineación", "Izquierda", "Alignement", "Gauche", "Alinhamento", "Esquerda");
    }
}

function changeHyphenation(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;

    var hyphenation = "--text-hyphenation";
    var hyphens = window.getComputedStyle(document.documentElement).getPropertyValue(hyphenation);
    if (hyphens.includes('auto')) {
        root.style.setProperty(hyphenation, "none");
        localStorage.removeItem("hyphens");
        setSettingTextByLanguage("settings-hyphenation", "Hyphens", "Off", "Guiones", "Apagado", "Tirets", "Désactivé", "Hífens", "Desligado");
    } else if (hyphens.includes('none')) {
        root.style.setProperty(hyphenation, "auto");
        localStorage.setItem("hyphens", "on");
        setSettingTextByLanguage("settings-hyphenation", "Hyphens", "On", "Guiones", "Prendido", "Tirets", "Activé", "Hífens", "Ligado");
    }
    scrollToRelativePosition();
}

function changeDelimiters(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;


    var delimiter = "--delimiter";
    var delimiterAlt = "--delimiter-alt";
    var delimiters = window.getComputedStyle(document.documentElement).getPropertyValue(delimiter);
    var delimitersAlt = window.getComputedStyle(document.documentElement).getPropertyValue(delimiterAlt);

    if (delimiters.includes('none')) {
        root.style.setProperty(delimiter, "var(--image-border)");
        root.style.setProperty(delimiterAlt, "var(--image-border-alt)");
        localStorage.setItem("delimiters", "on");
        setSettingTextByLanguage("settings-delimiters", "Delimiters", "On", "Delimitadores", "Prendido", "Délimiteurs", "Activé", "Delimitadores", "Ligado");
    } else {
        root.style.setProperty(delimiter, "none");
        root.style.setProperty(delimiterAlt, "none");
        localStorage.removeItem("delimiters");
        setSettingTextByLanguage("settings-delimiters", "Delimiters", "Off", "Delimitadores", "Apagado", "Délimiteurs", "Désactivé", "Delimitadores", "Desligado");
    }
    scrollToRelativePosition();
}

function changeBackground(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;

    var propertyName = "--image-background";
    var background = window.getComputedStyle(document.documentElement).getPropertyValue(propertyName);
    if (background.includes('none')) {
        root.style.setProperty(propertyName, "var(--image-background-static)");
        localStorage.setItem("background", "static");
        setSettingTextByLanguage("settings-background", "Background", "Static", "Fondo", "Estático", "Fond", "Statique", "Fundo", "Estático");
    } else if (background.includes('static')) {
        root.style.setProperty(propertyName, "var(--image-background-animated)");
        localStorage.setItem("background", "animated");
        setSettingTextByLanguage("settings-background", "Background", "Animated", "Fondo", "Animado", "Fond", "Animé", "Fundo", "Animado");
    } else if (background.includes('animated')) {
        root.style.setProperty(propertyName, "none");
        localStorage.removeItem("background");
        setSettingTextByLanguage("settings-background", "Background", "None", "Fondo", "Nada", "Fond", "Aucun", "Fundo", "Nenhum");
    }
}

function deleteData(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;
    if (deleteDataCount != 0) {
        if (deleteDataCount == 3) {
            setSettingTextByLanguage("settings-data", "Reinitialize Settings", "Press 2 Times", "Reiniciar Ajustes", "Apretar 2 Veces", "Réinitialiser Options", "Appuyer 2 Fois", "Reiniciar Configurações", "Pressione 2 Vezes");
        } else if (deleteDataCount == 2) {
            setSettingTextByLanguage("settings-data", "Reinitialize Settings", "Press 1 Time", "Reiniciar Ajustes", "Apretar 1 Vez", "Réinitialiser Options", "Appuyer 1 Fois", "Reiniciar Configurações", "Pressione 1 Vez");
        } else if (deleteDataCount == 1) {
            localStorage.clear();
            setInitialSettings();
            setSettingTextByLanguage("settings-data", "Reinitialize Settings", "Reinitialized", "Reiniciar Ajustes", "Reiniciadas", "Réinitialiser Options", "Réinitialisés", "Reiniciar Configurações", "Reinicializadas");
        }
        deleteDataCount -= 1;
    } else {
        setSettingTextByLanguage("settings-data", "Reinitialize Settings", "Press 3 Times", "Reiniciar Ajustes", "Apretar 3 Veces", "Réinitialiser Options", "Appuyer 3 Fois", "Reiniciar Configurações", "Pressione 3 Vezes");
        deleteDataCount = 3;
    }
}

function glow(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;

    var isGlowing = window.getComputedStyle(document.documentElement).getPropertyValue('--glow').includes("infinite");
    if (isGlowing) {
        root.style.setProperty('--glow', 'none');
    } else {
        root.style.setProperty('--glow', 'glow 13s infinite');
    }
}

function keyIsPressedAndIsNotEnter(key) {
    return (key && key.keyCode != "13" ? true : false);
}

function setSettingText(id, key, value) {
    if (settingsEnabled) {
        return (document.getElementById(id).innerHTML = "<span>" + key + ":</span> <span>" + value + "</span>");
    }
}

function setSettingTextByLanguage(setting, en1, en2, es1, es2, fr1, fr2, pt1, pt2) {
    var pre;
    var post;
    if (language.includes('en')) {
        pre = en1;
        post = en2;
    } else if (language.includes('es')) {
        pre = es1;
        post = es2;
    } else if (language.includes('fr')) {
        pre = fr1;
        post = fr2;
    } else if (language.includes('pt')) {
        pre = pt1;
        post = pt2;
    }
    setSettingText(setting, pre, post);
}

/************
*** theme ***
************/
function changeTheme(key = null) {
    if (keyIsPressedAndIsNotEnter(key)) return;

    var isSystemTheme = window.getComputedStyle(document.documentElement).getPropertyValue('--theme').includes("system");
    var isLightTheme = window.getComputedStyle(document.documentElement).getPropertyValue('--theme').includes("light");
    var oldTheme;
    var newTheme = (isLightTheme ? 'theme-dark' : 'theme-light');
    if (isSystemTheme) {
        oldTheme = 'theme-system';
    } else {
        oldTheme = (isLightTheme ? 'theme-light' : 'theme-dark');
    }
    enableTheme(newTheme);
    disableTheme(oldTheme);
}

function enableTheme(theme) {
    var systemTheme = getSystemTheme();
    if (theme.includes(systemTheme.replace("system-", ""))) {
        document.getElementById("theme-system").removeAttribute('disabled');
        setSettingTextByLanguage("settings-theme", "Light Or Dark", getThemeSettingText(systemTheme), "Claro U Oscuro", getThemeSettingText(systemTheme), "Clair Ou Obscur", getThemeSettingText(systemTheme), "Claro Ou Escuro", getThemeSettingText(systemTheme));
        localStorage.removeItem("theme");
    } else {
        document.getElementById(theme).removeAttribute('disabled');
        if (!theme.includes("system")) {
            localStorage.setItem("theme", theme);
        }
        setSettingTextByLanguage("settings-theme", "Light Or Dark", getThemeSettingText(theme), "Claro U Oscuro", getThemeSettingText(theme), "Clair Ou Obscur", getThemeSettingText(theme), "Claro Ou Escuro", getThemeSettingText(theme));
    }
}

function disableTheme(theme) {
    return (setTimeout(() => {
        document.getElementById(theme).setAttribute("disabled", "");
    }, 100));
}

function getThemeSettingText(theme) {
    if (language.includes('en')) {
        return (theme.includes("light") ? 'Light' : 'Dark');
    } else if (language.includes('es')) {
        return (theme.includes("light") ? 'Claro' : 'Oscuro');
    } else if (language.includes('fr')) {
        return (theme.includes("light") ? 'Clair' : 'Obscur');
    } else if (language.includes('pt')) {
        return (theme.includes("light") ? 'Claro' : 'Escuro');
    }
}

function getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme)').matches) {
        return (window.matchMedia('(prefers-color-scheme: dark)').matches ? "system-dark" : "system-light");
    } else {
        return null;
    }
}

/********************
*** anchor offset ***
********************/
(function (document, history, location) {
    var HISTORY_SUPPORT = !!(history && history.pushState);

    var anchorScrolls = {
        ANCHOR_REGEX: /^#[^ ]+$/,

        init: function () {
            window.addEventListener('hashchange', this.scrollToCurrent.bind(this));
            document.body.addEventListener('click', this.stopDefault.bind(this));
        },

        scrollToCurrent: function () {
            this.scrollIfAnchor(window.location.hash);
        },

        scrollIfAnchor: function (href, pushToHistory) {
            var match, rect, anchorOffset;

            if (!this.ANCHOR_REGEX.test(href)) {
                return false;
            }

            match = document.getElementById(href.slice(1));

            if (match) {
                rect = match.getBoundingClientRect();
                anchorOffset = window.scrollY + rect.top - getPixels(offset);
                window.scrollTo(0, anchorOffset);

                // Add the state to history as-per normal anchor links
                if (HISTORY_SUPPORT && pushToHistory) {
                    history.pushState({}, document.title, location.pathname + href);
                }
            }

            return !!match;
        },

        stopDefault: function (event) {
            if (event.target.nodeName === 'A' && this.scrollIfAnchor(event.target.getAttribute('href'), true)) {
                event.preventDefault();
            }
        }
    };

    window.addEventListener(
        'DOMContentLoaded', anchorScrolls.init.bind(anchorScrolls), anchorScrolls.scrollToCurrent()
    );

    window.addEventListener(
        'resize', anchorScrolls.init.bind(anchorScrolls)
    );
})(window.document, window.history, window.location);