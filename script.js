let move_speed = 3, grativy = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

// getting bird element properties
let bird_props = bird.getBoundingClientRect();

// This method returns DOMReact -> top, right, bottom, left, x, y, width and height
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

function play(){
    function move(){
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if(pipe_sprite_props.right <= 0){
                element.remove();
            }else{
                if(bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top){
                    game_state = 'End';
                    message.innerHTML = 'Game Over'.fontcolor('red') + '<br>Press Enter To Restart';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();
                    return;
                }else{
                    if(pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1'){
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    // let bird_dy = 0;
    // function apply_gravity(){
    //     if(game_state != 'Play') return;
    //     bird_dy = bird_dy + grativy;
    //     document.addEventListener('keydown', (e) => {
    //         if(e.key == 'ArrowUp' || e.key == ' '){
    //             img.src = 'images/Bird-2.png';
    //             bird_dy = -7.6;
    //         }
    //     });

    //     document.addEventListener('keyup', (e) => {
    //         if(e.key == 'ArrowUp' || e.key == ' '){
    //             img.src = 'images/Bird.png';
    //         }
    //     });

    //     if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
    //         game_state = 'End';
    //         message.style.left = '28vw';
    //         window.location.reload();
    //         message.classList.remove('messageStyle');
    //         return;
    //     }
    //     bird.style.top = bird_props.top + bird_dy + 'px';
    //     bird_props = bird.getBoundingClientRect();
    //     requestAnimationFrame(apply_gravity);
    // }

    let bird_dy = 0;
const terminalVelocity = 2; // Define the maximum downward speed

// function apply_gravity() {
//     if (game_state !== 'Play') return;

//     bird_dy = Math.min(bird_dy + grativy, terminalVelocity);

//     // Update bird image when touch start is detected
//     document.addEventListener('touchstart', (e) => {
//         img.src = 'images/Bird-2.png';
//         bird_dy = -7.6; // Set the upward velocity when the bird jumps
//     });

//     // Update bird image when touch end is detected
//     document.addEventListener('touchend', (e) => {
//         img.src = 'images/Bird.png';
//     });

//     // Check if the bird is touching the top or bottom of the screen
//     if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
//         // Game over condition
//         game_state = 'End';
//         message.style.left = '28vw';
//         window.location.reload();
//         message.classList.remove('messageStyle');
//         return;
//     }

//     // Move the bird vertically based on its velocity
//     bird.style.top = bird_props.top + bird_dy + 'px';
//     bird_props = bird.getBoundingClientRect();

//     // Call apply_gravity function recursively using requestAnimationFrame
//     requestAnimationFrame(apply_gravity);
// }

// let bird_dy = 0;
// const terminalVelocity = 2; // Define the maximum downward speed

// function apply_gravity() {
//     if (game_state !== 'Play') return;

//     bird_dy = Math.min(bird_dy + grativy, terminalVelocity);

//     // Update bird image and velocity when touch start is detected or arrow key is pressed
//     const jumpAction = () => {
//         img.src = 'images/Bird-2.png';
//         bird_dy = -7.6; // Set the upward velocity when the bird jumps
//     };
//     document.addEventListener('touchstart', jumpAction);
//     document.addEventListener('keydown', (e) => {
//         if (e.key === 'ArrowUp' || e.key === ' ') {
            
//             jumpAction();
//         }
//     });

//     // Update bird image when touch end is detected
//     document.addEventListener('touchend', (e) => {
//         img.src = 'images/Bird.png';
//     });

//     // Check if the bird is touching the top or bottom of the screen
//     if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
//         // Game over condition
//         game_state = 'End';
//         message.style.left = '28vw';
//         window.location.reload();
//         message.classList.remove('messageStyle');
//         return;
//     }

//     // Move the bird vertically based on its velocity
//     bird.style.top = bird_props.top + bird_dy + 'px';
//     bird_props = bird.getBoundingClientRect();

//     // Call apply_gravity function recursively using requestAnimationFrame
//     requestAnimationFrame(apply_gravity);
// }



function apply_gravity() {
    if (game_state !== 'Play') return;

    bird_dy = Math.min(bird_dy + grativy, terminalVelocity);

    // Function to handle jump action (change image and set upward velocity)
    const jumpAction = () => {
        img.src = 'images/Bird-2.png';
        bird_dy = -7.6; // Set the upward velocity when the bird jumps
    };

    // Update bird image and velocity when touch start is detected
    document.addEventListener('touchstart', jumpAction);

    // Update bird image and velocity when arrow up key is pressed
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            jumpAction();
        }
    });

    // Reset bird image when touch end is detected
    document.addEventListener('touchend', (e) => {
        img.src = 'images/Bird.png';
    });

    // Reset bird image when arrow up key is released
    document.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowUp' || e.key === ' ') {
            img.src = 'images/Bird.png';
        }
    });

    // Check if the bird is touching the top or bottom of the screen
    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
        // Game over condition
        game_state = 'End';
        message.style.left = '28vw';
        window.location.reload();
        message.classList.remove('messageStyle');
        return;
    }

    // Move the bird vertically based on its velocity
    bird.style.top = bird_props.top + bird_dy + 'px';
    bird_props = bird.getBoundingClientRect();

    // Call apply_gravity function recursively using requestAnimationFrame
    requestAnimationFrame(apply_gravity);
}



    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;

    let pipe_gap = 35;

    function create_pipe(){
        if(game_state != 'Play') return;

        if(pipe_seperation > 115){
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
    requestAnimationFrame(create_pipe);
}





// Define bird_dy outside the functions to make it accessible globally
// 


let bird_dy = 0;
const terminalVelocity = 2; // Define the maximum downward speed

// Function to start the game
function startGame() {
    if (game_state !== 'Play') {
        // Reset game state and display necessary elements
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
        play(); // Call the play function to start the game
    }
}

// Function to handle touch start event
function handleTouchStart(e) {
    startGame(); // Start the game when touched
}

// Function to handle touch end event
function handleTouchEnd(e) {
    // No action needed for touch end
}

// Add touch event listeners for touchstart and touchend
document.addEventListener('touchstart', handleTouchStart);
document.addEventListener('touchend', handleTouchEnd);

// Apply gravity function (unchanged)
// function apply_gravity() {
//     if (game_state !== 'Play') return;

//     bird_dy = Math.min(bird_dy + grativy, terminalVelocity);

//     document.addEventListener('keydown', (e) => {
//         if (e.key === 'ArrowUp' || e.key === ' ') {
//             img.src = 'images/Bird-2.png';
//             bird_dy = -7.6; // Set the upward velocity when the bird jumps
//         }
//     });

//     document.addEventListener('keyup', (e) => {
//         if (e.key === 'ArrowUp' || e.key === ' ') {
//             img.src = 'images/Bird.png';
//         }
//     });

//     if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
//         game_state = 'End';
//         message.style.left = '28vw';
//         window.location.reload();
//         message.classList.remove('messageStyle');
//         return;
//     }

//     bird.style.top = bird_props.top + bird_dy + 'px';
//     bird_props = bird.getBoundingClientRect();

//     requestAnimationFrame(apply_gravity);
// }

// Function to handle touch start event
// function handleTouchStart(e) {
//     if (game_state !== 'Play') {
//         startGame(); // Start the game if not already playing
//     } else {
//         img.src = 'images/Bird-2.png'; // Change bird image
//         bird_dy = -7.6; // Set upward velocity when touched
//     }
// }


