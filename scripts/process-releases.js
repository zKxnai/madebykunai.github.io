const https = require('https');
const fs = require('fs');

// Your app repositories
const repos = [
    { name: 'Cashly', repo: 'zKxnai/Cashly' },
    { name: 'readme', repo: 'zKxnai/readme' },
    { name: 'Kompoze', repo: 'zKxnai/Kompoze' }
];

// Fetch ALL releases for a repo (not just latest)
function fetchAllReleases(repo) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${repo}/releases?per_page=100`, // Fetch up to 100 releases
            method: 'GET',
            headers: {
                'User-Agent': 'GitHub-Actions-Version-Updater',
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        console.log(`🔍 Fetching all releases: https://api.github.com/repos/${repo}/releases`);

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log(`📡 Response status for ${repo}: ${res.statusCode}`);
                
                if (res.statusCode === 200) {
                    try {
                        const releases = JSON.parse(data);
                        console.log(`📦 Found ${releases.length} releases for ${repo}`);
                        
                        if (releases.length === 0) {
                            resolve([]);
                            return;
                        }

                        // Map all releases to our format
                        const releasesList = releases.map((release, index) => {
                            const changelogLength = release.body ? release.body.length : 0;
                            if (index === 0) { // Only log details for latest
                                console.log(`📝 Latest release (${release.tag_name}):`);
                                console.log(`   - body length: ${changelogLength} chars`);
                            }
                            
                            return {
                                version: release.tag_name || release.name || 'Unknown',
                                changelog: release.body || 'No changelog available',
                                releaseUrl: release.html_url || '#',
                                publishedAt: release.published_at || release.created_at || new Date().toISOString(),
                                isPrerelease: release.prerelease || false
                            };
                        });

                        resolve(releasesList);
                    } catch (error) {
                        console.error(`❌ Error parsing JSON for ${repo}:`, error);
                        resolve([]);
                    }
                } else {
                    console.log(`⚠️  Failed to fetch releases for ${repo} (Status: ${res.statusCode})`);
                    resolve([]);
                }
            });
        });

        req.on('error', (error) => {
            console.error(`❌ Request error for ${repo}:`, error);
            reject(error);
        });

        req.end();
    });
}

// Main execution
async function main() {
    console.log('🚀 Starting to fetch release data...\n');
    console.log(`🔑 Token present: ${process.env.GITHUB_TOKEN ? 'YES (length: ' + process.env.GITHUB_TOKEN.length + ')' : 'NO - THIS IS A PROBLEM!'}\n`);

    const appData = [];

    for (const app of repos) {
        console.log(`\n📦 Fetching ${app.name} from ${app.repo}...`);
        try {
            const releases = await fetchAllReleases(app.repo);
            
            if (releases.length > 0) {
                // Latest version is the first one
                const latestRelease = releases[0];
                
                appData.push({
                    name: app.name,
                    version: latestRelease.version,
                    releases: releases, // Store ALL releases
                    lastUpdated: latestRelease.publishedAt
                });
                
                console.log(`✅ ${app.name}: ${latestRelease.version} (${releases.length} total releases)`);
            } else {
                appData.push({
                    name: app.name,
                    version: 'vX.X',
                    releases: [{
                        version: 'vX.X',
                        changelog: 'No releases found',
                        releaseUrl: '#',
                        publishedAt: new Date().toISOString(),
                        isPrerelease: false
                    }],
                    lastUpdated: new Date().toISOString()
                });
                console.log(`⚠️  ${app.name}: No releases found`);
            }
        } catch (error) {
            console.error(`❌ Failed to fetch ${app.name}:`, error, '\n');
            appData.push({
                name: app.name,
                version: 'vX.X',
                releases: [{
                    version: 'vX.X',
                    changelog: 'Unable to fetch release data',
                    releaseUrl: '#',
                    publishedAt: new Date().toISOString(),
                    isPrerelease: false
                }],
                lastUpdated: new Date().toISOString()
            });
        }
    }

    // Write to app-data.json
    const outputData = {
        apps: appData,
        generatedAt: new Date().toISOString()
    };

    fs.writeFileSync(
        'app-data.json',
        JSON.stringify(outputData, null, 2),
        'utf8'
    );

    console.log('\n✅ Successfully generated app-data.json');
    console.log(`📄 Total apps processed: ${appData.length}`);
}

// Run the script
main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});
