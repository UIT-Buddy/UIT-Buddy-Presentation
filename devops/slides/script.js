document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.slide');
  const slideContainer = document.querySelector('.slide-container');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const menuToggles = document.querySelectorAll('.menu-toggle');
  const slideMenu = document.getElementById('slide-menu');
  const progressBars = document.querySelectorAll('.progress-bar');
  const currentNumDisplays = document.querySelectorAll('.current-slide-num');
  const totalNumDisplays = document.querySelectorAll('.total-slides-num');
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  
  // Set total slide number in displays
  totalNumDisplays.forEach(display => {
    display.textContent = totalSlides;
  });
  
  // Initialize scale and resize listener
  function resizeSlides() {
    if (!slideContainer) return;
    const baseWidth = 1920;
    const baseHeight = 1080;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Calculate scale factor
    const scale = Math.min(windowWidth / baseWidth, windowHeight / baseHeight);
    
    // Apply transform scale and centering
    slideContainer.style.transform = `translate(-50%, -50%) scale(${scale})`;
  }
  
  window.addEventListener('resize', resizeSlides);
  resizeSlides(); // Run immediately
  
  // Dynamic Side Drawer Menu construction
  if (slideMenu) {
    slides.forEach((slide, index) => {
      // Find title text
      let titleText = `Slide ${index + 1}`;
      const titleElem = slide.querySelector('.slide-title');
      const titlePageElem = slide.querySelector('.title-page-main, .title-page-main-creative');
      const qaElem = slide.querySelector('.slide-qa-page h1');
      if (titleElem) {
        titleText = titleElem.textContent.trim();
      } else if (titlePageElem) {
        titleText = titlePageElem.textContent.trim();
      } else if (qaElem) {
        titleText = qaElem.textContent.trim();
      }
      
      const menuItem = document.createElement('div');
      menuItem.classList.add('menu-item');
      menuItem.textContent = `${index + 1}. ${titleText}`;
      menuItem.addEventListener('click', () => {
        goToSlide(index);
        toggleMenu(false);
      });
      slideMenu.appendChild(menuItem);
    });
  }
  
  function updateMenuState() {
    if (!slideMenu) return;
    const items = slideMenu.querySelectorAll('.menu-item');
    items.forEach((item, index) => {
      if (index === currentSlide) {
        item.classList.add('active');
        // Scroll into view if needed
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('active');
      }
    });
  }

  function toggleMenu(forceState) {
    if (!slideMenu) return;
    if (forceState !== undefined) {
      if (forceState) {
        slideMenu.classList.add('open');
      } else {
        slideMenu.classList.remove('open');
      }
    } else {
      slideMenu.classList.toggle('open');
    }
  }

  menuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (slideMenu && slideMenu.classList.contains('open')) {
      if (!slideMenu.contains(e.target) && e.target !== menuToggle) {
        toggleMenu(false);
      }
    }
  });

  // Slide state transition
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    // Deactivate current slide
    slides[currentSlide].classList.remove('active');
    
    // Set new slide index
    currentSlide = index;
    
    // Activate new slide
    slides[currentSlide].classList.add('active');
    
    // Update footer info
    currentNumDisplays.forEach(display => {
      display.textContent = currentSlide + 1;
    });
    
    // Update progress bar
    progressBars.forEach(bar => {
      const percentage = ((currentSlide + 1) / totalSlides) * 100;
      bar.style.width = `${percentage}%`;
    });
    
    // Update drawer item highlighting
    updateMenuState();
  }
  
  function nextSlide() {
    if (currentSlide < totalSlides - 1) {
      goToSlide(currentSlide + 1);
    }
  }
  
  function prevSlide() {
    if (currentSlide > 0) {
      goToSlide(currentSlide - 1);
    }
  }
  
  // Attach buttons
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  
  // Keyboard Events
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight':
      case 'Space':
      case 'PageDown':
        nextSlide();
        e.preventDefault();
        break;
      case 'ArrowLeft':
      case 'PageUp':
        prevSlide();
        e.preventDefault();
        break;
      case 'Home':
        goToSlide(0);
        e.preventDefault();
        break;
      case 'End':
        goToSlide(totalSlides - 1);
        e.preventDefault();
        break;
      case 'm':
      case 'M':
        toggleMenu();
        e.preventDefault();
        break;
      case 'f':
      case 'F':
        toggleFullscreen();
        e.preventDefault();
        break;
    }
  });
  
  // Fullscreen support
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
  
  // Initialize first slide view
  goToSlide(0);
});
