/**
 * Main Script
 * Handles the main functionality of the site
 * Controls the header, footer, and other global elements
 * Manages the theme and layout changes
 */

"use strict";

const html = document.querySelector("html");

//TODO: finalizar o logo e menu fixo

const bodyRect = html.getBoundingClientRect(),
    carousel = document.querySelector(".owl-carousel"),
    cover = document.querySelector(".js-cover"),
    coverRect = cover ? cover.getBoundingClientRect() : 0,
    edit = document.querySelector(".js-edit"),
    full = document.querySelector(".js-title-full"),
    fullRect = full ? full.getBoundingClientRect() : 0,
    header = document.querySelector("header"),
    headerBg = document.querySelector("header .bg"),
    headerRect = header.getBoundingClientRect(),
    hero = document.querySelector(".js-news-hero"),
    highlight = document.querySelector(".js-highlight-news"),
    initials = document.querySelector(".js-title-initials"),
    languages = document.querySelector(".js-languages"),
    logo = document.querySelector(".logo"),
    menu = document.querySelector(".menu-desktop div"),
    menuAlt = document.querySelector(".menu-desktop-alt"),
    menuRect = menu ? menu.getBoundingClientRect() : 0,
    minerva = document.querySelector(".js-logo-minerva"),
    minervaWhite = document.querySelector(".js-logo-minerva-white"),
    offset = coverRect.top - bodyRect.top - 140,
    search = document.querySelector(".js-search"),
    searchForm = document.querySelector(".js-search-form"),
    title = document.querySelector(".js-title"),
    titleRow = document.querySelector(".js-title-row"),
    //titleRowBig = document.querySelector('.js-title-row-big'),
    apps = document.querySelector(".js-apps"),
    quickaccess = document.querySelector(".js-quickaccess");

window.addEventListener(
  "scroll",
  function (event) {
    const scroll = this.scrollY;

    if (carousel && carousel.classList.contains("slideshow-hero")) {
      //converte 70vh to px (+ altura do header = 60)
      var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      var sliderHeight = (70 * h) / 100 - 90;
      //console.log(sliderHeight);
    }

    if (carousel && carousel.classList.contains("slideshow")) {
      var sliderHeight = 415;
    }

    //console.log('Slider: ' + sliderHeight)
    //console.log('Scroll: ' + scroll);

    if (scroll >= 550) {
      if (html.classList.contains("theme-white")  && (html.classList.contains("template-site") || html.classList.contains("template-home"))) {
        logo ? logo.classList.add("invert") : null;
        languages ? languages.classList.add("invert") : null;
        minerva ? minerva.classList.add("hidden") : null;
        minervaWhite ? minervaWhite.classList.remove("hidden") : null;
        apps ? apps.classList.add("invert") : null;
        quickaccess ? quickaccess.classList.add("invert") : null;
        search ? search.classList.add("invert") : null;
      }

      if (bodyRect.width < 768) {
        header.classList.add("bg-white");
      }

      if (
        (html.classList.contains("template-site") || html.classList.contains("template-home")) &&
        bodyRect.width >= 768
      ) {
        header.classList.remove("shadow");
        //searchForm ? searchForm.classList.remove("bg-gray-100") : null;
        //searchForm ? searchForm.classList.add("bg-white") : null;
        //search ? search.classList.add("invert") : null;
        //edit ? edit.classList.add("invert") : null;
      }

      if (!hero) {
        highlight ? highlight.classList.add("lg:pt-32") : null;
      }

      // linha de iniciais e título
      titleRow ? titleRow.classList.add("hidden") : null;

      menuAlt ? menuAlt.classList.add("lg:block") : null;

      headerBg ? headerBg.classList.add("lg:block") : null;
      //titleRowBig ? titleRowBig.classList.add('hidden') : null

      menu ? menu.classList.add("fixed-top", "z-40") : null;

    } else {
      titleRow ? titleRow.classList.remove("hidden") : null;

      if (html.classList.contains("template-site") || html.classList.contains("template-home")) {
        logo ? logo.classList.remove("invert") : null;
        languages ? languages.classList.remove("invert") : null;
        minerva ? minerva.classList.remove("hidden") : null;
        minervaWhite ? minervaWhite.classList.add("hidden") : null;

        apps ? apps.classList.remove("invert") : null;
        quickaccess ? quickaccess.classList.remove("invert") : null;
      }
      if (
        (html.classList.contains("template-site") || html.classList.contains("template-home")) &&
        bodyRect.width >= 768
      ) {
        searchForm ? searchForm.classList.remove("bg-white") : null;
        searchForm ? searchForm.classList.add("bg-gray-100") : null;
        search ? search.classList.remove("invert") : null;
        edit ? edit.classList.remove("invert") : null;
      }

      highlight ? highlight.classList.remove("lg:pt-32") : null;
      menuAlt ? menuAlt.classList.remove("lg:block") : null;

      headerBg ? headerBg.classList.remove("lg:block") : null;

      menu ? menu.classList.remove("fixed-top", "z-40") : null;
    }
  },
  false
);

