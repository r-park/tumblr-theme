/* v0.1.3 - 2015-07-06T08:18:54.124Z - https://github.com/r-park/tumblr-theme */
$(function(){$(".posts").imagesReady().then(function(e){e.show();var n=new Quartz({container:e[0],items:".post",columnClass:"g-col",mediaQueries:[{query:"screen and (max-width: 37.49em)",columns:1},{query:"screen and (min-width: 37.5em) and (max-width: 49.99em)",columns:2},{query:"screen and (min-width: 50em)",columns:3}]}),t=infiniteScroll({itemSelector:".post",nextSelector:".pagination__next",threshold:1500,waitForImages:!0});t.on("load:end",function(e,t){n.append(e.items),Tumblr.LikeButton.get_status_by_page(e.page),t()}),t.load()})});