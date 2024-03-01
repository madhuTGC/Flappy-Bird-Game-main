let QuestionList;
let currentQuestionIndex = 0;
let isGamePaused = false;
let bird_dy = 0;
const terminalVelocity = 5;
let pipe_seperation = 0;
let pipe_gap = 35;
var url = new URL(window.location.href);
var urlParams = new URLSearchParams(window.location.search);
let paramUserID = urlParams.get("Email");
let ParamOrgID = urlParams.get("OrgID");
let M2OstAssesmentID = urlParams.get("M2ostAssessmentId");
let id_game = urlParams.get("idgame");
let gameAssesmentId = urlParams.get("gameassid");
let UID = [];
const AssementData = [];
let assessmentAnsResponse = [];
var sum = 0;
let assessmentTypeGame;
let point = 0;

async function getIdUser(
  url = `https://www.playtolearn.in/Mini_games/api/UserDetail?OrgId=${ParamOrgID}&Email=${paramUserID}`
  // Asynchronously fetch user ID data from the specified URL
) {
  try {
    const response = await fetch(url, { method: "GET" });
    const encryptedData = await response.json();
    const IdUser = JSON.parse(encryptedData);
    console.log(encryptedData);
    UID.push(IdUser);
    console.log(UID[0].Id_User);

    getDetails();

    return encryptedData;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}

async function getDetails(
  url = `https://www.playtolearn.in/Mini_games/api/GetAssessmentDataList?OrgID=${ParamOrgID}&UID=${UID[0].Id_User}&M2ostAssessmentId=${M2OstAssesmentID}&idgame=${id_game}&gameassid=${gameAssesmentId}`
) {
  try {
    const response = await fetch(url, { method: "GET" });

    const encryptedData = await response.json();
    QuestionList = JSON.parse(encryptedData);
    console.log("ResponseData", QuestionList);

    // Assuming the response is the encrypted data

    // loader.style.display = "none";
    // showPopup();

    return encryptedData;
  } catch (error) {
    console.error("Fetch error:", error.message);
    throw error;
  }
}

function initializePage() {
  try {
    getIdUser();
    console.log(UID[0].Id_User);
  } catch (error) {
    // console.error('Error during initialization:', error.message);
  }
}

document.addEventListener("DOMContentLoaded", initializePage);
let getResponse;

// Function to save assessment data to the server
// async function saveAssessment(data) {
//   let postData = data;

//   const baseUrl = "https://www.playtolearn.in/";
//   const endpoint = "Mini_games/api/assessmentdetailuserlog";
//   const url = baseUrl + endpoint;

//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       // Add any additional headers if required
//     },
//     body: JSON.stringify(postData),
//   });

//   // if (!response.ok) {
//   // throw new Error(`Network response was not ok, status code: ${response.status}`);
//   // }
//   console.log("response", response);
//   const responseData = await response.json();

//   return responseData;
// }

// Function to save assessment master log data to the server
// async function saveAssessmentMasterLog(data) {
//   let postData = data;
//   //  console.log( JSON.stringify(postData));

//   const baseUrl = "https://www.playtolearn.in/";
//   const endpoint = "Mini_games/api/gameusermasterlog";
//   const url = baseUrl + endpoint;

//   const response = await fetch(url, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       // Add any additional headers if required
//     },
//     body: JSON.stringify(postData),
//   });

//   // if (!response.ok) {
//   // throw new Error(`Network response was not ok, status code: ${response.status}`);

//   // }
//   // console.log('response',response);
//   const responseData = await response.json();

//   return responseData;
// }
function displayQuestion() {
  if (!isGamePaused && currentQuestionIndex < QuestionList.length) {
    pauseGame();

    let currentQuestion = QuestionList[currentQuestionIndex];
    displayQuestionInModal(QuestionList[currentQuestionIndex]);
    // Your existing code to display questions

    currentQuestionIndex++;
    // backgroundMusic.pause();
  }
}

function displayQuestionInModal(questionObj) {
  const question = questionObj.Assessment_Question;
  // console.log("question",question)
  // console.log("questionobj",questionObj)

  const content = questionObj.assessment_question_url;

  const options = questionObj.optionList;
  // console.log("option",options)
  var assessmentType = questionObj.Assessment_Type;
  var contentDiv = $("#contentDiv");

  // Clear existing content in contentDiv
  contentDiv.empty();

  // Depending on the assessment type, add the corresponding content
  if (assessmentType === 1) {
    // Add image
    var imageUrl = questionObj.assessment_question_url;
    var imageElement = $("<img>")
      .attr("src", imageUrl)
      .attr("alt", "Image Alt Text")
      .css({
        width: "100%",
        "max-width": "100%",
        height: "26vh",
        "border-radius": "10px",
      });
    contentDiv.append(imageElement);
  } else if (assessmentType === 2) {
    // Add audio
    var audioUrl = questionObj.assessment_question_url;
    var audioElement = $("<audio controls>").attr("src", audioUrl);
    contentDiv.append(audioElement);
  } else if (assessmentType === 3) {
    // Add video
    var videoUrl = questionObj.assessment_question_url;
    var videoElement = $("<video controls>").attr("src", videoUrl).css({
      width: "100%",
      "max-width": "100%",
      height: "26vh",
    });
    contentDiv.append(videoElement);
  } else {
    // Handle other assessment types or provide a default behavior
    // contentDiv.text('Unsupported assessment type');
  }

  // Display question number and text
  const questionNumber = currentQuestionIndex + 1;

  $("#questionText").html(`${question}`);

  // Clear existing options
  $(".radio-container").empty();

  // Iterate over options and create radio buttons
  options.forEach((option, index) => {
    const optionLabel = $("<label>").text(option.Answer_Description);
    const optionInput = $("<input>").attr({
      type: "radio",
      name: "group",
      value: `${index + 1}`,
    });

    optionLabel.prepend(optionInput);
    $(".radio-container").append(optionLabel);
  });

  $("#continueButton")
    .off("click")
    .on("click", function () {
      const selectedOption = $("input[name=group]:checked").val();

      if (selectedOption) {
        console.log("c", selectedOption);
        $("#questionModal").modal("hide");
        // currentQuestionIndex++;
        // document.getElementById("jet").style.display = "block";

        resumeGame();

        const errorTextElement = $("#error-text");
        errorTextElement.text("");
        const option = questionObj.optionList;
        // console.log(option);
        AssementData.push(questionObj);
        console.log("q", questionObj);

        // console.log(selectedOption);
        // console.log(QuestionList[currentQuestionIndex - 1].optionList[selectedOption-1]);
        if (
          QuestionList[currentQuestionIndex - 1].optionList[selectedOption - 1]
            .Right_Ans == "1"
        ) {
          console.log("correct ans");

          id_question =
            QuestionList[currentQuestionIndex - 1].optionList[
              selectedOption - 1
            ].Id_Assessment_question_ans;
          GivenAns = "1";
          scores = 10;
          // if (currentQuestionIndex === QuestionList.length) {
          //   onGameOver(); // Call onGameOver only after all questions have been answered
          //   document.getElementById("board").style.display ='none';

          // }
        } else {
          console.log("wrong answer");
          // Incorrect answer
          id_question =
            QuestionList[currentQuestionIndex - 1].optionList[
              selectedOption - 1
            ].Id_Assessment_question_ans;
          GivenAns = "2";
          scores = 0;
          // if (currentQuestionIndex === QuestionList.length) {
          //   onGameOver(); // Call onGameOver only after all questions have been answered
          //   document.getElementById("board").style.display ='none';

          // }
        }

        const assessmentAnsResponse = {
          isRightAns: GivenAns,
          AchieveScore: scores,
          id_question: id_question,
        };

        // console.log("assessmentAnsResponse",assessmentAnsResponse)

        // assessmentObject.push(assessmentAnsResponse);
        // console.log("first", assessmentObject);
        if (currentQuestionIndex === QuestionList.length) {
          onGameOver(); // Call onGameOver only after all questions have been answered
          document.getElementById("board").style.display = "none";
        }
      } else {
        const errorTextElement = $("#error-text");
        errorTextElement.text("Click any one option");

        const id_question =
          QuestionList[currentQuestionIndex - 1].optionList[0]
            .Id_Assessment_question_ans; // Assuming the first option represents skipping the question

        const assessmentAnsResponse = {
          isRightAns: "2",
          AchieveScore: sum + 0,
          id_question: null,
        };
        // console.log("assessmentAnsResponse",assessmentAnsResponse)

        // assessmentObject.push(assessmentAnsResponse);

        // console.log("assessmentAnsResponse", assessmentAnsResponse);
      }
    });

  let timer = 600; // Set the timer duration in seconds
  const timerElement = $("#timer");
  timerElement.text(`${timer} sec`);

  const timerInterval = setInterval(() => {
    timer--;

    if (timer >= 0) {
      timerElement.text(`${timer} Sec`);
    } else {
      clearInterval(timerInterval);
      // Time's up, handle it as needed

      onTimeUp();
      if (currentQuestionIndex === QuestionList.length) {
        onGameOver(); // Call onGameOver only after all questions have been answered
        document.getElementById("board").style.display = "none";
      }
    }
  }, 1000);

  // Clear timer when modal is hidden
  $("#questionModal").on("hidden.bs.modal", function () {
    clearInterval(timerInterval);
  });

  // Show the question modal
  $("#questionModal").modal("show");
}

function onTimeUp() {
  isGamePaused = true; // Set player start to true to resume the game

  const id_question =
    QuestionList[currentQuestionIndex - 1].optionList[0]
      .Id_Assessment_question_ans;
  console.log("currentIndex", currentQuestionIndex);
  AssementData.push(QuestionList[currentQuestionIndex - 1]);
  console.log("TimeUpData", AssementData);
  QuestionList[currentQuestionIndex];
  console.log("new_ques", QuestionList[currentQuestionIndex]);

  const assessmentAnsResponse = {
    // isRightAns: GivenAns,
    // AchieveScore: sum + 0,
    // id_question: null,
  };

  // assessmentObject.push(assessmentAnsResponse);
  // console.log("first", assessmentObject);

  // Handle the timeout logic here

  // Automatically select an option (you can modify this based on your logic)
  $("input[name=group]").first().prop("checked", true);

  resumeGame();

  // Hide the question modal
  $("#questionModal").modal("hide");
  // document.getElementById("jet").style.display = "block";
}

function pauseGame() {
  isGamePaused = true;
  message.classList.add("pausedMessage");
}

function resumeGame() {
  isGamePaused = false;
  document.getElementById("bird-1").style.display = "block";
  $("#questionModal").modal("hide"); // Close the modal

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

document.body.addEventListener("click", (e) => {
  if (game_state === "Play") {
    jumpAction(); // Trigger jump action when body is clicked
  }
});

let move_speed = 3,
  gravity = 0.5;
let bird = document.querySelector(".bird");
let img = document.getElementById("bird-1");
let sound_point = new Audio("sounds effect/point.mp3");
let bonus_point = new Audio("sounds effect/bonus.mp3");


let bird_props = bird.getBoundingClientRect();
let background = document.querySelector(".background").getBoundingClientRect();
let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");
let game_state = "Start";

img.style.display = "none";
message.classList.add("messageStyle");

document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.getElementById("startButton");
  startButton.addEventListener("click", startGameOnClick);
});

