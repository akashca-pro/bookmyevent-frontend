import { useBlocker, useBeforeUnload } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { toast } from "sonner";

export function useDirtyBlocker(isDirty: boolean) {
  // Use useCallback to ensure stable reference for the blocker function
  const shouldBlock = useCallback(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
    [isDirty]
  );

  const blocker = useBlocker(shouldBlock);

  useEffect(() => {
    if (blocker.state === "blocked") {
      const toastId = toast.custom((t) => (
        <div className="w-[356px] relative overflow-hidden rounded-xl border border-white/10 bg-black/90 p-4 backdrop-blur-xl shadow-xl">
          {/* Glossy highlight */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />

          <div className="relative z-10">
            <h3 className="font-semibold text-white mb-1">Unsaved Changes</h3>
            <p className="text-sm text-gray-400 mb-4">
              You have unsaved changes. Are you sure you want to leave?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  blocker.reset();
                  toast.dismiss(t);
                }}
                className="px-3 py-1.5 text-sm text-gray-300 hover:text-white transition-colors"
              >
                Stay
              </button>
              <button
                onClick={() => {
                  blocker.proceed();
                  toast.dismiss(t);
                }}
                className="px-3 py-1.5 text-sm bg-neon-blue/20 text-neon-blue border border-neon-blue/50 rounded-md hover:bg-neon-blue/30 transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      ), {
        duration: Infinity,
        position: 'top-center'
      });

      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [blocker, blocker.state]);

  // Handle browser refresh/close
  useBeforeUnload(
    useCallback(
      (e) => {
        if (isDirty) {
          e.preventDefault();
          e.returnValue = "";
        }
      },
      [isDirty]
    )
  );
}
