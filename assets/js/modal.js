// Format date to readable string
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Open Changelog Modal with all releases
window.openChangelog = function(appName) {
    const modal = document.getElementById('changelogModal');
    const modalTitle = document.getElementById('modalTitle');
    const changelogContent = document.getElementById('changelogContent');
    
    modalTitle.textContent = `${appName} Release History`;
    
    const data = window.changelogData[appName];
    
    if (data && data.releases && data.releases.length > 0) {
        // Build HTML for all releases
        let html = '';
        
        data.releases.forEach((release, index) => {
            const versionClass = index === 0 ? 'release-item latest' : 'release-item';
            const latestBadge = index === 0 ? '<span class="latest-badge">Latest</span>' : '';
            const prereleaseBadge = release.isPrerelease ? '<span class="prerelease-badge">Pre-release</span>' : '';
            
            html += `
                <div class="${versionClass}">
                    <div class="release-header">
                        <h3 class="release-version">
                            ${release.version}
                            ${latestBadge}
                            ${prereleaseBadge}
                        </h3>
                        <span class="release-date">${formatDate(release.publishedAt)}</span>
                    </div>
                    <div class="release-body">
                        ${release.changelog.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `;
        });
        
        changelogContent.innerHTML = html;
    } else {
        changelogContent.innerHTML = '<p class="no-releases">No releases available.</p>';
    }
    
    modal.classList.add('active');
}

// Close Modal
window.closeModal = function() {
    const modal = document.getElementById('changelogModal');
    modal.classList.remove('active');
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('changelogModal');
    if (event.target === modal) {
        window.closeModal();
    }
};

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        window.closeModal();
    }
});
