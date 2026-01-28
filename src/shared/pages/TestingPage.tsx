import { useState } from 'react';
import {
  Button,
  Badge,
  Input,
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
} from '@/shared/components/ui';

export default function TestingPage() {
  const [inputValue, setInputValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [isChecked, setIsChecked] = useState(false);
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
        <div className="max-w-md space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-input">Input Field</Label>
            <Input
              id="test-input"
              placeholder="Enter text here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="test-textarea">Textarea</Label>
            <Textarea
              id="test-textarea"
              placeholder="Enter longer text here..."
              value={textareaValue}
              onChange={(e) => setTextareaValue(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="test-checkbox"
              checked={isChecked}
              onCheckedChange={(checked) => setIsChecked(checked as boolean)}
            />
            <Label htmlFor="test-checkbox">Checkbox Label</Label>
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
