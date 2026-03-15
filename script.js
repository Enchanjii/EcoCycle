// --- ICONS ---
lucide.createIcons();

// --- MOBILE MENU ---
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// --- NOTIFICATION ---
const notificationElement = document.getElementById('notification');
const notificationMessage = document.getElementById('notification-message');
let notificationTimeout;
function showNotification(message, duration = 3000) {
    clearTimeout(notificationTimeout);
    notificationMessage.textContent = message;
    notificationElement.classList.remove('hidden', 'opacity-0');
    notificationElement.classList.add('opacity-100');
    notificationTimeout = setTimeout(() => {
        notificationElement.classList.remove('opacity-100');
        notificationElement.classList.add('opacity-0');
        setTimeout(() => notificationElement.classList.add('hidden'), 300);
    }, duration);
}

// --- MAP LOGIC ---
            const map = L.map('map').setView([12.8797, 121.7740], 6); // Centered on the Philippines
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            const hubs = [
                // Luzon
                { id: 1, name: "Quezon City Central Hub", city: "Quezon City", lat: 14.6760, lng: 121.0437, status: "available", items: "All types", capacity: 40 },
                { id: 2, name: "Makati CBD E-Waste Drop", city: "Makati", lat: 14.5547, lng: 121.0244, status: "nearly-full", items: "Laptops, Phones", capacity: 85 },
                { id: 3, name: "Baguio Session Road Bin", city: "Baguio", lat: 16.4124, lng: 120.5976, status: "full", items: "Cables, Chargers", capacity: 100 },
                { id: 4, name: "Pampanga Clark Freeport Hub", city: "Pampanga", lat: 15.1742, lng: 120.5350, status: "available", items: "Monitors, CPUs", capacity: 25 },
                { id: 5, name: "Legazpi Port Center", city: "Legazpi", lat: 13.1425, lng: 123.7439, status: "offline", items: "N/A", capacity: 0 },
                // Visayas
                { id: 6, name: "Cebu IT Park Collection", city: "Cebu", lat: 10.3328, lng: 123.9067, status: "available", items: "All types", capacity: 55 },
                { id: 7, name: "Iloilo Business Park Hub", city: "Iloilo", lat: 10.7073, lng: 122.5458, status: "nearly-full", items: "Mobile Devices", capacity: 75 },
                { id: 8, name: "Bacolod City Hall Drop-off", city: "Bacolod", lat: 10.6725, lng: 122.9508, status: "available", items: "Keyboards, Mice", capacity: 30 },
                { id: 9, name: "Tacloban Robinsons E-Bin", city: "Tacloban", lat: 11.2285, lng: 125.0003, status: "full", items: "Batteries, Cables", capacity: 95 },
                // Mindanao
                { id: 10, name: "Davao Abreeza Mall Hub", city: "Davao", lat: 7.0881, lng: 125.6091, status: "available", items: "All types", capacity: 60 },
                { id: 11, name: "Cagayan de Oro Centrio E-Waste", city: "Cagayan de Oro", lat: 8.4820, lng: 124.6437, status: "nearly-full", items: "CPUs, Monitors", capacity: 90 },
                { id: 12, name: "Zamboanga City KCC Mall Bin", city: "Zamboanga", lat: 6.9179, lng: 122.0792, status: "available", items: "Phones, Tablets", capacity: 45 },

                // More Mindanao
                { id: 13, name: "General Santos City Plaza Hub", city: "General Santos", lat: 6.1164, lng: 125.1716, status: "available", items: "All types", capacity: 35 },
                { id: 14, name: "Butuan Robinsons Place Bin", city: "Butuan", lat: 8.9496, lng: 125.5406, status: "nearly-full", items: "Laptops, Phones", capacity: 80 },
                { id: 15, name: "Surigao City Eco Drop", city: "Surigao", lat: 9.7576, lng: 125.4897, status: "available", items: "Cables, Chargers", capacity: 50 },
                { id: 16, name: "Malaybalay City Hall Hub", city: "Malaybalay", lat: 8.1572, lng: 125.1277, status: "full", items: "Monitors, CPUs", capacity: 100 },
                { id: 17, name: "Tagum City E-Waste Center", city: "Tagum", lat: 7.4475, lng: 125.8076, status: "available", items: "All types", capacity: 60 },
                { id: 18, name: "Kidapawan City Eco Bin", city: "Kidapawan", lat: 7.0083, lng: 125.0892, status: "offline", items: "N/A", capacity: 0 },

                // International examples
                { id: 19, name: "Tokyo Shibuya E-Waste Hub", city: "Tokyo", lat: 35.6580, lng: 139.7016, status: "available", items: "All types", capacity: 40 },
                { id: 20, name: "New York Manhattan Green Bin", city: "New York", lat: 40.7831, lng: -73.9712, status: "nearly-full", items: "Laptops, Phones", capacity: 85 },
                { id: 21, name: "London City Eco Center", city: "London", lat: 51.5074, lng: -0.1278, status: "full", items: "Cables, Chargers", capacity: 100 },
                { id: 22, name: "Sydney Circular Quay Bin", city: "Sydney", lat: -33.8600, lng: 151.2094, status: "available", items: "Monitors, CPUs", capacity: 25 },
                { id: 23, name: "San Francisco Bay Drop", city: "San Francisco", lat: 37.7749, lng: -122.4194, status: "available", items: "All types", capacity: 55 }
            ];

            const statusInfo = {
                "available": { color: "#22c55e", text: "text-green-600", badge: "bg-green-100 text-green-800" },
                "nearly-full": { color: "#f59e0b", text: "text-yellow-600", badge: "bg-yellow-100 text-yellow-800" },
                "full": { color: "#ef4444", text: "text-red-600", badge: "bg-red-100 text-red-800" },
                "offline": { color: "#6b7280", text: "text-gray-600", badge: "bg-gray-100 text-gray-800" },
            };

            let markers = {};
            let userLocationMarker = null;
            const binDetailsContainer = document.getElementById('bin-details');
            const searchInput = document.getElementById('search-input');
            const filterButtons = document.getElementById('filter-buttons');
            const binList = document.getElementById('bin-list');

            function renderHubs(hubsToRender) {
                // Clear map markers
                Object.values(markers).forEach(marker => map.removeLayer(marker));
                markers = {};
                
                // Clear bin list
                if (hubsToRender.length === 0) {
                    binList.innerHTML = `<p class="text-gray-500 text-center p-4">No hubs found.</p>`;
                } else {
                    binList.innerHTML = hubsToRender.map(hub => `
    <li id="bin-item-${hub.id}" data-hub-id="${hub.id}" class="bin-item relative border bg-white border-gray-200 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 overflow-hidden">
        <div class="absolute left-0 top-0 h-full w-1.5" style="background-color: ${statusInfo[hub.status].color}"></div>
        <div class="p-4 pl-6 flex items-center">
            <span class="status-dot mr-2" style="background-color: ${statusInfo[hub.status].color}"></span>
            <p class="font-semibold text-gray-700">${hub.name}</p>
            <span class="ml-auto text-xs font-bold ${statusInfo[hub.status].badge} px-2 py-1 rounded-full">${hub.status.replace('-', ' ')}</span>
        </div>
        <div class="flex justify-between items-center px-4 pb-2">
            <p class="text-sm text-gray-500">Capacity: ${hub.capacity}%</p>
        </div>
    </li>
`).join('');
                }

                // Add markers to map
                hubsToRender.forEach(hub => {
                    const iconHtml = `<div style="background-color: ${statusInfo[hub.status].color};" class="w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>`;
                    const customIcon = L.divIcon({ html: iconHtml, className: 'custom-map-icon' });
                    
                    const marker = L.marker([hub.lat, hub.lng], { icon: customIcon }).addTo(map);
                    marker.bindPopup(`<b>${hub.name}</b>`);
                    marker.on('click', () => updateDetails(hub));
                    markers[hub.id] = marker;
                });
            }
            
            // Function to handle clicking on a bin list item
            binList.addEventListener('click', (e) => {
                const listItem = e.target.closest('.bin-item');
                if (listItem) {
                    const hubId = parseInt(listItem.dataset.hubId);
                    const hub = hubs.find(h => h.id === hubId);
                    if (hub) {
                        updateDetails(hub);
                    }
                }
            });

            function updateDetails(hub) {
                binDetailsContainer.classList.remove('hidden');
                binDetailsContainer.innerHTML = `
    <h3 class="font-bold text-xl text-gray-800 flex items-center">
        <span class="status-dot mr-2" style="background-color: ${statusInfo[hub.status].color}"></span>
        ${hub.name}
    </h3>
    <div class="grid grid-cols-2 gap-4 mt-4 text-center">
        <div>
            <p class="text-sm text-gray-500">Status</p>
            <p class="font-semibold text-lg flex items-center justify-center">
                <span class="status-dot mr-2" style="background-color: ${statusInfo[hub.status].color}"></span>
                <span class="${statusInfo[hub.status].text}">${hub.status.replace('-', ' ')}</span>
            </p>
        </div>
        <div>
            <p class="text-sm text-gray-500">Hub Capacity</p>
            <p class="font-semibold text-lg">${hub.capacity}%</p>
        </div>
        <div class="col-span-2">
            <p class="text-sm text-gray-500">Accepting</p>
            <p class="font-semibold">${hub.items}</p>
        </div>
        <div class="col-span-2 flex justify-center items-center space-x-4 mt-2">
            <button id="view-on-map-btn" class="font-semibold text-blue-600 hover:underline">View on Map</button>
            <button id="get-directions-btn" class="font-semibold text-blue-600 hover:underline">Get Directions</button>
        </div>
    </div>
`;
                document.getElementById('view-on-map-btn').addEventListener('click', () => {
                     map.setView([hub.lat, hub.lng], 16);
                     markers[hub.id].openPopup();
                });
                 document.getElementById('get-directions-btn').addEventListener('click', () => {
                    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${hub.lat},${hub.lng}`;
                    window.open(directionsUrl, '_blank');
                });
                
                // Highlight active item in the list
                 document.querySelectorAll('.bin-item').forEach(item => item.classList.remove('active'));
                 const activeListItem = document.getElementById(`bin-item-${hub.id}`);
                 if(activeListItem) activeListItem.classList.add('active');

                binDetailsContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }

            let userCoords = null; // Store user's location

function getDistance(lat1, lng1, lat2, lng2) {
    // Haversine formula
    const toRad = x => x * Math.PI / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

            function applyFiltersAndSearch() {
                const searchTerm = searchInput.value.toLowerCase();
                const activeFilter = filterButtons.querySelector('.active').dataset.filter;
                let filteredHubs = hubs;

                if (activeFilter !== 'all') {
                    filteredHubs = filteredHubs.filter(hub => hub.status === activeFilter);
                }

                if (searchTerm) {
                    filteredHubs = filteredHubs.filter(hub => 
                        hub.name.toLowerCase().includes(searchTerm) || 
                        hub.city.toLowerCase().includes(searchTerm) ||
                        hub.items.toLowerCase().includes(searchTerm)
                    );
                }

                // Sort by distance if userCoords is available
                if (userCoords) {
                    filteredHubs = filteredHubs
                        .map(hub => ({
                            ...hub,
                            distance: getDistance(userCoords.lat, userCoords.lng, hub.lat, hub.lng)
                        }))
                        .sort((a, b) => a.distance - b.distance);
                }

                renderHubs(filteredHubs);

                if (filteredHubs.length > 0) {
                    updateDetails(filteredHubs[0]);
                } else {
                    binDetailsContainer.classList.add('hidden');
                }
            }
            
            filterButtons.addEventListener('click', e => {
                if(e.target.tagName === 'BUTTON') {
                    filterButtons.querySelector('.active').classList.remove('active');
                    e.target.classList.add('active');
                    applyFiltersAndSearch();
                }
            });

            searchInput.addEventListener('input', applyFiltersAndSearch);

            document.getElementById('use-my-location-btn').addEventListener('click', () => {
                if (navigator.geolocation) {
                    showNotification('Locating...', 'Getting your current position.');
                    navigator.geolocation.getCurrentPosition(position => {
                        const { latitude, longitude } = position.coords;
                        userCoords = { lat: latitude, lng: longitude }; // Save user location
                        map.setView([latitude, longitude], 14);

                        if (userLocationMarker) {
                            userLocationMarker.setLatLng([latitude, longitude]);
                        } else {
                             const userIcon = L.divIcon({
                                html: `<div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse"></div>`,
                                className: 'custom-map-icon'
                            });
                            userLocationMarker = L.marker([latitude, longitude], {icon: userIcon}).addTo(map);
                        }
                        userLocationMarker.bindPopup("Your Location").openPopup();
                        showNotification('Success!', 'Location found.');

                        applyFiltersAndSearch(); // Re-sort hubs by distance
                    }, () => {
                        showNotification('Error', 'Could not access your location.');
                    });
                } else {
                     showNotification('Not Supported', 'Geolocation not available.');
                }
            });
            
            // Initial render
            applyFiltersAndSearch();

