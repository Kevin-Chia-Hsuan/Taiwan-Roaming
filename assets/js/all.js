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
// 景點列表

var tourList = document.querySelector('.tour-list'); // 美食列表

var foodList = document.querySelector('.food-list'); // 旅宿列表

var roomList = document.querySelector('.room-list'); // 活動列表

var activityList = document.querySelector('.activity-list'); // 存放觀光景點資料

var tourData = []; // 存放觀光美食資料

var foodData = []; // 存放觀光旅宿資料

var roomData = []; // 存放觀光活動資料

var activityData = []; // 存放篩選後觀光活動資料

var eventData = []; // Modal
// 景點 Modal

var ScenicSpotModal = document.querySelector('#tourScenicSpotModal'); // 美食 Modal

var FoodSpotModal = document.querySelector('#foodScenicSpotModal'); // 旅宿 Modal

var RoomSpotModal = document.querySelector('#roomScenicSpotModal'); // 活動 Modal

var ActivitySpotModal = document.querySelector('#activityScenicSpotModal'); // 渲染預設景點列表

function rendertourList(data) {
  var str = ''; // console.log(data.length);

  if (data.length === 0) {
    str = "<li class=\"d-flex justify-content-center align-items-center\">\n    <span class=\"material-icons text-sm-m text-md-lg text-2xl me-4\">\n      error_outline\n    </span>\n    <p class=\"text-sm-m text-md-lg text-2xl text-center\">\u76EE\u524D\u6C92\u6709\u8CC7\u6599\n    </p>\n  </li>";
    tourList.innerHTML = str;
  } else {
    data.forEach(function (item) {
      // console.log(item);
      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://i.ibb.co/5WGrGkK/404.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      if (item.OpenTime === undefined) {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#tourScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.ScenicSpotID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.ScenicSpotName, "</h4>\n            <div class=\"d-flex\">\n              <p class=\"text-s text-primary mt-2\">\u958B\u653E\u6642\u9593\uFF1A\u672A\u63D0\u4F9B\u76F8\u95DC\u6642\u9593</p>\n            </div>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      } else {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#tourScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.ScenicSpotID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.ScenicSpotName, "</h4>\n            <p class=\"text-s text-primary mt-2\">\u958B\u653E\u6642\u9593\uFF1A").concat(item.OpenTime, "</p>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      }
    }); // 如果頁面中有 tourList 這個DOM時，則執行渲染頁面

    if (tourList) {
      tourList.innerHTML = str;
    }
  }
} // 取得預設景點資料


function getAlltourList() {
  var url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/Taipei?$filter=contains(Class1,%27%E9%81%8A%E6%86%A9%E9%A1%9E%27)&$top=6&$skip=9&$format=JSON';
  axios.get(url, {
    headers: GetAuthorizationHeader()
  }).then(function (res) {
    tourData = res.data;
    rendertourList(tourData); // console.log(tourData);
  })["catch"](function (error) {
    console.log(error);
  });
} // 監聽點擊景點Modal


