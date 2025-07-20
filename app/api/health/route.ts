import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { checkEnvironmentVariables } from "@/lib/env-check"

export async function GET() {
  const healthCheck = {
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    checks: {
      environment: false,
      database: false,
    },
    errors: [] as string[],
  }

  try {
    // Check environment variables
    try {
      checkEnvironmentVariables()
      healthCheck.checks.environment = true
    } catch (error) {
      healthCheck.errors.push(`Environment: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Check database connection
    if (healthCheck.checks.environment) {
      try {
        const supabase = createServerClient()
        const { data, error } = await supabase.from("products").select("count").limit(1)

        if (error) {
          healthCheck.errors.push(`Database: ${error.message}`)
        } else {
          healthCheck.checks.database = true
        }
      } catch (error) {
        healthCheck.errors.push(`Database connection: ${error instanceof Error ? error.message : "Unknown error"}`)
      }
    }

    // Determine overall status
    const allChecksPass = Object.values(healthCheck.checks).every((check) => check)
    healthCheck.status = allChecksPass ? "healthy" : "unhealthy"

    const statusCode = healthCheck.status === "healthy" ? 200 : 503

    return NextResponse.json(healthCheck, { status: statusCode })
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: "Health check failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