// CONTROLA MENU MOBILE
const close = document.querySelector(".js-close");
const menuMobile = document.querySelector(".js-menu-mobile");

if (close) {
  close.onclick = function (e) {
    menuMobile.classList.toggle("hidden");
    html.classList.toggle("overflow-hidden");
  };
}

const hamburguer = document.querySelector(".js-menu");
if (hamburguer) {
  hamburguer.onclick = function (e) {
    menuMobile.classList.toggle("hidden");
    html.classList.toggle("overflow-hidden");
  };
}

// EXPANDE INPUT DE PESQUISA
if (search) {
  search.onclick = function (e) {
    this.classList.toggle("ph-x");
    this.classList.toggle("ph-magnifying-glass");
    this.classList.toggle("ml-2");
    searchForm.classList.toggle("flex");
    searchForm.classList.toggle("hidden");
  };
}

// CENTRA TÍTULO DO SITE NA VERTICAL E ESCONDE-O
if (html.classList.contains("template-site") || html.classList.contains("template-home")) {
  if (titleRow) {
    titleRow.style.marginTop = (titleRow.clientHeight / 2) * -1 + "px";
  }
}

//  FIXA METADADOS DAS NOTÍCIAS
if (html.classList.contains("template-article")) {
  const metatitle = document.querySelector(".js-meta-title");

  window.addEventListener("scroll", function (event) {
    const scroll = this.scrollY;
    const offset = 200;

    if (scroll >= offset) {
      metatitle.classList.add("lg:block");
    } else {
      metatitle.classList.remove("lg:block");
    }
  });
}

// REDIMENSIONA LOGÓTIPO À ESQUERDA
if (html.classList.contains("template-page")) {
  const leftLogo = document.querySelector(".js-left-logo");

  if (leftLogo) {
    window.addEventListener("scroll", function (event) {
      const scroll = this.scrollY;

      let top = leftLogo ? 280 : null;

      if (scroll >= top) {
        leftLogo.classList.remove("h-0", "w-0");
        leftLogo.classList.add("h-24", "w-24", "p-2", "border-2", "mb-8");
      } else {
        leftLogo.classList.add("h-0", "w-0");
        leftLogo.classList.remove("h-24", "w-24", "p-2", "border-2", "mb-8");
      }
    });
  }
}

// ABRE / FECHA PAINEIS DA HOMEPAGE
if (html.classList.contains("template-home")) {
  const subMenu = document.querySelector(".js-submenu");
  const links = document.querySelectorAll(".js-submenu span");
  const panels = document.querySelectorAll(".js-panel");

  if (subMenu) {
    function hideOpen() {
      panels.forEach((panel) => {
        panel.classList.add("hidden");
      });
    }

    links.forEach((link) => {
      link.onclick = function (e) {
        e.preventDefault();
        var openPanel = document.querySelector("." + link.dataset.target);
        hideOpen();
        openPanel.classList.remove("hidden");
      };
    });
  }
}



//  Quickaccess
if (quickaccess) {
  const quickaccessPanel = document.querySelector(".js-quickaccess-panel");
  const quickaccessClose = document.querySelector(".js-quickaccess-close");

  quickaccess.onclick = function (e) {
    quickaccessPanel.classList.remove("hidden");
    quickaccessPanel.classList.add("flex");
  };

  quickaccessClose.onclick = function (e) {
    quickaccessPanel.classList.add("hidden");
    quickaccessPanel.classList.remove("flex");
  };
}


// FiXES FULL WIDTH IMAGE
const full_images = document.querySelectorAll(".js-full-image");
if (full_images) {
    full_images.forEach((full_image) => {
        const figure = full_image.querySelector("img");
        figure.onload = function () {
            full_image.style.height = figure.clientHeight + "px";
        };
    });
}




