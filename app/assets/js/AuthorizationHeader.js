/* global axios */

// 請自行更換 client_id 與 client_secret
// GetApiResponse() 中 axios.get('URL') 的 URL 可替換成想要取得的網址。

// API 認證，取得 token
export default function GetAuthorizationHeader() {
    const authUrl = 'https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token';

      const parameter = {
      grant_type: 'client_credentials',
      client_id: 'apog780212-3c7005de-321a-4555',
      client_secret: '4408c630-a7ff-4f57-8728-f4642ee5f932',
    };

    axios.post(authUrl,Qs.stringify(parameter))
      .then((res) => {
        axios.defaults.headers.common.Authorization = `Bearer ${res.data.access_token}`;
      })
      .catch((err) => {
        console.log(err);
      });
}
