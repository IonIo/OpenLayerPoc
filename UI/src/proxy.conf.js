const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/FileAPI",
            "/UploadFiles"
        ],
        target: "http://localhost:61833",
        secure: false
    }
]
module.exports = PROXY_CONFIG;

