/* =========================
   DOM ELEMENTS
========================= */
document.addEventListener("DOMContentLoaded", () => {

    // DOM Elements
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const stadiumMap = document.getElementById('stadiumMap');
    const closeMap = document.getElementById('closeMap');
    const mapTitle = document.getElementById('mapTitle');
    const stadiumIframe = document.getElementById('stadiumIframe');

    // ALL your existing code stays here 👇

    /* =========================
       DATA
    ========================= */
    const teams = [
        "Freetown FC", "Koidu United", "Bo Rangers", "East End Lions",
        "Mighty Blackpool", "FC Kallon", "Ports Authority", "Diamond Stars",
        "Old Edwardians", "Central Parade", "RSLAF", "Golden Dragon"
    ];

    const stadiums = [
        { name: "Siaka Stevens Stadium", city: "Freetown", coords: "-13.2403,8.4765" },
        { name: "Bo City Stadium", city: "Bo", coords: "-11.6468,7.9499" },
        { name: "Koidu Stadium", city: "Koidu", coords: "-10.6236,8.6289" },
        { name: "Kenema Stadium", city: "Kenema", coords: "-11.1667,7.8833" },
        { name: "Moyamba Stadium", city: "Moyamba", coords: "-12.5833,8.2833" }
    ];

    const players = [
        "Abdulai Conteh", "Mohamed Kamara", "Ishmael Bangura", "Alhaji Kamara",
        "Kei Kamara", "Mohamed Buya Turay", "Osman Kakay", "Musa Noah Kamara",
        "Alusine Turay", "Saidu Bah", "Mohamed Lamine Conteh", "Ibrahim Koroma"
    ];

    const positions = ["GK", "RB", "CB", "CB", "LB", "CM", "CM", "AM", "RW", "LW", "ST"];

    /* =========================
       MATCH GENERATOR
    ========================= */
    function generateMatches(count, upcoming = false) {
        const matches = [];
        const today = new Date();

        for (let i = 0; i < count; i++) {
            let home = teams[Math.floor(Math.random() * teams.length)];
            let away;

            do {
                away = teams[Math.floor(Math.random() * teams.length)];
            } while (away === home);

            const stadium = stadiums[Math.floor(Math.random() * stadiums.length)];
            const date = new Date(today);

            date.setDate(today.getDate() + (upcoming ? Math.random() * 30 + 1 : -(Math.random() * 60 + 1)));

            const formattedDate = date.toLocaleDateString("en-GB");

            let score = "";
            if (!upcoming) {
                score = `${Math.floor(Math.random() * 5)} - ${Math.floor(Math.random() * 5)}`;
            }

            matches.push({
                home,
                away,
                stadium: stadium.name,
                city: stadium.city,
                coords: stadium.coords,
                date: formattedDate,
                score
            });
        }

        return matches;
    }

    /* =========================
       TRANSFERS
    ========================= */
    function generateTransfers() {
        return Array.from({ length: 12 }, () => ({
            player: players[Math.floor(Math.random() * players.length)],
            from: teams[Math.floor(Math.random() * teams.length)],
            to: teams[Math.floor(Math.random() * teams.length)],
            type: Math.random() > 0.5 ? "IN" : "OUT",
            fee: `${Math.floor(Math.random() * 500)}k`
        }));
    }

    /* =========================
       MATCH RENDERING
    ========================= */
    function getScoreClass(score) {
        if (!score) return "";
        const [a, b] = score.split(" - ").map(Number);
        if (a > b) return "score-win";
        if (a < b) return "score-loss";
        return "score-draw";
    }

    function populateMatches(containerId, matches, upcoming = false) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = "";

        matches.forEach(match => {
            const card = document.createElement("div");
            card.className = "match-card";

            card.innerHTML = `
                <div class="match-teams">
                    <span>${match.home}</span>
                    <span class="vs">VS</span>
                    <span>${match.away}</span>
                </div>
                ${!upcoming ? `<div class="match-score ${getScoreClass(match.score)}">${match.score}</div>` : ""}
                <div class="match-info">
                    <span>${match.date}</span>
                    <span class="match-location" data-coords="${match.coords}">
                        📍 ${match.city}
                    </span>
                </div>
            `;

            container.appendChild(card);

            card.querySelector(".match-location").addEventListener("click", () => {
                const [lng, lat] = match.coords.split(",");
                mapTitle.textContent = match.stadium;
                stadiumIframe.src = `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
                stadiumMap.classList.add("active");
            });
        });
    }

    /* =========================
       SQUAD
    ========================= */
    function populateSquad() {
        const pitch = document.querySelector(".pitch-container");
        const list = document.getElementById("playerList");
        if (!pitch || !list) return;

        pitch.innerHTML = "";
        list.innerHTML = "";

        positions.forEach((pos, i) => {
            const p = document.createElement("div");
            p.className = "player";
            p.textContent = pos;
            p.style.top = `${15 + Math.floor(i / 4) * 25}%`;
            p.style.left = `${20 + (i % 4) * 20}%`;
            pitch.appendChild(p);

            const li = document.createElement("li");
            li.textContent = `${players[i]} - ${pos}`;
            list.appendChild(li);
        });
    }

    /* =========================
       TRANSFER LIST
    ========================= */
    function populateTransfers() {
        const list = document.getElementById("transferList");
        if (!list) return;

        list.innerHTML = "";
        generateTransfers().forEach(t => {
            list.innerHTML += `
                <li class="transfer-item">
                    <strong>${t.player}</strong>
                    <span class="${t.type === "IN" ? "transfer-in" : "transfer-out"}">
                        ${t.type} • ${t.fee}
            `;
        });
    }

    /* =========================
       INIT
    ========================= */
    const upcoming = generateMatches(30, true);
    const past = generateMatches(20);

    populateMatches("upcomingMatches", upcoming, true);
    populateMatches("pastMatches", past);
    populateMatches("seasonMatches", [...upcoming, ...past]);

    populateSquad();
    populateTransfers();

    /* =========================
       TABS
    ========================= */
    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            tabButtons.forEach(b => b.classList.remove("active"));
            tabContents.forEach(c => c.classList.remove("active"));

            btn.classList.add("active");
            document.getElementById(btn.dataset.tab)?.classList.add("active");
        });
    });

    /* =========================
       MAP CLOSE
    ========================= */
    closeMapBtn?.addEventListener("click", () => stadiumMap.classList.remove("active"));

    stadiumMap?.addEventListener("click", e => {
        if (e.target === stadiumMap) stadiumMap.classList.remove("active");
    });

});
// Tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Stadium map controls
const stadiumMap = document.getElementById('stadiumMap');
const closeMap = document.getElementById('closeMap');

closeMap.addEventListener('click', () => {
    stadiumMap.classList.remove('active');
});


const statData = {
            players: {
                icon: 'fa-users',
                title: 'Professional Players',
                highlights: [
                    { number: '50+', label: 'Total Players' },
                    { number: '12', label: 'Top Division' },
                    { number: '8', label: 'International Caps' }
                ],
                items: [
                    {
                        title: 'Elite Talent Pool',
                        description: 'We represent over 50 professional footballers across various positions, from goalkeepers to strikers.'
                    },
                    {
                        title: 'Proven Track Record',
                        description: 'Our players have scored over 200 goals collectively in professional leagues and contributed 150+ assists.'
                    },
                    {
                        title: 'National Team Stars',
                        description: '8 of our players have represented Sierra Leone at international level, bringing pride to the nation.'
                    },
                    {
                        title: 'Youth to Professional',
                        description: 'We\'ve successfully guided 15 youth players to professional contracts in the past 3 years.'
                    }
                ]
            },
            championships: {
                icon: 'fa-trophy',
                title: 'Championships Won',
                highlights: [
                    { number: '15', label: 'Total Titles' },
                    { number: '5', label: 'League Titles' },
                    { number: '10', label: 'Cup Victories' }
                ],
                items: [
                    {
                        title: 'Sierra Leone Premier League',
                        description: '5 league championship titles won by our represented players with East End Lions, Bo Rangers, and Mighty Blackpool.'
                    },
                    {
                        title: 'FA Cup Triumphs',
                        description: '7 FA Cup victories, showcasing our players\' ability to perform in high-pressure knockout competitions.'
                    },
                    {
                        title: 'Regional Tournaments',
                        description: '3 regional tournament wins, including the West African Club Championship.'
                    },
                    {
                        title: 'Individual Awards',
                        description: 'Our players have won 20+ individual awards including Player of the Year and Golden Boot.'
                    }
                ]
            },
            countries: {
                icon: 'fa-globe',
                title: 'Countries Represented',
                highlights: [
                    { number: '12', label: 'Countries' },
                    { number: '4', label: 'Continents' },
                    { number: '25', label: 'Different Leagues' }
                ],
                items: [
                    {
                        title: 'Europe',
                        description: 'Players in leagues across England, Spain, Italy, Germany, and Portugal.'
                    },
                    {
                        title: 'Africa',
                        description: 'Strong presence in Nigeria, Ghana, South Africa, Egypt, and Morocco.'
                    },
                    {
                        title: 'Asia',
                        description: 'Growing representation in UAE and Saudi Arabia leagues.'
                    },
                    {
                        title: 'Americas',
                        description: 'Players competing in United States MLS and South American leagues.'
                    }
                ]
            },
            transfers: {
                icon: 'fa-handshake',
                title: 'International Transfers',
                highlights: [
                    { number: '30+', label: 'Total Transfers' },
                    { number: '$5M+', label: 'Transfer Value' },
                    { number: '15', label: 'European Moves' }
                ],
                items: [
                    {
                        title: 'European Transfers',
                        description: '15 successful transfers to European clubs including Championship, Serie A, and La Liga teams.'
                    },
                    {
                        title: 'Record Deals',
                        description: 'Facilitated Sierra Leone\'s biggest transfer deal worth $500,000 to a top European league.'
                    },
                    {
                        title: 'African Leagues',
                        description: '10 transfers within African leagues, strengthening regional football connections.'
                    },
                    {
                        title: 'Rising Stars',
                        description: '5 youth academy graduates secured professional contracts abroad in the last 2 years.'
                    }
                ]
            }
        };

        function showStatInfo(type) {
            const data = statData[type];
            const modal = document.getElementById('infoModal');
            const content = document.getElementById('modalContent');

            let highlightsHTML = data.highlights.map(h => `
                <div class="highlight-box">
                    <div class="highlight-number">${h.number}</div>
                    <div class="highlight-label">${h.label}</div>
                </div>
            `).join('');

            let itemsHTML = data.items.map(item => `
                <li class="info-item">
                    <h4>${item.title}</h4>
                    <p>${item.description}</p>
                </li>
            `).join('');

            content.innerHTML = `
                <div class="modal-header">
                    <div class="modal-icon">
                        <i class="fas ${data.icon}"></i>
                    </div>
                    <h2 class="modal-title">${data.title}</h2>
                </div>
                <div class="stat-highlight">
                    ${highlightsHTML}
                </div>
                <ul class="info-list">
                    ${itemsHTML}
                </ul>
            `;

            modal.classList.add('active');
        }

        function closeInfoModal() {
            document.getElementById('infoModal').classList.remove('active');
        }

        // Close modal when clicking outside
        document.getElementById('infoModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeInfoModal();
            }
        });

        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeInfoModal();
            }
        });