# unlode-example

example project as a base for using [unlode](https://github.com/GeekyDeaks/unlode)

# getting started

    git clone https://github.com/GeekyDeaks/unlode-example.git
    cd unlode-example
    npm install
    npx unlode examples/https-vu.js

# docker

    docker build . -t unlode
    docker run --rm --init unlode examples/http-vu.js


# example script

    import { makeHttpTest } from 'unlode/http'

    export const phases = [
        { vu: 5, duration: 30 }
    ]

    export async function test({ metrics }) {
        let http = makeHttpTest(metrics)
        await http.get('http://github.com/GeekyDeaks/unlode')
    }