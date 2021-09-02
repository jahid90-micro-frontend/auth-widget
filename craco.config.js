const { getLoader, loaderByName } = require('@craco/craco');

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {

            if (env === 'development') {
                // your overridden `style-loader`
                const overrideOptions = {
                    loader: 'style-loader',
                    options: {
                        insert: function insertToShadowDom(element) {
                            document.querySelector('#mf-auth-css').appendChild(element);
                        }
                    },
                };

                // override `style-loader`
                const { isFound, match } = getLoader(webpackConfig, loaderByName('style-loader'));

                if (isFound) {
                    match.parent[match.index] = overrideOptions;
                }
            }

            return webpackConfig;
        },
    },
};
