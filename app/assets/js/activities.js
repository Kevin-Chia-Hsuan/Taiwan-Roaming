/* global axios */
/* global Swal */

// 存放活動頁篩選後觀光活動資料
let activityFilterData = [];

// 宣告觀光活動景點列表
const activitiesList = document.querySelector('.activities-list');

// 宣告觀光活動關鍵字input輸入
const activitiesSearch = document.querySelector('.activities-search');

// 宣告觀光活動關鍵字搜尋按鈕
const activitiesSearchBtn = document.querySelector('.activities-search-btn');

// 宣告觀光活動縣市篩選下拉選單
const activitiesCitySelect = document.querySelector('.activities-city-select');

// 宣告觀光活動日期input按鈕
const eventTime = document.querySelector('.eventTime');

// 宣告觀光活動縣市搜尋按鈕
const activitiesSendSelect = document.querySelector('.activities-send-select');

// 宣告觀光活動頁碼
const activitiesPages = document.querySelector('.activities-pages');

// 如果觀光活動日期input按鈕DOM存在頁面中時
if (eventTime) {
  // 日期套件宣告
  const elem = document.querySelector('input[name="datepicker"]');
  const datepicker = new Datepicker(elem, {
    autohide: true,
    language: 'zh-CN',
    format: 'yyyy-mm-dd',
    minDate: 'today',
  });
}

//  渲染觀光活動頁面列表
function renderActivitiesList(data) {
  let str = '';
  // console.log(data.length);
  if (data.length === 0) {
    str = `<li class="d-flex justify-content-center align-items-center vh-100">
    <span class="material-icons text-sm-m text-md-lg text-2xl me-4">
      error_outline
    </span>
    <p class="text-sm-m text-md-lg text-2xl text-center">無相關活動資料，請重新搜尋！
    </p>
  </li>`;
    activitiesList.innerHTML = str;
    record.innerHTML = '本次搜尋共 0 筆資料';
  } else {
    data.forEach((item) => {
      // console.log(item);

      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }

      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      if (item.Address === undefined) {
        str += `<li class="col-md-6 col-lg-4 d-flex flex-column">
        <div class="card my-2 my-md-4 my-lg-6 card-shadow-hover h-100">
          <a href="" class="stretched-link" data-bs-toggle="modal" data-bs-target="#activitiesScenicSpotModal"
            data-bs-whatever="${item.ActivityID}">
            <img src="${item.Picture.PictureUrl1}"
              onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null"
              class="card-img-top img-fluid" alt=".${item.Picture.PictureDescription1}">
          </a>
          <div class="card-body">
            <h4 class="text-sm-m text-lg text-warning">${item.ActivityName}</h4>
            <div class="d-flex">
              <p class="text-s text-primary mt-2">活動期間：${new Date(item.StartTime).toLocaleDateString()} - ${new Date(item.EndTime).toLocaleDateString()}</p>
            </div>
            <p class="text-s text-primary mt-2">活動地址：未提供相關地址資訊</p>
          </div>
        </div>
      </li>`;
      } else {
        str += `<li class="col-md-6 col-lg-4 d-flex flex-column">
        <div class="card my-2 my-md-4 my-lg-6 card-shadow-hover h-100">
          <a href="" class="stretched-link" data-bs-toggle="modal" data-bs-target="#activitiesScenicSpotModal"
            data-bs-whatever="${item.ActivityID}">
            <img src="${item.Picture.PictureUrl1}"
              onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null"
              class="card-img-top img-fluid" alt=".${item.Picture.PictureDescription1}">
          </a>
          <div class="card-body">
            <h4 class="text-sm-m text-lg text-warning">${item.ActivityName}</h4>
            <div class="d-flex">
              <p class="text-s text-primary mt-2">活動期間：${new Date(item.StartTime).toLocaleDateString()} - ${new Date(item.EndTime).toLocaleDateString()}</p>
            </div>
            <p class="text-s text-primary mt-2">活動地址：${item.Address}</p>
          </div>
        </div>
      </li>`;
      }
    });
    // 如果活動中有 activitiesList 這個DOM時，則執行渲染活動
    if (activitiesList) {
      activitiesList.innerHTML = str;
      record.innerHTML = `本次搜尋共 ${activityFilterData.length} 筆資料`;
      // classification.classList.add('d-none');
    }
  }
}