// --- REWARDS MODAL ---
const viewRewardsBtn = document.getElementById('view-rewards-btn');
const rewardsModal = document.getElementById('rewards-modal');
const closeRewardsModalBtn = document.getElementById('close-rewards-modal-btn');
const userPointsSpan = document.getElementById('user-points');
const modalUserPointsSpan = document.getElementById('modal-user-points');

viewRewardsBtn.onclick = () => {
    modalUserPointsSpan.textContent = userPointsSpan.textContent + " pts";
    rewardsModal.classList.remove('hidden');
    setTimeout(() => rewardsModal.classList.remove('opacity-0'), 10);
};
closeRewardsModalBtn.onclick = () => {
    rewardsModal.classList.add('opacity-0');
    setTimeout(() => rewardsModal.classList.add('hidden'), 300);
};
rewardsModal.onclick = (e) => {
    if (e.target === rewardsModal) {
        rewardsModal.classList.add('opacity-0');
        setTimeout(() => rewardsModal.classList.add('hidden'), 300);
    }
};
function setupRedeemButtons() {
    document.querySelectorAll('.redeem-btn').forEach(btn => {
        btn.onclick = function() {
            let cost = parseInt(btn.dataset.cost);
            let points = parseInt(userPointsSpan.textContent.replace(/,/g, ''));
            if (points >= cost) {
                points -= cost;
                userPointsSpan.textContent = points.toLocaleString();
                modalUserPointsSpan.textContent = points.toLocaleString() + " pts";
                showNotification("Reward redeemed!");
                btn.disabled = true;
            } else {
                showNotification("Not enough points.", 2000);
            }
        };
    });
}
setupRedeemButtons();

