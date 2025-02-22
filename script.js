document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');
    const examContainer = document.getElementById('exam-container');
    const popup = document.getElementById('popup');
    const proceedBtn = document.getElementById('proceed-btn');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const questionContainer = document.getElementById('question-container');
    const timerDisplay = document.getElementById('timer');

    let examStarted = false;
    let currentQuestionIndex = 0;
    let timeLeft = 60;
    let timer;

    const questions = [
        "What is the capital of France?",
        "What is 2 + 2?",
        "Who wrote 'To Kill a Mockingbird'?"
    ];

    const answers = ["Paris", "4", "Harper Lee"];

    proceedBtn.addEventListener('click', function() {
        popup.style.display = 'block';
    });

    noBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    yesBtn.addEventListener('click', function() {
        popup.style.display = 'none';
        registrationForm.style.display = 'none';
        examContainer.style.display = 'block';
        startExam();
    });

    function startExam() {
        examStarted = true;
        loadQuestion();
        startTimer();
    }

    function loadQuestion() {
        if (currentQuestionIndex < questions.length) {
            questionContainer.innerHTML = `<p>${questions[currentQuestionIndex]}</p>`;
            timeLeft = 60;
            timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
        } else {
            endExam();
        }
    }

    function startTimer() {
        timer = setInterval(function() {
            timeLeft--;
            timerDisplay.textContent = `Time left: ${timeLeft} seconds`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                currentQuestionIndex++;
                loadQuestion();
            }
        }, 1000);
    }

    function endExam() {
        clearInterval(timer);
        examContainer.innerHTML = "<h2>Thank you! You have successfully completed the exam.</h2>";
    }

    // Prevent copying and right-clicking
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    document.addEventListener('copy', function(e) {
        e.preventDefault();
    });

    // Record IP and prevent multiple submissions
    function getIP() {
        fetch('https://api.ipify.org?format=json')
            .then(response => response.json())
            .then(data => {
                localStorage.setItem('userIP', data.ip);
            });
    }

    if (localStorage.getItem('userIP')) {
        examContainer.innerHTML = "<h2>Thank you! You have successfully completed the exam.</h2>";
    } else {
        getIP();
    }

    // Handle page refresh
    window.addEventListener('beforeunload', function() {
        if (examStarted) {
            localStorage.setItem('timeLeft', timeLeft);
            localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
        }
    });

    window.addEventListener('load', function() {
        if (localStorage.getItem('timeLeft')) {
            timeLeft = parseInt(localStorage.getItem('timeLeft'));
            currentQuestionIndex = parseInt(localStorage.getItem('currentQuestionIndex'));
            startExam();
        }
    });
});
