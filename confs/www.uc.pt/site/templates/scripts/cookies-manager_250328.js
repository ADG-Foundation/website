/**
 * Cookies Manager
 * Handles cookie consent management and preferences
 * Controls the cookie consent modal and user interactions
 * Manages blocking/unblocking of tracking scripts using yett
 */

"use strict";

class CookiesManager {
    /**
     * Set debug mode on/off
     * @param {boolean} enabled - Whether debug mode should be enabled
     */

    //window.cookiesManager.setDebugMode(true);
    //Or add ?cookieDebug=1 to the URL
    setDebugMode(enabled) {
        this.debug = enabled;
        localStorage.setItem('cookieDebug', enabled ? '1' : '0');
        console.log(`[CookiesManager] Debug mode ${enabled ? 'enabled' : 'disabled'}`);
        return this;
    }

    /**
     * Log a message to console if debug mode is enabled
     * @param {...any} args - Arguments to log
     */
    log(...args) {
        if (this.debug) {
            console.log('[CookiesManager]', ...args);
        }
    }

    /**
     * Log a warning to console if debug mode is enabled
     * @param {...any} args - Arguments to log
     */
    warn(...args) {
        if (this.debug) {
            console.warn('[CookiesManager]', ...args);
        }
    }

    /**
     * Log an error to console if debug mode is enabled
     * @param {...any} args - Arguments to log
     */
    error(...args) {
        if (this.debug) {
            console.error('[CookiesManager]', ...args);
        }
    }

    constructor(debug = false) {
        this.debug = debug;
        this.log('Initializing...');
        if (!navigator.cookieEnabled) {
            this.log('Cookies not enabled in browser, exiting');
            return;
        }

        // DOM elements used by the cookies manager
        this.elements = {
            html: document.querySelector('html'),
            modal: document.querySelector('.js-cookies-modal'),
            acceptBtn: document.querySelector('.js-cookies-accept'),
            denyBtn: document.querySelector('.js-cookies-deny'),
            manageButtons: document.querySelectorAll('.js-cookies-manage')
        };

        // Predefined consent state configurations for Google Analytics/Tag Manager
        // Used to update consent settings when user accepts or denies cookies
        this.consentStates = {
            granted: {
                ad_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted',
                analytics_storage: 'granted'
            },
            denied: {
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                analytics_storage: 'denied'
            }
        };

        // Storage keys for localStorage to save user preferences
        // These keys track whether the user has accepted or denied cookies
        this.storageKeys = {
            allowed: 'userAllowedCookies',
            denied: 'userDeniedCookies'
        };

        this.log('Setup complete');
        this.init();
    }

    /**
     * Initialize the cookies manager
     * Binds event listeners and checks for existing cookie preferences
     */
    init() {
        this.log('Initializing...');
        this.bindEvents();
        this.checkCookiePreference();
        this.log('Initialization complete');
    }

    /**
     * Bind click event listeners to cookie consent buttons
     * Uses .bind(this) to maintain correct context in event handlers
     */
    bindEvents() {
        this.log('Binding events...');
        if (this.elements.acceptBtn) {
            this.log('Found accept button, binding click event');
            this.elements.acceptBtn.addEventListener('click', this.handleAccept.bind(this));
        } else {
            this.warn('Accept button not found in DOM');
        }

        if (this.elements.denyBtn) {
            this.log('Found deny button, binding click event');
            this.elements.denyBtn.addEventListener('click', this.handleDeny.bind(this));
        } else {
            this.warn('Deny button not found in DOM');
        }

        if (this.elements.manageButtons?.length) {
            this.log(`Found ${this.elements.manageButtons.length} manage buttons, binding click events`);
            this.elements.manageButtons.forEach(btn => {
                btn.classList.remove('hidden');
                btn.addEventListener('click', this.showModal.bind(this));
            });
        } else {
            this.warn('No manage buttons found in DOM');
        }
        this.log('Event binding complete');
    }

    /**
     * Toggle the visibility of the cookie consent modal
     * @param {boolean} show - Whether to show or hide the modal
     */
    toggleModal(show) {
        this.log(`${show ? 'Showing' : 'Hiding'} modal`);
        const { modal, html } = this.elements;

        if (modal) {
            modal.classList.toggle('hidden', !show);
            modal.classList.toggle('grid', show);
        }

        if (html) {
            html.classList.toggle('overflow-hidden', show);
            html.classList.toggle('overflow-y-scroll', !show);
        }
    }

    /**
     * Update Google consent settings based on user choice
     * @param {string} state - Either 'granted' or 'denied'
     */
    updateConsent(state) {
        this.log(`Updating consent state to: ${state}`);
        try {
            if (typeof window.gtag === 'function') {
                this.log('Calling gtag consent update with:', this.consentStates[state]);
                window.gtag('consent', 'update', this.consentStates[state]);
            } else {
                this.warn('gtag function not found, consent not updated');
            }
        } catch (error) {
            this.error('Error updating consent:', error);
        }
    }

    /**
     * Update localStorage with user's cookie preference
     * @param {boolean} allowed - Whether cookies are allowed
     */
    updateLocalStorage(allowed) {
        this.log(`Updating localStorage: cookies ${allowed ? 'allowed' : 'denied'}`);
        localStorage.setItem(this.storageKeys.allowed, allowed ? '1' : '0');
        localStorage.setItem(this.storageKeys.denied, allowed ? '0' : '1');
    }

