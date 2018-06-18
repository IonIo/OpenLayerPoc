const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/FileAPI",
            "/UploadFiles"
        ],
        target: "http://localhost:61832",
        secure: false
    }
]
module.exports = PROXY_CONFIG;

