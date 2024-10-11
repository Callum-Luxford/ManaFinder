const axios = require("axios");
const NodeCache = require("node-cache");

// API REQUEST TO GET CARD BY TYPE
// LINKS TO /getCard ROUTE

let shownCards = []; // Set to keep track of shown card IDs

let lastCardType = null; // Variable to store the last selected card type
let cardBatch = []; // Variable to store the current batch of cards

const getCardByType = async (req, res) => {
  const cardType = req.body.cardType || "creature";
  console.log("Selected card type:", cardType); // Debug log

  // Check if the selected card type is different from the last one
  if (cardType !== lastCardType) {
    cardBatch = []; // Clear the card batch to fetch new cards
    shownCards = []; // Clear shown cards tracking
    lastCardType = cardType; // Update last card type
  }

  try {
    // If the batch is empty, fetch a new batch of cards
    if (cardBatch.length === 0) {
      const response = await axios.get(
        "https://api.scryfall.com/cards/search",
        {
          params: {
            q: `t:${cardType}`, // Query based on the selected card type
            order: "random", // Randomize the order
            unique: "prints", // Ensure unique card prints
            pageSize: 30, // Fetch 30 cards
          },
        }
      );

      console.log(response.data); // Debugging: log the response data
      cardBatch = response.data.data; // Store the new batch of cards
      // Reset shown cards tracking since we have a new batch
      shownCards = [];
    }

    // Filter the batch to exclude already shown cards
    const availableCards = cardBatch.filter(
      (card) => !shownCards.includes(card.id)
    );

    // If no available cards remain, reset shownCards and refresh the batch
    if (availableCards.length === 0) {
      shownCards = []; // Reset shown cards
      return getCardByType(req, res); // Recursively fetch a new batch
    }

    // Select a random card from the filtered list of available cards
    const randomCard =
      availableCards[Math.floor(Math.random() * availableCards.length)];

    // Check for multiple image sources
    let imageUrl;
    if (randomCard.image_uris) {
      imageUrl =
        randomCard.image_uris.normal ||
        randomCard.image_uris.large ||
        randomCard.image_uris.png ||
        null;
    } else {
      imageUrl = null; // No images available
    }

    // If no image URL is found, render an error message
    if (!imageUrl) {
      return res.render("index", {
        card: null,
        message: "No image available for this card.",
      });
    }

    // Store the card ID in shownCards to prevent showing it again
    shownCards.push(randomCard.id);

    // Pass the card data to the view after a delay for the flip animation
    setTimeout(() => {
      res.render("index", {
        card: {
          name: randomCard.name,
          imageUrl: imageUrl,
          manaCost: randomCard.mana_cost,
          type: randomCard.type_line,
          rarity: randomCard.rarity,
          setName: randomCard.set_name,
          power: randomCard.power,
          toughness: randomCard.toughness,
          text: randomCard.oracle_text,
        },
        cardType: cardType,
        message: null,
      });
    }, 1000); // 1 second delay for the flip effect
    console.log("This is the random card", randomCard.name);
  } catch (error) {
    console.error("Error fetching card from Scryfall:", error.message);
    res.render("index", { card: null, message: "Error fetching card data" });
  }
};

module.exports = { getCardByType };
