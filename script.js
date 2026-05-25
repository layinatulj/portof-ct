document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    loadComponents();
    initScrollAnimations();
    initBackToTop();
});

/* ==========================================================================
   COMPONENT LOADERS (NAVBAR & FOOTER)
   ========================================================================== */
async function loadComponents() {
    try {
        // Load Navbar
        const navRes = await fetch('navbar.html');
        if (navRes.ok) {
            document.getElementById('navbar-placeholder').innerHTML = await navRes.text();
            initNavbarLogic();
            setActiveNavLink();
            initThemeToggle();
        }

        // Load Footer
        const footRes = await fetch('footer.html');
        if (footRes.ok) {
            document.getElementById('footer-placeholder').innerHTML = await footRes.text();
        }
    } catch (error) {
        console.error("Error loading components:", error);
    }
}

/* ==========================================================================
   NAVBAR UI LOGIC & THEME TOGGLE
   ========================================================================== */
function initNavbarLogic() {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");

    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });

        // Close menu on link click
        document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        }));
    }
}

function setActiveNavLink() {
    const activePage = document.documentElement.getAttribute("data-page");
    const navLinks = document.querySelectorAll(".nav-link");
    
    navLinks.forEach(link => {
        if (link.getAttribute("data-page") === activePage) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });
}

function initThemeToggle() {
    const toggleBtn = document.getElementById("theme-toggle");
    const currentTheme = localStorage.getItem("theme") || "light";

    // Set initial theme
    document.documentElement.setAttribute("data-theme", currentTheme);

    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            let theme = document.documentElement.getAttribute("data-theme");
            let newTheme = theme === "dark" ? "light" : "dark";
            
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
        });
    }
}

/* ==========================================================================
   PAGE FEATURE INITIALIZERS
   ========================================================================== */
function initLoader() {
    const loader = document.getElementById("loader");
    if (loader) {
        // Dioptimalkan: Menghilangkan blocking window.load eksternal.
        // Menutup loading screen secara instan tak lama setelah DOM siap.
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
                
                // Memicu inisialisasi fitur spesifik halaman berdasarkan atribut data-page
                const activePage = document.documentElement.getAttribute("data-page");
                if (activePage === 'infografis') initLightbox();
                if (activePage === 'artefak') initAccordion();
                if (activePage === 'refleksi') initTimelineAnimation();
            }, 500); // Durasi transisi fade-out animasi CSS
        }, 250); // Delay kosmetik (250ms) agar transisi awal terasa smooth
    }
}

function initBackToTop() {
    const bttBtn = document.getElementById("back-to-top");
    if (bttBtn) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                bttBtn.style.display = "flex";
            } else {
                bttBtn.style.display = "none";
            }
        });
        bttBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}

/* Lightbox Feature (Page: Infografis) */
function initLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const captionText = document.getElementById("lightbox-caption");
    const closeBtn = document.querySelector(".lightbox-close");
    
    document.querySelectorAll(".lightbox-trigger").forEach(img => {
        img.addEventListener("click", () => {
            lightbox.classList.add("show");
            lightboxImg.src = img.getAttribute("data-full") || img.src;
            captionText.innerHTML = img.alt;
        });
    });

    if (closeBtn && lightbox) {
        closeBtn.addEventListener("click", () => lightbox.classList.remove("show"));
        lightbox.addEventListener("click", (e) => {
            if (e.target !== lightboxImg && e.target !== captionText) {
                lightbox.classList.remove("show");
            }
        });
    }
}

/* Accordion Feature (Page: Artefak) */
function initAccordion() {
    const headers = document.querySelectorAll(".accordion-header");
    
    headers.forEach(header => {
        header.addEventListener("click", function() {
            const content = this.nextElementSibling;
            const icon = this.querySelector(".accordion-icon");
            
            // Close other items if desired (Optional Single-Expand feature)
            document.querySelectorAll(".accordion-content").forEach(item => {
                if (item !== content && item.style.maxHeight) {
                    item.style.maxHeight = null;
                    item.previousElementSibling.querySelector(".accordion-icon").style.transform = "rotate(0deg)";
                }
            });

            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                icon.style.transform = "rotate(0deg)";
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
                icon.style.transform = "rotate(180deg)";
            }
        });
    });
}

/* Timeline & Scroll Animations */
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll(".timeline-item");
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach(item => observer.observe(item));
}

function initScrollAnimations() {
    // Menambahkan kelas fade-in ke elemen penampung utama secara dinamis
    const mainContent = document.querySelector("main");
    if (mainContent) {
        mainContent.classList.add("fade-in-element");
        setTimeout(() => mainContent.classList.add("is-visible"), 150);
    }
}

function openPDF(link){
    document.getElementById("pdfFrame").src=link;
    document.getElementById("pdfModal").style.display="block";
}

function closePDF(){
    document.getElementById("pdfModal").style.display="none";
    document.getElementById("pdfFrame").src="";
}