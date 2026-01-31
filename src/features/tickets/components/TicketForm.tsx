import {
  type CreateTicketFormData,
  TicketCategory,
  TicketPriority,
  TicketCategoryDisplay,
  TicketPriorityDisplay,
} from '@artco-group/artco-ticketing-sync';
import {
  FileUpload,
  ScreenRecorder,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  Textarea,
  Select,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared';
import { useTicketForm } from '../hooks/useTicketForm';

interface TicketFormProps {
  onSubmit: (
    data: CreateTicketFormData,
    files: File[],
    screenRecording: { file: File; duration: number } | null
  ) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

function TicketForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TicketFormProps) {
  const {
    form,
    files,
    setFiles,
    handleScreenRecordingChange,
    handleFormSubmit,
  } = useTicketForm({ onSubmit });

  return (
    <div className="w-full">
      <h1 className="text-foreground mb-6 text-2xl font-bold">
        Kreiraj novi tiket
      </h1>

      <Card>
        <CardHeader>
          <CardTitle className="sr-only">Forma za kreiranje tiketa</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Title */}
              <FormField
                control={form.control}
                name="title"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Input
                      label="Naslov"
                      placeholder="Kratak opis problema"
                      autoComplete="off"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  </FormItem>
                )}
              />

              {/* Category */}
              <FormField
                control={form.control}
                name="category"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Select
                      label="Kategorija *"
                      options={[
                        {
                          label: TicketCategoryDisplay[TicketCategory.BUG],
                          value: TicketCategory.BUG,
                        },
                        {
                          label:
                            TicketCategoryDisplay[
                              TicketCategory.FEATURE_REQUEST
                            ],
                          value: TicketCategory.FEATURE_REQUEST,
                        },
                        {
                          label: TicketCategoryDisplay[TicketCategory.QUESTION],
                          value: TicketCategory.QUESTION,
                        },
                        {
                          label: TicketCategoryDisplay[TicketCategory.OTHER],
                          value: TicketCategory.OTHER,
                        },
                      ]}
                      placeholder="Odaberite kategoriju"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  </FormItem>
                )}
              />

              {/* Affected Module */}
              <FormField
                control={form.control}
                name="affectedModule"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Input
                      label="Pogođeni proizvod/modul"
                      placeholder="npr. Mobile App, Admin Panel"
                      autoComplete="off"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Opis <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detaljno opišite problem ili zahtjev"
                        rows={10}
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reproduction Steps */}
              <FormField
                control={form.control}
                name="reproductionSteps"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Koraci za reprodukciju (ako je primjenjivo)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="1. Idite na...&#10;2. Kliknite na...&#10;3. Primijetite..."
                        rows={5}
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Expected Result */}
              <FormField
                control={form.control}
                name="expectedResult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Očekivani rezultat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Šta bi se trebalo desiti?"
                        rows={3}
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Actual Result */}
              <FormField
                control={form.control}
                name="actualResult"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stvarni rezultat</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Šta se zapravo dešava?"
                        rows={3}
                        className="resize-y"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Attachments */}
              <div className="space-y-2">
                <span className="text-sm leading-none font-medium">
                  Prilozi
                </span>
                <FileUpload files={files} onFilesChange={setFiles} />
              </div>

              {/* Screen Recording */}
              <div className="space-y-2">
                <span className="text-sm leading-none font-medium">
                  Snimak Ekrana (Opciono)
                </span>
                <ScreenRecorder
                  onRecordingComplete={handleScreenRecordingChange}
                  disabled={false}
                />
                <p className="text-muted-xs">
                  Snimite ekran da pokažete problem (maksimalno 3 minute)
                </p>
              </div>

              {/* Priority */}
              <FormField
                control={form.control}
                name="priority"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <Select
                      label="Prioritet"
                      options={[
                        {
                          label: TicketPriorityDisplay[TicketPriority.LOW],
                          value: TicketPriority.LOW,
                        },
                        {
                          label: TicketPriorityDisplay[TicketPriority.MEDIUM],
                          value: TicketPriority.MEDIUM,
                        },
                        {
                          label: TicketPriorityDisplay[TicketPriority.HIGH],
                          value: TicketPriority.HIGH,
                        },
                        {
                          label: TicketPriorityDisplay[TicketPriority.CRITICAL],
                          value: TicketPriority.CRITICAL,
                        },
                      ]}
                      placeholder="Odaberite prioritet"
                      error={fieldState.error?.message}
                      {...field}
                    />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-4 border-t pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Odustani
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Slanje...' : 'Pošalji tiket'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

export default TicketForm;