// --- DONATE FUNDS MODAL ---
const donateNowBtn = document.getElementById('donate-now-btn');
const donateModal = document.getElementById('donate-modal');
const closeDonateModalBtn = document.getElementById('close-donate-modal-btn');
const donationAmountInput = document.getElementById('donation-amount');
const submitDonationBtn = document.getElementById('submit-donation-btn');
const donationMethodSelect = document.getElementById('donation-method');
const bankDetails = document.getElementById('bank-details');
const gcashDetails = document.getElementById('gcash-details');

donateNowBtn.onclick = () => {
    donateModal.classList.remove('hidden');
    setTimeout(() => donateModal.classList.remove('opacity-0'), 10);
};
closeDonateModalBtn.onclick = () => {
    donateModal.classList.add('opacity-0');
    setTimeout(() => donateModal.classList.add('hidden'), 300);
};
donateModal.onclick = (e) => {
    if (e.target === donateModal) {
        donateModal.classList.add('opacity-0');
        setTimeout(() => donateModal.classList.add('hidden'), 300);
    }
};
submitDonationBtn.onclick = () => {
    const amount = donationAmountInput.value;
    if (amount && parseFloat(amount) > 0) {
        showNotification(`Thank you for your $${amount} donation!`, 3000);
        donateModal.classList.add('opacity-0');
        setTimeout(() => donateModal.classList.add('hidden'), 300);
        donationAmountInput.value = '';
    } else {
        showNotification("Please enter a valid amount.", 2000);
    }
};
document.querySelectorAll('.donation-preset-btn').forEach(btn => {
    btn.onclick = function() {
        donationAmountInput.value = btn.dataset.amount;
    };
});

