/*
  ***** BEGIN LICENSE BLOCK *****

  Copyright © 2020 Alexandre BRULET

  This file is part of Zotero.

  Zotero is free software: you can redistribute it and/or modify
  it under the terms of the GNU Affero General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  Zotero is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
  GNU Affero General Public License for more details.

  You should have received a copy of the GNU Affero General Public License
  along with Zotero. If not, see <http://www.gnu.org/licenses/>.

  ***** END LICENSE BLOCK *****
*/


function attr(docOrElem, selector, attr, index) {
  var elem = index ? docOrElem.querySelectorAll(selector).item(index) : docOrElem.querySelector(selector);
  return elem ? elem.getAttribute(attr) : null;
}

function text(docOrElem, selector, index) {
  var elem = index ? docOrElem.querySelectorAll(selector).item(index) : docOrElem.querySelector(selector);
  return elem ? elem.textContent : null;
}

function detectWeb(doc, url) {
    // Adjust the inspection of url as required
  if (url.indexOf('resultat-de-recherche') != -1 && getSearchResults(doc, true)) {
    return 'multiple';
  }
  // Adjust the inspection of url as required
  else if (url.indexOf('has-sante.fr/jcms/') != -1){
    return 'document';
  }
  // Add other cases if needed
}

function getSearchResults(doc, checkOnly) {
  var items = {};
  var found = false;
  // Adjust the CSS Selectors
  var rows = doc.querySelectorAll('.clusterSearch .content .title a');
  for (var i=0; i<rows.length; i++) {
      // Adjust if required, use Zotero.debug(rows) to check
    var href = rows[i].href;
    // Adjust if required, use Zotero.debug(rows) to check
    var title = ZU.trimInternal(rows[i].textContent);
    if (!href || !title) continue;
    if (checkOnly) return true;
    found = true;
    items[href] = title;
  }
  return found ? items : false;
}

function doWeb(doc, url) {
  if (detectWeb(doc, url) == "multiple") {
    Zotero.selectItems(getSearchResults(doc, false), function (items) {
      if (!items) {
        return true;
      }
      var articles = [];
      for (var i in items) {
        articles.push(i);
      }
      ZU.processDocuments(articles, scrape);
    });
  } else {
    scrape(doc, url);
  }
}
