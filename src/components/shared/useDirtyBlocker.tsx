import { useBlocker, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useRef } from "react";

export function useDirtyBlocker(isDirty: boolean) {
  const navigate = useNavigate();
  const nextPathRef = useRef<string | null>(null);

  useBlocker(({ currentLocation, nextLocation }) => {
    if (!isDirty) return false;

    if (currentLocation.pathname !== nextLocation.pathname) {
      nextPathRef.current = nextLocation.pathname;

      toast("You have unsaved changes", {
        description: "Leaving now will discard your changes.",
        action: {
          label: "Leave",
          onClick: () => {
            if (nextPathRef.current) {
              navigate(nextPathRef.current);
              nextPathRef.current = null;
            }
          },
        },
        cancel: {
          label: "Stay",
          onClick: () => {
            nextPathRef.current = null;
          },
        },
      });

      return true;
    }

    return false;
  });
}
