"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Home,
  RefreshCw,
  ServerCrash,
  WifiOff,
  XCircle,
} from "lucide-react";

export function ErrorCard({
  title,
  message,
  error,
  variant = "default", // default, alert, card, full
  type = "error", // error, warning, network, server, notFound
  onRetry,
  onGoBack,
  onGoHome,
  className = "",
  showDetails = false,
}) {
  // Determine icon based on type
  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      case "network":
        return <WifiOff className="h-5 w-5" />;
      case "server":
        return <ServerCrash className="h-5 w-5" />;
      case "notFound":
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <XCircle className="h-5 w-5" />;
    }
  };

  // Determine default messages
  const getDefaultTitle = () => {
    switch (type) {
      case "warning":
        return "Warning";
      case "network":
        return "Network Error";
      case "server":
        return "Server Error";
      case "notFound":
        return "Not Found";
      default:
        return "Error";
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case "network":
        return "Unable to connect. Please check your internet connection.";
      case "server":
        return "Something went wrong on our end. Please try again later.";
      case "notFound":
        return "The resource you're looking for doesn't exist.";
      default:
        return "An unexpected error occurred. Please try again.";
    }
  };

  const displayTitle = title || getDefaultTitle();
  const displayMessage = message || error?.message || getDefaultMessage();

  // Alert variant (inline)
  if (variant === "alert") {
    return (
      <Alert variant="destructive" className={className}>
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            <AlertTitle>{displayTitle}</AlertTitle>
            <AlertDescription>{displayMessage}</AlertDescription>
            {showDetails && error?.response?.data && (
              <pre className="mt-2 text-xs bg-black/10 p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(error.response.data, null, 2)}
              </pre>
            )}
            {(onRetry || onGoBack || onGoHome) && (
              <div className="flex gap-2 mt-3">
                {onRetry && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onRetry}
                    className="h-8"
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                )}
                {onGoBack && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onGoBack}
                    className="h-8"
                  >
                    <ArrowLeft className="w-3 h-3 mr-1" />
                    Go Back
                  </Button>
                )}
                {onGoHome && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onGoHome}
                    className="h-8"
                  >
                    <Home className="w-3 h-3 mr-1" />
                    Home
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </Alert>
    );
  }

  // Card variant
  if (variant === "card") {
    return (
      <Card className={`border-destructive ${className}`}>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <div className="text-destructive">{getIcon()}</div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">{displayTitle}</h3>
              <p className="text-sm text-muted-foreground">{displayMessage}</p>
            </div>
            {showDetails && error?.response?.data && (
              <pre className="text-xs bg-secondary p-3 rounded overflow-auto max-h-40 w-full text-left">
                {JSON.stringify(error.response.data, null, 2)}
              </pre>
            )}
            {(onRetry || onGoBack || onGoHome) && (
              <div className="flex gap-2">
                {onRetry && (
                  <Button onClick={onRetry} variant="default">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                )}
                {onGoBack && (
                  <Button onClick={onGoBack} variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                )}
                {onGoHome && (
                  <Button onClick={onGoHome} variant="outline">
                    <Home className="w-4 h-4 mr-2" />
                    Home
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Full page variant
  if (variant === "full") {
    return (
      <div
        className={`min-h-[400px] flex items-center justify-center p-8 ${className}`}
      >
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <div className="text-destructive text-2xl">{getIcon()}</div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3">{displayTitle}</h2>
            <p className="text-muted-foreground">{displayMessage}</p>
          </div>
          {showDetails && error?.stack && (
            <details className="text-left">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Show technical details
              </summary>
              <pre className="mt-2 text-xs bg-secondary p-3 rounded overflow-auto max-h-48">
                {error.stack}
              </pre>
            </details>
          )}
          {(onRetry || onGoBack || onGoHome) && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {onRetry && (
                <Button onClick={onRetry} className="min-w-[140px]">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
              {onGoBack && (
                <Button
                  onClick={onGoBack}
                  variant="outline"
                  className="min-w-[140px]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              )}
              {onGoHome && (
                <Button
                  onClick={onGoHome}
                  variant="outline"
                  className="min-w-[140px]"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default variant (simple alert)
  return (
    <Alert variant="destructive" className={className}>
      {getIcon()}
      <AlertTitle>{displayTitle}</AlertTitle>
      <AlertDescription>{displayMessage}</AlertDescription>
    </Alert>
  );
}

// Preset error components for common scenarios
export function NetworkError({ onRetry, variant = "card", className }) {
  return (
    <ErrorCard
      type="network"
      variant={variant}
      onRetry={onRetry}
      className={className}
    />
  );
}

export function ServerError({ onRetry, variant = "card", className }) {
  return (
    <ErrorCard
      type="server"
      variant={variant}
      onRetry={onRetry}
      className={className}
    />
  );
}

export function NotFoundError({
  onGoHome,
  onGoBack,
  variant = "full",
  className,
}) {
  return (
    <ErrorCard
      type="notFound"
      title="404 - Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      variant={variant}
      onGoHome={onGoHome}
      onGoBack={onGoBack}
      className={className}
    />
  );
}
