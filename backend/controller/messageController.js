function signalNewGeneralMessage(req, res) {
  const data = req.body;
  const messages = [
    ...data.messages,
    {
      message: data.new_message,
      index: req.body.messages.length,
      sender: req.user,
      at: new Date()
    }
  ]

  req.app.io.emit("new_general_message", messages);
  res.json();
}

function signalReactToMessage(req, res) {
  const data = req.body;
  const messages = [...data.messages];
  messages[data.msgIdx].emoji = data.emoji;
  req.app.io.emit("message_reaction", messages);
  res.json();
}

async function fetchEmojis(_req, res) {
  const emojisResponse = await fetch(`https://emoji-api.com/emojis?access_key=${process.env.OPEN_EMOJI_API_KEY}`);
  if (!emojisResponse.ok) return res.json({ message: "Fail to fetch emojis" });

  const emojis = await emojisResponse.json();
  const corruptedIcons = [
    "1FAE0", "1FAE1", "1FAE2", "1FAE3", "1FAE4", "1FAE5", "1FAE6", "1FAE8", "1F979", "1FA75",
    "1FA76", "1FA77", "1F9CC", "1FAF0", "1FAF1", "1FAF2", "1FAF3", "1FAF4", "1FAF5", "1FAF6",
    "1FAF7", "1FAF8", "1FAC3", "1FAC4", "1FAC5", "1FACE", "1FACF", "1FABD", "1FABF", "1FABA",
    "1FAB7", "1FAB8", "1FAB9", "1FABB", "1FABC", "1FAD7", "1FAD8", "1FAD9", "1FADA", "1FADB",
    "1F6D6", "1F6DC", "1F6DD", "1F6DE", "1F6Df", "1FAA9", "1FAAD", "1FAAE", "1FAAF", "1F7F0",
    "1FA7B", "1FA7C", "1FAAA", "1FAAC", "1FAE7", "1FAAB", "1FA87", "1FA88", "1F6DF"
  ];

  const filteredEmojis = emojis.filter(emoji => !corruptedIcons.includes(emoji.codePoint) && !emoji.character.includes("🫱"));
  res.json(filteredEmojis);
}

module.exports = {
  signalNewGeneralMessage,
  signalReactToMessage,
  fetchEmojis
}
