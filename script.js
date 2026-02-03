// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Scroll to roadmap function
function scrollToRoadmap() {
    const roadmap = document.getElementById('roadmap');
    if (roadmap) {
        roadmap.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Progress tracking (stored in localStorage)
let progressData = {
    'months-1-3': 0,
    'months-4-6': 0,
    'months-7-9': 0,
    'months-10-12': 0,
    overallProgress: 0,
    weeksCompleted: 0,
    topicsMastered: 0
};

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('calculusProgress');
    if (saved) {
        progressData = JSON.parse(saved);
        updateProgressDisplay();
    }
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('calculusProgress', JSON.stringify(progressData));
}

// Update progress bars and stats
function updateProgressDisplay() {
    // Update timeline progress bars
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        const progressBar = item.querySelector('.progress');
        if (progressBar) {
            const monthKey = `months-${index * 3 + 1}-${(index + 1) * 3}`;
            const progress = progressData[monthKey] || 0;
            progressBar.style.width = progress + '%';
        }
    });

    // Update stats
    const statCards = document.querySelectorAll('.stat-card h3');
    if (statCards.length >= 3) {
        statCards[0].textContent = progressData.overallProgress + '%';
        statCards[1].textContent = progressData.weeksCompleted + '/52';
        statCards[2].textContent = progressData.topicsMastered;
    }
}

// Add click handlers for timeline items to update progress
document.addEventListener('DOMContentLoaded', function() {
    loadProgress();
    
    // Add animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe timeline items
    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(item);
    });

    // Observe topic cards
    document.querySelectorAll('.topic-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Add click handlers to timeline items for progress tracking
    document.querySelectorAll('.timeline-item').forEach((item, index) => {
        item.addEventListener('click', function() {
            const monthKey = ['months-1-3', 'months-4-6', 'months-7-9', 'months-10-12'][index];
            if (monthKey) {
                // Cycle through progress: 0 -> 25 -> 50 -> 75 -> 100
                let currentProgress = progressData[monthKey];
                progressData[monthKey] = (currentProgress + 25) % 125;
                if (progressData[monthKey] === 0 && currentProgress > 0) {
                    progressData[monthKey] = 0;
                }
                
                // Update overall progress
                const avgProgress = (
                    progressData['months-1-3'] + 
                    progressData['months-4-6'] + 
                    progressData['months-7-9'] + 
                    progressData['months-10-12']
                ) / 4;
                progressData.overallProgress = Math.round(avgProgress);
                progressData.weeksCompleted = Math.round((avgProgress / 100) * 52);
                progressData.topicsMastered = Math.round((avgProgress / 100) * 24); // 24 main topics
                
                saveProgress();
                updateProgressDisplay();
            }
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    } else {
        navbar.style.padding = '1rem 0';
        navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    }
});

// Add particle effect to hero section (optional enhancement)
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            top: ${Math.random() * 100}%;
            left: ${Math.random() * 100}%;
            animation: float ${5 + Math.random() * 10}s ease-in-out infinite;
        `;
        hero.appendChild(particle);
    }
    
    // Add particle animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0) translateX(0);
            }
            50% {
                transform: translateY(-20px) translateX(10px);
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize particles on load
window.addEventListener('load', createParticles);
