function match(selector, element) {
  let selector_arr = selector.split(' ');//获取element层级
  let parent_arr = [];//用于保存父节点
  let selector_re = /(\w+)|(\.\w+)|(\#\w+)/g;
  for(let i = 0; i < selector_arr.length; i++){
    parent_arr.push(selector_arr[i].match(selector_re));
  }
  
  let matched = true;
  //从当前节点开始向上循环
  for (let j = parent_arr.length-1;j>=0;j--){
    if(!currentElementMatch(parent_arr[j], element)){
      matched = false;
      break;
    }
    element = element.parentNode;
  }
  return matched;
}
 
function currentElementMatch(currSelector, currElement){
  let hasId = false, hasClass = false, hasTag = false;
  let idMatch = false, classMatch = false, tagMatch = false;
  for(let i = 0; i<currSelector.length;i++;){
    if(currSelector[i].charAt(0) === '#'){
      hasId = true;
      if(currElement.id === currSelector[i].replace('#','')){
        idMatch = true;
      }
    }else if(currSelector[i].charAt(0) === '.'){
      hasClass = true;
      classMatch = false;//因为class可能有多个，所以没判断一个class这里都要先置为false
      for(let j = 0;j<currElement.classList.length; j++){
        if(currElement.classList[j] === currSelector[i].replace('.','')){
          classMatch = true;
          break;
        }
      }
    }else{
      hasTag = true;
      if(currElement.tagName.toLowerCase() === currSelector[i]){
        tagMatch = true;
      }
    }
  }
  return ((hasId && idMatch) || !hasId) && ((hasClass && classMatch) || !hasClass) && ((hasTag && tagMatch) || !hasTag)
}