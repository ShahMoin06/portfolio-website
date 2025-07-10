// Theme Toggle
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

// Initialize theme
if (localStorage.getItem('theme') === 'dark') {
  root.setAttribute('data-theme', 'dark');
}

themeToggle?.addEventListener('click', () => {
  const isDark = root.getAttribute('data-theme') === 'dark';
  root.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

// Mobile Menu
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const navLinksItems = document.querySelectorAll('.nav-link');

mobileMenuBtn?.addEventListener('click', () => {
  mobileMenuBtn.classList.toggle('active');
  navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!navLinks?.contains(e.target) && !mobileMenuBtn?.contains(e.target)) {
    mobileMenuBtn?.classList.remove('active');
    navLinks?.classList.remove('active');
  }
});

// Active link highlighting
function setActiveLink() {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Scroll Progress Indicator
function updateScrollIndicator() {
  const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (window.scrollY / windowHeight) * 100;
  document.querySelector('.scroll-indicator').style.width = `${scrolled}%`;
}

// Smooth Scroll with offset
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const href = this.getAttribute('href');
    const offsetTop = document.querySelector(href).offsetTop - 100;

    scroll({
      top: offsetTop,
      behavior: 'smooth'
    });

    // Close mobile menu after clicking
    mobileMenuBtn?.classList.remove('active');
    navLinks?.classList.remove('active');
  });
});

// Scroll event listeners
window.addEventListener('scroll', () => {
  setActiveLink();
  updateScrollIndicator();
});

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false
});

// Prevent form submission refresh
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Add form handling logic here
  });
}); 