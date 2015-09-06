// Main script for addition of Popup to FA object.
(function() {
  var version = 1;
  /* COMPATIBLE FORUM VERSIONS
  ** 0 : PHPBB2
  ** 1 : PHPBB3
  ** 2 : PUNBB
  ** 3 : INVISION
  */
  
  if (!window.FA) window.FA = {};
  if (FA.Popup) {
    if (window.console) console.warn('FA.Popup has already been initialized.');
    return;
  }
  
  FA.Popup = {

    lang : {
      button_close : 'X',
      default_title : 'Popup',
      loading : 'Loading...',

      error_getPage : 'An error occurred while getting the page. Please try again later.',
      error_connection : 'A connection error occurred. Please check your internet connection and try again later.'
    },
    
    active : false,
    
    forum : {
      version : version,
      content : version ? '#main-content' : '#content-container > table > tbody > tr > td[width="100%"]',
      pages : ['.gensmall:has(.sprite-arrow_subsilver_left, .sprite-arrow_subsilver_right) a[href^="/"], .nav:has(.sprite-arrow_subsilver_left, .sprite-arrow_subsilver_right) a[href^="/"]', '.pagination:not(strong) span a', '.paging a[href^="/"]', '.pagination a[href^="/"]'][version]
    },
    
    /* open a new popup window */
    open : function(href, title, callback) {
      if (FA.Popup.active) FA.Popup.close(); // close opened windows
      
      var box = document.createElement('DIV'),
          overlay = document.createElement('DIV'),
          content = document.createElement('DIV'),
          close = document.createElement('INPUT');

      close.type = 'button';
      close.value = FA.Popup.lang.button_close;
      close.className = 'fa_popup_button fa_popup_close';
      close.onclick = FA.Popup.close;

      content.id = 'fa_popup_content';
      content.innerHTML = '<div class="fa_popup_loading">' + FA.Popup.lang.loading + '</div>';
      
      overlay.id = 'fa_popup_overlay';
      overlay.style.zIndex = '99998';
      overlay.onclick = FA.Popup.close;

      if (FA.Popup.forum.version == 2) box.className += ' pun';
      box.id = 'fa_popup';
      box.style.zIndex = '99999';
      box.innerHTML = '<div class="fa_popup_title">' + (title ? title : FA.Popup.lang.default_title) + '</div>';
      box.appendChild(close);
      box.appendChild(content);

      if (href) {
        $.get(href, function(data) {
          content.innerHTML = '';
          if (callback) callback(data, content);
          else {
            var main = $(FA.Popup.forum.content, data)[0];
            if (main) {
              content.appendChild(main);

              var page = $(FA.Popup.forum.pages, content);
              if (page[0]) page.click(FA.Popup.getPage);
            }
          }
        }).fail(function() {
          content.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_connection + '</div>';
        });
      } else if (callback) {
        content.innerHTML = '';
        callback(content);
      }

      document.body.style.overflow = 'hidden';
      document.body.appendChild(overlay);
      document.body.appendChild(box);
      
      FA.Popup.active = true;
    },
    
    /* close an opened popup window */
    close : function () {
      var box = document.getElementById('fa_popup'),
          overlay = document.getElementById('fa_popup_overlay');
      
      box && document.body.removeChild(box);
      overlay && document.body.removeChild(overlay);
      document.body.style.overflow = '';
      
      FA.Popup.active = false;
    },

    
    /* get the page when a pagination link is clicked */
    getPage : function() {
      var content = document.getElementById('fa_popup_content');

      $.get(this.href, function(data) {
        var main = $(FA.Popup.forum.content, data)[0], page;

        if (main) {
          content.scrollTop = 0;
          content.innerHTML = '';
          content.appendChild(main);
          
          page = $(FA.Popup.forum.pages, content);
          if (page[0]) page.click(FA.Popup.getPage);
        } else {
          content.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_getPage + '</div>';
        }
      }).fail(function() {
        content.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_connection + '</div>' ;
      });
      return false;
    }
    
  };
})();
