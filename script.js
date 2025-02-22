function loadQuestion() {
    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        let optionsHtml = currentQuestion.options.map((option, index) => `
            <label for="option${index}">
                <input type="${currentQuestion.isMultipleChoice ? 'checkbox' : 'radio'}" name="answer" value="${option.charAt(0)}" id="option${index}">
                ${option}
            </label>
        `).join('');

        // Change button text to "Submit" on the last question
        const buttonText = currentQuestionIndex === questions.length - 1 ? "Submit" : "Next";

        questionContainer.innerHTML = `
            <p><strong>Question ${currentQuestionIndex + 1}:</strong> ${currentQuestion.question}</p>
            <form id="answer-form">${optionsHtml}</form>
            <button type="button" id="next-btn">${buttonText}</button>
        `;

        document.getElementById('next-btn').addEventListener('click', nextQuestion);
        timerDisplay.textContent = `Time left: ${formatTime(timeLeft)}`;
    } else {
        endExam(); // Ensure the exam ends properly
    }
}

function nextQuestion() {
    const selectedAnswers = Array.from(document.querySelectorAll('input[name="answer"]:checked')).map(input => input.value);
    const currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion.isMultipleChoice) {
        // Check if all correct answers are selected
        const correctAnswers = currentQuestion.answer.sort().toString();
        const userAnswers = selectedAnswers.sort().toString();
        if (userAnswers === correctAnswers) {
            score += 10; // Add 10 marks for correct answer
        }
    } else {
        if (selectedAnswers[0] === currentQuestion.answer) {
            score += 10; // Add 10 marks for correct answer
        }
    }

    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion(); // Load the next question
    } else {
        endExam(); // End the exam after the last question
    }
}

function endExam() {
    clearInterval(timer); // Stop the timer
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

    // Show celebration popup if the user passed
    if (score >= passMark) {
        celebrationPopup.style.display = 'block';
        setTimeout(() => {
            celebrationPopup.style.display = 'none';
        }, 5000); // Hide the celebration popup after 5 seconds
    }
}
