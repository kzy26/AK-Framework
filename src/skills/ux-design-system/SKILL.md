# UX Design System Skill

> Professional UI/UX Standards for Web Applications

## Capability

This skill provides knowledge of:
- Design system principles (typography, color, spacing)
- shadcn/ui component library patterns
- Tailwind CSS utility patterns
- Responsive design techniques
- Accessibility standards (WCAG 2.1 AA)
- Thai language UI considerations

## Design Tokens

### Typography Scale
```
text-xs    : 12px  - Captions, labels
text-sm    : 14px  - Body text, table cells
text-base  : 16px  - Default, form inputs
text-lg    : 18px  - Emphasized text
text-xl    : 20px  - Card titles
text-2xl   : 24px  - Section headings
text-3xl   : 30px  - Page titles
text-4xl   : 36px  - Hero text
```

### Font Weights
```
font-normal    : 400 - Body text
font-medium    : 500 - Labels, navigation
font-semibold  : 600 - Subtitles, card headers
font-bold      : 700 - Page titles, emphasis
```

### Spacing System (8px Grid)
```
space-1  : 4px   - Tight gaps (icon + text)
space-2  : 8px   - Compact spacing
space-3  : 12px  - Default gap
space-4  : 16px  - Card padding, form gaps
space-6  : 24px  - Section padding
space-8  : 32px  - Major sections
space-12 : 48px  - Page sections
space-16 : 64px  - Hero sections
```

### Color System (shadcn/ui CSS Variables)
```
--background       : Page background
--foreground       : Primary text
--card             : Card background
--card-foreground  : Card text
--primary          : Brand color (CTAs)
--primary-foreground : Text on primary
--secondary        : Secondary actions
--muted            : Subtle backgrounds
--muted-foreground : Secondary text
--accent           : Hover highlights
--destructive      : Delete/danger
--border           : Borders
--ring             : Focus rings
```

### Semantic Colors
```
Success : text-green-600 bg-green-50 border-green-200
Warning : text-amber-600 bg-amber-50 border-amber-200
Error   : text-red-600 bg-red-50 border-red-200
Info    : text-blue-600 bg-blue-50 border-blue-200
```

## Component Patterns

### Page Layout
```tsx
<div className="container mx-auto py-6 space-y-6">
  {/* Page Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold">Page Title</h1>
      <p className="text-muted-foreground">Description</p>
    </div>
    <Button>Action</Button>
  </div>

  {/* Content */}
  <Card>
    <CardHeader>
      <CardTitle>Section</CardTitle>
    </CardHeader>
    <CardContent>
      {/* content */}
    </CardContent>
  </Card>
</div>
```

### Data Table
```tsx
<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <CardTitle>Items</CardTitle>
      <div className="flex gap-2">
        <Input placeholder="ค้นหา..." className="w-64" />
        <Button>เพิ่มรายการ</Button>
      </div>
    </div>
  </CardHeader>
  <CardContent>
    <Table>
      <TableHeader>...</TableHeader>
      <TableBody>...</TableBody>
    </Table>
    <Pagination />
  </CardContent>
</Card>
```

### Form Pattern
```tsx
<Card>
  <CardHeader>
    <CardTitle>Create Item</CardTitle>
  </CardHeader>
  <CardContent>
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="ชื่อ" required />
        <FormField label="อีเมล" required />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline">ยกเลิก</Button>
        <Button type="submit">บันทึก</Button>
      </div>
    </form>
  </CardContent>
</Card>
```

## Thai UI Conventions

### Button Labels
```
Create  : สร้าง / เพิ่ม
Save    : บันทึก
Cancel  : ยกเลิก
Delete  : ลบ
Edit    : แก้ไข
Search  : ค้นหา
Filter  : กรอง
Export  : ส่งออก
Import  : นำเข้า
Back    : กลับ
Next    : ถัดไป
Confirm : ยืนยัน
```

### Status Labels
```
Active   : ใช้งาน    (green badge)
Inactive : ไม่ใช้งาน  (gray badge)
Pending  : รอดำเนินการ (amber badge)
Success  : สำเร็จ     (green badge)
Failed   : ล้มเหลว   (red badge)
```

### Navigation
```
Dashboard  : แดชบอร์ด
Users      : ผู้ใช้งาน
Settings   : ตั้งค่า
Reports    : รายงาน
Logout     : ออกจากระบบ
```

## Accessibility Checklist

- Contrast ratio >= 4.5:1 for text
- Contrast ratio >= 3:1 for large text
- Focus visible ring on all interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- aria-label on icon-only buttons
- Form labels associated with inputs
- Error messages linked to fields
- Skip to main content link
- Touch targets >= 44x44px
