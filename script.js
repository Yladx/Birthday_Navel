// Balloon effect for birthday page
function random(num) {
  return Math.floor(Math.random() * num);
}

function getRandomStyles() {
  var r = random(255);
  var g = random(255);
  var b = random(255);
  var mt = random(200);
  var ml = random(50);
  var dur = random(5) + 5;
  return `
  background-color: rgba(${r},${g},${b},0.7);
  color: rgba(${r},${g},${b},0.7); 
  box-shadow: inset -7px -3px 10px rgba(${r - 10},${g - 10},${b - 10},0.7);
  margin: ${mt}px 0 0 ${ml}px;
  animation: float ${dur}s ease-in infinite
  `;
}

function createBalloons(num) {
  const balloonContainer = document.getElementById("balloon-container");
  if (!balloonContainer) return;
  for (var i = num; i > 0; i--) {
    var balloon = document.createElement("div");
    balloon.className = "balloon";
    balloon.style.cssText = getRandomStyles();
    balloonContainer.append(balloon);
  }
}

function removeBalloons() {
  const balloonContainer = document.getElementById("balloon-container");
  if (!balloonContainer) return;
  balloonContainer.style.opacity = 0;
  setTimeout(() => {
    balloonContainer.innerHTML = "";
    balloonContainer.style.opacity = 1;
  }, 500);
}

// Only run balloon effect on birthday page
function setupBalloons() {
  if (document.getElementById('birthday-page')) {
    createBalloons(30);
    window.addEventListener("click", removeBalloons, { once: true });
  }
}

// Enhanced page transition functionality
function showPage(pageId) {
  const currentPage = document.querySelector('.page.active');
  const targetPage = document.getElementById(pageId);

  // Handle background music for birthday page
  const birthdayMusic = document.getElementById('birthday-bg-music');
  if (birthdayMusic) {
    if (pageId === 'birthday-page') {
      birthdayMusic.play();
    } else {
      birthdayMusic.pause();
      birthdayMusic.currentTime = 0;
    }
  }

  // Remove balloons when leaving birthday page
  if (pageId !== 'birthday-page') {
    removeBalloons();
  }

  if (currentPage) {
    // Add exit animation to current page
    currentPage.classList.add('prev');
    currentPage.classList.remove('active');
  }

  // Small delay for dramatic effect
  setTimeout(() => {
    // Show target page
    targetPage.classList.add('active');

    // If showing letter page, load the message
    if (pageId === 'letter-page') {
      loadMessage();
    }
    // If returning to birthday page, recreate balloons
    if (pageId === 'birthday-page') {
      createBalloons(30);
    }
  }, 300);
}

function loadMessage() {
  fetch('message.json')
    .then(response => response.json())
    .then(data => {
      const messageEl = document.getElementById('anniversary-message');
      messageEl.textContent = data.message;
      if (data.signature) {
        document.getElementById('signature').innerHTML = `With all my love,<br>${data.signature}`;
      }
    })
    .catch(() => {
      document.getElementById('anniversary-message').textContent = 'Happy Birthday!';
    });
}

// Audio functionality
function setupAudio() {
  const audioBtn = document.getElementById('play-audio');
  const audio = document.getElementById('background-music');
  const audioText = document.querySelector('.audio-text');
  const audioIcon = document.querySelector('.audio-icon');

  if (audioBtn && audio) {
    audioBtn.addEventListener('click', function() {
      if (audio.paused) {
        audio.play();
        audioText.textContent = 'Pause Music';
        audioIcon.textContent = '⏸️';
      } else {
        audio.pause();
        audioText.textContent = 'Play Music';
        audioIcon.textContent = '🎵';
      }
    });
  }
}

// Add enhanced click event to birthday page
document.addEventListener('DOMContentLoaded', function() {
  const birthdayPage = document.getElementById('birthday-page');
  const birthdayMusic = document.getElementById('birthday-bg-music');
  let musicStarted = false;

  // Add click event to the entire birthday page
  birthdayPage.addEventListener('click', function(e) {
    // Prevent any default behavior
    e.preventDefault();
    e.stopPropagation();

    // Start music on first click if not already started (for autoplay policy)
    if (birthdayMusic && !musicStarted) {
      birthdayMusic.play();
      musicStarted = true;
    }

    // Add click animation to title
    const title = document.querySelector('.birthday-title');
    title.style.transform = 'scale(0.95)';

    setTimeout(() => {
      title.style.transform = 'scale(1)';
      showPage('letter-page');
    }, 150);
  });

  // Add hover effects
  birthdayPage.addEventListener('mouseenter', function() {
    const title = document.querySelector('.birthday-title');
    title.style.transform = 'scale(1.05)';
  });

  birthdayPage.addEventListener('mouseleave', function() {
    const title = document.querySelector('.birthday-title');
    title.style.transform = 'scale(1)';
  });

  // Setup audio functionality
  setupAudio();
  // Setup balloons
  setupBalloons();
}); 