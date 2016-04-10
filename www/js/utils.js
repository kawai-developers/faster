var unique_array=function(array)
{
  var tmp=[];

  if(array.forEach)array.forEach(function(item,i)
  {
    if(tmp.indexOf(item)===-1) tmp.push(item);
  });

  return tmp;
}
