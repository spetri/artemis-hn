import * as htmlEntities from "html-entities";

const urlRe =
  /(?:^|\s)((https?:\/\/|\/\/)[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

export function linkify(text: string) {
  text = htmlEntities.decode(text);
  const matches = text.matchAll(urlRe);

  for (const match of matches) {
    const href = match[1];
    text = text.replace(
      href,
      `<a href="${href}" rel="nofollow noreferrer">${href}</a>`
    );
  }

  return text;
}
