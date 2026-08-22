import { useRef } from "react";
import { Download, Upload, FileSpreadsheet } from "lucide-react";

interface Props {
  onExportJson: () => void;
  onExportCsv: () => void;
  onImportJson: (file: File) => void;
}

export default function BackupBar({ onExportJson, onExportCsv, onImportJson }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h3 className="font-serif text-lg font-semibold text-ink-950">Backup</h3>
      <p className="mt-1 text-sm text-ink-700/70">
        Deine Daten liegen nur in diesem Browser. Exportiere regelmäßig ein Backup, damit nichts
        verloren geht, falls du den Browser wechselst oder den Verlauf löschst.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onExportJson}
          className="inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-medium text-ink-950 transition-colors duration-200 hover:bg-brand-50 hover:text-brand-700"
        >
          <Download className="h-4 w-4" aria-hidden="true" /> Backup (JSON)
        </button>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-medium text-ink-950 transition-colors duration-200 hover:bg-brand-50 hover:text-brand-700"
        >
          <Upload className="h-4 w-4" aria-hidden="true" /> Backup importieren
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onImportJson(file);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={onExportCsv}
          className="inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-2 text-sm font-medium text-ink-950 transition-colors duration-200 hover:bg-brand-50 hover:text-brand-700"
        >
          <FileSpreadsheet className="h-4 w-4" aria-hidden="true" /> Als CSV exportieren
        </button>
      </div>
    </div>
  );
}
