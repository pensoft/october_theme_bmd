'use strict';

/**
 * Hero Text Animation Module
 * Handles typewriter effect for hero section text elements
 */
class HeroTextAnimator {
    constructor() {
        this.typingSpeedMs = 50;
        this.animationDelay = 20;
        this.paragraphDelay = 800;
        this.buttonDelay = 900;
        this.fallbackDelay = 50;
    }

    /**
     * Type text character by character with specified speed
     * @param {HTMLElement|jQuery} element - Target element
     * @param {string} text - Text to type
     * @param {number} speedMs - Speed in milliseconds
     * @param {Function} onComplete - Callback when complete
     */
    typeText(element, text, speedMs, onComplete) {
        const $el = (element && element.jquery) ? element : window.jQuery(element);
        const fullText = String(text ?? '');
        
        if (!$el.length) {
            console.warn('HeroTextAnimator: Invalid element provided for text animation');
            if (typeof onComplete === 'function') onComplete();
            return;
        }

        $el.empty();
        let currentIndex = 0;

        const tick = () => {
            if (currentIndex < fullText.length) {
                $el.text($el.text() + fullText.charAt(currentIndex));
                currentIndex += 1;
                setTimeout(tick, speedMs);
            } else if (typeof onComplete === 'function') {
                onComplete();
            }
        };

        tick();
    }

    /**
     * Initialize hero text animation sequence
     * @returns {Promise|null} Promise that resolves when animation completes
     */
    async init() {
        const $ = window.jQuery;
        if (!$) {
            console.error('HeroTextAnimator: jQuery not available');
            return null;
        }

        const $hero = $('.hero-text');
        if (!$hero.length) {
            console.warn('HeroTextAnimator: Hero text element not found');
            return null;
        }

        // Prevent multiple initializations
        if ($hero.data('heroAnimated')) {
            return null;
        }
        $hero.data('heroAnimated', true);

        const $heading = $hero.find('h1').first();
        const $paragraph = $hero.find('p').first();
        const $button = $hero.find('.btn, .btn-intro').first();

        if (!$heading.length) {
            console.warn('HeroTextAnimator: Hero heading not found');
            return null;
        }

        try {
            // Store original text and set up accessibility
            const fullText = $heading.text();
            $heading.attr('aria-label', fullText);
            $heading.empty();

            // Initialize hidden state for paragraph and button
            this.initializeHiddenElements($paragraph, $button);

            // Start animation sequence
            return await this.runAnimationSequence($hero, $heading, $paragraph, $button, fullText);
        } catch (error) {
            console.error('HeroTextAnimator: Animation failed:', error);
            return null;
        }
    }

    /**
     * Initialize hidden state for paragraph and button elements
     * @param {jQuery} $paragraph - Paragraph element
     * @param {jQuery} $button - Button element
     */
    initializeHiddenElements($paragraph, $button) {
        if ($paragraph.length) {
            $paragraph.css({ 
                opacity: 0, 
                transform: 'translateY(10px)' 
            });
        }

        if ($button.length) {
            $button.css({ 
                opacity: 0, 
                transform: 'translateY(16px) scale(0.98)' 
            });
        }
    }

    /**
     * Run the complete animation sequence
     * @param {jQuery} $hero - Hero container
     * @param {jQuery} $heading - Heading element
     * @param {jQuery} $paragraph - Paragraph element
     * @param {jQuery} $button - Button element
     * @param {string} fullText - Text to animate
     * @returns {Promise} Promise that resolves when complete
     */
    runAnimationSequence($hero, $heading, $paragraph, $button, fullText) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.typeText($heading, fullText, this.typingSpeedMs, () => {
                    this.animateParagraph($hero, $paragraph, () => {
                        this.animateButton($hero, $button, resolve);
                    });
                });
            }, this.animationDelay);
        });
    }

    /**
     * Animate paragraph appearance
     * @param {jQuery} $hero - Hero container
     * @param {jQuery} $paragraph - Paragraph element
     * @param {Function} onComplete - Callback when complete
     */
    animateParagraph($hero, $paragraph, onComplete) {
        if ($paragraph.length) {
            $hero.addClass('is-paragraph-visible');
        }
        setTimeout(onComplete, this.paragraphDelay);
    }

    /**
     * Animate button appearance with bounce effect
     * @param {jQuery} $hero - Hero container
     * @param {jQuery} $button - Button element
     * @param {Function} onComplete - Callback when complete
     */
    animateButton($hero, $button, onComplete) {
        if ($button.length) {
            let settled = false;
            
            const done = () => {
                if (settled) return;
                settled = true;
                onComplete();
            };

            const events = 'animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd';
            $button.one(events, done);
            $hero.addClass('is-button-bounce');
            
            // Fallback timeout
            setTimeout(done, this.buttonDelay);
        } else {
            setTimeout(onComplete, this.fallbackDelay);
        }
    }
}

/**
 * Hero Carousel Module
 * Handles infinite scrolling carousel for hero section images
 */
