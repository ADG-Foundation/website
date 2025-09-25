document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' || event.keyCode === 27) {
        // trigger the same close action as clicking the close button
        const closeBtn = document.querySelector('.js-quickaccess-close');
        if (closeBtn) closeBtn.click();
      }
      });