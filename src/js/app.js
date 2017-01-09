/*
 * ページ読み込み時に実行したい処理
 */
window.onload = () => {
  // マテリアル
  $.material.init()
  // カルーセル
  const carousel = $('.carousel.carousel-slider');
  carousel.carousel({full_width: true});
  const carouselTimer = setInterval(() => carousel.carousel('next'), 3000);
  // スクロールアニメーション
  var trigger = new ScrollTrigger();
}
