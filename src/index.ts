import './index.scss';

import Catalogue from './pages/Catalogue'
import Tree from './pages/Tree'
import Start from './pages/Start'
import Header from './components/Header'
import Footer from './components/Footer'
import evaluation from './evaluation'


const routes = {
  '/'             : Start
  , '/catalogue'  : Catalogue
  , '/tree'       : Tree
};


export function router(): void {
  const header = null || document.getElementById('header');
  const content = null || document.getElementById('app');
  const footer = null || document.getElementById('footer');

  if (header) {
    header.innerHTML = Header.render();
    Header.after_render();
  }

  if (footer) {
    footer.innerHTML = Footer.render();
  }

  const address = location.pathname as '/' | '/catalogue' | '/tree';      //todo add ts type
  const page = routes[address];

  if (content) {
    content.innerHTML = page.render();
  }

  page.after_render();
}

router();
evaluation();

window.addEventListener('popstate', router);

