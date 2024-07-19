document.addEventListener('DOMContentLoaded', function() {
    const rulesContainer = document.getElementById('rules-container');
    const quizContainer = document.getElementById('quiz-container');
    const questionNumber = document.getElementById('question-number');
    const questionText = document.getElementById('question-text');
    const answerInput = document.getElementById('answer-input');
    const submitButton = document.getElementById('submit-answer');
    const hintButton = document.getElementById('hint-button');
    const responseText = document.getElementById('response');
    const resultsContainer = document.getElementById('results-container');
    const resultsList = document.getElementById('results-list');
    const showResultsButton = document.getElementById('show-results');
    const quizCompletedContainer = document.getElementById('quiz-completed-container');
    const scoreDisplay = document.getElementById('score');
    const startQuizButton = document.getElementById('start-quiz');
    const playAgainButton = document.getElementById('play-again');

    let score = 0;
    let currentQuestionIndex = 0;
    let selectedQuestions = [];
    const userAnswers = [];
    const hintsRevealed = [];

    startQuizButton.addEventListener('click', function() {
        rulesContainer.style.display = 'none';
        quizContainer.style.display = 'block';
        fetchQuestions();
    });

    playAgainButton.addEventListener('click', function() {
        score = 0;
        currentQuestionIndex = 0;
        selectedQuestions = [];
        userAnswers.length = 0;
        hintsRevealed.length = 0;
        resultsContainer.style.display = 'none';
        quizCompletedContainer.style.display = 'none';
        rulesContainer.style.display = 'block';
    });

    function fetchQuestions() {
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                const easyQuestions = data.questions.filter(q => q.category === 'easy');
                const mediumQuestions = data.questions.filter(q => q.category === 'medium');
                const hardQuestions = data.questions.filter(q => q.category === 'hard');

                const selectedEasy = getRandomQuestions(easyQuestions, 4);
                const selectedMedium = getRandomQuestions(mediumQuestions, 4);
                const selectedHard = getRandomQuestions(hardQuestions, 2);

                selectedQuestions = [...selectedEasy, ...selectedMedium, ...selectedHard];
                displayQuestion();
            })
            .catch(error => console.error('Error fetching questions:', error));
    }

    function getRandomQuestions(questionArray, count) {
        const shuffled = questionArray.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    function displayQuestion() {
        if (currentQuestionIndex < selectedQuestions.length) {
            const currentQuestion = selectedQuestions[currentQuestionIndex];
            questionNumber.textContent = `Question : ${currentQuestionIndex + 1}`;
            questionText.textContent = currentQuestion.question;
            answerInput.value = '';
            responseText.textContent = '';
            //hintButton.textContent = 'Show Hint';
            hintButton.disabled = false;
        } else {
            quizContainer.style.display = 'none';
            quizCompletedContainer.style.display = 'block';
        }
    }

    hintButton.addEventListener('click', function() {
        const currentQuestion = selectedQuestions[currentQuestionIndex];
        responseText.textContent = `Hint: ${currentQuestion.hint}`;
        hintButton.disabled = true;
        hintsRevealed[currentQuestionIndex] = true;
    });

    submitButton.addEventListener('click', function() {
        const currentQuestion = selectedQuestions[currentQuestionIndex];
        const userAnswer = answerInput.value.trim();
        userAnswers[currentQuestionIndex] = userAnswer;

        const isCorrect = currentQuestion.testCases.every(testCase => {
            const regex = new RegExp(userAnswer);
            return regex.test(testCase.input) === testCase.output;
        });

        if (isCorrect) {
            score += 10;
            if (hintsRevealed[currentQuestionIndex]) {
                score += 5;
            }
        }

        currentQuestionIndex++;
        displayQuestion();
    });

    showResultsButton.addEventListener('click', function() {
        resultsContainer.style.display = 'block';
        showResults();
        quizCompletedContainer.style.display = 'none';
    });

    function showResults() {
        let resultsHTML = `<h2>Results</h2><p>Score: ${score}</p><ul>`;
        /*selectedQuestions.forEach((question, index) => {
            const isCorrect = question.testCases.every(testCase => {
                const regex = new RegExp(userAnswers[index]);
                return regex.test(testCase.input) === testCase.output;
            });
            const resultText = isCorrect ? 'Correct' : 'Incorrect';
            resultsHTML += `<li>Question ${index + 1}: ${resultText}</li>`;
        });
        resultsHTML += '</ul>';
        resultsList.innerHTML = resultsHTML;
        */
        scoreDisplay.textContent = `Your Score: ${score}`;
    }
});