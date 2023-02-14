"use strict";

/* global axios */

/* global Swal */
// 存放活動頁篩選後觀光活動資料
var activityFilterData = []; // 宣告觀光活動景點列表

var activitiesList = document.querySelector('.activities-list'); // 宣告觀光活動關鍵字input輸入

var activitiesSearch = document.querySelector('.activities-search'); // 宣告觀光活動關鍵字搜尋按鈕

var activitiesSearchBtn = document.querySelector('.activities-search-btn'); // 宣告觀光活動縣市篩選下拉選單

var activitiesCitySelect = document.querySelector('.activities-city-select'); // 宣告觀光活動日期input按鈕

var eventTime = document.querySelector('.eventTime'); // 宣告觀光活動縣市搜尋按鈕

var activitiesSendSelect = document.querySelector('.activities-send-select'); // 關鍵字搜尋form

var activitiesKeywordForm = document.querySelector('.activities-keyword-form'); // 下拉搜尋form

var activitiesSelectForm = document.querySelector('.activities-select-form'); // 宣告觀光活動頁碼

var activitiesPages = document.querySelector('.activities-pages'); // 如果觀光活動日期input按鈕DOM存在頁面中時

if (eventTime) {
  // 日期套件宣告
  var elem = document.querySelector('input[name="datepicker"]');
  var datepicker = new Datepicker(elem, {
    autohide: true,
    language: 'zh-CN',
    format: 'yyyy-mm-dd',
    minDate: 'today'
  });
} //  渲染觀光活動頁面列表


function renderActivitiesList(data) {
  var str = ''; // console.log(data.length);

  if (data.length === 0) {
    str = "<li class=\"d-flex justify-content-center align-items-center vh-100\">\n    <span class=\"material-icons text-sm-m text-md-lg text-2xl me-4\">\n      error_outline\n    </span>\n    <p class=\"text-sm-m text-md-lg text-2xl text-center\">\u7121\u76F8\u95DC\u6D3B\u52D5\u8CC7\u6599\uFF0C\u8ACB\u91CD\u65B0\u641C\u5C0B\uFF01\n    </p>\n  </li>";
    activitiesList.innerHTML = str;
    record.innerHTML = '本次搜尋共 0 筆資料';
  } else {
    data.forEach(function (item) {
      // console.log(item);
      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      if (item.Address === undefined) {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#activitiesScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.ActivityID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.ActivityName, "</h4>\n            <div class=\"d-flex\">\n              <p class=\"text-s text-primary mt-2\">\u6D3B\u52D5\u671F\u9593\uFF1A").concat(new Date(item.StartTime).toLocaleDateString(), " - ").concat(new Date(item.EndTime).toLocaleDateString(), "</p>\n            </div>\n            <p class=\"text-s text-primary mt-2\">\u6D3B\u52D5\u5730\u5740\uFF1A\u672A\u63D0\u4F9B\u76F8\u95DC\u5730\u5740\u8CC7\u8A0A</p>\n          </div>\n        </div>\n      </li>");
      } else {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#activitiesScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.ActivityID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.ActivityName, "</h4>\n            <div class=\"d-flex\">\n              <p class=\"text-s text-primary mt-2\">\u6D3B\u52D5\u671F\u9593\uFF1A").concat(new Date(item.StartTime).toLocaleDateString(), " - ").concat(new Date(item.EndTime).toLocaleDateString(), "</p>\n            </div>\n            <p class=\"text-s text-primary mt-2\">\u6D3B\u52D5\u5730\u5740\uFF1A").concat(item.Address, "</p>\n          </div>\n        </div>\n      </li>");
      }
    }); // 如果活動中有 activitiesList 這個DOM時，則執行渲染活動

    if (activitiesList) {
      activitiesList.innerHTML = str;
      record.innerHTML = "\u672C\u6B21\u641C\u5C0B\u5171 ".concat(activityFilterData.length, " \u7B46\u8CC7\u6599"); // console.log(activityFilterData.length);
      // classification.classList.add('d-none');
    }
  }
} // 整體觀光美食分頁功能


function renderActivitiesPage(nowPage) {
  // 假設一頁 12 筆
  var dataPerPage = 12; // 一頁 12 筆資料 1~12 13~24 25~

  var totalPages = 0;

  if (activityFilterData.length == 0) {
    totalPages = Math.ceil(activityFilterData.length / dataPerPage); // 需要的頁數（無條件進位）
  }

  totalPages = Math.ceil(activityFilterData.length / dataPerPage); // 需要的頁數（無條件進位）

  var minData = dataPerPage * nowPage - dataPerPage + 1;
  var maxData = dataPerPage * nowPage; // console.log('minData', minData, 'maxData', maxData);
  // 取出當前頁數的景點資料

  var currentData = [];

  if (activityFilterData.length == 0) {
    activityFilterData.forEach(function (item, index) {
      if (index + 1 >= minData && index + 1 <= maxData) {
        currentData.push(item);
      }
    });
  } else {
    activityFilterData.forEach(function (item, index) {
      if (index + 1 >= minData && index + 1 <= maxData) {
        currentData.push(item);
      }
    });
  } // console.log(data);
  // 頁數資訊


  var pageInfo = {
    totalPages: totalPages,
    // 總頁數
    nowPage: nowPage,
    // 當前頁數
    isFirst: nowPage == 1,
    // 是否為第一頁
    isLast: nowPage == totalPages // 是否為最後一頁

  }; // 渲染觀光活動分頁按鈕

  function renderPageBtn(pageInfoData) {
    var str = '';
    var allTotalPages = pageInfo.totalPages; // 如果總頁數大於0，才渲染按鈕

    if (allTotalPages > 0) {
      // 是不是第一頁
      if (pageInfoData.isFirst) {
        str += "\n          <li class=\"page-item disabled\">\n            <a class=\"page-link\" href=\"#\">\n              &laquo;\n            </a>\n          </li>\n        ";
      } else {
        str += "\n          <li class=\"page-item\">\n            <a class=\"page-link\" href=\"#\" aria-label=\"Previous\" data-page=\"".concat(Number(pageInfoData.nowPage) - 1, "\">\n              &laquo;\n            </a>\n          </li>\n        ");
      }
    } // 第 2 ~


    for (var i = 1; i <= allTotalPages; i++) {
      if (Number(pageInfoData.nowPage) === i) {
        str += "\n          <li class=\"page-item active\" aria-current=\"page\">\n            <a class=\"page-link\" href=\"#\" data-page=\"".concat(i, "\">").concat(i, "</a>\n          </li>\n        ");
      } else {
        str += "\n          <li class=\"page-item\" aria-current=\"page\">\n            <a class=\"page-link\" href=\"#\" data-page=\"".concat(i, "\">").concat(i, "</a>\n          </li>\n        ");
      }
    } // 如果總頁數大於0，才渲染按鈕


    if (allTotalPages > 0) {
      // 是不是最後一頁
      if (pageInfoData.isLast) {
        str += "\n          <li class=\"page-item disabled\">\n            <a class=\"page-link\" href=\"#\">\n              &raquo;\n            </a>\n          </li>\n        ";
      } else {
        str += "\n          <li class=\"page-item\">\n            <a class=\"page-link\" href=\"#\" aria-label=\"Next\" data-page=\"".concat(Number(pageInfoData.nowPage) + 1, "\">\n              &raquo;\n            </a>\n          </li>\n        ");
      }
    }

    activitiesPages.innerHTML = str; // 切換頁面後，返回頁面最上層

    scrollTop();
  } // 呈現出該頁資料


  if (activitiesList) {
    renderActivitiesList(currentData); // console.log(currentData);
  } // 呈現分頁按鈕


  renderPageBtn(pageInfo);
}

