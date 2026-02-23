# Business Context Skill

> Business Domain Analysis & Feature Detection

## Capability

This skill enables automatic detection of:
- Business type from user descriptions
- Standard features for each business type
- Thai market-specific requirements
- Must-have vs nice-to-have feature prioritization

## Business Type Detection

When user describes a project, detect the business type and auto-include standard features.

### E-Commerce
```
Keywords: ร้านค้า, shop, e-commerce, ขายสินค้า, สินค้าออนไลน์
Must-Have:
- Product catalog (CRUD + images + variants)
- Shopping cart
- Checkout flow
- Order management
- Payment integration
- User accounts
Should-Have:
- Search & filters
- Wishlist / favorites
- Reviews & ratings
- Inventory management
- Shipping tracking
- Reports & analytics
```

### F&B (Restaurant / Coffee)
```
Keywords: ร้านอาหาร, ร้านกาแฟ, restaurant, cafe, POS
Must-Have:
- POS system
- Menu management
- Order management
- Table management (if dine-in)
- Payment processing
- Daily reports
Should-Have:
- Inventory / stock
- Staff management
- Kitchen display
- Customer loyalty
- Delivery integration
```

### Payment / Fintech
```
Keywords: payment, เงิน, โอนเงิน, fintech, wallet, remittance
Must-Have:
- Transaction management
- Account / wallet management
- KYC verification
- Audit trail
- Reports & reconciliation
- Role-based access control
Should-Have:
- Multi-currency support
- Fee management
- Settlement system
- Notification system
- Export (CSV, PDF)
```

### Back-Office / Admin
```
Keywords: back-office, admin, ระบบหลังบ้าน, จัดการ
Must-Have:
- Dashboard with key metrics
- User management (CRUD + roles)
- Data tables with search/filter/sort
- CRUD operations for main entities
- Authentication & authorization
- Audit logs
Should-Have:
- Export functionality
- Bulk operations
- Notification system
- Settings/configuration
- Activity logs
```

### SaaS / Platform
```
Keywords: SaaS, platform, subscription, multi-tenant
Must-Have:
- Multi-tenant architecture
- Subscription / billing
- User & organization management
- Dashboard per organization
- API for integrations
- Onboarding flow
Should-Have:
- Usage metering
- Feature flags per plan
- Custom domain support
- Webhook system
- API documentation
```

### Booking / Reservation
```
Keywords: จอง, booking, reservation, appointment, นัดหมาย
Must-Have:
- Calendar / time slot management
- Booking flow
- Confirmation & reminders
- Cancellation policy
- Availability management
- Customer management
Should-Have:
- Payment integration
- Reviews & ratings
- Staff scheduling
- Multi-location
- Waitlist
```

## Feature Prioritization

### MoSCoW Method
```
Must Have  : Core features that define the product
Should Have: Important features that add significant value
Could Have : Nice-to-have features if time permits
Won't Have : Out of scope for current version
```

### Priority Order
```
1. Authentication & Authorization (always first)
2. Core CRUD operations (the main business entity)
3. Dashboard / overview page
4. Search, filter, sort capabilities
5. Export / reporting
6. Notifications
7. Settings & configuration
8. Analytics & insights
```

## Thai Market Considerations

```
- Thai language UI labels
- Thai date format (พ.ศ. optional, but ค.ศ. is standard in tech)
- Thai phone format (0x-xxxx-xxxx)
- Thai address structure (แขวง/ตำบล, เขต/อำเภอ, จังหวัด)
- Thai currency (฿ / บาท)
- PromptPay QR payment (if payment feature)
- LINE integration (if notification/messaging)
```
