let move_speed = 3,
  gravity = 0.5;
let bird = document.querySelector(".bird");
let img = document.getElementById("bird-1");
let sound_point = new Audio("sounds effect/point.mp3");
let sound_die = new Audio("sounds effect/die.mp3");
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector(".background").getBoundingClientRect();
let score_val = document.querySelector(".score_val");
let message = document.querySelector(".message");
let score_title = document.querySelector(".score_title");
let game_state = "Start";
img.style.display = "none";
message.classList.add("messageStyle");

const quizContainer = document.getElementById("quiz-container");
const quizQuestion = document.getElementById("quiz-question");
const optionA = document.getElementById("option-a");
const optionB = document.getElementById("option-b");
const optionC = document.getElementById("option-c");
const optionD = document.getElementById("option-d");
const touchArea = document.getElementById("touch-area");

touchArea.addEventListener("touchstart", () => {
  if (game_state == "Play") {
    img.src = "images/Bird-2.png";
    bird_dy = -7.6;
  }
});

touchArea.addEventListener("touchend", () => {
  if (game_state == "Play") {
    img.src = "images/Bird.png";
  }
});

const questions = [
  {
    question: "Jika kalian melihat ada pengedar narkoba apa yang harus dilakukan?",
    options: ["mengejarnya", "menghabisinya", "melaporkan ke pihak berwajib", "membiarkannya"],
    correct: "C",
  },
  {
    question: "Narkotika dibagi berapa golongan?",
    options: ["2", "3", "1", "4"],
    correct: "B",
  },
  {
    question: "Apa dampak negatif dari narkotika dilingkungan sosial?",
    options: ["mendekat", "menjauh", "mengejar", "merundung"],
    correct: "B",
  },
  {
    question: "Apa dampak negatif narkotika bagi kesehatan?",
    options: ["merusak organ tubuh dan mengganggu kesehatan", "membuat tubuh kuat dan vit", "menjadi lelah", "membuat pingsan"],
    correct: "A",
  },
  {
    question: "Apakah narkotika bisa dijadikan bahan pengobatan?",
    options: ["mungkin", "bisa", "tidak tau", "tidak bisa"],
    correct: "B",
  },
];

function showQuiz() {
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  quizQuestion.innerText = randomQuestion.question;
  optionA.innerText = `A. ${randomQuestion.options[0]}`;
  optionB.innerText = `B. ${randomQuestion.options[1]}`;
  optionC.innerText = `C. ${randomQuestion.options[2]}`;
  optionD.innerText = `D. ${randomQuestion.options[3]}`;
  quizContainer.style.display = "block";

  const checkAnswer = (selectedOption) => {
    quizContainer.style.display = "none";
    if (selectedOption === randomQuestion.correct) {
      score_val.innerText = +score_val.innerText + 10;
    }
    gameOver();
  };

  optionA.onclick = () => checkAnswer("A");
  optionB.onclick = () => checkAnswer("B");
  optionC.onclick = () => checkAnswer("C");
  optionD.onclick = () => checkAnswer("D");
}

document.getElementById("play-button").addEventListener("click", () => {
  if (game_state != "Play") {
    document.querySelectorAll(".pipe_sprite").forEach((e) => {
      e.remove();
    });
    img.style.display = "block";
    bird.style.top = "40vh";
    game_state = "Play";
    message.innerHTML = "";
    score_title.innerHTML = "Score : ";
    score_val.innerHTML = "0";
    message.classList.remove("messageStyle");
    play();

    // Display mobile button if on mobile/tablet
    if (window.innerWidth <= 768) {
      document.getElementById("mobile-button").style.display = "block";
    }
  }
});

function gameOver() {
  game_state = "End";
  message.innerHTML = "Game Over".fontcolor("red") + "<br><button id='restart-button' onclick=restartGame()>Restart</button>";
  message.classList.add("messageStyle");
  img.style.display = "none";
  sound_die.play();
}

function restartGame() {
  window.location.reload();
}
document.getElementById("restart-button").addEventListener("click", () => {
  console.log("Tombol Restart ditekan!");
  window.location.reload();
});

function play() {
  function move() {
    if (game_state != "Play") return;

    let pipe_sprite = document.querySelectorAll(".pipe_sprite");
    pipe_sprite.forEach((element) => {
      let pipe_sprite_props = element.getBoundingClientRect();
      bird_props = bird.getBoundingClientRect();

      if (pipe_sprite_props.right <= 0) {
        element.remove();
      } else {
        if (
          bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width &&
          bird_props.left + bird_props.width > pipe_sprite_props.left &&
          bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height &&
          bird_props.top + bird_props.height > pipe_sprite_props.top
        ) {
          game_state = "Quiz"; // Menghentikan permainan
          showQuiz();
          return;
        } else {
          if (pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == "1") {
            score_val.innerHTML = +score_val.innerHTML + 1;
            sound_point.play();
          }
          element.style.left = pipe_sprite_props.left - move_speed + "px";
        }
      }
    });
    if (game_state == "Play") requestAnimationFrame(move); // Memastikan animasi berhenti saat masuk kuis
  }
  requestAnimationFrame(move);

  // Ambil tombol "Jump" berdasarkan ID
  const mobileButton = document.getElementById("mobile-button");

  // Tambahkan event listener untuk mendeteksi klik pada tombol "Jump"
  mobileButton.addEventListener("click", () => {
    jumpBird();
  });

  // Fungsi untuk membuat burung melompat
  function jumpBird() {
    if (game_state === "Play") {
      img.src = "images/Bird-2.png";
      bird_dy = -7.6;
    }
  }

  let bird_dy = 0;
  function apply_gravity() {
    if (game_state != "Play") return;
    bird_dy = bird_dy + gravity;
    document.addEventListener("keydown", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = "images/Bird-2.png";
        bird_dy = -7.6;
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key == "ArrowUp" || e.key == " ") {
        img.src = "images/Bird.png";
      }
    });

    if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
      game_state = "End";
      message.style.left = "28vw";
      window.location.reload();
      message.classList.remove("messageStyle");
      return;
    }
    bird.style.top = bird_props.top + bird_dy + "px";
    bird_props = bird.getBoundingClientRect();
    requestAnimationFrame(apply_gravity);
  }
  requestAnimationFrame(apply_gravity);

  let pipe_separation = 0;
  let pipe_gap = 35;

  function create_pipe() {
    if (game_state != "Play") return;

    if (pipe_separation > 115) {
      pipe_separation = 0;

      let pipe_posi = Math.floor(Math.random() * 43) + 8;
      let pipe_sprite_inv = document.createElement("div");
      pipe_sprite_inv.className = "pipe_sprite";
      pipe_sprite_inv.style.top = pipe_posi - 70 + "vh";
      pipe_sprite_inv.style.left = "100vw";

      document.body.appendChild(pipe_sprite_inv);
      let pipe_sprite = document.createElement("div");
      pipe_sprite.className = "pipe_sprite";
      pipe_sprite.style.top = pipe_posi + pipe_gap + "vh";
      pipe_sprite.style.left = "100vw";
      pipe_sprite.increase_score = "1";

      document.body.appendChild(pipe_sprite);
    }
    pipe_separation++;
    requestAnimationFrame(create_pipe);
  }
  requestAnimationFrame(create_pipe);
}
