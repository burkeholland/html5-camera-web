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
            exclude: [ "jQuery", "Kendo" ]
        }
    ],
    optimize: "none"
})