donationMethodSelect.addEventListener('change', function() {
    if (this.value === 'bank') {
        bankDetails.classList.remove('hidden');
        gcashDetails.classList.add('hidden');
    } else {
        bankDetails.classList.add('hidden');
        gcashDetails.classList.remove('hidden');
    }
});

// --- POINTS INFO FOR DONATION TYPES ---
// Map category keys to points for accuracy
const donationPoints = {
    monitors: 17,
    cpu: 15,
    mouse: 8,
    mobile: 20,
    audio: 12,
    cables: 5
};

// --- COMMUNITY FEED & PHOTO UPLOAD ---
// Add more stories for demonstration
let feedItems = [
    {
        id: 1,
        user: "Jane D.",
        verified: true,
        photo: "monitor.jpg",
        gallery: [
            "monitor.jpg",
            "as.jpg",
        ],
        donationInfo: "Donated my old monitor today!",
        location: "Quezon City Central Hub", // <-- must match a hub name
        thanks: 24,
        points: 17,
        time: "2 hours ago",
        comments: [
            { user: "borloloyXD_123", text: "Great job, Jane!", time: "1 hour ago", replies: [{ user: "Jane", text: "Thank you Dol", time: "29 mins ago" }] }
        ],
        collected: false
    },
    {
        id: 2,
        user: "Mark T.",
        verified: true,
        photo: "cpu.png",
        gallery: [
            "cpu.png",
            "ram.png"
        ],
        donationInfo: "Old CPU and RAM sticks!",
        location: "Makati CBD E-Waste Drop", // <-- must match a hub name
        thanks: 15,
        points: 12,
        time: "1 hour ago",
        comments: [
            { user: "wiggy_092x", text: "Great job, Mark!", time: "45 min ago", replies: [] },
            { user: "junsoi", text: "idol mark", time: "15 min ago", replies: [] }
        ],
        collected: true
    },
    {
        id: 3,
        user: "Lisa P.",
        verified: true,
        photo: "tablet.png",
        gallery: [
            "tablet.png",
            "charger.jpg"
        ],
        donationInfo: "Tablet and charger set!",
        location: "Riverside Center",
        thanks: 32,
        points: 20,
        time: "30 minutes ago",
        comments: [
            { user: "tanski123", text: "Wow, thank you for this!", time: "20 min ago", replies: [{ user: "janjan", text: "Welcome Dol", time: "3 min ago" }] }
        ],
        collected: true
    },
    {
        id: 4,
        user: "Tommy S.",
        verified: true,
        photo: "jset.jpg",
        gallery: [
            "jset.jpg",
            "speaker.jpg"
        ],
        donationInfo: "Old headphones and speakers!",
        location: "Main Street Hub",
        thanks: 10,
        points: 8,
        time: "10 minutes ago",
        comments: [{ user: "NatureXLover_123", text: "chuyag gi donate uy datu man kaayo", time: "5 min ago", replies: [] },
        { user: "Wiggy_The_F", text: "pwede nani pangdulag dota salamat", time: "9 min ago", replies: [{user: "ame", text: "gani, pildihon na tika", time: "just now"}] }],
        collected: false
    },
    {
        id: 5,
        user: "EcoHero#1234",
        verified: true,
        photo: "cable.jpg",
        gallery: [
            "cable.jpg",
            "adapter.jpg"
        ],
        donationInfo: "Donated old cables and adapters!",
        location: "Tech Park Hub",
        thanks: 5,
        points: 5,
        time: "5 minutes ago",
        comments: [{ user: "Justin Nabunturan", text: "Thanks for donating!", time: "3 min ago", like: 5, replies: [] },
    { user: "JunXsOy#214", text: "Daghan salamat ani part", time: "7 min ago", replies: [] },
{ user: "PajunXx123", text: "idola gud uy!", time: "10 min ago", replies: [] },
{ user: "pW3Di_AkOh_n4LaNgxX", text: "wow salute sayo erp", time: "13 min ago", replies: [] }],
        collected: false
    },
    {
        id: 6,
        user: "GreenQueen",
        verified: true,
        photo: "headset.png",
        gallery: [
            "headset.png",
            "plankit.png"
        ],
        donationInfo: "Dropped off a plant kit and headphones.",
        location: "Quezon City Central ",
        thanks: 12,
        points: 15,
        time: "Just now",
        comments: [{ user: "wasalat_parasalahatXx123", text: "Salamat, makatanom2 nasad ko ani.", time: "Just now", replies: [{ user: "JustCalled_meWiggy#08", text: "Atek2 nasad kag tanom makakuha rag bae", time: "Just now" }] },
        { user: "Balanar2Xd", text: "Salamat sa headset naa nakoy gamiton pang dota", time: "5mins ago", replies: [{ user: "dRow2_RinGersXxD", text: "Tara Play na", time: "3 min ago" }] }],

        collected: false
    }
    // ...add more if needed...
];

