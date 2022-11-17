/* global swal */

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
