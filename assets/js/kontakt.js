class KontaktPage {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.statusElement = document.getElementById('formStatus');
        this.submitButton = this.form.querySelector('.submit-button');
        this.background = null;
        this.init();
    }

    init() {
        // Initialize animated background
        this.initBackground();
        
        // Handle form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Smooth scroll to top on load
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    initBackground() {
        if (!window.IconBackground) {
            console.warn('IconBackground not found');
            return;
        }

        try {
            this.background = new IconBackground('contactBackground');
        } catch (error) {
            console.error('Failed to initialize background:', error);
        }
    }

    async handleSubmit(e) {
        e.preventDefault();

        // Show loading state
        this.statusElement.style.display = 'block';
        this.statusElement.textContent = 'Wird gesendet...';
        this.statusElement.className = 'form-status loading';
        this.submitButton.disabled = true;

        try {
            const formData = new FormData(this.form);
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                this.statusElement.textContent = 'Nachricht erfolgreich gesendet! ✓';
                this.statusElement.className = 'form-status success';
                this.form.reset();
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    this.statusElement.style.display = 'none';
                }, 5000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            this.statusElement.textContent = 'Fehler beim Senden. Bitte versuche es erneut.';
            this.statusElement.className = 'form-status error';
            console.error('Form submission error:', error);
        } finally {
            this.submitButton.disabled = false;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new KontaktPage();
});
