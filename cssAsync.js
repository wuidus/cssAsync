function cssAsync( arrCssUri ) {

  const isDebug = false;

  if ( window.__cssList__ === void 0 ) {
    var cssList = cssAsyncList();
    window.__cssList__ = cssList;

  } else {
    var cssList = window.__cssList__ ;

  }

  if ( !Array.isArray(arrCssUri) ) arrCssUri = [arrCssUri];
  arrCssUri.forEach( (item, key, arr) => {

    cssList.addItem(item);
    var item_id = '__cssAsync__id__' + cssList.itemList.length;
    addHeadStyleTag( item_id );
    if(isDebug) console.log(document.getElementById(item_id));

   // $.when( $.ajax( item ) ).then(function( data, textStatus, jqXHR ) {
    fetch( item )
    .then(function(response) {
      if ( response.ok === true ) {
        return response.text();
      } else {
        throw item + ' not found!';
      }
    })
    .then( function( text ) {
      populateStyleTag(item_id, text);  
    })
    .catch(function(error) {
      console.error(error);
    })
    .finally(function(){
      cssList.removeItem(item);
    })
    
  });

  function addHeadStyleTag ( id ) {
  	var style = document.createElement("STYLE");
  	style.type = "text/css";
  	document.head.appendChild( style ) ;
    style.setAttribute( 'id', id );
  }

  function populateStyleTag(id, css) {
    document.getElementById(id).appendChild(
      document.createTextNode( css )
    );
  }

  function cssAsyncList() {

    var cssList = {
      addItem: function ( url ) {
        if(isDebug) console.log( 'start loading :' + url );
        this.itemList.push(url);
      },
      removeItem: function ( url ) {
        if(isDebug) console.log( 'stop loading :' + url );
        const indexToRemove = this.itemList.findIndex( (item, key, arr) => item === url );
        this.itemList.splice(indexToRemove, 1);
      },
      itemList:[],
    }

    window.addEventListener('DOMContentLoaded',function(){
      if(isDebug) console.log( 'document load ' );

      const intervalId = setInterval( ()=> {
        if( cssList.itemList.length === 0 ) {
          let html = document.querySelector('html');
          html.setAttribute('class',
            html.getAttribute('class') + ' cssLoaded '
          );
          clearInterval(intervalId);
          if(isDebug) console.log( 'css loaded' );
          if(isDebug) console.log( document.querySelector('html').getAttribute('class') );
        }
      } ,20);
    });
    return cssList;
  }
}
