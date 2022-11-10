import 'dotenv/config'

type EnvironmentVariable = 'JWT_SECRET'

export function env(environment: EnvironmentVariable) {
    return process.env[environment] ?? ''
}
