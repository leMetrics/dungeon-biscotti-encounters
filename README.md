# Dungeon Biscotti Encounters

Ready-to-run encounters for D&D 2024. Every card works at levels 1 to 5, for 4 or 5 players, and every card has a twist.

**Browse the cards:** https://lemetrics.github.io/dungeon-biscotti-encounters/

Made for [Dungeon Biscotti](https://dungeonbiscotti.com/), a monthly multi-table D&D evening in Amsterdam, and free for any DM to use.

## How a card works

- Pick the card, pick your table's level, and run that line. Each line is built for 4 players and says what to add for a 5th.
- The **Twist** and **Ripple** sections are for the DM. On the site they sit behind a "DM only" bar. Players, please don't open these. It's more fun that way.
- **Ripple** says what other tables might hear afterwards, for groups running a shared story.

## Add a card

1. Copy `CARD_TEMPLATE.md` to `cards/your-card-id.md` and fill it in.
2. Run the checks:

   ```
   npm install
   npm run validate
   npm test
   ```

3. Preview the site with `npm run serve`.
4. Open a pull request. The site publishes itself when the checks pass on `main`.

The checker enforces the house rules:

- Levels 1 to 5 are all present, each with a line for a 5th player and a DC.
- Monsters are named exactly as in the free rules (SRD 5.2.1) and listed in `lib/srd-monsters.json`. That list is a curated subset: check a creature's name and CR against the SRD before adding it.
- Combat and mixed encounters stay between the low and high XP budget for four characters of that level.
- Every card has a twist, at most three lines of tactics, and at least one way out without a fight.

Two rules the checker can't enforce, so please do:

- **The twist must matter.** If you can remove it without changing what players do, rewrite it. It works the same at every level; only numbers change.
- **No campaign secrets.** This repository is public. Keep cards setting-neutral and put your own story in your own notes.

## Licence and credits

- Card text in `cards/`: [CC-BY 4.0](https://creativecommons.org/licenses/by/4.0/), © Dungeon Biscotti contributors.
- Code: MIT.
- Fonts: Alegreya and Source Sans 3, SIL Open Font License.

This work includes material from the System Reference Document 5.2.1 (“SRD 5.2.1”) by Wizards of the Coast LLC, available at https://www.dndbeyond.com/srd. The SRD 5.2.1 is licensed under the Creative Commons Attribution 4.0 International License, available at https://creativecommons.org/licenses/by/4.0/legalcode.

A fan project. Not affiliated with or endorsed by Wizards of the Coast.
