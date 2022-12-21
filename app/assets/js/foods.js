/* global axios */
/* global Swal */

// 宣告景點美食景點列表
const foodsList = document.querySelector('.foods-list');

// 宣告觀光美食縣市篩選下拉選單
const foodsCitySelect = document.querySelector('.foods-city-select');
// 宣告觀光美食分類篩選下拉選單
const foodsClassificationSelect = document.querySelector('.foods-classification-select');
// 宣告觀光美食縣市搜尋按鈕
const foodsSendSelect = document.querySelector('.foods-send-select');

// 宣告觀光美食關鍵字input輸入
const foodsSearch = document.querySelector('.foods-search');
// 宣告觀光美食關鍵字搜尋按鈕
const foodsSearchBtn = document.querySelector('.foods-search-btn');

// 宣告觀光美食頁碼
const foodsPages = document.querySelector('.foods-pages');

// foodsSendSelect.addEventListener('click', (e) => {
//     console.log(foodsCitySelect.value, foodsClassificationSelect.value);
// });

// foodsSearchBtn.addEventListener('click', (e) => {
//     console.log(foodsSearch.value);
// });

//  渲染觀光美食頁面列表
function renderFoodsList(data) {
  let str = '';
  // console.log(data.length);
  if (data.length === 0) {
    str = `<li class="d-flex justify-content-center align-items-center">
    <span class="material-icons text-sm-m text-md-lg text-2xl me-4">
      error_outline
    </span>
    <p class="text-sm-m text-md-lg text-2xl text-center">無相關美食資料，請重新搜尋！
    </p>
  </li>`;
    foodsList.innerHTML = str;
  } else {
    data.forEach((item) => {
      // console.log(item);

      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://i.ibb.co/5WGrGkK/404.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      if (item.OpenTime === undefined) {
        str += `<li class="col-md-6 col-lg-4 d-flex flex-column">
        <div class="card my-2 my-md-4 my-lg-6 card-shadow-hover h-100">
          <a href="" class="stretched-link" data-bs-toggle="modal" data-bs-target="#foodScenicSpotModal"
            data-bs-whatever="${item.RestaurantID}">
            <img src="${item.Picture.PictureUrl1}"
              onerror="this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null"
              class="card-img-top img-fluid" alt=".${item.Picture.PictureDescription1}">
          </a>
          <div class="card-body">
            <h4 class="text-sm-m text-lg text-warning">${item.RestaurantName}</h4>
            <div class="d-flex">
              <p class="text-s text-primary mt-2">開放時間：未提供相關時間</p>
            </div>
            <p class="text-s text-primary mt-2">所在地址：${item.Address}</p>
            <p class="text-s text-primary mt-2">連絡電話：${item.Phone}</p>
          </div>
        </div>
      </li>`;
      } else {
        str += `<li class="col-md-6 col-lg-4 d-flex flex-column">
        <div class="card my-2 my-md-4 my-lg-6 card-shadow-hover h-100">
          <a href="" class="stretched-link" data-bs-toggle="modal" data-bs-target="#foodScenicSpotModal"
            data-bs-whatever="${item.RestaurantID}">
            <img src="${item.Picture.PictureUrl1}"
              onerror="this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null"
              class="card-img-top img-fluid" alt=".${item.Picture.PictureDescription1}">
          </a>
          <div class="card-body">
            <h4 class="text-sm-m text-lg text-warning">${item.RestaurantName}</h4>
            <p class="text-s text-primary mt-2">開放時間：${item.OpenTime}</p>
            <p class="text-s text-primary mt-2">所在地址：${item.Address}</p>
            <p class="text-s text-primary mt-2">連絡電話：${item.Phone}</p>
          </div>
        </div>
      </li>`;
      }
    });
    // 如果美食中有 tourList 這個DOM時，則執行渲染美食
    if (foodsList) {
      foodsList.innerHTML = str;
      // classification.classList.add('d-none');
    }
  }
}