let storiesPage = 1;
const STORIES_PER_PAGE = 4;

// --- COMMUNITY FEED SEARCH & FILTER ---
const feedSearchInput = document.getElementById('feed-search-input');
const feedFilterSelect = document.getElementById('feed-filter-select');
const feedSortSelect = document.getElementById('feed-sort-select');

let feedSearchTerm = '';
let feedFilter = 'all';
let feedSort = 'latest';

feedSearchInput.addEventListener('input', function() {
    feedSearchTerm = this.value.trim().toLowerCase();
    renderFeed();
});
feedFilterSelect.addEventListener('change', function() {
    feedFilter = this.value;
    renderFeed();
});
feedSortSelect.addEventListener('change', function() {
    feedSort = this.value;
    renderFeed();
});

function parseFeedTime(timeStr) {
    // Accepts "Just now", "5 minutes ago", "2 hours ago", "1 hour ago", "30 minutes ago", etc.
    if (!timeStr) return 0;
    if (timeStr.toLowerCase().includes('just now')) return 0;
    const minMatch = timeStr.match(/(\d+)\s*minute/);
    if (minMatch) return parseInt(minMatch[1]);
    const hourMatch = timeStr.match(/(\d+)\s*hour/);
    if (hourMatch) return parseInt(hourMatch[1]) * 60;
    return 999999; // fallback for unknown
}

function renderFeed() {
    const feedContainer = document.getElementById('feed-container');
    feedContainer.innerHTML = '';

    // Filter and sort logic
    let filtered = feedItems.slice();

    // Search
    if (feedSearchTerm) {
        filtered = filtered.filter(item =>
            (item.donationInfo && item.donationInfo.toLowerCase().includes(feedSearchTerm)) ||
            (item.user && item.user.toLowerCase().includes(feedSearchTerm)) ||
            (item.location && item.location.toLowerCase().includes(feedSearchTerm))
        );
    }
    // Filter
    if (feedFilter === 'collected') {
        filtered = filtered.filter(item => item.collected);
    } else if (feedFilter === 'not-collected') {
        filtered = filtered.filter(item => !item.collected);
    }
    // Sort by time (latest = most recent first)
    filtered.sort((a, b) => {
        const aTime = parseFeedTime(a.time);
        const bTime = parseFeedTime(b.time);
        return feedSort === 'latest' ? aTime - bTime : bTime - aTime;
    });

    // Pagination
    const itemsToShow = filtered.slice(0, storiesPage * STORIES_PER_PAGE);

    itemsToShow.forEach(item => {
        const heartColor = item.thanked ? "text-red-500" : "text-gray-400";
        const thanksHtml = `<button class="thanks-btn flex items-center"><i data-lucide="heart" class="w-5 h-5 mr-1 ${heartColor}"></i> <span class="text-gray-700">${item.thanks || 0} Thanks</span></button>`;
        const collectedText = item.collected
            ? `<span class="inline-block bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs ml-2">Collected</span>`
            : `<button class="mark-collected-btn text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full ml-2" data-id="${item.id}">Mark as Collected</button>`;
        const verifiedBadge = item.verified
            ? `<span class="ml-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">Verified</span>`
            : '';
        // Show main photo and gallery if available
        let galleryHtml = '';
        if (item.gallery && item.gallery.length > 0) {
            galleryHtml = `<div class="flex gap-2 mt-2">${item.gallery.map((src, idx) => 
                `<img src="${src}" class="w-16 h-16 object-cover rounded-lg border cursor-pointer story-gallery-img" data-story-id="${item.id}" data-img-idx="${idx}">`
            ).join('')}</div>`;
        }
        const photoHtml = item.photo
            ? `<img src="${item.photo}" alt="Donation Photo" class="w-24 h-24 object-cover rounded-lg mr-6 mb-4 md:mb-0">`
            : `<div class="w-24 h-24 flex items-center justify-center bg-gray-100 rounded-lg mr-6 mb-4 md:mb-0"><i data-lucide="camera" class="w-8 h-8 text-gray-400"></i></div>`;
        const locationHtml = item.location
            ? `<div class="flex items-center text-pink-600 text-sm mb-2">
        <i data-lucide="map-pin" class="w-4 h-4 mr-1"></i>
        <a href="#" class="feed-location-link underline" data-location="${item.location}">${item.location}</a>
      </div>`
            : '';
        const pointsHtml = `<span class="ml-2 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">+${item.points || 0} pts earned</span>`;
        const timeHtml = `<span class="absolute top-6 right-6 text-gray-400 text-sm">${item.time || ''}</span>`;
        const donationInfoHtml = item.collected
            ? `<span class="text-gray-700">Donated: <span class="font-semibold line-through text-gray-400">${item.donationInfo || item.message || ''}</span></span>`
            : `<span class="text-gray-700">Donated: <span class="font-semibold">${item.donationInfo || item.message || ''}</span></span>`;

        const div = document.createElement('div');
        div.className = "relative bg-white rounded-lg border border-gray-200 p-6 flex flex-col md:flex-row items-start md:items-center";
        if (item.collected) div.classList.add('collected');
        div.innerHTML = `
            ${photoHtml}
            <div class="flex-1">
                <div class="flex items-center mb-1">
                    <span class="font-semibold text-gray-800">${item.user}</span>
                    ${verifiedBadge}
                    ${collectedText}
                </div>
                <div class="mb-1">${donationInfoHtml}</div>
                ${locationHtml}
                <div class="flex items-center gap-4 mt-2">
                    <div class="flex items-center">${thanksHtml}</div>
                    ${pointsHtml}
                </div>
                ${galleryHtml}
                <button class="open-comment-btn text-blue-500 hover:underline text-sm mt-2" data-id="${item.id}">Comments (${item.comments.length})</button>
            </div>
            ${timeHtml}
        `;
        feedContainer.appendChild(div);

        const heartBtn = div.querySelector('.thanks-btn');
        if (heartBtn) {
            heartBtn.onclick = () => {
                if (!item.thanked) {
                    item.thanks = (item.thanks || 0) + 1;
                    item.thanked = true;
                    renderFeed();
                }
            };
        }
    });
    lucide.createIcons();

    // Add click event for gallery images
    document.querySelectorAll('.story-gallery-img').forEach(img => {
        img.onclick = function() {
            const storyId = Number(img.dataset.storyId);
            const imgIdx = Number(img.dataset.imgIdx);
            openGalleryModal(storyId, imgIdx);
        };
    });

    document.querySelectorAll('.open-comment-btn').forEach(btn => {
        btn.onclick = () => openCommentModal(btn.dataset.id);
    });
    document.querySelectorAll('.mark-collected-btn').forEach(btn => {
        btn.onclick = () => {
            const id = Number(btn.dataset.id);
            const item = feedItems.find(f => f.id === id);
            if (item) {
                item.collected = true;
                renderFeed();
                showNotification("Marked as collected!");
            }
        };
    });
    // Show/hide load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (feedItems.length > itemsToShow.length) {
        loadMoreBtn.classList.remove('hidden');
    } else {
        loadMoreBtn.classList.add('hidden');
    }
}
renderFeed();

