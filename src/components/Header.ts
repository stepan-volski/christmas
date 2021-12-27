import { router } from "../index";

const Header = {
  render(): string {
    const view = `
        <div class="header-menu">
          <ul class="menu-items">
            <li id="logo-item">Начало</li>
            <li id="decoration-item">Игрушки</li>
            <li id="tree-item">Ёлка</li>
          </ul>
        </div>
        `
    return view;
  },
  after_render(): void {

    document.getElementById('logo-item')?.addEventListener('click', () => {
      window.history.pushState("", "", "/");
      router();
    })

    document.getElementById('decoration-item')?.addEventListener('click', () => {
      window.history.pushState("", "", "/catalogue");
      router();
    })

    document.getElementById('tree-item')?.addEventListener('click', () => {
      window.history.pushState("", "", "/tree");
      router();
    })

  }
}

export default Header;
