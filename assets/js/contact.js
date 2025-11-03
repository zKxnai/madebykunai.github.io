// Contact Form Handler with Web3Forms
class ContactForm {
    constructor() {
        this.modal = document.getElementById('contactModal');
        this.openButton = document.getElementById('contactButton');
        this.closeButton = document.querySelector('.contact-close');
        this.form = document.getElementById('contactForm');
        this.statusElement = document.getElementById('formStatus');
        this.submitButton = this.form.querySelector('.submit-button');
        this.background = null;
        
        this.init();
    }
    
    init() {
        this.openButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal();
        });
        
        this.closeButton.addEventListener('click', () => this.closeModal());
        
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => this.initModalBackground(), 50);
    }
    
    closeModal() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
        this.form.reset();
        this.statusElement.textContent = '';
        this.statusElement.className = 'form-status';
        this.destroyModalBackground();
    }
    
    initModalBackground() {
        if (!window.IconBackground) return;
        
        const existingCanvas = this.modal.querySelector('canvas');
        if (existingCanvas) existingCanvas.remove();
        
        const canvas = document.createElement('canvas');
        canvas.id = 'modalBackground';
        this.modal.insertBefore(canvas, this.modal.firstChild);
        
        try {
            this.background = new IconBackground('modalBackground');
        } catch (error) {
            console.error('Failed to initialize background:', error);
        }
    }
    
    destroyModalBackground() {
        if (this.background) {
            if (typeof this.background.destroy === 'function') {
                this.background.destroy();
            } else if (typeof this.background.stop === 'function') {
                this.background.stop();
            }
            this.background = null;
        }
        
        const canvas = this.modal.querySelector('canvas');
        if (canvas) canvas.remove();
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // ✅ Web3Forms script handles captcha validation automatically!
        
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
                
                setTimeout(() => {
                    this.closeModal();
                }, 2000);
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

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ContactForm());
} else {
    new ContactForm();
}
