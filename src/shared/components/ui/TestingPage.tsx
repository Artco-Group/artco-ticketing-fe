import { useState } from 'react';
import { Button } from './Button/Button';
import { Input } from './Input';
import { PasswordInput } from './PasswordInput';
import { Select } from './Select';
import { Checkbox } from './Checkbox';
import { Switch } from './Switch';

export default function TestingPage() {
  const [selectedValue, setSelectedValue] = useState<string>('option2');
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [indeterminateChecked, setIndeterminateChecked] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  return (
    <div className="flex min-h-screen flex-col gap-8 bg-slate-50 p-8 text-slate-900">
      <h1 className="text-2xl font-bold">UI Components Playground</h1>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Variants (md)</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Delete</Button>
          <Button
            variant="secondary"
            leftIcon={<span className="text-red-500">G</span>}
          >
            Continue with Google
          </Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small (sm)</Button>
          <Button size="md">Medium (md)</Button>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">States</h2>
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
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Input Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sizes</h3>
            <Input size="sm" placeholder="Small input" label="Small" />
            <Input size="md" placeholder="Medium input" label="Medium" />
            <Input size="lg" placeholder="Large input" label="Large" />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">States</h3>
            <Input placeholder="Default state" label="Default" />
            <Input
              placeholder="With helper text"
              label="With Helper Text"
              helperText="This is helpful information"
            />
            <Input
              placeholder="Error state"
              label="Error"
              error="This field is required"
            />
            <Input placeholder="Disabled input" label="Disabled" disabled />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">With Icons</h3>
            <Input
              placeholder="Enter your email"
              label="Email"
              leftIcon={<span>@</span>}
            />
            <Input
              placeholder="Enter text"
              label="With Right Icon"
              rightIcon={<span>👁</span>}
            />
            <Input
              placeholder="Search..."
              label="Search"
              leftIcon={<span>🔍</span>}
              rightIcon={<span>✕</span>}
            />
          </div>
        </div>
      </section>

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
            <h3 className="text-sm font-medium">Sizes</h3>
            <PasswordInput
              size="sm"
              placeholder="Small password"
              label="Small"
            />
            <PasswordInput
              size="md"
              placeholder="Medium password"
              label="Medium"
            />
            <PasswordInput
              size="lg"
              placeholder="Large password"
              label="Large"
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

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Select Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic</h3>
            <Select
              label="Category"
              placeholder="Select a category"
              options={['Bug', 'Feature Request', 'Question', 'Other']}
            />
            <Select
              label="Priority"
              placeholder="Select priority"
              options={[
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'urgent', label: 'Urgent' },
              ]}
            />
            <Select
              label="With Helper Text"
              placeholder="Select an option"
              helperText="Choose the best option for your needs"
              options={['Option 1', 'Option 2', 'Option 3']}
            />
            <Select
              label="With Error"
              placeholder="Select an option"
              error="This field is required"
              options={['Option 1', 'Option 2', 'Option 3']}
            />
            <Select
              label="Disabled"
              placeholder="Cannot select"
              disabled
              options={['Option 1', 'Option 2', 'Option 3']}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Sizes</h3>
            <Select
              size="sm"
              label="Small"
              placeholder="Select option"
              options={['Small 1', 'Small 2', 'Small 3']}
            />
            <Select
              size="md"
              label="Medium"
              placeholder="Select option"
              options={['Medium 1', 'Medium 2', 'Medium 3']}
            />
            <Select
              size="lg"
              label="Large"
              placeholder="Select option"
              options={['Large 1', 'Large 2', 'Large 3']}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Controlled</h3>
            <Select
              label="Controlled Select"
              placeholder="Select an option"
              value={selectedValue}
              options={[
                { value: 'option1', label: 'Option 1' },
                { value: 'option2', label: 'Option 2' },
                { value: 'option3', label: 'Option 3' },
              ]}
              onChange={(value) => {
                console.log('Selected:', value);
                setSelectedValue(value);
              }}
            />
            <p className="text-greyscale-600 text-sm">
              Selected: {selectedValue}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Checkbox Component</h2>
        <div className="flex max-w-md flex-col gap-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Basic</h3>
            <Checkbox label="Unchecked checkbox" />
            <Checkbox label="Checked checkbox" checked />
            <Checkbox
              label="Controlled checkbox"
              checked={checkboxChecked}
              onChange={(e) => setCheckboxChecked(e.target.checked)}
            />
            <Checkbox label="Disabled unchecked" disabled />
            <Checkbox label="Disabled checked" checked disabled />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Indeterminate</h3>
            <Checkbox
              label="Indeterminate checkbox"
              indeterminate
              checked={false}
            />
            <Checkbox
              label="Controlled indeterminate"
              indeterminate={indeterminateChecked}
              checked={false}
              onChange={(e) => setIndeterminateChecked(e.target.checked)}
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Without Label</h3>
            <div className="flex items-center gap-4">
              <Checkbox />
              <Checkbox checked />
              <Checkbox indeterminate />
              <Checkbox disabled />
            </div>
          </div>
        </div>
      </section>

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
    </div>
  );
}
