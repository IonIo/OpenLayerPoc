const PROXY_CONFIG = [
    {
        context: [
            "/api",
            "/alarm",
            "/FileAPI",
            "/UploadFiles",
            "/StaticFiles"
        ],
        target: "http://localhost:61833",
        secure: false,
        ws:true
    }
]
module.exports = PROXY_CONFIG;

