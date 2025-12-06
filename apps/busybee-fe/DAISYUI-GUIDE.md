# daisyUI Usage Guide

This guide covers how to use daisyUI components in the BusyBee frontend application with automatic light/dark mode support.

## Table of Contents

- [Configuration](#configuration)
- [Semantic Color System](#semantic-color-system)
- [Component Usage](#component-usage)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)
- [Available Components](#available-components)

## Configuration

daisyUI is configured in `src/styles.scss`:

```scss
@use 'tailwindcss';
@plugin "daisyui" {
  themes: light --default, dark --prefersdark;
  root: ':root';
  logs: true;
}
```

**Key settings:**
- `light --default`: Light theme is the default
- `dark --prefersdark`: Dark theme activates automatically based on user's system preferences
- This provides automatic light/dark mode support without additional code

## Semantic Color System

daisyUI uses semantic color names that automatically adapt between light and dark themes.

### Available Semantic Colors

**Brand Colors:**
- `primary` / `primary-content` - Primary brand color
- `secondary` / `secondary-content` - Secondary brand color
- `accent` / `accent-content` - Accent color for highlights

**Neutral & Base:**
- `neutral` / `neutral-content` - Neutral color for text and borders
- `base-100` - Page background
- `base-200` - Slightly darker/lighter than base-100
- `base-300` - Even darker/lighter
- `base-content` - Text color on base backgrounds

**Status Colors:**
- `info` / `info-content` - Informational messages
- `success` / `success-content` - Success states
- `warning` / `warning-content` - Warning states
- `error` / `error-content` - Error states

### Color Usage

All Tailwind utility classes work with semantic colors:

```html
<!-- Backgrounds -->
<div class="bg-primary">Primary background</div>
<div class="bg-base-100">Base background</div>

<!-- Text -->
<p class="text-primary">Primary text</p>
<p class="text-base-content">Base content text</p>

<!-- Borders -->
<div class="border border-primary">Primary border</div>

<!-- With opacity -->
<p class="text-base-content/50">50% opacity text</p>
<div class="bg-primary/10">10% opacity background</div>
```

## Component Usage

### Buttons

```html
<!-- Basic buttons -->
<button class="btn">Default</button>
<button class="btn btn-primary">Primary</button>
<button class="btn btn-secondary">Secondary</button>
<button class="btn btn-accent">Accent</button>

<!-- Button sizes -->
<button class="btn btn-lg">Large</button>
<button class="btn btn-sm">Small</button>
<button class="btn btn-xs">Extra Small</button>

<!-- Button states -->
<button class="btn btn-primary btn-disabled">Disabled</button>
<button class="btn btn-primary loading">Loading</button>

<!-- Button variants -->
<button class="btn btn-outline btn-primary">Outline</button>
<button class="btn btn-ghost">Ghost</button>
<button class="btn btn-link">Link</button>
```

### Cards

```html
<div class="card bg-base-100 shadow-xl">
  <figure>
    <img src="image.jpg" alt="Image" />
  </figure>
  <div class="card-body">
    <h2 class="card-title">Card Title</h2>
    <p>Card content goes here</p>
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Action</button>
    </div>
  </div>
</div>
```

### Alerts

```html
<div class="alert alert-info">
  <span>Info message</span>
</div>

<div class="alert alert-success">
  <span>Success message</span>
</div>

<div class="alert alert-warning">
  <span>Warning message</span>
</div>

<div class="alert alert-error">
  <span>Error message</span>
</div>
```

### Form Inputs

```html
<!-- Text Input -->
<input type="text" placeholder="Type here" class="input input-bordered w-full" />
<input type="text" placeholder="Primary" class="input input-bordered input-primary" />

<!-- Textarea -->
<textarea class="textarea textarea-bordered" placeholder="Bio"></textarea>

<!-- Select -->
<select class="select select-bordered w-full">
  <option disabled selected>Pick one</option>
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Checkbox -->
<input type="checkbox" class="checkbox" />
<input type="checkbox" class="checkbox checkbox-primary" />

<!-- Radio -->
<input type="radio" name="radio-1" class="radio" />
<input type="radio" name="radio-1" class="radio radio-primary" />

<!-- Toggle -->
<input type="checkbox" class="toggle" />
<input type="checkbox" class="toggle toggle-primary" />
```

### Modal

```html
<!-- Modal trigger -->
<button class="btn" onclick="my_modal.showModal()">Open Modal</button>

<!-- Modal -->
<dialog id="my_modal" class="modal">
  <div class="modal-box">
    <h3 class="font-bold text-lg">Modal Title</h3>
    <p class="py-4">Modal content</p>
    <div class="modal-action">
      <form method="dialog">
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>
```

### Navigation

```html
<!-- Navbar -->
<div class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost text-xl">BusyBee</a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal px-1">
      <li><a>Link</a></li>
      <li><a>Link</a></li>
    </ul>
  </div>
</div>

<!-- Menu -->
<ul class="menu bg-base-200 rounded-box w-56">
  <li><a>Item 1</a></li>
  <li><a>Item 2</a></li>
  <li>
    <details>
      <summary>Parent</summary>
      <ul>
        <li><a>Submenu 1</a></li>
        <li><a>Submenu 2</a></li>
      </ul>
    </details>
  </li>
</ul>

<!-- Tabs -->
<div class="tabs">
  <a class="tab">Tab 1</a>
  <a class="tab tab-active">Tab 2</a>
  <a class="tab">Tab 3</a>
</div>
```

## Best Practices

### 1. Always Use Semantic Colors

**❌ AVOID: Hardcoded colors requiring manual dark mode**
```html
<div class="bg-zinc-100 dark:bg-zinc-900 text-black dark:text-white">
  Content
</div>
```

**✅ GOOD: Semantic colors with auto dark mode**
```html
<div class="bg-base-100 text-base-content">
  Content
</div>
```

### 2. Use Content Colors with Brand Colors

When using brand colors for backgrounds, always use matching `-content` colors for text:

```html
<!-- ✅ GOOD: Ensures readable contrast -->
<div class="bg-primary text-primary-content">
  Primary background with matching text
</div>

<!-- ❌ AVOID: May have poor contrast -->
<div class="bg-primary text-base-content">
  Might not be readable
</div>
```

### 3. Leverage Base Color Scale

Use the base color scale for layering:

```html
<div class="bg-base-100">        <!-- Page background -->
  <div class="bg-base-200">      <!-- Card/section background -->
    <div class="bg-base-300">    <!-- Inner element -->
      Content
    </div>
  </div>
</div>
```

### 4. Use Opacity for Subtle Effects

```html
<!-- Muted text -->
<p class="text-base-content/50">Secondary text</p>
<p class="text-base-content/70">Tertiary text</p>

<!-- Subtle backgrounds -->
<div class="bg-primary/10">Light primary tint</div>
<div class="bg-error/20">Light error background</div>
```

### 5. Component Composition

Build complex components by combining simple ones:

```html
<div class="card bg-base-100 shadow-xl">
  <div class="card-body">
    <h2 class="card-title">
      Task Title
      <div class="badge badge-secondary">New</div>
    </h2>
    <p class="text-base-content/70">Task description</p>
    <div class="card-actions justify-end">
      <button class="btn btn-sm btn-primary">Edit</button>
      <button class="btn btn-sm btn-ghost">Delete</button>
    </div>
  </div>
</div>
```

## Common Patterns

### Loading States

```html
<!-- Loading button -->
<button class="btn btn-primary loading">Loading</button>

<!-- Loading spinner -->
<span class="loading loading-spinner loading-lg"></span>

<!-- Skeleton loader -->
<div class="skeleton h-4 w-full"></div>
<div class="skeleton h-4 w-28"></div>
```

### Empty States

```html
<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">No tasks yet</h1>
      <p class="py-6">Get started by creating your first task</p>
      <button class="btn btn-primary">Create Task</button>
    </div>
  </div>
</div>
```

### Form with Validation

```html
<div class="form-control w-full">
  <label class="label">
    <span class="label-text">Email</span>
  </label>
  <input type="email"
         placeholder="email@example.com"
         class="input input-bordered w-full input-error" />
  <label class="label">
    <span class="label-text-alt text-error">Email is required</span>
  </label>
</div>
```

### Responsive Layout

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="card bg-base-100 shadow-xl">Card 1</div>
  <div class="card bg-base-100 shadow-xl">Card 2</div>
  <div class="card bg-base-100 shadow-xl">Card 3</div>
</div>
```

## Available Components

### Actions (6)
- Button, Dropdown, FAB/Speed Dial, Modal, Swap, Theme Controller

### Data Display (18)
- Accordion, Avatar, Badge, Card, Carousel, Chat Bubble, Collapse, Countdown, Diff, Hover 3D Card, Hover Gallery, Kbd, List, Stat, Status, Table, Text Rotate, Timeline

### Navigation (8)
- Breadcrumbs, Dock, Link, Menu, Navbar, Pagination, Steps, Tabs

### Feedback (8)
- Alert, Loading, Progress, Radial Progress, Skeleton, Toast, Tooltip

### Data Input (15)
- Calendar, Checkbox, Fieldset, File Input, Filter, Label, Radio, Range, Rating, Select, Text Input, Textarea, Toggle, Validator

### Layout (8)
- Divider, Drawer Sidebar, Footer, Hero, Indicator, Join, Mask, Stack

### Mockups (4)
- Browser, Code, Phone, Window

## Manual Theme Switching (Optional)

If you want to allow users to manually switch themes:

### Using data-theme attribute

```html
<!-- Force dark theme -->
<html data-theme="dark">

<!-- Force light theme -->
<html data-theme="light">
```

### TypeScript Theme Toggler (Angular)

```typescript
export class ThemeService {
  toggleTheme(): void {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }
}
```

## Resources

- [daisyUI Documentation](https://daisyui.com/docs/)
- [daisyUI Components](https://daisyui.com/components/)
- [daisyUI Themes](https://daisyui.com/docs/themes/)
- [daisyUI Colors](https://daisyui.com/docs/colors/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Notes

- Current version: daisyUI 5.5.8
- 65 components available
- Automatic light/dark mode support enabled
- No need to write `dark:` utility classes when using semantic colors
