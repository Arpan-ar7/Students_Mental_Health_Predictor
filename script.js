// Create floating particles
const particlesContainer = document.getElementById('particles');
for (let i = 0; i < 30; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = (10 + Math.random() * 20) + 's';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.width = (2 + Math.random() * 4) + 'px';
    particle.style.height = particle.style.width;
    particlesContainer.appendChild(particle);
}

// Range slider updates
document.getElementById('usageRange').addEventListener('input', function() {
    document.getElementById('usageValue').textContent = this.value;
});

document.getElementById('studyRange').addEventListener('input', function() {
    document.getElementById('studyValue').textContent = this.value;
});

document.getElementById('activityRange').addEventListener('input', function() {
    document.getElementById('activityValue').textContent = this.value;
});

document.getElementById('sleepRange').addEventListener('input', function() {
    document.getElementById('sleepValue').textContent = this.value;
});

// Form submission
document.getElementById('predictForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    const resultCard = document.getElementById('resultCard');
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Convert numeric fields
    data.Age = parseInt(data.Age);
    data.Avg_Daily_Usage_Hours = parseFloat(data.Avg_Daily_Usage_Hours);
    data.Daily_Unlocks = parseInt(data.Daily_Unlocks);
    data.Study_Hours = parseFloat(data.Study_Hours);
    data.Physical_Activity_Hours = parseFloat(data.Physical_Activity_Hours);
    data.Sleep_Hours_Per_Night = parseFloat(data.Sleep_Hours_Per_Night);

    btn.classList.add('loading');
    btn.innerHTML = 'Analyzing... <i class="fas fa-spinner fa-spin"></i>';

    try {
        console.log('Sending data:', JSON.stringify(data));

        const response = await fetch('http://127.0.0.1:2200/predict', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(data)
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error:', errorText);
            throw new Error('Server returned ' + response.status + ': ' + errorText);
        }

        const result = await response.json();
        console.log('Received result:', result);

        const score = result.predicted_mental_health_score;

        // Show result
        resultCard.classList.add('show');

        // Animate score
        animateScore(score);

        // Set message based on score
        const msgEl = document.getElementById('resultMessage');
        const descEl = document.getElementById('resultDesc');
        const scoreText = document.getElementById('scoreText');
        const progressRing = document.getElementById('progressRing');

        let color, message, desc;
        if (score >= 70) {
            color = '#10b981';
            message = 'Excellent Mental Health!';
            desc = 'Your digital habits support great mental wellness. Keep maintaining this healthy balance!';
        } else if (score >= 50) {
            color = '#f59e0b';
            message = 'Moderate Mental Health';
            desc = "You're doing okay, but there's room for improvement. Consider reducing screen time and increasing physical activity.";
        } else {
            color = '#ef4444';
            message = 'Mental Health Needs Attention';
            desc = 'Your current habits may be impacting your mental health. Try to limit social media use, improve sleep, and seek support if needed.';
        }

        scoreText.style.color = color;
        progressRing.style.stroke = color;
        msgEl.textContent = message;
        msgEl.style.color = color;
        descEl.textContent = desc;

        // Scroll to result
        resultCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
        console.error('Error:', error);
        showToast('Error: ' + error.message);
    } finally {
        btn.classList.remove('loading');
        btn.innerHTML = 'Analyze My Mental Health <i class="fas fa-arrow-right"></i>';
    }
});

function animateScore(targetScore) {
    const scoreText = document.getElementById('scoreText');
    const progressRing = document.getElementById('progressRing');
    const circumference = 2 * Math.PI * 90;

    let current = 0;
    const duration = 1500;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOut = 1 - Math.pow(1 - progress, 3);
        current = Math.round(targetScore * easeOut);

        scoreText.textContent = current;

        const offset = circumference - (current / 100) * circumference;
        progressRing.style.strokeDashoffset = offset;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
}