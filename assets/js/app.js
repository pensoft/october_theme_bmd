/* eslint-env browser, jquery */
'use strict';

// Track viewport width across the app
let width = window.innerWidth;
$(window).on('resize.app', function() {
    width = window.innerWidth;
});

$(function() {
    initPageStructureEnhancements();
    initIntroItemsClicks();
    initTabs();
    initAccordion();
    initPartnerContentTruncation();
    initPartnersColumnWrapping();
    initNewsCategoryTabs();
    initLanguageButtons();
    initHamburgerMenuDropdowns();
    initFooterDropdowns();
    initBackToTop();
    initPartnersPopup();
    initSearchToggles();
    initDesktopMenuToggle();
    initDesktopDropdownToggle();
    initCategoriesToggle();
    applyExternalLinkBehavior();
    sanitizeNavDropdowns();
    $('nav').removeClass('no-transition');
    initSmoothAnchorScroll();
    $('.see_all_partners_link').hide();
    initTimelineWidth();
    initDorsalToggle();
    initLibraryLayout();
    initLibraryFilters();
    initLibraryFiltersToggle();
    initPartnersListColumnWrapping();
    initHeroCarousel();
    initNavbarScrollState();
    initNavbarScrollHandler();
    initObjectivesToggle();
    initWorkPackagesAccordion();
    initKeyResultsTabs();
    initVideoFiltering();
    initProjectMaterialsFiltering();
    initDownloadDropdowns();
    initEabBiographyToggle();
});

// ---------- Initializers ----------
function initPageStructureEnhancements() {
    $('.navbar-nav').attr('id', 'menu');
    $('<div class="calendar-top"></div>').insertBefore('#calendar');
    $('<div class="card-profile-top"></div>').insertBefore('.card.profile.card-profile');
    const $divs = $('.card-profiles > div');
    for (let i = 0; i < $divs.length; i += 2) {
        $divs.slice(i, i + 2).wrapAll('<div class="col-xs" />');
    }
}

/**
 * Initialize EAB Biography toggle
 * Delegated click handler that toggles the next .eab-bio within the same card
 */
function initEabBiographyToggle() {
    $(document).off('click.eab').on('click.eab', '.eab-card .eab-biography-toggle', function(e) {
        e.preventDefault();
        const $btn = $(this);
        const $card = $btn.closest('.eab-card');
        const $bio = $card.find('.eab-bio').first();
        const isOpen = $bio.is(':visible');
        if (isOpen) {
            $bio.slideUp(180);
            $btn.attr('aria-expanded', 'false');
        } else {
            $bio.slideDown(200);
            $btn.attr('aria-expanded', 'true');
        }
    });
}

function initIntroItemsClicks() {
    $('.intro-item').on('click', function() {
        const href = $(this).data('href');
        if (href) {
            window.location.href = href;
        }
    });
}

function initLanguageButtons() {
    $('.language-btn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });
}

function initSearchToggles() {
    $('#searchToggle, #searchToggleMobile').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showSearchForm();
    });
}

function initDesktopMenuToggle() {
    const $navbarNav = $('#headerNavbarNav');
    const $desktopToggle = $('#desktopMenuToggle');
    const $closeBtn = $('#closeMenuBtn');

    $desktopToggle.on('click.desktopMenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $navbarNav.addClass('show').css({
            right: '0',
            opacity: '1',
            visibility: 'visible'
        });
        $desktopToggle.hide();
        $('body').addClass('menu-open');
    });

    $closeBtn.on('click.desktopMenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $navbarNav.removeClass('show').css({
            right: '-300px',
            opacity: '0',
            visibility: 'hidden'
        });
        $desktopToggle.show();
        $('body').removeClass('menu-open');
    });

    $(document).on('click.desktopMenuOutside', function(event) {
        if (
            $navbarNav.hasClass('show') &&
            !$navbarNav.is(event.target) &&
            $navbarNav.has(event.target).length === 0 &&
            !$desktopToggle.is(event.target) &&
            $desktopToggle.has(event.target).length === 0 &&
            !$closeBtn.is(event.target) &&
            $closeBtn.has(event.target).length === 0
        ) {
            $navbarNav.removeClass('show').css({
                right: '-300px',
                opacity: '0',
                visibility: 'hidden'
            });
            $desktopToggle.show();
            $('body').removeClass('menu-open');
        }
    });

    // Prevent clicks on the menu and bottom elements from closing it
    $navbarNav.on('click.desktopMenu', function(e) { e.stopPropagation(); });
    $('.navbar-bottom-elements').on('click.desktopMenu', function(e) { e.stopPropagation(); });
}

function initDesktopDropdownToggle() {
    $('.nav-item.dropdown > a').on('click.desktopDropdown', function(e) {
        e.preventDefault();
        const $dropdownMenu = $(this).siblings('.dropdown-menu');
        if ($dropdownMenu.hasClass('show')) {
            $dropdownMenu.removeClass('show');
        } else {
            $('.dropdown-menu.show').removeClass('show');
            $dropdownMenu.addClass('show');
        }
    });
}

function applyExternalLinkBehavior() {
    $('.work_packages .accordion-content, .messages .accordion-toggle').each(function(index, value) {
        $(value).find('a').attr('onclick', "window.open(this.href, '_blank');");
    });
}

function sanitizeNavDropdowns() {
    $('.nav-item').children('a').each(function() {
        const $link = $(this);
        if ($link.attr('data-toggle') === 'dropdown') {
            $link
                .removeAttr('data-toggle')
                .off('click.navSanitize')
                .on('click.navSanitize', function(e) {
                    e.preventDefault();
                    $(this).siblings('.dropdown-menu').toggleClass('show');
                });
        }
    });
}

function initSmoothAnchorScroll() {
    if (window.location.hash) {
        const link = window.location.hash;
        const anchorId = link.substr(link.indexOf('#') + 1);
        if ($('#' + anchorId).offset()) {
            $('html, body').animate({
                scrollTop: $('#' + anchorId).offset().top - 150
            }, 500);
        } else {
            $('.accordion-border').each(function() {
                const title = $(this).find('.accordion-toggle .col-xs.start-xs').text().toUpperCase();
                const toggler = $(this).find('.accordion-toggle');
                if (title.indexOf(anchorId.toUpperCase()) >= 0 && !toggler.next('.accordion-content').is(':visible')) {
                    $('html, body').animate({
                        scrollTop: toggler.parent().offset().top - 150
                    }, 500);
                    toggler.trigger('click');
                }
            });
        }
    }

    $('.dropdown a').on('click.anchor', function(event) {
        if (location.href.indexOf('#') !== -1) {
            const link = $(this).attr('href');
            const anchorId = link.substr(link.indexOf('#') + 1);
            if ($('#' + anchorId).length > 0) {
                $('html, body').animate({
                    scrollTop: $('#' + anchorId).offset().top - 150
                }, 500);
            } else {
                $("g[title='" + anchorId.toUpperCase() + "']").addClass('active_path');

                $('.accordion-border').each(function() {
                    const title = $(this).find('.accordion-toggle .col-xs.start-xs').text().toUpperCase();
                    const toggler = $(this).find('.accordion-toggle');
                    if (title.indexOf(anchorId.toUpperCase()) >= 0 && !toggler.next('.accordion-content').is(':visible')) {
                        $('html, body').animate({
                            scrollTop: toggler.parent().offset().top - 150
                        }, 500);
                        toggler.trigger('click');
                        event.preventDefault();
                    }
                });
            }
        }
    });

    onHashChange();
    $(window).on('hashchange', function() {
        onHashChange();
    });
}

