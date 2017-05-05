var apiHost = 'https://tools.wmflabs.org'
var apiPath = '/wikifactmine-api/api/item/'
var titleid = "wfm-facts-title"
var titleHTML = "<h2 class='wb-section-heading section-heading' dir='auto' id='" + titleid + "' title='WikiFactMine Facts' style='overflow:auto'>\
<span class='mw-headline' id='wfm-facts'>WikiFactMine Facts</span>\
</h2>"

var factListHTML = "<div class='wikibase-statementgroupview listview-item' >\
<div class='wikibase-statementgroupview-property'>\
<div class='wikibase-statementgroupview-property-label' dir='auto' style='position: relative; top: -0.01225px; left: 0px;' id='wfm-facts-list-real'>PMC123456</div>\
</div>\
<div class='wikibase-statementlistview'>\
<div class='wikibase-statementlistview-listview'>\
<div class='wikibase-statementview wb-normal listview-item wikibase-toolbar-item'> Prepost and fact</div>\
<div class='wikibase-statementview-references-container'>\
</div>\
</div>\
</div>\
</div>\
"

function makePaperEntry(entry) {
    return `<div class="wikibase-statementgroupview listview-item" id="${entry.cprojectID}">
  <div class="wikibase-statementgroupview-property">
    <div class="wikibase-statementgroupview-property-label" dir="auto" style="position: relative; top: 0.422351px; left: 0px;"><a title="${entry.cprojectID}" href="https://europepmc.org/articles/${entry.cprojectID}">${entry.cprojectID}</a></div>
  </div>
  <div class="wikibase-statementlistview">
	<div class="wikibase-statementlistview-listview">
	</div>
    <span class="wikibase-toolbar-container"></span>
</div>
</div>`
}

function makeFactListEntry(entry) {
  return `<div class="wikibase-statementview wikibase-statement-thisisauuidreallyipromise wb-normal listview-item wikibase-toolbar-item">
        <div class="wikibase-statementview-mainsnak-container">
          <div class="wikibase-statementview-mainsnak" dir="auto">
            <div class="wikibase-snakview">
              <div class="wikibase-snakview-property-container">
                <div class="wikibase-snakview-property" dir="auto"></div>
              </div>
              <div class="wikibase-snakview-value-container" dir="auto">
                <div class="wikibase-snakview-typeselector"></div>
                <div class="wikibase-snakview-value wikibase-snakview-variation-valuesnak"><a title="${entry.term}" href="#">${entry.prefix}${entry.term}${entry.post}</a></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`
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
//      $('#'+titleid).after( factListHTML )
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
	  $('#'+titleid).after( makePaperEntry(entry) )
      }
	  $('#'+entry.cprojectID).after( makeFactListEntry(entry) )
      
  }
}

jQuery(document).ready ( function() {
  if ( mw.config.get('wgNamespaceNumber') != 0 ) return ;
  if ( mw.config.get('wgAction') != 'view' ) return ;
  wfm.init () ;
});