document.getElementById('load-more-btn').onclick = function() {
    storiesPage++;
    renderFeed();
};

// --- MULTIPLE PHOTO UPLOAD FOR NEW STORY ---
let uploadedPhotoData = [];

const photoUploadInput = document.getElementById('photo-upload-input');
const codenameModal = document.getElementById('codename-modal');
const closeCodenameModalBtn = document.getElementById('close-codename-modal-btn');
const codenameInput = document.getElementById('codename-input');
const donationInfoInput = document.getElementById('donation-info-input');
const donationLocationInput = document.getElementById('donation-location-input');
const submitCodenameBtn = document.getElementById('submit-codename-btn');

document.getElementById('upload-photo-btn').onclick = function() {
    photoUploadInput.click();
};

photoUploadInput.addEventListener('change', (event) => {
    uploadedPhotoData = [];
    if (event.target.files && event.target.files.length > 0) {
        let filesLoaded = 0;
        Array.from(event.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function(evt) {
                uploadedPhotoData.push(evt.target.result);
                filesLoaded++;
                if (filesLoaded === event.target.files.length) {
                    codenameModal.classList.remove('hidden');
                    setTimeout(() => codenameModal.classList.remove('opacity-0'), 10);
                }
            };
            reader.readAsDataURL(file);
        });
    }
});

submitCodenameBtn.addEventListener('click', () => {
    const codename = codenameInput.value.trim();
    const donationInfo = donationInfoInput.value.trim();
    const donationLocation = donationLocationInput.value.trim();
    if (!codename) {
        showNotification("Please enter your codename.", 2000);
        return;
    }
    if (!donationInfo) {
        showNotification("Please enter donation info.", 2000);
        return;
    }
    if (!donationLocation) {
        showNotification("Please enter collection point.", 2000);
        return;
    }
    feedItems.unshift({
        id: Date.now(),
        user: codename,
        verified: true,
        photo: uploadedPhotoData[0],
        gallery: uploadedPhotoData,
        donationInfo,
        location: donationLocation,
        thanks: 0,
        points: 17,
        time: "Just now",
        comments: [],
        collected: false
    });
    renderFeed();
    showNotification("Photo(s) uploaded successfully!");
    codenameInput.value = '';
    donationInfoInput.value = '';
    donationLocationInput.value = '';
    uploadedPhotoData = [];
    codenameModal.classList.add('opacity-0');
    setTimeout(() => codenameModal.classList.add('hidden'), 300);
});

// Close codename modal
closeCodenameModalBtn.addEventListener('click', () => {
    codenameModal.classList.add('opacity-0');
    setTimeout(() => codenameModal.classList.add('hidden'), 300);
});

// --- COMMENT MODAL ---
let currentFeedId = null;
function openCommentModal(feedId) {
    const modal = document.getElementById('comment-modal');
    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);
    currentFeedId = feedId;
    const feedItem = feedItems.find(f => f.id === Number(feedId));
    renderComments(feedItem);
}
function closeCommentModal() {
    const modal = document.getElementById('comment-modal');
    modal.classList.add('opacity-0');
    setTimeout(() => modal.classList.add('hidden'), 300);
}
document.getElementById('close-comment-modal-btn').onclick = closeCommentModal;

