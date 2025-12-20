import { memo, useCallback, useMemo } from "react";
import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const ErrorElementComponent = () => {
    const error = useRouteError();

    const { errorTitle, errorMessage } = useMemo(() => {
        if (isRouteErrorResponse(error)) {
            return {
                errorTitle: `${error.status} - ${error.statusText}`,
                errorMessage: error.data?.message || "The page you are looking for does not exist or an error occurred.",
            };
        }
        if (error instanceof Error) {
            return {
                errorTitle: "Unexpected Application Error",
                errorMessage: error.message,
            };
        }
        if (typeof error === "string") {
            return { errorTitle: "Error", errorMessage: error };
        }
        return { errorTitle: "Unknown Error", errorMessage: "An unknown error has occurred." };
    }, [error]);

    const handleReload = useCallback(() => window.location.reload(), []);

    return (
        <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full text-center space-y-6 bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm shadow-[0_0_50px_rgba(255,0,0,0.1)]">
                <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                        {errorTitle}
                    </h1>
                    <p className="text-gray-400 text-sm">{errorMessage}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleReload}
                        className="border-white/20 hover:bg-white/10 text-white"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reload Page
                    </Button>
                    <Button size="sm" className="bg-neon-purple hover:bg-neon-purple/90 text-white border-0" asChild>
                        <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Return Home
                        </Link>
                    </Button>
                </div>
                {import.meta.env.DEV && error instanceof Error && (
                    <div className="mt-8 text-left p-4 bg-black/50 rounded-lg overflow-auto max-h-40 text-xs font-mono text-red-300 border border-red-500/20">
                        {error.stack}
                    </div>
                )}
            </div>
        </div>
    );
};

export const ErrorElement = memo(ErrorElementComponent);
