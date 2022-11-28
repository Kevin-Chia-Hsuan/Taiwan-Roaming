/* global axios */

/* 訂閱區塊JS */
const subscriptionInfoForm = document.querySelector('.subscriptionInfo-form');
// 訂閱input輸入
const subscriptionEmail = document.querySelector('.subscription-email');
// 訂閱按鈕
const subscriptionBtn = document.querySelector('.subscription-btn');

// 監聽訂閱按鈕
subscriptionBtn.addEventListener('click', () => {
    // eslint-disable-next-line no-useless-escape
    // Email 格式驗證
    const reMail = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    const { value } = subscriptionEmail;
    // console.log(value);
    if (value === '') {
        swal('出錯了！', '未輸入Email', 'error');
    } else if (!reMail.test(value)) {
        swal('出錯了！', 'Email格式錯誤', 'error');
    } else {
        swal('訂閱成功！', '將定期發送相關觀光資訊', 'success');
        subscriptionInfoForm.reset();
    }
});

// API 的 filter 用法：例如: 沒有圖片時
// $filter=Picture/PictureUrl1 ne null

// 宣告List列表
// 景點列表
const attractionsList = document.querySelector('.attractions-list');
// 美食列表
const foodList = document.querySelector('.food-list');
// 旅宿列表
const roomList = document.querySelector('.room-list');
// 活動列表
const activityList = document.querySelector('.activity-list');

// 存放觀光景點資料
let attractionsData = [];
// 存放觀光美食資料
let foodData = [];
// 存放觀光旅宿資料
let roomData = [];
// 存放觀光活動資料
let activityData = [];
// 存放篩選後觀光活動資料
const eventData = [];

// Modal
// 景點 Modal
const ScenicSpotModal = document.querySelector('#attractionsScenicSpotModal');
// 美食 Modal
const FoodSpotModal = document.querySelector('#foodScenicSpotModal');
// 旅宿 Modal
const RoomSpotModal = document.querySelector('#roomScenicSpotModal');
// 活動 Modal
const ActivitySpotModal = document.querySelector('#activityScenicSpotModal');

// 渲染預設景點列表
function renderAttractionsList(data) {
  let str = '';
  // console.log(data.length);
  if (data.length === 0) {
    str = `<li class="d-flex justify-content-center align-items-center">
    <span class="material-icons text-sm-m text-md-lg text-2xl me-4">
      error_outline
    </span>
    <p class="text-sm-m text-md-lg text-2xl text-center">目前沒有資料
    </p>
  </li>`;
    attractionsList.innerHTML = str;
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
          <a href="" class="stretched-link" data-bs-toggle="modal" data-bs-target="#attractionsScenicSpotModal"
            data-bs-whatever="${item.ScenicSpotID}">
            <img src="${item.Picture.PictureUrl1}"
              onerror="this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null"
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
          <a href="" class="stretched-link" data-bs-toggle="modal" data-bs-target="#attractionsScenicSpotModal"
            data-bs-whatever="${item.ScenicSpotID}">
            <img src="${item.Picture.PictureUrl1}"
              onerror="this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null"
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
    // 如果頁面中有 attractionsList 這個DOM時，則執行渲染頁面
    if (attractionsList) {
      attractionsList.innerHTML = str;
    }
  }
}
// 取得預設景點資料
function getAllAttractionsList() {
  const url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/Taipei?$filter=contains(Class1,%27%E9%81%8A%E6%86%A9%E9%A1%9E%27)&$top=6&$skip=9&$format=JSON';
  axios.get(
    url,
    {
      headers: GetAuthorizationHeader(),
    },
    ).then((res) => {
      attractionsData = res.data;
      renderAttractionsList(attractionsData);
      // console.log(attractionsData);
    })
    .catch((error) => {
      console.log(error);
    });
}
// 監聽點擊景點Modal
ScenicSpotModal.addEventListener('show.bs.modal', (e) => {
  // console.log(e.relatedTarget);
  const modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性
  const id = modalBtn.getAttribute('data-bs-whatever');
  const img = ScenicSpotModal.querySelector('.card-img-top');
  const title = ScenicSpotModal.querySelector('.card-title');
  const description = ScenicSpotModal.querySelector('.card-text');
  const openTime = ScenicSpotModal.querySelector('.openTime');
  const phone = ScenicSpotModal.querySelector('.phone');

  attractionsData.forEach((item) => {
    // console.log(item);
    if (item.ScenicSpotID === id) {
      img.setAttribute('src', `${item.Picture.PictureUrl1}`);
      title.textContent = `${item.ScenicSpotName}`;
      description.textContent = `景點介紹：${item.DescriptionDetail}`;
      if (item.OpenTime === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.OpenTime = '未提供';
      }
      openTime.innerHTML = `
        <span class="material-icons-outlined text-sm-s text-m me-2">
          schedule
        </span>
        開放時間：${item.OpenTime}
      `;
      phone.innerHTML = `
        <span class="material-icons text-sm-s text-m me-2">
          call
        </span>
        <div class="d-flex">
          連絡電話：
          <a class="text-sm-s text-m" href="tel:+${item.Phone}">${item.Phone}</a>
        </div>
      `;
    }
  });
});

