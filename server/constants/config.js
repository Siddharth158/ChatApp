const corsOption = {
    origin: ['http://localhost:5173',process.env.CORS_ORIGIN],
    credentials: true
}

const APNA_TELE_TOKEN = "apna-tele-token"

export {corsOption, APNA_TELE_TOKEN}