module.exports = {
    resolve: {
      fallback: {
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "buffer": require.resolve("buffer/"),
        "querystring": require.resolve("querystring-es3"),
        "url": require.resolve("url/"),
        "os": require.resolve("os-browserify/browser"),
        "fs": false, // FS does not work in the browser
        "net": false, // Net is for server-side only
        "tls": false, // TLS is server-side only
        "util": require.resolve("util/"),
        "path": require.resolve("path-browserify"),
      }
    }
  };
  