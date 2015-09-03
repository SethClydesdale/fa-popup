// quickly view searches by opening a popup window
$(function() {
  if (!window.FA.Popup) return;
  
  $('form[action^="/search"]').submit(function() {
    var keywords = this.search_keywords.value,
        results = this.show_results ? '&show_results=' + this.show_results.value : '',
        tag = this.is_tag ? '&is_tag=' + this.is_tag.value : '',
        terms = this.search_terms ? '&search_terms=' + this.search_terms.value : '',
        author = this.search_author ? '&search_author=' + this.search_author.value : '',
        where = this.search_where ? '&search_where=' + this.search_where.value : '',
        time = this.search_time ? '&search_time=' + this.search_time.value : '',
        sortby = this.sort_by ? '&sort_by=' + this.sort_by.value : '',
        sortdir = this.sort_dir ? '&sort_dir=' + this.sort_dir.value : '';
    
    FA.Popup.open('/search?search_keywords=' + keywords + results + terms + author + where + time + sortby + sortdir, 'Searching' + (keywords ? ' : ' + keywords : ''));
    
    this.search_keywords.blur();
    return false;
  });
});
