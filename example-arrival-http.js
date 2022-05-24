
import * as unlode from 'unlode'
import { makeHttpTest } from 'unlode/http'
import { inspect } from 'node:util'

let phases = [
    { startRate: 1, endRate: 5000, duration: 5, maxConcurrent: 500 },
    { startRate: 5000, endRate: 5000, duration: 20, maxConcurrent: 500 },
    { startRate: 5000, endRate: 1, duration: 5, maxConcurrent: 500 },
]

let test = async({ metrics }) => {
    let http = makeHttpTest(metrics)
    await http.get('http://floz:8080/')
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

unlode.runArrivalTest({ phases, test }).then( metrics => {
    //console.log(JSON.stringify(metrics, null, 2))

    let counters = {}
    let gauges = {}
    // summarise the metrics

    function addCounters(c) {
        for( let [key, value] of Object.entries(c)) {
            if(!counters[key]) counters[key] = 0
            counters[key] += value
        }
    }

    function addGauges(g) {
        for( let [key, value] of Object.entries(g)) {
            let g = gauges[key]
            if(!g) {
                gauges[key] = value
            } else {
                g.value = value.value
                g.sum += value.sum
                g.count += value.count
                g.avg = g.sum / g.count
                g.min = Math.min(g.min, value.min)
                g.max = Math.max(g.max, value.max)
            }
        }
    }

    metrics.forEach( p => {
        addCounters(p.counters)
        addGauges(p.gauges)
        p.samples.forEach(s => {
            addCounters(s.counters)
            addGauges(s.gauges)
        })
    })

    console.log('-- totals --------------------')
    console.log(inspect({ counters, gauges}, { depth: null, colors: true}))

})