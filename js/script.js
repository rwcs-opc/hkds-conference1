document.addEventListener('DOMContentLoaded', () => {
  // --- SELECTORS ---
  const header = document.querySelector('.header-nav');
  const scrollProgressBar = document.querySelector('.scroll-progress-bar');
  const hamburgerBtn = document.querySelector('.hamburger-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const scrollTopBtn = document.querySelector('.scroll-top-btn');
  const statNumbers = document.querySelectorAll('.stat-number-val');
  const faqItems = document.querySelectorAll('.faq-item');
  const contactForm = document.getElementById('istsdContactForm');
  const formFeedback = document.querySelector('.form-feedback');
  
  // --- SCROLL ACTION SYSTEM ---
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // 1. Sticky navbar toggle
    if (scrollPos > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // 2. Scroll progress indicator fill
    if (docHeight > 0) {
      const scrollPercent = (scrollPos / docHeight) * 100;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }
    
    // 3. Scroll-to-top button visibility
    if (scrollPos > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  });
  
  // --- ACTIVE PAGE MENU ITEM INDICATOR ---
  const currentPath = window.location.pathname;
  const currentPage = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    
    // Exact file matching
    if (currentPage === '' || currentPage === 'index.html') {
      if (href === 'index.html' || href === './' || href === '/') {
        link.classList.add('active');
      }
    } else {
      if (href && href === currentPage) {
        link.classList.add('active');
      }
    }
  });
  
  // --- MOBILE SIDEBAR NAVIGATION ---
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', () => {
      hamburgerBtn.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }
  
  // --- SCROLL-TO-TOP CLICK ACTION ---
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // --- STATISTIC COUNTER ANIMATION (index.html) ---
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetVal = parseInt(target.getAttribute('data-target'), 10);
          let startVal = 0;
          const duration = 1200; // 1.2s duration
          const increment = targetVal / (duration / 16);
          
          const updateCounter = () => {
            startVal += increment;
            if (startVal >= targetVal) {
              target.textContent = targetVal;
            } else {
              target.textContent = Math.floor(startVal);
              requestAnimationFrame(updateCounter);
            }
          };
          
          updateCounter();
          observer.unobserve(target);
        }
      });
    }, { threshold: 0.3 });
    
    statNumbers.forEach(num => counterObserver.observe(num));
  }
  
  // --- FAQ ACCORDION (faq.html) ---
  faqItems.forEach(item => {
    const headerBtn = item.querySelector('.faq-header');
    const bodyContainer = item.querySelector('.faq-body');
    
    if (headerBtn && bodyContainer) {
      headerBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        
        // Collapse all FAQ items first
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBody = otherItem.querySelector('.faq-body');
          if (otherBody) otherBody.style.maxHeight = null;
        });
        
        // Toggle current item
        if (!isActive) {
          item.classList.add('active');
          bodyContainer.style.maxHeight = `${bodyContainer.scrollHeight}px`;
        }
      });
    }
  });
  
  // --- CONTACT FORM HANDLER (contact.html) ---
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.form-submit-btn');
      const originalBtnText = submitBtn.textContent;
      
      // Basic input verification
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const subject = document.getElementById('subject').value.trim();
      const message = document.getElementById('message').value.trim();
      
      if (!name || !email || !subject || !message) {
        alert('Please fill out all required fields.');
        return;
      }
      
      // Simulate submission animation
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending message...';
      
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        
        // Show success notice
        if (formFeedback) {
          formFeedback.classList.add('success');
          formFeedback.innerHTML = `
            <i class="fas fa-check-circle"></i> Thank you, ${name}! Your message has been sent successfully. We will get back to you soon.
          `;
          
          contactForm.reset();
          
          // Focus state labels reset
          const inputs = contactForm.querySelectorAll('.form-input');
          inputs.forEach(input => {
            const label = input.nextElementSibling;
            if (label && label.classList.contains('form-label')) {
              input.removeAttribute('placeholder-shown');
            }
          });
          
          setTimeout(() => {
            formFeedback.classList.remove('success');
            formFeedback.innerHTML = '';
          }, 8000);
        }
      }, 1500);
    });
    
    // Auto float-labels checker for preset values
    const formInputs = contactForm.querySelectorAll('.form-input');
    formInputs.forEach(input => {
      const checkValue = () => {
        if (input.value.trim() !== "") {
          input.setAttribute('placeholder-shown', 'false');
        } else {
          input.removeAttribute('placeholder-shown');
        }
      };
      
      input.addEventListener('input', checkValue);
      input.addEventListener('blur', checkValue);
      checkValue();
    });
  }
  
  // --- REVEAL-ON-SCROLL SYSTEM ---
  const revealElements = document.querySelectorAll('.reveal-element');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }
});
