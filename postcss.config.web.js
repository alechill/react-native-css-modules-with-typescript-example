// in web version it will be run in browser which does have full CSS capabilities so it is favourable to not bake in theme at build time, and let CSS vars be handled by browser at runtime
// that means in web can keep the ability to dynamically switch theme by loading in another theme css file in browser

module.exports = {
    plugins: {
        'autoprefixer': {}
    }
}
