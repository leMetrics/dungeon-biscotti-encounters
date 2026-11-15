---
id: your-card-id            # must equal the file name without .md
title: Your Card Title
type: combat                # combat | social | exploration | puzzle | mixed
duration: 30                # minutes, 20 to 45
terrain: [road]             # one or more tags
twist_type: hidden-truth    # hidden-truth | clock | shifting-ground | third-party | hard-choice | different-goal
levels:                     # exactly levels 1 to 5, each built for 4 players
  1:
    roster: [{ name: Bandit, count: 4 }, { name: Tough, count: 2 }]   # SRD 5.2.1 names, exact spelling and case
    plus5: "+2 Bandits"     # the one change for a 5th player
    dc: 12                  # the DC for checks and saves at this level
    hazard: "1d4"           # optional: damage for traps and environment
  2: { roster: [], plus5: "", dc: 12 }
  3: { roster: [], plus5: "", dc: 13 }
  4: { roster: [], plus5: "", dc: 14 }
  5: { roster: [], plus5: "", dc: 15 }
---

## Hook

One or two sentences the DM can read aloud or paraphrase.

## Setup

What is here before the players act. One idea per line.

## Twist

What is really going on, what triggers it, and how players can discover it.
If the twist can be removed without changing what players do, rewrite it.
The twist must work identically at every level; only numbers change.

## Terrain and tactics

Three lines at most.

## Ways out without a fight

At least one. Name the check and use "the DC" for the level's number.

## Ripple

What other tables or later episodes could hear, per outcome.

## Reskin notes

How to drop it into another place or story. No campaign secrets: this file is public.
