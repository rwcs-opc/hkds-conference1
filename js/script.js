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
    if (scrollPos > 50) {
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
    if (scrollPos > 500) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
    
    // 4. Scrollspy Active Navigation Indicator
    let currentSection = 'home';
    const sections = document.querySelectorAll('section, header');
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id') || 'home';
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${currentSection}` || (href === '#' && currentSection === 'home')) {
        link.classList.add('active');
      }
    });
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
  
  // --- STATISTIC COUNTER ANIMATION ---
  if (statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const targetVal = parseInt(target.getAttribute('data-target'), 10);
          let startVal = 0;
          const duration = 1500; // 1.5s duration
          const increment = targetVal / (duration / 16); // ~60fps
          
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
          observer.unobserve(target); // Only animate once
        }
      });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(num => counterObserver.observe(num));
  }
  
  // --- FAQ ACCORDION ---
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
  
  // --- CONTACT FORM HANDLER ---
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
        
        // Show success alert modal
        if (formFeedback) {
          formFeedback.classList.add('success');
          formFeedback.innerHTML = `
            <i class="fas fa-check-circle"></i> Thank you, ${name}! Your message has been sent successfully. We will get back to you soon.
          `;
          
          // Clear inputs
          contactForm.reset();
          
          // Focus state labels reset
          const inputs = contactForm.querySelectorAll('.form-input');
          inputs.forEach(input => {
            const label = input.nextElementSibling;
            if (label && label.classList.contains('form-label')) {
              // Trigger input state clean-up
              input.dispatchEvent(new Event('input'));
            }
          });
          
          // Hide alert after 8 seconds
          setTimeout(() => {
            formFeedback.classList.remove('success');
            formFeedback.innerHTML = '';
          }, 8000);
        }
      }, 1500);
    });
    
    // Auto float-labels checker for preset values or autocomplete
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
      // Run once on load
      checkValue();
    });
  }
  
  // --- REVEAL-ON-SCROLL SYSTEM USING INTERSECTION OBSERVER ---
  const revealElements = document.querySelectorAll('.reveal-element');
  if (revealElements.length > 0) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    
    revealElements.forEach(el => revealObserver.observe(el));
  }
});
