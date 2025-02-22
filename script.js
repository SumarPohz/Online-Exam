document.addEventListener('DOMContentLoaded', function() {
    const registrationForm = document.getElementById('registration-form');
    const examContainer = document.getElementById('exam-container');
    const popup = document.getElementById('popup');
    const proceedBtn = document.getElementById('proceed-btn');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const questionContainer = document.getElementById('question-container');
    const timerDisplay = document.getElementById('timer');
    const celebrationPopup = document.getElementById('celebration-popup');

    let examStarted = false;
    let currentQuestionIndex = 0;
    let timeLeft = 1200; // Total time for all questions (1200 seconds = 20 minutes)
    let timer;
    let score = 0;

    const questions = [
        // Questions and answers as provided earlier
    ];

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
            const currentQuestion = questions[currentQuestionIndex];
            let optionsHtml = currentQuestion.options.map(option => `
                <label>
                    <input type="${currentQuestion.isMultipleChoice ? 'checkbox' : 'radio'}" name="answer" value="${option.charAt(0)}">
                    ${option}
                </label><br>
            `).join('');

            questionContainer.innerHTML = `
                <p><strong>Question ${currentQuestionIndex + 1}:</strong> ${currentQuestion.question}</p>
                <form id="answer-form">${optionsHtml}</form>
                <button type="button" id="next-btn">Next</button>
            `;

            document.getElementById('next-btn').addEventListener('click', nextQuestion);
            timerDisplay.textContent = `Time left: ${formatTime(timeLeft)}`;
        } else {
            endExam();
        }
    }

    function nextQuestion() {
        const selectedAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked')).map(input => input.value);
        const currentQuestion = questions[currentQuestionIndex];

        if (currentQuestion.isMultipleChoice) {
            if (selectedAnswers.sort().toString() === currentQuestion.answer.sort().toString()) {
                score += 10; // Add 10 marks for correct answer
            }
        } else {
            if (selectedAnswers[0] === currentQuestion.answer) {
                score += 10; // Add 10 marks for correct answer
            }
        }

        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            endExam();
        }
    }

    function startTimer() {
        timer = setInterval(function() {
            timeLeft--;
            timerDisplay.textContent = `Time left: ${formatTime(timeLeft)}`;
            if (timeLeft <= 0) {
                clearInterval(timer);
                endExam();
            }
        }, 1000);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function endExam() {
        clearInterval(timer);
        const passMark = 60;
        if (score >= passMark) {
            celebrationPopup.style.display = 'block';
            setTimeout(() => {
                celebrationPopup.style.display = 'none';
            }, 5000); // Hide the celebration popup after 5 seconds
        }

        examContainer.innerHTML = `
            <h2>Exam Completed!</h2>
            <p>Your score: <strong>${score} out of 100</strong></p>
            <p>Minimum marks required: <strong>${passMark}</strong></p>
            ${score >= passMark ? `<h2>Congratulations! You passed the exam.</h2>` : `<h2>Sorry, you failed the exam. Please try again.</h2>`}
        `;
    }

    // Prevent copying, cutting, and pasting
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        alert("Copying is disabled during the exam.");
    });

    document.addEventListener('cut', function(e) {
        e.preventDefault();
        alert("Cutting is disabled during the exam.");
    });

    document.addEventListener('paste', function(e) {
        e.preventDefault();
        alert("Pasting is disabled during the exam.");
    });

    // Disable right-clicking
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        alert("Right-clicking is disabled during the exam.");
    });

    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        alert("Text selection is disabled during the exam.");
    });

    // Disable keyboard shortcuts (Ctrl+C, Ctrl+X, Ctrl+V)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'v' || e.key === 'V')) {
            e.preventDefault();
            alert("Keyboard shortcuts for copying, cutting, and pasting are disabled during the exam.");
        }
    });

    // Handle page refresh
    window.addEventListener('beforeunload', function() {
        if (examStarted) {
            localStorage.setItem('timeLeft', timeLeft);
            localStorage.setItem('currentQuestionIndex', currentQuestionIndex);
            localStorage.setItem('score', score);
        }
    });

    window.addEventListener('load', function() {
        if (localStorage.getItem('timeLeft')) {
            timeLeft = parseInt(localStorage.getItem('timeLeft'));
            currentQuestionIndex = parseInt(localStorage.getItem('currentQuestionIndex'));
            score = parseInt(localStorage.getItem('score'));
            startExam();
        }
    });
});
