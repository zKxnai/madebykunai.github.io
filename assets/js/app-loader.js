// App Configuration
const USE_STATIC_DATA = true;

const apps = [
    {
        name: 'Cashly',
        iconLight: 'assets/icons/cashly.png',
        iconDark: 'assets/icons/cashly-dark.png',
        repo: 'zKxnai/Cashly'
    },
    {
        name: 'readme',
        iconLight: 'assets/icons/readme.png',
        iconDark: 'assets/icons/readme-dark.png',
        repo: 'zKxnai/readme'
    },
    {
        name: 'Kompoze',
        iconLight: 'assets/icons/kompoze.png',
        iconDark: 'assets/icons/kompoze-dark.png',
        repo: 'zKxnai/Kompoze'
    }
];

// Store changelog data globally
window.changelogData = {};

// Fetch release data from GitHub API (works for public repos without auth)
async function fetchReleaseData(repo) {
    try {
        console.log(`Fetching release data for: ${repo}`);
        const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
        
        if (response.ok) {
            const data = await response.json();
            return {
                version: data.tag_name || data.name || 'vX.X',
                changelog: data.body || 'No changelog available',
                releaseUrl: data.html_url
            };
        } else {
            console.warn(`Failed to fetch ${repo}: Status ${response.status}`);
            return {
                version: 'vX.X',
                changelog: 'No changelog available',
                releaseUrl: '#'
            };
        }
    } catch (error) {
        console.error('Error fetching release ', error);
        return {
            version: 'vX.X',
            changelog: 'No changelog available',
            releaseUrl: '#'
        };
    }
}

// Load from static JSON (for private repos using GitHub Actions)
async function loadStaticData() {
    try {
        console.log('Loading static data from app-data.json');
        const response = await fetch('app-data.json');
        if (response.ok) {
            const data = await response.json();
            console.log('Static data loaded:', data);
            return data.apps;
        } else {
            console.error('Failed to load app-data.json:', response.status);
        }
    } catch (error) {
        console.error('Error loading static ', error);
    }
    return null;
}

// Initialize Apps
async function initializeApps() {
    const appsGrid = document.getElementById('appsGrid');
    let appsData;

    if (USE_STATIC_DATA) {
        console.log('Using static data mode');
        appsData = await loadStaticData();
    }

    for (const app of apps) {
        let version, releases;

        if (appsData) {
            const staticApp = appsData.find(a => a.name === app.name);
            if (staticApp) {
                version = staticApp.version;
                releases = staticApp.releases || [];
                console.log(`Loaded ${app.name}: v${version} with ${releases.length} releases`);
            } else {
                console.warn(`No data found for ${app.name} in static data`);
                version = 'vX.X';
                releases = [];
            }
        } else {
            version = 'vX.X';
            releases = [];
        }

        // Store all releases for modal
        window.changelogData[app.name] = { releases };
        
        const appCard = document.createElement('div');
        appCard.className = 'app-card parallax';
        appCard.innerHTML = `
            <div class="app-icon">
                <img src="${app.iconLight}" alt="${app.name} icon" class="icon-light" onerror="this.style.display='none'">
                <img src="${app.iconDark}" alt="${app.name} icon" class="icon-dark" onerror="this.style.display='none'">
            </div>
            <h2 class="app-name">${app.name}</h2>
            <p class="app-version">Current Version: v${version}</p>
            <a class="changelog-link" onclick="openChangelog('${app.name}')">Changelog</a>
        `;
        
        appsGrid.appendChild(appCard);
    }
    
    console.log('Changelog ', window.changelogData);
    observeElements();
}

// Intersection Observer for fade-in animations
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.app-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize on load
window.addEventListener('DOMContentLoaded', initializeApps);
