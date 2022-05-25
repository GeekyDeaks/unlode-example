import * as unlode from 'unlode'
import { makeHttpTest } from 'unlode/http'
import { summariseMetrics } from 'unlode/metrics'
import { inspect } from 'node:util'

let phases = [
    { vu: 50, duration: 30 }
]

let test = async({ metrics }) => {
    let http = makeHttpTest(metrics)
    await http.get('http://floz:8080/')
}

function printStatus(m) {
    let s = {
        'vu.started': m.counters['vu.started'] || 0,
        'vu.completed': m.counters['vu.completed'] || 0,
        'vu.failed': m.counters['vu.failed'] || 0
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

unlode.runLoadTest({ phases, test }).then( metrics => {
    let { counters, gauges } = summariseMetrics(metrics)
    console.log('-- totals --------------------')
    console.log(inspect({ counters, gauges }, { depth: null, colors: true}))
})