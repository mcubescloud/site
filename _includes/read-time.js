<script type='text/javascript'>
/*!
Name: Reading Time
Dependencies: jQuery
Author: mcubes
Author URL: http://mcubescloud.tk
Date Created: --
Date Updated: --
Licensed under the MIT license
*/
//<![CDATA[
;(function(a){a.fn.readingTime=function(r){if(!this.length){return this}var h={readingTimeTarget:".eta",wordCountTarget:null,wordsPerMinute:270,round:true,lang:"en",lessThanAMinuteString:"",prependTimeString:"",prependWordString:"",remotePath:null,remoteTarget:null};var i=this;var c=a(this);i.settings=a.extend({},h,r);var e=i.settings.readingTimeTarget;var d=i.settings.wordCountTarget;var k=i.settings.wordsPerMinute;var p=i.settings.round;var b=i.settings.lang;var l=i.settings.lessThanAMinuteString;var o=i.settings.prependTimeString;var f=i.settings.prependWordString;var g=i.settings.remotePath;var n=i.settings.remoteTarget;if(b=="it"){var m=l||"Meno di un minuto";var q="mins"}else{if(b=="fr"){var m=l||"Moins d'une minute";var q="mins"}else{if(b=="de"){var m=l||"Weniger als eine Minute";var q="mins"}else{if(b=="es"){var m=l||"Menos de un minuto";var q="mins"}else{if(b=="nl"){var m=l||"Minder dan een minuut";var q="mins"}else{var m=l||"< 1 Min";var q="mins"}}}}}var j=function(y){var v=y.trim().split(/\s+/g).length;var u=k/60;var s=v/u;if(p===true){var x=Math.round(s/60)}else{var x=Math.floor(s/60)}var w=Math.round(s-x*60);if(p===true){if(x>0){a(e).text(o+x+" "+q)}else{a(e).text(o+m)}}else{var t=x+":"+w;a(e).text(o+t)}if(d!==""&&d!==undefined){a(d).text(f+v)}};c.each(function(){if(g!=null&&n!=null){a.get(g,function(s){j(a("<div>").html(s).find(n).text())})}else{j(c.text())}})}})(jQuery);
//]]>
</script>
<script type='text/javascript'>
$(function() {
$(&#39;.post-body&#39;).readingTime();
});
</script>