function renderActivitiesFilter(data) {
  // 存放篩選後觀光活動資料
  var filterData = [];
  var selectTime = Date.parse(eventTime.value); // console.log(selectTime);

  data.forEach(function (item) {
    var startTime = Date.parse(item.StartTime);
    var endTime = Date.parse(item.EndTime);

    if (Number.isNaN(selectTime)) {
      filterData.push(item); // console.log(item);
    } else if (selectTime > startTime && selectTime < endTime) {
      filterData.push(item);
    }
  });
  activityFilterData = filterData; // console.log(activityFilterData);
  // 初始取得資料渲染第一頁

  renderActivitiesPage(1);
} // 如果觀光活動頁碼DOM存在頁面中時


if (activitiesPages) {
  // 點選按鈕切換觀光活動
  activitiesPages.addEventListener('click', function (e) {
    e.preventDefault(); // console.log('click!',e.target.nodeName);

    if (e.target.nodeName !== 'A') {
      return;
    }

    var clickPage = e.target.dataset.page; // console.log(clickPage);

    renderActivitiesPage(clickPage);
  }); // 活動關鍵字搜尋功能-監聽

  activitiesSearchBtn.addEventListener('click', function () {
    var keyword = activitiesSearch.value.replace(/\s*/g, '');

    if (keyword === '') {
      Swal.fire('出錯了', '請至少輸入 1 字 以上', 'error');
    } else {
      var url = "https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?$filter=contains(ActivityName,'".concat(keyword, "')&$format=JSON"); // console.log(keyword);

      axios.get(url).then(function (res) {
        activityData = res.data; // console.log(activityData);
        // activityFilterData = [];
        // 先執行activitiesSelectForm.reset()，才不會又把日期資料帶進去篩選。

        activitiesSelectForm.reset();
        renderActivitiesFilter(activityData);
      })["catch"](function (error) {
        console.log(error);
      });
    }
  }); // 活動縣市篩選&日期功能-監聽

  activitiesSendSelect.addEventListener('click', function () {
    // const selectTime = Date.parse(eventTime.value);
    // console.log(selectTime);
    var city = activitiesCitySelect.value; // console.log(city);

    var allUrl = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24format=JSON';
    var cityUrl = "https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity/".concat(city, "?%24format=JSON");

    if (city === 'All') {
      axios.get(allUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        activityData = res.data; // activityFilterData = [];
        // console.log(activityData);

        renderActivitiesFilter(activityData);
        activitiesKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    } else {
      axios.get(cityUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        activityData = res.data; // activityFilterData = [];
        // console.log(activityData);

        renderActivitiesFilter(activityData);
        activitiesKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    }
  });
}
"use strict";

/* global axios */

/* global Swal */

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
    // swal('出錯了！', '未輸入Email', 'error');
    Swal.fire('出錯了！', '未輸入Email', 'error');
  } else if (!reMail.test(value)) {
    // swal('出錯了！', 'Email格式錯誤', 'error');
    Swal.fire('出錯了！', 'Email格式錯誤', 'error');
  } else {
    // swal('訂閱成功！', '將定期發送相關觀光資訊', 'success');
    Swal.fire('訂閱成功！', '將定期發送相關觀光資訊', 'success');
    subscriptionInfoForm.reset();
  }
});
/* 頁面返回頂端按鈕JS */

var scrollTopBtn = document.querySelector('.scrollTopBtn');
scrollTopBtn.addEventListener('click', function (e) {
  e.preventDefault(); // console.log('點擊到了');

  window.scrollTo({
    top: 0,
    left: 0
  });
});

function scrollTop() {
  window.scrollTo({
    top: 0,
    left: 0
  });
} // API 的 filter 用法：例如: 沒有圖片時
// $filter=Picture/PictureUrl1 ne null
// 宣告List列表
// 景點列表


var tourList = document.querySelector('.tour-list'); // 美食列表

var foodList = document.querySelector('.food-list'); // 旅宿列表

var roomList = document.querySelector('.room-list'); // 活動列表

var activityList = document.querySelector('.activity-list'); // 搜尋筆數

var record = document.querySelector('.searchResult-text'); // 存放觀光景點資料

var tourData = []; // 存放觀光美食資料

var foodData = []; // 存放觀光旅宿資料

var roomData = []; // 存放觀光活動資料

var activityData = []; // 存放首頁篩選後觀光活動資料

var eventData = []; // Modal
// 景點 Modal

var ScenicSpotModal = document.querySelector('#tourScenicSpotModal'); // 美食 Modal

var FoodSpotModal = document.querySelector('#foodScenicSpotModal'); // 旅宿 Modal

var RoomSpotModal = document.querySelector('#roomScenicSpotModal'); // 首頁活動 Modal

var ActivitySpotModal = document.querySelector('#activityScenicSpotModal'); // 活動頁 Modal

var ActivitiesSpotModal = document.querySelector('#activitiesScenicSpotModal'); // 渲染預設景點列表

