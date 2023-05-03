import { Headers } from '../headers.js'
// import {Headers} from 'undici'

globalThis.Headers = Headers
globalThis.hasFailed = false
globalThis.self = globalThis
globalThis.GLOBAL = {
  isWorker: () => true
}

// We are not using the same kind of iterator, but it have same properties.
const { getOwnPropertyDescriptor } = Object
Object.getOwnPropertyDescriptor = function (obj, name) {
  return name === 'next'
    ? {
        configurable: true,
        enumerable: true,
        writable: true
      }
    : getOwnPropertyDescriptor(obj, name)
}

;(async () => {
  if (!globalThis.Response) {
    // Presumable it's a node.js environment
    const { Request, Response } = await import('node-fetch')
    globalThis.Request = Request
    globalThis.Response = Response
  }

  await import('https://wpt.live/resources/testharness.js')

  setup({ explicit_timeout: true, explicit_done: true })

  globalThis.add_result_callback(test => {
    const INDENT_SIZE = 2
    const reporter = {}

    reporter.startSuite = name => console.log(`\n  ${(name)}\n`)

    reporter.pass = message => console.log((indent(('√ ') + message, INDENT_SIZE)))

    reporter.fail = message => console.log((indent('\u00D7 ' + message, INDENT_SIZE)))

    reporter.reportStack = stack => console.log((indent(stack, INDENT_SIZE * 2)))

    function indent (string, times) {
      const prefix = ' '.repeat(times)
      return string.split('\n').map(l => prefix + l).join('\n')
    }

    if (test.status === 0) {
      reporter.pass(test.name)
    } else if (test.status === 1) {
      reporter.fail(`${test.name}\n`)
      reporter.reportStack(`${test.message}\n${test.stack}`)
      globalThis.hasFailed = true
    } else if (test.status === 2) {
      reporter.fail(`${test.name} (timeout)\n`)
      reporter.reportStack(`${test.message}\n${test.stack}`)
      globalThis.hasFailed = true
    } else if (test.status === 3) {
      reporter.fail(`${test.name} (incomplete)\n`)
      reporter.reportStack(`${test.message}\n${test.stack}`)
      globalThis.hasFailed = true
    } else if (test.status === 4) {
      reporter.fail(`${test.name} (precondition failed)\n`)
      reporter.reportStack(`${test.message}\n${test.stack}`)
      globalThis.hasFailed = true
    } else {
      reporter.fail(`unknown test status: ${test.status}`)
      globalThis.hasFailed = true
    }

    if (globalThis.hasFailed) globalThis.Deno ? Deno.exit(1) : process.exit(1)
  })

  // Works
  await import('https://wpt.live/fetch/api/headers/headers-record.any.js')
  await Promise.all([
    // this requires http request
    // await import('https://wpt.live/fetch/api/headers/header-values-normalize.any.js')
    // await import('https://wpt.live/fetch/api/headers/header-values.any.js')
    // await import('https://wpt.live/fetch/api/headers/headers-no-cors.any.js')

    import('https://wpt.live/fetch/api/headers/headers-basic.any.js'),
    import('https://wpt.live/fetch/api/headers/headers-casing.any.js'),
    import('https://wpt.live/fetch/api/headers/headers-combine.any.js'),
    import('https://wpt.live/fetch/api/headers/headers-errors.any.js'),
    import('https://wpt.live/fetch/api/headers/headers-normalize.any.js'),
    import('https://wpt.live/fetch/api/headers/headers-structure.any.js'),
    import('./own-misc-test.any.js'),

    // This one has broken tests:
    // await import('https://raw.githubusercontent.com/web-platform-tests/wpt/352ee4227f71c9be1c355f7d812a8e28e7b18008/fetch/api/headers/header-setcookie.any.js')
    // Use this for now...
    import('./header-setcookie.any.js')
  ])
})()