function initTimelineWidth() {
    $('.timeline_container.left .blue_line').width(function() {
        return (innerWidth - $('.container').width()) / 2;
    });
}

function initDorsalToggle() {
    $('.dorsal').on('click', function() {
        const link = $(this);
        const parag = link.parent().parent().find('p').first();
        const partner_desc = link.parent().parent().find('.partner_description').first();
        parag.toggleClass('expand', function() {
            if (parag.hasClass('expand')) {
                link.text('Read less');
                parag.slideDown(300);
            } else {
                link.text('Read more');
            }
        });
        partner_desc.toggleClass('expand', function() {
            if (parag.hasClass('expand')) {
                link.text('Read less');
                parag.slideDown(300);
            } else {
                link.text('Read more');
            }
        });
    });
}

function initLibraryLayout() {
    // The new library page provides its own markup/layout.
    // Avoid moving `.library-items` under the filters column which happened due to wrapAll.
    if ($('.library-page').length) {
        return;
    }
    $('.library .tabs').wrapAll('<div class="container"></div>');
    $('.library_content .row.center-xs.mb-1').wrapAll('<div class="container_relative"></div>');
}

/**
 * New front-end driven Library filters/search/sort with AJAX
 * Uses LibraryHandler::onFilter to fetch JSON and renders items client-side
 */
function initLibraryFilters() {
    const $container = $('.library-page');
    if (!$container.length) return;

    const $items = $('#recordsContainer');
    const $pagination = $('#libPagination');
    const $types = $('input.lib-type');
    const $sorts = $('input.lib-sort');
    const $search = $('#libSearch');
    const $clear = $('#libClearSearch');
    const $size = $('#libTotalSize');
    const $sortHeading = $container.find('.dropdown-head h4').eq(1); // second heading (sort)

    const state = {
        page: 1,
        perPage: 15,
        type: '0',
        sort: 'year desc',
        search: ''
    };

    // Helper: default sort based on type
    function computeDefaultSortForType(typeVal) {
        return (typeVal === '1' || typeVal === '4') ? 'title asc' : 'year desc';
    }

    function updateSortHeading() {
        const label = $sorts.filter(':checked').siblings('span').text();
        if (label && $sortHeading.length) {
            $sortHeading.text(label);
        }
    }

    // Render list from HTML partial
    function renderItemsHtml(html) {
        $items.html(html || '<div class="no-records">Items will follow soon. Keep posted!</div>');
    }

    // Render pagination from HTML and hijack links
    function renderPaginationHtml(html) {
        $pagination.html(html || '');
        $pagination.find('a').off('click').on('click', function(e){
            const href = $(this).attr('href') || '';
            const match = href.match(/[?&]page=(\d+)/);
            if (match) {
                e.preventDefault();
                state.page = parseInt(match[1], 10) || 1;
                fetchAndRender();
            }
        });
    }

    // Fetch data
    function fetchAndRender() {
        $.request('LibraryHandler::onFilter', {
            data: {
                page: state.page,
                perPage: state.perPage,
                type: state.type,
                sort: state.sort,
                search: state.search
            },
            success: function(resp){
                if (!resp) return;
                renderItemsHtml(resp.html);
                renderPaginationHtml(resp.pagination);
                if ($size.length) {
                    const mb = resp.meta && resp.meta.total_file_size_mb ? resp.meta.total_file_size_mb : 0;
                    $size.text(mb ? `(Total download size: ${mb} MB)` : '');
                }
            },
            error: function(){
                $items.html('<div class="no-records">Error loading items. Please try again.</div>');
            }
        });
    }

    // Type selection behaves like radio: only one checked at a time
    $types.on('change', function(){
        const $this = $(this);
        // keep only this checked
        $types.not($this).prop('checked', false);
        state.type = String($this.val());
        // Default sort may change with type
        state.sort = computeDefaultSortForType(state.type);
        $sorts.prop('checked', false);
        $sorts.filter(`[value="${state.sort}"]`).prop('checked', true);
        updateSortHeading();
        state.page = 1;
        fetchAndRender();
    });

    // Sorting - ensure only one radio button is selected
    $sorts.on('change', function(){
        const $this = $(this);
        // Uncheck all other sort options
        $sorts.not($this).prop('checked', false);
        state.sort = String($this.val());
        updateSortHeading();
        state.page = 1;
        fetchAndRender();
    });

    // Search with debounce
    let searchTimer = null;
    function triggerSearch(){
        state.search = $search.val();
        state.page = 1;
        fetchAndRender();
        toggleClearVisibility();
        toggleSearchIconVisibility();
    }
    $search.on('input', function(){
        clearTimeout(searchTimer);
        searchTimer = setTimeout(triggerSearch, 300);
        toggleClearVisibility();
        toggleSearchIconVisibility();
    });
    
    function toggleClearVisibility(){
        if ($search.val()) {
            $clear.addClass('visible');
        } else {
            $clear.removeClass('visible');
        }
    }
    
    function toggleSearchIconVisibility(){
        const $defaultIcon = $search.siblings('.search-icon.default-icon');
        const $focusedIcon = $search.siblings('.search-icon.focused-icon');
        
        if ($search.val()) {
            // Hide both icons when typing - regardless of focus state
            $defaultIcon.addClass('hidden');
            $focusedIcon.addClass('hidden');
        } else {
            // Show appropriate icon based on focus state only when empty
            if ($search.is(':focus')) {
                // If focused and empty, show green icon, hide default
                $defaultIcon.addClass('hidden');
                $focusedIcon.removeClass('hidden');
            } else {
                // If not focused and empty, show default icon, hide green
                $defaultIcon.removeClass('hidden');
                $focusedIcon.addClass('hidden');
            }
        }
    }
    
    // Enhanced search focus effects
    $search.on('focus', function() {
        $(this).addClass('focused');
        toggleSearchIconVisibility();
    });
    
    $search.on('blur', function() {
        $(this).removeClass('focused');
        toggleSearchIconVisibility();
        // Keep clear button visible if there's text
        if (!$(this).val()) {
            $clear.removeClass('visible');
        }
    });
    
    $clear.on('click', function(e){
        e.preventDefault();
        $search.val('').focus();
        triggerSearch();
    });

    // Initialize defaults from UI
    const $defaultType = $types.filter(':checked');
    state.type = $defaultType.length ? String($defaultType.val()) : '0';
    state.sort = computeDefaultSortForType(state.type);
    $sorts.prop('checked', false);
    $sorts.filter(`[value="${state.sort}"]`).prop('checked', true);
    updateSortHeading();
    toggleClearVisibility();

    fetchAndRender();
}

