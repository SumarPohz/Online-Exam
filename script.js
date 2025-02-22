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
        {
            question: "What are the three things that a fire needs to burn?",
            options: ["A. Fuel, Oxygen, Gas.", "B. Fuel, Gas, Wood.", "C. Fuel, Oxygen, Heat.", "D. Air, Heat, Water."],
            answer: "C"
        },
        {
            question: "What type of Fire Extinguisher could you use to extinguish an electrical fire? (Multiple Options)",
            options: ["A. Powder", "B. Foam", "C. Carbon dioxide (CO2)", "D. Water"],
            answer: ["A", "C"],
            isMultipleChoice: true
        },
        {
            question: "In Which order would you perform the following actions when finding a fire in your workplace?",
            options: [
                "A. 1. Collect your belongings; 2. Call 101; 3. Raise the alarm; 4. Shout 'Fire'; 5. Leave the building and head to the assembly point.",
                "B. 1. Leave the building and head to the assembly point; 2. Shout 'Fire'; 3. Call 101; 4. Collect your belongings; 5. Raise the Alarm.",
                "C. 1. Shout 'Fire!'; 2. Raise the Alarm; 3. Call 101; 4. Do not return for personal belongings; 5. Leave the building and head to the assembly point."
            ],
            answer: "C"
        },
        {
            question: "What Should you do if an Electronically locked door fails to unlock when the Alarm triggers?",
            options: [
                "A. Run back the way you came AND find another fire exit.",
                "B. Locate the green emergency door release, break the glass and depress the button inside.",
                "C. Kick and Shake the door until it unlocks itself.",
                "D. Stand and wait for the supervisor or manager to arrive."
            ],
            answer: "B"
        },
        {
            question: "Full Form of PPE.",
            options: ["A. Personal Protective Equipment", "B. Public Property Equipment", "C. Private Personal Equipment."],
            answer: "A"
        },
        {
            question: "Personal Protective equipment is the last line of defence your employer can offer you against the risks you face in your workplace. As an employee, which of the following are your responsibility regarding PPE? (Multiple Options)",
            options: [
                "A. To ensure all issues PPE is maintained and stored correctly.",
                "B. To ensure all issued PPE is reported once it becomes faulty.",
                "C. To ensure you refuse to work with any equipment you have never been trained to use."
            ],
            answer: ["A", "B", "C"],
            isMultipleChoice: true
        },
        {
            question: "Is the Following statement True or False? PPE must be supplied and used at work when risks cannot be adequately controlled in any other way.",
            options: ["A. True.", "B. False."],
            answer: "A"
        },
        {
            question: "Which of the following statements is true?",
            options: [
                "A. You must wear PPE only when you deem it is necessary.",
                "B. You must wear PPE only while you are actively working in an area deemed hazardous by your companies' risk assessment procedures.",
                "C. You must wear the appropriate, required PPE at all times while you're in an area deemed a hazard zone by your companies' risk assessment procedures."
            ],
            answer: "C"
        },
        {
            question: "Which of the following PPE would you need to wear to protect yourself against flying objects? (Multiple Options)",
            options: ["A. Ear plugs or ear defenders", "B. Helmets or Bump Caps", "C. Safety spectacles, goggles or face shields."],
            answer: ["B", "C"],
            isMultipleChoice: true
        },
        {
            question: "Fire is a Chemical reaction that produces heat energy. Three elements must combine to initiate combustion. Which is not part of this?",
            options: ["A. Heat", "B. Fuel", "C. Oxygen", "D. Air"],
            answer: "D"
        }
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