function startGameOnClick() {
  document.getElementById("finnyfishlogo").style.display = "none";
  document.getElementById("startButton").style.display = "none";

  if (game_state !== "Play") {
    game_state = "Play";
    document.querySelectorAll(".pipe_sprite").forEach((e) => {
      e.remove();
    });
    img.style.display = "block";
    bird.style.top = "40vh";
    message.innerHTML = "";
    score_title.innerHTML = "Score : ";
    score_val.innerHTML = "0";
    message.classList.remove("messageStyle");
    play();
  }
}

function play() {
  requestAnimationFrame(move);
  requestAnimationFrame(apply_gravity);
  requestAnimationFrame(create_pipe);
}

// function move() {
//   if (!isGamePaused) {
//     let pipe_sprite = document.querySelectorAll('.pipe_sprite');
//     pipe_sprite.forEach((element) => {
//       let pipe_sprite_props = element.getBoundingClientRect();
//       bird_props = bird.getBoundingClientRect();

//       if (pipe_sprite_props.right <= 0) {
//         element.remove();
//       } else {
//         if (
//           pipe_sprite_props.right < bird_props.left &&
//           pipe_sprite_props.right + move_speed >= bird_props.left &&
//           element.increase_score == '1'
//         ) {
//           score_val.innerHTML = +score_val.innerHTML + 1;
//           sound_point.play();
//           displayQuestion();

