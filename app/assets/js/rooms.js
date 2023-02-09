/* global axios */
/* global Swal */

// 宣告旅宿頁面旅宿列表
const roomsList = document.querySelector('.rooms-list');

// 縣市篩選下拉選單
const roomsCitySelect = document.querySelector('.rooms-city-select');
// 分類篩選下拉選單
const roomsClassificationSelect = document.querySelector('.rooms-classification-select');
// 縣市搜尋按鈕
const roomsSendSelect = document.querySelector('.rooms-send-select');

// 關鍵字input輸入
const roomsSearch = document.querySelector('.rooms-search');
// 關鍵字搜尋按鈕
const roomsSearchBtn = document.querySelector('.rooms-search-btn');

// 頁碼
const roomsPages = document.querySelector('.rooms-pages');

// toursSendSelect.addEventListener('click', (e) => {
//     console.log(toursCitySelect.value, toursClassificationSelect.value);
// });

// toursSearchBtn.addEventListener('click', (e) => {
//     console.log(toursSearch.value);
// });

//  渲染列表
function renderRoomsList(data) {
  let str = '';
  // console.log(data.length);
  if (data.length === 0) {
    str = `<li class="d-flex justify-content-center align-items-center vh-100">
    <span class="material-icons text-sm-m text-md-lg text-2xl me-4">
      error_outline
    </span>
    <p class="text-sm-m text-md-lg text-2xl text-center">無相關旅宿資料，請重新搜尋！
    </p>
  </li>`;
    roomsList.innerHTML = str;
    record.innerHTML = '本次搜尋共 0 筆資料';
  } else {
    data.forEach((item) => {
      // console.log(item);

      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      str += `<li class="col-md-6 col-lg-4 d-flex flex-column">
        <div class="card my-2 my-md-4 my-lg-6 card-shadow-hover h-100">
          <a href="" class="stretched-link" data-bs-toggle="modal" data-bs-target="#roomScenicSpotModal"
            data-bs-whatever="${item.HotelID}">
            <img src="${item.Picture.PictureUrl1}"
              onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null"
              class="card-img-top img-fluid" alt=".${item.Picture.PictureDescription1}">
          </a>
          <div class="card-body">
            <h4 class="text-sm-m text-lg text-warning">${item.HotelName}</h4>
            <p class="text-s text-primary mt-2">所在地址：${item.Address}</p>
            <p class="text-s text-primary mt-2">連絡電話：${item.Phone}</p>
          </div>
        </div>
      </li>`;
    });
    // 如果頁面中有 tourList 這個DOM時，則執行渲染頁面
    if (roomsList) {
      roomsList.innerHTML = str;
      record.innerHTML = `本次搜尋共 ${roomData.length} 筆資料`;
      // classification.classList.add('d-none');
    }
  }
}

// 整體分頁功能
function renderRoomsPage(nowPage) {
  // 假設一頁 12 筆
  const dataPerPage = 12; // 一頁 12 筆資料 1~12 13~24 25~
  const totalPages = Math.ceil(roomData.length / dataPerPage); // 需要的頁數（無條件進位）

  const minData = dataPerPage * nowPage - dataPerPage + 1;
  const maxData = dataPerPage * nowPage;
  // console.log('minData', minData, 'maxData', maxData);

  // 取出當前頁數的旅宿資料
  const currentData = [];
  roomData.forEach((item, index) => {
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

    roomsPages.innerHTML = str;
  }
  // 呈現出該頁資料
  if (roomsList) {
    renderRoomsList(currentData);
  }

  // 呈現分頁按鈕
  renderPageBtn(pageInfo);
}

if (roomsPages) {
  // 點選按鈕切換頁面
  roomsPages.addEventListener('click', (e) => {
    e.preventDefault();
    // console.log('click!',e.target.nodeName);
    if (e.target.nodeName !== 'A') {
      return;
    }

    const clickPage = e.target.dataset.page;
    // console.log(clickPage);

    renderRoomsPage(clickPage);
  });

  // 縣市篩選功能-監聽
  roomsSendSelect.addEventListener('click', () => {
    // console.log('點擊到了');
    const roomsCity = roomsCitySelect.value;
    const roomsClassifications = roomsClassificationSelect.value;
    // console.log(roomsCity);
    // console.log(roomsClassifications);
    const url = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel/${roomsCity}?%24format=JSON`;
    const url2 = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel/${roomsCity}?$filter=contains(Class,'${roomsClassifications}')&$format=JSON`;
    const url3 = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?$filter=contains(Class,'${roomsClassifications}')&$format=JSON`;

    if (roomsCity === 'All' && roomsClassifications === 'All') {
      // getAllRoomsList();
      Swal.fire(
        '出錯了',
        '請至少選擇一個下拉選項',
        'error',
      );
    } else if (roomsCity !== 'All' && roomsClassifications !== 'All') {
      // 呼叫 API 服務，取得指定縣市、指定分類之觀光旅宿資料
    axios.get(url2,
      {
        headers: GetAuthorizationHeader(),
      }).then((res) => {
        // console.log(res.data);
        roomData = res.data;
        renderRoomsPage(1);
      }).catch((error) => {
        console.log(error);
      });
    } else if (roomsCity === 'All' && roomsClassifications !== 'All') {
      // 呼叫 API 服務，取得全部縣市、指定分類之觀光旅宿資料
    axios.get(url3,
      {
        headers: GetAuthorizationHeader(),
      }).then((res) => {
        // console.log(res.data);
        roomData = res.data;
        renderRoomsPage(1);
      }).catch((error) => {
        console.log(error);
      });
    } else {
      // 呼叫 API 服務，取得指定縣市、未指定分類之觀光旅宿資料
      axios.get(url,
        {
          headers: GetAuthorizationHeader(),
        }).then((res) => {
          // console.log(res.data);
          roomData = res.data;
          renderRoomsPage(1);
        }).catch((error) => {
          console.log(error);
      });
    }
  });

  // 關鍵字搜尋功能-監聽
  roomsSearchBtn.addEventListener('click', () => {
    const keyword = roomsSearch.value.replace(/\s*/g, '');
      if (keyword === '') {
        Swal.fire(
          '出錯了',
          '請至少輸入 1 字 以上',
          'error',
        );
      } else {
        const url = `https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?$filter=contains(HotelName,'${keyword}')&$format=JSON`;
      // console.log(keyword);
      axios.get(url)
      .then((res) => {
        roomData = res.data;
        // console.log(thisData);
        // renderList(roomData);
        // 初始取得資料渲染第一頁
        renderRoomsPage(1);
      }).catch((error) => {
        console.log(error);
      });
    }
  });
}

// 取得分頁預設旅宿資料
function getDefaultRoomsList() {
  const url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?%24filter=Picture%2FPictureUrl1%20ne%20null&%24top=120&%24format=JSON';
  axios.get(
    url,
    {
      headers: GetAuthorizationHeader(),
    },
    ).then((res) => {
      roomData = res.data;
      renderRoomsPage(1);
    })
    .catch((error) => {
      console.log(error);
    });
}

function initRooms() {
  if (roomsList) {
    getDefaultRoomsList();
  }
}

initRooms();
