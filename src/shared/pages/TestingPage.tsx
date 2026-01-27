import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { PasswordInput } from '@/shared/components/ui/PasswordInput';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Switch } from '@/shared/components/ui/Switch';
import { Badge } from '@/shared/components/ui/badge';
import { StatusIcon, PriorityIcon } from '@/shared/components/ui/BadgeIcons';
import { FilterButton } from '@/shared/components/ui/FilterButton';
import { Spinner, SpinnerContainer } from '@/shared/components/ui/Spinner';
import { Modal } from '@/shared/components/ui/Modal';
import { EmptyState } from '@/shared/components/ui/EmptyState';
import { LoadingOverlay } from '@/shared/components/ui/LoadingOverlay';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@/shared/components/ui/avatar';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/components/ui/card';
import { Textarea } from '@/shared/components/ui/textarea';
import { Label } from '@/shared/components/ui/label';
import { Separator } from '@/shared/components/ui/separator';
import { DataTable } from '@/shared/components/ui/DataTable';
import { QueryStateWrapper } from '@/shared/components/ui/QueryStateWrapper';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/components/ui/form';

export default function TestingPage() {
  const [selectedValue, setSelectedValue] = useState<string>('option2');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingOverlayOpen, setLoadingOverlayOpen] = useState(false);
  const [dropdownChecked, setDropdownChecked] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [sortFilter, setSortFilter] = useState<string | null>(null);

  const form = useForm<{ email: string }>({
    defaultValues: { email: '' },
    mode: 'onSubmit',
  });

  return (
    <div className="flex min-h-screen flex-col gap-8 bg-slate-50 p-8 text-slate-900">
      <h1 className="text-2xl font-bold">UI Components Playground</h1>

      {/* Button Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Button Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small (sm)</Button>
              <Button size="md">Medium (md)</Button>
              <Button size="lg">Large (lg)</Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">States</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary">Default</Button>
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="primary" loading>
                Loading
              </Button>
              <Button
                variant="secondary"
                leftIcon={<span>⬅</span>}
                rightIcon={<span>➡</span>}
              >
                With icons
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Input Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Input Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic</h3>
            <div className="space-y-2">
              <Label htmlFor="input-basic">Email</Label>
              <Input id="input-basic" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="input-disabled">Disabled</Label>
              <Input
                id="input-disabled"
                placeholder="Disabled input"
                disabled
              />
            </div>
          </div>
        </div>
      </section>

      {/* PasswordInput Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">PasswordInput Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic</h3>
            <PasswordInput placeholder="Enter your password" label="Password" />
            <PasswordInput
              placeholder="Enter your password"
              label="Password with Helper"
              helperText="Must be at least 8 characters"
            />
            <PasswordInput
              placeholder="Enter your password"
              label="Password with Error"
              error="Password is required"
            />
            <PasswordInput
              placeholder="Enter your password"
              label="Disabled Password"
              disabled
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">With Strength Meter</h3>
            <PasswordInput
              placeholder="Enter password"
              label="Password with Strength Meter"
              showStrengthMeter
            />
          </div>
        </div>
      </section>

      {/* Select Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Select Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic</h3>
            <Select value={selectedValue} onValueChange={setSelectedValue}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="option1">Option 1</SelectItem>
                <SelectItem value="option2">Option 2</SelectItem>
                <SelectItem value="option3">Option 3</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-greyscale-600 text-sm">
              Selected: {selectedValue}
            </p>
          </div>
        </div>
      </section>

      {/* Checkbox Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Checkbox Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic</h3>
            <div className="flex items-center gap-2">
              <Checkbox
                id="checkbox-unchecked"
                checked={checkboxChecked}
                onCheckedChange={(checked) => setCheckboxChecked(!!checked)}
              />
              <Label htmlFor="checkbox-unchecked">Unchecked checkbox</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox-checked" checked />
              <Label htmlFor="checkbox-checked">Checked checkbox</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox-disabled" disabled />
              <Label htmlFor="checkbox-disabled">Disabled unchecked</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="checkbox-disabled-checked" checked disabled />
              <Label htmlFor="checkbox-disabled-checked">
                Disabled checked
              </Label>
            </div>
          </div>
        </div>
      </section>

      {/* Switch Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Switch Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic</h3>
            <Switch label="Off switch" checked={false} />
            <Switch label="On switch" checked />
            <Switch
              label="Controlled switch"
              checked={switchChecked}
              onChange={setSwitchChecked}
            />
            <Switch label="Disabled off" disabled />
            <Switch label="Disabled on" checked disabled />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Without Label</h3>
            <div className="flex items-center gap-4">
              <Switch />
              <Switch checked />
              <Switch disabled />
            </div>
          </div>
        </div>
      </section>

      {/* Badge Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Badge Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Color Variants</h3>
            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="red">Red</Badge>
              <Badge variant="orange">Orange</Badge>
              <Badge variant="yellow">Yellow</Badge>
              <Badge variant="green">Green</Badge>
              <Badge variant="blue">Blue</Badge>
              <Badge variant="teal">Teal</Badge>
              <Badge variant="pink">Pink</Badge>
              <Badge variant="violet">Violet</Badge>
              <Badge variant="purple">Purple</Badge>
              <Badge variant="grey">Grey</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">With PriorityIcon</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="red"
                icon={
                  <PriorityIcon
                    filledBars={4}
                    color="var(--color-error-600)"
                    backgroundColor="var(--color-error-100)"
                  />
                }
              >
                Critical
              </Badge>
              <Badge
                variant="orange"
                icon={
                  <PriorityIcon
                    filledBars={3}
                    color="var(--color-orange-700)"
                    backgroundColor="var(--color-orange-100)"
                  />
                }
              >
                High
              </Badge>
              <Badge
                variant="yellow"
                icon={
                  <PriorityIcon
                    filledBars={2}
                    color="var(--color-warning-500)"
                    backgroundColor="var(--color-warning-100)"
                  />
                }
              >
                Medium
              </Badge>
              <Badge
                variant="green"
                icon={
                  <PriorityIcon
                    filledBars={1}
                    color="var(--color-success-600)"
                    backgroundColor="var(--color-success-100)"
                  />
                }
              >
                Low
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">With StatusIcon</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="blue"
                icon={
                  <StatusIcon
                    fillPercent={10}
                    color="var(--color-info-500)"
                    backgroundColor="var(--color-info-100)"
                  />
                }
              >
                New
              </Badge>
              <Badge
                variant="orange"
                icon={
                  <StatusIcon
                    fillPercent={30}
                    color="var(--color-orange-700)"
                    backgroundColor="var(--color-orange-100)"
                  />
                }
              >
                Open
              </Badge>
              <Badge
                variant="yellow"
                icon={
                  <StatusIcon
                    fillPercent={50}
                    color="var(--color-warning-500)"
                    backgroundColor="var(--color-warning-100)"
                  />
                }
              >
                In Progress
              </Badge>
              <Badge
                variant="green"
                icon={
                  <StatusIcon
                    fillPercent={80}
                    color="var(--color-success-600)"
                    backgroundColor="var(--color-success-100)"
                  />
                }
              >
                Resolved
              </Badge>
              <Badge
                variant="grey"
                icon={
                  <StatusIcon
                    fillPercent={100}
                    color="var(--color-greyscale-500)"
                    backgroundColor="var(--color-greyscale-100)"
                  />
                }
              >
                Closed
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Icon Only</h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="red"
                icon={
                  <PriorityIcon
                    filledBars={4}
                    color="var(--color-error-600)"
                    backgroundColor="var(--color-error-100)"
                  />
                }
              />
              <Badge
                variant="blue"
                icon={
                  <StatusIcon
                    fillPercent={10}
                    color="var(--color-info-500)"
                    backgroundColor="var(--color-info-100)"
                  />
                }
              />
              <Badge
                variant="green"
                icon={
                  <StatusIcon
                    fillPercent={80}
                    color="var(--color-success-600)"
                    backgroundColor="var(--color-success-100)"
                  />
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sizes</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="orange"
                size="sm"
                icon={
                  <PriorityIcon
                    filledBars={3}
                    color="var(--color-orange-700)"
                    backgroundColor="var(--color-orange-100)"
                  />
                }
              >
                Small
              </Badge>
              <Badge
                variant="orange"
                size="md"
                icon={
                  <PriorityIcon
                    filledBars={3}
                    color="var(--color-orange-700)"
                    backgroundColor="var(--color-orange-100)"
                  />
                }
              >
                Medium
              </Badge>
              <Badge
                variant="orange"
                size="lg"
                icon={
                  <PriorityIcon
                    filledBars={3}
                    color="var(--color-orange-700)"
                    backgroundColor="var(--color-orange-100)"
                  />
                }
              >
                Large
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* FilterButton Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">FilterButton Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">States</h3>
            <div className="flex flex-wrap gap-2">
              <FilterButton label="Sort" active={false} />
              <FilterButton label="Priority" active={false} />
              <FilterButton label="Priority is: High" active />
              <FilterButton label="Group by: Status" active />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">With Options (Cycling)</h3>
            <div className="flex flex-wrap gap-2">
              <FilterButton
                label="Priority"
                options={['Low', 'Medium', 'High', 'Critical']}
                value={priorityFilter}
                onChange={setPriorityFilter}
              />
              <FilterButton
                label="Status"
                options={['New', 'Open', 'In Progress', 'Resolved', 'Closed']}
                value={statusFilter}
                onChange={setStatusFilter}
              />
              <FilterButton
                label="Sort"
                options={['Date', 'Priority', 'Status', 'Title']}
                value={sortFilter}
                onChange={setSortFilter}
              />
            </div>
            <div className="text-greyscale-600 space-y-1 text-xs">
              <p>Priority: {priorityFilter || 'None'}</p>
              <p>Status: {statusFilter || 'None'}</p>
              <p>Sort: {sortFilter || 'None'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">With Icons and Options</h3>
            <div className="flex flex-wrap gap-2">
              <FilterButton
                label="Priority"
                options={['Low', 'Medium', 'High', 'Critical']}
                icon={
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                }
              />
              <FilterButton
                label="Sort"
                options={['Date', 'Priority', 'Status']}
                icon={
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 6h18M7 12h10M11 18h2" />
                  </svg>
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Controlled (Simple Toggle)</h3>
            <div className="flex flex-wrap gap-2">
              <FilterButton
                label={filterActive ? 'Filter Active' : 'Filter'}
                active={filterActive}
                onClick={() => setFilterActive(!filterActive)}
              />
            </div>
            <p className="text-greyscale-600 text-sm">
              Active: {filterActive ? 'Yes' : 'No'}
            </p>
          </div>
        </div>
      </section>

      {/* Spinner Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Spinner Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sizes</h3>
            <div className="flex items-center gap-4">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">SpinnerContainer</h3>
            <div className="border-greyscale-200 relative h-32 rounded-lg border p-4">
              <SpinnerContainer message="Loading..." size="md" />
            </div>
          </div>
        </div>
      </section>

      {/* Modal Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Modal Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic Modal</h3>
            <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            <Modal
              isOpen={modalOpen}
              onClose={() => setModalOpen(false)}
              title="Modal Title"
              description="This is a modal description"
              maxWidth="md"
              actions={
                <>
                  <Button
                    variant="secondary"
                    onClick={() => setModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={() => setModalOpen(false)}>
                    Confirm
                  </Button>
                </>
              }
            >
              <p>This is the modal content. You can put anything here.</p>
            </Modal>
          </div>
        </div>
      </section>

      {/* EmptyState Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">EmptyState Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic EmptyState</h3>
            <div className="border-greyscale-200 relative h-64 rounded-lg border p-4">
              <EmptyState
                title="No items found"
                message="There are no items to display at this time."
                icon={
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-greyscale-400"
                  >
                    <path d="M9 12h6m-3-3v6m-9 1V8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                }
                action={
                  <Button variant="primary" size="sm">
                    Add Item
                  </Button>
                }
              />
            </div>
          </div>
        </div>
      </section>

      {/* LoadingOverlay Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">LoadingOverlay Component</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="secondary"
            onClick={() => setLoadingOverlayOpen((v) => !v)}
          >
            {loadingOverlayOpen ? 'Hide overlay' : 'Show overlay'}
          </Button>
          <span className="text-greyscale-600 text-sm">
            (overlay is full-screen)
          </span>
        </div>
        <LoadingOverlay
          isLoading={loadingOverlayOpen}
          message="Loading data..."
          fullScreen
        />
      </section>

      {/* Avatar Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Avatar Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic Avatar</h3>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </section>

      {/* Card Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Card Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic Card</h3>
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card description goes here</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is the card content area.</p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" size="sm">
                  Action
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Textarea Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Textarea Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic Textarea</h3>
            <div className="space-y-2">
              <Label htmlFor="textarea-basic">Description</Label>
              <Textarea
                id="textarea-basic"
                placeholder="Enter your description here..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textarea-disabled">Disabled</Label>
              <Textarea
                id="textarea-disabled"
                placeholder="Disabled textarea"
                disabled
                rows={3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Label Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Label Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic Labels</h3>
            <div className="space-y-4">
              <Label htmlFor="label-example">Default Label</Label>
              <Label htmlFor="label-required" className="text-greyscale-700">
                Required Label
              </Label>
              <Label htmlFor="label-disabled" className="text-greyscale-400">
                Disabled Label
              </Label>
            </div>
          </div>
        </div>
      </section>

      {/* Separator Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Separator Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Horizontal Separator</h3>
            <div className="space-y-4">
              <div>
                <p>Content above</p>
                <Separator />
                <p>Content below</p>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Vertical Separator</h3>
            <div className="flex h-20 items-center gap-4">
              <p>Left</p>
              <Separator orientation="vertical" />
              <p>Right</p>
            </div>
          </div>
        </div>
      </section>

      {/* DataTable Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">DataTable Component</h2>
        <div className="max-w-2xl">
          <DataTable
            columns={[
              { key: 'id', label: 'ID' },
              { key: 'title', label: 'Title' },
              {
                key: 'status',
                label: 'Status',
                render: (row: { status: string }) => (
                  <Badge variant="grey">{row.status}</Badge>
                ),
              },
            ]}
            data={[
              { id: 'T-001', title: 'Login issue', status: 'Open' },
              { id: 'T-002', title: 'Missing icons', status: 'In Progress' },
            ]}
            onRowClick={(row) => console.log('Row clicked', row)}
          />
        </div>
      </section>

      {/* QueryStateWrapper Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">QueryStateWrapper Component</h2>
        <div className="border-greyscale-200 grid max-w-2xl grid-cols-1 gap-4 rounded-xl border bg-white p-4 sm:grid-cols-2">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Loading</h3>
            <QueryStateWrapper
              isLoading
              error={null}
              data={undefined}
              loadingMessage="Loading demo..."
            >
              {(d) => <div>{JSON.stringify(d)}</div>}
            </QueryStateWrapper>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Error</h3>
            <QueryStateWrapper
              isLoading={false}
              error={new Error('Boom')}
              data={undefined}
              errorMessage="Failed to load demo."
            >
              {(d) => <div>{JSON.stringify(d)}</div>}
            </QueryStateWrapper>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <h3 className="text-sm font-medium">Success</h3>
            <QueryStateWrapper
              isLoading={false}
              error={null}
              data={{ message: 'Hello from QueryStateWrapper' }}
            >
              {(d) => <div className="text-sm">{d.message}</div>}
            </QueryStateWrapper>
          </div>
        </div>
      </section>

      {/* DropdownMenu Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">DropdownMenu Component</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">Open menu</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Menu</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => alert('Clicked item')}>
              Action
            </DropdownMenuItem>
            <DropdownMenuCheckboxItem
              checked={dropdownChecked}
              onCheckedChange={(v) => setDropdownChecked(Boolean(v))}
            >
              Toggle me
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      {/* Dialog Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Dialog Component</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog title</DialogTitle>
              <DialogDescription>
                This is a direct usage of `dialog.tsx`.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary">Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Form Component */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">
          Form Component (react-hook-form)
        </h2>
        <div className="border-greyscale-200 max-w-md rounded-xl border bg-white p-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((values) =>
                alert(JSON.stringify(values))
              )}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                rules={{ required: 'Email is required' }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      We'll never share your email.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </section>
    </div>
  );
}
