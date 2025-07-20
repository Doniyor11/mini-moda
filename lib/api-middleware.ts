import { type NextRequest, NextResponse } from "next/server"

export interface ApiError extends Error {
  statusCode?: number
  code?: string
}

export function createApiError(message: string, statusCode = 500, code?: string): ApiError {
  const error = new Error(message) as ApiError
  error.statusCode = statusCode
  error.code = code
  return error
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  if (error instanceof Error) {
    const apiError = error as ApiError
    const statusCode = apiError.statusCode || 500

    // Development mode - return detailed error
    if (process.env.NODE_ENV === "development") {
      return NextResponse.json(
        {
          error: apiError.message,
          code: apiError.code,
          stack: apiError.stack,
          timestamp: new Date().toISOString(),
        },
        { status: statusCode },
      )
    }

    // Production mode - return generic error for 500s
    if (statusCode >= 500) {
      return NextResponse.json(
        {
          error: "Serverda xatolik yuz berdi",
          code: "INTERNAL_SERVER_ERROR",
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      )
    }

    // Client errors (4xx) - return actual message
    return NextResponse.json(
      {
        error: apiError.message,
        code: apiError.code || "CLIENT_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: statusCode },
    )
  }

  // Unknown error
  return NextResponse.json(
    {
      error: "Noma'lum xatolik yuz berdi",
      code: "UNKNOWN_ERROR",
      timestamp: new Date().toISOString(),
    },
    { status: 500 },
  )
}

export function withErrorHandling(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      return await handler(req)
    } catch (error) {
      return handleApiError(error)
    }
  }
}

export function validateRequestMethod(req: NextRequest, allowedMethods: string[]) {
  if (!allowedMethods.includes(req.method)) {
    throw createApiError(`Method ${req.method} not allowed`, 405, "METHOD_NOT_ALLOWED")
  }
}

export async function validateRequestBody(req: NextRequest, requiredFields: string[]) {
  let body: any

  try {
    body = await req.json()
  } catch (error) {
    throw createApiError("Invalid JSON body", 400, "INVALID_JSON")
  }

  const missingFields = requiredFields.filter((field) => !body[field])

  if (missingFields.length > 0) {
    throw createApiError(`Missing required fields: ${missingFields.join(", ")}`, 400, "MISSING_FIELDS")
  }

  return body
}
