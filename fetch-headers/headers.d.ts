export class Headers {
    /** @param {HeadersInit} [init] */
    constructor (init?: HeadersInit | undefined)

    /**
     * The append() method of the Headers interface appends a new
     * value onto an existing header inside a Headers object, or
     * adds the header if it does not already exist.
     *
     * @param name The name of the HTTP header you want to add
     * to the Headers object.
     * @param value The value of the HTTP header you want to add.
     */
    append(name, value): void

    /**
     * The delete() method of the Headers interface deletes a header
     * from the current Headers object.
     *
     * @param name The name of the HTTP header you want to delete
     * from the Headers object.
     */
    delete(name): void

    /**
     * The get() method of the Headers interface returns a byte string
     * of all the values of a header within a Headers object with a
     * given name. If the requested header doesn't exist in the Headers
     * object, it returns null.
     *
     * @param name The name of the HTTP header whose values you want to
     * retrieve from the Headers object. The name is case insensitive.
     * @returns {string | null}
     */
    get(name): string | null

    /**
     * @param name
     * @returns Returns a boolean stating whether a `Headers` object contains a
     * certain header.
     */
    has(name): boolean

    /**
     * @param name
     * @param value
     */
    set(name, value): void

    /**
     * @param {(value: string, key: string, parent: Headers) => void} callback
     * @param thisArg
     */
    forEach(
        callback: (
            value: string,
            key: string,
            parent: Headers
        ) => void,
        thisArg: globalThis
    ): void

    toString(): string

    /**
     * @see https://github.com/whatwg/fetch/pull/1346
     */
    getSetCookie(): string[]

    /**
     * Returns an iterator allowing to go through all keys of the key/value
     * pairs contained in this object.
     */
    keys(): IterableIterator<string>

    /**
     * Returns an iterator allowing to go through all values of the key/value
     * pairs contained in this object.
     */
    values(): IterableIterator<string>

    /**
     * Returns an iterator allowing to go through all key/value pairs contained
     * in the Headers object.
     */
    entries(): IterableIterator<[string, string]>;

    [Symbol.iterator](): IterableIterator<[string, string]>
}

export let bag: WeakMap<Headers, Bag>
export type Bag = {
    items: { [x: string]: string }
    cookies: Array<string>
    guard: string
}
