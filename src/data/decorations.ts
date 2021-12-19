import data from './data';
import Decoration from '../entity/Decoration';

const decorations: Decoration[] = [];

(function createAllDecorations() {
  data.forEach(entry => decorations.push(new Decoration(
    Number(entry.num),
    entry.name,
    Number(entry.count),
    Number(entry.year),
    entry.shape,
    entry.color,
    entry.size,
  )));
})();

export default decorations;