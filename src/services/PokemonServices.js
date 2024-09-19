import { knex } from "@/db/knex";

const extractPokemonDetails = (description) => {
  const details = {};
  const lines = description.split("\n");

  // Obtendo o nome do Pokémon
  const nameAndLevel = lines[0].split(" Lv. ");
  details.name = nameAndLevel[0];

  // Obtendo o nível do Pokémon
  const levelAndBoost = nameAndLevel[1].split(" ");
  details.lvl = levelAndBoost[0];

  // Obtendo o Boost
  details.boost =
    levelAndBoost.length > 1 ? levelAndBoost.slice(1).join(" ") : "";

  // Restante das informações
  details.nature = lines[1].split(": ")[1];
  details.specialAbility = lines[2].split(": ")[1];
  details.individualValues = lines[3].split(": ")[1];

  const ivValues = lines[4].split(" ");
  details.Hp = ivValues[1];
  details.Atk = ivValues[3];
  details.Def = ivValues[5];
  details.SpAtk = ivValues[7];
  details.SpDef = ivValues[9];
  details.Speed = ivValues[11];
  details.Total = ivValues[13];

  return details;
};

const GetTeam = async ({ playerId }) => {
  let pokemonTeam = [];
  try {
    if (!playerId) return;
    const team = await knex("player_pokemon").where({
      player_id: Number(playerId),
    });
    pokemonTeam.push(team);

    for (let i = 0; i < team.length; i++) {
      const pokemonData = await knex("pokedex")
        .where({ wild_id: team[i].pokemon_number })
        .first();

      team[i].pokemon_name = pokemonData.name;
      team[i].type1 = pokemonData.type1;
      team[i].type2 = pokemonData.type2;

      const details = extractPokemonDetails(team[i].description);
      team[i].details = details;
    }

    return team;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const GetPokedex = async ({ playerId }) => {
  const storage = await knex("player_storage")
    .where({ player_id: Number(playerId) })
    .andWhere("key", ">", 10001)
    .andWhere("key", "<", 10493);

  let dexArr = [];
  for (const item of storage) {
    const pokedexInfo = await knex("pokedex")
      .where({ storage: item.key })
      .first();
    if (pokedexInfo) {
      pokedexInfo.storageValue = item.value;
      dexArr.push(pokedexInfo);
    }
  }

  return dexArr;
};

export { GetTeam, GetPokedex };
