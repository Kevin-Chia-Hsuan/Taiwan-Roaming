"use strict";

/* global axios */

/* 訂閱區塊JS */
var subscriptionInfoForm = document.querySelector('.subscriptionInfo-form'); // 訂閱input輸入

var subscriptionEmail = document.querySelector('.subscription-email'); // 訂閱按鈕

var subscriptionBtn = document.querySelector('.subscription-btn'); // 監聽訂閱按鈕

subscriptionBtn.addEventListener('click', function () {
  // eslint-disable-next-line no-useless-escape
  // Email 格式驗證
  var reMail = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  var value = subscriptionEmail.value; // console.log(value);

  if (value === '') {
    swal('出錯了！', '未輸入Email', 'error');
  } else if (!reMail.test(value)) {
    swal('出錯了！', 'Email格式錯誤', 'error');
  } else {
    swal('訂閱成功！', '將定期發送相關觀光資訊', 'success');
    subscriptionInfoForm.reset();
  }
}); // API 的 filter 用法：例如: 沒有圖片時
// $filter=Picture/PictureUrl1 ne null
// 宣告List列表

var attractionsList = document.querySelector('.attractions-list');
var foodList = document.querySelector('.food-list');
var roomList = document.querySelector('.room-list'); // 存放觀光景點資料

var attractionsData = []; // 存放觀光美食資料

var foodData = []; // 存放觀光旅宿資料

var roomData = []; // Modal

var ScenicSpotModal = document.querySelector('#attractionsScenicSpotModal');
var FoodSpotModal = document.querySelector('#foodScenicSpotModal');
var RoomSpotModal = document.querySelector('#roomScenicSpotModal'); // 渲染預設景點列表

function renderAttractionsList(data) {
  var str = ''; // console.log(data.length);

  if (data.length === 0) {
    str = "<li class=\"d-flex justify-content-center align-items-center\">\n    <span class=\"material-icons text-sm-m text-md-lg text-2xl me-4\">\n      error_outline\n    </span>\n    <p class=\"text-sm-m text-md-lg text-2xl text-center\">\u76EE\u524D\u6C92\u6709\u8CC7\u6599\n    </p>\n  </li>";
    attractionsList.innerHTML = str;
  } else {
    data.forEach(function (item) {
      // console.log(item);
      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://i.ibb.co/5WGrGkK/404.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      if (item.OpenTime === undefined) {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#attractionsScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.ScenicSpotID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.ScenicSpotName, "</h4>\n            <div class=\"d-flex\">\n              <p class=\"text-s text-success mt-2\">\u958B\u653E\u6642\u9593\uFF1A\u672A\u63D0\u4F9B\u76F8\u95DC\u6642\u9593</p>\n            </div>\n            <p class=\"text-s text-success mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      } else {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#attractionsScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.ScenicSpotID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.ScenicSpotName, "</h4>\n            <p class=\"text-s text-success mt-2\">\u958B\u653E\u6642\u9593\uFF1A").concat(item.OpenTime, "</p>\n            <p class=\"text-s text-success mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      }
    });
    attractionsList.innerHTML = str;
  }
} // 取得預設景點資料


function getAllAttractionsList() {
  var url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/Taipei?$filter=contains(Class1,%27%E9%81%8A%E6%86%A9%E9%A1%9E%27)&$top=6&$skip=9&$format=JSON';
  axios.get(url, {
    headers: GetAuthorizationHeader()
  }).then(function (res) {
    attractionsData = res.data;
    renderAttractionsList(attractionsData); // console.log(attractionsData);
  })["catch"](function (error) {
    console.log(error);
  });
} // 監聽


