import { makeHttpTest } from 'unlode/http'

export const phases = [
    { vu: 5, duration: 30 }
]

export async function test({ metrics }) {
    let http = makeHttpTest(metrics)
    await http.get('http://github.com/GeekyDeaks/unlode')
}
