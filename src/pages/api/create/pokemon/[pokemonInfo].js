import { mongoConnection } from "@/utils/connect";

const Pokemon = require("../../../../models/Pokemon");

export default async function handler(req, res) {
  const { pokemonInfo } = req.query;

  try {
    const pokeRes = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonInfo}/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await pokeRes.json();

    await mongoConnection(); // establish database connection here

    let pokeTypes = [];
    let pokeLevel = 5;
    let pokeMoveset = {};

    for (let i = 0; i < data.types.length; i++) {
      pokeTypes.push(data.types[i].type.name);
    }

    let pokeSprites = [];
    pokeSprites.push(
      data.sprites.versions[`generation-v`][`black-white`].animated.back_default
    );
    pokeSprites.push(
      data.sprites.versions[`generation-v`][`black-white`].animated
        .front_default
    );
    let pokeMoves = data.moves
      .filter((move) =>
        move.version_group_details.some(
          (detail) => detail.move_learn_method.name === "level-up"
        )
      )
      .sort(
        (a, b) =>
          a.version_group_details.find(
            (detail) => detail.move_learn_method.name === "level-up"
          ).level_learned_at -
          b.version_group_details.find(
            (detail) => detail.move_learn_method.name === "level-up"
          ).level_learned_at
      );

    for (let i = 0; i < pokeMoves.length; i++) {
      if (
        pokeMoves[i].version_group_details.length > 0 &&
        pokeMoves[i].version_group_details[0].move_learn_method.name ===
          "level-up" &&
        pokeMoves[i].version_group_details[0].level_learned_at <= pokeLevel
      ) {
        let moveRes = await fetch(pokeMoves[i].move.url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const moveData = await moveRes.json();

        let flavorText = "";
        for (let j = 0; j < moveData.flavor_text_entries.length; j++) {
          if (moveData.flavor_text_entries[j].language.name === "en") {
            flavorText = moveData.flavor_text_entries[j].flavor_text;
            break;
          }
        }

        let statChangesArr = [];
        for (let k = 0; k < moveData.stat_changes.length; k++) {
          let statChangeObj = {
            change: moveData.stat_changes[k].change,
            stat: {
              name: moveData.stat_changes[k].stat.name,
              url: moveData.stat_changes[k].stat.url,
            },
          };
          statChangesArr.push(statChangeObj);
        }

        pokeMoveset[pokeMoves[i].move.name] = {
          url: pokeMoves[i].move.url,
          level_learned_at:
            pokeMoves[i].version_group_details[0].level_learned_at,
          max_pp: moveData.pp,
          accuracy: moveData.accuracy,
          power: moveData.power,
          flavor_text: flavorText,
          stat_changes: statChangesArr,
        };
      }
    }

    const pokemon = Pokemon.create({
      name: data.name,
      types: pokeTypes,
      sprites: pokeSprites,
      level: pokeLevel,
      xp: 0,
      max_xp: 100,
      health: data.stats[0].base_stat,
      max_health: data.stats[0].base_stat,
      moveset: pokeMoveset,
      fullMoveset: { pokeMoves },
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      speed: data.stats[5].base_stat,
    });

    res.status(200).json(pokemon);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
