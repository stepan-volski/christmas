function dragToy(event: MouseEvent): void {
  const toy = event.target as HTMLElement;
  let treeIsBelow: Element | null;

  const shiftX = event.clientX - toy.getBoundingClientRect().left;
  const shiftY = event.clientY - toy.getBoundingClientRect().top;

  toy.style.position = 'absolute';
  toy.style.zIndex = "1000";
  document.body.append(toy);

  moveAt(event.pageX, event.pageY);

  function moveAt(pageX: number, pageY: number) {
    toy.style.left = pageX - shiftX + 'px';
    toy.style.top = pageY - shiftY + 'px';
  }

  function onMouseMove(event: MouseEvent) {
    moveAt(event.pageX, event.pageY);

    toy.hidden = true;
    const elemBelow = document.elementFromPoint(event.clientX, event.clientY);
    toy.hidden = false;

    if (!elemBelow) return;

    treeIsBelow = elemBelow.closest('.droppable');     //will return tree if tree is hovered, else null

  }

  document.addEventListener('mousemove', onMouseMove);

  toy.onmouseup = function () {
    const toyParentCellId = Number(toy.getAttribute('data-position'));
    const toyParentCell = document.querySelectorAll('.toy-cell')[toyParentCellId];
    const toyCounter = toyParentCell?.querySelector('.toy-counter') as HTMLDivElement;
    const toyCount = Number(toyCounter.innerText);
    const toyAlreadyOnTree = toy.classList.contains('onTree');

    if (!treeIsBelow) {
      if (toyAlreadyOnTree && toyCount > 0) {
        toyCounter.innerText = String(toyCount + 1);
        toy.remove();
      } 
      
      if (toyAlreadyOnTree && toyCount === 0) {
        toyCounter.innerText = String(toyCount + 1);
        toy.classList.remove('onTree');

        toy.style.removeProperty('position');
        toy.style.removeProperty('zIndex');
        toy.style.removeProperty('left');
        toy.style.removeProperty('top');
        toyParentCell?.appendChild(toy);
      }
      
      if (!toyAlreadyOnTree) {
        toy.style.removeProperty('position');
        toy.style.removeProperty('zIndex');
        toy.style.removeProperty('left');
        toy.style.removeProperty('top');
        toyParentCell?.appendChild(toy);
      }
    }

    if (treeIsBelow) {
      if (toyCount > 1 && !toyAlreadyOnTree) {
        const clone = toy.cloneNode() as HTMLElement;
        clone.style.removeProperty('position');
        clone.style.removeProperty('zIndex');
        clone.style.removeProperty('z-index');
        clone.style.removeProperty('left');
        clone.style.removeProperty('top');
        clone.addEventListener('mousedown', dragToy)
        clone.ondragstart = function () { return false; }
        toyParentCell?.appendChild(clone);
        toyCounter.innerText = String(toyCount - 1);
        toy.classList.add('onTree');
      }

      if (toyCount === 1 && !toyAlreadyOnTree) {
        toyCounter.innerText = String(toyCount - 1);
        toy.classList.add('onTree');
      }

    }

    document.removeEventListener('mousemove', onMouseMove);
    toy.onmouseup = null;
  };

}

export default dragToy;