function initLibraryFiltersToggle() {
    // Handle library categories toggle
    const $libraryCategoriesHeader = $('[data-toggle="library-categories"]');
    const $libraryCategoriesContent = $libraryCategoriesHeader.siblings('.categories-content');

    if ($libraryCategoriesHeader.length && $libraryCategoriesContent.length) {
        $libraryCategoriesHeader.on('click', function(e) {
            e.preventDefault();
            
            const $header = $(this);
            const $content = $header.siblings('.categories-content');
            
            // Toggle collapsed state
            $header.toggleClass('collapsed');
            $content.toggleClass('collapsed');
            
            // Store state in localStorage for persistence
            const isCollapsed = $header.hasClass('collapsed');
            localStorage.setItem('libraryCategoriesCollapsed', isCollapsed);
        });
        
        // Restore state from localStorage on page load
        const wasCollapsed = localStorage.getItem('libraryCategoriesCollapsed') === 'true';
        if (wasCollapsed) {
            $libraryCategoriesHeader.addClass('collapsed');
            $libraryCategoriesContent.addClass('collapsed');
        }
    }

    // Handle library sort toggle
    const $librarySortHeader = $('[data-toggle="library-sort"]');
    const $librarySortContent = $librarySortHeader.siblings('.categories-content');

    if ($librarySortHeader.length && $librarySortContent.length) {
        $librarySortHeader.on('click', function(e) {
            e.preventDefault();
            
            const $header = $(this);
            const $content = $header.siblings('.categories-content');
            
            // Toggle collapsed state
            $header.toggleClass('collapsed');
            $content.toggleClass('collapsed');
            
            // Store state in localStorage for persistence
            const isCollapsed = $header.hasClass('collapsed');
            localStorage.setItem('librarySortCollapsed', isCollapsed);
        });
        
        // Restore state from localStorage on page load
        const wasCollapsed = localStorage.getItem('librarySortCollapsed') === 'true';
        if (wasCollapsed) {
            $librarySortHeader.addClass('collapsed');
            $librarySortContent.addClass('collapsed');
        }
    }
}

function initPartnersColumnWrapping() {
    if (width >= 1024 && $('#partners .key_0').length) {
        $('#partners .key_0, #partners .key_2, #partners .key_4, #partners .key_6, #partners .key_8, #partners .key_10, #partners .key_12, #partners .key_14, #partners .key_16, #partners .key_18').wrapAll('<div class="col-md-6 col-xs-12" />');
        $('#partners .key_1, #partners .key_3, #partners .key_5, #partners .key_7, #partners .key_9, #partners .key_11, #partners .key_13, #partners .key_15, #partners .key_17, #partners .key_19').wrapAll('<div class="col-md-6 col-xs-12" />');
    }
}

function initPartnersListColumnWrapping() {
    if (width > 1024) {
        $('.partners_list .key_0, .partners_list .key_2, .partners_list .key_4, .partners_list .key_6, .partners_list .key_8, .partners_list .key_10, .partners_list .key_12, .partners_list .key_14, .partners_list .key_16, .partners_list .key_18').wrapAll('<div class="col-md-6 col-xs-12"></div>');
        $('.partners_list .key_1, .partners_list .key_3, .partners_list .key_5, .partners_list .key_7, .partners_list .key_9, .partners_list .key_11, .partners_list .key_13, .partners_list .key_15, .partners_list .key_17, .partners_list .key_19').wrapAll('<div class="col-md-6 col-xs-12"></div>');
    }
}

function initHeroCarousel() {
    if ($('#hero-carousel').length) {
        $('#hero-carousel').slick({
            autoplay: true,
            autoplaySpeed: 3000,
            lazyLoad: 'ondemand',
            pauseOnFocus: false,
            draggable: false,
            infinite: true,
            centerMode: true,
            centerPadding: '15%',
            slidesToShow: 3,
            slidesToScroll: 1,
            variableWidth: false,
            adaptiveHeight: false,
            arrows: false,
            dots: false,
            speed: 800,
            cssEase: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            pauseOnHover: true,
            swipeToSlide: true,
            touchThreshold: 10,
            responsive: [
                { breakpoint: 1400, settings: { slidesToShow: 3, centerPadding: '12%' } },
                { breakpoint: 1200, settings: { slidesToShow: 3, centerPadding: '10%' } },
                { breakpoint: 768, settings: { slidesToShow: 1, centerPadding: '25%' } },
                { breakpoint: 480, settings: { slidesToShow: 1, centerPadding: '20%' } }
            ]
        });
        // Ensure transparent backgrounds
        $('#hero-carousel .slick-slide').each(function() {
            $(this).css('background', 'transparent');
            $(this).find('div').css('background', 'transparent');
        });
    }
}

function initNavbarScrollHandler() {
    const $headerNavbar = $('#headernavbar');
    const $backToTop = $('.back-to-top');
    let hasShownBackToTop = false;

    $(window).on('scroll.navbar', function() {
        const currentScrollTop = $(this).scrollTop();
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();
        const scrollPercent = currentScrollTop / (documentHeight - windowHeight);

        if (currentScrollTop > 80) {
            $headerNavbar.addClass('navbar-scrolled');
        } else {
            $headerNavbar.removeClass('navbar-scrolled');
        }

        if (currentScrollTop > 300) {
            if (!$backToTop.hasClass('show')) {
                $backToTop.addClass('show');
                if (!hasShownBackToTop) {
                    $backToTop.addClass('first-show');
                    hasShownBackToTop = true;
                    setTimeout(function() {
                        $backToTop.removeClass('first-show');
                    }, 600);
                }
            }
        } else {
            $backToTop.removeClass('show');
        }

        updateScrollProgress(scrollPercent);
    });
}

/**
 * Initialize Objectives toggle behaviour on About page
 * Toggles the visibility of .objective-content when .objective-head is activated
 */
function initObjectivesToggle() {
    const $items = $('.objective-item');
    if (!$items.length) return;

    $items.each(function(index) {
        const $item = $(this);
        const $head = $item.find('.objective-head').first();
        const $content = $item.find('.objective-content').first();

        if (!$head.length || !$content.length) return;

        // Ensure unique id for content for accessibility
        const contentId = $content.attr('id') || ('objective-content-' + index);
        $content.attr('id', contentId);

        // Start collapsed
        $content.hide();
        $item.removeClass('expanded');

        // Click handler
        $head.off('click.objective').on('click.objective', function(e) {
            e.preventDefault();
            toggleObjective($item, $head, $content);
        });
    });
}

