// Inspiration and a basic outline derived from Magnus Manske's https://www.wikidata.org/wiki/User:Magnus_Manske/authority_control.js script
// Also Html from the wikibase team (obviously)

var apiHost = 'https://tools.wmflabs.org'
var apiPath = '/wikifactmine-api/api/item/'
var titleid = "wfm-facts-title"

// Escape HTML using http://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }

var titleHTML = `<h2 class='wb-section-heading section-heading' dir='auto' id='" + titleid + "' title='WikiFactMine Facts' style='overflow:auto'>\
<span class='mw-headline' id='wfm-facts'>WikiFactMine Facts</span>\
</h2>
    <div class="wikibase-statementgrouplistview">
    <div class="wikibase-listview wikifactmine-listview" id="${titleid}">

</div>
<div class="wikibase-addtoolbar wikibase-toolbar-item wikibase-toolbar wikibase-addtoolbar-container wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add"><a href="#" title="Add a new statement"><span class="wb-icon"></span>add</a>
  </span>
</div>
    </div>`

function makePaperEntry(entry) {
    return `<div class="wikibase-statementgroupview listview-item" id="${entry.cprojectID}">
  <div class="wikibase-statementgroupview-property">
    <div class="wikibase-statementgroupview-property-label" dir="auto" style="position: relative; top: 0.183569px; left: 0px;"><a title="${entry.cprojectID}" href="https://europepmc.org/articles/${entry.cprojectID}">${entry.cprojectID}</a></div>
  </div>
  <div class="wikibase-statementlistview">
    <div class="wikibase-statementlistview-listview">

    </div>
    <span class="wikibase-toolbar-container"></span>
    <span class="wikibase-toolbar-wrapper"><div class="wikibase-addtoolbar wikibase-toolbar-item wikibase-toolbar wikibase-addtoolbar-container wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add">
    </span>
  </div>
  </span>
</div>
</div>`
}

function makeFactListEntry(entry) {
  return `<div class="wikibase-statementview wikifactmine-fact-thisistotallyuniqueipromise wb-normal listview-item wikibase-toolbar-item">
  <div class="wikibase-statementview-rankselector">
    <div class="wikibase-rankselector ui-state-disabled">
     
    </div>
  </div>
  <div class="wikibase-statementview-mainsnak-container">
    <div class="wikibase-statementview-mainsnak" dir="auto">
      <div class="wikibase-snakview">
        <div class="wikibase-snakview-property-container">
          <div class="wikibase-snakview-property" dir="auto"></div>
        </div>
        <div class="wikibase-snakview-value-container" dir="auto">
          <div class="wikibase-snakview-typeselector"></div>
        <div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak"><a title="${entry.term}" href="#">${escapeHtml(entry.prefix)}${escapeHtml(entry.term)}${escapeHtml(entry.post)}</a></div>
        </div>
      </div>
    </div>
    <div class="wikibase-statementview-qualifiers"></div>
  </div>
  <span class="wikibase-toolbar-container wikibase-edittoolbar-container"><span class="wikibase-toolbar wikibase-toolbar-item wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-edit"><a href="#" title=""></a>
  </span>
  </span>
  </span>
  <div class="wikibase-statementview-references-container">
    <div class="wikibase-statementview-references-heading"><a class="ui-toggler ui-toggler-toggle ui-state-default"></a></div>
    <div class="wikibase-statementview-references ">
      <div class="wikibase-addtoolbar wikibase-toolbar-item wikibase-toolbar wikibase-addtoolbar-container wikibase-toolbar-container"><span class="wikibase-toolbarbutton wikibase-toolbar-item wikibase-toolbar-button wikibase-toolbar-button-add"><a href="#" title=""></a>
        </span>
      </div>
    </div>
  </div>
</div>
`
}

var wfm = {
  enabled: false,
  init: function() {
    var portletLink = $(mw.util.addPortletLink( 'p-navigation', '#', 'WikiFactMine Facts', 'n-fact-wfm'))
    portletLink.click(function(e) {
      e.preventDefault()
      wfm.run()
      return false
    })
  },
  run: function() {
    if (!wfm.enabled) {
      wfm.enabled = true
      $('#claims').before ( titleHTML )
      var wid = mw.config.values.wbEntityId
      $.getJSON(apiHost+apiPath+wid, wfm.addEntries)
    }
    else
      return
  },
  addEntries: function (json) {
    $.each(json.slice(0,9), wfm.addEntry)
  },
  addEntry: function (index, entry) {
      // This formats HTML in the facts as escaped sequenced so we can see them
      var $paperBlob=$('#'+entry.cprojectID)
      if (!$paperBlob.length) {
	  $('#'+titleid).append( makePaperEntry(entry) )
      }
      $('#'+entry.cprojectID).find('.wikibase-statementlistview-listview').append( makeFactListEntry(entry) )
      
  }
}

jQuery(document).ready ( function() {
  if ( mw.config.get('wgNamespaceNumber') != 0 ) return ;
  if ( mw.config.get('wgAction') != 'view' ) return ;
  wfm.init () ;
});
