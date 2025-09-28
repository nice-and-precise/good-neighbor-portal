# 🏗️ Technical Architecture Guide

> **Navigation**: [🏠 Home](../README.md) → [📖 Documentation Hub](../README.md#-documentation-hub) → Architecture

<div align="center">

**System Design & Technical Overview**

[![Architecture Version](https://img.shields.io/badge/Architecture-v2.1-blue?style=flat-square)](.) 
[![PHP 8.1+](https://img.shields.io/badge/PHP-8.1+-777BB4?style=flat-square&logo=php)](https://php.net) 
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=flat-square&logo=sqlite)](https://sqlite.org)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla-F7DF1E?style=flat-square&logo=javascript)](https://developer.mozilla.org)

*Last Updated: 2024-12-19 | For: Developers, Architects*

</div>

---

## 📋 Table of Contents

- [🎯 System Overview](#-system-overview)
- [🏗️ Architecture Layers](#️-architecture-layers)
- [🗃️ Database Design](#️-database-design)
- [🔌 API Architecture](#-api-architecture)
- [🌐 Frontend Architecture](#-frontend-architecture)
- [🔒 Security Architecture](#-security-architecture)
- [🚀 Deployment Architecture](#-deployment-architecture)
- [📊 Performance Considerations](#-performance-considerations)
- [🔗 Related Documentation](#-related-documentation)

---

## 🎯 System Overview

```mermaid
graph TB
    subgraph "Client Layer 🌐"
        UI[Web Browser<br/>📱 Mobile & Desktop]
        PWA[Progressive Web App<br/>🔄 Offline Capable]
    end
    
    subgraph "Application Layer 🔧"
        SPA[Single Page Application<br/>⚡ Vanilla JavaScript]
        Router[Hash Router<br/>🗺️ Client-side Navigation]
        I18n[Internationalization<br/>🌍 EN/ES Support]
    end
    
    subgraph "API Layer 🔌"
        Auth[Authentication<br/>🔐 Magic Links]
        CRUD[CRUD Operations<br/>📊 Data Management]
        Staff[Staff Operations<br/>👥 Admin Functions]
        Export[CSV Export<br/>📈 Reporting]
    end
    
    subgraph "Business Logic 📋"
        Config[Configuration<br/>⚙️ Environment]
        Validation[Input Validation<br/>✅ Data Integrity]
        Session[Session Management<br/>🍪 State Persistence]
        CSRF[CSRF Protection<br/>🛡️ Security]
    end
    
    subgraph "Data Layer 💾"
        SQLite[(SQLite Database<br/>📁 File-based)]
        Schema[Multi-Tenant Schema<br/>🏢 Isolated Data]
        Seed[Demo Data<br/>🌱 Test Content]
    end
    
    UI --> SPA
    PWA --> SPA
    SPA --> Router
    SPA --> I18n
    Router --> Auth
    Router --> CRUD
    Router --> Staff
    Router --> Export
    Auth --> Config
    CRUD --> Validation
    Staff --> Session
    Export --> CSRF
    Config --> SQLite
    Validation --> SQLite
    Session --> SQLite
    CSRF --> SQLite
    SQLite --> Schema
    SQLite --> Seed
    
    style UI fill:#e3f2fd
    style SPA fill:#f1f8e9
    style Auth fill:#fff3e0
    style SQLite fill:#fce4ec
```

### 🎯 Design Principles

| Principle | Implementation | Benefit |
|:----------|:---------------|:--------|
| **🔄 Offline-First** | SQLite + Local Session | Reliable demo environment |
| **📱 Mobile-First** | Responsive CSS + Touch targets | Accessible on all devices |
| **🏢 Multi-Tenant** | Tenant-scoped queries | Scalable SaaS architecture |
| **🌍 Internationalization** | JSON-based translations | Global market ready |
| **🔒 Security-First** | CSRF + Input validation | Production-ready security |
| **⚡ Performance** | Vanilla JS + Minimal footprint | Fast loading times |

---

## 🏗️ Architecture Layers

### 🌐 Presentation Layer

```mermaid
graph LR
    subgraph "Frontend Components"
        HTML[📄 index.html<br/>Semantic Structure]
        CSS[🎨 Responsive Styles<br/>Mobile-First Design]
        JS[⚡ app.js<br/>SPA Logic]
    end
    
    subgraph "User Interface"
        Auth[🔐 Authentication<br/>Magic Link Flow]
        Dashboard[📊 Dashboard<br/>Resident Portal]
        Requests[🎫 Service Requests<br/>CRUD Interface]
        Billing[💳 Billing Portal<br/>Payment Demo]
        Staff[👥 Staff Queue<br/>Admin Interface]
        I18n[🌍 Language Toggle<br/>EN/ES Switch]
    end
    
    HTML --> Auth
    CSS --> Dashboard
    JS --> Requests
    HTML --> Billing
    CSS --> Staff
    JS --> I18n
    
    style HTML fill:#e3f2fd
    style CSS fill:#f1f8e9
    style JS fill:#fff3e0
```

**Key Technologies:**
- **HTML5**: Semantic markup with ARIA accessibility
- **CSS3**: Flexbox/Grid layouts with responsive design
- **Vanilla JavaScript**: No framework dependencies for minimal footprint
- **Hash Router**: Client-side navigation for SPA behavior

### 🔧 Application Layer

```mermaid
graph TB
    subgraph "Core Services"
        Router[🗺️ Hash Router<br/>URL Management]
        State[🔄 State Management<br/>Client-side State]
        API[🔌 API Client<br/>HTTP Communication]
        Utils[🛠️ Utilities<br/>Helper Functions]
    end
    
    subgraph "Feature Modules"
        AuthModule[🔐 Authentication Module]
        DashboardModule[📊 Dashboard Module]
        RequestModule[🎫 Request Module]
        BillingModule[💳 Billing Module]
        StaffModule[👥 Staff Module]
        I18nModule[🌍 i18n Module]
    end
    
    Router --> AuthModule
    State --> DashboardModule
    API --> RequestModule
    Utils --> BillingModule
    Router --> StaffModule
    State --> I18nModule
    
    style Router fill:#e8f5e8
    style API fill:#fff3e0
```

**Design Patterns:**
- **Module Pattern**: Isolated feature modules
- **Observer Pattern**: Event-driven state updates
- **Strategy Pattern**: Pluggable validation rules
- **Factory Pattern**: Dynamic component creation

### 🔌 Backend Layer

```mermaid
graph LR
    subgraph "PHP Classes"
        Config[⚙️ Config.php<br/>Environment Management]
        Db[💾 Db.php<br/>Database Abstraction]
        Http[🌐 Http.php<br/>Request/Response]
        Util[🛠️ Util.php<br/>Common Utilities]
        Validator[✅ Validator.php<br/>Input Validation]
    end
    
    subgraph "API Endpoints"
        AuthAPI[🔐 Authentication<br/>Login/Logout]
        DataAPI[📊 Data Access<br/>CRUD Operations]
        StaffAPI[👥 Staff Operations<br/>Admin Functions]
        ExportAPI[📈 Export<br/>CSV Generation]
        I18nAPI[🌍 Localization<br/>Language Switch]
    end
    
    Config --> AuthAPI
    Db --> DataAPI
    Http --> StaffAPI
    Util --> ExportAPI
    Validator --> I18nAPI
    
    style Config fill:#f1f8e9
    style AuthAPI fill:#e3f2fd
```

---

## 🗃️ Database Design

### 📊 Entity Relationship Diagram

```mermaid
erDiagram
    TENANTS {
        string slug PK
        string name
        timestamp created_at
    }
    
    USERS {
        int id PK
        string tenant_id FK
        string email
        string role
        timestamp created_at
    }
    
    NEIGHBORHOODS {
        int id PK
        string tenant_id FK
        string name
        string description
    }
    
    ADDRESSES {
        int id PK
        string tenant_id FK
        int neighborhood_id FK
        string street_address
        string city
        string state
        string zip_code
    }
    
    SERVICE_REQUESTS {
        int id PK
        string tenant_id FK
        int user_id FK
        int address_id FK
        string category
        string description
        string status
        timestamp created_at
        timestamp updated_at
    }
    
    BILLING_CHARGES {
        int id PK
        string tenant_id FK
        int user_id FK
        int amount_cents
        string description
        string status
        timestamp created_at
    }
    
    MAGIC_LINKS {
        int id PK
        string tenant_id FK
        string email
        string token
        timestamp expires_at
        timestamp used_at
    }
    
    STAFF_NOTES {
        int id PK
        string tenant_id FK
        int request_id FK
        string staff_name
        string note
        timestamp created_at
    }
    
    TENANTS ||--o{ USERS : has
    TENANTS ||--o{ NEIGHBORHOODS : contains
    TENANTS ||--o{ ADDRESSES : manages
    NEIGHBORHOODS ||--o{ ADDRESSES : includes
    USERS ||--o{ SERVICE_REQUESTS : creates
    ADDRESSES ||--o{ SERVICE_REQUESTS : located_at
    USERS ||--o{ BILLING_CHARGES : owes
    SERVICE_REQUESTS ||--o{ STAFF_NOTES : has
    TENANTS ||--o{ MAGIC_LINKS : issues
```

### 🏢 Multi-Tenancy Strategy

```mermaid
graph TB
    subgraph "Tenant Isolation"
        A[🏢 Tenant A<br/>Willmar, MN]
        B[🏢 Tenant B<br/>Kandiyohi, MN]
    end
    
    subgraph "Data Separation"
        A --> A1[👥 Users A]
        A --> A2[🏘️ Neighborhoods A]
        A --> A3[🎫 Requests A]
        A --> A4[💳 Billing A]
        
        B --> B1[👥 Users B]
        B --> B2[🏘️ Neighborhoods B]
        B --> B3[🎫 Requests B]
        B --> B4[💳 Billing B]
    end
    
    subgraph "Query Filtering"
        Filter[🔍 tenant_id Filter<br/>All Queries Scoped]
    end
    
    A1 --> Filter
    A2 --> Filter
    B1 --> Filter
    B2 --> Filter
    
    style A fill:#e3f2fd
    style B fill:#f1f8e9
    style Filter fill:#fff3e0
```

**Implementation Details:**
- **Row-Level Security**: Every query includes `tenant_id` filter
- **Data Isolation**: Complete separation between tenants
- **Demo Safety**: Tenant switching in UI for demonstration
- **Scalability**: Ready for production multi-tenancy

---

## 🔌 API Architecture

### 🌐 RESTful Endpoints

```mermaid
graph LR
    subgraph "Authentication 🔐"
        A1[POST /api/auth_request.php<br/>Request Magic Link]
        A2[POST /api/auth_verify.php<br/>Verify Token]
        A3[POST /api/logout.php<br/>End Session]
        A4[GET /api/session.php<br/>Session Status]
    end
    
    subgraph "Data Operations 📊"
        D1[GET /api/dashboard.php<br/>User Dashboard]
        D2[GET /api/recent_activity.php<br/>Activity Feed]
        D3[GET /api/tenants.php<br/>Available Tenants]
        D4[POST /api/i18n_switch.php<br/>Language Toggle]
    end
    
    subgraph "Service Requests 🎫"
        R1[POST /api/request_create.php<br/>Create Request]
        R2[GET /api/request_get.php<br/>Get Request Details]
        R3[GET /api/request_notes.php<br/>Get Request Notes]
        R4[POST /api/request_update.php<br/>Update Status]
        R5[POST /api/request_note_add.php<br/>Add Note]
    end
    
    subgraph "Staff Operations 👥"
        S1[GET /api/staff_queue.php<br/>Request Queue]
        S2[GET /api/billing_get.php<br/>Billing Details]
        S3[POST /api/pay_demo.php<br/>Demo Payment]
        S4[GET /api/csv_export.php<br/>CSV Export]
    end
    
    subgraph "Utilities 🛠️"
        U1[GET /api/csrf.php<br/>CSRF Token]
        U2[GET /api/diag.php<br/>System Diagnostics]
        U3[GET /api/ping.php<br/>Health Check]
    end
    
    style A1 fill:#e3f2fd
    style D1 fill:#f1f8e9
    style R1 fill:#fff3e0
    style S1 fill:#fce4ec
    style U1 fill:#e8f5e8
```

### 🔒 Security Layer

```mermaid
sequenceDiagram
    participant C as Client
    participant A as API
    participant S as Session Store
    participant D as Database
    
    Note over C,D: Authentication Flow
    C->>A: 1. Request CSRF Token
    A->>C: 2. Return CSRF Token
    C->>A: 3. POST auth_request + CSRF
    A->>A: 4. Validate CSRF
    A->>D: 5. Create Magic Link
    A->>C: 6. Return Token (Demo)
    C->>A: 7. POST auth_verify + Token
    A->>D: 8. Validate Token
    A->>S: 9. Create Session
    A->>C: 10. Success Response
    
    Note over C,D: Authenticated Request Flow
    C->>A: 11. API Request + Session
    A->>S: 12. Validate Session
    A->>A: 13. Check CSRF (if POST)
    A->>D: 14. Execute Query with tenant_id
    A->>C: 15. Return Data
```

**Security Measures:**
- **🛡️ CSRF Protection**: Required for all state-changing operations
- **🔐 Session Management**: PHP sessions with fallback headers
- **✅ Input Validation**: Server-side validation for all inputs
- **🏢 Tenant Isolation**: Automatic tenant_id filtering
- **⏰ Magic Link Expiry**: Time-limited authentication tokens

---

## 🌐 Frontend Architecture

### ⚡ Single Page Application Flow

```mermaid
stateDiagram-v2
    [*] --> Init
    Init --> Loading : DOM Ready
    Loading --> Unauthenticated : No Session
    Loading --> Authenticated : Valid Session
    
    Unauthenticated --> AuthForm : Show Login
    AuthForm --> RequestToken : Submit Email
    RequestToken --> VerifyToken : Token Generated
    VerifyToken --> Authenticated : Valid Token
    VerifyToken --> AuthForm : Invalid Token
    
    Authenticated --> Dashboard : Load Data
    Dashboard --> RequestDetail : Hash Route Change
    Dashboard --> BillingDetail : Hash Route Change
    Dashboard --> StaffQueue : Staff Access
    
    RequestDetail --> Dashboard : Back Navigation
    BillingDetail --> Dashboard : Back Navigation
    StaffQueue --> Dashboard : Back Navigation
    
    Authenticated --> Unauthenticated : Logout
```

### 🎨 Component Architecture

```mermaid
graph TB
    subgraph "App Shell 🏠"
        Shell[🏠 Application Shell<br/>Navigation & Layout]
        Header[📊 Header Component<br/>Title & Status]
        Main[📋 Main Content Area<br/>Dynamic Views]
        Footer[ℹ️ Footer Component<br/>Language Toggle]
    end
    
    subgraph "Feature Components 🔧"
        Auth[🔐 Authentication Form<br/>Login Interface]
        Dash[📊 Dashboard Grid<br/>Card Layout]
        Request[🎫 Request Form<br/>Service Requests]
        Staff[👥 Staff Queue<br/>Admin Interface]
        Billing[💳 Billing Portal<br/>Payment Interface]
    end
    
    subgraph "Utility Components ⚙️"
        Router[🗺️ Hash Router<br/>Navigation Logic]
        I18n[🌍 i18n Manager<br/>Translation Service]
        State[🔄 State Manager<br/>Application State]
        API[🔌 API Client<br/>HTTP Service]
    end
    
    Shell --> Auth
    Header --> Dash
    Main --> Request
    Footer --> Staff
    Shell --> Billing
    
    Auth --> Router
    Dash --> I18n
    Request --> State
    Staff --> API
    
    style Shell fill:#e3f2fd
    style Auth fill:#f1f8e9
    style Router fill:#fff3e0
```

---

## 🚀 Deployment Architecture

### 🌐 Development Environment

```mermaid
graph LR
    subgraph "Local Development 💻"
        Dev[👩‍💻 Developer Machine]
        PHP[🔧 PHP 8.1+ Server]
        SQLite[💾 SQLite Database]
        VS[📝 VS Code + Copilot]
    end
    
    subgraph "Development Tools 🛠️"
        Setup[⚙️ Setup Scripts<br/>PowerShell/Bash]
        Tests[🧪 Test Suite<br/>Smoke Tests]
        Lint[📋 Code Quality<br/>PHPStan]
    end
    
    Dev --> PHP
    PHP --> SQLite
    Dev --> VS
    
    Setup --> PHP
    Tests --> PHP
    Lint --> Dev
    
    style Dev fill:#e3f2fd
    style PHP fill:#f1f8e9
    style Setup fill:#fff3e0
```

### 🏗️ Production Ready Architecture

```mermaid
graph TB
    subgraph "Load Balancer 🔄"
        LB[⚖️ Load Balancer<br/>Traffic Distribution]
    end
    
    subgraph "Application Servers 🖥️"
        App1[🔧 PHP-FPM Server 1<br/>Application Logic]
        App2[🔧 PHP-FPM Server 2<br/>Application Logic]
        App3[🔧 PHP-FPM Server 3<br/>Application Logic]
    end
    
    subgraph "Database Layer 💾"
        Primary[🗄️ MySQL Primary<br/>Read/Write Operations]
        Replica[🗄️ MySQL Replica<br/>Read Operations]
        Backup[💿 Automated Backups<br/>Point-in-time Recovery]
    end
    
    subgraph "Cache Layer ⚡"
        Redis[🔴 Redis Cache<br/>Session & Data Cache]
        CDN[🌐 CDN<br/>Static Assets]
    end
    
    subgraph "Monitoring 📊"
        Logs[📝 Centralized Logging<br/>ELK Stack]
        Metrics[📈 Application Metrics<br/>Prometheus/Grafana]
        Alerts[🚨 Alert Manager<br/>Incident Response]
    end
    
    LB --> App1
    LB --> App2
    LB --> App3
    
    App1 --> Primary
    App2 --> Primary
    App3 --> Replica
    
    App1 --> Redis
    App2 --> Redis
    App3 --> Redis
    
    Primary --> Backup
    
    App1 --> Logs
    App2 --> Metrics
    App3 --> Alerts
    
    CDN --> LB
    
    style LB fill:#e3f2fd
    style Primary fill:#f1f8e9
    style Redis fill:#fff3e0
    style Logs fill:#fce4ec
```

---

## 📊 Performance Considerations

### ⚡ Frontend Performance

| Optimization | Implementation | Impact |
|:-------------|:---------------|:-------|
| **🗜️ Minimal Bundle** | Vanilla JS, no frameworks | < 50KB total |
| **🔄 Lazy Loading** | Hash-based route splitting | Faster initial load |
| **📱 Mobile First** | Responsive design patterns | Better mobile performance |
| **♿ Accessibility** | Semantic HTML + ARIA | Improved screen reader performance |
| **⚡ Critical CSS** | Inline essential styles | Reduced render blocking |

### 🔧 Backend Performance

```mermaid
graph LR
    subgraph "Database Optimization 💾"
        Indexes[📇 Strategic Indexes<br/>Query Optimization]
        Queries[🔍 Optimized Queries<br/>Minimal N+1]
        Pooling[🏊 Connection Pooling<br/>Resource Management]
    end
    
    subgraph "Caching Strategy ⚡"
        Session[🍪 Session Cache<br/>User State]
        Query[📊 Query Cache<br/>Repeated Results]
        Static[🗂️ Static Assets<br/>Long-term Cache]
    end
    
    subgraph "Resource Management 🔧"
        Memory[🧠 Memory Optimization<br/>Efficient Data Structures]
        CPU[⚙️ CPU Optimization<br/>Minimal Processing]
        IO[💾 I/O Optimization<br/>Batched Operations]
    end
    
    Indexes --> Session
    Queries --> Query
    Pooling --> Static
    
    Session --> Memory
    Query --> CPU
    Static --> IO
    
    style Indexes fill:#e3f2fd
    style Session fill:#f1f8e9
    style Memory fill:#fff3e0
```

### 📈 Scalability Metrics

> 📊 **Performance Targets**
> - **⚡ Page Load**: < 2 seconds on 3G
> - **🔄 API Response**: < 500ms average
> - **📱 Mobile Performance**: > 90 Lighthouse score
> - **♿ Accessibility**: WCAG 2.1 AA compliance
> - **🌍 Multi-language**: < 100ms language switch

---

## 🔗 Related Documentation

### 📚 Internal References

| Document | Purpose | Relevance |
|:---------|:--------|:----------|
| [⚙️ Development Guide](DEVELOPMENT.md) | Setup and coding standards | Implementation details |
| [🔌 API Reference](API.md) | Endpoint documentation | API specifications |
| [📖 User Guide](USER-GUIDE.md) | End-user instructions | User workflows |
| [🚀 Deployment Guide](DEPLOYMENT.md) | Production deployment | Infrastructure setup |
| [❓ Troubleshooting](troubleshooting.md) | Common issues | Problem resolution |

### 🌐 External References

- [PHP 8.1 Documentation](https://www.php.net/docs.php) - Language reference
- [SQLite Documentation](https://www.sqlite.org/docs.html) - Database engine
- [Mermaid Documentation](https://mermaid-js.github.io/mermaid/) - Diagram syntax
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility standards
- [MDN Web Docs](https://developer.mozilla.org/) - Web standards reference

---

<div align="center">

**🏗️ Architecture Guide Complete**

For questions or clarifications, see [📖 Documentation Hub](../README.md#-documentation-hub)

*Maintained by the Good Neighbor Portal team*

</div>