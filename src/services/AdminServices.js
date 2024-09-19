import { knex } from "@/db/knex";

function formatarData(timestamp) {
  const data = new Date(timestamp * 1000);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

const EditNews = async ({ title, body, newsId }) => {
  const date = new Date();
  const unixTimestamp = Math.floor(date.getTime() / 1000);

  try {
    const news = await knex("news")
      .update({
        title,
        body,
        time: unixTimestamp,
      })
      .where({ id: newsId });

    return news;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const DeleteNews = async ({ newsId }) => {
  try {
    const haveNews = await knex("news").where({ id: newsId }).first();

    if (!haveNews) {
      throw new Error("Noticia inexistente");
    }

    const news = await knex("news").delete().where({ id: newsId });

    return news;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const CreateNews = async ({ title, body, username }) => {
  const date = new Date();
  const unixTimestamp = Math.floor(date.getTime() / 1000);
  try {
    const news = await knex("news").insert({
      title,
      body,
      username,
      time: unixTimestamp,
    });

    return news;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
};

const ListNews = async ({ page, perPage }) => {
  try {
    const query = knex.select("*").from("news").orderBy("id", "desc");

    if (perPage) {
      query.limit(Number(perPage));
    }

    if (page) {
      query.offset(Number(page) * Number(perPage));
    }

    const news = await query;

    for (const item of news) {
      item.time = formatarData(new Date(item.time));
    }

    const countResult = await knex("news").count("* as countResult");

    return { news, count: countResult[0].countResult };
  } catch (err) {
    console.error("Erro ao buscar notícias:", err);
    throw new Error(err);
  }
};

const ListHouses = async ({ search, page, perPage, town }) => {
  try {
    const query = knex.select("*").from("houses");
    query.andWhere("world_id", 1);

    if (town) {
      query.where("town", town);
    }

    if (search) {
      query.whereRaw("LOWER(name) LIKE ?", `%${search.toLowerCase()}%`);
    }

    const totalCountQuery = knex("houses");

    if (town) {
      totalCountQuery.where("town", town);
    }

    if (search) {
      totalCountQuery.whereRaw(
        "LOWER(name) LIKE ?",
        `%${search.toLowerCase()}%`
      );
    }

    const countResult = await totalCountQuery.count("* as countResult").first();
    const count = countResult ? countResult.countResult : 0;

    if (perPage) {
      query.limit(Number(perPage));
    }

    if (page) {
      query.offset(Number(page) * Number(perPage));
    }

    const houses = await query;

    for (const house of houses) {
      if (house.owner !== 0) {
        const owner = await knex("players").where({ id: house.owner }).first();
        house.owner = owner;
        house.owner.created = formatarData(house.owner.created);
        house.owner.lastlogin = formatarData(house.owner.lastlogin);
      }
    }

    return { houses, count };
  } catch (err) {
    console.error("Erro ao buscar casas:", err);
    throw new Error(err);
  }
};
export { CreateNews, ListNews, ListHouses, EditNews, DeleteNews };
