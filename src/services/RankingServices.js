import { knex } from "@/db/knex";

const convertUnixToDate = (timestamp) => {
  const data = new Date(timestamp * 1000);
  return data.toLocaleString();
};

const GetLevelRank = async ({ order, page, perPage }) => {
  try {
    const query = knex
      .select("*")
      .from("players")
      .whereIn("group_id", [1, 2, 7, 8]) // Alteração para permitir group_id 1, 2, 7 e 8
      .where({ deleted: 0 }) // Mantém a cláusula de deleção
      .orderBy("level", order);

    const totalCountQuery = knex("players").count("* as countResult");

    const countResult = await totalCountQuery.first();
    const count = countResult ? countResult.countResult : 0;

    if (perPage) {
      query.limit(Number(perPage));
    }

    if (page) {
      query.offset(Number(page) * Number(perPage));
    }

    const levelRank = await query;

    for (const item of levelRank) {
      item.created = convertUnixToDate(item.created);
      item.lastlogin = convertUnixToDate(item.lastlogin);
    }

    return { levelRank, count };
  } catch (err) {
    console.error("Erro ao trazer dados do ranking:", err);
    throw new Error(err);
  }
};

const GetCatchRank = async ({ order, page, perPage }) => {
  try {
    const query = knex
      .select("*")
      .from("player_skills")
      .where({ skillid: 5 })
      .whereNot({ value: 0 })
      .orderBy("value", order);

    const catchArr = await query;

    let catchRank = [];

    for (const item of catchArr) {
      const player = await knex("players")
        .where({ id: item.player_id })
        .whereIn('group_id', [1, 2, 7, 8]) // Adiciona os group_ids permitidos
        .whereNot({ deleted: 1 });

      if (player && player[0] && player[0].id) {
        catchRank.push({ ...player[0], catchLevel: item.value });
      }
    }

    catchRank.forEach((item) => {
      item.created = convertUnixToDate(item.created);
      item.lastlogin = convertUnixToDate(item.lastlogin);
    });
    const count = catchRank.length;

    catchRank = catchRank.slice(
      Number(page) * Number(perPage),
      (Number(page) + 1) * Number(perPage)
    );
    return { catchRank, count };
  } catch (err) {
    console.error("Erro ao trazer dados do ranking:", err);
    throw new Error(err);
  }
};

const GetHeadbuttRank = async ({ order, page, perPage }) => {
  try {
    const query = knex
      .select("*")
      .from("player_skills")
      .where({ skillid: 4 })
      .whereNot({ value: 0 })
      .orderBy("value", order);

    const headbuttArr = await query;

    let headbuttRank = [];

    for (const item of headbuttArr) {
      const player = await knex("players")
        .where({ id: item.player_id })
        .whereIn('group_id', [1, 2, 7, 8]) // Adiciona os group_ids permitidos
        .whereNot({ deleted: 1 });

      if (player && player[0] && player[0].id) {
        headbuttRank.push({ ...player[0], headbuttLevel: item.value });
      }
    }

    headbuttRank.forEach((item) => {
      item.created = convertUnixToDate(item.created);
      item.lastlogin = convertUnixToDate(item.lastlogin);
    });
    const count = headbuttRank.length;

    headbuttRank = headbuttRank.slice(
      Number(page) * Number(perPage),
      (Number(page) + 1) * Number(perPage)
    );

    return { headbuttRank, count };
  } catch (err) {
    console.error("Erro ao trazer dados do ranking:", err);
    throw new Error(err);
  }
};

const GetFishRank = async ({ order, page, perPage }) => {
  try {
    const query = knex
      .select("*")
      .from("player_skills")
      .where({ skillid: 6 })
      .whereNot({ value: 0 })
      .orderBy("value", order);

    const fishArr = await query;

    let fishRank = [];

    for (const item of fishArr) {
      const player = await knex("players")
        .where({ id: item.player_id })
        .whereIn('group_id', [1, 2, 7, 8]) // Adiciona os group_ids permitidos
        .whereNot({ deleted: 1 });

      if (player && player[0] && player[0].id) {
        fishRank.push({ ...player[0], fishLevel: item.value });
      }
    }

    fishRank.forEach((item) => {
      item.created = convertUnixToDate(item.created);
      item.lastlogin = convertUnixToDate(item.lastlogin);
    });
    const count = fishRank.length;

    fishRank = fishRank.slice(
      Number(page) * Number(perPage),
      (Number(page) + 1) * Number(perPage)
    );

    return { fishRank, count };
  } catch (err) {
    console.error("Erro ao trazer dados do ranking:", err);
    throw new Error(err);
  }
};

export { GetLevelRank, GetCatchRank, GetHeadbuttRank, GetFishRank };
