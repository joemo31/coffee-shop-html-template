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

    // Hero carousel — replay caption animation on slide change
    if ($("#blog-carousel").length && !prefersReducedMotion) {
        $("#blog-carousel").on("slid.bs.carousel", function () {
            var $lines = $(this).find(".carousel-item.active .hero-line");
            $lines.css("animation", "none");
            $lines.each(function () {
                void this.offsetWidth;
            });
            $lines.css("animation", "");
        });
    }

    // Scroll reveal
    if (!prefersReducedMotion && "IntersectionObserver" in window) {
        var revealSelectors = [
            ".section-title",
            ".row.align-items-center",
            ".testimonial-item",
            ".col-lg-4.py-0",
            ".col-lg-4.py-5",
            ".reveal-stagger"
        ].join(", ");

        document.querySelectorAll(revealSelectors).forEach(function (el) {
            if (!el.classList.contains("reveal-stagger")) {
                el.classList.add("reveal");
            }
        });

        var revealObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var el = entry.target;
                    if (el.classList.contains("reveal-stagger")) {
                        el.classList.add("reveal-visible");
                    } else {
                        el.classList.add("reveal-visible");
                    }
                    revealObserver.unobserve(el);
                });
            },
            { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );

        document.querySelectorAll(".reveal, .reveal-stagger").forEach(function (el) {
            revealObserver.observe(el);
        });

        // Animated stat counters
        var countersStarted = false;
        var statsObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting || countersStarted) return;
                    countersStarted = true;
                    document.querySelectorAll(".stat-number").forEach(function (counter) {
                        var target = parseInt(counter.getAttribute("data-count"), 10);
                        var duration = 1800;
                        var start = 0;
                        var startTime = null;

                        function step(timestamp) {
                            if (!startTime) startTime = timestamp;
                            var progress = Math.min((timestamp - startTime) / duration, 1);
                            var eased = 1 - Math.pow(1 - progress, 3);
                            counter.textContent = Math.floor(start + (target - start) * eased);
                            if (progress < 1) {
                                requestAnimationFrame(step);
                            } else {
                                counter.textContent = target;
                            }
                        }
                        requestAnimationFrame(step);
                    });
                    statsObserver.disconnect();
                });
            },
            { threshold: 0.3 }
        );

        var statsSection = document.querySelector(".stats-section");
        if (statsSection) {
            statsObserver.observe(statsSection);
        }
    } else {
        document.querySelectorAll(".stat-number").forEach(function (counter) {
            counter.textContent = counter.getAttribute("data-count");
        });
        document.querySelectorAll(".reveal-stagger").forEach(function (el) {
            el.classList.add("reveal-visible");
        });
    }

    // Close mobile menu after nav link click
    $(".navbar-nav .nav-link:not(.dropdown-toggle)").on("click", function () {
        if ($(window).width() < 992) {
            $("#navbarCollapse").collapse("hide");
        }
    });
})(jQuery);