class HeroCarousel {
    constructor() {
        this.state = {
            offset: 0,
            pxPerMs: 0.06,
            rafId: null,
            lastTs: 0,
            slidesToShow: 3,
            centerPaddingPct: 0.15,
            currentPad: 0
        };
        
        this.responsiveBreakpoints = {
            mobile: { width: 480, slides: 1, padding: 0.20 },
            tablet: { width: 768, slides: 1, padding: 0.25 },
            small: { width: 1200, slides: 3, padding: 0.10 },
            medium: { width: 1400, slides: 3, padding: 0.12 },
            large: { width: 1920, slides: 3, padding: 0.15 },
            xlarge: { width: Infinity, slides: 3, padding: 0.18 }
        };
    }

    /**
     * Initialize the hero carousel
     */
    init() {
        const $ = window.jQuery;
        if (!$) {
            console.error('HeroCarousel: jQuery not available');
            return;
        }

        this.$carousel = $('#hero-carousel');
        if (!this.$carousel.length) {
            console.warn('HeroCarousel: Carousel element not found');
            return;
        }

        this.$track = this.$carousel.find('.carousel-track');
        if (!this.$track.length) {
            console.warn('HeroCarousel: Carousel track not found');
            return;
        }

        this.initializeCarousel();
        this.bindEvents();
    }

    /**
     * Initialize carousel state and layout
     */
    initializeCarousel() {
        if (!this.$track.data('originalCount')) {
            this.$track.data('originalCount', this.$track.children('.slide').length);
        }

        this.applyLayout();
        this.start();
    }

    /**
     * Bind event handlers
     */
    bindEvents() {
        $(window).off('resize.hero').on('resize.hero', () => {
            this.reflow();
        });
    }

    /**
     * Compute responsive settings based on viewport width
     */
    computeResponsiveSettings() {
        const viewportWidth = window.innerWidth;
        
        for (const [breakpoint, config] of Object.entries(this.responsiveBreakpoints)) {
            if (viewportWidth < config.width) {
                this.state.slidesToShow = config.slides;
                this.state.centerPaddingPct = config.padding;
                break;
            }
        }
    }

    /**
     * Reset carousel to original slides
     */
    resetToOriginalSlides() {
        const originalCount = this.$track.data('originalCount') || 0;
        const $allSlides = this.$track.children('.slide');
        
        if ($allSlides.length > originalCount) {
            $allSlides.slice(originalCount).remove();
        }
        
        this.state.offset = 0;
        this.state.lastTs = 0;
        this.$track.css('transform', 'translate3d(0,0,0)');
    }

    /**
     * Ensure sufficient buffer width for smooth scrolling
     * @param {number} slideWidth - Width of each slide
     */
    ensureBufferWidth(slideWidth) {
        const visibleWidth = this.$carousel.outerWidth();
        let totalSlides = this.$track.children('.slide').length;
        let totalWidth = totalSlides * slideWidth;
        const $originalSet = this.$track.children('.slide').slice(0, this.$track.data('originalCount'));

        while (totalWidth < visibleWidth * 3 && $originalSet.length) {
            $originalSet.clone(true, true).appendTo(this.$track);
            totalSlides = this.$track.children('.slide').length;
            totalWidth = totalSlides * slideWidth;
        }
    }

    /**
     * Apply layout calculations and positioning
     */
    applyLayout() {
        this.computeResponsiveSettings();
        this.resetToOriginalSlides();

        const containerWidth = this.$carousel.outerWidth();
        const pad = Math.round(this.state.centerPaddingPct * containerWidth);
        const slideWidth = Math.max(1, (containerWidth - (2 * pad)) / this.state.slidesToShow);

        this.$track.css({ 
            paddingLeft: `${pad}px`, 
            paddingRight: `${pad}px` 
        });
        
        this.$track.children('.slide').css({ 
            flex: `0 0 ${slideWidth}px` 
        });

        this.ensureBufferWidth(slideWidth);

        this.state.currentPad = pad;
        this.state.offset = -pad;
        this.$track.css('transform', `translate3d(${this.state.offset}px,0,0)`);
    }

    /**
     * Animation step function for smooth scrolling
     * @param {number} timestamp - Current animation timestamp
     */
    step(timestamp) {
        if (!this.state.lastTs) this.state.lastTs = timestamp;
        
        const deltaTime = Math.min(32, timestamp - this.state.lastTs);
        this.state.lastTs = timestamp;
        this.state.offset -= this.state.pxPerMs * deltaTime;

        // Handle slide recycling for infinite scroll
        let $firstSlide = this.$track.children('.slide').first();
        let firstWidth = $firstSlide.outerWidth(true);
        
        while ((-this.state.offset - this.state.currentPad) >= firstWidth && firstWidth > 0) {
            this.state.offset += firstWidth;
            $firstSlide.appendTo(this.$track);
            $firstSlide = this.$track.children('.slide').first();
            firstWidth = $firstSlide.outerWidth(true);
        }

        this.$track.css('transform', `translate3d(${this.state.offset}px,0,0)`);
        this.state.rafId = requestAnimationFrame((ts) => this.step(ts));
    }