/**
 * Toggle a single Objective item
 * @param {JQuery} $item
 * @param {JQuery} $head
 * @param {JQuery} $content
 */
function toggleObjective($item, $head, $content) {
    const isOpen = $content.is(':visible');
    if (isOpen) {
        $content.slideUp(200);
        $head.attr('aria-expanded', 'false');
        $item.removeClass('expanded');
    } else {
        $content.slideDown(200);
        $head.attr('aria-expanded', 'true');
        $item.addClass('expanded');
    }
}

function type(i, t, ie, oe) {
    input = document.getElementById(ie).innerHTML;
    document.getElementById(oe).innerHTML += input.charAt(i);
    setTimeout(function(){
        ((i < input.length - 1) ? type(i+1, t, ie, oe) : false);
    }, t);
}

// Initialize navbar scroll state on page load
function initNavbarScrollState() {
    const $headerNavbar = $('#headernavbar');
    const $backToTop = $('.back-to-top');
    const currentScrollTop = $(window).scrollTop();
    const windowHeight = $(window).height();
    const documentHeight = $(document).height();
    const scrollPercent = currentScrollTop / (documentHeight - windowHeight);
    
    // Apply navbar styling based on initial scroll position
    if (currentScrollTop > 80) {
        $headerNavbar.addClass('navbar-scrolled');
    } else {
        $headerNavbar.removeClass('navbar-scrolled');
    }
    
    // Show back-to-top button if already scrolled
    if (currentScrollTop > 300) {
        $backToTop.addClass('show');
    } else {
        $backToTop.removeClass('show');
    }
    
    // Update progress ring based on initial scroll position
    updateScrollProgress(scrollPercent);
}

// Update scroll progress ring
function updateScrollProgress(scrollPercent) {
    const $progressCircle = $('.back-to-top .progress-ring .progress');
    if ($progressCircle.length) {
        // Use consistent circumference that matches CSS (2 * π * 26 = 163.36)
        const circumference = 163.36;
        let offset = circumference - (scrollPercent * circumference);
        
        // Clamp between 0 and circumference
        offset = Math.max(0, Math.min(circumference, offset));
        
        // Update stroke-dashoffset and ensure stroke-dasharray is set
        $progressCircle.css({
            'stroke-dasharray': circumference,
            'stroke-dashoffset': offset
        });
    }
}

// Smooth scroll to top functionality
function initBackToTop() {
    const $backToTop = $('.back-to-top');
    
    if ($backToTop.length) {
        $backToTop.on('click', function(e) {
            e.preventDefault();
            
            // Add click effect
            $(this).addClass('clicked');
            setTimeout(function() {
                $backToTop.removeClass('clicked');
            }, 200);
            
            // Smooth scroll to top
            $('html, body').animate({
                scrollTop: 0
            }, {
                duration: 800,
                easing: 'easeOutCubic'
            });
        });
    }
}

// Custom easing function for smooth animation
$.easing.easeOutCubic = function(x, t, b, c, d) {
    return c * ((t = t / d - 1) * t * t + 1) + b;
};

function onHashChange(){
	$("g").removeClass('active_path');
	$(".accordion-content").hide();
	const caseStudiesHashTitle = location.hash;

        if(caseStudiesHashTitle){
		const caseStudiesTitle = caseStudiesHashTitle.substring(1, caseStudiesHashTitle.length);
		
		// Check if the hash corresponds to a tab
		if(['about', 'work-packages', 'partners'].includes(caseStudiesTitle)) {
		    // Trigger tab click
		    $('.tab-link[data-tab="' + caseStudiesTitle + '"]').trigger('click');
		    
		    // If it's the work-packages tab, initialize the toggle functionality
            if(caseStudiesTitle === 'work-packages' || caseStudiesTitle === 'how-we-do') {
                initWorkPackagesAccordion();
		    }
		} else {
		    // Handle other hash values (like case studies)
		    $("g[title='"+caseStudiesTitle.toUpperCase()+"']").addClass('active_path');
		}
	}
}

function encodeURIObject(data){
    return Object.keys(data).map(function (i) {
        return encodeURIComponent(i) + '=' + encodeURIComponent(data[i])
    }).join('&');
}

function redirectAndRefresh(url){
	$(".tabs a").each(function() {
		this.href = window.location.hash;
	});
	window.open(url, '_blank');
	location.reload();
}

function isBreakpointLarge() {
    return window.innerWidth <= 991;
}

function requestFormLibrary() {
	$('#mylibraryForm').on('click', 'a', function () {
		const $form = $(this).closest('form');
		$form.request();
	})
}

function requestFormPartners() {
	$('#myPartnersForm').on('click', 'a', function () {
		const $form = $(this).closest('form');
		$form.request();
	})
}

function scrollDown(){
	const element = $('#layout-content');
	$("html, body").animate({ scrollTop: element.offset().top - 190 }, 500);
}


function hideMe(elem){
    $(elem).parent().hide();
}


function getScreenSize() {
    let myHeight = 0;
    let myWidth = 0;
    if (window.innerWidth && window.innerHeight) {
        // Netscape & Mozilla
        myHeight = window.innerHeight;
        myWidth = window.innerWidth;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        // IE > 6
        myHeight = document.documentElement.clientHeight;
        myWidth = document.documentElement.clientWidth;
    } else if (document.body.offsetWidth && document.body.offsetHeight) {
        // IE = 6
        myHeight = document.body.offsetHeight;
        myWidth = document.body.offsetWidth;
    } else if (document.body.clientWidth && document.body.clientHeight) {
        // IE < 6
        myHeight = document.body.clientHeight;
        myWidth = document.body.clientWidth;
    }

    return {'width': myWidth, 'height': myHeight};
}

/**
 * Handles tab switching without page refreshes
 * This function initializes tab functionality for the about page
 */
