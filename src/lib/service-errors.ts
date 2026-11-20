import { toast } from "sonner";

// Shows an error toast, with an Upgrade button when the Free plan limit is hit.
export function toastServiceError(error: unknown, goToUpgrade: () => void) {
  const message =
    error instanceof Error ? error.message : "Something went wrong";

  if (message.startsWith("Free plan")) {
    toast.error(message, {
      action: { label: "Upgrade", onClick: goToUpgrade },
    });
  } else {
    toast.error(message);
  }
}