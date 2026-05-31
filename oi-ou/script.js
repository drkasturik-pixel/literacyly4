/* ==========================================
   OI & OU SOUND DETECTIVE
========================================== */

const splashScreen = document.getElementById("splashScreen");
const gameContainer = document.getElementById("gameContainer");
const loadingScreen = document.getElementById("loadingScreen");

const wordImage = document.getElementById("wordImage");
const prefix = document.getElementById("prefix");
const suffix = document.getElementById("suffix");
const dropZone = document.getElementById("dropZone");

const scoreValue = document.getElementById("scoreValue");

const replayWordBtn = document.getElementById("replayWordBtn");
const replayInstructionsBtn = document.getElementById("replayInstructionsBtn");

const correctFeedback = document.getElementById("correctFeedback");
const wrongFeedback = document.getElementById("wrongFeedback");

const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");
const backgroundMusic = document.getElementById("backgroundMusic");

const oiSound = document.getElementById("oiSound");
const ouSound = document.getElementById("ouSound");

const endScreen = document.getElementById("endScreen");
const finalScore = document.getElementById("finalScore");
const starContainer = document.getElementById("starContainer");
const playAgainBtn = document.getElementById("playAgainBtn");

const tiles = document.querySelectorAll(".soundTile");

/* ==========================================
   WORD DATA
========================================== */

const words = [
{
    image:"boil.png",
    word:"boil",
    answer:"oi",
    prefix:"b",
    suffix:"l"
},
{
    image:"house.png",
    word:"house",
    answer:"ou",
    prefix:"h",
    suffix:"se"
},
{
    image:"coin.png",
    word:"coin",
    answer:"oi",
    prefix:"c",
    suffix:"n"
},
{
    image:"mouse.png",
    word:"mouse",
    answer:"ou",
    prefix:"m",
    suffix:"se"
},
{
    image:"oil.png",
    word:"oil",
    answer:"oi",
    prefix:"",
    suffix:"l"
},
{
    image:"cloud.png",
    word:"cloud",
    answer:"ou",
    prefix:"cl",
    suffix:"d"
},
{
    image:"mouth.png",
    word:"mouth",
    answer:"ou",
    prefix:"m",
    suffix:"th"
},
{
    image:"couch.png",
    word:"couch",
    answer:"ou",
    prefix:"c",
    suffix:"ch"
}
];

let currentIndex = 0;
let score = 0;
let currentWord = null;

/* ==========================================
   SHUFFLE
========================================== */

function shuffle(array){

    for(let i=array.length-1;i>0;i--){

        const j =
        Math.floor(Math.random()*(i+1));

        [array[i],array[j]] =
        [array[j],array[i]];
    }

    return array;
}

/* ==========================================
   SPEECH
========================================== */

function speak(text, callback){

    speechSynthesis.cancel();

    const utterance =
    new SpeechSynthesisUtterance(text);

    utterance.rate = 0.85;
    utterance.pitch = 1;

    if(callback){
        utterance.onend = callback;
    }

    speechSynthesis.speak(utterance);
}

/* ==========================================
   SPEAK WORD
========================================== */

function speakWord(){

    speechSynthesis.cancel();

    const utterance =
    new SpeechSynthesisUtterance(
    currentWord.word
    );

    utterance.rate = 0.8;
    utterance.pitch = 1;

    speechSynthesis.speak(
    utterance
    );
}

/* ==========================================
   PHONICS AUDIO
========================================== */

function playPhonicsSound(sound){

    if(sound === "oi"){

        oiSound.currentTime = 0;
        oiSound.play();

    }else{

        ouSound.currentTime = 0;
        ouSound.play();
    }
}

/* ==========================================
   SCORE
========================================== */

function updateScore(){

    scoreValue.textContent =
    score;
}

/* ==========================================
   INSTRUCTIONS
========================================== */

function playInstructions(){

    speak(
    "Welcome. Listen carefully to the word. Drag the correct sound into the blank. Choose the sound that completes the word. Let's play.",
    ()=>{

        playPhonicsSound("oi");

        setTimeout(()=>{

            playPhonicsSound("ou");

        },1200);

        setTimeout(()=>{

            startMusic();
            loadWord();

        },2500);

    });
}

/* ==========================================
   MUSIC
========================================== */

function startMusic(){

    backgroundMusic.volume = 0.20;

    backgroundMusic.play().catch(()=>{});
}

