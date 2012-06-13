({
    appDir: "./",
    baseUrl: "./",
    dir: "build",
    paths: {
      jQuery: 'empty:',
      Kendo: 'empty:'
    },
    modules: [
        {
            name: "main",
            excludeShallow: [ "jQuery", "Kendo" ]
        }
    ],
    optimize: "none"
})