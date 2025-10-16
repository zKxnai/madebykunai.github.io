const https = require('https');
const fs = require('fs');

// Your app repositories
const repos = [
    { name: 'Cashly', repo: 'zKxnai/Cashly' },
    { name: 'readme', repo: 'zKxnai/readme' },
    { name: 'Kompoze', repo: 'zKxnai/Kompoze' }
];

// GitHub API request function
function fetchReleaseData(repo) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            path: `/repos/${repo}/releases/latest`,
            method: 'GET',
            headers: {
                'User-Agent': 'GitHub-Actions-Version-Updater',
                'Authorization': `token ${process.env.GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        console.log(`🔍 Fetching: https://api.github.com/repos/${repo}/releases/latest`);

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log(`📡 Response status for ${repo}: ${res.statusCode}`);
                
                if (res.statusCode === 200) {
                    try {
                        const releaseData = JSON.parse(data);
                        
                        // DEBUG: Log what we got from API
                        console.log(`📝 API Response for ${repo}:`);
                        console.log(`   - tag_name: ${releaseData.tag_name}`);
                        console.log(`   - name: ${releaseData.name}`);
                        console.log(`   - body length: ${releaseData.body ? releaseData.body.length : 0} chars`);
                        console.log(`   - body content: ${releaseData.body ? releaseData.body.substring(0, 100) : 'NULL/EMPTY'}...`);
                        console.log(`   - html_url: ${releaseData.html_url}`);
                        
                        resolve({
                            version: releaseData.tag_name || releaseData.name || 'vX.X',
                            changelog: releaseData.body || 'No changelog available',
                            releaseUrl: releaseData.html_url || '#',
                            publishedAt: releaseData.published_at || new Date().toISOString()
                        });
                    } catch (error) {
                        console.error(`❌ Error parsing JSON for ${repo}:`, error);
                        console.error(`Raw response: ${data.substring(0, 200)}...`);
                        resolve({
                            version: 'vX.X',
                            changelog: 'No changelog available',
                            releaseUrl: '#',
                            publishedAt: new Date().toISOString()
                        });
                    }
                } else {
                    console.log(`⚠️  No release found for ${repo} (Status: ${res.statusCode})`);
                    if (res.statusCode === 404) {
                        console.log(`   Possible reasons:`);
                        console.log(`   - Repository not found or private without proper token`);
                        console.log(`   - No releases exist yet`);
                    } else if (res.statusCode === 401 || res.statusCode === 403) {
                        console.log(`   Authentication issue! Check your GH_PAT token`);
                    }
                    console.log(`   Response: ${data.substring(0, 200)}`);
                    
                    resolve({
                        version: 'vX.X',
                        changelog: 'No changelog available',
                        releaseUrl: '#',
                        publishedAt: new Date().toISOString()
                    });
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
            const releaseData = await fetchReleaseData(app.repo);
            appData.push({
                name: app.name,
                version: releaseData.version,
                changelog: releaseData.changelog,
                releaseUrl: releaseData.releaseUrl,
                lastUpdated: releaseData.publishedAt
            });
            console.log(`✅ ${app.name}: ${releaseData.version}`);
            console.log(`   Changelog: ${releaseData.changelog.substring(0, 50)}...`);
        } catch (error) {
            console.error(`❌ Failed to fetch ${app.name}:`, error, '\n');
            appData.push({
                name: app.name,
                version: 'vX.X',
                changelog: 'Unable to fetch release data',
                releaseUrl: '#',
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
    console.log('\n📋 Final ');
    console.log(JSON.stringify(outputData, null, 2));
}

// Run the script
main().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
});