// 整體觀光美食分頁功能
function renderFoodsPage(nowPage) {
  // 假設一頁 12 筆
  const dataPerPage = 12; // 一頁 12 筆資料 1~12 13~24 25~
  const totalPages = Math.ceil(foodData.length / dataPerPage); // 需要的頁數（無條件進位）

  const minData = dataPerPage * nowPage - dataPerPage + 1;
  const maxData = dataPerPage * nowPage;
  // console.log('minData', minData, 'maxData', maxData);

  // 取出當前頁數的景點資料
  const currentData = [];
  foodData.forEach((item, index) => {
    if (index + 1 >= minData && index + 1 <= maxData) {
      currentData.push(item);
    }
  });
  // console.log(data);

  // 頁數資訊
  const pageInfo = {
    totalPages, // 總頁數
    nowPage, // 當前頁數
    isFirst: nowPage == 1, // 是否為第一頁
    isLast: nowPage == totalPages, // 是否為最後一頁
  };

// 渲染觀光美食分頁按鈕
function renderPageBtn(pageInfoData) {
  let str = '';
  const allTotalPages = pageInfo.totalPages;

  // 是不是第一頁
  if (pageInfoData.isFirst) {
    str += `
      <li class="page-item disabled">
        <a class="page-link" href="#">
          &laquo;
        </a>
      </li>
    `;
  } else {
    str += `
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" data-page="${Number(pageInfoData.nowPage) - 1}">
          &laquo;
        </a>
      </li>
    `;
  }

  // 第 2 ~
  for (let i = 1; i <= allTotalPages; i++) {
    if (Number(pageInfoData.nowPage) === i) {
      str += `
        <li class="page-item active" aria-current="page">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    } else {
      str += `
        <li class="page-item" aria-current="page">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `;
    }
  }

  // 是不是最後一頁
  if (pageInfoData.isLast) {
    str += `
      <li class="page-item disabled">
        <a class="page-link" href="#">
          &raquo;
        </a>
      </li>
    `;
  } else {
    str += `
      <li class="page-item">
        <a class="page-link" href="#" aria-label="Next" data-page="${Number(pageInfoData.nowPage) + 1}">
          &raquo;
        </a>
      </li>
    `;
  }

  foodsPages.innerHTML = str;
  }
  // 呈現出該頁資料
  if (foodsList) {
    renderFoodsList(currentData);
  }

  // 呈現分頁按鈕
  renderPageBtn(pageInfo);
}

if (foodsPages) {
  // 點選按鈕切換觀光美食
  foodsPages.addEventListener('click', (e) => {
    e.preventDefault();
    // console.log('click!',e.target.nodeName);
    if (e.target.nodeName !== 'A') {
      return;
    }

    const clickPage = e.target.dataset.page;
    // console.log(clickPage);

    renderFoodsPage(clickPage);
  });

  // 觀光美食縣市篩選功能-監聽
  foodsSendSelect.addEventListener('click', () => {
    // console.log('點擊到了');
    const foodsCity = foodsCitySelect.value;
    let foodsClassifications = foodsClassificationSelect.value;
    // console.log(foodsClassifications);
    // google瀏覽器，"其他"兩個字有時候會變成"其��"，故增加此判斷
    if (foodsClassifications === '其��') {
      foodsClassifications = '其他';
    }
    const url = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant/${foodsCity}?%24format=JSON`;
    const url2 = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant/${foodsCity}?$filter=contains(Class,'${foodsClassifications}')&$format=JSON`;
    const url3 = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?$filter=contains(Class,'${foodsClassifications}')&$format=JSON`;

    if (foodsCity === 'All' && foodsClassifications === 'All') {
      Swal.fire(
        '出錯了',
        '請至少選擇一個下拉選項',
        'error',
      );
    } else if (foodsCity !== 'All' && foodsClassifications !== 'All') {
      // 呼叫 API 服務，取得指定縣市、指定分類之觀光美食資料
    axios.get(url2,
      {
        headers: GetAuthorizationHeader(),
      }).then((res) => {
        // console.log(res.data);
        foodData = res.data;
        renderFoodsPage(1);
      }).catch((error) => {
        console.log(error);
      });
    } else if (foodsCity === 'All' && foodsClassifications !== 'All') {
      // 呼叫 API 服務，取得全部縣市、指定分類之觀光美食資料
    axios.get(url3,
      {
        headers: GetAuthorizationHeader(),
      }).then((res) => {
        // console.log(res.data);
        foodData = res.data;
        renderFoodsPage(1);
      }).catch((error) => {
        console.log(error);
      });
    } else {
      // 呼叫 API 服務，取得指定縣市、未指定分類之觀光美食資料
      axios.get(url,
        {
          headers: GetAuthorizationHeader(),
        }).then((res) => {
          // console.log(res.data);
          foodData = res.data;
          renderFoodsPage(1);
        }).catch((error) => {
          console.log(error);
      });
    }
  });

  // 觀光美食關鍵字搜尋功能-監聽
  foodsSearchBtn.addEventListener('click', () => {
    const keyword = foodsSearch.value.replace(/\s*/g, '');
      if (keyword === '') {
        Swal.fire(
          '出錯了',
          '請至少輸入 1 字 以上',
          'error',
        );
      } else {
        const url = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?$filter=contains(RestaurantName,'${keyword}')&$format=JSON`;
      // console.log(keyword);
      axios.get(url)
      .then((res) => {
        foodData = res.data;
        // console.log(thisData);
        // renderList(foodData);
        // 初始取得資料渲染第一頁
        renderFoodsPage(1);
      }).catch((error) => {
        console.log(error);
      });
    }
  });
}
