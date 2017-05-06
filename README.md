# wikifactmine-gadget
# Introduction
This is a userscript to showcase the output of the wikifactmine pipeline as facts on individual wikidata items.

# Instructions for Use


# Instructions for development
The best way to work on this script is to host a local https server (with a self signed cert accepted by your browser) and to link to it by inserting the following into your [common.js](https://www.wikidata.org/wiki/Special:MyPage/common.js) on Wikidata:
`mw.loader.load( 'https://localhost:8050/wikifactmine-gadget.js' );`

It needs to be https or chrome (or your browser) will throw an error.
