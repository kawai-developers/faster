var unique_array=function(array,unique_identifier)
{
  var tmp=[];

  if(array.forEach)array.forEach(function(item,i)
  {
    if(!item) return;
    if(typeof item[unique_identifier] !== 'undefined' && !locateObjectArray(tmp,unique_identifier,item[unique_identifier])) tmp.push(item);
  });
  return tmp;
}

function locateObjectArray(array,identifier,value)
{
  var ok=false;
  if(array.forEach)array.forEach(function(item,i)
  {
    if(item && item[identifier] && item[identifier]===value)
    {
      ok=true;
      return;
    }
  });

  return ok;
}

if (!Array.prototype.includes)
{
  Array.prototype.includes = function(searchElement /*, fromIndex*/ )
  {
    'use strict';
    var O = Object(this);
    var len = parseInt(O.length) || 0;
    if (len === 0) {
      return false;
    }
    var n = parseInt(arguments[1]) || 0;
    var k;
    if (n >= 0) {
      k = n;
    } else {
      k = len + n;
      if (k < 0) {k = 0;}
    }
    var currentElement;
    while (k < len) {
      currentElement = O[k];
      if (searchElement === currentElement ||
         (searchElement !== searchElement && currentElement !== currentElement)) { // NaN !== NaN
        return true;
      }
      k++;
    }
    return false;
  };
}
