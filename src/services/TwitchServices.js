import { knex } from "@/db/knex";
import { twitchApiInstance } from "@/utils/twitch";

const CreateTwitchId = async ({ twitchLogin, userId, characterToStream }) => {
  console.log(typeof twitchLogin, characterToStream);
  try {
    if (!twitchLogin) {
      await knex("accounts").where({ id: userId }).update({
        twitchId: null,
        characterToStream: null,
        twitchLogin: null,
      });
      const user = await knex("accounts").where({ id: userId }).first();

      return user;
    }

    if (characterToStream.value === "") {
      throw new Error("Selecione o personagem para o streamer");
    }
    const haveUser = await knex("accounts").where({ id: userId }).first();
    if (haveUser.isStreamer !== 1) {
      throw new Error("Conta não autorizada");
    }
    const response = await twitchApiInstance.get(`/users?login=${twitchLogin}`);

    if (!response.data.data[0]) {
      throw new Error("Login Twitch não encontrado!");
    }

    const streamCharacter = characterToStream.value;

    await knex("accounts").where({ id: userId }).update({
      twitchId: response.data.data[0].id,
      characterToStream: streamCharacter,
      twitchLogin: response.data.data[0].login,
    });

    const user = await knex("accounts").where({ id: userId }).first();

    return user;
  } catch (err) {
    throw new Error(err);
  }
};

const GetStreams = async () => {
  try {
    let streams = [];
    const users = await knex("accounts").select("*").whereNotNull("twitchId");

    for (const user of users) {
      try {
        const response = await twitchApiInstance.get(
          `/streams?user_id=${user?.twitchId}`
        );

        if (response.data.data && response.data.data.length > 0) {
          const item = response.data.data[0];
          const streamData = {
            title: item.title,
            stream_owner: user.characterToStream,
            stream_link: `https://twitch.tv/${item.user_name}`,
            thumbnail: item.thumbnail_url?.replace(
              "{width}x{height}",
              "1920x1080"
            ),
            viewers: item.viewer_count,
            type: item.type,
            game_id: item.game_id,
            streamer_user: item.user_name,
            link: `https://player.twitch.tv/?channel=${item.user_name}&parent=${process.env.TWITCH_PARENT_URL}&parent=www.${process.env.TWITCH_PARENT_URL}&autoplay=true&muted=false`,
          };

          if (streamData.game_id === "19619") {
            streams.push(streamData);
          } else {
            console.log(
              `Stream de usuário ${user?.twitchId} não está transmitindo o jogo 'Tibia'`
            );
          }
        } else {
          console.log(
            `Nenhum stream encontrado para o usuário ${user?.twitchId}`
          );
        }
      } catch (err) {
        console.log(
          `Erro ao buscar streams para o usuário ${user?.twitchId}:`,
          err
        );
      }
    }

    return streams;
  } catch (err) {
    console.error("Erro ao trazer dados de stream:", err);
    throw new Error(err);
  }
};

const SetPopUpStreamAccount = async ({ userId }) => {
  try {
    await knex("accounts").where("isStreamer", 1).update({ popUpStreamer: "" });

    const user = await knex("accounts")
      .select("*")
      .where({ id: userId.value })
      .first();

    await knex("accounts").where({ id: userId.value }).update({
      popUpStreamer: user.name,
    });

    return user;
  } catch (err) {
    console.error("Erro ao atualizar conta para pop-up:", err);
    throw new Error(err);
  }
};

const ListStreamers = async () => {
  try {
    const streamers = await knex("accounts").select("*").where("isStreamer", 1);
    return streamers;
  } catch (err) {
    console.error("Erro ao atualizar conta para pop-up:", err);
    throw new Error(err);
  }
};

const GetPopUpStreamer = async () => {
  try {
    const user = await knex("accounts")
      .select("*")
      .whereNotNull("twitchId")
      .andWhere("popUpStreamer", "!=", "")
      .first();
    let stream = [];

    const response = await twitchApiInstance.get(
      `/streams?user_id=${user?.twitchId}`
    );

    if (response.data.data && response.data.data.length > 0) {
      const item = response.data.data[0];
      const streamData = {
        title: item.title,
        stream_owner: user.characterToStream,
        stream_link: `https://twitch.tv/${item.user_name}`,
        thumbnail: item.thumbnail_url?.replace("{width}x{height}", "1920x1080"),
        viewers: item.viewer_count,
        type: item.type,
        game_id: item.game_id,
        streamer_user: item.user_name,
        link: `https://player.twitch.tv/?channel=${item.user_name}&parent=${process.env.TWITCH_PARENT_URL}&parent=www.${process.env.TWITCH_PARENT_URL}&autoplay=true&muted=false`,
      };

      if (streamData.game_id === "19619") {
        stream.push(streamData);
      } else {
        console.log(
          `Stream de usuário ${user?.twitchId} não está transmitindo o jogo 'Tibia'`
        );
        return stream;
      }
    } else {
      console.log(`Nenhum stream encontrado para o usuário ${user?.twitchId}`);
      return stream;
    }

    return stream;
  } catch (err) {
    console.error("Erro ao trazer dados de stream:", err);
    throw new Error(err);
  }
};

const SetStreamers = async ({ userArr }) => {
  try {
    let streamers = [];
    await knex("accounts").update({ isStreamer: 0 });
    for (const user of userArr) {
      const streamer = await knex("accounts").where({ id: user.value }).update({
        isStreamer: 1,
      });
      streamers.push(streamer);
    }

    return streamers;
  } catch (err) {
    console.error("Erro ao trazer dados de stream:", err);
    throw new Error(err);
  }
};

export {
  CreateTwitchId,
  GetStreams,
  SetPopUpStreamAccount,
  ListStreamers,
  GetPopUpStreamer,
  SetStreamers,
};
