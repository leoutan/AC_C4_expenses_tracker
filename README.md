# expenses tracker
此專案為 ALPHA Camp Dev C4 M4 挑戰 
![image](https://github.com/leoutan/AC_C4_expenses_tracker/blob/main/expenses%20tracker.jpg)

## 功能 (Features)
- 註冊帳號
  - 註冊之後，可以登入/登出
  - 只有登入狀態的使用者可以看到 app 內容，否則一律被導向登入頁
- 可用已註冊的帳號密碼登入。
- 可用臉書帳號登入。
- 在首頁一次瀏覽所有支出的清單
- 使用者只能看到自己建立的資料
- 在首頁看到所有支出清單的總金額
- 新增一筆支出 (資料屬性參見下方規格說明)
- 編輯支出的屬性 (一次只能編輯一筆)
- 刪除任何一筆支出 (一次只能刪除一筆)
- 根據「類別」篩選支出；總金額的計算只會包括被篩選出來的支出總和

## 執行環境 (RTE)
[Node.js](https://nodejs.org/) (v20.15.1)  
[MySQL](https://dev.mysql.com/downloads/mysql/) (v3.2.0)  
ℹ️ *執行此專案前，需安裝 Node.js 與 MySQL。*

## 安裝 (Installation)
1. 開啟終端機 (Terminal)，cd 至存放本專案的資料夾，執行以下指令將本專案 clone 至本機電腦。

```
git clone https://github.com/leoutan/AC_C4_expenses_tracker.git
```
<br>

2. 進入此專案資料夾

```
cd AC_C4_expenses_tracker
```
<br>

3. 執行以下指令以安裝套件

```
npm install
```
<br>

4. 資料庫設定
  - 手動建立資料庫 expensetracker<br>
  - 執行以下指令建立資料表
    ```
    npm run schema
    ```
  - 執行以下指令匯入種子資料
    ```
    npm run seed
    ```
<!--執行以下指令以快速建立資料庫、資料表，以及匯入種子資料：

```
npm run setup-db
```-->
⚠️ **執行上述指令前，請先確認是否需更改預設設定**  
--- MySQL server 連線之預設設定如下：
```
host: '127.0.0.1'  // localhost
username: 'root'
password: 'password'
database: 'expensetracker'
```
若欲更改設定，請編輯專案資料夾中 `/config/config.json` 中的 "development"  
  
<!--您也可以透過以下指令分別執行資料庫建立、資料表建立、匯入種子資料：
```
npm run db:create
```
```
npm run db:migrate
```
```
npm run db:seed
```-->
<!--
5. 環境變數設定

請參照根目錄下的 `.env.example` 檔，於根目錄下新增 `.env` 檔並進行相關設定：
```
SESSION_SECRET= 【 請自行設定 】
FACEBOOK_CLIENT_ID= 【 請自行設定 】
FACEBOOK_CLIENT_SECRET= 【 請自行設定 】

FACEBOOK_CALLBACK_URL=http://localhost:3000/oauth2/redirect/facebook
```
請自行設定 SESSION_SECRET、FACEBOOK_CLIENT_ID、FACEBOOK_CLIENT_SECRET。  
（若無 Facebook Client Id / secret，請先取得，否則無法使用 Facebook 登入）  
FACEBOOK_CALLBACK_URL 建議依照  `.env.example` 預設值設定即可，若欲更改，需同步修改登入/登出路由 `./routes/login-logout.js` 中的路由設定：
```
router.get('/oauth2/redirect/facebook', passport.authenticate('facebook', {
  successRedirect: '/restaurants',
  failureRedirect: '/login',
  failureFlash: true
}))
```
此處的 '/oauth2/redirect/facebook' 需與 FACEBOOK_CALLBACK_URL 之設定同步。-->
<br>
5. 啟動伺服器

啟動伺服器前，請先設置環境變數 NODE_ENV=development，再執行以下指令以啟動伺服器：

```
npm run dev
```


當 Terminal 出現以下字樣，即代表伺服器啟動成功：  
`expense-tracker Server on http://localhost:3000`  
現在，您可開啟任一瀏覽器輸入 http://localhost:3000/expenses 來使用餐廳清單網頁。  

種子資料提供以下一組帳號密碼可使用：
- 帳號：user1@example.com / 密碼：12345678
<!--
- 帳號：user2@example.com / 密碼：12345678
-->

## 使用工具 (Tools)
- 開發環境：[Visual Studio Code](https://visualstudio.microsoft.com/zh-hant/)
- 應用程式框架：[Express v4.18.2](https://www.npmjs.com/package/express)
- 樣版引擎：[Express-Handlebars v7.1.2](https://www.npmjs.com/package/express-handlebars)
- 資料庫套件：[mysql2 v3.2.0](https://www.npmjs.com/package/mysql2)
- ORM：[Sequelize v6.30.0 & Sequelize-CLI 6.6.0](https://sequelize.org/)
- HTTP method套件：[method-override v3.0.0](https://www.npmjs.com/package/method-override)
- 樣式框架：[Bootstrap v5.3](https://getbootstrap.com/docs/5.3/getting-started/download/)
- 字體圖標工具：[Font Awesome](https://fontawesome.com/)
- [connect-flash v0.1.1](https://www.npmjs.com/package/connect-flash)
- [express-session v1.17.3](https://www.npmjs.com/package/express-session)
<!--
- [dotenv v16.0.3](https://www.npmjs.com/package/dotenv)
- [bcryptjs v2.4.3](https://www.npmjs.com/package/bcryptjs)
- [passport v0.6.0](https://www.npmjs.com/package/passport)
- [passport-local v3.0.0](https://www.npmjs.com/package/passport-local)
- [passport-facebook v1.0.0](https://www.npmjs.com/package/passport-facebook)


## 開發者 (Contributor)
[Letitia Chiu](https://github.com/letitia-chiu)
-->
