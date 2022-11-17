"use strict";

/* global swal */
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
});
//# sourceMappingURL=all.js.map