//           pauseGame();
//           console.log("madhu")
//         }
//         element.style.left = pipe_sprite_props.left - move_speed + 'px';
//       }
//     });
//   }
//   if (!isGamePaused) {
//     requestAnimationFrame(move);
//   }
// }
const backgroundMusic = document.getElementById("backgroundMusic");

// function move() {
//   if (!isGamePaused) {
//     let pipe_sprite = document.querySelectorAll(".pipe_sprite");
//     pipe_sprite.forEach((element) => {
//       let pipe_sprite_props = element.getBoundingClientRect();
//       bird_props = bird.getBoundingClientRect();

//       if (pipe_sprite_props.right <= 0) {
//         element.remove();
//       } else {
//         if (
//           pipe_sprite_props.right < bird_props.left &&
//           pipe_sprite_props.right + move_speed >= bird_props.left &&
//           element.increase_score == "1"
//         ) {
//           score_val.innerHTML = +score_val.innerHTML + 1;
//           // displayQuestion();
//           // pauseGame();
//         }
//         element.style.left = pipe_sprite_props.left - move_speed + "px";
//       }
//     });

//     // Check if the bird overlaps with any coin
//     let coins = document.querySelectorAll(".coin");
//     coins.forEach((coin) => {
//       let coinRect = coin.getBoundingClientRect();
//       if (
//         bird_props.left + 5 <= coinRect.right &&
//         bird_props.right + 5 >= coinRect.left &&
//         bird_props.top - 5 <= coinRect.bottom &&
//         bird_props.bottom + 5 >= coinRect.top
//       ) {
//         console.log("bird", bird_props);
//         console.log("coin", coinRect);
//         sound_point.play();