function initTabs() {
    // Skip initialization for key-results page as it has its own tab system
    if ($('.key-results').length) {
        return;
    }

    // Skip on news pages (listing/detail) which manage their own tabs/filters
    if ($('.news-list-section').length || window.location.pathname.indexOf('/news') === 0) {
        return;
    }

    // Operate only within a tabs container (About page and similar)
    const $tabsContainer = $('.tabs');
    if (!$tabsContainer.length) {
        return;
    }
    
    // Look for tab content sections globally (not just within tabs container)
    const $allTabContent = $('.tab-content');
    
    // Check if there's already an active tab content
    if ($allTabContent.filter('.active').length === 0) {
        // No active tab found, activate the first tab
        const $activeTabLink = $tabsContainer.find('.tab-link.active');
        if ($activeTabLink.length > 0) {
            const firstTabId = $activeTabLink.data('tab');
            $('#' + firstTabId).addClass('active');
        }
    }
    
    // Hide all tab content except the active one on page load
    const $nonActiveTabs = $allTabContent.not('.active');
    $nonActiveTabs.css({
        'display': 'none',
        'opacity': '0'
    });
    
    // Make sure active tab is visible
    const $activeTab = $allTabContent.filter('.active');
    $activeTab.css({
        'display': 'block',
        'opacity': '1'
    });
    
    // Handle tab click events
    $tabsContainer.on('click', '.tab-link', function(e) {
        e.preventDefault();
        
        // Get the tab id from data attribute
        const tabId = $(this).data('tab');
        
        // Remove active class from all tabs and add to clicked tab
        $tabsContainer.find('.tab-link').removeClass('active');
        $(this).addClass('active');
        
        // Hide all tab content immediately
        $allTabContent.removeClass('active').css({
            'display': 'none',
            'opacity': '1'
        });
        
        // Show the active tab immediately
        const $targetTab = $('#' + tabId);
        if ($targetTab.length) {
            $targetTab.css('display', 'block').addClass('active');
        }
        
        // If switching to how-we-do/work-packages tab, make sure accordion functionality is initialized
        if (tabId === 'work-packages' || tabId === 'how-we-do') {
            // Reinitialize accordion if needed
            initAccordion();
            // Initialize new work packages accordion
            initWorkPackagesAccordion();
        }
        
        // If switching to partners tab, initialize content truncation
        if (tabId === 'partners') {
            initPartnerContentTruncation();
        }
    
        
        if (history.pushState) {
            history.pushState(null, null, '#' + tabId);
        } else {
            location.hash = '#' + tabId;
        }
    });
    
    if (window.location.hash) {
        const tabId = window.location.hash.substring(1);
        // support both plain id (e.g. #what-we-do) and custom anchors that include page slug
        const $candidate = $tabsContainer.find('.tab-link[data-tab="' + tabId + '"]');
        if ($candidate.length) {
            $candidate.trigger('click');
        }
    }
}

/**
 * Initialize Work Packages accordion (About > How we do it)
 * Uses markup .work-packages .work-package with a clickable .work-package-header
 */
function initWorkPackagesAccordion() {
    const $container = $('#work-packages');
    if (!$container.length) return;

    // Close all by default
    $container.find('.work-package-content').hide();
    $container.find('.work-package').removeClass('expanded');
    $container.find('.work-package-header').attr('aria-expanded', 'false');

    // Click to toggle
    $container.find('.work-package-header').off('click.wp').on('click.wp', function(e) {
        e.preventDefault();
        const $header = $(this);
        const $item = $header.closest('.work-package');
        const $content = $item.find('.work-package-content').first();
        const isOpen = $content.is(':visible');

        // Close others
        $container.find('.work-package-content').not($content).slideUp(200);
        $container.find('.work-package').not($item).removeClass('expanded');
        $container.find('.work-package-header').not($header).attr('aria-expanded', 'false');

        if (isOpen) {
            $content.slideUp(200);
            $item.removeClass('expanded');
            $header.attr('aria-expanded', 'false');
        } else {
            $content.slideDown(200);
            $item.addClass('expanded');
            $header.attr('aria-expanded', 'true');
        }
    });
}

/**
 * Initialize Key Results page tabs functionality
 * Handles left-side navigation tabs for the key-results page
 */
function initKeyResultsTabs() {
    // Only initialize if we're on the key-results page
    if (!$('.key-results').length) {
        return;
    }
    
    // Ensure the first tab is active by default
    const $firstTab = $('.key-results .tab-link').first();
    const $firstContent = $('.key-results .tab-content').first();
    
    if ($firstTab.length && $firstContent.length) {
        $firstTab.addClass('active');
        $firstContent.addClass('active').show();
        
        // Hide other tab content
        $('.key-results .tab-content').not($firstContent).hide().removeClass('active');
    }
    
    // Handle tab click events
    $('.key-results .tab-link').on('click', function(e) {
        e.preventDefault();
        
        // Get the tab id from data attribute
        const tabId = $(this).data('tab');
        
        // Remove active class from all tabs and add to clicked tab
        $('.key-results .tab-link').removeClass('active');
        $(this).addClass('active');
        
        // Hide all tab content
        $('.key-results .tab-content').removeClass('active').hide();
        
        // Show the active tab content
        $('#' + tabId).addClass('active').show();
        
        // Update URL hash
        if (history.pushState) {
            history.pushState(null, null, '#' + tabId);
        } else {
            location.hash = '#' + tabId;
        }
    });
    
    // Handle URL hash on page load
    if (window.location.hash) {
        const tabId = window.location.hash.substring(1);
        const $targetTab = $('.key-results .tab-link[data-tab="' + tabId + '"]');
        if ($targetTab.length) {
            $targetTab.trigger('click');
        }
    }
}

/**
 * Initialize accordion functionality
 * This ensures accordions work properly even when they're in hidden tabs
 */
function initAccordion() {
    $('.work_packages .accordion-toggle, .mission .accordion-toggle').off('click');
    
    $('.work_packages .accordion-toggle, .mission .accordion-toggle').on('click', function () {
        if ($(this).next(".accordion-content").is(':visible')) {
            $(this).next(".accordion-content").hide();
            $(this).children().find(".plusminus").text('+');
            $(this).children(".plusminus").html('<span class="plus"></span>');
            $(this).children(".green_bullet").removeClass('toggled');
        } else {
            $(this).next(".accordion-content").show();
            $(this).children().find(".plusminus").text('-');
            $(this).children(".plusminus").html('<span class="minus"></span>');
            $(this).children(".green_bullet").addClass('toggled');
        }
    });
}

/**
 * Initialize partner content truncation
 * Truncates partner descriptions to 255 characters without breaking words
 */