ScenicSpotModal.addEventListener('show.bs.modal', function (e) {
  // console.log(e.relatedTarget);
  var modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性

  var id = modalBtn.getAttribute('data-bs-whatever');
  var img = ScenicSpotModal.querySelector('.card-img-top');
  var title = ScenicSpotModal.querySelector('.card-title');
  var description = ScenicSpotModal.querySelector('.card-text');
  var openTime = ScenicSpotModal.querySelector('.openTime');
  var phone = ScenicSpotModal.querySelector('.phone');
  tourData.forEach(function (item) {
    // console.log(item);
    if (item.ScenicSpotID === id) {
      img.setAttribute('src', "".concat(item.Picture.PictureUrl1));
      title.textContent = "".concat(item.ScenicSpotName);
      description.textContent = "\u666F\u9EDE\u4ECB\u7D39\uFF1A".concat(item.DescriptionDetail);

      if (item.OpenTime === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.OpenTime = '未提供';
      }

      openTime.innerHTML = "\n        <span class=\"material-icons-outlined text-sm-s text-m me-2\">\n          schedule\n        </span>\n        \u958B\u653E\u6642\u9593\uFF1A".concat(item.OpenTime, "\n      ");
      phone.innerHTML = "\n        <span class=\"material-icons text-sm-s text-m me-2\">\n          call\n        </span>\n        <div class=\"d-flex\">\n          \u9023\u7D61\u96FB\u8A71\uFF1A\n          <a class=\"text-sm-s text-m\" href=\"tel:+".concat(item.Phone, "\">").concat(item.Phone, "</a>\n        </div>\n      ");
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
      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      if (item.OpenTime === undefined) {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#foodScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.RestaurantID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.RestaurantName, "</h4>\n            <div class=\"d-flex\">\n              <p class=\"text-s text-primary mt-2\">\u958B\u653E\u6642\u9593\uFF1A\u672A\u63D0\u4F9B\u76F8\u95DC\u6642\u9593</p>\n            </div>\n            <p class=\"text-s text-primary mt-2\">\u6240\u5728\u5730\u5740\uFF1A").concat(item.Address, "</p>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      } else {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#foodScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.RestaurantID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.RestaurantName, "</h4>\n            <p class=\"text-s text-primary mt-2\">\u958B\u653E\u6642\u9593\uFF1A").concat(item.OpenTime, "</p>\n            <p class=\"text-s text-primary mt-2\">\u6240\u5728\u5730\u5740\uFF1A").concat(item.Address, "</p>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      }
    }); // 如果頁面中有 foodList 這個DOM時，則執行渲染頁面

    if (foodList) {
      foodList.innerHTML = str;
    }
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
} // 監聽點擊美食Modal


FoodSpotModal.addEventListener('show.bs.modal', function (e) {
  // console.log(e.relatedTarget);
  var modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性

  var id = modalBtn.getAttribute('data-bs-whatever');
  var img = FoodSpotModal.querySelector('.card-img-top');
  var title = FoodSpotModal.querySelector('.card-title');
  var description = FoodSpotModal.querySelector('.card-text');
  var openTime = FoodSpotModal.querySelector('.openTime');
  var address = FoodSpotModal.querySelector('.address');
  var phone = FoodSpotModal.querySelector('.phone');
  foodData.forEach(function (item) {
    // console.log(item.RestaurantID);
    if (item.RestaurantID === id) {
      img.setAttribute('src', "".concat(item.Picture.PictureUrl1));
      title.textContent = "".concat(item.RestaurantName);
      description.textContent = "\u7F8E\u98DF\u4ECB\u7D39\uFF1A".concat(item.Description); // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間

      if (item.OpenTime === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.OpenTime = '未提供';
      }

      openTime.innerHTML = "\n        <span class=\"material-icons-outlined text-sm-s text-m me-2\">\n          schedule\n        </span>\n        \u958B\u653E\u6642\u9593\uFF1A".concat(item.OpenTime, "\n      ");

      if (item.Address === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.Address = '未提供';
      }

      address.innerHTML = "\n        <span class=\"material-icons-outlined text-sm-s text-m me-2\">\n          place\n        </span>\n        \u6240\u5728\u5730\u5740\uFF1A".concat(item.Address, "\n      ");
      phone.innerHTML = "\n        <span class=\"material-icons text-sm-s text-m me-2\">\n          call\n        </span>\n        <div class=\"d-flex\">\n          \u9023\u7D61\u96FB\u8A71\uFF1A\n          <a class=\"text-sm-s text-m\" href=\"tel:+".concat(item.Phone, "\">").concat(item.Phone, "</a>\n        </div>\n      ");
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
      str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n      <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n        <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#roomScenicSpotModal\"\n          data-bs-whatever=\"".concat(item.HotelID, "\">\n          <img src=\"").concat(item.Picture.PictureUrl1, "\"\n            onerror=\"this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null\"\n            class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n        </a>\n        <div class=\"card-body\">\n          <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.HotelName, "</h4>\n          <p class=\"text-s text-primary mt-2\">\u6240\u5728\u5730\u5740\uFF1A").concat(item.Address, "</p>\n          <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n        </div>\n      </div>\n    </li>");
    }); // 如果頁面中有 roomList 這個DOM時，則執行渲染頁面

    if (roomList) {
      roomList.innerHTML = str;
    }
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
} // 監聽點擊旅宿Modal


RoomSpotModal.addEventListener('show.bs.modal', function (e) {
  // console.log(e.relatedTarget);
  var modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性

  var id = modalBtn.getAttribute('data-bs-whatever');
  var img = RoomSpotModal.querySelector('.card-img-top');
  var title = RoomSpotModal.querySelector('.card-title');
  var description = RoomSpotModal.querySelector('.card-text');
  var grade = RoomSpotModal.querySelector('.grade');
  var address = RoomSpotModal.querySelector('.address');
  var phone = RoomSpotModal.querySelector('.phone');
  roomData.forEach(function (item) {
    // console.log(item.HotelID);
    if (item.HotelID === id) {
      img.setAttribute('src', "".concat(item.Picture.PictureUrl1));
      title.textContent = "".concat(item.HotelName);
      description.textContent = "\u65C5\u5BBF\u4ECB\u7D39\uFF1A".concat(item.Description); // 如果資料中沒有 Grade，則顯示未提供星級資料

      if (item.Grade === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.Grade = '未提供星級資料';
      }

      if (item.Address === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.Address = '未提供';
      }

      address.innerHTML = "\n        <span class=\"material-icons-outlined text-sm-s text-m me-2\">\n          place\n        </span>\n        \u6240\u5728\u5730\u5740\uFF1A".concat(item.Address, "\n      ");
      grade.innerHTML = "\n        <span class=\"material-icons-outlined text-sm-s text-m me-2\">\n          star\n        </span>\n        \u661F\u7D1A\uFF1A".concat(item.Grade, "\n      ");
      phone.innerHTML = "\n        <span class=\"material-icons text-sm-s text-m me-2\">\n          call\n        </span>\n        <div class=\"d-flex\">\n          \u9023\u7D61\u96FB\u8A71\uFF1A\n          <a class=\"text-sm-s text-m\" href=\"tel:+".concat(item.Phone, "\">").concat(item.Phone, "</a>\n        </div>\n      ");
    }
  });
}); // 渲染預設活動列表

function renderActivityList(data) {
  // console.log(data);
  var str = ''; // 取得目前日期時間

  var selectTime = +new Date();
  data.forEach(function (item) {
    // 宣告 存放結束日期時間 變數，轉換成時間戳格式
    var endTime = Date.parse(item.EndTime); // 如果活動日期時間時間 大於等於 目前日期時間

    if (endTime >= selectTime) {
      // 將篩選後資料塞入 eventData 陣列中
      eventData.push(item);
    }
  }); // console.log(eventData);
  // 取得前 9 筆資料並渲染

  var eventDataSlice = []; // 如果 eventData 資料 大於等於 9 筆，則抓出前 9 筆資料

  if (eventData.length >= 9) {
    // slice() 方法會回傳一個新陣列物件，為原陣列選擇之 begin 至 end（不含 end）部分的淺拷貝（shallow copy）。而原本的陣列將不會被修改。
    eventDataSlice = eventData.slice(0, 9);
  } else {
    // 如果 eventData 資料 小於等於 9 筆，則抓出該些資料
    eventDataSlice = eventData;
  } // console.log(eventDataSlice);


  eventDataSlice.forEach(function (item) {
    str += "<li class=\"swiper-slide\">\n    <div class=\"container\">\n      <div class=\"card flex-lg-row-reverse border-0\">\n        <img src=\"".concat(item.Picture.PictureUrl1, "\"\n        onerror=\"this.src='https://i.ibb.co/hR0Sb7y/404.jpg';this.onerror = null\"\n        class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n        <div class=\"card-body bg-tertiary text-start\">\n          <h4 class=\"card-title text-sm-m text-xl text-primary mb-6\">").concat(item.ActivityName, "</h4>\n          <div class=\"card-text\">\n            <div class=\"d-flex align-items-center mb-4\">\n              <span class=\"material-icons text-secondary me-4\">\n                calendar_month\n              </span>\n              <p class=\"text-sm-s text-m text-secondary\">\n              ").concat(new Date(item.StartTime).toLocaleDateString(), " - ").concat(new Date(item.EndTime).toLocaleDateString(), "\n              </p>\n            </div>\n            <div class=\"d-flex align-items-center mb-4\">\n              <span class=\"material-icons text-secondary me-4\">\n                place\n              </span>\n              <p class=\"text-sm-s text-m text-secondary\">\n              ").concat(item.Address, "\n              </p>\n            </div>\n          </div>\n          <a href=\"#\" class=\"btn btn-primary text-sm-s text-m text-light w-100 w-md-50\" data-bs-toggle=\"modal\" data-bs-target=\"#activityScenicSpotModal\"\n          data-bs-whatever=\"").concat(item.ActivityID, "\">\u4E86\u89E3\u66F4\u591A</a>\n        </div>\n      </div>\n    </div>\n  </li>");
  }); // 如果頁面中有 activityList 這個DOM時，則執行渲染頁面

  if (activityList) {
    activityList.innerHTML = str;
  }
} // 取得預設活動資料


function getAllActivityList() {
  var url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON';
  axios.get(url, {
    headers: GetAuthorizationHeader()
  }).then(function (res) {
    activityData = res.data;
    renderActivityList(activityData); // console.log(activityData);
  })["catch"](function (error) {
    console.log(error);
  });
} // 監聽點擊活動Modal


ActivitySpotModal.addEventListener('show.bs.modal', function (e) {
  // console.log(e.relatedTarget);
  var modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性

  var id = modalBtn.getAttribute('data-bs-whatever');
  var img = ActivitySpotModal.querySelector('.card-img-top');
  var title = ActivitySpotModal.querySelector('.card-title');
  var description = ActivitySpotModal.querySelector('.card-text');
  var activityTime = ActivitySpotModal.querySelector('.activityTime');
  var address = ActivitySpotModal.querySelector('.address');
  eventData.forEach(function (item) {
    // console.log(item.HotelID);
    if (item.ActivityID === id) {
      img.setAttribute('src', "".concat(item.Picture.PictureUrl1));
      title.textContent = "".concat(item.ActivityName);
      description.textContent = "\u6D3B\u52D5\u4ECB\u7D39\uFF1A".concat(item.Description);
      activityTime.innerHTML = "\n      <span class=\"material-icons-outlined text-sm-s text-m me-2\">\n        schedule\n      </span>\n      \u6D3B\u52D5\u6642\u9593\uFF1A".concat(new Date(item.StartTime).toLocaleDateString(), " - ").concat(new Date(item.EndTime).toLocaleDateString(), "\n      ");

      if (item.Address === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.Address = '未提供';
      }

      address.innerHTML = "\n        <span class=\"material-icons-outlined text-sm-s text-m me-2\">\n          place\n        </span>\n        \u6D3B\u52D5\u5730\u5740\uFF1A".concat(item.Address, "\n      ");
    }
  });
}); // ------ 初始化

function init() {
  // 呼叫取得token函式
  // GetAuthorizationHeader();
  // 呼叫取得預設觀光景點資料
  getAlltourList(); // 呼叫取得預設觀光美食資料

  getAllFoodList(); // 呼叫取得預設觀光旅宿資料

  getAllRoomsList(); // 呼叫取得預設觀光活動資料

  getAllActivityList();
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
"use strict";

/* 自訂初始化的 Swiper 套件的函式 */
function initSwiper() {
  /*
  id="comment-swiper" 區塊是我想要使用 swiper 套件的範圍
  要抓取 id "#comment-swiper"
  可以參考 CodePen 來看這個 id 是對應到哪個區塊
  */
  var swiper = new Swiper('#comment-swiper', {
    /*  預設要顯示幾個卡片 */
    slidesPerView: 1,

    /* 切換按鈕 */
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },

    /* 分頁設定 */
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },

    /* 自動播放 */
    autoplay: {
      delay: 5000
    }
  });
}
/* 觸發自己定義的函式 */


initSwiper();
//# sourceMappingURL=all.js.map
