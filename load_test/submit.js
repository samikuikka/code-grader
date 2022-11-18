import http from 'k6/http';
import { uuidv4 } from "https://jslib.k6.io/k6-utils/1.4.0/index.js";

export const options = {
    duration: "20s",
    vus: 10,
    summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(95)', 'p(99)', 'p(99.99)', 'count'],
}

export default function () {
    const url = 'http://localhost:7800/api'
    const payload = JSON.stringify({
        code: "function () { return 42 }",
        name: "exercise-1",
        user: uuidv4()
    })

    http.post(url, payload)
}
