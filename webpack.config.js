var path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = env => {
    var baseDir = '';
    var buildDir = 'app/build/';
    var entryScript = './src/js/mainScript.js';
    var outputFilename = 'a11y-for-a8s.bundle.js';
    var mode = env && env.production ? 'production' : 'development';

    var scssRule = {
        test: /\.(s*)css$/,
        use: ['style-loader', 'css-loader']
    };

    var vueRule = {
        test: /\.vue$/,
        loader: 'vue-loader'
    };

    var resolve = {
        alias: {
            vue: 'vue/dist/vue.esm.js'
        }
    };

    var plugins = [new VueLoaderPlugin()];

    function getDevServer() {
        return {
            contentBase: path.resolve(__dirname),
            publicPath:  '/' + buildDir,
            host: '0.0.0.0',
            port: 9095,
            open: false,
            watchContentBase: true
        };
    }
    
    return {
        mode: mode,
        entry: entryScript,
        plugins: plugins,
        output: {
            path: path.resolve(__dirname, baseDir + buildDir),
            publicPath: "/" + buildDir,
            filename: outputFilename
        },
        resolve: resolve,
        devServer: getDevServer(),
        module: {
            rules: [scssRule, vueRule],
        }
    };
};