import { router } from "../index";

const Start = {
  render(): string {
    const view = `
          <section class="start">
            <div class="greeting">Добро пожаловать в игру "Наряди Елку"</div>
            <button id="startBtn" class="startBtn">Начать</button>
          </section>
            `;
    return view;
  },
  after_render(): void {

    document.getElementById('startBtn')?.addEventListener('click', () => {
      window.history.pushState("", "", "/catalogue");
      router();
    })

  },
}

export default Start;
