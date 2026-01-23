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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
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
    <div className="p-6">
      <h1 className="text-foreground mb-6 text-2xl font-bold">
        Kreiraj novi tiket
      </h1>

      <div className="mx-auto max-w-4xl">
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
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Naslov <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Kratak opis problema"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Kategorija <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Odaberite kategoriju" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={TicketCategory.BUG}>
                            {TicketCategoryDisplay[TicketCategory.BUG]}
                          </SelectItem>
                          <SelectItem value={TicketCategory.FEATURE_REQUEST}>
                            {
                              TicketCategoryDisplay[
                                TicketCategory.FEATURE_REQUEST
                              ]
                            }
                          </SelectItem>
                          <SelectItem value={TicketCategory.QUESTION}>
                            {TicketCategoryDisplay[TicketCategory.QUESTION]}
                          </SelectItem>
                          <SelectItem value={TicketCategory.OTHER}>
                            {TicketCategoryDisplay[TicketCategory.OTHER]}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Affected Module */}
                <FormField
                  control={form.control}
                  name="affectedModule"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pogođeni proizvod/modul</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="npr. Mobile App, Admin Panel"
                          autoComplete="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
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
                  <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Prilozi
                  </label>
                  <FileUpload files={files} onFilesChange={setFiles} />
                </div>

                {/* Screen Recording */}
                <div className="space-y-2">
                  <label className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Snimak Ekrana (Opciono)
                  </label>
                  <ScreenRecorder
                    onRecordingComplete={handleScreenRecordingChange}
                    disabled={false}
                  />
                  <p className="text-muted-foreground text-xs">
                    Snimite ekran da pokažete problem (maksimalno 3 minute)
                  </p>
                </div>

                {/* Priority */}
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioritet</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Odaberite prioritet" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={TicketPriority.LOW}>
                            {TicketPriorityDisplay[TicketPriority.LOW]}
                          </SelectItem>
                          <SelectItem value={TicketPriority.MEDIUM}>
                            {TicketPriorityDisplay[TicketPriority.MEDIUM]}
                          </SelectItem>
                          <SelectItem value={TicketPriority.HIGH}>
                            {TicketPriorityDisplay[TicketPriority.HIGH]}
                          </SelectItem>
                          <SelectItem value={TicketPriority.CRITICAL}>
                            {TicketPriorityDisplay[TicketPriority.CRITICAL]}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
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
    </div>
  );
}

export default TicketForm;
