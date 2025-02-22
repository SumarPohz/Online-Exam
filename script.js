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
    let timeLeft = 1200;
    let timer;
    let score = 0;
    let userAnswers = [];

    const questions = [
        // Questions and answers as provided earlier
    ];

  function submitFormToFormspree() {
    const formData = new FormData(registrationForm);

    // Replace 'YOUR_FORM_ID' with your actual Formspree endpoint
    fetch('https://formspree.io/f/mbldbqkp', {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert("Exam data submitted successfully!");
        } else {
            alert("Failed to submit exam data. Please try again.");
        }
    })
    .catch(error => {
        console.error("Error submitting exam data:", error);
        alert("An error occurred while submitting exam data.");
    });
}
    // Hash function to securely hash the mobile number
    async function hashMobileNumber(mobile) {
        const encoder = new TextEncoder();
        const data = encoder.encode(mobile);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }

    // Check if the user has already submitted the exam
    async function hasUserSubmitted() {
        const mobile = document.getElementById('mobile').value.trim();
        const hashedMobile = await hashMobileNumber(mobile);
        const submittedHashedMobile = localStorage.getItem('submittedHashedMobile');
        return submittedHashedMobile === hashedMobile;
    }

    // Validate mobile number (exactly 10 digits)
    function validateMobileNumber(mobile) {
        return /^\d{10}$/.test(mobile);
    }

    // Validate all fields before proceeding
    async function validateForm() {
        const name = document.getElementById('name').value.trim();
        const designation = document.getElementById('designation').value.trim();
        const agency = document.getElementById('agency').value.trim();
        const mobile = document.getElementById('mobile').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!name || !designation || !agency || !mobile || !email) {
            alert("All fields are mandatory. Please fill in all details.");
            return false;
        }

        if (!validateMobileNumber(mobile)) {
            alert("Mobile number must be exactly 10 digits.");
            return false;
        }

        if (await hasUserSubmitted()) {
            alert("You have already submitted the exam. Only one submission is allowed per user.");
            return false;
        }

        return true;
    }

    proceedBtn.addEventListener('click', async function() {
        if (await validateForm()) {
            popup.style.display = 'block';
        }
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

            const isLastQuestion = currentQuestionIndex === questions.length - 1;
            const buttonText = isLastQuestion ? "Submit" : "Next";

            questionContainer.innerHTML = `
                <p><strong>Question ${currentQuestionIndex + 1}:</strong> ${currentQuestion.question}</p>
                <form id="answer-form">${optionsHtml}</form>
                <button type="button" id="next-btn">${buttonText}</button>
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

        if (selectedAnswers.length === 0) {
            alert("Please select an answer before proceeding.");
            return;
        }

        if (currentQuestion.isMultipleChoice) {
            if (selectedAnswers.sort().toString() === currentQuestion.answer.sort().toString()) {
                score += 10;
            }
        } else {
            if (selectedAnswers[0] === currentQuestion.answer) {
                score += 10;
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

    async function endExam() {
        clearInterval(timer);
        const passMark = 60;
        const resultMessage = score >= passMark ? 
            `<h2>Congratulations! You passed the exam.</h2>` : 
            `<h2>Sorry, you failed the exam. Please try again.</h2>`;

        examContainer.innerHTML = `
            <h2>Exam Completed!</h2>
            <p>Your score: <strong>${score} out of 100</strong></p>
            <p>Minimum marks required: <strong>${passMark}</strong></p>
            ${resultMessage}
        `;

        // Hash the mobile number and store it in localStorage
        const mobile = document.getElementById('mobile').value.trim();
        const hashedMobile = await hashMobileNumber(mobile);
        localStorage.setItem('submittedHashedMobile', hashedMobile);
    }

    document.addEventListener('copy', function(e) {
        e.preventDefault();
    });

    document.addEventListener('cut', function(e) {
        e.preventDefault();
    });

    document.addEventListener('paste', function(e) {
        e.preventDefault();
    });

    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
    });

    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 'v' || e.key === 'V')) {
            e.preventDefault();
        }
    });

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
