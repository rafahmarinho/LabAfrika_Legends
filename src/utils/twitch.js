import axios from "axios";

async function getToken() {
  try {
    const response = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
    );
    return response.data.access_token;
  } catch (err) {
    console.error("Erro ao obter token:", err);
    throw err;
  }
}

async function createTwitchApiInstance() {
  try {
    const token = await getToken();

    const twitchApi = axios.create({
      baseURL: "https://api.twitch.tv/helix",
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-Id": process.env.TWITCH_CLIENT_ID,
      },
    });

    return twitchApi;
  } catch (err) {
    console.error("Erro ao criar instância da API Twitch:", err);
    throw err;
  }
}

const twitchApiInstance = await createTwitchApiInstance();

export { twitchApiInstance };
