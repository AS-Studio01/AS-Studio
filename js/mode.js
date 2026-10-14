/* Fiverr mode switch: reads site_settings/main (public read) and shows or removes every Fiverr element. Default is direct mode. */
(function(){
'use strict';
var P='profound-handbook-z3skh',DB='(default)',K='AIzaSyA1km1IvXjyPTkO0grVOunMorlOoARLd2w';
var URL_='https://firestore.googleapis.com/v1/projects/'+P+'/databases/'+DB+'/documents/site_settings/main?key='+K;
function valid(u){return typeof u==='string'&&/^https:\/\/(www\.)?fiverr\.com\/\S+$/i.test(u)&&u.indexOf('REPLACE')<0}
function apply(on,u){
  var m=(on&&valid(u))?'fiverr':'direct';
  document.documentElement.setAttribute('data-mode',m);
  if(m==='fiverr'){var a=document.querySelectorAll('[data-fiverr-link]');for(var i=0;i<a.length;i++)a[i].setAttribute('href',u)}
  try{localStorage.setItem('as-mode',m);localStorage.setItem('as-fiverr-url',m==='fiverr'?u:'')}catch(e){}
}
try{var cm=localStorage.getItem('as-mode'),cu=localStorage.getItem('as-fiverr-url');if(cm==='fiverr'&&valid(cu))apply(true,cu)}catch(e){}
var ctrl=window.AbortController?new AbortController():null,t=setTimeout(function(){ctrl&&ctrl.abort()},6000);
fetch(URL_,{cache:'no-store',signal:ctrl?ctrl.signal:undefined})
 .then(function(r){return r.ok?r.json():null})
 .then(function(j){clearTimeout(t);if(!j||!j.fields)return;var f=j.fields;apply(!!(f.fiverrMode&&f.fiverrMode.booleanValue),f.fiverrUrl&&f.fiverrUrl.stringValue)})
 .catch(function(){});
})();
