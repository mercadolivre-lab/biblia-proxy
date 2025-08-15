import { parseStringPromise } from "xml2js";

const ENDPOINT = "https://abibliasagrada.com.br/dlls/sbtb_ws.dll";
const NS = "urn:ModSBTBUnit-ISBTB_WS";

function buildEnvelope(method, params = {}) {
  const body = Object.entries(params)
    .map(([k, v]) => `<${k}>${String(v)}</${k}>`).join('');
  return `<?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <m:${method} xmlns:m="${NS}">
        ${body}
      </m:${method}>
    </soap:Body>
  </soap:Envelope>`;
}

export async function callSoap(method, params = {}) {
  const soapAction = `${NS}#${method}`;
  const resp = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      "SOAPAction": soapAction
    },
    body: buildEnvelope(method, params)
  });

  const text = await resp.text();

  try {
    const xml = await parseStringPromise(text, { explicitArray: false });
    return { xml, raw: text };
  } catch {
    return { xml: null, raw: text };
  }
}
