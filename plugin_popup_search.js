// quickly view searches by opening a popup window
$(function() {
  if (!window.FA.Popup) return;
  
  $('form[action^="/search"]').submit(function(e) {
    var keywords = this.search_keywords;
    
    FA.Popup.open('/search?' + $(this).serialize(), 'Searching' + (keywords.value ? ' : ' + keywords.value : ''));
    
    this.keywords.blur();
    e.preventDefault();
  });
});
