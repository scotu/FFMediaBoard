// ==UserScript==
// @name                FFMediaBoard
// @namespace	        http://www.powazord.com/projects/FFMediaBoard/
// @description	        Embeds media in FriendFeed comments through oEmbed. It's a simple wrapper around jquery-oembed http://code.google.com/p/jquery-oembed/ . jquery-oembed uses http://oohembed.com to get some providers. Plain images are also embedded
// @version             1.3
// @include		http://friendfeed.com/*
// @include		http://www.friendfeed.com/*
// @include		https://friendfeed.com/*
// @include		https://www.friendfeed.com/*
// ==/UserScript==
/*
Copyright (c) 2011 Matteo Scotuzzi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// a function that loads jQuery and calls a callback function when jQuery has finished loading
// http://stackoverflow.com/questions/2246901/include-jquery-inside-greasemonkey-script-under-google-chrome/3550261#3550261
function addJQuery(callback) {
    var script = document.createElement("script");
    script.setAttribute("src", "http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js");
    script.addEventListener('load', function() {
        var script = document.createElement("script");
        script.textContent = "(" + callback.toString() + ")();";
        document.body.appendChild(script);
        }, false);
    document.body.appendChild(script);
}


function main (){
    var usjq = jQuery.noConflict(true);

(function(d){d.fn.oembed=function(l,k,j){b=d.extend(true,d.fn.oembed.defaults,k);g();return this.each(function(){var m=d(this),n=(l!=null)?l:m.attr("href"),o;if(j){b.onEmbed=j}else{b.onEmbed=function(p){d.fn.oembed.insertCode(this,b.embedMethod,p)}}if(n!=null){o=d.fn.oembed.getOEmbedProvider(n);if(o!=null){o.params=h(b[o.name])||{};o.maxWidth=b.maxWidth;o.maxHeight=b.maxHeight;a(m,n,o)}else{b.onProviderNotFound.call(m,n)}}return m})};var b,e=[];d.fn.oembed.defaults={maxWidth:null,maxHeight:null,embedMethod:"replace",defaultOEmbedProvider:"oohembed",allowedProviders:null,disallowedProviders:null,customProviders:null,defaultProvider:null,greedy:true,onProviderNotFound:function(){},beforeEmbed:function(){},afterEmbed:function(){},onEmbed:function(){},onError:function(){},ajaxOptions:{}};function i(o,n){var k=o.apiendpoint,j="",m=o.callbackparameter||"callback",l;if(k.indexOf("?")<=0){k=k+"?"}else{k=k+"&"}if(o.maxWidth!=null&&o.params.maxwidth==null){o.params.maxwidth=o.maxWidth}if(o.maxHeight!=null&&o.params.maxheight==null){o.params.maxheight=o.maxHeight}for(l in o.params){if(l==o.callbackparameter){continue}if(o.params[l]!=null){j+="&"+escape(l)+"="+o.params[l]}}k+="format=json&url="+escape(n)+j+"&"+m+"=?";return k}function a(j,n,l){var m=i(l,n),k=d.extend({url:m,type:"get",dataType:"json",success:function(p){var o=d.extend({},p);switch(o.type){case"photo":o.code=d.fn.oembed.getPhotoCode(n,o);break;case"video":o.code=d.fn.oembed.getVideoCode(n,o);break;case"rich":o.code=d.fn.oembed.getRichCode(n,o);break;default:o.code=d.fn.oembed.getGenericCode(n,o);break}b.beforeEmbed.call(j,o);b.onEmbed.call(j,o);b.afterEmbed.call(j,o)},error:b.onError.call(j,n,l)},b.ajaxOptions||{});d.ajax(k)}function g(){e=[];var m,j=[],k,l;if(!c(b.allowedProviders)){for(k=0;k<d.fn.oembed.providers.length;k++){if(d.inArray(d.fn.oembed.providers[k].name,b.allowedProviders)>=0){e.push(d.fn.oembed.providers[k])}}b.greedy=false}else{e=d.fn.oembed.providers}if(!c(b.disallowedProviders)){for(k=0;k<e.length;k++){if(d.inArray(e[k].name,b.disallowedProviders)<0){j.push(e[k])}}e=j;b.greedy=false}if(!c(b.customProviders)){d.each(b.customProviders,function(p,o){if(o instanceof d.fn.oembed.OEmbedProvider){e.push(l)}else{l=new d.fn.oembed.OEmbedProvider();if(l.fromJSON(o)){e.push(l)}}})}m=f(b.defaultOEmbedProvider);if(b.greedy==true){e.push(m)}for(k=0;k<e.length;k++){if(e[k].apiendpoint==null){e[k].apiendpoint=m.apiendpoint}}}function f(j){var k="http://oohembed.com/oohembed/";if(j=="embed.ly"){k="http://api.embed.ly/v1/api/oembed?"}return new d.fn.oembed.OEmbedProvider(j,null,null,k,"callback")}function h(l){if(l==null){return null}var j,k={};for(j in l){if(j!=null){k[j.toLowerCase()]=l[j]}}return k}function c(j){if(typeof j=="undefined"){return true}if(j==null){return true}if(d.isArray(j)&&j.length==0){return true}return false}d.fn.oembed.insertCode=function(j,l,k){if(k==null){return}switch(l){case"auto":if(j.attr("href")!=null){d.fn.oembed.insertCode(j,"append",k)}else{d.fn.oembed.insertCode(j,"replace",k)}break;case"replace":j.replaceWith(k.code);break;case"fill":j.html(k.code);break;case"append":var m=j.next();if(m==null||!m.hasClass("oembed-container")){m=j.after('<div class="oembed-container"></div>').next(".oembed-container");if(k!=null&&k.provider_name!=null){m.toggleClass("oembed-container-"+k.provider_name)}}m.html(k.code);break}};d.fn.oembed.getPhotoCode=function(j,k){var l,m=k.title?k.title:"";m+=k.author_name?" - "+k.author_name:"";m+=k.provider_name?" - "+k.provider_name:"";l='<div><a href="'+j+"\" target='_blank'><img src=\""+k.url+'" alt="'+m+'"/></a></div>';if(k.html){l+="<div>"+k.html+"</div>"}return l};d.fn.oembed.getVideoCode=function(j,k){var l=k.html;return l};d.fn.oembed.getRichCode=function(j,k){var l=k.html;return l};d.fn.oembed.getGenericCode=function(j,k){var m=(k.title!=null)?k.title:j,l='<a href="'+j+'">'+m+"</a>";if(k.html){l+="<div>"+k.html+"</div>"}return l};d.fn.oembed.isProviderAvailable=function(j){var k=getOEmbedProvider(j);return(k!=null)};d.fn.oembed.getOEmbedProvider=function(j){for(var k=0;k<e.length;k++){if(e[k].matches(j)){return e[k]}}return null};d.fn.oembed.OEmbedProvider=function(k,p,l,m,n){this.name=k;this.type=p;this.urlschemes=j(l);this.apiendpoint=m;this.callbackparameter=n;this.maxWidth=500;this.maxHeight=400;var o,r,q;this.matches=function(s){for(o=0;o<this.urlschemes.length;o++){q=new RegExp(this.urlschemes[o],"i");if(s.match(q)!=null){return true}}return false};this.fromJSON=function(s){for(r in s){if(r!="urlschemes"){this[r]=s[r]}else{this[r]=j(s[r])}}return true};function j(s){if(c(s)){return["."]}if(d.isArray(s)){return s}return s.split(";")}};d.fn.oembed.providers=[new d.fn.oembed.OEmbedProvider("youtube","video",["youtube\\.com/watch.+v=[\\w-]+&?"]),new d.fn.oembed.OEmbedProvider("flickr","photo",["flickr\\.com/photos/[-.\\w@]+/\\d+/?"],"http://flickr.com/services/oembed","jsoncallback"),new d.fn.oembed.OEmbedProvider("viddler","video",["viddler.com"]),new d.fn.oembed.OEmbedProvider("blip","video",["blip\\.tv/.+"],"http://blip.tv/oembed/"),new d.fn.oembed.OEmbedProvider("hulu","video",["hulu\\.com/watch/.*"],"http://www.hulu.com/api/oembed.json"),new d.fn.oembed.OEmbedProvider("vimeo","video",["http://www.vimeo.com/groups/.*/videos/.*","http://www.vimeo.com/.*","http://vimeo.com/groups/.*/videos/.*","http://vimeo.com/.*"],"http://vimeo.com/api/oembed.json"),new d.fn.oembed.OEmbedProvider("dailymotion","video",["dailymotion\\.com/.+"]),new d.fn.oembed.OEmbedProvider("scribd","rich",["scribd\\.com/.+"]),new d.fn.oembed.OEmbedProvider("slideshare","rich",["slideshare.net"],"http://www.slideshare.net/api/oembed/1"),new d.fn.oembed.OEmbedProvider("photobucket","photo",["photobucket\\.com/(albums|groups)/.*"],"http://photobucket.com/oembed/")]})(usjq);

    function scan(){
        var MAX_WIDTH = 630;

        usjq(".comment > .content > a").not(".l_profile").not(".l_editcomment").not(".l_deletecomment").not(".via").not(".noembed").oembed(null, {
            maxWidth: MAX_WIDTH,
            disallowedProviders: ["wikipedia"],
            onProviderNotFound: function(url) {                                     
                if (url != null) {
                    var regExp = /(\.jpg$)|(\.jpeg$)|(\.png$)|(\.gif$)/i;                                  
                    if (regExp.test(url)) {
                            $(this).html("<a href=\"" + url + "\" class=\"noembed vt-p\"><img style=\"max-width:100%;\" src=\"" + url + "\" alt=\"" + url + "\"></a>");                              
                    }                               
                }
            },
        });

    }

    // add a listener for DOM changes. see FFHideByKeyword http://userscripts.org/scripts/review/68487
    document.addEventListener('DOMNodeInserted', function (event) {
       var eventTarget = event.target;
       if ((eventTarget.toString().search("Div")) && (eventTarget.nodeType != 3)) {
          var targetClass = eventTarget.getAttribute("class");
          if (/\bcomment\b/.test(targetClass)) {
             // new post. ok, a rescan is needed now
             //checkNewPost(eventTarget.getElementsByClassName("body")[0].getElementsByClassName("ebody")[0].getElementsByClassName("title")[0].getElementsByClassName("text")[0].innerHTML);

              // scan every time a new comment is added to the page
             scan();
          }
       }
    }, false);

    // scan the page for the first time
    scan();
}

addJQuery(main);