function renderComments(feedItem) {
    const commentList = document.getElementById('comment-list');
    commentList.innerHTML = '';
    feedItem.comments.forEach((comment, idx) => {
        // Ensure replies and reactions exist
        if (!comment.replies) comment.replies = [];
        if (typeof comment.liked === "undefined") comment.liked = false;

        const div = document.createElement('div');
        div.className = "flex items-start gap-3 bg-gray-50 rounded-lg px-4 py-3";
        div.innerHTML = `
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                <i data-lucide="user" class="w-5 h-5"></i>
            </div>
            <div class="flex-1">
                <span class="font-semibold text-gray-800">${comment.user}</span>
                <span class="text-xs text-gray-400 ml-2">${comment.time || ''}</span>
                <div class="text-gray-700 mt-1">${comment.text}</div>
                <div class="flex gap-2 mt-2 items-center">
                    <button class="heart-btn transition-transform duration-200 hover:scale-125" data-idx="${idx}" aria-label="Like">
                        <i data-lucide="heart" class="w-5 h-5 ${comment.liked ? 'text-red-500 fill-red-100' : 'text-gray-400'}"></i>
                    </button>
                    <button class="reply-btn text-blue-500 text-xs ml-2" data-idx="${idx}">Reply</button>
                </div>
                <div class="reply-box mt2 hidden flex items-center gap-2">
                    <input type="text" class="reply-input w-2/3 p-1 border rounded text-xs" placeholder="Write a reply...">
                    <button class="send-reply-btn bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded ml-2 hover:bg-blue-200 transition">Send</button>
                </div>
                <div class="replies mt-2 text-xs text-gray-600">
                    ${comment.replies.map(r => `<div class="mt-1 flex items-center gap-1"><span class="font-semibold">${r.user}:</span> ${r.text}</div>`).join('')}
                </div>
            </div>
        `;
        commentList.appendChild(div);

        // Heart/like toggle with animation
        const heartBtn = div.querySelector('.heart-btn');
        heartBtn.onclick = () => {
            comment.liked = !comment.liked;
            renderComments(feedItem); // re-render to update UI
        };

        // Reply logic
        const replyBtn = div.querySelector('.reply-btn');
        const replyBox = div.querySelector('.reply-box');
        const repliesDiv = div.querySelector('.replies');
        replyBtn.onclick = () => {
            replyBox.classList.toggle('hidden');
            if (!replyBox.classList.contains('hidden')) {
                replyBox.querySelector('.reply-input').focus();
            }
        };
        replyBox.querySelector('.send-reply-btn').onclick = () => {
            const replyInput = replyBox.querySelector('.reply-input');
            if (replyInput.value.trim()) {
                comment.replies.push({
                    user: "You",
                    text: replyInput.value.trim()
                });
                renderComments(feedItem); // re-render to update UI
            }
        };
    });
    lucide.createIcons();
}
document.getElementById('post-comment-btn').onclick = function() {
    const input = document.getElementById('new-comment-input');
    const text = input.value.trim();
    if (!text) return;
    const feedItem = feedItems.find(f => f.id === Number(currentFeedId));
    if (feedItem) {
        feedItem.comments.push({
            user: "You",
            text,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            replies: [] // <-- always add this!
        });
        renderComments(feedItem);
        input.value = '';
    }
};

