// Contact Form Handler
class ContactForm {
    constructor() {
        this.modal = document.getElementById('contactModal');
        this.openButton = document.getElementById('contactButton');
        this.closeButton = document.querySelector('.contact-close');
        this.form = document.getElementById('contactForm');
        this.statusElement = document.getElementById('formStatus');
        this.background = null;
        
        this.init();
    }
    
    init() {
        // Open modal
        this.openButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.openModal();
        });
        
        // Close modal
        this.closeButton.addEventListener('click', () => this.closeModal());
        
        // Close on outside click
        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // Handle form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Close on ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.closeModal();
            }
        });
    }
    
    openModal() {
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        this.initModalBackground();
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
        // Create canvas for modal background
        let canvas = document.getElementById('modalBackground');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'modalBackground';
            canvas.className = 'iconBackground';
            this.modal.insertBefore(canvas, this.modal.firstChild);
        }
        
        if (window.IconBackground) {
            this.background = new IconBackground('modalBackground');
        }
    }
    
    destroyModalBackground() {
        // Stop animation and clean up
        if (this.background) {
            if (this.background.destroy) {
                this.background.destroy();
            }
            this.background = null;
        }
        
        const canvas = document.getElementById('modalBackground');
        if (canvas) {
            canvas.remove();
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            topic: document.getElementById('contactTopic').value,
            message: document.getElementById('contactMessage').value
        };
        
        // Show loading state
        this.statusElement.textContent = 'Wird gesendet...';
        this.statusElement.className = 'form-status loading';
        
        try {
            // Format email body
            const emailBody = `Name: ${formData.name}%0D%0AE-Mail: ${formData.email}%0D%0ABetreff: ${formData.topic}%0D%0A%0D%0ANachricht:%0D%0A${encodeURIComponent(formData.message)}`;
            
            // Open mailto link
            window.location.href = `mailto:feedback@madebykunai.dev?subject=Kontaktformular: ${formData.topic}&body=${emailBody}`;
            
            // Show success message
            this.statusElement.textContent = 'E-Mail-Client wird geöffnet...';
            this.statusElement.className = 'form-status success';
            
            // Close modal after delay
            setTimeout(() => this.closeModal(), 2000);
            
        } catch (error) {
            console.error('Error:', error);
            this.statusElement.textContent = 'Fehler beim Senden. Bitte versuche es erneut.';
            this.statusElement.className = 'form-status error';
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ContactForm());
} else {
    new ContactForm();
}
