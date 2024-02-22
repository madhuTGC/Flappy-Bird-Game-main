
const QuestionList = [
  { 'Q1': "What is Your Name" },
  { 'Q2': "What is Your School Name" },
  { 'Q3': "What is Your father Name" },
  { 'Q4': "What is Your Mother Name" },
  { 'Q5': "What is Your Brother Name" },
  { 'Q6': "Where are you From" },
  { 'Q7': "What is going on?" },
  { 'Q8': "Had a Dinner?" },
  { 'Q9': "why 1+1 is equal to 2?" },
  {'Q10': "Explain Newtons law of motion?"}
];

let currentQuestionIndex = 0;
let isGamePaused = false;
let bird_dy = 0;
const terminalVelocity = 2;
let pipe_seperation = 0;
let pipe_gap = 35;

function displayQuestion() {
  if (currentQuestionIndex < QuestionList.length) {
    const currentQuestion = QuestionList[currentQuestionIndex];
    displayQuestionInModal(Object.values(currentQuestion)[0]);
    currentQuestionIndex++;
  } else {
    currentQuestionIndex = 0;
    onGameOver();
  }
}

function displayQuestionInModal(question) {
  pauseGame(); // Pause the game before displaying the question modal
  $('#questionText').text(question);

  // Show the modal
  $('#questionModal').modal('show');
}

function pauseGame() {
  isGamePaused = true;
  message.classList.add('pausedMessage');
}

function resumeGame() {
  isGamePaused = false;
  document.getElementById("bird-1").style.display ='block';
  $('#questionModal').modal('hide'); // Close the modal

  // Resume the animations and game logic here
  move();
  requestAnimationFrame(apply_gravity);
  requestAnimationFrame(create_pipe);
}

function togglePauseResume() {
  if (isGamePaused) {
    resumeGame();
  } else {
    pauseGame();
  }
}

document.body.addEventListener('click', (e) => {
  if (game_state === 'Play') {
    jumpAction(); // Trigger jump action when body is clicked
  }
});

let move_speed = 3, gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');

let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();
let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let game_state = 'Start';

img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
  if(e.key == 'Enter' && game_state != 'Play'){
    document.querySelectorAll('.pipe_sprite').forEach((e) => {
      e.remove();
    });
    img.style.display = 'block';
    bird.style.top = '40vh';
    game_state = 'Play';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    message.classList.remove('messageStyle');
    play();
  }
});

function play() {
  requestAnimationFrame(move);
  requestAnimationFrame(apply_gravity);
  requestAnimationFrame(create_pipe);
}

function move() {
  if (!isGamePaused) {
    let pipe_sprite = document.querySelectorAll('.pipe_sprite');
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        if (
          pipe_sprite_props.right < bird_props.left &&
          pipe_sprite_props.right + move_speed >= bird_props.left &&
          element.increase_score == '1'
        ) {
          score_val.innerHTML = +score_val.innerHTML + 1;
          sound_point.play();
          pauseGame();
          displayQuestion();
        }
        element.style.left = pipe_sprite_props.left - move_speed + 'px';
      }
    });
  }
  if (!isGamePaused) {
    requestAnimationFrame(move);
  }
}

function create_pipe() {
  if (!isGamePaused) {
    if (pipe_seperation > 215) {
      pipe_seperation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement('div');
      pipe_sprite_inv.className = 'pipe_sprite';
      pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
      pipe_sprite_inv.style.left = '100vw';

      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement('div');
      pipe_sprite.className = 'pipe_sprite';
      pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
      pipe_sprite.style.left = '100vw';
      pipe_sprite.increase_score = '1';

      document.body.appendChild(pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
}

const jumpAction = () => {
  img.src = 'images/Bird-2.png'; // Change bird image to indicate jump
  bird_dy = -7.6; // Apply vertical velocity to make the bird jump

  // After a short delay, revert the bird image back to original
  setTimeout(() => {
    img.src = 'images/Bird.png';
  }, 200); // Adjust the delay as needed
};

document.addEventListener('keydown', (e) => {
  if ((e.key === 'ArrowUp' || e.key === ' ') && game_state === 'Play') {
    jumpAction(); // Trigger jump action when spacebar or up arrow key is pressed
  }
});


function apply_gravity() {
  if (!isGamePaused) {
    // Add a condition to check if the bird is already near the bottom
    if (bird_props.bottom >= background.bottom) {
      // Set the vertical velocity to zero if the bird is near the bottom
      bird_dy = 0;
      jumpAction();
    } else {
      // Apply gravity only if the bird is not near the bottom
      bird_dy = Math.min(bird_dy + gravity, terminalVelocity);
    }

    // Update the bird's vertical position
    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();

    // Continue applying gravity
    requestAnimationFrame(apply_gravity);
  }
}


// function apply_gravity() {
//   if (!isGamePaused) {
//     bird_dy = Math.min(bird_dy + gravity, terminalVelocity);

//     if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
//       game_state = 'End';
//       message.style.left = '28vw';
//       window.location.reload();
//       message.classList.remove('messageStyle');
//       return;
//     }

//     bird.style.top = bird_props.top + bird_dy + 'px';
//     bird_props = bird.getBoundingClientRect();

//     requestAnimationFrame(apply_gravity);
//   }
// }

function startGame() {
  if (game_state !== 'Play') {
    game_state = 'Play';
    document.querySelectorAll('.pipe_sprite').forEach((e) => {
      e.remove();
    });
    img.style.display = 'block';
    bird.style.top = '40vh';
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    message.classList.remove('messageStyle');
    play();
  }
}




document.addEventListener('touchstart', () => {
  startGame(); // Start the game when the screen is touched
});

document.addEventListener('touchend', () => {
  // Optionally, you can handle touchend event if needed
});

function startGame() {
  if (game_state !== 'Play') {
    game_state = 'Play';
    document.querySelectorAll('.pipe_sprite').forEach((e) => {
      e.remove();
    });
    img.style.display = 'block'; // Ensure bird image is displayed
    bird.style.top = '40vh'; // Set initial bird position
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    message.classList.remove('messageStyle');
    play();
  }
}

// Function to hide the bird image at the beginning
function hideBird() {
  img.style.display = 'none';
}

// Call hideBird() initially to hide the bird image
hideBird();