function initPartnerContentTruncation() {
    $('.partner-content').each(function() {
        const $partnerContent = $(this);
        const $fullContent = $partnerContent.find('.partner-description-full');
        const $truncatedContent = $partnerContent.find('.partner-description-truncated');
        const $button = $partnerContent.find('.read-more-partner');
        
        const fullText = $fullContent.data('full-content');
        const maxLength = 255;
        
        if (fullText && fullText.length > maxLength) {
            // Find the last space before the 255 character limit to avoid breaking words
            let truncatedText = fullText.substring(0, maxLength);
            const lastSpaceIndex = truncatedText.lastIndexOf(' ');
            
            if (lastSpaceIndex > 0) {
                truncatedText = truncatedText.substring(0, lastSpaceIndex);
            }
            
            // Add ellipsis to indicate there's more content
            truncatedText += '...';
            
            // Set the truncated content
            $truncatedContent.html(truncatedText);
            
            // Show truncated content initially and show button
            $truncatedContent.show();
            $fullContent.hide();
            $button.show();
        } else {
            // Content is short enough, show full content and hide button
            $truncatedContent.html(fullText);
            $truncatedContent.show();
            $fullContent.hide();
            $button.hide();
        }
    });
    
    // Handle read more/less toggle with smooth animation
    $('.read-more-partner').off('click').on('click', function(e) {
        e.preventDefault();
        
        const $button = $(this);
        const $partnerContent = $button.closest('.partner-content');
        const $truncatedContent = $partnerContent.find('.partner-description-truncated');
        const $fullContent = $partnerContent.find('.partner-description-full');
        
        if ($fullContent.is(':visible')) {
            // Currently showing full content, switch to truncated
            $fullContent.hide();
            $truncatedContent.show();
            $button.text('Read more').removeClass('expanded');
        } else {
            // Currently showing truncated content, switch to full
            $truncatedContent.hide();
            $fullContent.show();
            $button.text('Read less').addClass('expanded');
        }
    });
}



/**
 * Initialize news category tabs functionality
 * Handles smooth navigation between news categories
 */
function initNewsCategoryTabs() {
    // Only initialize on the news listing page
    const $newsSection = $('.news-list-section');
    if (!$newsSection.length) {
        return;
    }
    
    // Handle tab click events
    $newsSection.find('.tab-navigation .tab-link').on('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all tabs
        $newsSection.find('.tab-navigation .tab-link').removeClass('active');
        
        // Add active class to clicked tab
        $(this).addClass('active');
        
        // Get the category ID from data attribute
        const categoryId = $(this).data('category');
        
        // Build the URL
        let url = '/news';
        if (categoryId !== 'all') {
            url += '?categoryId=' + categoryId;
        }
        
        // Navigate to the URL (this will reload the page with filtered content)
        window.location.href = url;
    });
    
    // Update active state based on current URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const currentCategoryId = urlParams.get('categoryId') || 'all';
    
    // Set the correct active tab based on URL
    $newsSection.find('.tab-navigation .tab-link').removeClass('active');
    $newsSection.find('.tab-navigation .tab-link[data-category="' + currentCategoryId + '"]').addClass('active');
}

/**
 * Initialize footer dropdown functionality
 * Handles dropdown toggles in the footer menu with simple click behavior
 */
function initFooterDropdowns() {
    // Mark dropdown items that have submenus
    $('.footer-navigation .nav-item').each(function() {
        const $item = $(this);
        const $submenu = $item.find('.dropdown-menu');
        
        if ($submenu.length > 0) {
            $item.addClass('dropdown');
        }
    });
    
    // Handle dropdown clicks
    $('.footer-navigation .nav-item.dropdown > a').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const $parentItem = $(this).parent();
        const $dropdownMenu = $parentItem.find('.dropdown-menu');
        
        if ($dropdownMenu.length) {
            $('.footer-navigation .nav-item.dropdown').not($parentItem).removeClass('active');
            $('.footer-navigation .dropdown-menu').not($dropdownMenu).removeClass('show');
            
            $parentItem.toggleClass('active');
            $dropdownMenu.toggleClass('show');
        }
    });
    
    $(document).on('click.footerDropdown', function(e) {
        if (!$(e.target).closest('.footer-navigation').length) {
            $('.footer-navigation .nav-item.dropdown').removeClass('active');
            $('.footer-navigation .dropdown-menu').removeClass('show');
        }
    });
    
    // Prevent dropdown menu clicks from closing the dropdown
    $('.footer-navigation .dropdown-menu').on('click', function(e) {
        e.stopPropagation();
    });
    
    // Allow dropdown menu links to work normally
    $('.footer-navigation .dropdown-menu a').on('click', function(e) {
        // Don't prevent default - let the link work normally
        // Just close the dropdown after a short delay
        setTimeout(function() {
            $('.footer-navigation .nav-item.dropdown').removeClass('active');
            $('.footer-navigation .dropdown-menu').removeClass('show');
        }, 100);
    });
}

/**
 * Initialize hamburger menu dropdown functionality
 * Handles dropdown menu toggles, auto-expand, and menu state management
 */
function initHamburgerMenuDropdowns() {
    // Auto-expand dropdowns that contain the current active page
    function autoExpandActiveDropdowns() {
        const activeSubItems = $('#headerNavbarNav .dropdown-menu .nav-item.active');
        
        activeSubItems.each(function() {
            // Find the parent dropdown
            const parentDropdown = $(this).closest('.nav-item.dropdown');
            if (parentDropdown.length) {
                const dropdownMenu = parentDropdown.find('.dropdown-menu');
                
                // Expand the parent dropdown
                parentDropdown.addClass('active');
                if (dropdownMenu.length) {
                    dropdownMenu.addClass('show');
                }
            }
        });
    }
    
    // Run auto-expand on page load
    autoExpandActiveDropdowns();
    
    // Handle dropdown menu toggles
    const dropdownItems = $('#headerNavbarNav .nav-item.dropdown > a');
    
    dropdownItems.each(function() {
        $(this).off('click.dropdown').on('click.dropdown', function(e) {
            e.preventDefault();
            
            const parentItem = $(this).parent();
            const dropdownMenu = parentItem.find('.dropdown-menu');
            
            if (dropdownMenu.length) {
                // Toggle active state on parent item
                parentItem.toggleClass('active');
                
                // Toggle show state on dropdown menu
                dropdownMenu.toggleClass('show');
                
                // Optional: Close other open dropdowns (accordion behavior)
                const otherDropdowns = $('#headerNavbarNav .nav-item.dropdown');
                otherDropdowns.each(function() {
                    if (this !== parentItem[0]) {
                        $(this).removeClass('active');
                        const otherMenu = $(this).find('.dropdown-menu');
                        if (otherMenu.length) {
                            otherMenu.removeClass('show');
                        }
                    }
                });
            }
        });
    });
    
    // Close all dropdowns when menu is closed (but preserve auto-expanded state)
    function closeAllDropdowns() {
        const activeDropdowns = $('#headerNavbarNav .nav-item.dropdown.active');
        activeDropdowns.each(function() {
            $(this).removeClass('active');
            const menu = $(this).find('.dropdown-menu');
            if (menu.length) {
                menu.removeClass('show');
            }
        });
    }
    
    function handleMenuToggle() {
        // When menu is opened, auto-expand dropdowns with active items
        setTimeout(function() {
            autoExpandActiveDropdowns();
        }, 100); // Small delay to ensure menu animation completes
    }
    
    const closeMenuBtn = $('#closeMenuBtn');
    if (closeMenuBtn.length) {
        closeMenuBtn.off('click.dropdown').on('click.dropdown', closeAllDropdowns);
    }
    
    // Re-expand dropdowns when menu is opened
    const menuToggleBtn = $('#desktopMenuToggle');
    if (menuToggleBtn.length) {
        menuToggleBtn.off('click.dropdown').on('click.dropdown', handleMenuToggle);
    }
    
    // Close dropdowns when clicking outside
    $(document).off('click.dropdownOutside').on('click.dropdownOutside', function(e) {
        const navbar = $('#headerNavbarNav');
        const menuToggle = $('#desktopMenuToggle');
        
        if (navbar.length && !navbar.is(e.target) && navbar.has(e.target).length === 0 && 
            !menuToggle.is(e.target) && menuToggle.has(e.target).length === 0) {
            closeAllDropdowns();
        }
    });
}