ScenicSpotModal.addEventListener('show.bs.modal', function (e) {
  // console.log(e.relatedTarget);
  var modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性

  var id = modalBtn.getAttribute('data-bs-whatever');
  var img = ScenicSpotModal.querySelector('.card-img-top');
  var title = ScenicSpotModal.querySelector('.card-title');
  var description = ScenicSpotModal.querySelector('.card-text');
  var openTime = ScenicSpotModal.querySelector('.openTime');
  var phone = ScenicSpotModal.querySelector('.phone');
  attractionsData.forEach(function (item) {
    // console.log(item);
    if (item.ScenicSpotID === id) {
      img.setAttribute('src', "".concat(item.Picture.PictureUrl1));
      title.textContent = "".concat(item.ScenicSpotName);
      description.textContent = "".concat(item.DescriptionDetail);

      if (item.OpenTime === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.OpenTime = '未提供';
      }

      openTime.innerHTML = "\n        <span class=\"material-icons-outlined me-2\">\n          schedule\n        </span>\n        ".concat(item.OpenTime, "\n      ");
      phone.innerHTML = "\n        <span class=\"material-icons me-2\">\n          call\n        </span>\n        <a href=\"tel:+".concat(item.Phone, "\">").concat(item.Phone, "</a>\n      ");
    }
  });
}); // 渲染預設美食列表

function renderFoodList(data) {
  var str = ''; // console.log(data.length);

  if (data.length === 0) {
    str = "<li class=\"d-flex justify-content-center align-items-center\">\n    <span class=\"material-icons text-sm-m text-md-lg text-2xl me-4\">\n      error_outline\n    </span>\n    <p class=\"text-sm-m text-md-lg text-2xl text-center\">\u76EE\u524D\u6C92\u6709\u8CC7\u6599\n    </p>\n  </li>";
    foodList.innerHTML = str;
  } else {
    data.forEach(function (item) {
      // console.log(item);
      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://i.ibb.co/5WGrGkK/404.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      if (item.OpenTime === undefined) {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#foodScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.RestaurantID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.RestaurantName, "</h4>\n            <div class=\"d-flex\">\n              <p class=\"text-s text-success mt-2\">\u958B\u653E\u6642\u9593\uFF1A\u672A\u63D0\u4F9B\u76F8\u95DC\u6642\u9593</p>\n            </div>\n            <p class=\"text-s text-success mt-2\">\u6240\u5728\u5730\u5740\uFF1A").concat(item.Address, "</p>\n            <p class=\"text-s text-success mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      } else {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#foodScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.RestaurantID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.RestaurantName, "</h4>\n            <p class=\"text-s text-success mt-2\">\u958B\u653E\u6642\u9593\uFF1A").concat(item.OpenTime, "</p>\n            <p class=\"text-s text-success mt-2\">\u6240\u5728\u5730\u5740\uFF1A").concat(item.Address, "</p>\n            <p class=\"text-s text-success mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      }
    });
    foodList.innerHTML = str;
  }
} // 取得預設美食資料


function getAllFoodList() {
  var url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24filter=Picture%2FPictureUrl1%20ne%20null&%24orderby=Description&%24top=6&%24skip=200&%24format=JSON';
  axios.get(url, {
    headers: GetAuthorizationHeader()
  }).then(function (res) {
    foodData = res.data;
    renderFoodList(foodData); // console.log(foodData);
  })["catch"](function (error) {
    console.log(error);
  });
} // 監聽


FoodSpotModal.addEventListener('show.bs.modal', function (e) {
  // console.log(e.relatedTarget);
  var modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性

  var id = modalBtn.getAttribute('data-bs-whatever');
  var img = FoodSpotModal.querySelector('.card-img-top');
  var title = FoodSpotModal.querySelector('.card-title');
  var description = FoodSpotModal.querySelector('.card-text');
  var openTime = FoodSpotModal.querySelector('.openTime');
  var phone = FoodSpotModal.querySelector('.phone');
  foodData.forEach(function (item) {
    // console.log(item.RestaurantID);
    if (item.RestaurantID === id) {
      img.setAttribute('src', "".concat(item.Picture.PictureUrl1));
      title.textContent = "".concat(item.RestaurantName);
      description.textContent = "".concat(item.Description);

      if (item.OpenTime === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.OpenTime = '未提供';
      }

      openTime.innerHTML = "\n        <span class=\"material-icons-outlined me-2\">\n          schedule\n        </span>\n        ".concat(item.OpenTime, "\n      ");
      phone.innerHTML = "\n        <span class=\"material-icons me-2\">\n          call\n        </span>\n        <a href=\"tel:+".concat(item.Phone, "\">").concat(item.Phone, "</a>\n      ");
    }
  });
}); // 渲染預設旅宿列表