//         coin.remove(); // Remove the coin
//         displayQuestion();
//         // alert("madhu")
//         pauseGame();
//         point += 10;

//         console.log("point", point);
//         // score_val.innerHTML = +score_val.innerHTML + 10; // Increase score by 10 points
//       }
//     });
//   }

//   if (!isGamePaused) {
//     requestAnimationFrame(move);
//   }
// }


function move() {
  if (!isGamePaused) {
    let pipe_sprite = document.querySelectorAll(".pipe_sprite");
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        if (
          pipe_sprite_props.right < bird_props.left &&
          pipe_sprite_props.right + move_speed >= bird_props.left &&
          element.increase_score == "1"
        ) {
          score_val.innerHTML = +score_val.innerHTML + 1;
          // displayQuestion();
          // pauseGame();
        }
        element.style.left = pipe_sprite_props.left - move_speed + "px";
      }
    });

    // Check if the bird overlaps with any coin
    let coins = document.querySelectorAll(".coin");
    coins.forEach((coin) => {
      let coinRect = coin.getBoundingClientRect();
      if (
        bird_props.left + 5 <= coinRect.right &&
        bird_props.right + 5 >= coinRect.left &&
        bird_props.top - 5 <= coinRect.bottom &&
        bird_props.bottom + 5 >= coinRect.top
      ) {
        console.log("bird", bird_props);
        console.log("coin", coinRect);
        sound_point.play();

        coin.remove(); // Remove the coin
        displayQuestion();
        // alert("madhu")
        pauseGame();
        point += 10;

        console.log("point", point);
        // score_val.innerHTML = +score_val.innerHTML + 10; // Increase score by 10 points
      }
    });

    // Check if the bird overlaps with any food
    let foods = document.querySelectorAll(".food");
    foods.forEach((food) => {
      let foodRect = food.getBoundingClientRect();
      if (
        bird_props.left + 5 <= foodRect.right &&
        bird_props.right + 5 >= foodRect.left &&
        bird_props.top - 5 <= foodRect.bottom &&
        bird_props.bottom + 5 >= foodRect.top
      ) {
        console.log("bird", bird_props);
        console.log("food", foodRect);
        bonus_point.play();

        food.remove(); // Remove the food
        // alert("madhu")
        point += 20;

        console.log("point", point);
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

      // Create upper pipe
      let upper_pipe_sprite = document.createElement("div");
      upper_pipe_sprite.className = "pipe_sprite upper-pipe"; // Add class for upper pipe
      upper_pipe_sprite.style.top = pipe_posi - 70 + "vh"; // Adjust the position of the upper pipe
      upper_pipe_sprite.style.left = "100vw";

      document.body.appendChild(upper_pipe_sprite);

      // Create lower pipe
      let lower_pipe_sprite = document.createElement("div");
      lower_pipe_sprite.className = "pipe_sprite lower-pipe"; // Add class for lower pipe
      lower_pipe_sprite.style.top = pipe_posi + pipe_gap + "vh"; // Adjust the position of the lower pipe
      lower_pipe_sprite.style.left = "100vw";

      lower_pipe_sprite.increase_score = "1";

      // Create a coin between the pipes
      createCoin(pipe_posi, pipe_gap);
      // Create a food between the pipes
      createFood(pipe_posi, pipe_gap);

      document.body.appendChild(lower_pipe_sprite);
    }
    pipe_seperation++;
    requestAnimationFrame(create_pipe);
  }
}

