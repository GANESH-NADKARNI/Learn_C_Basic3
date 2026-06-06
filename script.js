// Progress tracking
let completedSections = new Set();
let totalSections = 4;

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    updateProgress();
    // Open first section always
    toggleSection('intro');
});

// Toggle section visibility
function toggleSection(sectionId) {
    const section = document.querySelector(`[data-section="${sectionId}"]`);
    const content = section.querySelector('.section-content');
    const arrow = section.querySelector('.toggle-arrow');
    
    if (content.classList.contains('active')) {
        content.classList.remove('active');
        content.style.display = 'none';
        arrow.style.transform = 'rotate(0deg)';
    } else {
        // Close all other sections
        document.querySelectorAll('.section-content').forEach(sc => {
            sc.classList.remove('active');
            sc.style.display = 'none';
        });
        document.querySelectorAll('.toggle-arrow').forEach(ta => {
            ta.style.transform = 'rotate(0deg)';
        });
        
        // Open current section
        content.classList.add('active');
        content.style.display = 'block';
        arrow.style.transform = 'rotate(180deg)';
        
        // Mark as completed
        completedSections.add(sectionId);
        updateProgress();
        
        // Scroll to section
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update progress bar
function updateProgress() {
    const progress = (completedSections.size / totalSections) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = progress + '%';
    progressText.textContent = Math.round(progress) + '% Complete';
}

// Run code examples
function runCode(type) {
    const outputBox = document.getElementById(`output-${type}`);
    const outputPre = outputBox.querySelector('pre');
    
    let output = '';
    
    switch(type) {
        case 'variables':
            output = `Age: 25
Height: 5.9
Grade: A`;
            break;
            
        case 'loops':
            output = `Counting from 1 to 5:
1 2 3 4 5 `;
            break;
            
        case 'functions':
            output = `10 + 20 = 30
5 + 15 = 20`;
            break;
    }
    
    // Animate output appearance
    outputBox.style.display = 'block';
    outputPre.textContent = '';
    
    // Typewriter effect
    let i = 0;
    const typeWriter = () => {
        if (i < output.length) {
            outputPre.textContent += output.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    
    setTimeout(typeWriter, 200);
}

// Check quiz answers
function checkAnswer(questionName, correctAnswer) {
    const selectedOption = document.querySelector(`input[name="${questionName}"]:checked`);
    const resultDiv = document.getElementById(`result-${questionName}`);
    
    if (!selectedOption) {
        resultDiv.textContent = 'Please select an answer!';
        resultDiv.className = 'result incorrect';
        return;
    }
    
    if (selectedOption.value === correctAnswer) {
        resultDiv.textContent = '✅ Correct! Well done!';
        resultDiv.className = 'result correct';
        
        // Add celebration effect
        createCelebrationEffect(resultDiv);
    } else {
        resultDiv.textContent = '❌ Incorrect. Try again!';
        resultDiv.className = 'result incorrect';
    }
    
    // Animate result appearance
    resultDiv.style.opacity = '0';
    resultDiv.style.transform = 'translateY(10px)';
    setTimeout(() => {
        resultDiv.style.transition = 'all 0.3s ease';
        resultDiv.style.opacity = '1';
        resultDiv.style.transform = 'translateY(0)';
    }, 100);
}

// Create celebration effect for correct answers
function createCelebrationEffect(element) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'];
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.position = 'absolute';
            confetti.style.width = '6px';
            confetti.style.height = '6px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.borderRadius = '50%';
            confetti.style.pointerEvents = 'none';
            confetti.style.zIndex = '1000';
            
            const rect = element.getBoundingClientRect();
            confetti.style.left = (rect.left + Math.random() * rect.width) + 'px';
            confetti.style.top = rect.top + 'px';
            
            document.body.appendChild(confetti);
            
            // Animate confetti
            confetti.animate([
                { transform: 'translateY(0px) rotate(0deg)', opacity: 1 },
                { transform: `translateY(${Math.random() * 100 + 50}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => confetti.remove();
        }, i * 100);
    }
}

// Add smooth scrolling for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.classList.contains('section-header')) {
        e.target.click();
    }
});

// Add loading animation for code execution
function addLoadingAnimation(buttonElement) {
    const originalText = buttonElement.textContent;
    buttonElement.textContent = 'Running...';
    buttonElement.disabled = true;
    
    setTimeout(() => {
        buttonElement.textContent = originalText;
        buttonElement.disabled = false;
    }, 1000);
}

// Enhanced run code function with loading
const originalRunCode = runCode;
runCode = function(type) {
    const button = event.target;
    addLoadingAnimation(button);
    setTimeout(() => originalRunCode(type), 500);
};