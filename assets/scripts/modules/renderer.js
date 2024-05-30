let lastColorClass = false;

const colorClasses = {
  "mi-blau": ".mi-blau",
  "mi-grau": ".mi-grau",
  "mi-gruen": ".mi-gruen",
  "mi-pink": ".mi-pink",
  "mi-lila": ".mi-lila",
  "mi-black": ".mi-black",
};


/* Helper
############################################################################ */

const getRandomNumbers = (options) => {
  const { amount, min, max, type } = options;
  const numbers = [];

  for (let i = 0; i < amount; i++) {
    const randomNumber = type === 'int'
      ? Math.floor(Math.random() * (max - min + 1)) + min
      : Math.random() * (max - min) + min;

    const cleandNumber = Math.floor(randomNumber * 100) / 100;
    numbers.push(cleandNumber);
  }

  return numbers;
};

const getRandomColorClass = () => {
  const colors = Object.keys(colorClasses);
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  if (lastColorClass === randomColor && randomColor === undefined) {
    getRandomColorClass();
  }

  lastColorClass = randomColor;
  return randomColor;
};

const createLinkList = (links) => {
  const linkList = !links
    ? false
    : links.map(link => {
      return `<li><a href="${link.url}" class="link">${link.text}</a></li>`;
    });

  const linksHtml = !linkList
    ? ''
    : `
      <ul class="links">
        ${linkList.join('')}
      </ul>
    `;

  return linksHtml;
};


/* Layouts
############################################################################ */


const stripLayoutData = (data) => {
  const { links, background, cssClasses } = data;
  const additonalClasses = cssClasses ? cssClasses : '';
  const linksHtml = createLinkList(links);
  const colorClass = background === 'auto' ? getRandomColorClass() : '';
  const randomDelays = getRandomNumbers({
    "amount": 2,
    "min": 0,
    "max": 1,
    "type": "float"
  });

  return {
    linksHtml,
    colorClass,
    additonalClasses,
    randomDelays
  };

};

const homeLayout = (data) => {

  const { id, title, subtitle, teaser, video, background } = data;
  const { linksHtml, colorClass, additonalClasses, randomDelays } = stripLayoutData(data);

  const backgroundVideo = background === 'video' ? 'class="fs-video"' : '';
  const videoHtml = video ? `<video ${backgroundVideo} src="${video}" autoplay loop muted playsinline></video>` : '';
  const teaserText = teaser ? `<p class="teaser" style="transition-delay:${randomDelays[1]}s">${teaser}</p>` : '';

  return `
    <section class="home ${additonalClasses} snap-in" data-js-observe id="${id}">
      <header>
        <h1 class="title gradient-text" style="transition-delay:${randomDelays[0]}s">${title}</h1>
        <h2 class="subtitle gradient-text-reversed" style="transition-delay:${randomDelays[1]}s">${subtitle}</h2>
      </header>
      ${videoHtml}
      ${teaserText}
      ${linksHtml}
    </section>
  `;
};

const pageLayout = (data) => {

  const { id, title, subtitle, image, text } = data;
  const { linksHtml, colorClass, additonalClasses, randomDelays } = stripLayoutData(data);

  const textHtml = text ? `<p style="transition-delay:${randomDelays[1]}s">${text}</p>` : '';
  const imageHtml = !image
    ? ''
    : `
      <figure class="image-wrapper">
        <img src="${image}" alt="${title}">
      </figure>
    `;
  return `
    <section class="page ${colorClass} ${additonalClasses} snap-in" data-js-observe id="${id}">
      <div class="text-wrap">
        <header>
          <h2 class="title gradient-text" style="transition-delay:${randomDelays[0]}s">${title}</h2>
          <h3 class="subtitle" style="transition-delay:${randomDelays[0]}s">${subtitle}</h3>
        </header>
        ${textHtml}
        ${linksHtml}
      </div>
      ${imageHtml}
    </section>
  `;
};

const quoteLayout = (data) => {

  const { id, quote, author, date, image } = data;
  const { colorClass, additonalClasses } = stripLayoutData(data);

  return `
    <section class="quote ${colorClass} ${additonalClasses} snap-in" data-js-observe id="${id}" style="background-image: url(${image})">
      <blockquote>
        <cite>${quote}</cite>
        <div class="cite-meta">
          <p class="author">${author}</p>
          <p class="date">${date}</p>
        </div>
      </blockquote>
    </section>
  `;
};

const imageStripeLayout = (data) => {
  const { id, images } = data;
  const { linksHtml, colorClass, additonalClasses } = stripLayoutData(data);

  return `
    <section class="image-stripe ${colorClass} ${additonalClasses} snap-in" data-js-observe id="${id}">
      <ul class="image-list" data-js-horizontal-scroll-container>
        ${images.map(image => {
    return `<li data-js-observe><img src="${image}" alt="${id}"></li>`;
  }).join('')}
      </ul>
      ${linksHtml}
    </section>
  `;
};

const layouts = {
  "home": homeLayout,
  "page": pageLayout,
  "image-stripe": imageStripeLayout,
  "quote": quoteLayout
};


/* Render Data
---------------------------------------------------------------------------- */

const renderData = (contentData) => {
  const targetContainer = document.querySelector('[data-js-content]');

  const html = contentData.map(item => {
    const { layout } = item;
    return layouts[layout](item);
  });

  targetContainer.innerHTML = html.join('');

};


/* Exports
############################################################################ */

export { renderData };