/* ==========================================
   LOAD WORD
========================================== */

function loadWord(){

    if(currentIndex >= words.length){

        finishGame();
        return;
    }

    currentWord =
    words[currentIndex];

    wordImage.src =
    `assets/${currentWord.image}`;

    prefix.textContent =
    currentWord.prefix;

    suffix.textContent =
    currentWord.suffix;

    dropZone.textContent = "?";

    setTimeout(()=>{

        speakWord();

    },500);
}

/* ==========================================
   ANSWER CHECK
========================================== */

function checkAnswer(choice){

    if(choice === currentWord.answer){

        correctAnswer();

    }else{

        wrongAnswer();
    }
}

/* ==========================================
   CORRECT
========================================== */

function correctAnswer(){

    correctSound.currentTime = 0;
    correctSound.play();

    score++;
    updateScore();

    /* LOWERCASE oi / ou */

    dropZone.textContent =
    currentWord.answer;

    correctFeedback.classList.remove(
    "hidden"
    );

    playPhonicsSound(
    currentWord.answer
    );

    setTimeout(()=>{

        correctFeedback.classList.add(
        "hidden"
        );

        currentIndex++;

        loadWord();

    },1500);
}

/* ==========================================
   WRONG
========================================== */

function wrongAnswer(){

    wrongSound.currentTime = 0;
    wrongSound.play();

    wrongFeedback.classList.remove(
    "hidden"
    );

    setTimeout(()=>{

        wrongFeedback.classList.add(
        "hidden"
        );

        speak("Listen again");

        setTimeout(()=>{

            speakWord();

        },900);

    },1200);
}

/* ==========================================
   DRAGGING
========================================== */

tiles.forEach(tile=>{

    tile.addEventListener(
    "dragstart",
    e=>{

        e.dataTransfer.setData(
        "text/plain",
        tile.dataset.sound
        );

    });

});

/* ==========================================
   DROP ZONE
========================================== */

dropZone.addEventListener(
"dragover",
e=>{

    e.preventDefault();

    dropZone.classList.add(
    "drag-over"
    );
});

dropZone.addEventListener(
"dragleave",
()=>{

    dropZone.classList.remove(
    "drag-over"
    );
});

dropZone.addEventListener(
"drop",
e=>{

    e.preventDefault();

    dropZone.classList.remove(
    "drag-over"
    );

    const choice =
    e.dataTransfer.getData(
    "text/plain"
    );

    checkAnswer(choice);

});

/* ==========================================
   TOUCH SUPPORT
========================================== */

tiles.forEach(tile=>{

    tile.addEventListener(
    "click",
    ()=>{

        checkAnswer(
        tile.dataset.sound
        );

    });

});

/* ==========================================
   STARS
========================================== */

function getStars(){

    if(score === 8) return "⭐⭐⭐⭐⭐";
    if(score === 7) return "⭐⭐⭐⭐";
    if(score >= 5) return "⭐⭐⭐";
    if(score >= 3) return "⭐⭐";
    return "⭐";
}

/* ==========================================
   END GAME
========================================== */

function finishGame(){

    backgroundMusic.pause();

    finalScore.textContent =
    `Final Score: ${score} / 8`;

    starContainer.textContent =
    getStars();

    endScreen.classList.remove(
    "hidden"
    );
}

/* ==========================================
   PLAY AGAIN
========================================== */

playAgainBtn.addEventListener(
"click",
()=>{

    score = 0;
    currentIndex = 0;

    updateScore();

    shuffle(words);

    endScreen.classList.add(
    "hidden"
    );

    loadWord();

    startMusic();

});

/* ==========================================
   REPLAY BUTTONS
========================================== */

replayWordBtn.addEventListener(
"click",
()=>{

    if(currentWord){
        speakWord();
    }

});

replayInstructionsBtn.addEventListener(
"click",
()=>{

    playInstructions();

});

/* ==========================================
   STARTUP
========================================== */

window.addEventListener(
"load",
()=>{

    shuffle(words);

    setTimeout(()=>{

        loadingScreen.classList.add(
        "hidden"
        );

    },500);

    setTimeout(()=>{

        splashScreen.style.display =
        "none";

        gameContainer.classList.remove(
        "hidden"
        );

        playInstructions();

    },5000);

});

/* ==========================================
   INITIAL SCORE
========================================== */

updateScore();