// 渲染預設美食列表
function renderFoodList(data) {
  let str = '';
  // console.log(data.length);
  if (data.length === 0) {
    str = `<li class="d-flex justify-content-center align-items-center">
    <span class="material-icons text-sm-m text-md-lg text-2xl me-4">
      error_outline
    </span>
    <p class="text-sm-m text-md-lg text-2xl text-center">目前沒有資料
    </p>
  </li>`;
    foodList.innerHTML = str;
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
    // 如果頁面中有 foodList 這個DOM時，則執行渲染頁面
    if (foodList) {
      foodList.innerHTML = str;
    }
  }
}
// 取得預設美食資料
function getAllFoodList() {
  const url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24filter=Picture%2FPictureUrl1%20ne%20null&%24orderby=Description&%24top=6&%24skip=200&%24format=JSON';
  axios.get(
    url,
    {
      headers: GetAuthorizationHeader(),
    },
    ).then((res) => {
      foodData = res.data;
      renderFoodList(foodData);
      // console.log(foodData);
    })
    .catch((error) => {
      console.log(error);
    });
}
// 監聽點擊美食Modal
FoodSpotModal.addEventListener('show.bs.modal', (e) => {
  // console.log(e.relatedTarget);
  const modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性
  const id = modalBtn.getAttribute('data-bs-whatever');
  const img = FoodSpotModal.querySelector('.card-img-top');
  const title = FoodSpotModal.querySelector('.card-title');
  const description = FoodSpotModal.querySelector('.card-text');
  const openTime = FoodSpotModal.querySelector('.openTime');
  const address = FoodSpotModal.querySelector('.address');
  const phone = FoodSpotModal.querySelector('.phone');

  foodData.forEach((item) => {
    // console.log(item.RestaurantID);
    if (item.RestaurantID === id) {
      img.setAttribute('src', `${item.Picture.PictureUrl1}`);
      title.textContent = `${item.RestaurantName}`;
      description.textContent = `美食介紹：${item.Description}`;
      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      if (item.OpenTime === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.OpenTime = '未提供';
      }
      openTime.innerHTML = `
        <span class="material-icons-outlined text-sm-s text-m me-2">
          schedule
        </span>
        開放時間：${item.OpenTime}
      `;
      if (item.Address === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.Address = '未提供';
      }
      address.innerHTML = `
        <span class="material-icons-outlined text-sm-s text-m me-2">
          place
        </span>
        所在地址：${item.Address}
      `;
      phone.innerHTML = `
        <span class="material-icons text-sm-s text-m me-2">
          call
        </span>
        <div class="d-flex">
          連絡電話：
          <a class="text-sm-s text-m" href="tel:+${item.Phone}">${item.Phone}</a>
        </div>
      `;
    }
  });
});

