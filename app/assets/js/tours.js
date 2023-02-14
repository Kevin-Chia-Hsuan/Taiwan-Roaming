/* global axios */
/* global Swal */

// 宣告景點頁面景點列表
const toursList = document.querySelector('.tours-list');

// 縣市篩選下拉選單
const toursCitySelect = document.querySelector('.tours-city-select');
// 分類篩選下拉選單
const toursClassificationSelect = document.querySelector('.tours-classification-select');
// 縣市搜尋按鈕
const toursSendSelect = document.querySelector('.tours-send-select');
// 關鍵字input輸入
const toursSearch = document.querySelector('.tours-search');
// 關鍵字搜尋按鈕
const toursSearchBtn = document.querySelector('.tours-search-btn');
// 關鍵字搜尋form
const toursKeywordForm = document.querySelector('.tours-keyword-form');
// 下拉搜尋form
const toursSelectForm = document.querySelector('.tours-select-form');

// 頁碼
const toursPages = document.querySelector('.tours-pages');

// toursSendSelect.addEventListener('click', (e) => {
//     console.log(toursCitySelect.value, toursClassificationSelect.value);
// });

// toursSearchBtn.addEventListener('click', (e) => {
//     console.log(toursSearch.value);
// });

//  渲染列表
function renderToursList(data) {
  let str = '';
  // console.log(data.length);
  if (data.length === 0) {
    str = `<li class="d-flex justify-content-center align-items-center vh-100">
    <span class="material-icons text-sm-m text-md-lg text-2xl me-4">
      error_outline
    </span>
    <p class="text-sm-m text-md-lg text-2xl text-center">無相關景點資料，請重新搜尋！
    </p>
  </li>`;
    toursList.innerHTML = str;
    record.innerHTML = '本次顯示共 0 筆資料';
  } else {
    data.forEach((item) => {
      // console.log(item);

      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      if (item.OpenTime === undefined) {
        str += `<li class="col-md-6 col-lg-4 d-flex flex-column">
        <div class="card my-2 my-md-4 my-lg-6 card-shadow-hover h-100">
          <a href="" class="stretched-link" data-bs-toggle="modal" data-bs-target="#tourScenicSpotModal"
            data-bs-whatever="${item.ScenicSpotID}">
            <img src="${item.Picture.PictureUrl1}"
              onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null"
              class="card-img-top img-fluid" alt=".${item.Picture.PictureDescription1}">
          </a>
          <div class="card-body">
            <h4 class="text-sm-m text-lg text-warning">${item.ScenicSpotName}</h4>
            <div class="d-flex">
              <p class="text-s text-primary mt-2">開放時間：未提供相關時間</p>
            </div>
            <p class="text-s text-primary mt-2">連絡電話：${item.Phone}</p>
          </div>
        </div>
      </li>`;
      } else {
        str += `<li class="col-md-6 col-lg-4 d-flex flex-column">
        <div class="card my-2 my-md-4 my-lg-6 card-shadow-hover h-100">
          <a href="" class="stretched-link" data-bs-toggle="modal" data-bs-target="#tourScenicSpotModal"
            data-bs-whatever="${item.ScenicSpotID}">
            <img src="${item.Picture.PictureUrl1}"
              onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null"
              class="card-img-top img-fluid" alt=".${item.Picture.PictureDescription1}">
          </a>
          <div class="card-body">
            <h4 class="text-sm-m text-lg text-warning">${item.ScenicSpotName}</h4>
            <p class="text-s text-primary mt-2">開放時間：${item.OpenTime}</p>
            <p class="text-s text-primary mt-2">連絡電話：${item.Phone}</p>
          </div>
        </div>
      </li>`;
      }
    });
    // 如果頁面中有 tourList 這個DOM時，則執行渲染頁面
    if (toursList) {
      toursList.innerHTML = str;
      record.innerHTML = `本次顯示共 ${tourData.length} 筆資料`;
      // classification.classList.add('d-none');
    }
  }
}

