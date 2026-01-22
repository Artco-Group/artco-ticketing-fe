import { Button } from './Button/Button';

export default function TestingPage() {
  return (
    <div className="flex min-h-screen flex-col gap-8 bg-slate-50 p-8 text-slate-900">
      <h1 className="text-2xl font-bold">Button Playground</h1>

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
    </div>
  );
}
