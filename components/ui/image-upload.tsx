import { useRef } from "react";
import { FaImages } from "react-icons/fa";
import { X, Upload } from "lucide-react";
function DishImageUpload({
  value,
  onChange,
}: {
  value: string;
  onChange: (base64: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === "string") {
        onChange(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="col-span-2">
      <label className="mb-1.5 block text-sm font-semibold text-colorPrimary">
        Изображение блюда
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />

      {value ? (
        <div className="group relative h-36 overflow-hidden rounded-xl bg-whitePrimary">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Превью"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-bold text-colorPrimary opacity-0 shadow-md transition-opacity group-hover:opacity-100"
            >
              <Upload size={13} />
              Заменить
            </button>
          </div>

          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-colors group-hover:opacity-100 hover:bg-red-500"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="group flex h-36 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-greySecondary/50 bg-whitePrimary transition-all"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellowPrimary/20 text-colorPrimary transition-colors">
            <FaImages size={20} className="text-colorPrimary" />
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold text-colorPrimary transition-colors">
              Загрузить фото
            </p>
            <p className="text-xs text-greySecondary">
              JPG, PNG, WebP — до 5 МБ
            </p>
          </div>
        </button>
      )}
    </div>
  );
}
export default DishImageUpload;
