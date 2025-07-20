export function checkEnvironmentVariables() {
  const requiredEnvVars = ["NEXT_PUBLIC_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_ANON_KEY"]

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables: ${missingVars.join(", ")}`
    console.error("❌ Environment Configuration Error:", errorMessage)

    if (process.env.NODE_ENV === "development") {
      console.log(`
🔧 To fix this error:

1. Create a .env.local file in your project root
2. Add the following variables:

NEXT_PUBLIC_SUPABASE_URL=https://drfbjbnwpoqnnqdmtptl.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZmJqYm53cG9xbm5xZG10cHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MzA2NjksImV4cCI6MjA2ODQwNjY2OX0.QJCAB922OcccyhPF1Mirr-5DAuUKjQ9BLCDWm_zd8kE
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRyZmJqYm53cG9xbm5xZG10cHRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjgzMDY2OSwiZXhwIjoyMDY4NDA2NjY5fQ.mVJ0v4_hn4EW4-ChtkjZC1rVf68IgrCyB_xCf6YF43Y

3. Restart your development server
      `)
    }

    throw new Error(errorMessage)
  }

  console.log("✅ All required environment variables are set")
}

export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name]
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${name} is required`)
  }
  return value || defaultValue!
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development"
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === "production"
}

export function logEnvStatus() {
  if (isDevelopment()) {
    try {
      checkEnvironmentVariables()
    } catch (error) {
      console.error("Environment check failed:", error)
    }

    // Optional variables check
    const optionalVars = ["TELEGRAM_BOT_TOKEN", "TELEGRAM_CHAT_ID", "SUPABASE_SERVICE_ROLE_KEY"]
    const missingOptional = optionalVars.filter((envVar) => !process.env[envVar])

    if (missingOptional.length > 0) {
      console.warn("⚠️ Optional environment variables not set:", missingOptional)
      console.warn("   Some features may not work properly")
    }
  }
}
