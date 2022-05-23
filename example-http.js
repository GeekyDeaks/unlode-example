
import * as unlode from 'unlode'
import { makeHttpTest } from 'unlode/http'

let phases = [
    { startRate: 1, endRate: 10, duration: 5 },
    { startRate: 10, endRate: 10, duration: 10 },
    { startRate: 10, endRate: 1, duration: 5 },
]

let test = async({ metrics }) => {
    let http = makeHttpTest(metrics.prefix('local'))
    await http.get('http://127.0.0.1:3001/')
}

function printStatus(m) {
    let s = {
        'vu.started': m.counters['vu.started'] || 0,
        'vu.completed': m.counters['vu.completed'] || 0,
        'vu.failed': m.counters['vu.failed'] || 0,
        'vu.running': m.gauges['vu.running']?.value || 0
    }

    for (const [key, value] of Object.entries(m.counters)) {
        if(key.match(/\.error\./)) {
            s[key] = value
        }
    }

    console.log(s)
}

unlode.on('phase.start', (name, phase) => console.log('phase.start %s', name, phase))
unlode.on('phase.end', (name, metrics) => {
    console.log('phase.end %s', name)
    printStatus(metrics)
})
//unlode.on('error', (name, msg) => console.error(name, msg))
unlode.on('error', () => {})
unlode.on('sample', (sample) => {
    console.log('sample')
    printStatus(sample)
})

unlode.runTest({ phases, test }).then( metrics => {
    console.log(JSON.stringify(metrics, null, 2))
})