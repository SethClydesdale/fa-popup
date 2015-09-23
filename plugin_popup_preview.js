$(function() {
  if (!window.FA.Popup || !document.post || !document.post.message || !document.post.mode) return;
  
  document.post.preview.onclick = function(e) {
    var mode = document.post.mode.value;
    
    if ($.sceditor) document.post.message.value = $(document.post.message).sceditor('instance').val();
    
    FA.Popup.open('', 'Preview', function(popup) {
      popup.innerHTML = '<div class="fa_popup_loading">Loading preview...</div>';
      
      $.post(mode == 'post' ? '/privmsg' : '/post', $(document.post).serialize() + '&preview=1', function(data) {
        var preview = $(['.postbody', mode == 'post' ? '.post' : '#preview', '.main-content.topic', '#preview'][FA.Popup.forum.version], data)[0];
        popup.innerHTML = '';
        
        if (preview) {
          var content = document.createElement('DIV');
          content.className = 'fa_popup_preview';
          content.appendChild(preview);
          popup.appendChild(content);
        }
      });
    });
    
    e.preventDefault();
  }
});
