// Open Changelog Modal
function openChangelog(appName) {
    const modal = document.getElementById('changelogModal');
    const modalTitle = document.getElementById('modalTitle');
    const changelogContent = document.getElementById('changelogContent');
    
    modalTitle.textContent = `${appName} Changelog`;
    
    const data = window.changelogData[appName];
    if (data) {
        changelogContent.textContent = data.changelog;
    } else {
        changelogContent.textContent = 'No changelog available.';
    }
    
    modal.classList.add('active');
}

// Close Modal
function closeModal() {
    const modal = document.getElementById('changelogModal');
    modal.classList.remove('active');
}

// Close modal on outside click
window.onclick = function(event) {
    const modal = document.getElementById('changelogModal');
    if (event.target === modal) {
        closeModal();
    }
};

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});
