const fs = require('fs');
const path = require('path');

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '110mb',
  },
};

export default function handler(req, res) {
  const filePath = path.resolve('./public/LegendsOfUnknown.exe');
  const stat = fs.statSync(filePath);
  
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Content-Type', 'application/octet-stream');
  res.setHeader('Content-Disposition', 'attachment; filename=LegendsOfUnknown.exe');
  
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
}
