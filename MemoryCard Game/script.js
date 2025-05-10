// Variables to store the flipped cards
let flippedCards = [];
let lockBoard = false; // Prevent new cards from being flipped while comparing
let attempts = 0; // Track the number of attempts
let matchedPairs = 0; // Track the number of matched pairs
let maxAttempts = 10; // Max allowed attempts (Updated to 10)
let totalCards = 16; // Total number of cards (pairs)
const cardFaces = [
  'https://img.icons8.com/color/96/apple.png',
  'https://img.icons8.com/color/96/banana.png',
  'https://img.icons8.com/color/96/cherry.png',
  'https://img.icons8.com/color/96/grapes.png',
  'https://img.icons8.com/color/96/orange.png',
  'https://img.icons8.com/color/96/watermelon.png',
  'https://img.icons8.com/color/96/strawberry.png',
  'https://img.icons8.com/color/96/kiwi.png',
  'https://img.icons8.com/color/96/mango.png',         // Mango added here
  'https://img.icons8.com/color/96/blueberry.png'      // Blueberry added here
];

const cards = [...cardFaces, ...cardFaces]; // Duplicate the array to make pairs
shuffle(cards); // Shuffle the card faces

const cardContainer = document.querySelector('.card-container');
const attemptsDisplay = document.querySelector('#attempts'); // To display attempts
const winMessage = document.querySelector('#win-message'); // To display the win message
const remainingAttempts = document.querySelector('#remaining-attempts'); // To display remaining attempts

// Create card elements dynamically
cards.forEach((cardFace, index) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-id', index);

  const front = document.createElement('div');
  front.classList.add('front');
  
  const back = document.createElement('div');
  back.classList.add('back');
  
  // Create the image element for the back of the card
  const img = document.createElement('img');
  img.src = cardFace; // Set the image source to the current card face URL
  img.alt = 'fruit'; // Add an alt text for accessibility
  img.style.width = '100%'; // Ensure the image fits the card
  img.style.height = '100%';
  img.style.objectFit = 'contain'; // Ensure the image maintains aspect ratio

  back.appendChild(img); // Append the image to the back of the card
  card.appendChild(front); // Append the front of the card
  card.appendChild(back);  // Append the back of the card

  card.addEventListener('click', flipCard); // Add click event listener to flip the card

  cardContainer.appendChild(card); // Add the card to the container
});

// Shuffle function to randomize the card positions
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
}

// Function to handle card flipping
function flipCard() {
  if (lockBoard) return; // Prevent flipping when the board is locked
  if (flippedCards.length === 2) return; // Only allow two cards to be flipped at once
  const card = this;

  // Prevent flipping already matched cards
  if (card.classList.contains('matched')) return;

  card.classList.add('flipped');
  flippedCards.push(card);

  // If two cards are flipped, check if they match
  if (flippedCards.length === 2) {
    checkMatch();
  }
}

// Function to check if the two flipped cards match
function checkMatch() {
  const [firstCard, secondCard] = flippedCards;
  const firstFace = firstCard.querySelector('.back img').src;
  const secondFace = secondCard.querySelector('.back img').src;

  attempts++; // Increase attempts
  attemptsDisplay.textContent = `Attempts: ${attempts}`; // Update the attempts count
  remainingAttempts.textContent = `Remaining Attempts: ${maxAttempts - attempts}`; // Update remaining attempts

  // If the cards match
  if (firstFace === secondFace) {
    matchedPairs++; // Increase matched pairs
    firstCard.classList.add('matched'); // Mark as matched
    secondCard.classList.add('matched'); // Mark as matched
    resetBoard();
    if (matchedPairs === cardFaces.length) {
      setTimeout(() => {
        winMessage.textContent = `You won! Total Attempts: ${attempts}`; // Display win message
        setTimeout(startGame, 2000); // Restart the game after 2 seconds
      }, 500);
    }
  } else {
    // If the cards don't match, hide them again after 1 second
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      resetBoard();
    }, 1000);
  }

  // Check for loss condition
  if (attempts >= maxAttempts) {
    setTimeout(() => {
      winMessage.textContent = `You lose! You exceeded the maximum attempts.`;
      setTimeout(startGame, 2000); // Restart the game after 2 seconds
    }, 500);
  }
}

// Function to reset the board after a match or mismatch
function resetBoard() {
  flippedCards = [];
  lockBoard = false;
}

// Function to restart the game
function startGame() {
  attempts = 0;
  matchedPairs = 0;
  winMessage.textContent = '';
  flippedCards = [];
  lockBoard = false;
  shuffle(cards); // Shuffle cards again for the new game
  const allCards = document.querySelectorAll('.card');
  allCards.forEach(card => card.classList.remove('flipped', 'matched')); // Reset all cards
  attemptsDisplay.textContent = `Attempts: ${attempts}`;
  remainingAttempts.textContent = `Remaining Attempts: ${maxAttempts}`;
}
