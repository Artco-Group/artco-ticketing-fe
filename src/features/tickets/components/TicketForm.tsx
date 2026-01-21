import type { ReactNode } from 'react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTicketSchema } from '@artco-group/artco-ticketing-sync/validations';
import type { CreateTicketFormData } from '@artco-group/artco-ticketing-sync/types';
import {
  TicketCategory,
  TicketPriority,
  TicketCategoryDisplay,
  TicketPriorityDisplay,
} from '@artco-group/artco-ticketing-sync/enums';
import FileUpload from '@/shared/components/common/FileUpload';
import ScreenRecorder from '@/shared/components/common/ScreenRecorder';
import PageHeader from '@/shared/components/layout/PageHeader';

interface TicketFormProps {
  userEmail: string;
  onLogout: () => void;
  onSubmit: (
    data: CreateTicketFormData,
    files: File[],
    screenRecording: { file: File; duration: number } | null
  ) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function TicketForm({
  userEmail,
  onLogout,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TicketFormProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [screenRecording, setScreenRecording] = useState<{
    file: File;
    duration: number;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTicketFormData>({
    resolver: zodResolver(createTicketSchema),
    defaultValues: {
      priority: 'Low',
    },
  });

  const handleFormSubmit = (data: CreateTicketFormData) => {
    onSubmit(data, files, screenRecording);
  };

  const handleScreenRecordingChange = (file: File | null, duration: number) => {
    if (file) {
      setScreenRecording({ file, duration });
    } else {
      setScreenRecording(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Kreiraj novi tiket"
        userEmail={userEmail}
        onLogout={onLogout}
        maxWidth="max-w-4xl"
      />

      <main className="mx-auto max-w-4xl px-6 py-8">
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="rounded-xl border border-gray-200 bg-white p-8"
        >
          {/* Title */}
          <FormField label="Naslov" required error={errors.title?.message}>
            <input
              id="title"
              type="text"
              autoComplete="off"
              placeholder="Kratak opis problema"
              className={`w-full rounded-lg border px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none ${errors.title ? 'border-red-500' : 'border-gray-200'}`}
              {...register('title')}
            />
          </FormField>

          {/* Category */}
          <FormField
            label="Kategorija"
            required
            error={errors.category?.message}
          >
            <select
              id="category"
              autoComplete="off"
              className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none ${errors.category ? 'border-red-500' : 'border-gray-200'}`}
              {...register('category')}
            >
              <option value="">Odaberite kategoriju</option>
              <option value={TicketCategory.BUG}>
                {TicketCategoryDisplay[TicketCategory.BUG]}
              </option>
              <option value={TicketCategory.FEATURE_REQUEST}>
                {TicketCategoryDisplay[TicketCategory.FEATURE_REQUEST]}
              </option>
              <option value={TicketCategory.QUESTION}>
                {TicketCategoryDisplay[TicketCategory.QUESTION]}
              </option>
              <option value={TicketCategory.OTHER}>
                {TicketCategoryDisplay[TicketCategory.OTHER]}
              </option>
            </select>
          </FormField>

          {/* Affected Module */}
          <FormField label="Pogođeni proizvod/modul">
            <input
              id="affectedModule"
              type="text"
              autoComplete="off"
              placeholder="npr. Mobile App, Admin Panel"
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
              {...register('affectedModule')}
            />
          </FormField>

          {/* Description */}
          <FormField label="Opis" required error={errors.description?.message}>
            <textarea
              id="description"
              autoComplete="off"
              placeholder="Detaljno opišite problem ili zahtjev"
              rows={10}
              className={`w-full resize-y rounded-lg border px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none ${errors.description ? 'border-red-500' : 'border-gray-200'}`}
              {...register('description')}
            />
          </FormField>

          {/* Reproduction Steps */}
          <FormField label="Koraci za reprodukciju (ako je primjenjivo)">
            <textarea
              id="reproductionSteps"
              autoComplete="off"
              placeholder="1. Idite na...&#10;2. Kliknite na...&#10;3. Primijetite..."
              rows={5}
              className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
              {...register('reproductionSteps')}
            />
          </FormField>

          {/* Expected Result */}
          <FormField label="Očekivani rezultat">
            <textarea
              id="expectedResult"
              autoComplete="off"
              placeholder="Šta bi se trebalo desiti?"
              rows={3}
              className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
              {...register('expectedResult')}
            />
          </FormField>

          {/* Actual Result */}
          <FormField label="Stvarni rezultat">
            <textarea
              id="actualResult"
              autoComplete="off"
              placeholder="Šta se zapravo dešava?"
              rows={3}
              className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
              {...register('actualResult')}
            />
          </FormField>

          {/* Attachments */}
          <FormField label="Prilozi">
            <FileUpload files={files} onFilesChange={setFiles} />
          </FormField>

          {/* Screen Recording */}
          <FormField label="Snimak Ekrana (Opciono)">
            <ScreenRecorder
              onRecordingComplete={handleScreenRecordingChange}
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
              autoComplete="off"
              className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 transition-all focus:border-[#004179] focus:ring-2 focus:ring-[#004179]/10 focus:outline-none"
              {...register('priority')}
            >
              <option value={TicketPriority.LOW}>
                {TicketPriorityDisplay[TicketPriority.LOW]}
              </option>
              <option value={TicketPriority.MEDIUM}>
                {TicketPriorityDisplay[TicketPriority.MEDIUM]}
              </option>
              <option value={TicketPriority.HIGH}>
                {TicketPriorityDisplay[TicketPriority.HIGH]}
              </option>
              <option value={TicketPriority.CRITICAL}>
                {TicketPriorityDisplay[TicketPriority.CRITICAL]}
              </option>
            </select>
          </FormField>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 border-t border-gray-100 pt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900 disabled:opacity-50"
            >
              Odustani
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#004179] px-6 py-2.5 text-sm font-medium text-white transition-colors duration-200 hover:bg-[#003366] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? 'Slanje...' : 'Pošalji tiket'}
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
  error?: string;
  children: ReactNode;
}

function FormField({ label, required, error, children }: FormFieldProps) {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export default TicketForm;
