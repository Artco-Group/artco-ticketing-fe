import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import { useState } from 'react';
import type { TicketFormData } from '@/interfaces';
import DashboardHeader from '../shared/DashboardHeader';
import FileUpload from '../shared/FileUpload';
import ScreenRecorder from '../shared/ScreenRecorder';

interface TicketFormProps {
  formData: TicketFormData;
  userEmail: string;
  onLogout: () => void;
  onFormChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>, files: File[]) => void;
  onCancel: () => void;
  onScreenRecordingChange: (file: File | null, duration: number) => void;
}

function TicketForm({
  formData,
  userEmail,
  onLogout,
  onFormChange,
  onSubmit,
  onCancel,
  onScreenRecordingChange,
}: TicketFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        title="Kreiraj novi tiket"
        userEmail={userEmail}
        onLogout={onLogout}
        maxWidth="max-w-4xl"
      />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <form
          onSubmit={(e) => onSubmit(e, files)}
          className="rounded-xl border border-gray-200 bg-white p-8"
        >
          {/* Title */}
          <FormField label="Naslov" required>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={onFormChange}
              placeholder="Kratak opis problema"
              required
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
            />
          </FormField>

          {/* Category */}
          <FormField label="Kategorija" required>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={onFormChange}
              required
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
            >
              <option value="">Odaberite kategoriju</option>
              <option value="Bug">Bug</option>
              <option value="Feature Request">
                Zahtjev za novu funkcionalnost
              </option>
              <option value="Question">Pitanje</option>
              <option value="Other">Ostalo</option>
            </select>
          </FormField>

          {/* Affected Module */}
          <FormField label="Pogođeni proizvod/modul">
            <input
              id="affectedModule"
              name="affectedModule"
              type="text"
              value={formData.affectedModule}
              onChange={onFormChange}
              placeholder="npr. Mobile App, Admin Panel"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
            />
          </FormField>

          {/* Description */}
          <FormField label="Opis" required>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={onFormChange}
              placeholder="Detaljno opišite problem ili zahtjev"
              required
              rows={10}
              className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
            />
          </FormField>

          {/* Reproduction Steps */}
          <FormField label="Koraci za reprodukciju (ako je primjenjivo)">
            <textarea
              id="reproductionSteps"
              name="reproductionSteps"
              value={formData.reproductionSteps}
              onChange={onFormChange}
              placeholder="1. Idite na...&#10;2. Kliknite na...&#10;3. Primijetite..."
              rows={5}
              className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
            />
          </FormField>

          {/* Expected Result */}
          <FormField label="Očekivani rezultat">
            <textarea
              id="expectedResult"
              name="expectedResult"
              value={formData.expectedResult}
              onChange={onFormChange}
              placeholder="Šta bi se trebalo desiti?"
              rows={3}
              className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
            />
          </FormField>

          {/* Actual Result */}
          <FormField label="Stvarni rezultat">
            <textarea
              id="actualResult"
              name="actualResult"
              value={formData.actualResult}
              onChange={onFormChange}
              placeholder="Šta se zapravo dešava?"
              rows={3}
              className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
            />
          </FormField>

          {/* Attachments */}
          <FormField label="Prilozi">
            <FileUpload files={files} onFilesChange={setFiles} />
          </FormField>

          {/* Screen Recording */}
          <FormField label="Snimak Ekrana (Opciono)">
            <ScreenRecorder
              onRecordingComplete={onScreenRecordingChange}
              disabled={false}
            />
            <p className="mt-2 text-xs text-gray-500">
              Snimite ekran da pokažete problem (maksimalno 3 minute)
            </p>
          </FormField>

          {/* Priority */}
          <FormField label="Prioritet">
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={onFormChange}
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
            >
              <option value="Low">Nizak</option>
              <option value="Medium">Srednji</option>
              <option value="High">Visok</option>
              <option value="Critical">Kritičan</option>
            </select>
          </FormField>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
            >
              Odustani
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#004179] px-6 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#003366]"
            >
              Pošalji tiket
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
}

function FormField({ label, required, children }: FormFieldProps) {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

export default TicketForm;
