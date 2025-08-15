import { callSoap } from "./_soap.js";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { version, book, chapter } = req.query;
  if (!version || !book || !chapter) {
    return res.status(400).json({ error: "Parâmetros obrigatórios: version, book, chapter" });
  }

  const totalVersesResp = await callSoap("GetTotalVerses", {
    Version: Number(version),
    BookCode: Number(book),
    Chapter: Number(chapter)
  });
  const totalVerses = Number(totalVersesResp.xml?.["soap:Envelope"]?.["soap:Body"]?.GetTotalVersesResponse?.GetTotalVersesResult || 0);

  const versesResp = await callSoap("GetVerses", {
    Version: Number(version),
    BookCode: Number(book),
    Chapter: Number(chapter),
    IniVerse: 1,
    EndVerse: totalVerses
  });

  const result = versesResp.xml?.["soap:Envelope"]?.["soap:Body"]?.GetVersesResponse?.GetVersesResult || "";

  res.status(200).json({
    version: Number(version),
    book: Number(book),
    chapter: Number(chapter),
    totalVerses,
    text: result
  });
}