function renderRoomsList(data) {
  var str = ''; // console.log(data.length);

  if (data.length === 0) {
    str = "<li class=\"d-flex justify-content-center align-items-center\">\n    <span class=\"material-icons text-sm-m text-md-lg text-2xl me-4\">\n      error_outline\n    </span>\n    <p class=\"text-sm-m text-md-lg text-2xl text-center\">\u76EE\u524D\u6C92\u6709\u8CC7\u6599\n    </p>\n  </li>";
    roomList.innerHTML = str;
  } else {
    data.forEach(function (item) {
      // console.log(item);
      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://i.ibb.co/5WGrGkK/404.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n      <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n        <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#roomScenicSpotModal\"\n          data-bs-whatever=\"".concat(item.HotelID, "\">\n          <img src=\"").concat(item.Picture.PictureUrl1, "\"\n            onerror=\"this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null\"\n            class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n        </a>\n        <div class=\"card-body\">\n          <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.HotelName, "</h4>\n          <p class=\"text-s text-success mt-2\">\u6240\u5728\u5730\u5740\uFF1A").concat(item.Address, "</p>\n          <p class=\"text-s text-success mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n        </div>\n      </div>\n    </li>");
    });
    roomList.innerHTML = str;
  }
} // 取得預設景點資料


function getAllRoomsList() {
  var url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?%24filter=contains%28Class%2C%27%E5%9C%8B%E9%9A%9B%E8%A7%80%E5%85%89%E6%97%85%E9%A4%A8%27%29&%24orderby=HotelID&%24top=6&%24format=JSON';
  axios.get(url, {
    headers: GetAuthorizationHeader()
  }).then(function (res) {
    roomData = res.data;
    renderRoomsList(roomData); // console.log(roomData);
  })["catch"](function (error) {
    console.log(error);
  });
} // 監聽


RoomSpotModal.addEventListener('show.bs.modal', function (e) {
  // console.log(e.relatedTarget);
  var modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性

  var id = modalBtn.getAttribute('data-bs-whatever');
  var img = RoomSpotModal.querySelector('.card-img-top');
  var title = RoomSpotModal.querySelector('.card-title');
  var description = RoomSpotModal.querySelector('.card-text');
  var grade = RoomSpotModal.querySelector('.grade');
  var phone = RoomSpotModal.querySelector('.phone');
  roomData.forEach(function (item) {
    // console.log(item.HotelID);
    if (item.HotelID === id) {
      img.setAttribute('src', "".concat(item.Picture.PictureUrl1));
      title.textContent = "".concat(item.HotelName);
      description.textContent = "".concat(item.Description);

      if (item.Grade === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.Grade = '未提供星級資料';
      }

      grade.innerHTML = "\n        <span class=\"material-icons-outlined me-2\">\n          star\n        </span>\n        ".concat(item.Grade, "\n      ");
      phone.innerHTML = "\n        <span class=\"material-icons me-2\">\n          call\n        </span>\n        <a href=\"tel:+".concat(item.Phone, "\">").concat(item.Phone, "</a>\n      ");
    }
  });
}); // ------ 初始化

function init() {
  // 呼叫取得token函式
  // GetAuthorizationHeader();
  // 呼叫取得預設觀光景點資料
  getAllAttractionsList(); // 呼叫取得預設觀光美食資料

  getAllFoodList(); // 呼叫取得預設觀光旅宿資料

  getAllRoomsList();
}

init();
"use strict";

/* global axios */
// 請自行更換 client_id 與 client_secret
// GetApiResponse() 中 axios.get('URL') 的 URL 可替換成想要取得的網址。
// API 認證，取得 token
// eslint-disable-next-line no-unused-vars
function GetAuthorizationHeader() {
  var authUrl = 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token';
  var parameter = {
    grant_type: 'client_credentials',
    client_id: 'apog780212-3c7005de-321a-4555',
    client_secret: '4408c630-a7ff-4f57-8728-f4642ee5f932'
  };
  axios.post(authUrl, Qs.stringify(parameter)).then(function (res) {
    axios.defaults.headers.common.Authorization = "Bearer ".concat(res.data.access_token);
  })["catch"](function (err) {
    console.log(err);
  });
}
//# sourceMappingURL=all.js.map
