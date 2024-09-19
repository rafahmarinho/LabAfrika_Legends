import { knex } from "@/db/knex";

const convertUnixToDate = (timestamp) => {
  if (timestamp === "0") return;
  const data = new Date(timestamp * 1000);
  return data.toLocaleString();
};

const DeleteCharacter = async ({ playerId }) => {
  try {
    const haveGuild = await knex("players").where({ id: playerId }).first();

    if (haveGuild.guildnick && haveGuild.rank_id) {
      const guildLeader = await knex("guild_ranks")
        .select("*")
        .where({ id: haveGuild.rank_id })
        .first();
      if (guildLeader.name === "Leader") {
        throw new Error(
          "Você é lider de uma guild, nomeie outro representante ou desfaça a guild antes de excluir o seu personagem"
        );
      } else {
        await knex("players")
          .where({ id: playerId })
          .update({ deleted: 1, guildnick: "", rank_id: 0 });

        return true;
      }
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

const ListCharacters = async ({ userId }) => {
  try {
    if (!userId) return;
    if (userId) {
      const bigIntCharacters = await knex("players").where({
        account_id: userId,
        deleted: 0,
      });

      const characters = bigIntCharacters.map((character) => {
        const convertedCharacter = { ...character };
        for (const key in convertedCharacter) {
          if (Object.prototype.hasOwnProperty.call(convertedCharacter, key)) {
            if (typeof convertedCharacter[key] === "bigint") {
              convertedCharacter[key] = convertedCharacter[key].toString();
            } else if (Buffer.isBuffer(convertedCharacter[key])) {
              convertedCharacter[key] = convertedCharacter[key].toString("hex");
            }
          }
        }
        return convertedCharacter;
      });

      characters.sort((a, b) => b.created - a.created);

      const charactersWithDates = characters.map((player) => ({
        ...player,
        created: convertUnixToDate(player.created),
        lastlogin: convertUnixToDate(player.lastlogin),
      }));

      return charactersWithDates;
    } else {
      throw new Error("Id invalido");
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const ListTopLevel = async () => {
  try {
    let topPlayers = [];
    const data = await knex("players")
      .select("*")
      .whereIn("group_id", [1, 2, 7, 8])
      .whereIn("world_id", [1])
      .where({ deleted: 0 })
      .orderBy("level", "desc")
      .limit(5);

    topPlayers = data.map((item) => ({
      ...item,
      created: convertUnixToDate(item.created),
      lastlogin: convertUnixToDate(item.lastlogin),
    }));

    return topPlayers;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const GetLastCaught = async () => {
  try {
    const lastCaught = await knex("player_catchs")
      .select()
      .orderBy("id", "desc")
      .limit(1);

    const parts = lastCaught[0].pokemon_id.split(" ");

    // Obtendo apenas o segundo elemento (o nome do Pokémon)
    const pokemonName = parts.slice(1).join(" ");

    const pokemon = await knex("pokedex").where({ name: pokemonName }).first();

    const player = await knex("players")
      .where({ name: lastCaught[0].player_name })
      .first();

    player.created = convertUnixToDate(player.created);
    player.lastlogin = convertUnixToDate(player.lastlogin);

    const data = {
      lastCaught,
      pokemon,
      player,
    };

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const CreateCharacter = async ({ name, gender, accountId }) => {
  try {
    if (!/^[a-zA-Z\s]*[a-zA-Z][a-zA-Z\s]*$/.test(name)) {
      throw new Error(
        "O nome deve conter apenas letras e espaços, mas pelo menos uma letra."
      );
    }

    const haveCharacter = await knex("players")
      .where({ name, deleted: 0 })
      .first();

    if (haveCharacter) {
      throw new Error("Nome já utilizado");
    }

    if (name.length < 3) {
      throw new Error("Nome muito curto");
    }

    if (name.length > 20) {
      throw new Error("Nome muito longo");
    }

    const checkGender = (genderId) => {
      if (genderId === 1) {
        return 612;
      } else {
        return 611;
      }
    };

    const date = new Date();
    const unixDate = Math.floor(date.getTime() / 1000);

    const character = await knex("players").insert({
      account_id: Number(accountId),
      name,
      level: 1,
      sex: gender,
      vocation: 1,
      town_id: 1,
      posx: 0,
      posz: 0,
      posy: 0,
      world_id: 1,
      looktype: checkGender(gender),
      created: unixDate,
      cap: 6,
      conditions: 0,
    });

    return character;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const ListOnePlayer = async ({ playerId }) => {
  try {
    const player = await knex("players")
      .where({ id: Number(playerId) })
      .first();

    player.created = convertUnixToDate(player.created);
    player.lastlogin = convertUnixToDate(player.lastlogin);

    return player;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const ListCharacterGuild = async ({ userId }) => {
  try {
    if (userId) {
      const characters = await knex("players")
        .where({
          account_id: Number(userId),
          deleted: 0,
          guildnick: "",
        })
        .andWhere("level", ">", 50);

      return characters;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

const SearchCharacters = async ({ search, page, perPage }) => {
  try {
    const query = knex
      .select("*")
      .from("players")
      .where("deleted", 0)
      .andWhere("group_id", 1);

    if (search) {
      query.andWhere("name", "like", `%${search}%`);
    }

    const totalCountQuery = knex("players")
      .count("* as countResult")
      .where("deleted", 0)
      .andWhere("group_id", 1);

    if (search) {
      totalCountQuery.andWhere("name", "like", `%${search}%`);
    }

    const countResult = await totalCountQuery.first();
    const count = countResult ? countResult.countResult : 0;

    if (perPage) {
      query.limit(Number(perPage));
    }

    if (page) {
      query.offset(Number(page) * Number(perPage));
    }

    const characters = await query;

    for (const item of characters) {
      item.created = convertUnixToDate(item.created);
      item.lastlogin = convertUnixToDate(item.lastlogin);
    }

    return { characters, count };
  } catch (err) {
    console.error("Erro ao buscar dados:", err);
    throw new Error(err);
  }
};

export {
  DeleteCharacter,
  ListCharacters,
  ListTopLevel,
  GetLastCaught,
  CreateCharacter,
  ListOnePlayer,
  ListCharacterGuild,
  SearchCharacters,
};
