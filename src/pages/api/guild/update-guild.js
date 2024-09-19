import { UpdateGuild } from "@/services/GuildServices";
import multer from "multer";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = "public/upload-images";
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir);
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueIdentifier = uuidv4();
//     cb(null, `${uniqueIdentifier}-${file.originalname}`);
//   },
// });

// const upload = multer({ storage, limits: { fileSize: 16 * 1024 * 1024 } });

export default async function handler(req, res) {
  if (req.method === "PUT") {
    // await new Promise((resolve, reject) => {
    //   upload.single("file")(req, res, (err) => {
    //     if (err) {
    //       console.log(err);
    //       return reject(err);
    //     }
    //     resolve();
    //   });
    // });
    const { name, description, guildId } = req.body;
    // const file = req.file;
    try {
      const guild = await UpdateGuild({
        name,
        description,
        guildId,
        // file: file,
      });
      res.status(200).json(guild);
    } catch (err) {
      console.log(err);
      res.status(400).json(err.message);
    }
  }
}
