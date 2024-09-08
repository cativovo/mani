import { X } from "lucide-react";
import { ExternalToast } from "sonner";

export const defaultToastConfig: ExternalToast = {
  cancel: {
    label: <X className="h-4 w-4" />,
    onClick: () => {},
  },
  cancelButtonStyle: {
    backgroundColor: "inherit",
    color: "inherit",
  },
};
