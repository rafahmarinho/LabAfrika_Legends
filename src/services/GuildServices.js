import { knex } from "@/db/knex";

const convertUnixToDate = (timestamp) => {
  const data = new Date(timestamp * 1000);
  return data.toLocaleString();
};

const CreateGuild = async ({ name, description, guildOwner, worldId }) => {
  const date = new Date();
  const unixDate = Math.floor(date.getTime() / 1000);

  try {
    const haveGuild = await knex("guilds").where({ name }).first();

    const onlinePlayer = await knex("players")
      .where({ id: Number(guildOwner) })
      .first();

    if (onlinePlayer.guildname) {
      throw new Error("Este player está em uma guild");
    }

    if (haveGuild) {
      throw new Error("Nome de guilda em uso");
    } else if (onlinePlayer.online > 0) {
      throw new Error("Não é possível criar guild com o player online");
    } else {
      const guild = await knex("guilds").insert({
        name,
        motd: description,
        ownerid: Number(guildOwner),
        world_id: Number(worldId),
        creationdata: unixDate,
        link: "",
      });

      const rankId = await knex("guild_ranks")
        .where({ guild_id: Number(guild[0]), level: 3 })
        .first();

      const createdGuild = await knex("guilds").where({ id: guild[0] }).first();

      await knex("players")
        .where({ id: createdGuild.ownerid })
        .update({ guildnick: createdGuild.name, rank_id: rankId.id });

      return guild;
    }
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const ListGuilds = async ({ name, perPage, page }) => {
  try {
    let guilds = [];

    const query = knex.select("*").from("guilds");

    if (name) {
      query.whereRaw("LOWER(name) LIKE ?", `%${name.toLowerCase()}%`);
    }

    const totalCountQuery = knex("guilds");

    if (name) {
      totalCountQuery.whereRaw("LOWER(name) LIKE ?", `%${name.toLowerCase()}%`);
    }

    const countResult = await totalCountQuery.count("* as countResult").first();
    const count = countResult ? countResult.countResult : 0;

    if (perPage) {
      query.limit(Number(perPage));
    }

    if (page) {
      query.offset(Number(page) * Number(perPage));
    }

    const noPlayerGuilds = await query;

    for (const guild of noPlayerGuilds) {
      const players = await knex("players").where({
        guildnick: guild.name,
        deleted: 0,
      });

      guild.total_players = players.length;
      const guildOwner = await knex("players")
        .where({ id: guild.ownerid, deleted: 0 })
        .first();
      guild.owner = guildOwner;
      guild.owner.created = convertUnixToDate(guild.owner.created);
      guild.owner.lastlogin = convertUnixToDate(guild.owner.lastlogin);
      guilds.push(guild);
      ("");
    }

    guilds = guilds.map((guild) => {
      return {
        ...guild,
        creationdata: convertUnixToDate(guild.creationdata),
      };
    });

    return { guilds, count };
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const ListMembers = async ({ guildId }) => {
  try {
    if (!guildId) return;

    const guild = await knex("guilds").where({ id: guildId }).first();

    const ranks = await knex("guild_ranks").where({ guild_id: guildId });

    let members = [];

    for (const rank of ranks) {
      const players = await knex("players").where({
        rank_id: rank.level,
        guildnick: guild.name,
      });
      rank.players = players;
      rank.totalPlayers = players.length;
      rank.level = rank.name;
      members.push(rank);
    }

    const data = await knex("players")
      .where({ guildnick: guild.name })
      .select("id", "name", "rank_id", "guildnick", "online", "level")
      .orderBy("rank_id", "asc");

    let allMembers = [];

    for (const member of data) {
      const guildLevel = await knex("guild_ranks")
        .where({ id: member.rank_id })
        .first();

      member.guild_level = guildLevel.name;

      allMembers.push(member);
    }

    return { rankMembers: members, allMembers };
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const ListGuildByAccount = async ({ userId }) => {
  let guilds = [];
  try {
    if (!userId) {
      throw new Error("Nenhum ID informado");
    }
    const players = await knex("players").where({ account_id: Number(userId) });

    for (const player of players) {
      const guildArray = await knex("guilds").where({
        ownerid: Number(player.id),
      });
      for (const item of guildArray) {
        const guildOwner = await knex("players")
          .where({ id: Number(item.ownerid) })
          .select("name")
          .first();

        item.owner = guildOwner ? guildOwner.name : null; // Definindo o owner em cada guilda
        guilds.push(item); // Adicionando a guilda atualizada à lista
      }
    }
    guilds = guilds.map((guild) => {
      return {
        ...guild,
        creationdata: convertUnixToDate(guild.creationdata),
      };
    });

    return guilds;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const UpdateGuild = async ({ guildId, name, description, file }) => {
  const checkDescription = (desc) => {
    if (desc === "null") {
      return null;
    } else {
      return desc;
    }
  };

  try {
    // if (file) {
    //   const oldGuild = await knex("guilds")
    //     .where({
    //       id: Number(guildId),
    //     })
    //     .first();

    //   const guild = await knex("guilds")
    //     .where({ id: Number(guildId) })
    //     .update({
    //       name,
    //       description: checkDescription(description),
    //       link: file.filename,
    //     });

    //   await knex("players").where({ guildnick: oldGuild.name }).update({
    //     guildnick: name,
    //   });
    //   return guild;
    // } else {
    const oldGuild = await knex("guilds")
      .where({
        id: Number(guildId),
      })
      .first();

    const guild = await knex("guilds")
      .where({ id: Number(guildId) })
      .update({ name, motd: checkDescription(description) });

    await knex("players").where({ guildnick: oldGuild.name }).update({
      guildnick: name,
    });
    return guild;
    // }
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const RemoveMember = async ({ playerId, guildName }) => {
  try {
    const player = await knex("players")
      .where({
        id: playerId,
        guildnick: guildName,
      })
      .first();

    if (player.rank_id === 3) {
      const allMembers = await knex("players")
        .where({ guildnick: guildName })
        .select("id", "name", "rank_id", "guildnick", "online", "level")
        .orderBy("rank_id", "desc");

      if (allMembers.length > 1) {
        throw new Error(
          "Não é possível remover o dono da guilda/apagar guilda se houver outros membros!"
        );
      } else {
        await knex("players")
          .where({ id: Number(player.id) })
          .update({
            guildnick: "",
            rank_id: 0,
          });

        await knex("guilds").where({ name: guildName }).delete();
      }
    }

    if (player.online > 0) {
      throw new Error("Não é possível remover um player online!");
    } else {
      await knex("players")
        .where({ id: Number(player.id) })
        .update({
          guildnick: "",
          rank_id: 0,
        });
    }

    return player;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const DeleteGuild = async ({ guildId }) => {
  try {
    const guild = await knex("guilds").where({ id: guildId }).first();

    if (!guild) {
      throw new Error("Guilda não encontrada");
    }

    if (guild) {
      await knex("players").where({ guildnick: guild.name }).update({
        guildnick: "",
        rank_id: 0,
      });

      await knex("guilds").where({ id: guildId }).delete();
    }

    return guild;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

export {
  CreateGuild,
  ListGuilds,
  ListMembers,
  ListGuildByAccount,
  UpdateGuild,
  RemoveMember,
  DeleteGuild,
};
