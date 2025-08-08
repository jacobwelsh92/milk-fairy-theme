/**
 * The Milk Fairy - Conversion Optimization Suite
 * Implements exit intent, urgency timers, and mobile optimizations
 */

(function() {
  'use strict';

  // A/B Test Configuration
  function getABTestVariant() {
    // Check if user already has a variant
    let variant = localStorage.getItem('milk_fairy_discount_variant');
    
    if (!variant) {
      // Randomly assign variant (50/50 split)
      variant = Math.random() < 0.5 ? 'A' : 'B';
      localStorage.setItem('milk_fairy_discount_variant', variant);
    }
    
    return variant;
  }
  
  const discountVariant = getABTestVariant();
  
  // Configuration with A/B test
  const CONFIG = {
    exitIntent: {
      enabled: true,
      delay: 0,
      cookieDays: 7,
      discountCode: discountVariant === 'A' ? 'SAVE20' : 'SAVE15',
      discountAmount: discountVariant === 'A' ? '$20 OFF' : '$15 OFF',
      variant: discountVariant
    },
    urgencyTimer: {
      enabled: true,
      minutes: 60,
      resetHourly: true
    },
    mobileStickyCTA: {
      enabled: true,
      scrollThreshold: 10,
      product: 'magic-warmmy'
    },
    tracking: {
      gtag: true,
      fbPixel: true
    }
  };

  /**
   * Exit Intent Popup Handler
   */
  class ExitIntentPopup {
    constructor() {
      this.shown = false;
      this.cookieName = 'milk_fairy_exit_shown';
      this.init();
    }

    init() {
      // TEST MODE: Add ?test=popup to URL to force show popup
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('test') === 'popup') {
        setTimeout(() => this.show(), 1000);
        return;
      }
      
      // Check if already shown
      if (this.getCookie(this.cookieName)) {
        return;
      }

      // Desktop: Mouse leave viewport
      document.addEventListener('mouseout', (e) => {
        if (e.clientY <= 0 && !this.shown) {
          this.show();
        }
      });

      // Mobile: Rapid scroll up (back button intent)
      let lastScroll = 0;
      let scrollVelocity = 0;
      
      window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        scrollVelocity = lastScroll - currentScroll;
        
        // Detect rapid upward scroll near top (back button behavior)
        if (scrollVelocity > 50 && currentScroll < 200 && !this.shown) {
          this.show();
        }
        
        lastScroll = currentScroll;
      });

      // Also trigger on tab visibility change (switching tabs)
      document.addEventListener('visibilitychange', () => {
        if (document.hidden && !this.shown && window.pageYOffset < 500) {
          this.show();
        }
      });
    }

    show() {
      const popup = document.getElementById('exit-intent-popup');
      if (!popup) {
        console.error('Exit popup element not found!');
        return;
      }
      
      // Update discount amount based on A/B test
      const discountBadge = popup.querySelector('.popup-discount');
      const subtitle = popup.querySelector('.popup-subtitle');
      const submitBtn = popup.querySelector('.popup-submit');
      
      if (discountBadge) {
        discountBadge.textContent = CONFIG.exitIntent.discountAmount;
      }
      
      if (subtitle) {
        const discountNum = CONFIG.exitIntent.variant === 'A' ? '20' : '15';
        subtitle.innerHTML = subtitle.innerHTML.replace(/\$\d+/, '$' + discountNum);
      }
      
      if (submitBtn) {
        submitBtn.textContent = 'GET MY ' + CONFIG.exitIntent.discountAmount;
      }

      popup.style.display = 'flex';
      popup.classList.add('active');
      document.body.classList.add('popup-active');
      this.shown = true;
      console.log('Exit popup shown! Variant: ' + CONFIG.exitIntent.variant + ' (' + CONFIG.exitIntent.discountAmount + ')');
      
      // Set cookie
      this.setCookie(this.cookieName, 'true', CONFIG.exitIntent.cookieDays);
      
      // Track event
      this.trackEvent('exit_intent_shown');
      
      // Handle close
      this.setupCloseHandlers(popup);
      
      // Handle form submission
      this.setupFormHandler();
    }
    
    setupFormHandler() {
      const form = document.getElementById('exit-popup-form');
      if (!form) return;
      
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.popup-submit');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;
        
        try {
          const response = await fetch('/contact', {
            method: 'POST',
            body: formData
          });
          
          if (response.ok) {
            // Success! Show success message
            submitBtn.textContent = '✓ Success! Check your email';
            submitBtn.style.background = '#4CAF50';
            
            // Track conversion with A/B test variant
            const discountValue = CONFIG.exitIntent.variant === 'A' ? 20 : 15;
            this.trackEvent('exit_popup_email_captured', {
              value: discountValue,
              currency: 'AUD',
              variant: CONFIG.exitIntent.variant,
              discount_amount: CONFIG.exitIntent.discountAmount
            });
            
            // Close popup after 2 seconds
            setTimeout(() => {
              this.close(document.getElementById('exit-intent-popup'));
            }, 2000);
            
            // Store that user signed up
            localStorage.setItem('milk_fairy_discount_claimed', 'true');
          } else {
            throw new Error('Submission failed');
          }
        } catch (error) {
          // Error handling
          submitBtn.textContent = 'Error - Please try again';
          submitBtn.style.background = '#f44336';
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
          }, 3000);
        }
      });
    }

    setupCloseHandlers(popup) {
      // Close button
      const closeBtn = popup.querySelector('.popup-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close(popup));
      }

      // Click outside
      popup.addEventListener('click', (e) => {
        if (e.target === popup) {
          this.close(popup);
        }
      });

      // ESC key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.close(popup);
        }
      });
    }

    close(popup) {
      popup.classList.remove('active');
      document.body.classList.remove('popup-active');
      this.trackEvent('exit_intent_closed');
    }

    setCookie(name, value, days) {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    getCookie(name) {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    }

    trackEvent(eventName, eventData = {}) {
      // Google Analytics 4
      if (typeof gtag !== 'undefined' && CONFIG.tracking.gtag) {
        gtag('event', eventName, {
          event_category: 'Conversion Optimization',
          ...eventData
        });
      }

      // Facebook Pixel
      if (typeof fbq !== 'undefined' && CONFIG.tracking.fbPixel) {
        fbq('trackCustom', eventName, eventData);
      }
    }
  }

  /**
   * Urgency Timer
   */
  class UrgencyTimer {
    constructor() {
      this.timers = document.querySelectorAll('.urgency-timer');
      if (this.timers.length === 0) return;
      
      this.endTime = this.getEndTime();
      this.init();
    }

    getEndTime() {
      const savedEnd = localStorage.getItem('milk_fairy_timer_end');
      const now = new Date().getTime();
      
      // Reset every hour if configured
      if (CONFIG.urgencyTimer.resetHourly) {
        const hourFromNow = now + (60 * 60 * 1000);
        const nextHour = new Date(Math.ceil(now / (60 * 60 * 1000)) * (60 * 60 * 1000));
        return nextHour.getTime();
      }
      
      // Or use saved time or create new
      if (savedEnd && parseInt(savedEnd) > now) {
        return parseInt(savedEnd);
      }
      
      const endTime = now + (CONFIG.urgencyTimer.minutes * 60 * 1000);
      localStorage.setItem('milk_fairy_timer_end', endTime);
      return endTime;
    }

    init() {
      this.updateTimer();
      setInterval(() => this.updateTimer(), 1000);
    }

    updateTimer() {
      const now = new Date().getTime();
      const distance = this.endTime - now;

      if (distance < 0) {
        // Timer expired, reset
        this.endTime = this.getEndTime();
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      const display = hours > 0 
        ? `${hours}:${this.pad(minutes)}:${this.pad(seconds)}`
        : `${minutes}:${this.pad(seconds)}`;

      this.timers.forEach(timer => {
        const countdown = timer.querySelector('.timer-countdown');
        if (countdown) {
          countdown.textContent = display;
        }
      });
    }

    pad(num) {
      return num < 10 ? '0' + num : num;
    }
  }

  /**
   * Mobile Sticky CTA
   */
  class MobileStickyCTA {
    constructor() {
      this.cta = document.querySelector('.mobile-sticky-cta');
      if (!this.cta || window.innerWidth > 768) return;
      
      this.threshold = CONFIG.mobileStickyCTA.scrollThreshold;
      this.init();
    }

    init() {
      let shown = false;
      
      window.addEventListener('scroll', () => {
        const scrollPercent = (window.pageYOffset / document.body.scrollHeight) * 100;
        
        if (scrollPercent > this.threshold && !shown) {
          this.show();
          shown = true;
        } else if (scrollPercent <= this.threshold && shown) {
          this.hide();
          shown = false;
        }
      });

      // Handle add to cart
      const addBtn = this.cta.querySelector('.sticky-add-cart');
      if (addBtn) {
        addBtn.addEventListener('click', (e) => {
          e.preventDefault();
          this.addToCart();
        });
      }
    }

    show() {
      this.cta.classList.add('active');
      this.trackEvent('mobile_sticky_cta_shown');
    }

    hide() {
      this.cta.classList.remove('active');
    }

    async addToCart() {
      const productId = this.cta.dataset.product;
      if (!productId) return;

      try {
        const response = await fetch('/cart/add.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: productId,
            quantity: 1
          })
        });

        if (response.ok) {
          // Update cart bubble
          const cartBubble = document.querySelector('.cart-count-bubble');
          if (cartBubble) {
            const count = parseInt(cartBubble.textContent) || 0;
            cartBubble.textContent = count + 1;
          }

          // Show success message
          this.showSuccessMessage();
          this.trackEvent('mobile_sticky_cta_add_to_cart');
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
      }
    }

    showSuccessMessage() {
      const message = document.createElement('div');
      message.className = 'cart-success-message';
      message.textContent = '✓ Added to cart!';
      document.body.appendChild(message);

      setTimeout(() => {
        message.remove();
      }, 3000);
    }

    trackEvent(eventName, eventData = {}) {
      if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
      }
      if (typeof fbq !== 'undefined') {
        fbq('trackCustom', eventName, eventData);
      }
    }
  }

  /**
   * Social Proof Notifications
   */
  class SocialProof {
    constructor() {
      this.names = ['Sarah M.', 'Jessica T.', 'Emma W.', 'Lisa K.', 'Amanda R.'];
      this.locations = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'];
      this.times = ['2 minutes', '5 minutes', '12 minutes', '28 minutes', '1 hour'];
      
      this.init();
    }

    init() {
      // Show first notification after 5 seconds
      setTimeout(() => this.show(), 5000);
    }

    show() {
      const notification = this.createNotification();
      document.body.appendChild(notification);

      // Animate in
      setTimeout(() => notification.classList.add('active'), 100);

      // Hide after 5 seconds
      setTimeout(() => {
        notification.classList.remove('active');
        setTimeout(() => notification.remove(), 500);
        
        // Show next after random interval (20-40 seconds)
        const nextDelay = 20000 + Math.random() * 20000;
        setTimeout(() => this.show(), nextDelay);
      }, 5000);
    }

    createNotification() {
      const randomIndex = Math.floor(Math.random() * this.names.length);
      
      const div = document.createElement('div');
      div.className = 'social-proof-notification';
      div.innerHTML = `
        <div class="social-proof-content">
          <div class="social-proof-icon">🍼</div>
          <div class="social-proof-text">
            <strong>${this.names[randomIndex]} from ${this.locations[randomIndex]}</strong>
            <span>purchased Magic Warmmy ${this.times[randomIndex]} ago</span>
          </div>
        </div>
      `;
      
      return div;
    }
  }

  /**
   * Initialize on DOM ready
   */
  function init() {
    // Initialize features
    if (CONFIG.exitIntent.enabled) {
      new ExitIntentPopup();
    }
    
    if (CONFIG.urgencyTimer.enabled) {
      new UrgencyTimer();
    }
    
    if (CONFIG.mobileStickyCTA.enabled) {
      new MobileStickyCTA();
    }
    
    // Social proof (always enabled for now)
    new SocialProof();

    // Track page view
    trackPageView();
  }

  /**
   * Analytics Tracking
   */
  function trackPageView() {
    // Track enhanced ecommerce view
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
        conversion_optimized: true
      });
    }

    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
      fbq('track', 'PageView');
    }
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();