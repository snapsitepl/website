document.addEventListener("DOMContentLoaded", () => {
    
    // --- STAN APLIKACJI (State) ---
    const state = {
        type: "prywatna",
        typeName: "Prywatna wizytówka",
        basePrice: 25,
        style: "minimalist",
        styleName: "Minimalistyczny",
        primaryColor: "#6d28d9",
        secondaryColor: "#06b6d4",
        font: "'Poppins', sans-serif",
        fontName: "Poppins",
        borderRadius: "12",
        addons: [],
        totalPrice: 25
    };

    // --- MAPOWANIE NAZW ---
    const styleNames = {
        minimalist: "Minimalistyczny",
        premium: "Premium",
        gaming: "Gamingowy",
        futuristic: "Futurystyczny",
        dark: "Dark Mode",
        neon: "Neon",
        luxury: "Luxury",
        startup: "Tech Startup"
    };

    // --- SELEKTORY DOM ---
    const typeCards = document.querySelectorAll(".type-card");
    const styleCards = document.querySelectorAll(".style-card");
    const inputPrimaryColor = document.getElementById("primaryColor");
    const inputSecondaryColor = document.getElementById("secondaryColor");
    const selectFont = document.getElementById("fontSelect");
    const inputRangeRadius = document.getElementById("borderRadius");
    const addonCheckboxes = document.querySelectorAll(".addon-check");
    
    // Podgląd live i obliczenia
    const liveMonitor = document.getElementById("liveMonitor");
    const calculatedPriceEl = document.getElementById("calculatedPrice");
    const btnDownloadConfig = document.getElementById("btnDownloadConfig");
    
    // Przyciski akcji
    const btnIdeaGenerator = document.getElementById("btnIdeaGenerator");
    const ideaDisplay = document.getElementById("ideaDisplay");
    const ideaText = document.getElementById("ideaText");
    
    // Formularz i podsumowanie
    const orderForm = document.getElementById("orderForm");
    const inputCustomPrice = document.getElementById("customPrice");
    
    const sumType = document.getElementById("sumType");
    const sumStyle = document.getElementById("sumStyle");
    const sumColorPrimary = document.getElementById("sumColorPrimary");
    const sumAutoPrice = document.getElementById("sumAutoPrice");
    const sumClientPrice = document.getElementById("sumClientPrice");
    
    const hiddenScreenshot = document.getElementById("hiddenScreenshot");

    // Pola płatności
    const payBlik = document.getElementById("payBlik");
    const payPsc = document.getElementById("payPsc");
    const blikDetails = document.getElementById("blikDetails");
    const pscDetails = document.getElementById("pscDetails");
    const blikContact = document.getElementById("blikContact");
    const pscCode = document.getElementById("pscCode");

    // Modal i Spinner
    const successModal = document.getElementById("successModal");
    const btnCloseModal = document.getElementById("btnCloseModal");
    const btnSubmitForm = document.getElementById("btnSubmitForm");
    const btnSubmitText = document.getElementById("btnSubmitText");
    const btnSubmitSpinner = document.getElementById("btnSubmitSpinner");

    // --- AKTUALIZACJA PODGLĄDU I CENNIKA ---
    function updateApp() {
        // 1. Obliczanie ceny
        let currentTotal = 0;
        if (state.basePrice === "indywidualna") {
            calculatedPriceEl.textContent = "Indywidualna";
            state.totalPrice = "Wycena indywidualna";
        } else {
            currentTotal += state.basePrice;
            state.addons.forEach(addon => { currentTotal += addon.price; });
            calculatedPriceEl.textContent = currentTotal;
            state.totalPrice = currentTotal + " PLN";
        }

        // 2. Aktualizacja stylów struktury monitora Live
        liveMonitor.style.fontFamily = state.font;
        liveMonitor.style.borderRadius = `${state.borderRadius}px`;
        liveMonitor.style.setProperty('--violet-main', state.primaryColor);
        liveMonitor.style.setProperty('--turquoise-main', state.secondaryColor);
        
        const mockHeroTitle = liveMonitor.querySelector(".mock-hero-title");
        const mockPrimaryBtn = liveMonitor.querySelector(".mock-btn.primary");
        const mockCards = liveMonitor.querySelectorAll(".mock-card");

        mockHeroTitle.textContent = `${state.typeName}`;
        mockPrimaryBtn.style.background = state.primaryColor;
        mockPrimaryBtn.style.borderRadius = `${Math.min(state.borderRadius, 8)}px`;

        if (state.style === "neon" || state.style === "futuristic") {
            mockPrimaryBtn.style.boxShadow = `0 0 12px ${state.primaryColor}`;
        } else {
            mockPrimaryBtn.style.boxShadow = "none";
        }

        mockCards.forEach(card => {
            card.style.borderRadius = `${Math.min(state.borderRadius, 8)}px`;
        });

        // 3. Aktualizacja komponentu podsumowania
        sumType.textContent = state.typeName;
        sumStyle.textContent = state.styleName;
        sumColorPrimary.textContent = state.primaryColor;
        sumColorPrimary.style.color = state.primaryColor;
        sumAutoPrice.textContent = state.totalPrice;
    }

    // --- OBSŁUGA ZDARZEŃ ZMIAN ---

    typeCards.forEach(card => {
        card.addEventListener("click", () => {
            typeCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            
            state.type = card.dataset.type;
            state.typeName = card.querySelector(".type-name").textContent;
            const priceVal = card.dataset.price;
            state.basePrice = priceVal === "indywidualna" ? "indywidualna" : parseInt(priceVal);
            
            updateApp();
        });
    });

    styleCards.forEach(card => {
        card.addEventListener("click", () => {
            styleCards.forEach(c => c.classList.remove("active"));
            card.classList.add("active");
            
            state.style = card.dataset.style;
            state.styleName = styleNames[card.dataset.style];
            
            if (state.style === "neon") {
                inputPrimaryColor.value = "#ec4899"; inputSecondaryColor.value = "#06b6d4";
            } else if (state.style === "luxury") {
                inputPrimaryColor.value = "#eab308"; inputSecondaryColor.value = "#1a1a1a";
            } else if (state.style === "minimalist") {
                inputPrimaryColor.value = "#4b5563"; inputSecondaryColor.value = "#9ca3af";
            } else if (state.style === "futuristic" || state.style === "startup") {
                inputPrimaryColor.value = "#6d28d9"; inputSecondaryColor.value = "#06b6d4";
            }

            state.primaryColor = inputPrimaryColor.value;
            state.secondaryColor = inputSecondaryColor.value;
            updateApp();
        });
    });

    inputPrimaryColor.addEventListener("input", (e) => { state.primaryColor = e.target.value; updateApp(); });
    inputSecondaryColor.addEventListener("input", (e) => { state.secondaryColor = e.target.value; updateApp(); });
    inputRangeRadius.addEventListener("input", (e) => { state.borderRadius = e.target.value; updateApp(); });
    
    selectFont.addEventListener("change", (e) => {
        state.font = e.target.value;
        state.fontName = e.target.options[e.target.selectedIndex].text.split(" ")[0];
        updateApp();
    });

    addonCheckboxes.forEach(box => {
        box.addEventListener("change", () => {
            state.addons = [];
            addonCheckboxes.forEach(b => {
                if (b.checked) {
                    state.addons.push({ name: b.value, price: parseInt(b.dataset.addonPrice) });
                }
            });
            updateApp();
        });
    });

    inputCustomPrice.addEventListener("input", (e) => {
        sumClientPrice.textContent = e.target.value ? e.target.value + " PLN" : "Brak";
    });

    // --- POBIERANIE PLIKU JSON ---
    btnDownloadConfig.addEventListener("click", () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "moj_projekt_snapsite.json");
        dlAnchorElem.click();
    });

    // --- LOGIKA PŁATNOŚCI ---
    function updatePaymentFields() {
        if (payBlik.checked) {
            blikDetails.classList.remove("hidden");
            pscDetails.classList.add("hidden");
            blikContact.setAttribute("required", "true");
            pscCode.removeAttribute("required");
        } else if (payPsc.checked) {
            pscDetails.classList.remove("hidden");
            blikDetails.classList.add("hidden");
            pscCode.setAttribute("required", "true");
            blikContact.removeAttribute("required");
        }
    }

    payBlik.addEventListener("change", updatePaymentFields);
    payPsc.addEventListener("change", updatePaymentFields);

    // --- GENERATOR POMYSŁÓW ---
    const pomysly = [
        { tekst: "Nowoczesne portfolio programisty z ciemnym motywem i zielonymi akcentami matrixa.", styl: "Dark Mode", barwy: "Zielony i Czerń" },
        { tekst: "Szybki Landing Page dla serwera Minecraft BoxPvP posiadający opis nowej edycji.", styl: "Neon", barwy: "Fiolet i Róż" },
        { tekst: "Wizytówka Twojej firmy, przejrzysta, budująca zaufanie z cennikiem i opiniami.", styl: "Premium", barwy: "Złoty i Ciemny Granat" }
    ];

    btnIdeaGenerator.addEventListener("click", () => {
        const los = pomysly[Math.floor(Math.random() * pomysly.length)];
        ideaText.innerHTML = `💡 <strong>Sugestia:</strong> ${los.tekst}<br>🎨 <strong>Styl:</strong> ${los.styl} | <strong>Barwy:</strong> ${los.barwy}`;
        ideaDisplay.classList.remove("hidden");
    });

    // --- LICZNIKI HERO ---
    const stats = document.querySelectorAll(".stat-number");
    stats.forEach(stat => {
        const target = parseInt(stat.dataset.target);
        if (target) {
            let count = 0;
            const speed = target / 30;
            const counterInterval = setInterval(() => {
                count += speed;
                if (count >= target) {
                    stat.textContent = target;
                    clearInterval(counterInterval);
                } else {
                    stat.textContent = Math.floor(count);
                }
            }, 40);
        }
    });

    // --- SLIDER OPINII ---
    const slides = document.querySelectorAll(".opinion-slide");
    const dots = document.querySelectorAll("#sliderDots .dot");
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(s => s.classList.remove("active"));
        dots.forEach(d => d.classList.remove("active"));
        slides[index].classList.add("active");
        dots[index].classList.add("active");
        currentSlide = index;
    }

    dots.forEach(dot => {
        dot.addEventListener("click", (e) => { showSlide(parseInt(e.target.dataset.index)); });
    });

    setInterval(() => {
        let next = currentSlide + 1;
        if (next >= slides.length) next = 0;
        showSlide(next);
    }, 6000);

    // --- WYSYŁKA FORMULARZA Z REALNYM API WEB3FORMS ---
    orderForm.addEventListener("submit", (e) => {
        e.preventDefault();

        btnSubmitText.classList.add("hidden");
        btnSubmitSpinner.classList.remove("hidden");
        btnSubmitForm.disabled = true;

        // 1. Najpierw robimy screenshot podglądu live
        html2canvas(liveMonitor, {
            backgroundColor: "#0f1026",
            scale: 1,
            logging: false
        }).then(canvas => {
            // Wrzucamy obrazek base64 do ukrytego inputa
            hiddenScreenshot.value = canvas.toDataURL("image/png");

            // 2. Pobieramy wszystkie dane z formularza (w tym nasz wygenerowany przed chwilą screenshot)
            const formData = new FormData(orderForm);

            // 3. Wysyłamy realne zapytanie do Web3Forms
            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                
                if (response.status === 200) {
                    // SUKCES: Czyścimy formularz i pokazujemy okienko
                    successModal.classList.remove("hidden");
                    orderForm.reset();
                    sumClientPrice.textContent = "Brak";
                    blikDetails.classList.add("hidden");
                    pscDetails.classList.add("hidden");
                    updateApp(); // Resetuje też podgląd do wartości domyślnych ze stanu
                } else {
                    // BŁĄD API: Web3Forms zwrócił błąd (np. zły klucz)
                    console.error("Błąd Web3Forms:", json);
                    alert("Problem z formularzem: " + (json.message || "Nieznany błąd API"));
                }
            })
            .catch(err => {
                // BŁĄD POŁĄCZENIA: Brak internetu, błąd CORS itp.
                console.error("Błąd sieci:", err);
                alert("Nie udało się połączyć z serwerem wysyłki.");
            })
            .finally(() => {
                // Zawsze przywracamy przycisk do stanu klikalności
                btnSubmitSpinner.classList.add("hidden");
                btnSubmitText.classList.remove("hidden");
                btnSubmitForm.disabled = false;
            });

        }).catch(err => {
            console.error("Błąd screenshotu: ", err);
            alert("Wystąpił problem przy generowaniu podglądu projektu.");
            
            btnSubmitSpinner.classList.add("hidden");
            btnSubmitText.classList.remove("hidden");
            btnSubmitForm.disabled = false;
        });
    });

    btnCloseModal.addEventListener("click", () => {
        successModal.classList.add("hidden");
    });

    updateApp();
});
