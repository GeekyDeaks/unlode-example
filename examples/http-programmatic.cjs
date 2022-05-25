'use strict'

// commonJS example
const { inspect } = require('util')

;(async() => {
    const unlode = await import('unlode')
    const { makeHttpTest } = await import('unlode/http')
    const { summariseMetrics } = await import('unlode/metrics')
    
    let phases = [
        { startRate: 1, endRate: 5, duration: 5 },
        { startRate: 5, endRate: 5, duration: 20 },
        { startRate: 5, endRate: 1, duration: 5 },
    ]
    
    let test = async({ metrics }) => {
    
        let http = makeHttpTest(metrics.prefix('local'))
        await http.get('http://github.com/GeekyDeaks/unlode')
    }
    
    unlode.on('phase.start', (name, phase) => {
        console.log('phase.start %s %s', name, inspect(phase, { depth: null, colors: true}))
    })

    unlode.on('phase.end', (name, metrics) => {
        console.log('phase.end %s %s', name, inspect(summariseMetrics(metrics), { depth: null, colors: true}))
    })

    unlode.on('sample', (metrics) => {
        console.log('sample: %s', inspect(summariseMetrics(metrics), { depth: null, colors: true}) )
    })
    
    unlode.runTest({ phases, test }).then( metrics => {
        let { counters, measures, rates } = summariseMetrics(metrics)
        console.log('-- totals --------------------')
        console.log(inspect({ counters, measures, rates }, { depth: null, colors: true}))
    })
})()

