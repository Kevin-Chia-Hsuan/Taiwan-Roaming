/* 自訂初始化的 Swiper 套件的函式 */
function initSwiper() {
/*
id="comment-swiper" 區塊是我想要使用 swiper 套件的範圍
要抓取 id "#comment-swiper"
可以參考 CodePen 來看這個 id 是對應到哪個區塊
*/

const swiper = new Swiper('#comment-swiper', {

    /*  預設要顯示幾個卡片 */
    slidesPerView: 1,
    /* 切換按鈕 */
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    /* 分頁設定 */
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    /* 自動播放 */
    autoplay: {
      delay: 5000,
    },
  });
}

/* 觸發自己定義的函式 */
initSwiper();
