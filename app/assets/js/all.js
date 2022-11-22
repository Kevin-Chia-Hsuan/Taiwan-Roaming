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

// 宣告列表
const attractionsList = document.querySelector('.attractions-list');
const foodList = document.querySelector('.food-list');

// 存放觀光景點資料
let attractionsData = [];
// 存放美食景點資料
let foodData = [];

// Modal
const ScenicSpotModal = document.querySelector('#attractionsScenicSpotModal');
const FoodSpotModal = document.querySelector('#foodScenicSpotModal');

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
              <p class="text-s text-success mt-2">開放時間：未提供相關時間</p>
            </div>
            <p class="text-s text-success mt-2">連絡電話：${item.Phone}</p>
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
            <p class="text-s text-success mt-2">開放時間：${item.OpenTime}</p>
            <p class="text-s text-success mt-2">連絡電話：${item.Phone}</p>
          </div>
        </div>
      </li>`;
      }
    });
    attractionsList.innerHTML = str;
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
// 監聽
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
      description.textContent = `${item.DescriptionDetail}`;
      if (item.OpenTime === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.OpenTime = '未提供';
      }
      openTime.innerHTML = `
        <span class="material-icons-outlined me-2">
          schedule
        </span>
        ${item.OpenTime}
      `;
      phone.innerHTML = `
        <span class="material-icons me-2">
          call
        </span>
        <a href="tel:+${item.Phone}">${item.Phone}</a>
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
              <p class="text-s text-success mt-2">開放時間：未提供相關時間</p>
            </div>
            <p class="text-s text-success mt-2">所在地址：${item.Address}</p>
            <p class="text-s text-success mt-2">連絡電話：${item.Phone}</p>
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
            <p class="text-s text-success mt-2">開放時間：${item.OpenTime}</p>
            <p class="text-s text-success mt-2">所在地址：${item.Address}</p>
            <p class="text-s text-success mt-2">連絡電話：${item.Phone}</p>
          </div>
        </div>
      </li>`;
      }
    });
    foodList.innerHTML = str;
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
FoodSpotModal.addEventListener('show.bs.modal', (e) => {
  // console.log(e.relatedTarget);
  const modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性
  const id = modalBtn.getAttribute('data-bs-whatever');
  const img = FoodSpotModal.querySelector('.card-img-top');
  const title = FoodSpotModal.querySelector('.card-title');
  const description = FoodSpotModal.querySelector('.card-text');
  const openTime = FoodSpotModal.querySelector('.openTime');
  const phone = FoodSpotModal.querySelector('.phone');

  foodData.forEach((item) => {
    // console.log(item.RestaurantID);
    if (item.RestaurantID === id) {
      img.setAttribute('src', `${item.Picture.PictureUrl1}`);
      title.textContent = `${item.RestaurantName}`;
      description.textContent = `${item.Description}`;
      if (item.OpenTime === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.OpenTime = '未提供';
      }
      openTime.innerHTML = `
        <span class="material-icons-outlined me-2">
          schedule
        </span>
        ${item.OpenTime}
      `;
      phone.innerHTML = `
        <span class="material-icons me-2">
          call
        </span>
        <a href="tel:+${item.Phone}">${item.Phone}</a>
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
}

init();
