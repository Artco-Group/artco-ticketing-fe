import { useState } from 'react';
import {
  Button,
  Badge,
  Input,
  PasswordInput,
  Textarea,
  Checkbox,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectField,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Avatar,
  AvatarFallback,
  Label,
  Separator,
  Spinner,
  EmptyState,
  Icon,
  FilterButton,
} from '@/shared/components/ui';
import { MemberPicker } from '@/shared/components/composite';

// Mock user data for MemberPicker demo
const mockUsers = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john.doe@artco.com',
    role: 'DEVELOPER' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@artco.com',
    role: 'ENG_LEAD' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@artco.com',
    role: 'DEVELOPER' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4',
    name: 'Alice Williams',
    email: 'alice.williams@artco.com',
    role: 'CLIENT' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '5',
    name: 'Charlie Brown',
    email: 'charlie.brown@artco.com',
    role: 'ADMIN' as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function TestingPage() {
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">UI Components Testing Page</h1>
        <p className="text-muted-foreground mt-2">
          A comprehensive showcase of all available UI components
        </p>
      </div>

      <Separator />

      {/* Filter Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Filter Buttons</h2>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic States</h3>
          <div className="flex flex-wrap gap-3">
            <FilterButton label="Inactive Filter" />
            <FilterButton label="Active Filter" active={true} />
            <FilterButton
              label="With Icon"
              icon={<Icon name="search" size="sm" />}
            />
            <FilterButton
              label="Active with Icon"
              icon={<Icon name="settings" size="sm" />}
              active={true}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">With Options (Cycle Through)</h3>
          <div className="flex flex-wrap gap-3">
            <FilterButton
              label="Priority"
              icon={<Icon name="priority" size="sm" />}
              options={['Low', 'Medium', 'High']}
              value={filterValue}
              onChange={setFilterValue}
            />
            <FilterButton
              label="Status"
              options={['Open', 'In Progress', 'Closed']}
            />
            <FilterButton
              label="Type"
              icon={<Icon name="file-text" size="sm" />}
              options={['Bug', 'Feature', 'Task']}
            />
          </div>
          {filterValue && (
            <p className="text-muted-foreground text-sm">
              Selected priority: <strong>{filterValue}</strong>
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Controlled State</h3>
          <div className="flex flex-wrap gap-3">
            <FilterButton
              label="Controlled Filter"
              active={isFilterActive}
              onClick={() => setIsFilterActive(!isFilterActive)}
            />
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFilterActive(!isFilterActive)}
            >
              Toggle Filter
            </Button>
          </div>
        </div>
      </section>

      <Separator />

      {/* Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="default" disabled>
            Disabled
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="icon">
            <Icon name="plus" size="md" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="default" leftIcon="plus" rightIcon="arrow-right">
            Primary with Icons
          </Button>
          <Button variant="secondary" leftIcon="edit" rightIcon="chevron-right">
            Secondary with Icons
          </Button>
          <Button variant="destructive" leftIcon="trash" rightIcon="close">
            Destructive with Icons
          </Button>
          <Button variant="ghost" leftIcon="search" rightIcon="chevron-down">
            Ghost with Icons
          </Button>
          <Button variant="link" leftIcon="info" rightIcon="arrow-right">
            Link with Icons
          </Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="default" loading>
            Loading Primary
          </Button>
          <Button variant="secondary" loading>
            Loading Secondary
          </Button>
          <Button variant="destructive" loading>
            Loading Destructive
          </Button>
          <Button variant="ghost" loading>
            Loading Ghost
          </Button>
        </div>
      </section>

      <Separator />

      {/* Badges Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Badges</h2>
        <div className="flex flex-wrap gap-3">
          <Badge variant="default">Grey</Badge>
          <Badge variant="secondary">Green</Badge>
          <Badge variant="destructive">Blue</Badge>
          <Badge variant="outline">Orange</Badge>
        </div>
      </section>

      <Separator />

      {/* Icons Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Icons</h2>
        <div className="grid grid-cols-6 gap-4">
          <div className="flex flex-col items-center gap-2">
            <Icon name="dashboard" size="lg" />
            <span className="text-xs">dashboard</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="tickets" size="lg" />
            <span className="text-xs">tickets</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="user" size="lg" />
            <span className="text-xs">user</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="plus" size="lg" />
            <span className="text-xs">plus</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="search" size="lg" />
            <span className="text-xs">search</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="edit" size="lg" />
            <span className="text-xs">edit</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="trash" size="lg" />
            <span className="text-xs">trash</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="close" size="lg" />
            <span className="text-xs">close</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="mail" size="lg" />
            <span className="text-xs">mail</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="lock" size="lg" />
            <span className="text-xs">lock</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="eye" size="lg" />
            <span className="text-xs">eye</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Icon name="arrow-right" size="lg" />
            <span className="text-xs">arrow-right</span>
          </div>
        </div>
      </section>

      <Separator />

      {/* Form Inputs Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Form Inputs</h2>

        {/* Input Variants */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Input Variants</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Basic Input</Label>
              <Input
                placeholder="Enter text here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Input with Left Icon</Label>
              <Input
                placeholder="Email address"
                leftIcon={<Icon name="mail" size="md" />}
              />
            </div>

            <div className="space-y-2">
              <Label>Input with Right Icon</Label>
              <Input
                placeholder="Search..."
                rightIcon={<Icon name="search" size="md" />}
              />
            </div>

            <div className="space-y-2">
              <Label>Input with Both Icons</Label>
              <Input
                placeholder="Username"
                leftIcon={<Icon name="user" size="md" />}
                rightIcon={<Icon name="check-simple" size="md" />}
              />
            </div>

            <div className="space-y-2">
              <Label>Input with Error</Label>
              <Input
                placeholder="Enter email"
                leftIcon={<Icon name="mail" size="md" />}
                error="This field is required"
              />
            </div>

            <div className="space-y-2">
              <Label>Input with Helper Text</Label>
              <Input
                placeholder="Username"
                helperText="Choose a unique username"
              />
            </div>
          </div>
        </div>

        {/* Input Sizes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Input Sizes</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Small</Label>
              <Input
                size="sm"
                placeholder="Small input"
                leftIcon={<Icon name="search" size="sm" />}
              />
            </div>

            <div className="space-y-2">
              <Label>Medium (Default)</Label>
              <Input
                size="md"
                placeholder="Medium input"
                leftIcon={<Icon name="search" size="md" />}
              />
            </div>

            <div className="space-y-2">
              <Label>Large</Label>
              <Input
                size="lg"
                placeholder="Large input"
                leftIcon={<Icon name="search" size="md" />}
              />
            </div>
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Password Input</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Password Input</Label>
              <PasswordInput
                placeholder="Enter password"
                leftIcon={<Icon name="lock" size="md" />}
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Password with Strength Meter</Label>
              <PasswordInput
                placeholder="Enter password"
                leftIcon={<Icon name="lock" size="md" />}
                showStrengthMeter
                value={passwordValue}
                onChange={(e) => setPasswordValue(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Other Form Elements */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Other Form Elements</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="test-textarea">Textarea</Label>
              <Textarea
                id="test-textarea"
                placeholder="Enter longer text here..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="test-checkbox"
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    setIsChecked(checked as boolean)
                  }
                />
                <Label htmlFor="test-checkbox">Checkbox Label</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-select">Select (Primitive)</Label>
                <SelectField value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger id="test-select">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </SelectField>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Select Component Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Select (Custom Component)</h2>
        <p className="text-muted-foreground">
          High-level Select component matching Figma design specifications
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic SelectField */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic Select</h3>
            <Select
              label="Category"
              options={[
                { label: 'Option 1', value: 'option1' },
                { label: 'Option 2', value: 'option2' },
                { label: 'Option 3', value: 'option3' },
              ]}
              placeholder="Choose an option"
              value={selectValue}
              onChange={setSelectValue}
            />
          </div>

          {/* SelectField with Error */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select with Error</h3>
            <Select
              label="Priority"
              options={[
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' },
                { label: 'Critical', value: 'critical' },
              ]}
              placeholder="Select priority"
              error="This field is required"
            />
          </div>

          {/* Disabled SelectField */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Disabled Select</h3>
            <Select
              label="Status"
              options={[
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
              ]}
              placeholder="Cannot select"
              disabled
            />
          </div>

          {/* SelectField with Helper Text */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select with Helper Text</h3>
            <Select
              label="Size"
              options={[
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'md' },
                { label: 'Large', value: 'lg' },
              ]}
              placeholder="Pick a size"
              helperText="Choose the size that fits best"
            />
          </div>

          {/* SelectField with Pre-selected Value */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Pre-selected Value</h3>
            <Select
              label="Default Selection"
              options={[
                { label: 'Option A', value: 'a' },
                { label: 'Option B', value: 'b' },
                { label: 'Option C', value: 'c' },
              ]}
              defaultValue="b"
              placeholder="Select an option"
            />
          </div>

          {/* SelectField with Disabled Option */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Disabled Option</h3>
            <Select
              label="Role"
              options={[
                { label: 'Admin', value: 'admin', disabled: true },
                { label: 'Developer', value: 'developer' },
                { label: 'Client', value: 'client' },
              ]}
              placeholder="Select a role"
              helperText="Admin role is disabled"
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Cards Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Cards</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card description goes here</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                This is the card content area where you can put any content.
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="default">Action</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Another Card</CardTitle>
              <CardDescription>With different content</CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                Cards are versatile containers for grouping related content.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Dialog Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dialog</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>
                This is a dialog description. Dialogs are great for
                confirmations and forms.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>Dialog content goes here.</p>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="default" onClick={() => setIsDialogOpen(false)}>
                Confirm
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <Separator />

      {/* Dropdown Menu Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Dropdown Menu</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              Open Menu
              <Icon name="chevron-down" size="sm" className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Menu Label</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
            <DropdownMenuItem>Item 3</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <Separator />

      {/* Avatar Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Avatars</h2>
        <div className="flex gap-4">
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
        </div>
      </section>

      <Separator />

      {/* Spinner Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Spinner</h2>
        <div className="flex gap-4">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </section>

      <Separator />

      {/* MemberPicker Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Member Picker</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Single Select</Label>
            <MemberPicker
              value={selectedMember}
              options={mockUsers}
              onChange={(value) => setSelectedMember(value as string)}
              placeholder="Select a member..."
            />
          </div>

          <div className="space-y-2">
            <Label>Multi Select</Label>
            <MemberPicker
              value={selectedMembers}
              options={mockUsers}
              multiple
              onChange={(value) => setSelectedMembers(value as string[])}
              placeholder="Select members..."
            />
          </div>

          <div className="space-y-2">
            <Label>Disabled</Label>
            <MemberPicker
              value=""
              options={mockUsers}
              onChange={() => {}}
              placeholder="This is disabled"
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>No members to select</Label>
            <MemberPicker
              value=""
              options={[]}
              onChange={() => {}}
              placeholder="Select a member..."
            />
          </div>
        </div>
      </section>

      <Separator />

      {/* Empty State Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Empty State</h2>
        <EmptyState
          title="No items found"
          message="There are no items to display at the moment."
          action={
            <Button variant="default">
              <Icon name="plus" size="sm" className="mr-2" />
              Create New
            </Button>
          }
        />
      </section>
    </div>
  );
}
