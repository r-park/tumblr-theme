$(function() {
  $('.posts')
    .imagesReady()
    .then(function(posts){
      posts.show();


      //===============================
      // Quartz layout
      //-------------------------------

      var quartz = new Quartz({
        container: posts[0],
        items: '.post',
        columnClass: 'g-col',
        mediaQueries: [
          {query: 'screen and (max-width: 37.49em)', columns: 1},
          {query: 'screen and (min-width: 37.5em) and (max-width: 49.99em)', columns: 2},
          {query: 'screen and (min-width: 50em)', columns: 3}
        ]
      });


      //===============================
      // Infinite scroll
      //-------------------------------

      var infiniteScroll = new InfiniteScroll({
        item: '.post',
        pagination: '.pagination__next',
        scrollBuffer: 1500,
        waitForImages: true
      });

      infiniteScroll.on('load:end', function(data, resume){
        quartz.append(data.items);
        Tumblr.LikeButton.get_status_by_page(data.page);
        resume();
      });

      infiniteScroll.load();
    });
});
