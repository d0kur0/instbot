(function() {
  'use strict';

  function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
  async function process(node) {
    console.log('Ищу ноду, которая открывает окно фото');
    if (node.childNodes[0] === undefined) {
      console.error('Не смог найти ноду');
      return false;
    }
    console.log('Нода найдена, эмулирую клик');
    node.childNodes[0].click();
    await sleep(1000);
    console.log('Ищу кнопку лайка');
    let likeButton = document.querySelector('.dCJp8.afkep.coreSpriteHeartOpen._0mzm-');
    if (likeButton == null) {
      console.error('Не смог найти кнопку лайка');
      return false;
    }
    let likeChild = likeButton.childNodes[0];
    if (likeChild.classList.contains('glyphsSpriteHeart__filled__24__red_5')) {
      console.log('Нашёл кнопку лайка, лайк уже стоит');
    } else {
      console.log('Нашёл кнопку лайка, эмулирую клик');
      likeButton.click();
    }
    await sleep(300);
    console.log('Закрываю фото, иду к следующей');
    document.querySelector('.ckWGn').click();
    node.remove();
    await sleep(1500);
  };

  function getNodes() {
    let nodes = document.querySelectorAll('.v1Nh3.kIKUG._bz0w');
    if (nodes.length == 0) {
      console.error('Не смог собрать массив фото');
      return false;
    }
    return nodes;
  }
  let injectStyle = document.createElement('style');
  injectStyle.appendChild(document.createTextNode(`.injectedContainer:disabled{opacity: 0.6;}.injectedContainer{top:10px;left:10px;z-index:50;outline:none;font:inherit;position:absolute;border:1px solid #ddd;border-radius:10px;padding:10px;color:#fff;background-color:#000;cursor:pointer;border:3px solid #000;font-family:sans-serif}.injectedContainer--enable{border:3px solid red}`));
  document.body.appendChild(injectStyle);
  let injectButton = document.createElement('button');
  injectButton.setAttribute('class', 'injectedContainer');
  injectButton.innerHTML = '_#: state';
  document.body.appendChild(injectButton);
  document.querySelector('.injectedContainer').addEventListener('click', function(event) {
    this.classList.add('injectedContainer--enable');
    this.disabled = true;
    document.querySelector('.EZdmt > div:nth-child(2)').remove();
    console.log('Удалил фото из раздела "Лучшие Публикации"');
    let nodes = getNodes();
    console.log('Собрал массив фото, на данный момент их: ', nodes.length);
    (async () => {
      let iteration = 0;
      while (nodes.length != 0) {
        if (nodes.length == (iteration + 1)) {
          await sleep(600);
          window.scrollTo(0, document.body.scrollHeight);
          await sleep(600);
          nodes = getNodes();
          iteration = 0;
        }
        console.log(nodes.length, iteration);
        await process(nodes[iteration]);
        iteration++;
      }
    })();
  });
})();
