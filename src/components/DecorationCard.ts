import Decoration from '../entity/Decoration';

const decorationCard = {
  render(decoration: Decoration): string {
    const view = `
        <div class="decoration-container">
          <h3 class="decoration-title">${decoration.name}</h3>
          <div class="decoration-content">
            <ul class="decoration-properties">
              <li>ID: ${decoration.num}</li>
              <li>Кол-во: ${decoration.count}</li>
              <li>Год: ${decoration.year}</li>
              <li>Форма: ${decoration.shape}</li>
              <li>Цвет: ${decoration.color}</li>
              <li>Размер: ${decoration.size}</li>
            </ul>
            <img class="decoration-image" src="assets/toys/${decoration.num}.png"></img>
          </div>  
        </div>
        `
    return view;
  }
}

export default decorationCard;