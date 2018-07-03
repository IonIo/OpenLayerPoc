const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/FileAPI",
            "/UploadFiles"
        ],
        changeOrigin: true,
        target: "http://localhost:61833",
        secure: false
    },
    {
        context: [
            "/alarm",
        ],
        changeOrigin: true,
        target: "http://localhost:61833",
        secure: false,
        ws:true
    }
]

module.exports = PROXY_CONFIG;