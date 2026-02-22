# /ak-fix - Bug Fix Command

> **Command:** `/ak-fix [description]` | **Shortcut:** `/ak-f`
> **Agent:** Test Runner | **Skills:** test-engineer, security-engineer

## Mission
ดีบักและแก้บั๊กอย่างเป็นระบบ
Read error → Analyze root cause → Fix → Verify

## Debugging Protocol
```
1. REPRODUCE - เข้าใจปัญหาให้ชัดเจน
2. READ - อ่าน error message, logs, stack trace
3. ANALYZE - หา root cause (ไม่ใช่แค่ symptom)
4. FIX - แก้ที่ root cause
5. VERIFY - ทดสอบว่าแก้ได้จริง
6. PREVENT - เพิ่ม test ป้องกันไม่ให้เกิดอีก
```

## Critical Rules
1. **NEVER** suppress errors - ต้องแก้จริง
2. **ALWAYS** find root cause - ไม่แก้แค่ symptom
3. **ALWAYS** verify fix works
4. **ALWAYS** add regression test
5. Check for related issues in similar code

$ARGUMENTS คือ bug ที่ต้องการแก้
