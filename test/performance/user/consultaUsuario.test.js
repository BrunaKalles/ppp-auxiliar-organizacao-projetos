import http from 'k6/http';
import { sleep, check } from 'k6';
import { getUserToken, getBaseUrl } from '../../utils/user.js';


export const options = {
      //iterations: 1,
     stages: [
    { duration: '20s', target: 200 },
    { duration: '35s', target: 200 },
    { duration: '5s', target: 0 },
  ],
    thresholds: {
        http_req_duration: ['p(95)<2000', ' max<3000'], // 95% das requisições devem ser respondidas em menos de 4000ms
        http_req_failed: ['rate<0.01'] // taxa de erro deve ser menor que 1%
    }
};
export default function () {
    const token = getUserToken();
    const url = getBaseUrl() + '/users';

    const params = {
        headers: {
            'Authorization': `Bearer ${token}`
        },
    };

    const res = http.get(url, params);

    check(res, {
        'status is 200': (r) => r.status === 200,
    });

    sleep(1);
}

