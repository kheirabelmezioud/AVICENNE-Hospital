// ============================================
// HOSPITAL NAVIGATION SYSTEM - DYNAMIC NAVIGATION
// ============================================

(function() {
    'use strict';

    // Configuration - Edit these if your IDs are different
    const NAV_CONFIG = {
        // Button IDs (add these to your HTML buttons)
        buttonIds: {
            makeAppointment: 'makeAppointmentBtn',
            doctorArea: 'doctorAreaBtn',
            professionalArea: 'professionalAreaBtn',
            patientArea: 'patientAreaBtn',
            discoverServices: 'discoverServicesBtn',
            news: 'newsBtn',
            myAccount: 'myAccountBtn',
            comeToHospital: 'comeToHospitalBtn'
        },
        
        // Section IDs (add these to your HTML sections)
        sectionIds: {
            services: 'services',
            news: 'news',
            findus: 'findus',
            map: 'hospitalMap' // ID for your map element
        },
        
        // URLs for page navigation
        pageUrls: {
            patientPage: 'patientpage.html',
            doctorPage: 'doctorpage.html',
            adminPage: 'adminpage.html'
        },
        
        // Animation settings
        animation: {
            scrollDuration: 800,
            scrollOffset: 80, // Adjust based on your header height
            mapHighlightClass: 'map-highlight' // CSS class for map highlight
        }
    };

    // ========== CORE NAVIGATION FUNCTIONS ==========

    /**
     * Initialize the navigation system
     */
    function initNavigation() {
        console.log('🚀 Initializing Hospital Navigation System...');
        
        // Setup all button listeners
        setupNavigationButtons();
        
        // Initialize smooth scrolling
        initSmoothScrolling();
        
        console.log('✅ Navigation System Ready!');
    }

    /**
     * Set up event listeners for all navigation buttons
     */
    function setupNavigationButtons() {
        // Make an appointment → patientpage.html
        setupButton(NAV_CONFIG.buttonIds.makeAppointment, () => {
            navigateToPage(NAV_CONFIG.pageUrls.patientPage);
        });

        // Doctor Area → doctorpage.html
        setupButton(NAV_CONFIG.buttonIds.doctorArea, () => {
            navigateToPage(NAV_CONFIG.pageUrls.doctorPage);
        });

        // Professional Area → adminpage.html
        setupButton(NAV_CONFIG.buttonIds.professionalArea, () => {
            navigateToPage(NAV_CONFIG.pageUrls.adminPage);
        });

        // Patient Area → patientpage.html
        setupButton(NAV_CONFIG.buttonIds.patientArea, () => {
            navigateToPage(NAV_CONFIG.pageUrls.patientPage);
        });

        // Discover our services → scroll to "services" section
        setupButton(NAV_CONFIG.buttonIds.discoverServices, () => {
            scrollToSection(NAV_CONFIG.sectionIds.services);
        });

        // News → scroll to "news" section
        setupButton(NAV_CONFIG.buttonIds.news, () => {
            scrollToSection(NAV_CONFIG.sectionIds.news);
        });

        // My Account → go to my account in patientpage.html
        setupButton(NAV_CONFIG.buttonIds.myAccount, () => {
            navigateToPage(NAV_CONFIG.pageUrls.patientPage + '#account');
        });

        // Come to hospital → open the map inside "Find Us" section
        setupButton(NAV_CONFIG.buttonIds.comeToHospital, () => {
            scrollToSection(NAV_CONFIG.sectionIds.findus);
            // Highlight map after scrolling
            setTimeout(() => {
                highlightMap();
            }, NAV_CONFIG.animation.scrollDuration);
        });
    }

    /**
     * Helper function to set up button with click handler
     */
    function setupButton(buttonId, clickHandler) {
        const button = document.getElementById(buttonId);
        
        if (button) {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                clickHandler();
                addButtonFeedback(this);
            });
            
            // Ensure it's clickable
            button.style.cursor = 'pointer';
            console.log(`✅ Connected: ${buttonId}`);
        } else {
            console.warn(`⚠️ Button not found: ${buttonId} - Add id="${buttonId}" to your HTML`);
        }
    }

    /**
     * Navigate to another page
     */
    function navigateToPage(pageUrl) {
        console.log(`📄 Navigating to: ${pageUrl}`);
        window.location.href = pageUrl;
    }

    /**
     * Smooth scroll to a section
     */
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        
        if (!section) {
            console.error(`❌ Section not found: #${sectionId}`);
            return;
        }
        
        console.log(`📜 Smooth scrolling to: #${sectionId}`);
        
        const offset = NAV_CONFIG.animation.scrollOffset;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
        
        // Highlight the section briefly
        highlightSection(section);
    }

    /**
     * Initialize smooth scrolling for all anchor links
     */
    function initSmoothScrolling() {
        // Handle internal anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(event) {
                const href = this.getAttribute('href');
                
                // Skip empty hashes
                if (href === '#') return;
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    event.preventDefault();
                    scrollToSection(targetId);
                }
            });
        });
        
        // Handle hash on page load
        if (window.location.hash) {
            const hash = window.location.hash.substring(1);
            setTimeout(() => {
                scrollToSection(hash);
            }, 100);
        }
    }

    /**
     * Highlight the map in Find Us section
     */
    function highlightMap() {
        const mapElement = document.getElementById(NAV_CONFIG.sectionIds.map) || 
                          document.querySelector('#findus iframe') ||
                          document.querySelector('#findus .map');
        
        if (!mapElement) {
            console.warn('⚠️ Map element not found in Find Us section');
            return;
        }
        
        console.log('🗺️ Highlighting map...');
        
        // Add highlight class
        mapElement.classList.add(NAV_CONFIG.animation.mapHighlightClass);
        
        // Focus for accessibility
        mapElement.setAttribute('tabindex', '-1');
        mapElement.focus();
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
            mapElement.classList.remove(NAV_CONFIG.animation.mapHighlightClass);
        }, 3000);
    }

    /**
     * Briefly highlight a section (visual feedback)
     */
    function highlightSection(element) {
        const originalBg = element.style.backgroundColor;
        
        element.style.transition = 'background-color 0.5s ease';
        element.style.backgroundColor = 'rgba(255, 215, 0, 0.1)';
        
        setTimeout(() => {
            element.style.backgroundColor = originalBg;
        }, 1500);
    }

    /**
     * Add visual feedback to clicked button
     */
    function addButtonFeedback(button) {
        button.style.transition = 'transform 0.2s ease';
        button.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    }

    // ========== PUBLIC API ==========
    // You can call these functions from other scripts if needed
    window.HospitalNavigation = {
        init: initNavigation,
        scrollTo: scrollToSection,
        goToPage: navigateToPage,
        highlightMap: highlightMap,
        refresh: function() {
            setupNavigationButtons();
            console.log('🔄 Navigation system refreshed');
        }
    };

    // ========== INITIALIZATION ==========
    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initNavigation);
    } else {
        // DOM already loaded
        initNavigation();
    }

})();

// Optional: Add this CSS for map highlighting
(function() {
    const style = document.createElement('style');
    style.textContent = `
        .map-highlight {
            box-shadow: 0 0 0 4px rgba(0, 86, 179, 0.5), 0 0 30px rgba(0, 86, 179, 0.3) !important;
            transform: scale(1.02);
            transition: all 0.5s ease !important;
        }
    `;
    document.head.appendChild(style);
})();