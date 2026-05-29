(function ($) {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Navbar dropdown on desktop hover only
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $(".navbar .dropdown")
                    .on("mouseenter.navbarHover", function () {
                        $(".dropdown-toggle", this).trigger("click");
                    })
                    .on("mouseleave.navbarHover", function () {
                        $(".dropdown-toggle", this).trigger("click").blur();
                    });
            } else {
                $(".navbar .dropdown").off("mouseenter.navbarHover mouseleave.navbarHover");
            }
        }
        toggleNavbarMethod();
        $(window).on("resize", toggleNavbarMethod);
    });

    // Sticky navbar on scroll
    var $navBar = $(".container-fluid.nav-bar");
    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 80) {
            $navBar.addClass("nav-scrolled");
        } else {
            $navBar.removeClass("nav-scrolled");
        }
    });

    // Back to top
    var $backToTop = $(".back-to-top");
    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 100) {
            $backToTop.addClass("show");
        } else {
            $backToTop.removeClass("show");
        }
    });
    $backToTop.on("click", function (e) {
        e.preventDefault();
        if (prefersReducedMotion) {
            window.scrollTo(0, 0);
        } else {
            $("html, body").animate({ scrollTop: 0 }, 800, "easeInOutExpo");
        }
    });

    // Date and time picker (only when present)
    if ($(".date").length) {
        $(".date").datetimepicker({ format: "L" });
    }
    if ($(".time").length) {
        $(".time").datetimepicker({ format: "LT" });
    }

    // Testimonials carousel
    if ($(".testimonial-carousel").length) {
        $(".testimonial-carousel").owlCarousel({
            autoplay: true,
            autoplayTimeout: 5000,
            smartSpeed: 1500,
            margin: 30,
            dots: true,
            loop: true,
            center: true,
            responsive: {
                0: { items: 1 },
                576: { items: 1 },
                768: { items: 2 },
                992: { items: 3 }
            }
        });
    }

    // Scroll reveal
    if (!prefersReducedMotion && "IntersectionObserver" in window) {
        var revealTargets = document.querySelectorAll(
            ".section-title, .row.align-items-center, .testimonial-item, .col-lg-4.py-0, .col-lg-4.py-5"
        );
        revealTargets.forEach(function (el) {
            el.classList.add("reveal");
        });

        var observer = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        document.querySelectorAll(".reveal").forEach(function (el) {
            observer.observe(el);
        });
    }

    // Close mobile menu after nav link click
    $(".navbar-nav .nav-link:not(.dropdown-toggle)").on("click", function () {
        if ($(window).width() < 992) {
            $("#navbarCollapse").collapse("hide");
        }
    });
})(jQuery);
