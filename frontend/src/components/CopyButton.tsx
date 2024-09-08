import { Button } from "@/components/shadcn/button";
import { Clipboard, ClipboardCheck, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ClipboardSetText } from "@wails/runtime/runtime";

type Props = {
  className?: string;
  toCopy(): string;
};

function CopyButton(props: Props) {
  const [copyCount, setCopyCount] = useState(0);

  async function handleClick() {
    const content = props.toCopy();
    if (content === "") {
      return;
    }

    const newCopyCount = copyCount + 1;
    setCopyCount(newCopyCount);

    await ClipboardSetText(content);

    const message =
      newCopyCount === 1 ? "Copied!" : `Copied ${newCopyCount} times!`;
    toast.success(message, {
      cancel: {
        label: <X className="h-4 w-4" />,
        onClick: () => setCopyCount(0),
      },
      onAutoClose: () => setCopyCount(0),
      cancelButtonStyle: {
        backgroundColor: "inherit",
        color: "inherit",
      },
    });
  }

  return (
    <Button
      variant="outline"
      className={props.className}
      size="icon"
      onClick={handleClick}
    >
      {copyCount > 0 ? (
        <ClipboardCheck className="text-gray-500" />
      ) : (
        <Clipboard className="text-gray-500" />
      )}
    </Button>
  );
}

export default CopyButton;
