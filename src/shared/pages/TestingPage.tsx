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
  Switch,
} from '@/shared/components/ui';
import { StatusIcon, PriorityIcon } from '@/shared/components/ui/BadgeIcons';

export default function TestingPage() {
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="container mx-auto space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold">UI Components Testing Page</h1>
        <p className="text-muted-foreground mt-2">
          A comprehensive showcase of all available UI components
        </p>
      </div>

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
                icon={<PriorityIcon filledBars={4} variant="red" />}
              >
                Critical
              </Badge>
              <Badge
                variant="orange"
                icon={<PriorityIcon filledBars={3} variant="orange" />}
              >
                High
              </Badge>
              <Badge
                variant="yellow"
                icon={<PriorityIcon filledBars={2} variant="yellow" />}
              >
                Medium
              </Badge>
              <Badge
                variant="green"
                icon={<PriorityIcon filledBars={1} variant="green" />}
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
                icon={<StatusIcon fillPercent={10} variant="blue" />}
              >
                New
              </Badge>
              <Badge
                variant="orange"
                icon={<StatusIcon fillPercent={30} variant="orange" />}
              >
                Open
              </Badge>
              <Badge
                variant="yellow"
                icon={<StatusIcon fillPercent={50} variant="yellow" />}
              >
                In Progress
              </Badge>
              <Badge
                variant="green"
                icon={<StatusIcon fillPercent={80} variant="green" />}
              >
                Resolved
              </Badge>
              <Badge
                variant="grey"
                icon={<StatusIcon fillPercent={100} variant="grey" />}
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
                icon={<PriorityIcon filledBars={4} variant="red" />}
              />
              <Badge
                variant="blue"
                icon={<StatusIcon fillPercent={10} variant="blue" />}
              />
              <Badge
                variant="green"
                icon={<StatusIcon fillPercent={80} variant="green" />}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sizes</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="orange"
                size="sm"
                icon={<PriorityIcon filledBars={3} variant="orange" />}
              >
                Small
              </Badge>
              <Badge
                variant="orange"
                size="md"
                icon={<PriorityIcon filledBars={3} variant="orange" />}
              >
                Medium
              </Badge>
              <Badge
                variant="orange"
                size="lg"
                icon={<PriorityIcon filledBars={3} variant="orange" />}
              >
                Large
              </Badge>
            </div>
          </div>
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

              <div className="flex items-center space-x-2">
                <Switch
                  id="test-switch"
                  checked={isSwitchOn}
                  onChange={(checked) => setIsSwitchOn(checked)}
                />
                <Label htmlFor="test-switch">Switch Label</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="test-select">Select</Label>
                <Select value={selectValue} onValueChange={setSelectValue}>
                  <SelectTrigger id="test-select">
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Checkbox and Switch Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Checkbox & Switch</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Checkbox</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="checkbox-1"
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    setIsChecked(checked as boolean)
                  }
                />
                <Label htmlFor="checkbox-1">Default Checkbox</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="checkbox-2" checked={true} disabled />
                <Label htmlFor="checkbox-2">Checked (Disabled)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="checkbox-3" checked={false} disabled />
                <Label htmlFor="checkbox-3">Unchecked (Disabled)</Label>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Switch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="switch-1"
                  checked={isSwitchOn}
                  onChange={(checked) => setIsSwitchOn(checked)}
                />
                <Label htmlFor="switch-1">Default Switch</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="switch-2" checked={true} disabled />
                <Label htmlFor="switch-2">On (Disabled)</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="switch-3" checked={false} disabled />
                <Label htmlFor="switch-3">Off (Disabled)</Label>
              </div>
            </div>
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
