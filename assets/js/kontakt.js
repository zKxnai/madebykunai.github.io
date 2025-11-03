// Kontakt Page Handler
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
        this.statusElement.textContent = 'Wird gesendet...';
        this.statusElement.className = 'form-status loading';
        this.submitButton.disabled = true;
        
        try {
            const formData = new FormData(this.form);
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.statusElement.textContent = '✓ Nachricht erfolgreich gesendet!';
                this.statusElement.className = 'form-status success';
                
                // Reset form after delay
                setTimeout(() => {
                    this.form.reset();
                    this.statusElement.textContent = '';
                    this.statusElement.className = 'form-status';
                }, 3000);
            } else {
                throw new Error(data.message || 'Fehler beim Senden');
            }
            
        } catch (error) {
            console.error('Error:', error);
            this.statusElement.textContent = 'Fehler beim Senden. Bitte versuche es erneut.';
            this.statusElement.className = 'form-status error';
        } finally {
            this.submitButton.disabled = false;
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new KontaktPage());
} else {
    new KontaktPage();
}