// 渲染預設旅宿列表
function renderRoomsList(data) {
  let str = '';
  // console.log(data.length);
  if (data.length === 0) {
    str = `<li class="d-flex justify-content-center align-items-center">
    <span class="material-icons text-sm-m text-md-lg text-2xl me-4">
      error_outline
    </span>
    <p class="text-sm-m text-md-lg text-2xl text-center">目前沒有資料
    </p>
  </li>`;
  roomList.innerHTML = str;
  } else {
    data.forEach((item) => {
      // console.log(item);
      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://i.ibb.co/5WGrGkK/404.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      str += `<li class="col-md-6 col-lg-4 d-flex flex-column">
      <div class="card my-2 my-md-4 my-lg-6 card-shadow-hover h-100">
        <a href="" class="stretched-link" data-bs-toggle="modal" data-bs-target="#roomScenicSpotModal"
          data-bs-whatever="${item.HotelID}">
          <img src="${item.Picture.PictureUrl1}"
            onerror="this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null"
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
    // 如果頁面中有 roomList 這個DOM時，則執行渲染頁面
    if (roomList) {
      roomList.innerHTML = str;
    }
  }
}

// 取得預設景點資料
function getAllRoomsList() {
  const url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?%24filter=contains%28Class%2C%27%E5%9C%8B%E9%9A%9B%E8%A7%80%E5%85%89%E6%97%85%E9%A4%A8%27%29&%24orderby=HotelID&%24top=6&%24format=JSON';
  axios.get(
    url,
    {
      headers: GetAuthorizationHeader(),
    },
    ).then((res) => {
      roomData = res.data;
      renderRoomsList(roomData);
      // console.log(roomData);
    })
    .catch((error) => {
      console.log(error);
    });
}
// 監聽點擊旅宿Modal
RoomSpotModal.addEventListener('show.bs.modal', (e) => {
  // console.log(e.relatedTarget);
  const modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性
  const id = modalBtn.getAttribute('data-bs-whatever');
  const img = RoomSpotModal.querySelector('.card-img-top');
  const title = RoomSpotModal.querySelector('.card-title');
  const description = RoomSpotModal.querySelector('.card-text');
  const grade = RoomSpotModal.querySelector('.grade');
  const address = RoomSpotModal.querySelector('.address');
  const phone = RoomSpotModal.querySelector('.phone');

  roomData.forEach((item) => {
    // console.log(item.HotelID);
    if (item.HotelID === id) {
      img.setAttribute('src', `${item.Picture.PictureUrl1}`);
      title.textContent = `${item.HotelName}`;
      description.textContent = `旅宿介紹：${item.Description}`;
      // 如果資料中沒有 Grade，則顯示未提供星級資料
      if (item.Grade === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.Grade = '未提供星級資料';
      }
      if (item.Address === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.Address = '未提供';
      }
      address.innerHTML = `
        <span class="material-icons-outlined text-sm-s text-m me-2">
          place
        </span>
        所在地址：${item.Address}
      `;
      grade.innerHTML = `
        <span class="material-icons-outlined text-sm-s text-m me-2">
          star
        </span>
        星級：${item.Grade}
      `;
      phone.innerHTML = `
        <span class="material-icons text-sm-s text-m me-2">
          call
        </span>
        <div class="d-flex">
          連絡電話：
          <a class="text-sm-s text-m" href="tel:+${item.Phone}">${item.Phone}</a>
        </div>
      `;
    }
  });
});

// 渲染預設活動列表
function renderActivityList(data) {
  // console.log(data);
  let str = '';
  // 取得目前日期時間
  const selectTime = +new Date();
  data.forEach((item) => {
    // 宣告 存放結束日期時間 變數，轉換成時間戳格式
    const endTime = Date.parse(item.EndTime);
    // 如果活動日期時間時間 大於等於 目前日期時間
    if (endTime >= selectTime) {
      // 將篩選後資料塞入 eventData 陣列中
      eventData.push(item);
    }
  });
  // console.log(eventData);

  // 取得前 9 筆資料並渲染
  let eventDataSlice = [];
  // 如果 eventData 資料 大於等於 9 筆，則抓出前 9 筆資料
  if (eventData.length >= 9) {
    // slice() 方法會回傳一個新陣列物件，為原陣列選擇之 begin 至 end（不含 end）部分的淺拷貝（shallow copy）。而原本的陣列將不會被修改。
    eventDataSlice = eventData.slice(0, 9);
  } else {
    // 如果 eventData 資料 小於等於 9 筆，則抓出該些資料
    eventDataSlice = eventData;
  }
  // console.log(eventDataSlice);
  eventDataSlice.forEach((item) => {
    str += `<li class="swiper-slide">
    <div class="container">
      <div class="card flex-lg-row-reverse border-0">
        <img src="${item.Picture.PictureUrl1}"
        onerror="this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null"
        class="card-img-top img-fluid" alt=".${item.Picture.PictureDescription1}">
        <div class="card-body bg-tertiary text-start">
          <h4 class="card-title text-sm-m text-xl text-primary mb-6">${item.ActivityName}</h4>
          <div class="card-text">
            <div class="d-flex align-items-center mb-4">
              <span class="material-icons text-secondary me-4">
                calendar_month
              </span>
              <p class="text-sm-s text-m text-secondary">
              ${new Date(item.StartTime).toLocaleDateString()} - ${new Date(item.EndTime).toLocaleDateString()}
              </p>
            </div>
            <div class="d-flex align-items-center mb-4">
              <span class="material-icons text-secondary me-4">
                place
              </span>
              <p class="text-sm-s text-m text-secondary">
              ${item.Address}
              </p>
            </div>
          </div>
          <a href="#" class="btn btn-primary text-sm-s text-m text-light w-100 w-md-50" data-bs-toggle="modal" data-bs-target="#activityScenicSpotModal"
          data-bs-whatever="${item.ActivityID}">了解更多</a>
        </div>
      </div>
    </div>
  </li>`;
  });
  // 如果頁面中有 activityList 這個DOM時，則執行渲染頁面
  if (activityList) {
    activityList.innerHTML = str;
  }
}

// 取得預設活動資料
function getAllActivityList() {
  const url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON';
  axios.get(
    url,
    {
      headers: GetAuthorizationHeader(),
    },
    ).then((res) => {
      activityData = res.data;
      renderActivityList(activityData);
      // console.log(activityData);
    })
    .catch((error) => {
      console.log(error);
    });
}

// 監聽點擊活動Modal
ActivitySpotModal.addEventListener('show.bs.modal', (e) => {
  // console.log(e.relatedTarget);
  const modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性
  const id = modalBtn.getAttribute('data-bs-whatever');
  const img = ActivitySpotModal.querySelector('.card-img-top');
  const title = ActivitySpotModal.querySelector('.card-title');
  const description = ActivitySpotModal.querySelector('.card-text');
  const activityTime = ActivitySpotModal.querySelector('.activityTime');
  const address = ActivitySpotModal.querySelector('.address');

  eventData.forEach((item) => {
    // console.log(item.HotelID);
    if (item.ActivityID === id) {
      img.setAttribute('src', `${item.Picture.PictureUrl1}`);
      title.textContent = `${item.ActivityName}`;
      description.textContent = `活動介紹：${item.Description}`;
      activityTime.innerHTML = `
      <span class="material-icons-outlined text-sm-s text-m me-2">
        schedule
      </span>
      活動時間：${new Date(item.StartTime).toLocaleDateString()} - ${new Date(item.EndTime).toLocaleDateString()}
      `;
      if (item.Address === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.Address = '未提供';
      }
      address.innerHTML = `
        <span class="material-icons-outlined text-sm-s text-m me-2">
          place
        </span>
        活動地址：${item.Address}
      `;
    }
  });
});

// ------ 初始化
function init() {
  // 呼叫取得token函式
  // GetAuthorizationHeader();

  // 呼叫取得預設觀光景點資料
  getAllAttractionsList();
  // 呼叫取得預設觀光美食資料
  getAllFoodList();
  // 呼叫取得預設觀光旅宿資料
  getAllRoomsList();
  // 呼叫取得預設觀光活動資料
  getAllActivityList();
}

init();
