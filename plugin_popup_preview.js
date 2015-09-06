// quickly view previews by opening a popup window
$(function() {
  if (!window.FA.Popup || !document.post || !document.post.message || !document.post.mode) return;
  
  document.post.preview.onclick = function(e) {
    var mode = document.post.mode.value;
    
    if ($.sceditor) document.post.message.value = $(document.post.message).sceditor('instance').val();
    
    $.post(mode == 'post' ? '/privmsg' : '/post', $(document.post).serialize() + '&preview=1', function(data) {
      var preview = $(['.postbody', mode == 'post' ? '.post' : '#preview', '.main-content.topic', '#preview'][FA.Popup.forum.version], data)[0];
      if (preview) {
        FA.Popup.open(null, 'Preview', function(popup) {
          var content = document.createElement('DIV');
          content.className = 'fa_popup_preview';
          content.appendChild(preview);
          popup.appendChild(content);
        });
      }
    });
    
    e.preventDefault();
  }
});
