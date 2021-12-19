import decorations from '../data/decorations';
import Decoration from '../entity/Decoration';
import DecorationCard from '../components/DecorationCard';
import { filters } from '../types/types';

const Catalogue = {
  render(): string {
    const view = `
          <section class="catalogue">
              <div class="controls-container">
                <div class="colors-filter filter">
                  <h4>Цвет</h4>
                  <button data-type="color" data-filter="белый">белый</button>
                  <button data-type="color" data-filter="желтый">желтый</button>
                  <button data-type="color" data-filter="красный">красный</button>
                  <button data-type="color" data-filter="синий">синий</button>
                  <button data-type="color" data-filter="зелёный">зелёный</button>
                </div>

                <div class="shapes-filter filter">
                  <h4>Форма</h4>
                  <button data-type="shape" data-filter="шар">шар</button>
                  <button data-type="shape" data-filter="снежинка">снежинка</button>
                  <button data-type="shape" data-filter="колокольчик">колокольчик</button>
                  <button data-type="shape" data-filter="шишка">шишка</button>
                  <button data-type="shape" data-filter="фигурка">фигурка</button>
                </div>

                <div class="sizes-filter filter">
                  <h4>Размер</h4>
                  <button data-type="size" data-filter="большой">большой</button>
                  <button data-type="size" data-filter="средний">средний</button>
                  <button data-type="size" data-filter="малый">малый</button>
                </div>

                <div class="favorite-filter filter">
                  <h4>Тип</h4>
                  <input type="checkbox" id="favorite" name="fav">
                  <label for="fav">Только избранные</label>
                </div>

                <div class="filter">
                  <h4>Избранное</h4>
                  <div id="favorites-count">Игрушек в избранном: 0</div>
                </div>

                <div class="filter">
                  <h4>Сортировка</h4>
                  <select id="sorting">
                    <option value="none">--</option>
                    <option value="alph-asc">По названию А -> Я</option>
                    <option value="alph-desc">По названию Я -> А</option>
                    <option value="num-desc">По году по убыванию</option>
                    <option value="num-asc">По году по возрастанию</option>
                  </select>
                </div>

                <div class="filter">
                  <h4>Поиск</h4>
                  <input type="search" id="search-field" placeholder="Поиск по имени">
                  <button id="search-button">Искать</button>
                </div>

                <div class="filter">
                  <h4>Управление</h4>
                  <button id="reset">Сбросить фильтры</button>
                  <button id="clear-storage">Очистить настройки</button>
                </div>

              </div>

              <div class="decorations-container">
                ${decorations.map((decoration) => DecorationCard.render(decoration)).join('')}
              </div>

          </section>
            `;
    return view;
  },
  after_render(): void {
    const favoriteChkbox = document.getElementById('favorite') as HTMLInputElement;
    const searchField = document.getElementById('search-field') as HTMLInputElement;
    const sortField = document.querySelector('#sorting') as HTMLSelectElement;
    const favCounter = document.querySelector('#favorites-count') as HTMLElement;


    function toggleFilter(e: Event) {
      const filterButton = e.currentTarget as HTMLButtonElement | null;
      if (filterButton?.hasAttribute('data-filter')) {
        filterButton.classList.toggle('pressed');
      }
      applyFilters();
    }

    function applyFilters() {
      const filters = getActiveFilters();
      const results = getFilteredCollection(filters);
      renderFilteredCollection(results);
    }

    function getActiveFilters() {
      const filters: filters = { color: [], shape: [], size: [] };
      const selectedButtons: HTMLButtonElement[] = Array.from(document.querySelectorAll('.pressed'));
      selectedButtons.forEach((button) => {
        const type = button.getAttribute('data-type') as 'color' | 'shape' | 'size' | null;
        const value = button.getAttribute('data-filter') as string | null;
        if (type && value) {
          filters[type].push(value);
        }
      });
      return filters;
    }

    function getFilteredCollection(filters: filters) {
      let results = decorations.filter((item) => filters.color.length === 0 || filters.color.includes(item.color))
        .filter((item) => filters.shape.length === 0 || filters.shape.includes(item.shape))
        .filter((item) => filters.size.length === 0 || filters.size.includes(item.size));
      if (favoriteChkbox.checked) {
        const favorites = JSON.parse(localStorage.getItem('favorites') || "[]");
        results = results.filter((item) => favorites.includes(item.num));
      }
      return results;
    }

    function renderFilteredCollection(results: Decoration[]) {
      let resultsToRender: string | null;
      const cardContainer = document.querySelector('.decorations-container') as HTMLElement | null;

      if (results.length == 0) {
        resultsToRender = "<div class='no-results'>Извините, результатов нет</div>";
      } else {
        resultsToRender = results.map((item) => DecorationCard.render(item)).join('');
      }
      if (cardContainer) {
        cardContainer.innerHTML = `${resultsToRender}`;
      }
      renderFavoriteCards();


      (Array.from(document.querySelectorAll('.decoration-container')) as HTMLElement[] | null)
        ?.forEach(card => card.addEventListener('click', toggleFavorites));
    }

    function resetFilters() {
      Array.from(document.querySelectorAll('button'))?.forEach((button) => button.classList.remove('pressed'));
      favoriteChkbox.checked = false;
      renderFilteredCollection(decorations);
    }

    function sort() {
      const selectedSort = sortField.value;
      const filters = getActiveFilters();
      const items: Decoration[] = getFilteredCollection(filters);

      switch (selectedSort) {
        case 'alph-desc': items.sort((a, b) => b.name.localeCompare(a.name, 'ru'));
          break;
        case 'alph-asc': items.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
          break;
        case 'num-desc': items.sort((a, b) => b.year - a.year);
          break;
        case 'num-asc': items.sort((a, b) => a.year - b.year);
          break;
        default: break;
      }
      renderFilteredCollection(items);
    }

    function getCardId(card: HTMLElement) {
      const regexp = /[ID\: ]([0-9]+)/;
      const match = card.innerText.match(regexp);
      if (match) {
        return Number(match[0]);
      } else {
        return -1;
      }
    }

    function toggleFavorites(e: Event) {
      let favoriteIds = JSON.parse(localStorage.getItem('favorites') || "[]");
      let favoritesCount = favoriteIds.length;
      const decorationCard = e.currentTarget as HTMLElement;
      const cardId = getCardId(decorationCard);

      if (favoritesCount > 19 && !decorationCard.classList.contains('favorite')) {
        alert('Извините, все слоты заполнены');
      } else {
        decorationCard.classList.toggle('favorite');
        favoriteIds.includes(cardId) ?
          favoriteIds = favoriteIds.filter((el: number) => el !== cardId) :
          favoriteIds.push(cardId);
      }
      favoritesCount = favoriteIds.length;
      favCounter.innerHTML = `Игрушек в избранном: ${favoritesCount}`;
      localStorage.setItem('favorites', JSON.stringify(favoriteIds));
    }

    function renderFavoriteCards() {
      const cardIds: number[] = JSON.parse(localStorage.getItem('favorites') || "[]");
      const decorationCards = Array.from(document.querySelectorAll('.decoration-container')) as HTMLElement[];

      decorationCards.forEach((card) => {
        const cardId = getCardId(card);
        if (cardIds.includes(cardId)) {
          card.classList.add('favorite');
        }
      });
    }

    function clearFavorites() {
      Array.from(document.querySelectorAll('.decoration-container'))
        .forEach((card) => card.classList.remove('favorite'));
      favCounter.innerHTML = 'Игрушек в избранном: 0';
    }

    function search() {
      const filters = getActiveFilters();
      let filteredCards = getFilteredCollection(filters);
      const searchRequest = searchField.value;
      filteredCards = filteredCards.filter((el) => el.name.toLowerCase().includes(searchRequest.toLowerCase()));
      renderFilteredCollection(filteredCards);
    }

    function clearStorage() {
      localStorage.removeItem('filters');
      localStorage.removeItem('sorting');
      localStorage.removeItem('favorites');
      clearFavorites();
    }

    function saveSettings() {
      const filters = getActiveFilters();
      const sorting = (document.querySelector('#sorting') as HTMLSelectElement).value;
      localStorage.setItem('filters', JSON.stringify(filters));
      localStorage.setItem('sorting', sorting);
      localStorage.setItem('isOnlyFav', String(favoriteChkbox.checked));
    }

    function initSettings() {
      sortField.value = localStorage.getItem('sorting') || 'none';
      sort();

      const filters: filters = JSON.parse(localStorage.getItem('filters') || "{color: [], shape: [], size: []}");
      const { color, shape, size } = filters;
      const allFilters = [...color, ...shape, ...size];
      Array.from(document.querySelectorAll('[data-filter]'))
        ?.filter((button) => (allFilters.includes(button.getAttribute('data-filter') as string)))
        .forEach((button) => button.classList.add('pressed'));

      if (localStorage.getItem('isOnlyFav') === 'true') {
        favoriteChkbox.checked = true;
      }

      const results = getFilteredCollection(filters);
      renderFilteredCollection(results);

      const favoriteCount = (JSON.parse(localStorage.getItem('favorites') || "[]")).length;
      favCounter.innerHTML = `Игрушек в избранном: ${favoriteCount}`;

      searchField.focus();
      searchField.select();
    }

    initSettings();

    // Listeners
    Array.from(document.querySelectorAll('button'))
      ?.forEach((button) => button.addEventListener('click', toggleFilter));
    Array.from(document.querySelectorAll('.decoration-container'))
      ?.forEach((decoration) => decoration.addEventListener('click', toggleFavorites));
    favoriteChkbox.addEventListener('click', applyFilters);
    document.querySelector('#reset')?.addEventListener('click', resetFilters);
    document.querySelector('#sorting')?.addEventListener('change', sort);
    document.querySelector('#search-button')?.addEventListener('click', search);
    document.querySelector('#clear-storage')?.addEventListener('click', clearStorage);
    searchField.addEventListener('search', search);
    window.addEventListener('beforeunload', saveSettings);
  },

};

export default Catalogue;