    /**
     * Check existing cookie preferences in localStorage
     * Shows or hides modal based on previous user choices
     */
    checkCookiePreference() {
        this.log('Checking cookie preferences...');
        const userAllowed = localStorage.getItem(this.storageKeys.allowed) === '1';
        const userDenied = localStorage.getItem(this.storageKeys.denied) === '1';
        this.log(`Cookie preferences - allowed: ${userAllowed}, denied: ${userDenied}`);

        if (userAllowed) {
            this.toggleModal(false);
            // Safely unblock scripts that were blocked by yett
            // Check if yett exists and has the unblock method before calling
            try {
                this.log('Attempting to unblock scripts with yett');
                if (window.yett && typeof window.yett.unblock === 'function') {
                    window.yett.unblock();
                    this.log('Scripts successfully unblocked');
                } else {
                    this.warn('Yett not found or unblock method not available');
                }
            } catch (error) {
                this.error('Error unblocking scripts:', error);
            }
            this.updateConsent('granted');
        } else if (userDenied) {
            this.toggleModal(false);
            this.deleteCookies();
            this.updateConsent('denied');
        } else {
            this.showModal();
        }
    }

    /**
     * Delete all cookies by setting their expiry to the past
     * Attempts multiple deletion strategies with different domains/paths
     */
    deleteCookies() {
        this.log('Deleting all cookies...');
        const cookies = document.cookie.split(';');
        this.log(`Found ${cookies.length} cookies to delete`);
        const expiry = 'expires=Thu, 01 Jan 1970 00:00:00 GMT';

        for (let cookie of cookies) {
            if (!cookie.trim()) continue;

            const name = cookie.split('=')[0].trim();
            document.cookie = `${name}=; ${expiry}; path=/`;

            // Attempt to delete cookies that might be scoped to specific domains/paths
            // Some cookies might be set with different domain configurations
            document.cookie = `${name}=; ${expiry}; path=/; domain=${window.location.hostname}`;
            document.cookie = `${name}=; ${expiry}; path=/; domain=.${window.location.hostname}`;
        }
    }

    /**
     * Handle user accepting cookies
     * Updates storage, unblocks scripts, and updates consent
     */
    handleAccept() {
        this.log('Handle accept cookies');
        const userAllowed = localStorage.getItem(this.storageKeys.allowed) === '1';

        if (!userAllowed) {
            this.updateLocalStorage(true);

            // Safely unblock scripts that were blocked by yett
            // Check if yett exists and has the unblock method before calling
            try {
                this.log('Attempting to unblock scripts with yett');
                if (window.yett && typeof window.yett.unblock === 'function') {
                    window.yett.unblock();
                    this.log('Scripts successfully unblocked');
                } else {
                    this.warn('Yett not found or unblock method not available');
                }
            } catch (error) {
                this.error('Error unblocking scripts:', error);
            }

            this.updateConsent('granted');

            // Load any blocked scripts without a full page reload
            this.loadBlockedScripts();
        }

        this.toggleModal(false);
    }

    /**
     * Handle user denying cookies
     * Updates storage, deletes existing cookies, and updates consent
     */
    handleDeny() {
        this.log('Handle deny cookies');
        this.updateLocalStorage(false);
        this.deleteCookies();
        this.updateConsent('denied');
        this.toggleModal(false);
    }

    /**
     * Load scripts that were blocked by yett
     * Avoids full page reload by dynamically creating and injecting script elements
     */
    loadBlockedScripts() {
        this.log('Loading blocked scripts...');
        // Find all scripts that were blocked by yett (identified by their special type attribute)
        const blockedScripts = document.querySelectorAll('script[type="text/x-yett-blocked-script"]');
        this.log(`Found ${blockedScripts.length} blocked scripts to load`);

        if (blockedScripts.length > 0) {
            blockedScripts.forEach(script => {
                // Create a new script element with the same attributes
                const newScript = document.createElement('script');

                // Copy all attributes except 'type' which would keep it blocked
                Array.from(script.attributes).forEach(attr => {
                    if (attr.name !== 'type') {
                        newScript.setAttribute(attr.name, attr.value);
                    }
                });

                // Copy inline script content if any (for inline scripts)
                if (script.textContent) {
                    newScript.textContent = script.textContent;
                }

                // Replace the blocked script with the new executable script
                // This avoids a full page reload while enabling blocked functionality
                script.parentNode.replaceChild(newScript, script);
                this.log('Replaced blocked script:', newScript.src || 'inline script');
            });
        }
    }

    /**
     * Show the cookie consent modal
     */
    showModal() {
        this.log('Show modal requested');
        this.toggleModal(true);
    }
}

// Initialize cookies management when DOM is fully loaded
// Makes the instance globally available via window.cookiesManager
window.addEventListener('DOMContentLoaded', () => {
        console.log('[CookiesManager] DOM fully loaded, initializing CookiesManager');

    // Check if debug mode is enabled via URL parameter or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const debugParam = urlParams.get('cookieDebug');
    const debugStorage = localStorage.getItem('cookieDebug');
    const debugMode = debugParam === '1' || debugStorage === '1';

    window.cookiesManager = new CookiesManager(debugMode);

    if (debugMode) {
        console.log('[CookiesManager] Debug mode enabled');
        console.log('[CookiesManager] Global instance created at window.cookiesManager');
    }
});