// Disable right-click
document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});

// Disable text selection
document.addEventListener('selectstart', function(e) {
    e.preventDefault();
});

// Disable copy event
document.addEventListener('copy', function(e) {
    e.preventDefault();
    alert('Copying content is not allowed.');
});

// Optional: Disable Ctrl+C, Ctrl+X, Ctrl+U, etc.
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && (e.key === 'c' || e.key === 'x' || e.key === 'u')) {
        e.preventDefault();
        alert('Keyboard shortcuts are disabled.');
    }
});




document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Hide the form and show the exam container
    document.getElementById('form-container').style.display = 'none';
    document.getElementById('exam-container').style.display = 'block';

    // Show the popup to confirm exam start
    document.getElementById('popup').style.display = 'block';
});

// Handle the "Yes" button in the popup
document.getElementById('yes-btn').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
    startExam(); // Start the exam
});

// Handle the "No" button in the popup
document.getElementById('no-btn').addEventListener('click', function() {
    document.getElementById('popup').style.display = 'none';
    document.getElementById('form-container').style.display = 'block'; // Show the form again
    document.getElementById('exam-container').style.display = 'none'; // Hide the exam container
});

// Exam Logic
let currentQuestionIndex = 0;
let score = 0;
let timeLeft = 750; // 5 minutes in seconds
let timerInterval;

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

// Function to start the exam
function startExam() {
    loadQuestion();
    startTimer();
}

// Function to load a question
function loadQuestion() {
    const questionContainer = document.getElementById('question-container');
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion) {
        questionContainer.innerHTML = `
            <h3>${currentQuestion.question}</h3>
            ${currentQuestion.options.map((option, index) => `
                <label>
                    <input type="${currentQuestion.isMultipleChoice ? 'checkbox' : 'radio'}" name="answer" value="${option}">
                    ${option}
                </label>
            `).join('')}
            <button id="next-btn" onclick="nextQuestion()">Next</button>
        `;
    } else {
        endExam();
    }
}

// Function to move to the next question
function nextQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked')).map(input => input.value);

    if (selectedAnswers.length > 0) {
        if (currentQuestion.isMultipleChoice) {
            // Check if all correct answers are selected
            const correctAnswers = currentQuestion.answer.map(ans => currentQuestion.options[ans.charCodeAt(0) - 65]);
            if (selectedAnswers.sort().toString() === correctAnswers.sort().toString()) {
                score++;
            }
        } else {
            // Single-choice question
            if (selectedAnswers[0] === currentQuestion.options[currentQuestion.answer.charCodeAt(0) - 65]) {
                score++;
            }
        }
        currentQuestionIndex++;
        loadQuestion();
    } else {
        alert("Please select an answer before proceeding!");
    }
}

// Function to end the exam
function endExam() {
    clearInterval(timerInterval);
    document.getElementById('exam-container').style.display = 'none';
    document.getElementById('celebration-popup').style.display = 'block';

    // Calculate total marks and display result
    const totalMarks = (score / questions.length) * 100; // Assuming score is the count of correct answers
    const celebrationPopup = document.getElementById('celebration-popup');

    if (totalMarks >= 60) {
        celebrationPopup.innerHTML = `
            <img src="sumar.jpg" alt="Celebration img">
            <h2>Congratulations! You passed with a score of ${score} out of ${questions.length}!</h2>
        `;
    } else {
        celebrationPopup.innerHTML = `
            <img src="sumar.jpg" alt="Try again img">
            <h2>Sorry, you failed. Your score is ${score} out of ${questions.length}. Try again!</h2>
        `;
    }

    // Submit exam results to Formspree
    submitExamResults();
}


// Function to submit exam results to Formspree
function submitExamResults() {
    const form = document.getElementById('registration-form');
    const formData = new FormData(form);

    // Add exam results to the form data
    formData.append('score', score);
    formData.append('totalQuestions', questions.length);
    formData.append('timeTaken', (750 - timeLeft));

    fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Exam results submitted successfully!');
        } else {
            alert('Exam results submission failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Exam results submission failed. Please try again.');
    });
}

// Timer Logic
function startTimer() {
    const timerDisplay = document.getElementById('timer');
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerDisplay.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
            timeLeft--;
        } else {
            clearInterval(timerInterval);
            endExam();
        }
    }, 1000);
}
