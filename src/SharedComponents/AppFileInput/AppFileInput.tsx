import { CloseCircle, GalleryAdd } from "iconsax-reactjs";
import { useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent } from "react";

interface AppFileInputProps {
  value: File | null;
  onChange: (file: File | null) => void;
  accept?: string;
}

function AppFileInput({
  value,
  onChange,
  accept = "image/*",
}: AppFileInputProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    onChange(event.target.files?.[0] ?? null);
  }

  function handleRemove() {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (previewUrl) {
    return (
      <div className="relative mt-3 inline-block self-start">
        <img
          src={previewUrl}
          alt=""
          className="max-h-48 rounded-2xl border border-border object-cover"
        />
        <button
          type="button"
          onClick={handleRemove}
          aria-label="Remove image"
          className="absolute -right-2 -top-2 flex size-6 cursor-pointer items-center justify-center rounded-full bg-surface text-danger shadow-sm"
        >
          <CloseCircle size="20" variant="Bold" />
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <label
        htmlFor={inputId}
        className="inline-flex w-fit cursor-pointer items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-sm text-muted hover:bg-surface-secondary hover:text-foreground"
      >
        <GalleryAdd size="18" />
        Photo
      </label>
    </>
  );
}

export default AppFileInput;
