# fetch-headers

The `Headers` class for NodeJS
Executed against wpt test suits so it follows the spec correctly.

## Install

`fetch-headers` is an ESM-only module - you are not able to import it with `require`. If you are unable to use ESM in your project you can use the async `import('fetch-headers')` from CommonJS to load `fetch-headers` asynchronously.<br>
`npm install fetch-headers`

## Use

```js
import { Headers, bag } from 'fetch-headers'

const headers = new Headers({
  'content-type': 'text/plain'
})

// Turn headers to become immutable.
bag.get(headers).guard = 'immutable'
headers.set('content-type', 'text/html') // Throws
```

### Regards to Set-Cookie and values joined by comma

The new norm is that all headers with the same key should be joined by a comma value.
but `set-cookies` Can still contain a comma value for historical reasons. (It's best to avoid using it in any header value). All other headers are not allowed to have it.

Browser don't expose `Set-Cookies` headers in any way. That's why there is no issue with `headers.get(name).split(',')` that should always return a string joined by comma value, This header class will apply to this rule as well. meaning `headers.get('set-cookie')` will return a string with every `Set-Cookie` joined together.

So parsing it can be tricky, that's why iterating over the headers can be the preferred way, this is the least way we could expose all `set-cookie` headers individually without deviating from the spec by adding a custom `getAll()` or `raw()` method that don't exist in the spec.

```js
const header = new Headers()
headers.append('xyz', 'abc')
headers.append('xyz', 'abc')
headers.append('Set-Cookie', 'a=1')
headers.append('Set-Cookie', 'b=2')

for (const [name, value] of headers) {
  if (name === 'set-cookie') {
    // Could happen twice
  } else {
    // Will never see the same `name` twice
  }
}

console.log([...headers])
// yields [[ "set-cookie", "a=1" ], ["set-cookie", "b=2"], ["xyz", "abc, abc"]]
```

This matches the same way Deno handles headers in core as well.
It also looks like we might be getting a [getSetCookie method](https://github.com/whatwg/fetch/issues/973) soon.