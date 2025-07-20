"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren<{}>, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error Boundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-gray-900">Xatolik yuz berdi</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">Sahifani yuklashda muammo yuz berdi. Iltimos, qaytadan urinib ko'ring.</p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <div className="text-left bg-gray-100 p-3 rounded text-sm text-gray-700 overflow-auto">
                  <strong>Xatolik:</strong> {this.state.error.message}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={() => window.location.reload()} className="flex-1" variant="default">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Sahifani yangilash
                </Button>
                <Button onClick={() => (window.location.href = "/")} className="flex-1" variant="outline">
                  Bosh sahifaga o'tish
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}

// Client Component Error Fallback
export function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error
  resetErrorBoundary: () => void
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-lg text-gray-900">Komponent xatoligi</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600 text-sm">Bu bo'limni yuklashda muammo yuz berdi.</p>
          <Button onClick={resetErrorBoundary} size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Qaytadan urinish
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