/**
 * Initialize partners popup functionality
 * Handles opening/closing popup and loading partner data via AJAX
 */
function initPartnersPopup() {
    // Handle partner logo clicks
    $(document).on('click', '.partner-trigger', function(e) {
        e.preventDefault();
        
        const partnerId = $(this).data('partner-id');
        
        if (!partnerId) {
            console.error('Partner ID not found');
            return;
        }
        
        openPartnersPopup(partnerId);
    });
    
    // Handle popup close button
    $('#partnersPopupClose').on('click', function(e) {
        e.preventDefault();
        closePartnersPopup();
    });
    
    // Handle clicking outside popup to close
    $('#partnersPopup').on('click', function(e) {
        if (e.target === this) {
            closePartnersPopup();
        }
    });
    
    // Handle escape key to close popup
    $(document).on('keydown.partnersPopup', function(e) {
        if (e.key === 'Escape' && $('#partnersPopup').is(':visible')) {
            closePartnersPopup();
        }
    });

    // Member item accordion behaviour (delegated) - simple, no fancy animation
    $(document).on('click', '.partners-popup-member-item', function(e) {
        const $item = $(this);
        const $container = $item.closest('.partners-popup-members');
        const $details = $item.find('.member-details');

        // Close others in same popup (no animation for snappier feel)
        $container.find('.member-details').not($details).hide();
        $container.find('.partners-popup-member-item').not($item).attr('aria-expanded', 'false');

        // Toggle current
        const isOpen = $details.is(':visible');
        $details.toggle();
        $item.attr('aria-expanded', isOpen ? 'false' : 'true');
        // Let CSS handle chevron rotation based on aria-expanded; clear any inline override
        $item.find('.member-biography .chevron').css('transform', '');
    });

    // Keyboard accessibility for member accordion
    $(document).on('keydown', '.partners-popup-member-item', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });

    // About read more toggle (delegated) - simple show/hide
    $(document).on('click keydown', '.partners-popup-read-more', function(e) {
        if (e.type === 'keydown' && !(e.key === 'Enter' || e.key === ' ')) return;
        e.preventDefault();
        const $btn = $(this);
        const $popupData = $btn.closest('.partners-popup-data');
        const $desc = $popupData.find('.partners-popup-description');
        const $truncated = $desc.find('.about-text-truncated');
        const $full = $desc.find('.about-text-full');
        if ($full.is(':visible')) {
            $full.hide();
            $truncated.show();
            $btn.find('span').text('Read more');
            $btn.removeClass('expanded');
        } else {
            $truncated.hide();
            $full.show();
            $btn.find('span').text('Read less');
            $btn.addClass('expanded');
        }
    });
}

/**
 * Initialize categories toggle functionality
 * Handles expanding/collapsing the categories section on the videos page
 */
function initCategoriesToggle() {
    const $categoriesHeader = $('[data-toggle="categories"]');
    const $categoriesContent = $('.categories-content');

    if ($categoriesHeader.length && $categoriesContent.length) {
        $categoriesHeader.on('click', function(e) {
            e.preventDefault();
            
            const $header = $(this);
            const $content = $categoriesContent;
            
            // Toggle collapsed state
            $header.toggleClass('collapsed');
            $content.toggleClass('collapsed');
            
            // Store state in localStorage for persistence
            const isCollapsed = $header.hasClass('collapsed');
            localStorage.setItem('categoriesCollapsed', isCollapsed);
        });
        
        // Restore state from localStorage on page load
        const wasCollapsed = localStorage.getItem('categoriesCollapsed') === 'true';
        if (wasCollapsed) {
            $categoriesHeader.addClass('collapsed');
            $categoriesContent.addClass('collapsed');
        }
    }
}

const documentHasScroll = function() {
    return window.innerHeight <= document.body.offsetHeight;
};

// Function to show the search form
function showSearchForm() {
    // Simple fade in with a pop effect
    $('#search').fadeIn(200);
    $('#search form').addClass('pop-in');
    
    // Clear any previous search text and focus the input
    $('#search input.search_input').val('').focus();
    
    $('body').addClass('search-open');
    
    // Prevent scrolling when search is open
    $('body').css('overflow', 'hidden');
    
    // Add event listener to close search when clicking outside
    $(document).on('click.searchClose', function(event) {
        const $search = $('#search form');
        const $searchToggle = $('#searchToggle');
        
        // If click is outside search container and not on search button
        if (!$search.is(event.target) && 
            $search.has(event.target).length === 0 && 
            !$searchToggle.is(event.target) && 
            $searchToggle.has(event.target).length === 0 &&
            !$(event.target).closest('.close-search').length) {
            hideSearchForm();
        }
    });
    
    // Add escape key handler
    $(document).on('keydown.searchEscape', function(e) {
        if (e.key === 'Escape') {
            hideSearchForm();
        }
    });
    
    // Add enter key handler to submit the form
    $('#search input.search_input').on('keydown.searchSubmit', function(e) {
        if (e.key === 'Enter') {
            $('#search form').submit();
        }
    });
}

// Function to hide the search form
function hideSearchForm() {
    // Simple fade out
    $('#search form').removeClass('pop-in');
    $('#search').fadeOut(200);
    
    $('body').removeClass('search-open');
    
    // Restore scrolling
    $('body').css('overflow', '');
    
    // Remove the document event listeners
    $(document).off('click.searchClose');
    $(document).off('keydown.searchEscape');
    $('#search input.search_input').off('keydown.searchSubmit');
}


/**
 * Open the partners popup
 * @param {number} partnerId - The ID of the partner to show
 */
function openPartnersPopup(partnerId) {
    const $popup = $('#partnersPopup');
    const $popupData = $(`#partnersPopupData_${partnerId}`);
    
    // Hide all popup data sections first
    $('.partners-popup-data').hide();
    
    // Show popup and specific partner data
    $popup.fadeIn(300);
    $popupData.show();
    $('body').addClass('popup-open');
    $('body').css('overflow', 'hidden');

    // Prepare About section truncation (255 chars, no word break)
    prepareAboutSection($popupData);
}

/**
 * Close the partners popup
 */
