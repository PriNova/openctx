export class Cache<T> {
    private cache: Map<string, { value: T }> = new Map()
    private timeoutMS: number

    constructor(opts: { ttlMS: number }) {
        this.timeoutMS = opts.ttlMS
    }

    async getOrFill(key: string, fill: () => Promise<T>): Promise<T> {
        const entry = this.cache.get(key)
        if (entry) {
            return entry.value
        }

        const value = await fill()

        this.cache.set(key, { value })
        setTimeout(() => this.cache.delete(key), this.timeoutMS)

        return value
    }
}
