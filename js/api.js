const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
};

// на промисах
// const load = (route, method = Method.GET, body = null) =>
//   fetch(`${BASE_URL}${route}`, {method, body})
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error();
//       }
//       return response.json();
//     });

const load = async (route, method = Method.GET, body = null) => {
  const response = await fetch(`${BASE_URL}${route}`, {method, body});
  if (!response.ok) {
    throw new Error();
  }
  const photos = await response.json();

  return photos;
};

const getData = async () => await load(Route.GET_DATA);

const sendData = async (body) => await load(Route.SEND_DATA, Method.POST, body);

export {getData, sendData};