function closePartnersPopup() {
    const $popup = $('#partnersPopup');
    
    $popup.fadeOut(300);
    $('body').removeClass('popup-open');
    $('body').css('overflow', '');
    
    // Hide all popup data sections after animation
    setTimeout(function() {
        $('.partners-popup-data').hide();
    }, 300);
}

/**
 * Prepare About section: compute truncated text once per partner popup
 * @param {JQuery} $popupData
 */
function prepareAboutSection($popupData) {
    const $desc = $popupData.find('.partners-popup-description');
    if (!$desc.length || $desc.data('prepared')) return;

    const $full = $desc.find('.about-text-full');
    const $truncated = $desc.find('.about-text-truncated');
    const maxLength = 255;

    // Extract plain text for truncation
    const fullText = $full.text().trim();
    if (!fullText) {
        $truncated.hide();
        $full.show();
        $desc.data('prepared', true);
        return;
    }

    if (fullText.length <= maxLength) {
        $truncated.text(fullText).show();
        $full.hide();
        $popupData.find('.partners-popup-read-more').hide();
        $desc.data('prepared', true);
        return;
    }

    let truncated = fullText.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    if (lastSpace > 0) truncated = truncated.substring(0, lastSpace);
    truncated += '…';

    $truncated.text(truncated).show();
    $full.hide();
    $popupData.find('.partners-popup-read-more').attr('aria-expanded', 'false');
    $desc.data('prepared', true);
}

/**
 * Initialize video filtering functionality
 * Handles checkbox filtering for video categories
 */
function initVideoFiltering() {
    // Only initialize on videos page
    if (!$('.videos-page').length) {
        return;
    }
    
    // Handle category checkbox changes
    $('.category-input').on('change', function() {
        const $checkbox = $(this);
        const categoryId = $checkbox.data('category');
        
        // Handle "All" checkbox behavior
        if (categoryId === 'all') {
            if ($checkbox.is(':checked')) {
                $('.category-input').not($checkbox).prop('checked', false);
            }
        } else {
            if ($checkbox.is(':checked')) {
                $('.category-input[data-category="all"]').prop('checked', false);
            }
        }
        
        // If no checkboxes are selected, check "All"
        const checkedBoxes = $('.category-input:checked').length;
        if (checkedBoxes === 0) {
            $('.category-input[data-category="all"]').prop('checked', true);
        }
        
        // Perform Ajax request
        filterVideos();
    });
}

/**
 * Initialize project materials filtering functionality
 * Handles radio button filtering for project materials categories
 */
function initProjectMaterialsFiltering() {
    // Only initialize on project materials page
    if (!$('.project-materials-page').length || window.location.pathname.indexOf('/project-materials') === -1) {
        return;
    }
    
    // Initialize categories toggle functionality
    initProjectMaterialsCategoriesToggle();
    
    // Handle category radio button changes
    $('.project-category-input').on('change', function() {
        const $radio = $(this);
        const categoryId = $radio.data('category');
        
        // Ensure only one category is selected at a time
        $('.project-category-input').not($radio).prop('checked', false);
        
        // Filter project materials
        filterProjectMaterials();
    });
    
    // Set default selection to first category (Brand kit)
    $('.project-category-input[data-category="brand-kit"]').prop('checked', true);
    filterProjectMaterials();
}

/**
 * Initialize project materials categories toggle functionality
 */
function initProjectMaterialsCategoriesToggle() {
    const $categoriesHeader = $('.project-materials-page .categories .categories-header');
    const $categoriesContent = $categoriesHeader.siblings('.categories-content');
    
    if ($categoriesHeader.length && $categoriesContent.length) {
        $categoriesHeader.off('click.projectMaterials');
        
        $categoriesHeader.on('click.projectMaterials', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const $header = $(this);
            const $content = $categoriesContent;
            
            // Toggle collapsed state
            $header.toggleClass('collapsed');
            $content.toggleClass('collapsed');
            
            // Store state in localStorage for persistence
            const isCollapsed = $header.hasClass('collapsed');
            localStorage.setItem('projectMaterialsCategoriesCollapsed', isCollapsed);
        });
        
        // Restore state from localStorage on page load
        const wasCollapsed = localStorage.getItem('projectMaterialsCategoriesCollapsed') === 'true';
        if (wasCollapsed) {
            $categoriesHeader.addClass('collapsed');
            $categoriesContent.addClass('collapsed');
        }
    }
}

/**
 * Filter project materials based on selected category
 */
function filterProjectMaterials() {
    const selectedCategory = $('.project-category-input:checked').data('category');
    
    if (!selectedCategory) return;
    
    // Show/hide tab content based on selection
    $('.tab-content').each(function() {
        const $tab = $(this);
        const tabId = $tab.attr('id');
        
        if (tabId === selectedCategory) {
            $tab.show().addClass('active');
            // Force visibility and ensure content is displayed
            $tab.css({
                'display': 'block',
                'opacity': '1',
                'visibility': 'visible'
            });
        } else {
            $tab.hide().removeClass('active');
            $tab.css({
                'display': 'none',
                'opacity': '0',
                'visibility': 'hidden'
            });
        }
    });
    
}

/**
 * Filter videos based on selected categories
 */
function filterVideos() {
    const selectedCategories = [];
    
    $('.category-input:checked').each(function() {
        selectedCategories.push($(this).data('category'));
    });
    
    // Show loading state
    $('#video-container').html('<div class="text-center"><p>Loading videos...</p></div>');
    
    // Make Ajax request
    $.request('onFilterVideos', {
        data: {
            categories: selectedCategories
        },
        success: function(data) {
            $('#video-container').html(data.html);
        },
        error: function() {
            $('#video-container').html('<div class="text-center"><p>Error loading videos. Please try again.</p></div>');
        }
    });
}

/**
 * Initialize download dropdown functionality
 * Handles toggling download dropdowns for brand kit items
 */
function initDownloadDropdowns() {
    // Prevent multiple initializations
    if (window.__downloadDropdownInit) return;
    window.__downloadDropdownInit = true;

    function closeAll(except) {
        $('.download-dropdown.open').not(except).each(function() {
            const $dd = $(this);
            $dd.removeClass('open');
            const $btn = $dd.find('.btn-download');
            if ($btn.length) $btn.attr('aria-expanded', 'false');
        });
    }

    // Handle download button clicks
    $(document).on('click', '.download-dropdown .btn-download', function(e) {
        e.preventDefault();
        const $btn = $(this);
        const $wrapper = $btn.closest('.download-dropdown');
        const isOpen = $wrapper.hasClass('open');
        
        closeAll($wrapper);
        $wrapper.toggleClass('open', !isOpen);
        $btn.attr('aria-expanded', String(!isOpen));
    });

    // Close dropdowns when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.download-dropdown').length) {
            closeAll();
        }
    });

    // Close dropdowns with Escape key
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAll();
        }
    });
}