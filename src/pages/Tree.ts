import decorations from '../data/decorations';
import dragToy from '../utils/dragWorker';

const Tree = {
  render(): string {
    let bgItems = "";
    let treeItems = "";
    let toys = "";

    for (let i = 1; i < 11; i++) {
      bgItems += `<div class="bg-cell cell" data-bgId=${i}></div>`
    }

    for (let i = 1; i < 7; i++) {
      treeItems += `<div class="tree-cell cell" data-treeId=${i}></div>`
    }

    for (let i = 1; i < 21; i++) {
      toys += `
      <div class="toy-cell cell">
        <img></img>
        <div class="toy-counter"></div>
      </div>
      `
    }

    const view = `
          <section class="tree">
            <div class="controls-container">
              <h3>Выберите Эффекты</h3>
              <div class="controls-icons">
                <div class="sound-effect effect" id="snow"></div>
                <div class="snow-effect effect" id="sound"></div>
              </div>

              <h3>Выберите Елку</h3>
              <div class="tree-selector">
              ${treeItems}
              </div>

              <h3>Выберите Фон</h3>
              <div class="background-selector">
                ${bgItems}
              </div>
              
              <div class="garland-selector">
                <h3>Выберите Форму Снежинок</h3>
                <input type="text" id="snow-field" placeholder="Введите текст">
                <button id="snow-button">Лет ит сноу!</button>
              </div>
            </div>

            <div class="tree-container" id="tree-container">
            </div>

            <div class="toys-panel">
              <h3>Любимые Игрушки</h3>
              <div class="toys-container">
                ${toys}
              </div>
            </div>

          </section>
            `;
    return view;
  },
  after_render(): void {

    const bgCells = Array.from(document.getElementsByClassName('bg-cell')) as HTMLElement[];
    const treeCells = Array.from(document.getElementsByClassName('tree-cell')) as HTMLElement[];
    const toyCells = Array.from(document.getElementsByClassName('toy-cell')) as HTMLElement[];
    const toyImgs = toyCells.map(cell => cell.querySelector('img')) as HTMLElement[];
    const treeContainter = document.getElementById('tree-container') as HTMLElement;
    const soundIcon = document.getElementById('sound') as HTMLElement;
    const snowIcon = document.getElementById('snow') as HTMLElement;
    const audio = new Audio('assets/audio.mp3');
    let snowIntervalId: ReturnType<typeof setInterval>;
    let isSnowing = false;
    let bgId: string;
    let treeId: string;
    let snowflakeType = "*";

    function generateSelectors() {
      bgCells.forEach(item => item.style.backgroundImage = `url('assets/bg/${item.getAttribute('data-bgId')}.jpg')`);
      treeCells.forEach(item => item.style.backgroundImage = `url('assets/tree/${item.getAttribute('data-treeId')}.png')`);
    }

    function setToys() {
      const toyIds: number[] = JSON.parse(localStorage.getItem('favorites') || "[]");

      if (toyIds.length === 0) {
        for (let i = 1; i < 21; i++) {
          toyIds.push(i);
        }
      }

      for (let i = 0; i < toyIds.length; i++) {
        const toyImg = toyCells[i].querySelector('img') as HTMLImageElement;
        toyImg.src = `assets/toys/${toyIds[i]}.png`;
        toyImg.classList.add('toy');
        toyImg.setAttribute("data-position", String(i));

        const decoration = decorations.filter(decoration => decoration.num === toyIds[i])[0];
        const counter = toyCells[i].querySelector('.toy-counter');
        if (counter) {
          counter.textContent = String(decoration.count);
        }

      }
    }

    function setBackground(e: Event) {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-bgId');
      if (id) {
        setBackgroundById(id);
      }
    }

    function setBackgroundById(id: string) {
      treeContainter.style.backgroundImage = `url('assets/bg/${id}.jpg')`;
      bgId = id;
    }

    function setTree(e: Event) {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-treeId');
      if (id) {
        setTreeById(id);
      }
    }

    function setTreeById(id: string) {
      const img = document.createElement("img");
      img.classList.add('droppable');
      img.src = `assets/tree/${id}.png`;
      treeContainter.innerHTML = img.outerHTML;
      treeId = id;
    }

    function toggleSound() {
      soundIcon.classList.toggle("selected-effect");
      audio.paused ? audio.play() : audio.pause();
    }

    function toggleSnow() {
      snowIcon.classList.toggle("selected-effect");
      if (!isSnowing) {
        snowIntervalId = setInterval(createSnowFlake, 50);
        isSnowing = true;
      } else {
        clearInterval(snowIntervalId);
        isSnowing = false;
      }
    }

    function createSnowFlake() {
      const snow_flake = document.createElement('div');
      snow_flake.innerText = snowflakeType;
      snow_flake.classList.add('fa-snowflake');
      snow_flake.style.left = Math.random() * window.innerWidth + 'px';
      snow_flake.style.animationDuration = Math.random() * 3 + 4 + 's';
      snow_flake.style.fontSize = Math.random() * 10 + 20 + 'px';
      snow_flake.style.opacity = Math.random() + '';
      document.body.appendChild(snow_flake);

      setTimeout(() => {
        snow_flake.remove();
      }, 5000)
    }

    function generateSnowType(){
      const snowType = (document.getElementById('snow-field') as HTMLInputElement).value || '$';
      snowflakeType = snowType;
      if (isSnowing){
        toggleSnow();
      }
      toggleSnow();
    }

    function saveSettings() {
      localStorage.setItem('isSnowing', String(isSnowing));
      localStorage.setItem('isMusicOn', String(!audio.paused));
      localStorage.setItem('selectedTree', treeId);
      localStorage.setItem('selectedBg', bgId);
    }

    function initSettings() {
      const selectedTree = localStorage.getItem('selectedTree') || '1';
      const selectedBg = localStorage.getItem('selectedBg') || '1';
      const isSnowing = localStorage.getItem('isSnowing');
      const isMusicOn = localStorage.getItem('isMusicOn');

      setTreeById(selectedTree);
      setBackgroundById(selectedBg);

      if (isSnowing === 'true') {
        toggleSnow();
      }

      if (isMusicOn === 'true') {
        toggleSound();
      }

    }

    function onLeavingPage() {
      Array.from(document.getElementsByClassName('onTree')).forEach(item => item.remove());
      saveSettings();
    }

    generateSelectors();
    setToys();
    initSettings();

    toyImgs.forEach(item => item.addEventListener('mousedown', dragToy));
    toyImgs.forEach(item => item.ondragstart = function () { return false; });
    bgCells.forEach(item => item.addEventListener('click', setBackground));
    treeCells.forEach(item => item.addEventListener('click', setTree));
    soundIcon.addEventListener('click', toggleSound);
    snowIcon.addEventListener('click', toggleSnow);

    document.getElementById('logo-item')?.addEventListener('click', onLeavingPage);
    document.getElementById('decoration-item')?.addEventListener('click', onLeavingPage);
    document.getElementById('tree-item')?.addEventListener('click', onLeavingPage);

    window.addEventListener('beforeunload', saveSettings);
    document.querySelector('#snow-button')?.addEventListener('click', generateSnowType);

  },
}

export default Tree;


