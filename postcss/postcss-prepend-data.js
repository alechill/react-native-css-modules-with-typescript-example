
const plugin = (opts = {}) => {
    return {
        postcssPlugin: 'postcss-prepend-data',
        Once (root, { result }) {
            if (!opts.data) return
            root.prepend(`${ opts.data }\n\n`)
        }
    }
}
    
plugin.postcss = true
    
module.exports = plugin