function createCoin(pipe_posi, pipe_gap) {
  console.log("coin");
  // Randomly generate the position of the coin between the pipes
  let coinPos = pipe_posi + pipe_gap / 2; // Place the coin at the center of the gap
  let coin = document.createElement("img");
  coin.src = "images/coin.gif"; // Path to your coin image file
  coin.className = "coin";
  coin.style.position = "fixed"; // Ensure the coin is positioned absolutely

  // Randomize the vertical position of the coin within the gap
  let randomVerticalOffset = Math.random() * pipe_gap * 0.5; // Adjust this multiplier as needed
  coin.style.top = coinPos - randomVerticalOffset + "vh";

  coin.style.left = "100vw"; // Initially position the coin outside the screen

  document.body.appendChild(coin);

  // Move the coin towards the left
  let moveCoinInterval = setInterval(() => {
    if (!isGamePaused) {
      let coinRect = coin.getBoundingClientRect();
      if (coinRect.left < 0) {
        clearInterval(moveCoinInterval);
        coin.remove(); // Remove the coin when it goes out of the screen
      } else {
        coin.style.left = coinRect.left - move_speed + "px";
      }
    }
  }, 16); // Adjust the interval as needed
}

function createFood(pipe_posi, pipe_gap) {
  console.log("food");
  // Randomly generate the position of the food between the pipes
  let foodPos = pipe_posi + pipe_gap / 2; // Place the food at the center of the gap
  let food = document.createElement("img");
  food.src = "images/food.png"; // Path to your food image file
  food.className = "food";
  food.style.position = "fixed"; // Ensure the food is positioned absolutely

  // Randomize the vertical position of the food within the gap
  let randomVerticalOffset = Math.random() * pipe_gap * 2; // Adjust this multiplier as needed
  food.style.top = foodPos + randomVerticalOffset + "vh";

  food.style.left = "100vw"; // Initially position the food outside the screen

  document.body.appendChild(food);

  // Move the food towards the left
  let moveFoodInterval = setInterval(() => {
    if (!isGamePaused) {
      let foodRect = food.getBoundingClientRect();
      if (foodRect.left < 0) {
        clearInterval(moveFoodInterval);
        food.remove(); // Remove the food when it goes out of the screen
      } else {
        food.style.left = foodRect.left - move_speed + "px";
      }
    }
  }, 16); // Adjust the interval as needed
}

