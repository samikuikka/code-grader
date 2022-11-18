import http from 'k6/http';


export const options = {
    duration: "20s",
    vus: 10,
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)', 'p(99.99)', 'count'],
}

export default function () {
  const url = 'http://localhost:7800'
  const res = http.get(url);
}