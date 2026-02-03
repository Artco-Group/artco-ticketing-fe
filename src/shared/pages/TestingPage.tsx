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
  Switch,
  FilterButton,
} from '@/shared/components/ui';
import { StatusIcon, PriorityIcon } from '@/shared/components/ui/BadgeIcons';
import { MemberPicker } from '@/shared/components/composite';
import { CommentForm } from '@/features/tickets/components/CommentForm';
import { CommentList } from '@/features/tickets/components/CommentList';
import type { Comment } from '@/types';

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

// Mock comment data
const mockComments: Comment[] = [
  {
    _id: '1',
    ticketId: 'ticket-1',
    authorId: {
      _id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@artco.com',
    },
    text: 'Ovo je prvi komentar na ovom tiketu. Trebamo provjeriti da li sve radi kako treba.',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  },
  {
    _id: '2',
    ticketId: 'ticket-1',
    authorId: {
      _id: '1',
      name: 'John Doe',
      email: 'john.doe@artco.com',
    },
    text: 'Slažem se, moramo biti pažljivi sa ovim. Primijetio sam par problema.',
    createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
  },
  {
    _id: '3',
    ticketId: 'ticket-1',
    authorId: {
      _id: '3',
      name: 'Bob Johnson',
      email: 'bob.johnson@artco.com',
    },
    text: 'Završio sam pregled koda. Sve izgleda dobro osim jedne sitnice koju treba popraviti.',
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
];

export default function TestingPage() {
  const [inputValue, setInputValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [textareaValue, setTextareaValue] = useState('');
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [selectValue, setSelectValue] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterValue, setFilterValue] = useState<string | null>(null);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [basicChecked, setBasicChecked] = useState(false);
  const [withLabelChecked, setWithLabelChecked] = useState(true);
  const [disabledChecked, setDisabledChecked] = useState(true);
  const [disabledUnchecked, setDisabledUnchecked] = useState(false);
  const [indeterminateState, setIndeterminateState] = useState(false);

  const [items, setItems] = useState([
    { id: 1, label: 'Item 1', checked: false },
    { id: 2, label: 'Item 2', checked: true },
    { id: 3, label: 'Item 3', checked: false },
  ]);

  // Comment components state
  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const currentUserId = '1'; // John Doe is the current user

  const allChecked = items.every((item) => item.checked);
  const someChecked = items.some((item) => item.checked) && !allChecked;

  // Handlers
  const handleSelectAll = (checked: boolean) => {
    setItems(items.map((item) => ({ ...item, checked })));
  };

  const handleItemChange = (id: number, checked: boolean) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, checked } : item))
    );
  };

  // Comment handlers
  const handleAddComment = (text: string) => {
    const newComment: Comment = {
      _id: `comment-${Date.now()}`,
      ticketId: 'ticket-1',
      authorId: {
        _id: currentUserId,
        name: 'John Doe',
        email: 'john.doe@artco.com',
      },
      text,
      createdAt: new Date().toISOString(),
    };
    setComments([...comments, newComment]);
  };

  const handleEditComment = (commentId: string, text: string) => {
    setComments(
      comments.map((comment) =>
        comment._id === commentId
          ? { ...comment, text, updatedAt: new Date().toISOString() }
          : comment
      )
    );
    setEditingCommentId(null);
  };

  const handleDeleteComment = (commentId: string) => {
    setComments(comments.filter((comment) => comment._id !== commentId));
  };

  const handleReply = (commentId: string) => {
    console.log('Reply to comment:', commentId);
    // In real implementation, this would open reply mode
  };

  // Helper function to format date for grouping
  const formatDateKey = (date: string | Date | undefined): string => {
    if (!date) return 'Unknown';
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const todayOnly = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const yesterdayOnly = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Today';
    } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString('en-GB');
    }
  };

  // Group comments by date
  const groupedComments = comments.reduce(
    (groups: { [key: string]: Comment[] }, comment) => {
      const dateKey = formatDateKey(comment.createdAt);
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(comment);
      return groups;
    },
    {}
  );

  // Check if a comment was edited
  const isCommentEdited = (comment: Comment): boolean => {
    return !!(
      comment.createdAt &&
      comment.updatedAt &&
      new Date(comment.createdAt).getTime() !==
        new Date(comment.updatedAt).getTime()
    );
  };

  // Get time display for a comment
  const getCommentTimeDisplay = (comment: Comment): string => {
    const edited = isCommentEdited(comment);

    if (edited && comment.updatedAt) {
      const time = new Date(comment.updatedAt).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return `Edited: ${time}`;
    }
    if (comment.createdAt) {
      return new Date(comment.createdAt).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return '—';
  };

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
        <h2 className="text-lg font-semibold">Badge Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">With PriorityIcon</h3>
            <div className="flex flex-wrap gap-2">
              <Badge icon={<PriorityIcon filledBars={4} variant="red" />}>
                Critical
              </Badge>
              <Badge icon={<PriorityIcon filledBars={3} variant="orange" />}>
                High
              </Badge>
              <Badge icon={<PriorityIcon filledBars={2} variant="yellow" />}>
                Medium
              </Badge>
              <Badge icon={<PriorityIcon filledBars={1} variant="green" />}>
                Low
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">With StatusIcon</h3>
            <div className="flex flex-wrap gap-2">
              <Badge icon={<StatusIcon fillPercent={10} variant="blue" />}>
                New
              </Badge>
              <Badge icon={<StatusIcon fillPercent={30} variant="orange" />}>
                Open
              </Badge>
              <Badge icon={<StatusIcon fillPercent={50} variant="yellow" />}>
                In Progress
              </Badge>
              <Badge icon={<StatusIcon fillPercent={80} variant="green" />}>
                Resolved
              </Badge>
              <Badge icon={<StatusIcon fillPercent={100} variant="grey" />}>
                Closed
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Icon Only</h3>
            <div className="flex flex-wrap gap-2">
              <Badge icon={<PriorityIcon filledBars={4} variant="red" />} />
              <Badge icon={<StatusIcon fillPercent={10} variant="blue" />} />
              <Badge icon={<StatusIcon fillPercent={80} variant="green" />} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sizes</h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                size="sm"
                icon={<PriorityIcon filledBars={3} variant="orange" />}
              >
                Small
              </Badge>
              <Badge
                size="md"
                icon={<PriorityIcon filledBars={3} variant="orange" />}
              >
                Medium
              </Badge>
              <Badge
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
                <Switch
                  id="test-switch"
                  checked={isSwitchOn}
                  onChange={setIsSwitchOn}
                />
                <Label htmlFor="test-switch">Switch Label</Label>
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

      {/* Checkbox and Switch Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Checkbox & Switch</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Basic States</h3>

              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Basic States</h3>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Basic (no label)</p>
                    <Checkbox
                      checked={basicChecked}
                      onCheckedChange={setBasicChecked}
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">With label</p>
                    <Checkbox
                      checked={withLabelChecked}
                      onCheckedChange={setWithLabelChecked}
                      label="Accept terms and conditions"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Disabled (checked)</p>
                    <Checkbox
                      checked={disabledChecked}
                      onCheckedChange={setDisabledChecked}
                      label="This is disabled and checked"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      Disabled (unchecked)
                    </p>
                    <Checkbox
                      checked={disabledUnchecked}
                      onCheckedChange={setDisabledUnchecked}
                      label="This is disabled and unchecked"
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Indeterminate state</p>
                    <Checkbox
                      checked={indeterminateState}
                      onCheckedChange={setIndeterminateState}
                      label="Indeterminate checkbox"
                      indeterminate
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Select All Example</h3>

                  <Checkbox
                    checked={allChecked}
                    indeterminate={someChecked}
                    onCheckedChange={handleSelectAll}
                    label="Select all items"
                  />

                  <div className="ml-6 space-y-2">
                    {items.map((item) => (
                      <Checkbox
                        key={item.id}
                        checked={item.checked}
                        onCheckedChange={(checked) =>
                          handleItemChange(item.id, checked)
                        }
                        label={item.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">Form Example</h3>
                  <form className="space-y-3">
                    <Checkbox label="Subscribe to newsletter" />
                    <Checkbox label="I agree to the privacy policy" />
                    <Checkbox label="Remember me on this device" />
                    <Checkbox label="Send me promotional emails" />
                  </form>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold">State Debug</h3>
                  <div className="rounded bg-gray-100 p-4 font-mono text-sm">
                    <p>Basic: {basicChecked ? 'checked' : 'unchecked'}</p>
                    <p>
                      With Label: {withLabelChecked ? 'checked' : 'unchecked'}
                    </p>
                    <p>
                      Select All:{' '}
                      {allChecked ? 'all' : someChecked ? 'some' : 'none'}
                    </p>
                    <p>
                      Items:{' '}
                      {JSON.stringify(
                        items.map((i) => ({ id: i.id, checked: i.checked }))
                      )}
                    </p>
                  </div>
                </div>
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
                  onChange={setIsSwitchOn}
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

      <Separator />

      {/* Comment Components Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Comment Components</h2>
        <p className="text-muted-foreground">
          CommentList and CommentForm with date grouping, reply functionality,
          and edit mode
        </p>

        <Card>
          <CardHeader>
            <CardTitle>Discussion</CardTitle>
            <CardDescription>
              Full-featured comment thread with date grouping and white gradient
              bubbles - Current user (John Doe) comments appear in blue on the
              right
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <CommentList
              comments={comments}
              groupedComments={groupedComments}
              currentUserId={currentUserId}
              onReply={handleReply}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              getCommentTimeDisplay={getCommentTimeDisplay}
            />

            <div className="border-t pt-4">
              {editingCommentId ? (
                <CommentForm
                  onSubmit={(text) => handleEditComment(editingCommentId, text)}
                  onCancel={() => setEditingCommentId(null)}
                  initialValue={
                    comments.find((c) => c._id === editingCommentId)?.text || ''
                  }
                  submitLabel="Sačuvaj"
                />
              ) : (
                <CommentForm onSubmit={handleAddComment} />
              )}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
