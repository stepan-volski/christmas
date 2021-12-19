import './index.scss';

import Catalogue from './pages/Catalogue'
import Header from './components/Header'
import Footer from './components/Footer'

const router = async () => {
  const header = null || document.getElementById('header');
  const content = null || document.getElementById('app');
  const footer = null || document.getElementById('footer');
  const page = Catalogue;

  if (header) {
    header.innerHTML = Header.render();
  }

  if (footer) {
    footer.innerHTML = Footer.render();
  }

  if (content) {
    content.innerHTML = page.render();
  }

  page.after_render();
}

router();
