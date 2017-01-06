/*
 * ページ読み込み時に実行したい処理
 */
window.onload = () => {
  // マテリアル
  $.material.init()
  // カルーセル
  $('.carousel.carousel-slider').carousel({full_width: true});
  const carouselTimer = setInterval(() => {
    console.log("carousel");
    $('.carousel.carousel-slider').carousel('next');
  }, 3000);
}