// --- TAKE PHOTO (using getUserMedia) ---
document.getElementById('take-photo-btn').onclick = function() {
    let cameraModal = document.createElement('div');
    cameraModal.className = "fixed inset-0 bg-black bg-opacity-50 z-[1002] flex items-center justify-center";
    cameraModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 flex flex-col items-center">
            <video id="camera-video" autoplay playsinline class="rounded-lg mb-4" width="320" height="240"></video>
            <button id="capture-photo-btn" class="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold mb-2">Capture Photo</button>
            <button id="close-camera-btn" class="text-gray-500 hover:text-gray-700">Close</button>
        </div>
    `;
    document.body.appendChild(cameraModal);

    const video = cameraModal.querySelector('#camera-video');
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
        });

    cameraModal.querySelector('#capture-photo-btn').onclick = function() {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 320;
        canvas.height = video.videoHeight || 240;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL('image/png');
        uploadedPhotoData = [photoData];
        codenameModal.classList.remove('hidden');
        setTimeout(() => codenameModal.classList.remove('opacity-0'), 10);
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        document.body.removeChild(cameraModal);
    };
    cameraModal.querySelector('#close-camera-btn').onclick = function() {
        if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
        }
        document.body.removeChild(cameraModal);
    };
};

const categoryDetails = {
    monitors: {
        title: "Monitors & Displays",
        status: "Available",
        items: ["Desktop monitors", "TV screens", "Laptop screens", "Tablets"],
        guidelines: "Please ensure screens are not cracked and remove any personal data from smart displays."
    },
    cpu: {
        title: "CPU & Motherboards",
        status: "Nearly Full",
        items: ["Desktop computers", "Motherboards", "RAM sticks", "Graphics cards"],
        guidelines: "Remove batteries and storage devices if possible. Wipe all data."
    },
    mouse: {
        title: "Mouse & Keyboards",
        status: "Available",
        items: ["Keyboards", "Mice", "Trackpads", "Gaming controllers"],
        guidelines: "Bundle accessories together for easier processing."
    },
    mobile: {
        title: "Mobile Devices",
        status: "Available",
        items: ["Smartphones", "Tablets", "E-readers", "Smart watches"],
        guidelines: "Perform factory reset and remove SIM cards."
    },
    audio: {
        title: "Audio Equipment",
        status: "Full",
        items: ["Headphones", "Speakers", "Microphones", "Audio interfaces"],
        guidelines: "Check if devices are working and remove batteries if possible."
    },
    cables: {
        title: "Cables & Accessories",
        status: "Available",
        items: ["USB cables", "Power cords", "Chargers", "Adapters"],
        guidelines: "Bundle cables with related devices if possible."
    }
};

document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const cat = card.dataset.category;
        const info = categoryDetails[cat];
        const details = document.getElementById('category-details');
        // Get points for this category using the correct key
        let points = donationPoints[cat] || 10;
        details.innerHTML = `
            <h3 class="text-2xl font-bold text-eco-green mb-2">${info.title}</h3>
            <span class="inline-block mb-2 px-3 py-1 rounded-full ${
                info.status === "Available" ? "bg-green-100 text-green-700" :
                info.status === "Nearly Full" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
            }">${info.status}</span>
            <div class="mb-2 text-blue-700 font-semibold">Earn <span class="bg-gray-100 px-2 py-1 rounded">${points} pts</span> for donating this category!</div>
            <ul class="list-disc ml-6 mb-2 text-gray-700">
                ${info.items.map(item => `<li>${item}</li>`).join('')}
            </ul>
            <p class="text-gray-600"><strong>Guidelines:</strong> ${info.guidelines}</p>
        `;
        details.classList.remove('hidden');
        details.scrollIntoView({ behavior: "smooth", block: "center" });
    });
});

const contactLink = document.getElementById('contact-link');
const contactLinkMobile = document.getElementById('contact-link-mobile');
const contactModal = document.getElementById('contact-modal');
const closeContactModalBtn = document.getElementById('close-contact-modal-btn');

// Open modal when clicking Contact (desktop)
contactLink.onclick = function(e) {
    e.preventDefault();
    contactModal.classList.remove('hidden');
    setTimeout(() => contactModal.classList.remove('opacity-0'), 10);
};
// Open modal when clicking Contact (mobile)
contactLinkMobile.onclick = function(e) {
    e.preventDefault();
    contactModal.classList.remove('hidden');
    setTimeout(() => contactModal.classList.remove('opacity-0'), 10);
};
// Close modal
closeContactModalBtn.onclick = function() {
    contactModal.classList.add('opacity-0');
    setTimeout(() => contactModal.classList.add('hidden'), 300);
};
// Close modal when clicking outside
contactModal.onclick = function(e) {
    if (e.target === contactModal) {
        contactModal.classList.add('opacity-0');
        setTimeout(() => contactModal.classList.add('hidden'), 300);
    }
};
const contactForm = document.getElementById('contact-form');

contactForm.onsubmit = function(e) {
    e.preventDefault();
    showNotification("Thank you for contacting us!", 3000);
    document.getElementById('notification-detail').textContent = "Thank you for your suggestion! We appreciate your feedback and will review it soon.";
    contactModal.classList.add('opacity-0');
    setTimeout(() => contactModal.classList.add('hidden'), 300);
    contactForm.reset();
};

function openGalleryModal(storyId, imgIdx) {
    const modal = document.getElementById('gallery-modal');
    const imgEl = document.getElementById('gallery-modal-img');
    const navEl = document.getElementById('gallery-modal-nav');
    const story = feedItems.find(f => f.id === storyId);
    if (!story || !story.gallery || !story.gallery.length) return;
    let currentIdx = imgIdx;

    function showImg(idx) {
        imgEl.src = story.gallery[idx];
        navEl.innerHTML = story.gallery.map((src, i) =>
            `<img src="${src}" class="w-10 h-10 object-cover rounded cursor-pointer border ${i === idx ? 'border-blue-500' : 'border-gray-200'}" data-idx="${i}">`
        ).join('');
        Array.from(navEl.children).forEach(navImg => {
            navImg.onclick = () => showImg(Number(navImg.dataset.idx));
        });
    }

    showImg(currentIdx);

    modal.classList.remove('hidden');
    setTimeout(() => modal.classList.remove('opacity-0'), 10);

    document.getElementById('close-gallery-modal-btn').onclick = function() {
        modal.classList.add('opacity-0');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };
    modal.onclick = function(e) {
        if (e.target === modal) {
            modal.classList.add('opacity-0');
            setTimeout(() => modal.classList.add('hidden'), 300);
        }
    };
}

// After hubs array is defined
// Set donation location options if the input is a SELECT element
if (donationLocationInput && donationLocationInput.tagName === "SELECT") {
    donationLocationInput.innerHTML = hubs.map(hub =>
        `<option value="${hub.name}">${hub.name}</option>`
    ).join('');
}

document.querySelectorAll('.feed-location-link').forEach(link => {
    link.onclick = function(e) {
        e.preventDefault();
        const hub = hubs.find(h => h.name === link.dataset.location);
        if (hub && markers[hub.id]) {
            map.setView([hub.lat, hub.lng], 16);
            markers[hub.id].openPopup();
            updateDetails(hub);
        }
    };
});

