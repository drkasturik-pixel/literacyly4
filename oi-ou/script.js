/* ==========================================
   OI & OU SOUND DETECTIVE
========================================== */

/* ==========================================
   DOM ELEMENTS
========================================== */

const splashScreen = document.getElementById("splashScreen");
const gameContainer = document.getElementById("gameContainer");
const loadingScreen = document.getElementById("loadingScreen");

const wordImage = document.getElementById("wordImage");

const prefix = document.getElementById("prefix");
const suffix = document.getElementById("suffix");

const dropZone = document.getElementById("dropZone");

const scoreValue = document.getElementById("scoreValue");

const replayWordBtn =
document.getElementById("replayWordBtn");

const replayInstructionsBtn =
document.getElementById("replayInstructionsBtn");

const correctFeedback =
document.getElementById("correctFeedback");

const wrongFeedback =
document.getElementById("wrongFeedback");

const correctSound =
document.getElementById("correctSound");

const wrongSound =
document.getElementById("wrongSound");

const backgroundMusic =
document.getElementById("backgroundMusic");

const endScreen =
document.getElementById("endScreen");

const finalScore =
document.getElementById("finalScore");

const starContainer =
document.getElementById("starContainer");

const playAgainBtn =
document.getElementById("playAgainBtn");

const tiles =
document.querySelectorAll(".soundTile");

/* ==========================================
   GAME DATA
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

/* ==========================================
   GAME STATE
========================================== */

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

function speak(text, callback=null){

if(!window.speechSynthesis){

if(callback) callback();

return;
}

speechSynthesis.cancel();

const utterance =
new SpeechSynthesisUtterance(text);

utterance.rate = 0.85;
utterance.pitch = 1;
utterance.volume = 1;

utterance.onend = ()=>{

if(callback){

callback();
}

};

speechSynthesis.speak(utterance);
}

/* ==========================================
   INSTRUCTIONS
========================================== */

function speakInstructions(){

const text =

"Welcome. " +

"Listen carefully to the word. " +

"Drag O I or O U into the blank. " +

"Choose the sound that completes the word. " +

"Let's play.";

speak(text, ()=>{

startMusic();

loadWord();
});
}

/* ==========================================
   MUSIC
========================================== */

function startMusic(){

backgroundMusic.volume = 0.25;

backgroundMusic.play().catch(()=>{});
}

/* ==========================================
   SCORE
========================================== */

function updateScore(){

scoreValue.textContent = score;
}

/* ==========================================
   WORD AUDIO
========================================== */

function speakCurrentWord(){

if(!currentWord) return;

speak(currentWord.word);
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

wordImage.alt =
currentWord.word;

prefix.textContent =
currentWord.prefix;

suffix.textContent =
currentWord.suffix;

dropZone.textContent =
"?";

setTimeout(()=>{

speakCurrentWord();

},500);
}

/* ==========================================
   DRAG SUPPORT
========================================== */

tiles.forEach(tile=>{

tile.addEventListener(
"dragstart",
e=>{

e.dataTransfer.setData(
"text/plain",
tile.dataset.sound
);

}
);

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

}
);

dropZone.addEventListener(
"dragleave",
()=>{

dropZone.classList.remove(
"drag-over"
);

}
);

dropZone.addEventListener(
"drop",
e=>{

e.preventDefault();

dropZone.classList.remove(
"drag-over"
);

const selected =

e.dataTransfer.getData(
"text/plain"
);

checkAnswer(selected);

}
);

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

}
);

});

/* ==========================================
   ANSWER CHECK
========================================== */

function checkAnswer(choice){

if(choice === currentWord.answer){

handleCorrect();
}
else{

handleWrong();
}

}

/* ==========================================
   CORRECT
========================================== */

function handleCorrect(){

correctSound.currentTime = 0;

correctSound.play();

score++;

updateScore();

dropZone.textContent =
currentWord.answer.toUpperCase();

correctFeedback.classList.remove(
"hidden"
);

speak(
`${currentWord.word} has ${currentWord.answer}`,
()=>{}
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

function handleWrong(){

wrongSound.currentTime = 0;

wrongSound.play();

wrongFeedback.classList.remove(
"hidden"
);

setTimeout(()=>{

wrongFeedback.classList.add(
"hidden"
);

speak(
"Listen again."
);

setTimeout(()=>{

speakCurrentWord();

},800);

},1200);
}

/* ==========================================
   STAR RATING
========================================== */

function getStars(){

if(score === 8){

return "⭐⭐⭐⭐⭐";
}

if(score === 7){

return "⭐⭐⭐⭐";
}

if(score >= 5){

return "⭐⭐⭐";
}

if(score >= 3){

return "⭐⭐";
}

return "⭐";
}

/* ==========================================
   END GAME
========================================== */

function finishGame(){

speechSynthesis.cancel();

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

}
);

/* ==========================================
   REPLAY BUTTONS
========================================== */

replayWordBtn.addEventListener(
"click",
()=>{

speakCurrentWord();

}
);

replayInstructionsBtn.addEventListener(
"click",
()=>{

speakInstructions();

}
);

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

speakInstructions();

},5000);

}
);

/* ==========================================
   INITIAL SCORE
========================================== */

updateScore();
