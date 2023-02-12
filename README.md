# Gulp - 加入 Bootstrap 版本

> 使用該專案 Gulp 時，就可以不用使用其他編譯工具編譯 SCSS 或是 JavaScript 囉。

## 指令列表

- `gulp` - 執行開發模式(會開啟模擬瀏覽器並監聽相關檔案)
  - 若沒有自動開啟瀏覽器則可手動在瀏覽器上輸入 `http://localhost:8080/` 即可。
  - 假使監聽功能無效的話，可以檢查一下是否修改到資料夾的名稱等。
- `gulp build` - 執行編譯模式(不會開啟瀏覽器)
- `gulp clean` - 清除 dist 資料夾
- `gulp deploy` - 將 dist 資料夾部署至 GitHub Pages
  - 若無法部署到 GitHub Pages 的話，可以確定一下是否已經初始化專案等。

> 請務必確保已經在本機上輸入過 `npm install -g gulp`，否則電腦會不認識 `gulp` 指令哦。

## 作品說明

網站設計者：張嘉軒

漫遊台灣·Tai Roaming 網站為參與 THE F2E精神時光屋活動主題「台灣旅遊景點導覽」之非商用設計面試作品。

「觀光資訊」之部份資料，取自「中華民國交通部TDX」，其他網站相關之文字、圖片均屬來源作者所有。

## 使用說明

該分支專案預設載入 Bootstrap5 與 jQuery 等。

若有需要調整相關路徑參數可在 `envOptions.js` 中調整，但建議不要隨意調整導致 Gulp 無法正常運行。

假使對於 Gulp 不熟悉會建議不要任意調整 `gulpfile.js` 底下的資料任一檔案，避免出現無法正常運作之問題。

## 資料夾結構

- App # 原始碼
  - assets # 靜態資源放置處
    - images # 圖片放置處
    - js # JavaScript 放置處
    - style # 樣式放置處
  - index.html # 首頁 HTML
  - layout.ejs # Layout ejs
- gulpfile.js # Gulp 原始碼
  - envOptions.js # Gulp 路徑變數
  - index.js # Gulp 核心原始碼

### 注意事項

`assets` 底下的資料夾名稱建議不要任意修改，例如：`stlye` 改成 `styles` 又或者是 `scss` 等非原始資料夾名稱。

最主要原因是 Gulp 預設是監聽 `style`、`js`、 `images` 這幾個資料夾路徑底下的檔案，因此若任意修改名稱將可能導致 Gulp 的監聽功能失效或其他不可預期之問題發生。

若本身已經對於 Gulp 有一定掌握度則可進入 `gulpfile.js/envOptions.js` 修改相關路徑即可。

Gulp 的自動更新行為是必須持續開著終端機的，因此若關閉終端機則會失去監聽與自動更新效果，因此在開專案時，請不要關閉運行中的終端機。

## 支援的監聽

目前支援 HTML、ejs、JavaScript、Images、SCSS 監聽並自動重新刷新。

圖片新增時也會自動刷新。

因此是不用使用 `Live Sass Compiler` 的 `Watch SCSS` 功能或是 `Prepros` 等工具來編譯 SCSS。

除此之外 Gulp 本身有支援模擬伺服器，因此不用再次使用一些模擬伺服器的套件，例如：`Preview on Web Server` 套件等。