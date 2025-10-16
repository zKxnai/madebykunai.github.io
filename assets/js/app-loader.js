// App Configuration
const USE_STATIC_DATA = true; // Set to true to use app-data.json from GitHub Actions

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
        const response = await fetch(`https://api.github.com/repos/${repo}/releases/latest`);
        
        if (response.ok) {
            const data = await response.json();
            return {
                version: data.tag_name || data.name || 'vX.X',
                changelog: data.body || 'No changelog available',
                releaseUrl: data.html_url
            };
        } else {
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
        const response = await fetch('app-data.json');
        if (response.ok) {
            const data = await response.json();
            return data.apps;
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
        appsData = await loadStaticData();
    }

    for (const app of apps) {
        let version, changelog, releaseUrl;

        if (appsData) {
            const staticApp = appsData.find(a => a.name === app.name);
            if (staticApp) {
                version = staticApp.version;
                changelog = staticApp.changelog;
                releaseUrl = staticApp.releaseUrl;
            }
        } else {
            const releaseData = await fetchReleaseData(app.repo);
            version = releaseData.version;
            changelog = releaseData.changelog;
            releaseUrl = releaseData.releaseUrl;
        }

        // Store changelog for modal
        window.changelogData[app.name] = { changelog, releaseUrl };
        
        const appCard = document.createElement('div');
        appCard.className = 'app-card parallax';
        appCard.innerHTML = `
            <div class="app-icon">
                <img src="${app.iconLight}" alt="${app.name} icon" class="icon-light" onerror="this.style.display='none'">
                <img src="${app.iconDark}" alt="${app.name} icon" class="icon-dark" onerror="this.style.display='none'">
            </div>
            <h2 class="app-name">${app.name}</h2>
            <p class="app-version">Current Version: ${version}</p>
            <a class="changelog-link" onclick="openChangelog('${app.name}')">Changelog</a>
        `;
        
        appsGrid.appendChild(appCard);
    }
    
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
