import * as htmlEntities from 'html-entities';
import { HackerNews } from '../enums/enums';

const urlRe = /(?:^|\s)((https?:\/\/|\/\/)[\w-]+(\.[\w-]+)+\.?(:\d+)?(\/\S*)?)/gi;

export function linkify(text: string) {
  text = htmlEntities.decode(text);
  const matches = text.matchAll(urlRe);

  for (const match of matches) {
    const href = match[1];
    text = text.replace(href, `<a href="${href}" rel="nofollow noreferrer">${href}</a>`);
  }

  return text;
}

export const fauxFlatComments = Array.from<number>({ length: 3 }).fill(-1);

export const keyExtractor = (item: number, index: number) => {
  return item === -1 ? index.toString() : item.toString();
};

export const hackerNewsConverter = (string: HackerNews) => {
  const hnMap = {
    home: 'Home',
    best: 'Popular',
    top: 'Front Page',
    new: 'New',
    show: 'Show',
    ask: 'Q&A',
    job: 'Jobs Board'
  };
  return hnMap[string];
};
