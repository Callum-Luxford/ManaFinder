document.addEventListener("DOMContentLoaded", function () {
  let cardFlipped = false; // Declare globally

  // Form submission handler
  const cardForm = document.getElementById("cardForm");
  const card = document.getElementById("card");
    console.log(cardFlipped);
  if (cardForm) {
    cardForm.onsubmit = function () {
      document.getElementById("loading").style.display = "block"; // Show loading indicator
        console.log(cardFlipped);
      if (card) {
        card.classList.remove("flipped"); // Flip the card to the back
        cardFlipped = false; // Update the card flip status
        console.log(cardFlipped);
      }
    };
  }

  // Image load handler (card flip to front when image loads)
  const cardImage = document.getElementById("image");

  if (cardImage) {
    console.log(cardFlipped);
    cardImage.onload = function () {
      console.log("Image source:", cardImage.src); // Check if the image is correct
      if (card) {
        setTimeout(() => {
          if (!cardFlipped) {
            console.log(cardFlipped);
            // Ensure it flips only if it's not already flipped
            card.classList.add("flipped"); // Flip the card to the front
            console.log(cardFlipped);
            cardFlipped = true; // Update the flip status
            console.log(cardFlipped);
          }
        }, 300); // Delay for the flip effect
      }
    };
  }
});

