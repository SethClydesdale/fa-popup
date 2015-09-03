// Open popup window when viewing notifications from the toolbar
$(function(){$(function(){
  if (!FA.Popup) return;
  
  // popup config
  FA.Popup.notif_config = {
    PMs : true,
    VMs : true,
    Groups : true,
    Replies : true,
    Reports : true,
    Requests : true
  };
  
  // language config
  var lang = {
    viewing_pm : 'Viewing PM from : ',
    viewing_wall : 'Viewing visitor messages',
    viewing_reply : 'Viewing reply from : ',
    viewing_request : 'Viewing friend requests',
    viewing_group : 'Viewing group',
    viewing_report : 'Viewing reports',
    
    more_pm : 'View all PMs',
    more_wall : 'Visit your wall',
    more_reply : 'View the whole topic',
    more_request : 'View your Friends and Foes',
    more_group : 'View group',
    more_report : 'View all reports',
    
    friend_added : 'Added',
    friend_denied : 'Denied',
    friend_error : 'Error',
    
    error_no_pm : '<b>Error :</b> The PM you tried to view could not be found. Please try using the button below to view your entire inbox.',
    error_no_wall : '<b>Error :</b> Your wall could not be accessed. Please try using the button below to view your wall.',
    error_no_reply : '<b>Error :</b> The reply you tried to view could not be found. Please try using the button below to view the entire topic.',
    error_no_requests : '<b>Error :</b> No friend requests could be found. Please try using the button below to view your Friends / Foes list.',
    error_no_group : '<b>Error :</b> The group you tried to view could not be found. Please try using the button below to access it.',
    error_no_report : '<b>Error :</b> The report page could not be accessed. Please try using the button below to access it.'
  },
  notif = document.getElementById('notif_list'), i;

  
  if (notif) {
    $(notif).click(function(e) {
      var node = e.target, store, id, sender, more = document.createElement('DIV');
      more.style.textAlign = 'center';
      
      if (node.tagName == 'A') {
        id = node.parentNode.parentNode.parentNode.id.slice(1); // notif id
        store = FA.Notification.getStore(); // notif data
        sender = store[id].text.from.name; // username of sender
        
        // PMs
        if (/\/privmsg/.test(node.href) && FA.Popup.notif_config.PMs) {
          FA.Popup.open('/privmsg?folder=inbox&mode=read&p=' + store[id].text.msg_id + '&nid=' + id, FA.Popup.lang.viewing_pm + sender, function(data, popup) {
            var PM = $('form[action^="/privmsg"]:has(.post)', data)[0];
            if (PM) popup.appendChild(PM);
            else popup.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_no_pm + '</div>';
            
            more.innerHTML = '<a href="' + node.href + '" class="fa_popup_button">' + FA.Popup.lang.more_pm + '</a>';
            popup.appendChild(more);
          });
          e.preventDefault();
        }
        
        // Replies
        else if (/\/t\d+/.test(node.href) && FA.Popup.notif_config.Replies) {
          FA.Popup.open(node.href, FA.Popup.lang.viewing_reply + sender, function(data, popup) {
            var reply = $('.post--' + store[id].text.post.post_id, data)[0];
            
            if (reply) popup.appendChild(reply);
            else popup.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_no_reply + '</div>';
            
            more.innerHTML = '<a href="' + node.href + '" class="fa_popup_button">' + FA.Popup.lang.more_reply + '</a>';
            popup.appendChild(more);
          });
          e.preventDefault();
        }
        
        // Visitor Messages
        else if (/\/u\d+wall/.test(node.href) && FA.Popup.notif_config.VMs) {
          FA.Popup.open(node.href, FA.Popup.lang.viewing_wall, function(data, popup) {
            var wall = $('#profile-advanced-details', data)[0];
            if (wall) popup.appendChild(wall);
            else popup.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_no_wall + '</div>';
            
            more.innerHTML = '<a href="' + node.href + '" class="fa_popup_button">' + FA.Popup.lang.more_wall + '</a>';
            popup.appendChild(more);
          });
          e.preventDefault();
        }
        
        // Friend requests
        else if (/page_profil=friendsfoes/.test(node.href) && FA.Popup.notif_config.Requests) {
          FA.Popup.open(node.href, FA.Popup.lang.viewing_request, function(data, popup) {
            var request = $((FA.Popup.forum.version == 2 ? '.main-content.frm dd' : '.friends-foes-list') + ':has(a[href^="/profile?deny"])', data);
            if (request[0]) {
              $(request).addClass('fa_popup_friends');
              
              // accept / deny requests using AJAX
              $('a[href^="/profile"]', request).click(function() {
                var t = this, add = /deny/.test(t.href) ? 0 : 1;
                
                $('a[href^="/profile"]', t.parentNode).hide();
                
                // success / error messages
                $.get(t.href, function() {
                  $(t.parentNode).append('<strong class="' + (add ? 'add' : 'deny') + '_success">' + (add ? FA.Popup.lang.friend_added : FA.Popup.lang.friend_denied) + '</strong>');
                }).fail(function() {
                  $(t.parentNode).append('<strong class="add_failed">' + FA.Popup.lang.friend_error + '</strong>');
                });
                
                return false;
              });
              
              $(popup).append(request);
            }
            else popup.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_no_requests + '</div>';
            
            more.innerHTML = '<a href="' + node.href + '" class="fa_popup_button">' + FA.Popup.lang.more_request + '</a>';
            popup.appendChild(more);
          });
          e.preventDefault();
        }
        
        // Group requests
        else if (/\/g\d+-/.test(node.href) && FA.Popup.notif_config.Groups) {
          FA.Popup.open(node.href, FA.Popup.lang.viewing_group, function(data, popup) {
            var group = $('form[name="post"]', data)[0];
            if (group) popup.appendChild(group);
            else popup.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_no_group + '</div>';
            
            more.innerHTML = '<a href="' + node.href + '" class="fa_popup_button">' + FA.Popup.lang.more_group + '</a>';
            popup.appendChild(more);
          });
          e.preventDefault();
        }
        
        // Reports
        else if (/\/report/.test(node.href) && FA.Popup.notif_config.Reports) {
          FA.Popup.open(node.href, FA.Popup.lang.viewing_report, function(data, popup) {
            var report = $(FA.Popup.forum.content, data)[0];
            if (report) {
              popup.appendChild(report);
              
              var page = $(FA.Popup.forum.pages, popup);
              if (page[0]) $(page).click(FA.Popup.getPage);
            }
            else popup.innerHTML = '<div class="fa_popup_error">' + FA.Popup.lang.error_no_report + '</div>';
            
            more.innerHTML = '<a href="' + node.href + '" class="fa_popup_button">' + FA.Popup.lang.more_report + '</a>';
            popup.appendChild(more);
          });
          e.preventDefault();
        }
      }
    });
    
    for (i in lang) FA.Popup.lang[i] = lang[i]; // add language config to popup object
  }
})});