if (html.classList.contains("template-collection")) {

  // Positions collection summary
  const collectionHeader = document.querySelector('.js-collection-header');
  const collectionContent = document.querySelector('.js-collection-content');

  if (collectionHeader) {
    collectionHeader.style.marginBottom = collectionHeader.clientHeight *  -0.5 + 'px';
    collectionContent.style.paddingTop = collectionHeader.clientHeight *  0.5 + 'px';
  }



  const filtersModalToggle = document.querySelectorAll('.js-filters-modal-toggle');
  const filtersModal = document.querySelector('.js-filters-modal');
  const filtersModalClose = document.querySelector('.js-filters-modal-close');


  filtersModalToggle.forEach((fmt) => {
    fmt.onclick = function (e) {
      filtersModal.classList.remove('hidden');
      document.body.style.position = 'fixed';
    }
  });

  filtersModalClose.onclick = function (e) {
    filtersModal.classList.add('hidden');
    document.body.style.position = '';
  }


  // Collection filters
/*   const filtersToggle = document.querySelector(".js-filters-toggle");
  const filtersPanel = document.querySelector(".js-filters-panel");
  const filtersContent = document.querySelector(".js-filters-content");
  filtersToggle.onclick = function (e) {
    ['hidden', 'grid'].map(v => filtersPanel.classList.toggle(v));
    ['col-span-5', 'col-span-4'].map(v => filtersContent.classList.toggle(v));
    //msnry.reloadItems();
    msnry.layout();
    //console.log('reloaded');
  };


  const filtersGroups = document.querySelectorAll(".js-filter-group");

  if (filtersGroups) {
    function hideOpen() {
      filtersGroups.forEach((group) => {
        const options = group.nextElementSibling;
        const plus = group.querySelector('span');
        options.classList.add("hidden");
        options.classList.remove('active');
        plus.innerHTML = '+';
      });
    }

    filtersGroups.forEach((group) => {
      group.onclick = function (e) {
        const options = group.nextElementSibling;
        const plus = group.querySelector('span');


        if (options.classList.contains("active")) {
          plus.innerHTML = '+';
          options.classList.add('hidden');
          options.classList.remove('active');
        } else {
          hideOpen();
          plus.innerHTML = '-';
          options.classList.remove('hidden');
          options.classList.add('active');
        }
      };
    });
  } */

  const collectibles = document.querySelectorAll(".grid-item");

  const itemOptions = {
    threshold: 0.5
  };
  const iObserver = new IntersectionObserver((entries, iObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      /* const img = entry.target;
      img.src = img.src.replace("w=10&", "w=800&"); */

      const collectible = entry.target;
      collectible.classList.remove('grayscale', 'blur-sm');
      iObserver.unobserve(entry.target);
    });
  }, itemOptions);

  collectibles.forEach((collectible) => {
    iObserver.observe(collectible);
  });

}

//site-406402 = PTS
if (html.classList.contains("template-collection") || html.classList.contains("site-406402")) {
  const filterShowAll = document.querySelectorAll(".js-show-all");
  filterShowAll.forEach((filter) => {
    let originalText = filter.textContent;

    filter.onclick = function (e) {
      const group = filter.previousElementSibling;
      const hiddenOptions = group.querySelectorAll(".js-hidden-option");
      hiddenOptions.forEach((ho) => {
        ho.classList.toggle("hidden");
        if (ho.classList.contains("hidden")) {
          filter.innerHTML = originalText;
        } else {
          filter.innerHTML = "Show less";
        }
      });
    };
  });
}

//site-406402 = PTS

// Check if the page is one of the specified templates
if (html.classList.contains("site-406402") || html.classList.contains("template-projects_folder") || html.classList.contains("template-publications_folder")) {
  // Select all filter input elements
  const filterInput = document.querySelectorAll(".js-filter-input");

  filterInput.forEach((fi) => {
    // Add keyup event listener to each filter input
    fi.onkeyup = function (e) {
      const search = fi.value;

      // Get the list and list items
      const ul = fi.nextElementSibling;
      const li = ul.querySelectorAll("li");

      // Only filter if search term is more than one character
      if (search.length > 1) {
        // Create case-insensitive RegExp from search term
        const pat = new RegExp(search, "i");

        for (var i = 0; i < li.length; i++) {
          var item = li[i];

          // Create a clone of the list item to manipulate
          var clonedContent = item.cloneNode(true);

          // Remove all span elements from the clone
          clonedContent.querySelectorAll('span').forEach(span => span.remove());

          // Get the text content of the modified clone
          var textContent = clonedContent.innerText;

          // Test if the modified content matches the search pattern
          if (pat.test(textContent)) {
            item.classList.remove("hidden");
          } else {
            item.classList.add("hidden");
          }
        }
      } else {
        // If search term is 1 character or less, show all items
        li.forEach((li) => {
          li.classList.remove("hidden");
        });
      }
    };
  });
}