// 整體觀光美食分頁功能
function renderActivitiesPage(nowPage) {
  // 假設一頁 12 筆
  const dataPerPage = 12; // 一頁 12 筆資料 1~12 13~24 25~
  let totalPages = 0;
  if (activityFilterData.length == 0) {
    totalPages = Math.ceil(activityData.length / dataPerPage); // 需要的頁數（無條件進位）
  }
  totalPages = Math.ceil(activityFilterData.length / dataPerPage); // 需要的頁數（無條件進位）

  const minData = dataPerPage * nowPage - dataPerPage + 1;
  const maxData = dataPerPage * nowPage;
  // console.log('minData', minData, 'maxData', maxData);

  // 取出當前頁數的景點資料
  const currentData = [];
  if (activityFilterData.length == 0) {
    activityData.forEach((item, index) => {
      if (index + 1 >= minData && index + 1 <= maxData) {
        currentData.push(item);
      }
    });
  } else {
    activityFilterData.forEach((item, index) => {
      if (index + 1 >= minData && index + 1 <= maxData) {
        currentData.push(item);
      }
    });
  }
  // console.log(data);

  // 頁數資訊
  const pageInfo = {
    totalPages, // 總頁數
    nowPage, // 當前頁數
    isFirst: nowPage == 1, // 是否為第一頁
    isLast: nowPage == totalPages, // 是否為最後一頁
  };

  // 渲染觀光活動分頁按鈕
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

    activitiesPages.innerHTML = str;
  }
  // 呈現出該頁資料
  if (activitiesList) {
    renderActivitiesList(currentData);
  }

  // 呈現分頁按鈕
  renderPageBtn(pageInfo);
}

function renderActivitiesFilter(data) {
  // 存放篩選後觀光活動資料
  const filterData = [];
  const selectTime = Date.parse(eventTime.value);
  // console.log(selectTime);
  data.forEach((item) => {
    const startTime = Date.parse(item.StartTime);
    const endTime = Date.parse(item.EndTime);
    if (Number.isNaN(selectTime)) {
      filterData.push(item);
      // console.log(eventData);
    } else if (selectTime > startTime && selectTime < endTime) {
      filterData.push(item);
    }
  });
  activityFilterData = filterData;
  // 初始取得資料渲染第一頁
  renderActivitiesPage(1);
}

// 如果觀光活動頁碼DOM存在頁面中時
if (activitiesPages) {
  // 點選按鈕切換觀光活動
  activitiesPages.addEventListener('click', (e) => {
    e.preventDefault();
    // console.log('click!',e.target.nodeName);
    if (e.target.nodeName !== 'A') {
      return;
    }

    const clickPage = e.target.dataset.page;
    // console.log(clickPage);

    renderActivitiesPage(clickPage);
  });

  // 活動關鍵字搜尋功能-監聽
  activitiesSearchBtn.addEventListener('click', () => {
    const keyword = activitiesSearch.value.replace(/\s*/g, '');
      if (keyword === '') {
        Swal.fire(
          '出錯了',
          '請至少輸入 1 字 以上',
          'error',
        );
      } else {
        const url = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?$filter=contains(ActivityName,'${keyword}')&$format=JSON`;
      // console.log(keyword);
      axios.get(url)
      .then((res) => {
        activityData = res.data;
        // console.log(thisData);
        // activityFilterData = [];
        renderActivitiesFilter(activityData);
        // 初始取得資料渲染第一頁
        renderActivitiesPage(1);
      }).catch((error) => {
        console.log(error);
      });
    }
  });

  // 活動縣市篩選&日期功能-監聽
  activitiesSendSelect.addEventListener('click', () => {
    // const selectTime = Date.parse(eventTime.value);
    // console.log(selectTime);
    const city = activitiesCitySelect.value;
    // console.log(city);
    const allUrl = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24format=JSON';
    const cityUrl = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity/${city}?%24format=JSON`;
    if (city === 'All') {
      axios.get(allUrl,
        {
          headers: GetAuthorizationHeader(),
        }).then((res) => {
          // console.log(res.data);
          activityData = res.data;
          // activityFilterData = [];
          // console.log(activityData);
          renderActivitiesFilter(activityData);
        }).catch((error) => {
          console.log(error);
        });
    } else {
      axios.get(cityUrl,
      {
        headers: GetAuthorizationHeader(),
      }).then((res) => {
        // console.log(res.data);
        activityData = res.data;
        // activityFilterData = [];
        // console.log(activityData);
        renderActivitiesFilter(activityData);
      }).catch((error) => {
        console.log(error);
      });
    }
  });
}
