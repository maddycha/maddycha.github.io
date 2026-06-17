Game thumbnails go here (imgs/games/thumbnail/).
Filenames must match the 'img' field in the GAMES array in js/script.js.
Square images look best (tiles + box art are square). e.g. hollowknight.jpg

Screenshots (auto-detected, no code edits needed):
Each game has its own folder one level up, in imgs/games/, named after its
thumbnail file without the extension. e.g. balatro.jpg -> imgs/games/balatro/
Name screenshots with sequential numbers and drop them in that folder:
  1.jpg, 2.jpg, 3.jpg, ...
The site probes 1, 2, 3 ... and stops at the first missing number, so keep them
gapless. Supported extensions: jpg, jpeg, png, gif, webp.
Numbered screenshots appear automatically on that game's detail page and in the
gallery tab. A game with no numbered files hides its Screenshots section.

Optional manual override: instead of numbering, put explicit filenames in that
game's 'shots' array in js/script.js, e.g. shots: ["boss.png", "ending.jpg"].
A non-empty 'shots' array is used instead of the 1,2,3 scan.
