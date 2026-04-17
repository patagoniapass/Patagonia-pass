// PATAGONIA PASS - MAIN JAVASCRIPT

// Header scroll effect
const header = document.querySelector('header');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScrollY = currentScroll;
});

// Smooth scroll navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        
        const target = document.querySelector(targetId);
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Compose itinerary button
const composeButton = document.querySelector('.btn-compose');
const composeInput = document.querySelector('.input-group input');

composeButton?.addEventListener('click', handleComposeClick);
composeInput?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleComposeClick();
    }
});

function handleComposeClick() {
    const userInput = composeInput.value.trim();
    
    if (!userInput) {
        showNotification('Por favor, describe tu plan ideal', 'error');
        composeInput.focus();
        return;
    }
    
    composeButton.disabled = true;
    const originalText = composeButton.innerHTML;
    composeButton.innerHTML = '<span>⏳</span><span>Procesando...</span>';
    
    setTimeout(() => {
        showNotification('¡Tu itinerario está siendo procesado!', 'success');
        composeButton.disabled = false;
        composeButton.innerHTML = originalText;
        composeInput.value = '';
        
        setTimeout(() => {
            const talentsSection = document.querySelector('#prestadores');
            talentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 500);
    }, 2000);
}

// Confirm booking button
const confirmButton = document.querySelector('.btn-confirm');

confirmButton?.addEventListener('click', function() {
    this.disabled = true;
    const originalText = this.innerHTML;
    this.innerHTML = '✓ Procesando...';
    
    setTimeout(() => {
        showNotification('¡Reserva confirmada! Recibirás un email con los detalles en breve.', 'success');
        this.disabled = false;
        this.innerHTML = originalText;
    }, 1500);
});

// Notification system
function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icons[type]}</span>
            <span class="notification-text">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        bottom: -100px;
        right: 2rem;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 2000;
        transition: bottom 0.3s ease;
        max-width: 300px;
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    
    .notification.show {
        bottom: 2rem;
    }
    
    .notification-icon {
        font-weight: 700;
        font-size: 1.2rem;
    }
    
    .notification-success {
        border-left: 4px solid #1cbd71;
    }
    
    .notification-success .notification-icon {
        color: #1cbd71;
    }
    
    .notification-error {
        border-left: 4px solid #e74c3c;
    }
    
    .notification-error .notification-icon {
        color: #e74c3c;
    }
    
    .notification-info {
        border-left: 4px solid #17b8cc;
    }
    
    .notification-info .notification-icon {
        color: #17b8cc;
    }
    
    .notification-text {
        font-size: 0.95rem;
        color: #333;
    }
    
    @media (max-width: 768px) {
        .notification {
            bottom: -100px;
            right: 1rem;
            left: 1rem;
            max-width: none;
        }
    }
`;

const style = document.createElement('style');
style.textContent = notificationStyles;
document.head.appendChild(style);

// Intersection observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.value-card, .talent-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transition = 'opacity 0.6s ease';
    observer.observe(card);
});

// Document ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Patagonia Pass website loaded successfully');
});
