import { makeHttpTest } from 'unlode/http'

export const phases = [
    { startRate: 1, endRate: 50, duration: 5, maxConcurrent: 50 },
    { startRate: 50, endRate: 50, duration: 20, maxConcurrent: 50 },
    { startRate: 50, endRate: 1, duration: 5, maxConcurrent: 50 },
]

export async function test({ metrics }) {
    let http = makeHttpTest(metrics)
    await http.get('http://github.com/GeekyDeaks/unlode')
}