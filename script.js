// Global variables
let currentLevel = localStorage.getItem('currentLevel') ? parseInt(localStorage.getItem('currentLevel')) : 1;
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
let correctAnswer;
let operation;

// UI update functions
function updateUI() {
    document.getElementById("current-level").innerText = currentLevel;
    document.getElementById("current-grade").innerText = getGradeFromLevel(currentLevel);
    document.getElementById("score-value").innerText = score;
}

function refreshUI() {
    document.getElementById("current-level").innerText = currentLevel;
    document.getElementById("current-grade").innerText = getGradeFromLevel(currentLevel);
    document.getElementById("score-value").innerText = score;
}

// Helper functions
function getGradeFromLevel(level) {
    if (level <= 2) return 'Børnehave - 1. klasse';
    if (level <= 4) return '2.-3. klasse';
    if (level <= 6) return '4.-5. klasse';
    if (level <= 8) return '6.-7. klasse';
    return '8. klasse';
}

function clearAnswerInput() {
    document.getElementById("answer").value = ""; // Ryd inputfeltet
}

function clearFeedback() {
    document.getElementById("feedback").innerHTML = ""; // Ryd feedback
}

function getRandomExerciseType() {
    let types;
    if (currentLevel <= 2) {
        types = ['addition', 'subtraction'];
        return types[Math.floor(Math.random() * types.length)];
    } else if (currentLevel <= 4) {
        types = ['addition', 'subtraction', 'multiplication'];
        return types[Math.floor(Math.random() * types.length)];
    } else if (currentLevel <= 6) {
        types = ['addition', 'subtraction', 'multiplication', 'division'];
        return types[Math.floor(Math.random() * types.length)];
    } else if (currentLevel <= 8) {
        types = ['addition', 'subtraction', 'multiplication', 'division'];
        return types[Math.floor(Math.random() * types.length)];
    }
    //return types[Math.floor(Math.random() * types.length)];
}

// Exercise generation functions
function generateMathExercise() {
    try {
        let num1 = 0, num2 = 0;
        let exerciseType = getRandomExerciseType();
        correctAnswer = 0;
        operation = '';

        if (currentLevel <= 2) {
            if (exerciseType === 'addition') {
                num1 = Math.floor(Math.random() * 10);
                num2 = Math.floor(Math.random() * 10);
                correctAnswer = num1 + num2;
                operation = '+';
            } else if (exerciseType === 'subtraction') {
                num1 = Math.floor(Math.random() * 10) + 10;
                num2 = Math.floor(Math.random() * 10);
                correctAnswer = num1 - num2;
                operation = '-';
            }
        } else if (currentLevel <= 4) {
            if (exerciseType === 'multiplication') {
                num1 = Math.floor(Math.random() * 10) + 5;
                num2 = Math.floor(Math.random() * 10);
                correctAnswer = num1 * num2;
                operation = '*';
            } else if (exerciseType === 'subtraction') {
                num1 = Math.floor(Math.random() * 10) + 10;
                num2 = Math.floor(Math.random() * 10);
                correctAnswer = num1 - num2;
                operation = '-';
            }
        } else if (currentLevel <= 6) {
            if (exerciseType === 'division') {
                num1 = Math.floor(Math.random() * 10) + 10;
                num2 = Math.floor(Math.random() * 10) + 1;
                correctAnswer = num1 / num2;
                operation = '÷';
            } else if (exerciseType === 'multiplication') {
                num1 = Math.floor(Math.random() * 10) + 5;
                num2 = Math.floor(Math.random() * 10);
                correctAnswer = num1 * num2;
                operation = '*';
            }
        } else if (currentLevel <= 8) {
            num1 = Math.floor(Math.random() * 10);
            correctAnswer = Math.floor(Math.random() * 10);
            operation = '+'; // Set the operation for the equation
            document.getElementById("question").innerHTML = `Løs ligningen: x ${operation} ${num1} = ${correctAnswer}`;
            return;
        }

        if (num1 === undefined || num2 === undefined || correctAnswer === undefined || operation === '') {
            throw { message: "Opgave blev ikke korrekt genereret.", lineNumber: 1, variables: { num1, num2, correctAnswer, operation } };
        }

        document.getElementById("question").innerHTML = `${num1} ${operation} ${num2} = ?`;
    } catch (error) {
        console.error("Error generating exercise:", error);
        ShowErrorPopup(error);
    }
}

// Function to load the next exercise
function nextExercise() {
    // Skab og vis loading screen
    showLoadingScreen('Indlæser næste opgave...');

    // Vent lidt før næste opgave vises
    setTimeout(() => {
        // Fjern loading screen
        removeLoadingScreen();
        
        // Clear question, feedback og input
        document.getElementById("question").innerHTML = "Venter på opgave...";
        clearAnswerInput();
        clearFeedback();

        // Vis de andre UI-elementer
        document.getElementById("main-container").style.display = "block";

        generateMathExercise(); // Generer ny opgave
    }, 1000); // Indlæsningstid
}

// Error handling functions
function ShowErrorPopup(error) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.left = '50%';
    popup.style.top = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.border = '1px solid black';
    popup.style.zIndex = '1000';

    const message = document.createElement('p');
    message.innerText = `Der opstod en fejl under genereringen af opgaven. Prøv igen.\nFejl: ${error.message}\nLinje: ${error.lineNumber}\nVariabler: ${JSON.stringify(error.variables)}`;
    popup.appendChild(message);

    const button = document.createElement('button');
    button.innerText = 'Next Question';
    button.onclick = function() {
        document.body.removeChild(popup);
        generateMathExercise();
    };
    popup.appendChild(button);

    document.body.appendChild(popup);
}

// Answer checking function
function checkAnswer() {
    let answer = parseFloat(document.getElementById("answer").value);

    console.log(`User answer: ${answer}, Correct answer: ${correctAnswer} (checkAnswer)`);

    if (correctAnswer !== undefined && !isNaN(answer) && Math.abs(answer - correctAnswer) < 0.1) {
        document.getElementById("feedback").innerHTML = "Korrekt!";
        document.getElementById("feedback").classList.add("correct");
        document.getElementById("feedback").classList.remove("incorrect");
        score += 1;
    } else {
        document.getElementById("feedback").innerHTML = "Forkert. Prøv igen.";
        document.getElementById("feedback").classList.add("incorrect");
        document.getElementById("feedback").classList.remove("correct");
    }

    localStorage.setItem('score', score);
    refreshUI(); // Refresh UI after checking the answer
}

// Loading screen functions
function showLoadingScreen(message) {
    const loadingScreen = document.createElement('div');
    loadingScreen.classList.add('loading-screen');
    loadingScreen.innerHTML = `<div class="loading-text">${message}</div>`;
    document.body.appendChild(loadingScreen);
}

function removeLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = 0;
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }
}

// Initialization
window.onload = function () {
    document.getElementById("main-container").style.display = "none"; // Skjul main-container først
    updateUI();
    nextExercise(); // Start første opgave
    refreshUI(); // Refresh UI on load
}