const jumpAction = () => {
  img.src = "images/Bird.png"; // Change bird image to indicate jump
  bird_dy = -7.6; // Apply vertical velocity to make the bird jump

  // After a short delay, revert the bird image back to original
  setTimeout(() => {
    img.src = "images/Bird.png";
  }, 200); // Adjust the delay as needed
};

document.addEventListener("keydown", (e) => {
  if ((e.key === "ArrowUp" || e.key === " ") && game_state === "Play") {
    jumpAction(); // Trigger jump action when spacebar or up arrow key is pressed
  }
});

function apply_gravity() {
  if (!isGamePaused) {
    // Add a condition to check if the bird is already near the bottom
    if (bird_props.bottom >= background.bottom) {
      // Set the vertical velocity to zero if the bird is near the bottom
      bird_dy = 100;
      jumpAction();
    } else if (bird_props.top <= background.top) {
      // Limit upward movement by setting the vertical velocity to a positive value
      bird_dy = Math.max(bird_dy, 100);
    } else {
      // Apply gravity only if the bird is not near the bottom or top
      bird_dy = Math.min(bird_dy + gravity, terminalVelocity);
    }

    // Update the bird's vertical position
    bird.style.top = bird_props.top + bird_dy + "px";
    bird_props = bird.getBoundingClientRect();

    // Continue applying gravity
    requestAnimationFrame(apply_gravity);
  }
}

// Event listener for touchstart to start the game
// Event listener for touchend (optional)
document.addEventListener("touchend", () => {
  // Handle touchend event if needed
});

// Function to start the game
function startGame() {
  document.getElementById("finnyfishlogo").style.display = "none";
  document.getElementById("startButton").style.display = "none";
  backgroundMusic.play();

  if (game_state !== "Play") {
    game_state = "Play";
    document.querySelectorAll(".pipe_sprite").forEach((e) => {
      e.remove();
    });
    img.style.display = "block"; // Ensure bird image is displayed
    bird.style.top = "40vh"; // Set initial bird position
    message.innerHTML = "";
    score_title.innerHTML = "Score : ";
    score_val.innerHTML = "0";
    message.classList.remove("messageStyle");
    play();
  }
}

// Function to start the game when the start button is clicked
function startGameOnClick() {
  startGame(); // Call startGame function to start the game
}

// Add event listener to the start button
document
  .getElementById("startButton")
  .addEventListener("click", startGameOnClick);

// Function to hide the bird image at the beginning
function hideBird() {
  img.style.display = "none";
}

// Call hideBird() initially to hide the bird image
hideBird();

const backgroundImg = document.querySelector(".background");

function showPopup() {
  popup.classList.remove("hide");
  backgroundImg.style.filter = "blur(5px)";
  document.getElementById("startButton").style.display = "none";
}

function closePopup() {
  const popup = document.getElementById("popup");
  popup.classList.add("hide");
  backgroundImg.style.filter = "none";
  document.getElementById("startButton").style.display = "block";
}

function showNewPopup() {
  const newPopup = document.getElementById("newPopup");
  newPopup.classList.remove("hide");
  startScreen.style.filter = "blur(5px)";
}

function closeNewPopup() {
  const newPopup = document.getElementById("newPopup");
  newPopup.classList.add("hide");

  // Unblur the start screen
  const startScreen = document.querySelector(".startScreen");
  startScreen.style.filter = "none";
}

window.onload = function () {
  showPopup();
};

document.addEventListener("DOMContentLoaded", function () {
  showPopup();
});