// 整體分頁功能
function renderToursPage(nowPage) {
  // 假設一頁 12 筆
  const dataPerPage = 12; // 一頁 12 筆資料 1~12 13~24 25~
  const totalPages = Math.ceil(tourData.length / dataPerPage); // 需要的頁數（無條件進位）

  const minData = dataPerPage * nowPage - dataPerPage + 1;
  const maxData = dataPerPage * nowPage;
  // console.log('minData', minData, 'maxData', maxData);

  // 取出當前頁數的景點資料
  const currentData = [];
  tourData.forEach((item, index) => {
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

  // 渲染分頁按鈕
  function renderPageBtn(pageInfoData) {
    let str = '';
    const allTotalPages = pageInfo.totalPages;

    // 如果總頁數大於0，才渲染按鈕
    if (allTotalPages > 0) {
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

    // 如果總頁數大於0，才渲染按鈕
    if (allTotalPages > 0) {
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
    }

    toursPages.innerHTML = str;
    // 切換頁面後，返回頁面最上層
    scrollTop();
  }
  // 呈現出該頁資料
  if (toursList) {
    renderToursList(currentData);
  }

  // 呈現分頁按鈕
  renderPageBtn(pageInfo);
}

if (toursPages) {
  // 點選按鈕切換頁面
  toursPages.addEventListener('click', (e) => {
    e.preventDefault();
    // console.log('click!',e.target.nodeName);
    if (e.target.nodeName !== 'A') {
      return;
    }

    const clickPage = e.target.dataset.page;
    // console.log(clickPage);

    renderToursPage(clickPage);
  });

  // 縣市篩選功能-監聽
  toursSendSelect.addEventListener('click', () => {
    // console.log('點擊到了');
    const toursCity = toursCitySelect.value;
    const toursClassifications = toursClassificationSelect.value;
    // console.log(city);
    // console.log(classification);
    const allUrl = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24format=JSON';
    const cityUrl = `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/${toursCity}?%24format=JSON`;
    const bothUrl = `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/${toursCity}?$filter=contains(Class1,'${toursClassifications}')&$format=JSON`;
    const classUrl = `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?$filter=contains(Class1,'${toursClassifications}')&$format=JSON`;

    if (toursCity === 'Default' || toursClassifications === 'Default') {
      Swal.fire(
        '出錯了',
        '請選擇欲搜尋之縣市及主題資料',
        'error',
      );
    } else if (toursCity === 'All' && toursClassifications === 'All') {
      // 呼叫 API 服務，取得全部縣市、全部分類之觀光景點資料
      axios.get(allUrl,
        {
          headers: GetAuthorizationHeader(),
        }).then((res) => {
          // console.log(res.data);
          tourData = res.data;
          renderToursPage(1);
          toursKeywordForm.reset();
        }).catch((error) => {
          console.log(error);
        });
    } else if (toursCity !== 'All' && toursClassifications !== 'All') {
      // 呼叫 API 服務，取得指定縣市、指定分類之觀光景點資料
    axios.get(bothUrl,
      {
        headers: GetAuthorizationHeader(),
      }).then((res) => {
        // console.log(res.data);
        tourData = res.data;
        renderToursPage(1);
        toursKeywordForm.reset();
      }).catch((error) => {
        console.log(error);
      });
    } else if (toursCity === 'All' && toursClassifications !== 'All') {
      // 呼叫 API 服務，取得全部縣市、指定分類之觀光景點資料
    axios.get(classUrl,
      {
        headers: GetAuthorizationHeader(),
      }).then((res) => {
        // console.log(res.data);
        tourData = res.data;
        renderToursPage(1);
        toursKeywordForm.reset();
      }).catch((error) => {
        console.log(error);
      });
    } else {
      // 呼叫 API 服務，取得指定縣市、未指定分類之觀光景點資料
      axios.get(cityUrl,
        {
          headers: GetAuthorizationHeader(),
        }).then((res) => {
          // console.log(res.data);
          tourData = res.data;
          renderToursPage(1);
          toursKeywordForm.reset();
        }).catch((error) => {
          console.log(error);
      });
    }
  });

  // 關鍵字搜尋功能-監聽
  toursSearchBtn.addEventListener('click', () => {
    const keyword = toursSearch.value.replace(/\s*/g, '');
      if (keyword === '') {
        Swal.fire(
          '出錯了',
          '請至少輸入 1 字 以上',
          'error',
        );
      } else {
        const url = `https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?$filter=contains(ScenicSpotName,'${keyword}')&$format=JSON`;
      // console.log(keyword);
      axios.get(url)
      .then((res) => {
        tourData = res.data;
        // console.log(thisData);
        // renderList(tourData);
        // 初始取得資料渲染第一頁
        renderToursPage(1);
        toursSelectForm.reset();
      }).catch((error) => {
        console.log(error);
      });
    }
  });
}

// 取得分頁預設景點資料
function getDefaultToursList() {
  const url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24top=120&%24format=JSON';
  axios.get(
    url,
    {
      headers: GetAuthorizationHeader(),
    },
    ).then((res) => {
      tourData = res.data;
      renderToursPage(1);
    })
    .catch((error) => {
      console.log(error);
    });
}

function initTours() {
  if (toursList) {
    getDefaultToursList();
  }
}

initTours();
