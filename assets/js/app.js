// Update width on window resize
let width = window.innerWidth;
$(window).resize(function() {
    width = window.innerWidth;
});

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

$(document).ready(function() {
    // $("nav").removeClass("no-transition");
	/* MENU */
	$('.navbar-nav').attr('id', 'menu'); // please don't remove this line
	$( '<div class="calendar-top"></div>' ).insertBefore( "#calendar" );
	$( '<div class="card-profile-top"></div>' ).insertBefore( ".card.profile.card-profile" );
	const divs = $(".card-profiles > div");
	for(let i = 0; i < divs.length; i+=2) {
		divs.slice(i, i+2).wrapAll( '<div class="col-xs" />');
	}

    // Make intro-items clickable
    $('.intro-item').on('click', function() {
        const href = $(this).data('href');
        if (href) {
            window.location.href = href;
        }
    });

    // Initialize tab functionality
    initTabs();
    
    // Initialize accordion functionality
    initAccordion();
    
    // Initialize partner content truncation
    initPartnerContentTruncation();
    
    // Initialize partner layout wrapping for larger screens
    if(width >= 1024 && $('#partners .key_0').length){
        // First column: items 0, 2, 4, 6, etc. (even numbers)
        $('#partners .key_0, #partners .key_2, #partners .key_4, #partners .key_6, #partners .key_8, #partners .key_10, #partners .key_12, #partners .key_14, #partners .key_16, #partners .key_18').wrapAll('<div class="col-md-6 col-xs-12" />');
        
        // Second column: items 1, 3, 5, 7, etc. (odd numbers)
        $('#partners .key_1, #partners .key_3, #partners .key_5, #partners .key_7, #partners .key_9, #partners .key_11, #partners .key_13, #partners .key_15, #partners .key_17, #partners .key_19').wrapAll('<div class="col-md-6 col-xs-12" />');
    }
    
    // Initialize news category tabs
    initNewsCategoryTabs();
    
    // Language toggle functionality
    $('.language-btn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
    });

    // Initialize hamburger menu dropdown functionality
    initHamburgerMenuDropdowns();
    
    // Initialize footer dropdown functionality
    initFooterDropdowns();
    
    // Initialize back to top functionality
    initBackToTop();
    
    // Search button functionality for both desktop and mobile
    $('#searchToggle, #searchToggleMobile').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showSearchForm();
    });

    // Prevent clicks on bottom elements from closing the menu
    $('.navbar-bottom-elements').on('click', function(e) {
        e.stopPropagation();
    });

    // Handle dropdown menu items
    $('.nav-item').children("a").each(function(){
        if($(this).attr('data-toggle') == 'dropdown'){
            $(this).removeAttr('data-toggle');
            $(this).on('click', function(e) {
                e.preventDefault();
                $(this).siblings('.dropdown-menu').toggleClass('show');
            });
        }
    });

    $("nav").removeClass("no-transition");

    // Menu toggle functionality
    $('#desktopMenuToggle').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Open the menu
        $('#headerNavbarNav').addClass('show').css({
            'right': '0',
            'opacity': '1',
            'visibility': 'visible'
        });
        
        // Hide the toggle button
        $(this).hide();
        
        $('body').addClass('menu-open');
    });
    
    // Close menu button functionality
    $('#closeMenuBtn').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close the menu
        $('#headerNavbarNav').removeClass('show').css({
            'right': '-300px',
            'opacity': '0',
            'visibility': 'hidden'
        });
        
        // Show the toggle button again
        $('#desktopMenuToggle').show();
        
        $('body').removeClass('menu-open');
    });

    // Close menu when clicking outside
    $(document).click(function(event) {
        const $navbarNav = $('#headerNavbarNav');
        const $desktopToggle = $('#desktopMenuToggle');
        const $closeBtn = $('#closeMenuBtn');
        
        // If navbar is visible and click is outside navbar and toggle buttons
        if ($navbarNav.hasClass('show') && 
            !$navbarNav.is(event.target) && 
            $navbarNav.has(event.target).length === 0 && 
            !$desktopToggle.is(event.target) && 
            $desktopToggle.has(event.target).length === 0 &&
            !$closeBtn.is(event.target) &&
            $closeBtn.has(event.target).length === 0) {
            
            $navbarNav.removeClass('show').css({
                'right': '-300px',
                'opacity': '0',
                'visibility': 'hidden'
            });
            
            // Show the toggle button again
            $('#desktopMenuToggle').show();
            
            $('body').removeClass('menu-open');
        }
    });

    // Prevent clicks on the menu from closing it
    $('#headerNavbarNav').on('click', function(e) {
        e.stopPropagation();
    });

    // Close dropdown menus when parent menu item is clicked again
    $('.nav-item.dropdown > a').on('click', function(e) {
        e.preventDefault();
        const $dropdownMenu = $(this).siblings('.dropdown-menu');
        
        if ($dropdownMenu.hasClass('show')) {
            $dropdownMenu.removeClass('show');
        } else {
            // Close all other open dropdowns first
            $('.dropdown-menu.show').removeClass('show');
            $dropdownMenu.addClass('show');
        }
    });

    $('.work_packages .accordion-content, .messages .accordion-toggle').each(function( index, value ) {
        $(value).find('a').attr( "onclick", "window.open(this.href, '_blank');" )
    });

    $('.nav-item').children("a").each(function(){
        if($(this).attr('data-toggle') == 'dropdown'){
            $(this).removeAttr('data-toggle')
        }
    });

    $("nav").removeClass("no-transition");

    if (window.location.hash) {
        const link = window.location.hash;
        const anchorId = link.substr(link.indexOf("#") + 1);
        if($("#"+anchorId).offset()){
            $('html, body').animate({
                scrollTop: $("#"+anchorId).offset().top - 150
            }, 500);
        }else{
            $('.accordion-border').each(function(){
                const title = $(this).find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
                const toggler = $(this).find(".accordion-toggle");
                if ( title.indexOf(anchorId.toUpperCase()) >= 0 && !toggler.next(".accordion-content").is(':visible') ){
                    $('html, body').animate({
                        scrollTop: toggler.parent().offset().top - 150
                    }, 500);
                    toggler.trigger( "click" );
                }
            });
        }
    }

    $('.dropdown a').click(function(event) {

        if (location.href.indexOf("#") != -1) {
            const link = $(this).attr('href');
            const anchorId = link.substr(link.indexOf("#") + 1);
            if($("#"+anchorId).length>0){
                $('html, body').animate({
                    scrollTop: $("#"+anchorId).offset().top - 150
                }, 500);
            }else{
                // event.preventDefault();
                $("g[title='"+anchorId.toUpperCase()+"']").addClass('active_path');

                $('.accordion-border').each(function(){
                    const title = $(this).find(".accordion-toggle .col-xs.start-xs").text().toUpperCase();
                    const toggler = $(this).find(".accordion-toggle");
                    if ( title.indexOf(anchorId.toUpperCase()) >= 0 && !toggler.next(".accordion-content").is(':visible') ){
                        $('html, body').animate({
                            scrollTop: toggler.parent().offset().top - 150
                        }, 500);
                        toggler.trigger( "click" );
                        event.preventDefault();
                    }
                });
            }
        }
    });

    onHashChange();
	$(window).on("hashchange", function() {
		onHashChange();
	});

	$('.see_all_partners_link').hide();

    $(".timeline_container.left .blue_line").width(function() {
        return (innerWidth - $('.container').width())/2;
    });


    $('.dorsal').click(function () {
        const link = $(this);
        const parag = link.parent().parent().find('p').first();
        const partner_desc = link.parent().parent().find('.partner_description').first();
        parag.toggleClass('expand', function() {
            if (parag.hasClass('expand')) {
                link.text('Read less');
                parag.slideDown(300);
            } else {
                link.text('Read more');
                // parag.slideUp(300);
            }

        });
        partner_desc.toggleClass('expand', function() {
            if (parag.hasClass('expand')) {
                link.text('Read less');
                parag.slideDown(300);
            } else {
                link.text('Read more');
                // parag.slideUp(300);
            }

        });

    });

    $('.library .form-wrapper, .library-items').wrapAll('<div class="container-fluid bg-secondary"><div class="container"></div></div>');
    $('.library .tabs').wrapAll('<div class="container"></div>');
    $('.library_content .row.center-xs.mb-1').wrapAll('<div class="container_relative"></div>');
    
    // Restructure library cards to match Figma design
    // restructureLibraryCards();

    if(width > 1024){
        $('.partners_list .key_0, .partners_list .key_2, .partners_list .key_4, .partners_list .key_6, .partners_list .key_8, .partners_list .key_10, .partners_list .key_12, .partners_list .key_14, .partners_list .key_16, .partners_list .key_18').wrapAll('<div class="col-md-6 col-xs-12"></div>');
        $('.partners_list .key_1, .partners_list .key_3, .partners_list .key_5, .partners_list .key_7, .partners_list .key_9, .partners_list .key_11, .partners_list .key_13, .partners_list .key_15, .partners_list .key_17, .partners_list .key_19').wrapAll('<div class="col-md-6 col-xs-12"></div>');
    }

    // Carousel slick for hero carousel
    if($('#hero-carousel').length){
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
                {
                    breakpoint: 1400,
                    settings: {
                        slidesToShow: 3,
                        centerPadding: '12%'
                    }
                },
                {
                    breakpoint: 1200,
                    settings: {
                        slidesToShow: 3,
                        centerPadding: '10%'
                    }
                },
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        centerPadding: '25%'
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 1,
                        centerPadding: '20%'
                    }
                }
            ]
        });
        
        // Remove any inline styles that might cause white backgrounds
        $('#hero-carousel .slick-slide').each(function() {
            $(this).css('background', 'transparent');
            $(this).find('div').css('background', 'transparent');
        });
    }
    
    // Initialize navbar scroll state on page load
    initNavbarScrollState();
    
    // Hide header navbar on scroll for desktop only
    let lastScrollTop = 0;
    const $headerNavbar = $('#headernavbar');
    const $backToTop = $('.back-to-top');
    let hasShownBackToTop = false;
    
    $(window).scroll(function() {
        const currentScrollTop = $(this).scrollTop();
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();
        const scrollPercent = currentScrollTop / (documentHeight - windowHeight);
        
        // Apply consistent colored background behavior for all devices
        if (currentScrollTop > 80) {
            // Add colored background to navbar when scrolled
            $headerNavbar.addClass('navbar-scrolled');
        } else {
            // Remove colored background when at top
            $headerNavbar.removeClass('navbar-scrolled');
        }
        
        // Show back-to-top button after significant scroll (all devices)
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
        
        // Update progress ring based on scroll percentage
        updateScrollProgress(scrollPercent);
        
        lastScrollTop = currentScrollTop;
    });
});

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
		    if(caseStudiesTitle === 'work-packages') {
		        initWorkPackagesToggle();
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

function initCircleAnimation(circleBorderSelector, containerSelector) {
    const circleBorder = document.querySelector(circleBorderSelector);
    if (!circleBorder) return;
    
    const imageContainer = document.querySelector(containerSelector);
    if (imageContainer) {
        imageContainer.addEventListener('mouseenter', function() {
            circleBorder.style.animationDirection = 'reverse';
        });
        
        imageContainer.addEventListener('mouseleave', function() {
            circleBorder.style.animationDirection = 'normal';
        });
    }
}

/**
 * Handles tab switching without page refreshes
 * This function initializes tab functionality for the about page
 */
function initTabs() {
    // Check if there's already an active tab content
    if ($('.tab-content.active').length === 0) {
        // No active tab found, activate the first tab
        const $activeTabLink = $('.tab-link.active');
        if ($activeTabLink.length > 0) {
            const firstTabId = $activeTabLink.data('tab');
            $('#' + firstTabId).addClass('active');
        }
    }
    
    // Hide all tab content except the active one on page load
    $('.tab-content').not('.active').css({
        'display': 'none',
        'opacity': '0'
    });
    
    // Make sure active tab is visible
    $('.tab-content.active').css({
        'display': 'block',
        'opacity': '1'
    });
    
    // Handle tab click events
    $('.tab-link').on('click', function(e) {
        e.preventDefault();
        
        // Get the tab id from data attribute
        const tabId = $(this).data('tab');
        
        // Remove active class from all tabs and add to clicked tab
        $('.tab-link').removeClass('active');
        $(this).addClass('active');
        
        // Hide all tab content immediately
        $('.tab-content').removeClass('active').css({
            'display': 'none',
            'opacity': '1'
        });
        
        // Show the active tab immediately
        $('#' + tabId).css('display', 'block').addClass('active');
        
        // If switching to work-packages tab, make sure accordion functionality is initialized
        if (tabId === 'work-packages') {
            // Reinitialize accordion if needed
            initAccordion();
            // Reinitialize work packages toggle
            initWorkPackagesToggle();
            
            // Re-wrap work package items if needed
            if (width >= 1024 && !$('#work-packages .key_0').parent().hasClass('col-md-4')) {
                // First column: items 0, 3, 6, 9, etc.
                $('#work-packages .key_0, #work-packages .key_3, #work-packages .key_6, #work-packages .key_9, #work-packages .key_12, #work-packages .key_15').wrapAll('<div class="col-md-4 col-xs-12" />');
                
                // Second column: items 1, 4, 7, 10, etc.
                $('#work-packages .key_1, #work-packages .key_4, #work-packages .key_7, #work-packages .key_10, #work-packages .key_13, #work-packages .key_16').wrapAll('<div class="col-md-4 col-xs-12" />');
                
                // Third column: items 2, 5, 8, 11, etc.
                $('#work-packages .key_2, #work-packages .key_5, #work-packages .key_8, #work-packages .key_11, #work-packages .key_14, #work-packages .key_17').wrapAll('<div class="col-md-4 col-xs-12" />');
            }
        }
        
        // If switching to partners tab, initialize content truncation
        if (tabId === 'partners') {
            initPartnerContentTruncation();
        }
        
        // Reinitialize project materials functionality for all tabs
        setTimeout(function() {
            initProjectMaterialsNameDisplay();
            initProjectMaterialsDropdowns();
        }, 100);
        
        if (history.pushState) {
            history.pushState(null, null, '#' + tabId);
        } else {
            location.hash = '#' + tabId;
        }
    });
    
    if (window.location.hash) {
        const tabId = window.location.hash.substring(1);
        $('.tab-link[data-tab="' + tabId + '"]').trigger('click');
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
 * Initialize work packages toggle functionality
 * This ensures the read more/less buttons work properly in the work packages section
 */
function initWorkPackagesToggle() {
    $('.read-more-wp').off('click');
    
    $('.read-more-wp').on('click', function() {
        toggleWorkPackage(this);
    });
}

/**
 * Toggle work package content visibility
 * @param {HTMLElement} element - The clicked "Read more" button
 */
function toggleWorkPackage(element) {
    const $button = $(element);
    const $workPackageBox = $button.closest('.work-package-box');
    const $content = $workPackageBox.find('.wp-content');
    
    if ($content.is(':visible')) {
        $button.removeClass('arrow-up');
        $content.hide();
        $button.text('Read more');
    } else {
        $button.addClass('arrow-up');
        $content.show();
        $button.text('Read less');
    }
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
    // Only initialize if we're on the news page and tabs exist
    if (!$('.news-category-tabs').length) {
        return;
    }
    
    // Handle tab click events
    $('.news-category-tabs .tab-link').on('click', function(e) {
        e.preventDefault();
        
        // Remove active class from all tabs
        $('.news-category-tabs .tab-link').removeClass('active');
        
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
    $('.news-category-tabs .tab-link').removeClass('active');
    $('.news-category-tabs .tab-link[data-category="' + currentCategoryId + '"]').addClass('active');
}

/**
 * Initialize footer dropdown functionality
 * Handles dropdown toggles in the footer menu with simple click behavior
 */
function initFooterDropdowns() {
    // Mark dropdown items that have submenus
    $('.footer-menu .footer-menu-item').each(function() {
        const $item = $(this);
        const $submenu = $item.find('.dropdown-menu');
        
        if ($submenu.length > 0) {
            $item.addClass('dropdown');
        }
    });
    
    // Handle dropdown clicks
    $('.footer-menu .footer-menu-item.dropdown > a').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const $parentItem = $(this).parent();
        const $dropdownMenu = $parentItem.find('.dropdown-menu');
        
        if ($dropdownMenu.length) {
            // Close all other footer dropdowns first
            $('.footer-menu .footer-menu-item.dropdown').not($parentItem).removeClass('active');
            $('.footer-menu .dropdown-menu').not($dropdownMenu).removeClass('show');
            
            // Toggle current dropdown
            $parentItem.toggleClass('active');
            $dropdownMenu.toggleClass('show');
        }
    });
    
    // Close dropdowns when clicking outside
    $(document).on('click.footerDropdown', function(e) {
        if (!$(e.target).closest('.footer-menu').length) {
            $('.footer-menu .footer-menu-item.dropdown').removeClass('active');
            $('.footer-menu .dropdown-menu').removeClass('show');
        }
    });
    
    // Prevent dropdown menu clicks from closing the dropdown
    $('.footer-menu .dropdown-menu').on('click', function(e) {
        e.stopPropagation();
    });
    
    // Allow dropdown menu links to work normally
    $('.footer-menu .dropdown-menu a').on('click', function(e) {
        // Don't prevent default - let the link work normally
        // Just close the dropdown after a short delay
        setTimeout(function() {
            $('.footer-menu .footer-menu-item.dropdown').removeClass('active');
            $('.footer-menu .dropdown-menu').removeClass('show');
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