function renderTourList(data) {
  var str = ''; // console.log(data.length);

  if (data.length === 0) {
    str = "<li class=\"d-flex justify-content-center align-items-center\">\n    <span class=\"material-icons text-sm-m text-md-lg text-2xl me-4\">\n      error_outline\n    </span>\n    <p class=\"text-sm-m text-md-lg text-2xl text-center\">\u76EE\u524D\u6C92\u6709\u8CC7\u6599\n    </p>\n  </li>";
    tourList.innerHTML = str;
  } else {
    data.forEach(function (item) {
      // console.log(item);
      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      if (item.OpenTime === undefined) {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#tourScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.ScenicSpotID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.ScenicSpotName, "</h4>\n            <div class=\"d-flex\">\n              <p class=\"text-s text-primary mt-2\">\u958B\u653E\u6642\u9593\uFF1A\u672A\u63D0\u4F9B\u76F8\u95DC\u6642\u9593</p>\n            </div>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      } else {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#tourScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.ScenicSpotID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.ScenicSpotName, "</h4>\n            <p class=\"text-s text-primary mt-2\">\u958B\u653E\u6642\u9593\uFF1A").concat(item.OpenTime, "</p>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      }
    }); // 如果頁面中有 tourList 這個DOM時，則執行渲染頁面

    if (tourList) {
      tourList.innerHTML = str;
    }
  }
} // 取得預設景點資料


function getIndexTourList() {
  var url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/Taipei?$filter=contains(Class1,%27%E9%81%8A%E6%86%A9%E9%A1%9E%27)&$top=6&$skip=9&$format=JSON';
  axios.get(url, {
    headers: GetAuthorizationHeader()
  }).then(function (res) {
    tourData = res.data;
    renderTourList(tourData); // console.log(tourData);
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
  var address = ScenicSpotModal.querySelector('.address');
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

      if (item.Address === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.Address = '未提供';
      }

      address.innerHTML = "\n        <span class=\"material-icons-outlined text-sm-s text-m me-2\">\n          place\n        </span>\n        \u6240\u5728\u5730\u5740\uFF1A".concat(item.Address, "\n      ");
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
      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      if (item.OpenTime === undefined) {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#foodScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.RestaurantID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.RestaurantName, "</h4>\n            <div class=\"d-flex\">\n              <p class=\"text-s text-primary mt-2\">\u958B\u653E\u6642\u9593\uFF1A\u672A\u63D0\u4F9B\u76F8\u95DC\u6642\u9593</p>\n            </div>\n            <p class=\"text-s text-primary mt-2\">\u6240\u5728\u5730\u5740\uFF1A").concat(item.Address, "</p>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      } else {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#foodScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.RestaurantID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.RestaurantName, "</h4>\n            <p class=\"text-s text-primary mt-2\">\u958B\u653E\u6642\u9593\uFF1A").concat(item.OpenTime, "</p>\n            <p class=\"text-s text-primary mt-2\">\u6240\u5728\u5730\u5740\uFF1A").concat(item.Address, "</p>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      }
    }); // 如果頁面中有 foodList 這個DOM時，則執行渲染頁面

    if (foodList) {
      foodList.innerHTML = str;
    }
  }
} // 取得預設美食資料


function getIndexFoodList() {
  var url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24filter=Picture%2FPictureUrl1%20ne%20null&%24orderby=Description&%24top=6&%24skip=205&%24format=JSON';
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
      // OpenTime部份來源資料自帶有P標籤，使用.replace(/<(\/*)p[^>]*>/g, '')來消除多餘P標籤

      if (item.OpenTime === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.OpenTime = '未提供';
      }

      openTime.innerHTML = "\n        <span class=\"material-icons-outlined text-sm-s text-m me-2\">\n          schedule\n        </span>\n        \u958B\u653E\u6642\u9593\uFF1A".concat(item.OpenTime.replace(/<(\/*)p[^>]*>/g, ''), "\n      ");

      if (item.Address === undefined) {
        // eslint-disable-next-line no-param-reassign
        item.Address = '未提供';
      }

      address.innerHTML = "\n        <span class=\"material-icons-outlined text-sm-s text-m me-2\">\n          place\n        </span>\n        \u6240\u5728\u5730\u5740\uFF1A".concat(item.Address, "\n      ");
      phone.innerHTML = "\n        <span class=\"material-icons text-sm-s text-m me-2\">\n          call\n        </span>\n        <div class=\"d-flex\">\n          \u9023\u7D61\u96FB\u8A71\uFF1A\n          <a class=\"text-sm-s text-m\" href=\"tel:+".concat(item.Phone, "\">").concat(item.Phone, "</a>\n        </div>\n      ");
    }
  });
}); // 渲染預設旅宿列表

function renderRoomList(data) {
  var str = ''; // console.log(data.length);

  if (data.length === 0) {
    str = "<li class=\"d-flex justify-content-center align-items-center\">\n    <span class=\"material-icons text-sm-m text-md-lg text-2xl me-4\">\n      error_outline\n    </span>\n    <p class=\"text-sm-m text-md-lg text-2xl text-center\">\u76EE\u524D\u6C92\u6709\u8CC7\u6599\n    </p>\n  </li>";
    roomList.innerHTML = str;
  } else {
    data.forEach(function (item) {
      // console.log(item);
      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n      <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n        <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#roomScenicSpotModal\"\n          data-bs-whatever=\"".concat(item.HotelID, "\">\n          <img src=\"").concat(item.Picture.PictureUrl1, "\"\n            onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n            class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n        </a>\n        <div class=\"card-body\">\n          <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.HotelName, "</h4>\n          <p class=\"text-s text-primary mt-2\">\u6240\u5728\u5730\u5740\uFF1A").concat(item.Address, "</p>\n          <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n        </div>\n      </div>\n    </li>");
    }); // 如果頁面中有 roomList 這個DOM時，則執行渲染頁面

    if (roomList) {
      roomList.innerHTML = str;
    }
  }
} // 取得預設景點資料


function getIndexRoomList() {
  var url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?%24filter=contains%28Class%2C%27%E5%9C%8B%E9%9A%9B%E8%A7%80%E5%85%89%E6%97%85%E9%A4%A8%27%29&%24orderby=HotelID&%24top=6&%24format=JSON';
  axios.get(url, {
    headers: GetAuthorizationHeader()
  }).then(function (res) {
    roomData = res.data;
    renderRoomList(roomData); // console.log(roomData);
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
    str += "<li class=\"swiper-slide\">\n    <div class=\"container\">\n      <div class=\"card flex-lg-row-reverse border-0\">\n        <img src=\"".concat(item.Picture.PictureUrl1, "\"\n        onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n        class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n        <div class=\"card-body bg-tertiary text-start\">\n          <h4 class=\"card-title text-sm-m text-xl text-primary mb-6\">").concat(item.ActivityName, "</h4>\n          <div class=\"card-text\">\n            <div class=\"d-flex align-items-center mb-4\">\n              <span class=\"material-icons text-secondary me-4\">\n                calendar_month\n              </span>\n              <p class=\"text-sm-s text-m text-secondary\">\n              ").concat(new Date(item.StartTime).toLocaleDateString(), " - ").concat(new Date(item.EndTime).toLocaleDateString(), "\n              </p>\n            </div>\n            <div class=\"d-flex align-items-center mb-4\">\n              <span class=\"material-icons text-secondary me-4\">\n                place\n              </span>\n              <p class=\"text-sm-s text-m text-secondary\">\n              ").concat(item.Address, "\n              </p>\n            </div>\n          </div>\n          <a href=\"#\" class=\"btn btn-primary text-sm-s text-m text-light w-100 w-md-50\" data-bs-toggle=\"modal\" data-bs-target=\"#activityScenicSpotModal\"\n          data-bs-whatever=\"").concat(item.ActivityID, "\">\u4E86\u89E3\u66F4\u591A</a>\n        </div>\n      </div>\n    </div>\n  </li>");
  }); // 如果頁面中有 activityList 這個DOM時，則執行渲染頁面

  if (activityList) {
    activityList.innerHTML = str;
  }
} // 取得預設活動資料


function getIndexActivityList() {
  var url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Activity?%24filter=Picture%2FPictureUrl1%20ne%20null&%24format=JSON';
  axios.get(url, {
    headers: GetAuthorizationHeader()
  }).then(function (res) {
    activityData = res.data;
    renderActivityList(activityData); // console.log(activityData);
  })["catch"](function (error) {
    console.log(error);
  });
} // 監聽首頁點擊活動Modal(使用篩選後的活動資料)


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
    // console.log(item.ActivityID);
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
}); // 監聽活動頁點擊活動Modal

ActivitiesSpotModal.addEventListener('show.bs.modal', function (e) {
  // console.log(e.relatedTarget);
  var modalBtn = e.relatedTarget; // 被點擊的元素可作為事件的 relatedTarget 屬性

  var id = modalBtn.getAttribute('data-bs-whatever');
  var img = ActivitiesSpotModal.querySelector('.card-img-top');
  var title = ActivitiesSpotModal.querySelector('.card-title');
  var description = ActivitiesSpotModal.querySelector('.card-text');
  var activityTime = ActivitiesSpotModal.querySelector('.activityTime');
  var address = ActivitiesSpotModal.querySelector('.address');
  activityData.forEach(function (item) {
    // console.log(item.ActivityID);
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
  getIndexTourList(); // 呼叫取得預設觀光美食資料

  getIndexFoodList(); // 呼叫取得預設觀光旅宿資料

  getIndexRoomList(); // 呼叫取得預設觀光活動資料

  getIndexActivityList();
  AOS.init();
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

/* global axios */

/* global Swal */
// 宣告景點美食景點列表
var foodsList = document.querySelector('.foods-list'); // 宣告觀光美食縣市篩選下拉選單

var foodsCitySelect = document.querySelector('.foods-city-select'); // 宣告觀光美食分類篩選下拉選單

var foodsClassificationSelect = document.querySelector('.foods-classification-select'); // 宣告觀光美食縣市搜尋按鈕

var foodsSendSelect = document.querySelector('.foods-send-select'); // 宣告觀光美食關鍵字input輸入

var foodsSearch = document.querySelector('.foods-search'); // 宣告觀光美食關鍵字搜尋按鈕

var foodsSearchBtn = document.querySelector('.foods-search-btn'); // 關鍵字搜尋form

var foodsKeywordForm = document.querySelector('.foods-keyword-form'); // 下拉搜尋form

var foodsSelectForm = document.querySelector('.foods-select-form'); // 宣告觀光美食頁碼

var foodsPages = document.querySelector('.foods-pages'); // foodsSendSelect.addEventListener('click', (e) => {
//     console.log(foodsCitySelect.value, foodsClassificationSelect.value);
// });
// foodsSearchBtn.addEventListener('click', (e) => {
//     console.log(foodsSearch.value);
// });
//  渲染觀光美食頁面列表

function renderFoodsList(data) {
  var str = ''; // console.log(data.length);

  if (data.length === 0) {
    str = "<li class=\"d-flex justify-content-center align-items-center vh-100\">\n    <span class=\"material-icons text-sm-m text-md-lg text-2xl me-4\">\n      error_outline\n    </span>\n    <p class=\"text-sm-m text-md-lg text-2xl text-center\">\u7121\u76F8\u95DC\u7F8E\u98DF\u8CC7\u6599\uFF0C\u8ACB\u91CD\u65B0\u641C\u5C0B\uFF01\n    </p>\n  </li>";
    foodsList.innerHTML = str;
    record.innerHTML = '本次搜尋共 0 筆資料';
  } else {
    data.forEach(function (item) {
      // console.log(item);
      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      // OpenTime部份來源資料自帶有P標籤，使用.replace(/<(\/*)p[^>]*>/g, '')來消除多餘P標籤
      if (item.OpenTime === undefined) {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#foodScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.RestaurantID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.RestaurantName, "</h4>\n            <div class=\"d-flex\">\n              <p class=\"text-s text-primary mt-2\">\u958B\u653E\u6642\u9593\uFF1A\u672A\u63D0\u4F9B\u76F8\u95DC\u6642\u9593</p>\n            </div>\n            <p class=\"text-s text-primary mt-2\">\u6240\u5728\u5730\u5740\uFF1A").concat(item.Address, "</p>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      } else {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#foodScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.RestaurantID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.RestaurantName, "</h4>\n            <p class=\"text-s text-primary mt-2\">\u958B\u653E\u6642\u9593\uFF1A").concat(item.OpenTime.replace(/<(\/*)p[^>]*>/g, ''), "</p>\n            <p class=\"text-s text-primary mt-2\">\u6240\u5728\u5730\u5740\uFF1A").concat(item.Address, "</p>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      }
    }); // 如果美食中有 tourList 這個DOM時，則執行渲染美食

    if (foodsList) {
      foodsList.innerHTML = str;
      record.innerHTML = "\u672C\u6B21\u641C\u5C0B\u5171 ".concat(foodData.length, " \u7B46\u8CC7\u6599"); // classification.classList.add('d-none');
    }
  }
} // 整體觀光美食分頁功能


function renderFoodsPage(nowPage) {
  // 假設一頁 12 筆
  var dataPerPage = 12; // 一頁 12 筆資料 1~12 13~24 25~

  var totalPages = Math.ceil(foodData.length / dataPerPage); // 需要的頁數（無條件進位）

  var minData = dataPerPage * nowPage - dataPerPage + 1;
  var maxData = dataPerPage * nowPage; // console.log('minData', minData, 'maxData', maxData);
  // 取出當前頁數的景點資料

  var currentData = [];
  foodData.forEach(function (item, index) {
    if (index + 1 >= minData && index + 1 <= maxData) {
      currentData.push(item);
    }
  }); // console.log(data);
  // 頁數資訊

  var pageInfo = {
    totalPages: totalPages,
    // 總頁數
    nowPage: nowPage,
    // 當前頁數
    isFirst: nowPage == 1,
    // 是否為第一頁
    isLast: nowPage == totalPages // 是否為最後一頁

  }; // 渲染觀光美食分頁按鈕

  function renderPageBtn(pageInfoData) {
    var str = '';
    var allTotalPages = pageInfo.totalPages; // console.log(allTotalPages);
    // 如果總頁數大於0，才渲染按鈕

    if (allTotalPages > 0) {
      // 是不是第一頁
      if (pageInfoData.isFirst) {
        str += "\n          <li class=\"page-item disabled\">\n            <a class=\"page-link\" href=\"#\">\n              &laquo;\n            </a>\n          </li>\n        ";
      } else {
        str += "\n          <li class=\"page-item\">\n            <a class=\"page-link\" href=\"#\" aria-label=\"Previous\" data-page=\"".concat(Number(pageInfoData.nowPage) - 1, "\">\n              &laquo;\n            </a>\n          </li>\n        ");
      }
    } // 第 2 ~


    for (var i = 1; i <= allTotalPages; i++) {
      if (Number(pageInfoData.nowPage) === i) {
        str += "\n          <li class=\"page-item active\" aria-current=\"page\">\n            <a class=\"page-link\" href=\"#\" data-page=\"".concat(i, "\">").concat(i, "</a>\n          </li>\n        ");
      } else {
        str += "\n          <li class=\"page-item\" aria-current=\"page\">\n            <a class=\"page-link\" href=\"#\" data-page=\"".concat(i, "\">").concat(i, "</a>\n          </li>\n        ");
      }
    } // 如果總頁數大於0，才渲染按鈕


    if (allTotalPages > 0) {
      // 是不是最後一頁
      if (pageInfoData.isLast) {
        str += "\n          <li class=\"page-item disabled\">\n            <a class=\"page-link\" href=\"#\">\n              &raquo;\n            </a>\n          </li>\n        ";
      } else {
        str += "\n          <li class=\"page-item\">\n            <a class=\"page-link\" href=\"#\" aria-label=\"Next\" data-page=\"".concat(Number(pageInfoData.nowPage) + 1, "\">\n              &raquo;\n            </a>\n          </li>\n        ");
      }
    }

    foodsPages.innerHTML = str; // 切換頁面後，返回頁面最上層

    scrollTop();
  } // 呈現出該頁資料


  if (foodsList) {
    renderFoodsList(currentData);
  } // 呈現分頁按鈕


  renderPageBtn(pageInfo);
}

if (foodsPages) {
  // 點選按鈕切換觀光美食
  foodsPages.addEventListener('click', function (e) {
    e.preventDefault(); // console.log('click!',e.target.nodeName);

    if (e.target.nodeName !== 'A') {
      return;
    }

    var clickPage = e.target.dataset.page; // console.log(clickPage);

    renderFoodsPage(clickPage);
  }); // 觀光美食縣市篩選功能-監聽

  foodsSendSelect.addEventListener('click', function () {
    // console.log('點擊到了');
    var foodsCity = foodsCitySelect.value;
    var foodsClassifications = foodsClassificationSelect.value; // console.log(foodsClassifications);
    // google瀏覽器，"其他"兩個字有時候會變成"其��"，故增加此判斷

    if (foodsClassifications === '其��') {
      foodsClassifications = '其他';
    }

    var allUrl = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24format=JSON';
    var cityUrl = "https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant/".concat(foodsCity, "?%24format=JSON");
    var bothUrl = "https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant/".concat(foodsCity, "?$filter=contains(Class,'").concat(foodsClassifications, "')&$format=JSON");
    var classUrl = "https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?$filter=contains(Class,'".concat(foodsClassifications, "')&$format=JSON");

    if (foodsCity === 'Default' || foodsClassifications === 'Default') {
      Swal.fire('出錯了', '請選擇欲搜尋之縣市及分類資料', 'error');
    } else if (foodsCity === 'All' && foodsClassifications === 'All') {
      // 呼叫 API 服務，取得全部縣市、全部分類之觀光美食資料
      axios.get(allUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        foodData = res.data;
        renderFoodsPage(1);
        foodsKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    } else if (foodsCity !== 'All' && foodsClassifications !== 'All') {
      // 呼叫 API 服務，取得指定縣市、指定分類之觀光美食資料
      axios.get(bothUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        foodData = res.data;
        renderFoodsPage(1);
        foodsKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    } else if (foodsCity === 'All' && foodsClassifications !== 'All') {
      // 呼叫 API 服務，取得全部縣市、指定分類之觀光美食資料
      axios.get(classUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        foodData = res.data;
        renderFoodsPage(1);
        foodsKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    } else {
      // 呼叫 API 服務，取得指定縣市、未指定分類之觀光美食資料
      axios.get(cityUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        foodData = res.data;
        renderFoodsPage(1);
        foodsKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    }
  }); // 觀光美食關鍵字搜尋功能-監聽

  foodsSearchBtn.addEventListener('click', function () {
    var keyword = foodsSearch.value.replace(/\s*/g, '');

    if (keyword === '') {
      Swal.fire('出錯了', '請至少輸入 1 字 以上', 'error');
    } else {
      var url = "https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?$filter=contains(RestaurantName,'".concat(keyword, "')&$format=JSON"); // console.log(keyword);

      axios.get(url).then(function (res) {
        foodData = res.data; // console.log(thisData);
        // renderList(foodData);
        // 初始取得資料渲染第一頁

        renderFoodsPage(1);
        foodsSelectForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    }
  });
} // 取得分頁預設美食資料


function getDefaultFoodsList() {
  var url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Restaurant?%24filter=Picture%2FPictureUrl1%20ne%20null&%24top=120&%24format=JSON';
  axios.get(url, {
    headers: GetAuthorizationHeader()
  }).then(function (res) {
    foodData = res.data;
    renderFoodsPage(1);
  })["catch"](function (error) {
    console.log(error);
  });
}

function initFoods() {
  if (foodsList) {
    getDefaultFoodsList();
  }
}

initFoods();
"use strict";

/* global axios */

/* global Swal */
// 宣告旅宿頁面旅宿列表
var roomsList = document.querySelector('.rooms-list'); // 縣市篩選下拉選單

var roomsCitySelect = document.querySelector('.rooms-city-select'); // 分類篩選下拉選單

var roomsClassificationSelect = document.querySelector('.rooms-classification-select'); // 縣市搜尋按鈕

var roomsSendSelect = document.querySelector('.rooms-send-select'); // 關鍵字input輸入

var roomsSearch = document.querySelector('.rooms-search'); // 關鍵字搜尋按鈕

var roomsSearchBtn = document.querySelector('.rooms-search-btn'); // 關鍵字搜尋form

var roomsKeywordForm = document.querySelector('.rooms-keyword-form'); // 下拉搜尋form

var roomsSelectForm = document.querySelector('.rooms-select-form'); // 頁碼

var roomsPages = document.querySelector('.rooms-pages'); // toursSendSelect.addEventListener('click', (e) => {
//     console.log(toursCitySelect.value, toursClassificationSelect.value);
// });
// toursSearchBtn.addEventListener('click', (e) => {
//     console.log(toursSearch.value);
// });
//  渲染列表

function renderRoomsList(data) {
  var str = ''; // console.log(data.length);

  if (data.length === 0) {
    str = "<li class=\"d-flex justify-content-center align-items-center vh-100\">\n    <span class=\"material-icons text-sm-m text-md-lg text-2xl me-4\">\n      error_outline\n    </span>\n    <p class=\"text-sm-m text-md-lg text-2xl text-center\">\u7121\u76F8\u95DC\u65C5\u5BBF\u8CC7\u6599\uFF0C\u8ACB\u91CD\u65B0\u641C\u5C0B\uFF01\n    </p>\n  </li>";
    roomsList.innerHTML = str;
    record.innerHTML = '本次搜尋共 0 筆資料';
  } else {
    data.forEach(function (item) {
      // console.log(item);
      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#roomScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.HotelID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.HotelName, "</h4>\n            <p class=\"text-s text-primary mt-2\">\u6240\u5728\u5730\u5740\uFF1A").concat(item.Address, "</p>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
    }); // 如果頁面中有 tourList 這個DOM時，則執行渲染頁面

    if (roomsList) {
      roomsList.innerHTML = str;
      record.innerHTML = "\u672C\u6B21\u641C\u5C0B\u5171 ".concat(roomData.length, " \u7B46\u8CC7\u6599"); // classification.classList.add('d-none');
    }
  }
} // 整體分頁功能


function renderRoomsPage(nowPage) {
  // 假設一頁 12 筆
  var dataPerPage = 12; // 一頁 12 筆資料 1~12 13~24 25~

  var totalPages = Math.ceil(roomData.length / dataPerPage); // 需要的頁數（無條件進位）

  var minData = dataPerPage * nowPage - dataPerPage + 1;
  var maxData = dataPerPage * nowPage; // console.log('minData', minData, 'maxData', maxData);
  // 取出當前頁數的旅宿資料

  var currentData = [];
  roomData.forEach(function (item, index) {
    if (index + 1 >= minData && index + 1 <= maxData) {
      currentData.push(item);
    }
  }); // console.log(data);
  // 頁數資訊

  var pageInfo = {
    totalPages: totalPages,
    // 總頁數
    nowPage: nowPage,
    // 當前頁數
    isFirst: nowPage == 1,
    // 是否為第一頁
    isLast: nowPage == totalPages // 是否為最後一頁

  }; // 渲染分頁按鈕

  function renderPageBtn(pageInfoData) {
    var str = '';
    var allTotalPages = pageInfo.totalPages; // 如果總頁數大於0，才渲染按鈕

    if (allTotalPages > 0) {
      // 是不是第一頁
      if (pageInfoData.isFirst) {
        str += "\n          <li class=\"page-item disabled\">\n            <a class=\"page-link\" href=\"#\">\n              &laquo;\n            </a>\n          </li>\n        ";
      } else {
        str += "\n          <li class=\"page-item\">\n            <a class=\"page-link\" href=\"#\" aria-label=\"Previous\" data-page=\"".concat(Number(pageInfoData.nowPage) - 1, "\">\n              &laquo;\n            </a>\n          </li>\n        ");
      }
    } // 第 2 ~


    for (var i = 1; i <= allTotalPages; i++) {
      if (Number(pageInfoData.nowPage) === i) {
        str += "\n          <li class=\"page-item active\" aria-current=\"page\">\n            <a class=\"page-link\" href=\"#\" data-page=\"".concat(i, "\">").concat(i, "</a>\n          </li>\n        ");
      } else {
        str += "\n          <li class=\"page-item\" aria-current=\"page\">\n            <a class=\"page-link\" href=\"#\" data-page=\"".concat(i, "\">").concat(i, "</a>\n          </li>\n        ");
      }
    } // 如果總頁數大於0，才渲染按鈕


    if (allTotalPages > 0) {
      // 是不是最後一頁
      if (pageInfoData.isLast) {
        str += "\n          <li class=\"page-item disabled\">\n            <a class=\"page-link\" href=\"#\">\n              &raquo;\n            </a>\n          </li>\n        ";
      } else {
        str += "\n          <li class=\"page-item\">\n            <a class=\"page-link\" href=\"#\" aria-label=\"Next\" data-page=\"".concat(Number(pageInfoData.nowPage) + 1, "\">\n              &raquo;\n            </a>\n          </li>\n        ");
      }
    }

    roomsPages.innerHTML = str; // 切換頁面後，返回頁面最上層

    scrollTop();
  } // 呈現出該頁資料


  if (roomsList) {
    renderRoomsList(currentData);
  } // 呈現分頁按鈕


  renderPageBtn(pageInfo);
}

if (roomsPages) {
  // 點選按鈕切換頁面
  roomsPages.addEventListener('click', function (e) {
    e.preventDefault(); // console.log('click!',e.target.nodeName);

    if (e.target.nodeName !== 'A') {
      return;
    }

    var clickPage = e.target.dataset.page; // console.log(clickPage);

    renderRoomsPage(clickPage);
  }); // 縣市篩選功能-監聽

  roomsSendSelect.addEventListener('click', function () {
    // console.log('點擊到了');
    var roomsCity = roomsCitySelect.value;
    var roomsClassifications = roomsClassificationSelect.value; // console.log(roomsCity);
    // console.log(roomsClassifications);

    var allUrl = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?%24format=JSON';
    var cityUrl = "https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel/".concat(roomsCity, "?%24format=JSON");
    var bothUrl = "https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel/".concat(roomsCity, "?$filter=contains(Class,'").concat(roomsClassifications, "')&$format=JSON");
    var classUrl = "https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?$filter=contains(Class,'".concat(roomsClassifications, "')&$format=JSON");

    if (roomsCity === 'Default' || roomsClassifications === 'Default') {
      Swal.fire('出錯了', '請選擇欲搜尋之縣市及類型資料', 'error');
    } else if (roomsCity === 'All' && roomsClassifications === 'All') {
      // 呼叫 API 服務，取得全部縣市、全部分類之觀光旅宿資料
      axios.get(allUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        roomData = res.data;
        renderRoomsPage(1);
        roomsKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    } else if (roomsCity !== 'All' && roomsClassifications !== 'All') {
      // 呼叫 API 服務，取得指定縣市、指定分類之觀光旅宿資料
      axios.get(bothUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        roomData = res.data;
        renderRoomsPage(1);
        roomsKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    } else if (roomsCity === 'All' && roomsClassifications !== 'All') {
      // 呼叫 API 服務，取得全部縣市、指定分類之觀光旅宿資料
      axios.get(classUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        roomData = res.data;
        renderRoomsPage(1);
        roomsKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    } else {
      // 呼叫 API 服務，取得指定縣市、未指定分類之觀光旅宿資料
      axios.get(cityUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        roomData = res.data;
        renderRoomsPage(1);
        roomsKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    }
  }); // 關鍵字搜尋功能-監聽

  roomsSearchBtn.addEventListener('click', function () {
    var keyword = roomsSearch.value.replace(/\s*/g, '');

    if (keyword === '') {
      Swal.fire('出錯了', '請至少輸入 1 字 以上', 'error');
    } else {
      var url = "https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?$filter=contains(HotelName,'".concat(keyword, "')&$format=JSON"); // console.log(keyword);

      axios.get(url).then(function (res) {
        roomData = res.data; // console.log(thisData);
        // renderList(roomData);
        // 初始取得資料渲染第一頁

        renderRoomsPage(1);
        roomsSelectForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    }
  });
} // 取得分頁預設旅宿資料


function getDefaultRoomsList() {
  var url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/Hotel?%24filter=Picture%2FPictureUrl1%20ne%20null&%24top=120&%24format=JSON';
  axios.get(url, {
    headers: GetAuthorizationHeader()
  }).then(function (res) {
    roomData = res.data;
    renderRoomsPage(1);
  })["catch"](function (error) {
    console.log(error);
  });
}

function initRooms() {
  if (roomsList) {
    getDefaultRoomsList();
  }
}

initRooms();
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
"use strict";

/* global axios */

/* global Swal */
// 宣告景點頁面景點列表
var toursList = document.querySelector('.tours-list'); // 縣市篩選下拉選單

var toursCitySelect = document.querySelector('.tours-city-select'); // 分類篩選下拉選單

var toursClassificationSelect = document.querySelector('.tours-classification-select'); // 縣市搜尋按鈕

var toursSendSelect = document.querySelector('.tours-send-select'); // 關鍵字input輸入

var toursSearch = document.querySelector('.tours-search'); // 關鍵字搜尋按鈕

var toursSearchBtn = document.querySelector('.tours-search-btn'); // 關鍵字搜尋form

var toursKeywordForm = document.querySelector('.tours-keyword-form'); // 下拉搜尋form

var toursSelectForm = document.querySelector('.tours-select-form'); // 頁碼

var toursPages = document.querySelector('.tours-pages'); // toursSendSelect.addEventListener('click', (e) => {
//     console.log(toursCitySelect.value, toursClassificationSelect.value);
// });
// toursSearchBtn.addEventListener('click', (e) => {
//     console.log(toursSearch.value);
// });
//  渲染列表

function renderToursList(data) {
  var str = ''; // console.log(data.length);

  if (data.length === 0) {
    str = "<li class=\"d-flex justify-content-center align-items-center vh-100\">\n    <span class=\"material-icons text-sm-m text-md-lg text-2xl me-4\">\n      error_outline\n    </span>\n    <p class=\"text-sm-m text-md-lg text-2xl text-center\">\u7121\u76F8\u95DC\u666F\u9EDE\u8CC7\u6599\uFF0C\u8ACB\u91CD\u65B0\u641C\u5C0B\uFF01\n    </p>\n  </li>";
    toursList.innerHTML = str;
    record.innerHTML = '本次顯示共 0 筆資料';
  } else {
    data.forEach(function (item) {
      // console.log(item);
      // 若API有提供圖片網址，但圖片網址失效時，使用 onerror="this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg'" 替代
      // if (JSON.stringify(item.Picture) === '{}') {
      //   return;
      // }
      // 如果資料中沒有 OpenTime，則開放時間顯示未提供相關時間
      if (item.OpenTime === undefined) {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#tourScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.ScenicSpotID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.ScenicSpotName, "</h4>\n            <div class=\"d-flex\">\n              <p class=\"text-s text-primary mt-2\">\u958B\u653E\u6642\u9593\uFF1A\u672A\u63D0\u4F9B\u76F8\u95DC\u6642\u9593</p>\n            </div>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      } else {
        str += "<li class=\"col-md-6 col-lg-4 d-flex flex-column\">\n        <div class=\"card my-2 my-md-4 my-lg-6 card-shadow-hover h-100\">\n          <a href=\"\" class=\"stretched-link\" data-bs-toggle=\"modal\" data-bs-target=\"#tourScenicSpotModal\"\n            data-bs-whatever=\"".concat(item.ScenicSpotID, "\">\n            <img src=\"").concat(item.Picture.PictureUrl1, "\"\n              onerror=\"this.src='https://live.staticflickr.com/65535/52604011765_6050fc5f05_o.jpg';this.onerror = null\"\n              class=\"card-img-top img-fluid\" alt=\".").concat(item.Picture.PictureDescription1, "\">\n          </a>\n          <div class=\"card-body\">\n            <h4 class=\"text-sm-m text-lg text-warning\">").concat(item.ScenicSpotName, "</h4>\n            <p class=\"text-s text-primary mt-2\">\u958B\u653E\u6642\u9593\uFF1A").concat(item.OpenTime, "</p>\n            <p class=\"text-s text-primary mt-2\">\u9023\u7D61\u96FB\u8A71\uFF1A").concat(item.Phone, "</p>\n          </div>\n        </div>\n      </li>");
      }
    }); // 如果頁面中有 tourList 這個DOM時，則執行渲染頁面

    if (toursList) {
      toursList.innerHTML = str;
      record.innerHTML = "\u672C\u6B21\u986F\u793A\u5171 ".concat(tourData.length, " \u7B46\u8CC7\u6599"); // classification.classList.add('d-none');
    }
  }
} // 整體分頁功能


function renderToursPage(nowPage) {
  // 假設一頁 12 筆
  var dataPerPage = 12; // 一頁 12 筆資料 1~12 13~24 25~

  var totalPages = Math.ceil(tourData.length / dataPerPage); // 需要的頁數（無條件進位）

  var minData = dataPerPage * nowPage - dataPerPage + 1;
  var maxData = dataPerPage * nowPage; // console.log('minData', minData, 'maxData', maxData);
  // 取出當前頁數的景點資料

  var currentData = [];
  tourData.forEach(function (item, index) {
    if (index + 1 >= minData && index + 1 <= maxData) {
      currentData.push(item);
    }
  }); // console.log(data);
  // 頁數資訊

  var pageInfo = {
    totalPages: totalPages,
    // 總頁數
    nowPage: nowPage,
    // 當前頁數
    isFirst: nowPage == 1,
    // 是否為第一頁
    isLast: nowPage == totalPages // 是否為最後一頁

  }; // 渲染分頁按鈕

  function renderPageBtn(pageInfoData) {
    var str = '';
    var allTotalPages = pageInfo.totalPages; // 如果總頁數大於0，才渲染按鈕

    if (allTotalPages > 0) {
      // 是不是第一頁
      if (pageInfoData.isFirst) {
        str += "\n          <li class=\"page-item disabled\">\n            <a class=\"page-link\" href=\"#\">\n              &laquo;\n            </a>\n          </li>\n        ";
      } else {
        str += "\n          <li class=\"page-item\">\n            <a class=\"page-link\" href=\"#\" aria-label=\"Previous\" data-page=\"".concat(Number(pageInfoData.nowPage) - 1, "\">\n              &laquo;\n            </a>\n          </li>\n        ");
      }
    } // 第 2 ~


    for (var i = 1; i <= allTotalPages; i++) {
      if (Number(pageInfoData.nowPage) === i) {
        str += "\n          <li class=\"page-item active\" aria-current=\"page\">\n            <a class=\"page-link\" href=\"#\" data-page=\"".concat(i, "\">").concat(i, "</a>\n          </li>\n        ");
      } else {
        str += "\n          <li class=\"page-item\" aria-current=\"page\">\n            <a class=\"page-link\" href=\"#\" data-page=\"".concat(i, "\">").concat(i, "</a>\n          </li>\n        ");
      }
    } // 如果總頁數大於0，才渲染按鈕


    if (allTotalPages > 0) {
      // 是不是最後一頁
      if (pageInfoData.isLast) {
        str += "\n          <li class=\"page-item disabled\">\n            <a class=\"page-link\" href=\"#\">\n              &raquo;\n            </a>\n          </li>\n        ";
      } else {
        str += "\n          <li class=\"page-item\">\n            <a class=\"page-link\" href=\"#\" aria-label=\"Next\" data-page=\"".concat(Number(pageInfoData.nowPage) + 1, "\">\n              &raquo;\n            </a>\n          </li>\n        ");
      }
    }

    toursPages.innerHTML = str; // 切換頁面後，返回頁面最上層

    scrollTop();
  } // 呈現出該頁資料


  if (toursList) {
    renderToursList(currentData);
  } // 呈現分頁按鈕


  renderPageBtn(pageInfo);
}

if (toursPages) {
  // 點選按鈕切換頁面
  toursPages.addEventListener('click', function (e) {
    e.preventDefault(); // console.log('click!',e.target.nodeName);

    if (e.target.nodeName !== 'A') {
      return;
    }

    var clickPage = e.target.dataset.page; // console.log(clickPage);

    renderToursPage(clickPage);
  }); // 縣市篩選功能-監聽

  toursSendSelect.addEventListener('click', function () {
    // console.log('點擊到了');
    var toursCity = toursCitySelect.value;
    var toursClassifications = toursClassificationSelect.value; // console.log(city);
    // console.log(classification);

    var allUrl = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24format=JSON';
    var cityUrl = "https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/".concat(toursCity, "?%24format=JSON");
    var bothUrl = "https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot/".concat(toursCity, "?$filter=contains(Class1,'").concat(toursClassifications, "')&$format=JSON");
    var classUrl = "https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?$filter=contains(Class1,'".concat(toursClassifications, "')&$format=JSON");

    if (toursCity === 'Default' || toursClassifications === 'Default') {
      Swal.fire('出錯了', '請選擇欲搜尋之縣市及主題資料', 'error');
    } else if (toursCity === 'All' && toursClassifications === 'All') {
      // 呼叫 API 服務，取得全部縣市、全部分類之觀光景點資料
      axios.get(allUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        tourData = res.data;
        renderToursPage(1);
        toursKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    } else if (toursCity !== 'All' && toursClassifications !== 'All') {
      // 呼叫 API 服務，取得指定縣市、指定分類之觀光景點資料
      axios.get(bothUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        tourData = res.data;
        renderToursPage(1);
        toursKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    } else if (toursCity === 'All' && toursClassifications !== 'All') {
      // 呼叫 API 服務，取得全部縣市、指定分類之觀光景點資料
      axios.get(classUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        tourData = res.data;
        renderToursPage(1);
        toursKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    } else {
      // 呼叫 API 服務，取得指定縣市、未指定分類之觀光景點資料
      axios.get(cityUrl, {
        headers: GetAuthorizationHeader()
      }).then(function (res) {
        // console.log(res.data);
        tourData = res.data;
        renderToursPage(1);
        toursKeywordForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    }
  }); // 關鍵字搜尋功能-監聽

  toursSearchBtn.addEventListener('click', function () {
    var keyword = toursSearch.value.replace(/\s*/g, '');

    if (keyword === '') {
      Swal.fire('出錯了', '請至少輸入 1 字 以上', 'error');
    } else {
      var url = "https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?$filter=contains(ScenicSpotName,'".concat(keyword, "')&$format=JSON"); // console.log(keyword);

      axios.get(url).then(function (res) {
        tourData = res.data; // console.log(thisData);
        // renderList(tourData);
        // 初始取得資料渲染第一頁

        renderToursPage(1);
        toursSelectForm.reset();
      })["catch"](function (error) {
        console.log(error);
      });
    }
  });
} // 取得分頁預設景點資料


function getDefaultToursList() {
  var url = 'https://tdx.transportdata.tw/api/basic/v2/Tourism/ScenicSpot?%24filter=Picture%2FPictureUrl1%20ne%20null&%24top=120&%24format=JSON';
  axios.get(url, {
    headers: GetAuthorizationHeader()
  }).then(function (res) {
    tourData = res.data;
    renderToursPage(1);
  })["catch"](function (error) {
    console.log(error);
  });
}

function initTours() {
  if (toursList) {
    getDefaultToursList();
  }
}

initTours();
//# sourceMappingURL=all.js.map
