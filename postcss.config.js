// This should only be used by React Native build (via Metro plugins) 
// CSS vars and imports are not supported
// so use PostCSS to polyfill at build time
//
// this does mean that theme defined by CSS vars is baked in at build time and cannot be switched at runtime
//
// also no need for autoprefixer which is used in web postcss config as we are not running in browser
// in native these will become StyleSheet StyleProps
module.exports = {
    // imports should be declared relative to the root, rather than relative to file the file that is importing another
    from: '',
    plugins: {
        './postcss/postcss-prepend-data': {
            "data": "@import 'react-native.theme.css';"
        },
        'postcss-import': {},
        'postcss-css-variables': {}
    }
}

// in web version it will be run in browser which does have full CSS capabilities so it is favourable to not bake in theme at build time, and let CSS vars be handled by browser at runtime
// that means in web can keep the ability to dynamically switch theme by loading in another theme css file in browser