    /**
     * Start the carousel animation
     */
    start() {
        if (this.state.rafId) {
            cancelAnimationFrame(this.state.rafId);
        }
        this.state.lastTs = 0;
        this.state.rafId = requestAnimationFrame((ts) => this.step(ts));
    }

    /**
     * Reflow and restart carousel (called on resize)
     */
    reflow() {
        this.applyLayout();
        this.start();
    }
}

/**
 * Hero Video Popup Module
 * Self-contained lightweight popup (no Bootstrap dependency).
 * Intercepts clicks on hero links carrying a data-video attribute,
 * mounts the popup at <body> end, and embeds the YouTube video.
 */
class HeroVideoPopup {
    constructor() {
        this.popupSelector = '#hero-video-popup';
        this.iframeSelector = '.hero-video-popup__iframe';
        this.sectionSelector = '.hero-section[data-hero-video]';
        this.triggerSelector = '.hero-section[data-hero-video] .hero-text a.btn-intro';
        this.openClass = 'is-open';
        this.bodyLockClass = 'hero-video-popup-open';
    }

    init() {
        const $ = window.jQuery;
        if (!$) {
            console.error('HeroVideoPopup: jQuery not available');
            return;
        }

        const $popup = $(this.popupSelector);
        if (!$popup.length) {
            return;
        }

        const $section = $(this.sectionSelector).first();
        if (!$section.length) {
            // No video URL configured — nothing to wire up.
            return;
        }

        // Re-parent the popup to <body> so it escapes any stacking/overflow context
        if ($popup.parent()[0] !== document.body) {
            $popup.appendTo(document.body);
        }

        const $iframe = $popup.find(this.iframeSelector);
        const $body = $('body');

        const close = () => {
            $popup.removeClass(this.openClass);
            $body.removeClass(this.bodyLockClass);
            $iframe.attr('src', '');
            setTimeout(() => {
                if (!$popup.hasClass(this.openClass)) {
                    $popup.attr('hidden', 'hidden');
                }
            }, 250);
        };

        const open = (embedUrl) => {
            $iframe.attr('src', embedUrl);
            $popup.removeAttr('hidden');
            // Force a reflow so the transition runs
            void $popup[0].offsetWidth;
            $popup.addClass(this.openClass);
            $body.addClass(this.bodyLockClass);
        };

        $(document)
            .off('click.heroVideo', this.triggerSelector)
            .on('click.heroVideo', this.triggerSelector, (event) => {
                const url = $(event.currentTarget).closest('.hero-section').attr('data-hero-video');
                const embed = this.buildEmbedUrl(url);
                if (!embed) {
                    console.warn('HeroVideoPopup: unsupported video URL', url);
                    return;
                }
                event.preventDefault();
                open(embed);
            });

        $popup.off('click.heroVideoClose').on('click.heroVideoClose', '[data-hero-video-close]', (event) => {
            event.preventDefault();
            close();
        });

        $(document).off('keydown.heroVideo').on('keydown.heroVideo', (event) => {
            if (event.key === 'Escape' && $popup.hasClass(this.openClass)) {
                close();
            }
        });
    }

    /**
     * Convert a YouTube URL into an embeddable form with autoplay params.
     * Includes mute=1 so browsers that block unmuted autoplay still start playback;
     * the user can unmute via the YouTube controls.
     * Supports watch?v=, youtu.be/, embed/, and shorts/ patterns.
     * @param {string} url
     * @returns {string|null}
     */
    buildEmbedUrl(url) {
        if (!url || typeof url !== 'string') return null;

        let id = null;
        const watchMatch = url.match(/[?&]v=([A-Za-z0-9_-]{11})/);
        const shortMatch = url.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
        const embedMatch = url.match(/youtube\.com\/embed\/([A-Za-z0-9_-]{11})/);
        const shortsMatch = url.match(/youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/);

        if (watchMatch) id = watchMatch[1];
        else if (shortMatch) id = shortMatch[1];
        else if (embedMatch) id = embedMatch[1];
        else if (shortsMatch) id = shortsMatch[1];

        if (!id) return null;
        const params = 'autoplay=1&rel=0&modestbranding=1&playsinline=1';
        return `https://www.youtube.com/embed/${id}?${params}`;
    }
}

/**
 * Main Hero Module
 * Orchestrates hero section functionality
 */
class HeroModule {
    constructor() {
        this.textAnimator = new HeroTextAnimator();
        this.carousel = new HeroCarousel();
        this.videoPopup = new HeroVideoPopup();
    }

    /**
     * Initialize hero functionality
     */
    async init() {
        try {
            // Initialize both text animation and carousel simultaneously
            this.textAnimator.init();
            this.carousel.init();
            this.videoPopup.init();
        } catch (error) {
            console.error('HeroModule: Initialization failed:', error);
        }
    }
}

// Initialize hero functionality when DOM is ready
$(function() {
    const hero = new HeroModule();
    hero.init();
});


