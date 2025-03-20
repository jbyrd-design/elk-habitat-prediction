// Main JavaScript for Elk Habitat Prediction System Website

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add animation classes to elements when they come into view
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if (animatedElements.length > 0) {
        // Create an Intersection Observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    // Unobserve after animation is triggered
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observe all elements with the animate-on-scroll class
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Initialize tooltips if Bootstrap is available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }
});
// Add this code to the bottom of your main.js file or in a script tag at the end of index.html
document.addEventListener('DOMContentLoaded', function() {
    // Generate GMU maps if available
    const gmuMapIds = ['gmu12Map', 'gmu23Map', 'gmu24Map'];
    
    if (typeof createHabitatMap === 'function') {
      gmuMapIds.forEach((mapId, index) => {
        const gmuNumber = [12, 23, 24][index];
        const canvas = document.getElementById(mapId);
        
        if (canvas) {
          console.log(`Generating map for GMU ${gmuNumber} on canvas ${mapId}`);
          const mapImg = createHabitatMap(gmuNumber);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const img = new Image();
            img.onload = function() {
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            };
            img.src = mapImg;
          } else {
            console.error(`Could not get context for canvas ${mapId}`);
          }
        } else {
          console.error(`Canvas element ${mapId} not found`);
        }
      });
    } else {
      console.error('createHabitatMap function not available. Check if image-generator.js is loaded.');
    }
  });