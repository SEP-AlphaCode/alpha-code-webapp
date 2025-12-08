# Screen Flow Documentation - Alpha Code Web Application

## 3. Functional Requirements

### 3.1 System Functional Overview

**System overview**: The Alpha Code Web Application is a comprehensive educational platform designed for teaching robotics and programming to children. The system manages multiple user roles including Parents, Children, Staff, and Administrators, each with specific functionalities and access levels.

**User Roles**:
- **Guest/Visitor**: Unauthenticated users who can view public content
- **Parent**: Manages children accounts, subscriptions, courses, and monitors progress
- **Child**: Takes courses, completes lessons, interacts with robots and activities
- **Staff**: Manages educational content including categories, courses, lessons, and sections
- **Admin**: Full system control including user management, settings, APKs, and system configurations

**Screen Authorization**:
- Public screens: Home Page, Login, Register, Reset Password (Request/Reset)
- Parent screens: Parent Dashboard, Courses Management, Children Management, Subscriptions, License Keys, QR Codes, Robot Control, Joystick, Smart Home, Music, Activities
- Child screens: Child Dashboard, My Courses, Lessons, Activities, Robot Control, Joystick, Blockly Coding, Smart Home, QR Codes
- Staff screens: Staff Dashboard, Categories Management, Courses Management, Lessons Management, Sections Management, Video Submissions
- Admin screens: Admin Dashboard, Users Management, Settings, Robot Models, APKs Management, Osmo Cards, Activities, Subscription Plans

**Non-screen Functions**:
- Authentication & Authorization (JWT Token-based)
- Real-time robot communication via WebSocket
- Firebase integration for data storage
- Payment processing integration
- Certificate generation
- Notification system
- File upload/download functionality

### 3.1.1 Screens Flow

The following diagram shows the system screens and their relationships:

### 3.1.2 Screen Descriptions

[Provide the descriptions for the screens in the Screens Flow above]

| # | Feature | Screen | Description |
|---|---------|--------|-------------|
| 1 | Public Access | HomePage | Main landing page displaying platform overview, hero section with robot demonstrations, feature highlights, call-to-action buttons directing to login, signup, and marketplace sections (Resources, Addons Store, APKs Download, Bundle Catalogs, Subscription Plans) |
| 2 | Public Access | Sign Up | New user registration form with email/password input fields, validation rules, social authentication options (Google, Facebook), automatic account creation, and redirect to login upon successful registration |
| 3 | Public Access | Login | User authentication screen with email/password login, social login options (Google/Facebook), "Remember Me" checkbox, forgot password link, role-based automatic redirection (Admin→Dashboard, Staff→Dashboard, User→Select Profile or Create Profile) |
| 4 | Public Access | Reset Password | Two-step password recovery flow: Request screen for email input to receive reset token, and Confirm screen with token validation and new password setup with strength indicator |
| 5 | Authentication | Create Parent Profile | Initial profile setup screen for new users to create their first profile with name input, avatar selection, profile type choice (Parent/Child), optional 6-digit passcode for children profiles, automatic login and redirect to appropriate dashboard |
| 6 | Authentication | Select User Profile | Profile selection interface displaying all active user profiles (status=1) with profile avatars, names, role indicators, passcode input requirement for protected children profiles, quick profile switching functionality |
| 7 | Marketplace/Resource | Resource | Comprehensive product catalog overview page showcasing all platform offerings including APKs, License Keys, Subscription Plans, Addons, Courses, and Bundles with categorized sections, quick navigation anchors, and product cards linking to specific marketplace pages |
| 8 | Marketplace/Resource | Addons Store | Addon marketplace displaying available feature extensions with category filtering (OSMO, QR CODE, SMART HOME, BLOCKLY), search functionality, addon cards showing name/price/description, category badges with icons, pagination, and "Add to Cart" buttons leading to payment |
| 9 | Marketplace/Resource | APKs Download | Public APK download repository page listing all available Android applications for robot control, search by name, filter by robot model compatibility, version information display, file size, download count statistics, direct download buttons, and installation guide links |
| 10 | Marketplace/Resource | Bundle Catalogs | Course bundle marketplace showing curated course packages with discounted pricing, bundle cards displaying included course count, original vs bundle price comparison, percentage savings highlight, search/filter functionality, featured bundles section, pagination, and detailed bundle view link |
| 11 | Marketplace/Resource | Bundle Details | Detailed bundle information page showing comprehensive bundle description, full list of included courses with thumbnails and descriptions, total original value calculation, bundle discount amount, final price, savings percentage, purchase/add to cart button, and individual course preview links |
| 12 | Marketplace/Resource | Sub Plans (Subscription Plans) | Subscription plan catalog displaying available subscription tiers with feature comparison table, pricing for different billing cycles (1-month, 3-month, 9-month, 12-month), plan features list parsed from rich text, highlighted recommended plan, registration/purchase buttons for authenticated users, login prompt for guests |
| 13 | Payment | Payment Page | Unified checkout and payment processing interface supporting multiple product categories (course/addon/subscription/bundle/license), product summary display, quantity selection, price calculation with key price integration, payment gateway selection (PayOS/VNPay/Momo) with logos, order summary, terms acceptance checkbox, and payment submission button |
| 14 | Payment | Payment Result | Payment outcome confirmation page displaying transaction status (success/failed/pending), order details including order ID and transaction reference, payment method used, amount paid, purchased items list, receipt download option, and navigation buttons returning to appropriate dashboard or retrying payment |
| 15 | Staff Role | Staff Dashboard | Staff member main control panel showing content management overview statistics (total categories count, total courses count, total lessons count), recent activity feed, quick action buttons for creating new categories/courses/lessons, navigation cards to Course Management, Lesson Management, Category Management, Video Submission review, and User Profile access |
| 16 | Staff Role | Course Management | Course administration interface with tabbed or list view of all courses, search and filter by category/status, sortable columns (name, category, created date, status), course cards/rows showing thumbnail, title, description preview, enrolled count, lesson count, action buttons (View Details, Edit, Delete, Manage Sections), and "Create New Course" button |
| 17 | Staff Role | Lesson Management | Centralized lesson administration across all courses with list/grid view, advanced search by course/section/lesson name, filter by lesson type (video/quiz/reading/coding), status indicators, lesson details (duration, type, completion rate), bulk operations capability, quick edit access, and "Create New Lesson" functionality |
| 18 | Staff Role | Category Management | Course category administration interface with category list/grid display, category cards showing name, description, course count, thumbnail image, CRUD operations (Create, Read, Update, Delete), drag-and-drop ordering, status toggle (active/inactive), and rich text description editor for detailed category information |
| 19 | Staff Role | Video Submission | Student video submission review and moderation interface with submission queue list, filter by status (pending/approved/rejected/all), search by student name/course/lesson, submission cards showing student info, course/lesson name, submission date, video thumbnail, review status, action buttons (View Details, Quick Approve, Quick Reject) |
| 20 | Staff Role | User Profile | Staff user profile management page showing personal information (name, email, role, avatar), profile picture upload, password change option, account settings, notification preferences, activity history, and logout button |
| 21 | Admin Role | Admin Dashboard | System administrator main control center displaying comprehensive system statistics (total users by role, online users count, growth rate charts), user distribution graphs, new users this month, rate limit warnings, system health indicators, quick access cards to Users Management, Robot Model, Osmo Cards, APKs Management, Activities Management, Subscription Plan management, and System Settings |
| 22 | Admin Role | Users Management | Complete user administration interface with user list table showing all system users, pagination controls, advanced search/filter by role/status/date, user details (name, email, role, status, registration date, last login), inline editing, role assignment dropdown (Admin/Staff/Parent/Child), account status toggle (active/suspended), user creation modal, bulk operations, export functionality, and detailed user activity logs |
| 23 | Admin Role | Osmo Cards | Osmo physical card management interface for configuring card-to-action mappings, card list with card ID, card name, assigned action/dance/expression/skill, status, creation modal for new cards with card type selection (action/dance/expression/skill), action picker from available robot actions, card activation/deactivation toggle, edit/delete operations |
| 24 | Admin Role | Robot Model | Robot model and configuration management interface displaying all supported robot models, model details (name, specifications, supported features, firmware version), model image upload, capability configuration (actions, sensors, connectivity), hardware specifications editor, compatibility settings with courses/activities, model status (active/deprecated), and documentation links |
| 25 | Admin Role | APKs Management | Android APK administration interface for uploading and managing robot control applications, APK list with version numbers, file details (size, upload date, download count), version management with changelog, robot model compatibility assignment, APK file upload with progress tracking, presigned URL generation, APK status (published/draft/archived), download statistics dashboard |
| 26 | Admin Role | Activities Management | System-wide activity and robot behavior management interface with tabs for different activity types (Actions, Dances, Expressions, Skills, Extended Actions), activity list for each type with name, code, description, action parameters, CRUD operations, activity testing interface, import/export functionality for bulk activity management |
| 27 | Admin Role | Sub Plant (Subscription Plan Admin) | Subscription plan administration interface with plan list showing all available tiers, plan details (name, price, billing cycle options, features list), plan creation/editing form with rich text editor for descriptions, feature checklist builder, pricing configuration for different billing periods (monthly/quarterly/yearly), plan status toggle, plan ordering/priority, and subscriber count per plan |
| 28 | Admin Role | System Setting | System-wide configuration and settings interface with tabbed sections: General Settings (site name, logo, contact info), Email Settings (SMTP configuration, email templates), Payment Gateway Settings (API keys for PayOS/VNPay/Momo), Feature Flags (enable/disable features), Security Settings (password policy, session timeout, 2FA), API Configuration (rate limits, allowed origins), Maintenance Mode toggle |
| 29 | Admin Role | User Profile (Admin) | Administrator personal profile page showing admin account details (name, email, admin role, permissions), profile picture management, password change, two-factor authentication setup, admin activity audit log, account security settings, session management, and logout option |
| 30 | Parent Role | Parent Dashboard | Parent user main control panel displaying enrolled course overview with progress bars, subscription status card with expiration date, active license key information, quick access navigation tiles to key features (My Courses, Joystick Control, Robot Control, QR Codes, Music, Activities, User Profile), children profile cards with individual progress, recent activity timeline, course recommendations |
| 31 | Parent Role | Joystick Control | Virtual joystick interface for robot control featuring dual joystick controls (left for movement, right for rotation), customizable action buttons (A, B, X, Y, LB, RB, LT, RT) with configuration modal, real-time robot video stream, robot status indicators, button mapping to actions/dances/expressions/skills, configuration save/load, emergency stop button, requires valid license key for access |
| 32 | Parent Role | Robot | Direct robot control interface with simplified control panel, action buttons grid (Move Forward/Back/Left/Right, Rotate, Stop), predefined dance sequence buttons, expression selector dropdown, real-time video feed from robot camera, robot battery and connection status, control mode switcher (manual/programmed), action history log, requires license validation |
| 33 | Parent Role | QRs Code | QR code management interface for generating and viewing QR codes for device pairing and robot commands, QR code generator with parameter input (robot ID, command type, action code), generated QR code display with download/print options, QR code history list showing previously generated codes, scan count statistics, QR code purpose labels |
| 34 | Parent Role | Music | Music and sound activity interface for robot entertainment and education, music library browser with categorized songs (educational, entertainment, dance), music player with play/pause/volume controls, robot synchronization toggle for dance-to-music, music upload for custom songs, playlist creation and management, sound effect selector for robot responses |
| 35 | Parent Role | Activities | Parent activity dashboard showing available learning activities for children, activity categories (coding exercises, quizzes, games, creative projects), activity cards with difficulty level, estimated time, learning objectives, completion status for enrolled children, activity assignment to children profiles, progress tracking, results viewing |
| 36 | Parent Role | My Course | Parent's enrolled courses view displaying all courses with enrollment status, course cards showing progress percentage, last accessed lesson, next lesson preview, course completion status, course certificate download button (if completed), filter by status (in-progress/completed/not-started), search functionality, navigation to Course Detail and Learning Page |
| 37 | Parent Role | User Profile (Parent) | Parent profile management page showing personal details (name, email, profile picture), profile type indicator (Parent), children profiles management section with add/edit children profiles, password change, notification preferences, subscription and license key overview, payment history, logout button |
| 38 | Parent Role | Course Detail | Detailed course information page showing course banner image, full description, instructor info, course statistics (enrolled students, lessons, duration), expandable sections and lessons list with icons indicating lesson type (video/quiz/text), enrollment button for non-enrolled courses, progress tracking for enrolled courses, prerequisite requirements, course reviews, navigation to Learning Page |
| 39 | Parent/Children Shared | Learning Page | Course learning interface showing course progress sidebar with sections and lessons, lesson status indicators (locked/unlocked/completed), current lesson title and description, main content area for lesson materials (video player/rich text/PDF viewer), learning controls (previous/next lesson, mark as complete), quiz integration for assessment lessons, solution steps viewer for coding lessons, lesson notes section, help/hint buttons |
| 40 | Parent/Children Shared | Lesson Details | Individual lesson content viewer within learning flow displaying lesson title, description, estimated duration, learning objectives, main content (video with controls, rich text with formatting, embedded media), downloadable resources/attachments, solution/answer key (if applicable), quiz questions and submission (for quiz lessons), completion checkbox, comments/discussion section, navigation to next/previous lessons |
| 41 | Children Role | Children Dashboard | Child-friendly main dashboard with colorful and gamified UI, character avatar display, learning progress visualization with fun graphics (stars, badges, progress bars), enrolled courses with kid-friendly thumbnails, achievement showcase section, recent activities timeline with icons, quick access buttons to key features (My Courses, Robot Control, Coding Block, Joystick, QRs Code, Activities, User Profile) with large, colorful icons |
| 42 | Children Role | Children Course | Children's course catalog browser with simplified, visual interface, large course cards with colorful thumbnails, course titles in clear, readable fonts, difficulty indicators with stars or levels, course descriptions in simple language, visual progress indicators, enrolled vs available courses tabs, course categories with fun icons, navigation to Course Detail page |
| 43 | Children Role | Robot | Child-friendly robot control interface with simplified controls, large, colorful action buttons with clear icons, fun animations and sound effects for button presses, real-time robot video feed, simplified movement controls (forward/backward arrows, turn left/right), emotion/expression selector with emoji-like icons, dance button with fun animations, safe mode indicators |
| 44 | Children Role | Coding Block | Visual block-based programming interface using Google Blockly, drag-and-drop block palette categorized by function (Motion, Looks, Sound, Control, Events), workspace canvas for block assembly, block connection visual indicators, code execution button, robot action preview, save/load project functionality, example projects gallery, step-by-step tutorials, undo/redo controls |
| 45 | Children Role | Joystick | Child-version joystick control interface with simplified layout, larger joystick controls with touch-friendly size, fewer action buttons with clear labels and icons, visual feedback for button presses, robot video stream, fun sound effects, simplified configuration (pre-configured actions), practice mode with guided instructions, emergency stop button prominently displayed |
| 46 | Children Role | QRs Code | Child-friendly QR code interaction interface with simplified QR scanner, pre-generated QR codes for common robot actions displayed as cards, QR code scanner with camera view and alignment guides, visual feedback on successful scan, action preview before execution, QR code collection album showing scanned codes with rewards, fun animations for QR interactions |
| 47 | Children Role | Activities | Children's activity center with gamified learning activities, activity categories with fun icons (Games, Quizzes, Puzzles, Creative Projects), activity cards with difficulty stars, completion badges, estimated time with fun icons, activity thumbnails and preview animations, progress tracking with rewards, achievement unlocking, leaderboard (optional), activity instructions with visual guides |
| 48 | Children Role | User Profile (Children) | Child profile page with age-appropriate design, large profile picture/avatar with customization options, display name, achievements and badges showcase, learning statistics with fun visualizations (total lessons completed, time spent learning, skills acquired), progress level display, rewards collection, profile customization (themes, avatars, colors), parent-controlled settings section, logout button |

---

### 3.1.3 Screen Authorization

[Provide the system roles authorization to the system features (down to screens, and event to the screen activities if applicable) in the table form as below – replace Admin, Staff, Parent, Children with your specific system user role names]

| Screen | Admin | Staff | Parent | Children | ... |
|--------|-------|-------|--------|----------|-----|
| **Home Page** | X | X | X | X | |
| View Home Content | X | X | X | X | |
| Navigate to Marketplace | X | X | X | X | |
| **Sign Up** | X | X | X | X | |
| Register New Account | X | X | X | X | |
| **Login** | X | X | X | X | |
| Authenticate User | X | X | X | X | |
| **Reset Password** | X | X | X | X | |
| Request Reset Token | X | X | X | X | |
| Confirm New Password | X | X | X | X | |
| **Create Parent Profile** | X | X | X | X | |
| Create New Profile | X | X | X | X | |
| **Select User Profile** | X | X | X | X | |
| View All Profiles | X | X | X | X | |
| Select Profile | X | X | X | X | |
| **Resource** | X | X | X | X | |
| View All Resources | X | X | X | X | |
| **Addons Store** | X | X | X | X | |
| View All Addons | X | X | X | X | |
| Search Addons | X | X | X | X | |
| **APKs Download** | X | X | X | X | |
| View All APKs | X | X | X | X | |
| Download APK | X | X | X | X | |
| **Bundle Catalogs** | X | X | X | X | |
| View All Bundles | X | X | X | X | |
| **Bundle Details** | X | X | X | X | |
| View Bundle Details | X | X | X | X | |
| **Sub Plans** | X | X | X | X | |
| View All Plans | X | X | X | X | |
| **Payment Page** | | | X | | |
| Process Payment | | | X | | |
| Select Payment Gateway | | | X | | |
| **Payment Result** | | | X | | |
| View Payment Status | | | X | | |
| **Staff Dashboard** | | X | | | |
| View Dashboard Stats | | X | | | |
| **Course Management** | | X | | | |
| Query All Courses | | X | | | |
| Add New Course | | X | | | |
| Update Course | | X | | | |
| Delete Course | | X | | | |
| **Lesson Management** | | X | | | |
| Query All Lessons | | X | | | |
| Add New Lesson | | X | | | |
| Update Lesson | | X | | | |
| Delete Lesson | | X | | | |
| **Category Management** | | X | | | |
| Query All Categories | | X | | | |
| Add New Category | | X | | | |
| Update Category | | X | | | |
| Delete Category | | X | | | |
| **Video Submission** | | X | | | |
| Query All Submissions | | X | | | |
| Review Submission | | X | | | |
| Approve Submission | | X | | | |
| Reject Submission | | X | | | |
| **User Profile (Staff)** | | X | | | |
| View Own Profile | | X | | | |
| Update Own Profile | | X | | | |
| **Admin Dashboard** | X | | | | |
| View System Stats | X | | | | |
| **Users Management** | X | | | | |
| Query All Users | X | | | | |
| Add New User | X | | | | |
| Update User | X | | | | |
| Delete User | X | | | | |
| **Osmo Cards** | X | | | | |
| Query All Cards | X | | | | |
| Add New Card | X | | | | |
| Update Card | X | | | | |
| Delete Card | X | | | | |
| **Robot Model** | X | | | | |
| Query All Models | X | | | | |
| Add New Model | X | | | | |
| Update Model | X | | | | |
| Delete Model | X | | | | |
| **APKs Management** | X | | | | |
| Query All APKs | X | | | | |
| Upload New APK | X | | | | |
| Update APK | X | | | | |
| Delete APK | X | | | | |
| **Activities Management** | X | | | | |
| Query All Activities | X | | | | |
| Add New Activity | X | | | | |
| Update Activity | X | | | | |
| Delete Activity | X | | | | |
| **Sub Plant** | X | | | | |
| Query All Plans | X | | | | |
| Add New Plan | X | | | | |
| Update Plan | X | | | | |
| Delete Plan | X | | | | |
| **System Setting** | X | | | | |
| View Settings | X | | | | |
| Update Settings | X | | | | |
| **User Profile (Admin)** | X | | | | |
| View Own Profile | X | | | | |
| Update Own Profile | X | | | | |
| **Parent Dashboard** | | | X | | |
| View Dashboard | | | X | | |
| **Joystick Control** | | | X | | |
| Control Robot | | | X | | |
| Configure Buttons | | | X | | |
| **Robot** | | | X | X | |
| Control Robot | | | X | X | |
| View Robot Status | | | X | X | |
| **QRs Code** | | | X | X | |
| Generate QR Code | | | X | | |
| View QR History | | | X | X | |
| Scan QR Code | | | X | X | |
| **Music** | | | X | | |
| Play Music | | | X | | |
| Upload Music | | | X | | |
| **Activities** | | | X | X | |
| View All Activities | | | X | X | |
| Assign Activity | | | X | | |
| Complete Activity | | | X | X | |
| **My Course** | | | X | | |
| Query Own Courses | | | X | | |
| View Course Progress | | | X | | |
| **User Profile (Parent)** | | | X | | |
| View Own Profile | | | X | | |
| Update Own Profile | | | X | | |
| Manage Children Profiles | | | X | | |
| **Course Detail** | | | X | X | |
| View Course Details | | | X | X | |
| Enroll Course | | | X | | |
| **Learning Page** | | | X | X | |
| View Lesson Content | | | X | X | |
| Mark Lesson Complete | | | X | X | |
| **Lesson Details** | | | X | X | |
| View Lesson Details | | | X | X | |
| Submit Quiz | | | X | X | |
| **Children Dashboard** | | | | X | |
| View Dashboard | | | | X | |
| **Children Course** | | | | X | |
| Query Own Courses | | | | X | |
| **Coding Block** | | | | X | |
| Create Block Code | | | | X | |
| Execute Code | | | | X | |
| Save Project | | | | X | |
| **Joystick (Children)** | | | | X | |
| Control Robot | | | | X | |
| **QRs Code (Children)** | | | | X | |
| Scan QR Code | | | | X | |
| **Activities (Children)** | | | | X | |
| View Activities | | | | X | |
| Complete Activity | | | | X | |
| **User Profile (Children)** | | | | X | |
| View Own Profile | | | | X | |
| Update Own Profile | | | | X | |
| ... | | | | | |

---

### 3.1.4 Non-Screen Functions

[Provide the descriptions for the non-screen system functions, i.e batch/cron job, service, API, etc.]

| # | Feature | System Function | Description |
|---|---------|-----------------|-------------|
| 1 | Authentication | JWT Token Generation | Generates access tokens and refresh tokens upon successful user login with configurable expiration times. Tokens contain user ID, role, profile information, and permissions encoded in JWT format. |
| 2 | Authentication | JWT Token Validation | Validates JWT tokens on every API request by checking signature, expiration time, and token structure. Automatically rejects expired or malformed tokens and triggers refresh flow when needed. |
| 3 | Authentication | JWT Token Refresh | Automatically refreshes expired access tokens using valid refresh tokens without requiring user re-login. Implements token rotation for enhanced security and maintains user session continuity. |
| 4 | Authentication | Session Management | Manages user sessions using sessionStorage for token persistence. Tracks active sessions, handles timeout, and ensures secure session cleanup on logout with automatic token invalidation. |
| 5 | Authentication | Password Hashing | Securely hashes user passwords using bcrypt algorithm before storing in database. Implements salt generation and validates password strength requirements during registration and password changes. |
| 6 | Authentication | Social Authentication | Integrates with Google and Facebook OAuth providers via Firebase Authentication. Handles OAuth flow, exchanges authorization codes for tokens, and creates/links user accounts automatically. |
| 7 | Authorization | Role-Based Access Control (RBAC) | Enforces role-based permissions (Admin, Staff, Parent, Children) across all API endpoints and screen access. Validates user roles from JWT token and restricts unauthorized access attempts. |
| 8 | Authorization | Profile-Based Authorization | Controls access based on selected user profile (Parent/Child). Validates profile ownership, enforces passcode protection for children profiles, and manages profile switching with proper authorization. |
| 9 | Authorization | Route Protection | Protects routes using AuthGuard component that validates authentication status and role permissions. Automatically redirects unauthorized users to login or appropriate dashboards based on their roles. |
| 10 | Real-time Communication | WebSocket Connection Management | Establishes and maintains WebSocket connections for real-time features. Handles connection lifecycle (connect, disconnect, reconnect), implements heartbeat mechanism, and manages multiple concurrent connections. |
| 11 | Real-time Communication | Robot Control WebSocket | Enables real-time bidirectional communication with robots. Sends control commands (movement, dance, expression) and receives robot status updates (battery, position, sensor data) with low latency. |
| 12 | Real-time Communication | Notification WebSocket | Pushes real-time notifications to users via WebSocket. Delivers instant alerts for course updates, robot events, system announcements, and payment confirmations without polling. |
| 13 | Real-time Communication | Video Streaming | Streams real-time video feed from robot cameras to web interface. Implements WebRTC or video streaming protocols for low-latency video transmission with quality adaptation based on network conditions. |
| 14 | Payment Processing | PayOS Integration | Integrates with PayOS payment gateway for processing online payments. Generates payment links, handles payment callbacks, validates transaction status, and manages payment confirmation flow. |
| 15 | Payment Processing | VNPay Integration | Processes payments through VNPay gateway supporting Vietnamese banking systems. Handles IPN (Instant Payment Notification), verifies payment signatures, and processes refunds when necessary. |
| 16 | Payment Processing | Momo Integration | Enables Momo e-wallet payments with QR code generation and deep linking. Processes Momo payment callbacks, validates transaction authenticity, and handles payment status synchronization. |
| 17 | Payment Processing | Payment Status Tracking | Tracks payment lifecycle from initiation to completion. Updates order status, handles payment timeouts, manages partial payments, and triggers post-payment actions (course enrollment, license activation). |
| 18 | Payment Processing | Transaction Logging | Logs all payment transactions with complete audit trail including timestamp, amount, gateway, status changes, and user information for reconciliation and dispute resolution. |
| 19 | Certificate Generation | Certificate Template Rendering | Renders certificate templates with dynamic data (user name, course name, completion date, certificate ID). Generates printable certificates in PDF/PNG format using server-side rendering. |
| 20 | Certificate Generation | Certificate Issuance | Issues certificates upon course completion with unique certificate IDs. Validates completion requirements, generates certificate metadata, and stores certificate records in database with verification links. |
| 21 | Certificate Generation | Certificate Verification | Provides public certificate verification endpoint using certificate ID. Validates certificate authenticity, checks issuer signature, and returns certificate details for verification by third parties. |
| 22 | Notification System | Notification Queue Management | Manages notification queue with priority handling and delivery retry mechanism. Implements exponential backoff for failed deliveries and ensures message ordering for related notifications. |
| 23 | Notification System | Multi-Channel Delivery | Delivers notifications across multiple channels (in-app, email, WebSocket push). Routes notifications based on user preferences and notification type with configurable delivery rules. |
| 24 | Notification System | Notification Aggregation | Aggregates related notifications to prevent notification spam. Groups similar notifications, implements read/unread tracking, and provides batch operations (mark all as read, delete multiple). |
| 25 | File Management | Presigned URL Generation | Generates secure presigned URLs for direct file uploads to S3/storage. Implements time-limited access with configurable expiration, file size limits, and allowed MIME types validation. |
| 26 | File Management | File Upload Processing | Processes uploaded files including validation, virus scanning, format conversion, and thumbnail generation. Handles large file uploads with chunking and resume capability for interrupted uploads. |
| 27 | File Management | Video Processing | Processes uploaded videos for lessons including transcoding, compression, resolution adaptation, and thumbnail extraction. Generates multiple quality versions (480p, 720p, 1080p) for adaptive streaming. |
| 28 | File Management | File Storage Management | Manages file storage across cloud storage services with automatic cleanup of temporary files, orphaned files, and expired uploads. Implements storage quota management and archival policies. |
| 29 | Data Synchronization | Firebase Realtime Sync | Synchronizes data with Firebase Realtime Database for offline-first functionality. Handles conflict resolution, implements optimistic updates, and manages data consistency across devices. |
| 30 | Data Synchronization | Redux State Management | Manages global application state using Redux Toolkit. Implements normalized state structure, handles async operations with Thunks, and provides optimistic updates with rollback capability. |
| 31 | Data Synchronization | React Query Cache Management | Manages server state caching with React Query. Implements intelligent cache invalidation, background refetching, and optimistic updates for improved UX and reduced API calls. |
| 32 | Subscription Management | Subscription Lifecycle | Manages subscription lifecycle from creation to expiration. Handles subscription activation, renewal reminders, automatic expiration, grace period management, and subscription tier changes. |
| 33 | Subscription Management | Subscription Validation | Validates active subscriptions before granting access to premium features. Checks expiration dates, payment status, and subscription tier permissions with real-time validation. |
| 34 | License Management | License Key Generation | Generates unique license keys with configurable formats and validation rules. Implements cryptographic key generation, assigns keys to users, and tracks key usage and activation status. |
| 35 | License Management | License Validation | Validates license keys before allowing access to licensed features (Robot Control, Joystick). Checks key authenticity, expiration, activation count, and device binding restrictions. |
| 36 | License Management | License Activation | Handles license activation process with device registration. Enforces concurrent device limits, manages license transfer between devices, and tracks activation history for audit. |
| 37 | Email Service | Email Template Rendering | Renders HTML email templates with dynamic content using template engine. Supports multi-language templates, personalization variables, and responsive email design for various email clients. |
| 38 | Email Service | Email Queue Processing | Processes email queue with background workers for high-volume sending. Implements retry mechanism for failed sends, handles bounce processing, and manages unsubscribe lists. |
| 39 | Email Service | SMTP Integration | Integrates with SMTP servers for email delivery. Supports multiple SMTP providers with failover, handles authentication, TLS/SSL encryption, and monitors delivery status. |
| 40 | API Rate Limiting | Request Rate Limiting | Implements rate limiting per user/IP to prevent API abuse. Uses token bucket or sliding window algorithms with configurable limits based on user role and subscription tier. |
| 41 | API Rate Limiting | Rate Limit Monitoring | Monitors rate limit violations and provides admin dashboard with rate limit statistics. Generates alerts for suspicious activity patterns and implements temporary bans for repeated violations. |
| 42 | Logging & Monitoring | Application Logging | Implements structured logging with log levels (debug, info, warn, error). Logs API requests, errors, security events, and business operations with contextual information for debugging. |
| 43 | Logging & Monitoring | Error Tracking | Tracks application errors with stack traces, user context, and environment information. Integrates with error monitoring services and provides error grouping and notification capabilities. |
| 44 | Logging & Monitoring | Performance Monitoring | Monitors application performance metrics including response times, database query performance, and resource usage. Provides performance dashboards and alerts for degradation detection. |
| 45 | Logging & Monitoring | User Activity Tracking | Tracks user activities for analytics and audit purposes. Records user actions, page views, feature usage, and generates activity reports for admin and compliance requirements. |
| 46 | Search & Indexing | Full-Text Search | Implements full-text search across courses, lessons, bundles, and addons. Supports keyword search, filtering, sorting, and relevance ranking with fuzzy matching for typo tolerance. |
| 47 | Search & Indexing | Search Indexing | Maintains search indexes for fast query performance. Implements incremental indexing on data changes, handles index optimization, and supports multi-field search across related entities. |
| 48 | Backup & Recovery | Automated Backup | Performs automated database backups on scheduled intervals. Implements incremental and full backup strategies, encrypts backup files, and stores backups in geographically distributed locations. |
| 49 | Backup & Recovery | Disaster Recovery | Provides disaster recovery procedures with documented Recovery Point Objective (RPO) and Recovery Time Objective (RTO). Implements backup restoration testing and maintains standby systems. |
| 50 | Security | SQL Injection Prevention | Prevents SQL injection attacks using parameterized queries and ORM frameworks. Implements input validation, escapes special characters, and uses prepared statements for all database operations. |
| 51 | Security | XSS Prevention | Prevents Cross-Site Scripting attacks by sanitizing user inputs and escaping outputs. Implements Content Security Policy (CSP), validates rich text content, and uses secure rendering libraries. |
| 52 | Security | CSRF Protection | Protects against Cross-Site Request Forgery using CSRF tokens. Implements SameSite cookie attributes, validates origin headers, and requires token validation for state-changing operations. |
| 53 | Security | Data Encryption | Encrypts sensitive data at rest and in transit using industry-standard encryption algorithms (AES-256, TLS 1.3). Implements key rotation, secure key storage, and encryption for PII data. |
| 54 | Security | Security Audit Logging | Logs all security-relevant events including login attempts, permission changes, data access, and configuration modifications for compliance and forensic analysis. |
| 55 | Admin Functions | User Account Management | Provides admin capabilities for managing user accounts including creation, modification, role assignment, account suspension, and password reset with audit trail logging. |
| 56 | Admin Functions | System Configuration | Allows admins to configure system settings including feature flags, payment gateway credentials, email settings, API configurations, and maintenance mode toggle. |
| 57 | Admin Functions | Data Export | Enables admin to export system data (users, courses, transactions) in various formats (CSV, Excel, JSON) with filtering options and scheduled export capabilities. |
| 58 | Admin Functions | Analytics Dashboard | Provides comprehensive analytics dashboard with user statistics, growth metrics, revenue tracking, course engagement metrics, and customizable reports. |
| 59 | Robot Integration | Robot Command Translation | Translates high-level commands from UI (move forward, dance, expression) into low-level robot-specific commands. Implements command queue, priority handling, and command cancellation. |
| 60 | Robot Integration | Robot Status Monitoring | Continuously monitors robot status including battery level, connection state, sensor readings, and error conditions. Provides alerts for critical status changes and automatic disconnect handling. |
| 61 | Robot Integration | Blockly Code Execution | Executes visual block code created in Blockly editor. Translates blocks to executable commands, implements execution control (start, stop, pause), and provides step-by-step debugging capability. |
| 62 | QR Code | QR Code Generation | Generates QR codes for device pairing and robot command execution. Encodes command parameters, implements expiration timestamps, and supports various QR code formats and sizes. |
| 63 | QR Code | QR Code Scanning | Processes scanned QR codes, validates code authenticity, decodes embedded commands, and executes associated actions with user confirmation for security-sensitive operations. |
| 64 | Content Delivery | CDN Integration | Integrates with Content Delivery Network for fast static asset delivery. Implements cache invalidation, geographical distribution, and optimizes assets (images, videos, scripts) for performance. |
| 65 | Content Delivery | Adaptive Video Streaming | Implements adaptive bitrate streaming for video lessons. Automatically adjusts video quality based on network conditions, supports HLS/DASH protocols, and provides smooth playback experience. |
| ... | ... | ... | ... |

---

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                         ALPHA CODE WEB APPLICATION - COMPLETE SCREEN FLOW                                           │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘

                                                    ┌─────────────────┐
                                         ┌─────────▶│   Home Page     │◄─────────────┐
                                         │          │   (Landing)     │              │
                                         │          └────────┬────────┘              │
                                         │                   │                       │
                                         │          ┌────────┼────────┐              │
                                         │          │        │        │              │
                                         │          ▼        ▼        ▼              │
                                         │     ┌────────┐┌──────┐┌────────┐         │
                                         │     │Bundles ││Addons││Resources│         │
                                         │     └────────┘└──────┘└────────┘         │
                                         │                                           │
                    ┌────────────────────┼──────────┬────────────────────┐          │
                    │                    │          │                    │          │
                    ▼                    │          ▼                    ▼          │
            ┌───────────────┐            │  ┌───────────────┐   ┌──────────────┐   │
            │  User Login   │            │  │ User Register │   │Subscription  │   │
            └───────┬───────┘            │  └───────┬───────┘   │    Plans     │   │
                    │                    │          │            └──────────────┘   │
                    │                    │          └─────┐                         │
                    │ Login Success      │                │                         │
         ┌──────────┼──────────┬─────────┴───────┐        │                         │
         │          │          │                 │        │                         │
         │(Admin/   │(User w/  │(User no         │        │                         │
         │ Staff)   │profiles) │profile)         │        │                         │
         │          │          │                 │        │                         │
         ▼          ▼          ▼                 │        ▼                         │
    ┌────────┐ ┌──────────┐ ┌──────────┐        │  ┌───────────────┐              │
    │ Admin/ │ │  Select  │ │  Create  │        │  │Public Course  │              │
    │ Staff  │ │ Profile  │ │  Parent  │        │  │   Details     │              │
    │Dashbrd │ │          │ │ Profile  │        │  └───────────────┘              │
    └────────┘ └────┬─────┘ └────┬─────┘        │                                  │
                    │            │              │                                  │
         ┌──────────┴─────┐      │              │                                  │
         │                │      │              │                                  │
         ▼                ▼      │              │                                  │
   ┌──────────┐    ┌──────────┐ │              │                                  │
   │  PARENT  │    │ CHILDREN │ │              │                                  │
   │DASHBOARD │    │DASHBOARD │◄┘              │                                  │
   └─────┬────┘    └────┬─────┘                │                                  │
         │              │                       │                                  │
         │              │              ┌────────┴────────┐                         │
         │              │              │                 │                         │
    ┌────┴─────┐   ┌────┴─────┐       ▼                 ▼                         │
    │          │   │          │  ┌─────────────┐  ┌─────────────┐                │
    ▼          ▼   ▼          ▼  │Reset Passwd │  │Reset Passwd │                │
┌────────┐┌──────┐┌──────┐┌──────┐│  Request    │  │  Confirm    │                │
│Courses ││Robot ││  QR  ││Blockly└─────────────┘  └──────┬──────┘                │
│        ││Ctrl  ││Codes ││Coding│                        │                        │
└───┬────┘└──────┘└──────┘└──────┘                        └────────────────────────┘
    │
    ├──────┬────────┬────────┬────────┐
    │      │        │        │        │
    ▼      ▼        ▼        ▼        ▼
┌──────┐┌──────┐┌────────┐┌────────┐┌──────────┐
│License││Joystick││Smart  ││ Music  ││Activities│
│ Keys ││      ││ Home  ││        ││          │
└──────┘└──────┘└────────┘└────────┘└──────────┘
    │
    ▼
┌──────────┐
│  Course  │──────┐
│ Details  │      │
└────┬─────┘      │
     │            │
     ▼            │
┌──────────┐      │
│ Learning │      │
│  Page    │◄─────┘
└────┬─────┘
     │
     ▼
┌──────────┐
│  Lesson  │
│ Details  │
└────┬─────┘
     │
     ▼
┌──────────┐
│Activities│
│(Quiz,etc)│
└──────────┘


┌─────────────────────────────────────────┐          ┌─────────────────────────────────────────┐
│        STAFF DASHBOARD                  │          │        ADMIN DASHBOARD                  │
└──────────┬──────────────────────────────┘          └──────────┬──────────────────────────────┘
           │                                                     │
     ┌─────┼─────┬──────────┐                  ┌────────────────┼───────┬──────────┬──────────┐
     │     │     │          │                  │        │       │       │          │          │
     ▼     ▼     ▼          ▼                  ▼        ▼       ▼       ▼          ▼          ▼
┌────────┐┌──────┐┌──────┐┌──────┐      ┌─────────┐┌──────┐┌──────┐┌──────┐┌─────────┐┌──────┐
│Categories││Courses││Lessons││Video │      │  Users  ││Robot ││ APKs ││ Osmo ││  Plan   ││Activities│
│        ││      ││      ││Submis│      │         ││Models││      ││Cards ││  Mgmt   ││      │
└───┬────┘└──┬───┘└──┬───┘└──────┘      └────┬────┘└──────┘└──┬───┘└──────┘└─────────┘└──────┘
    │        │       │                        │                │
    ▼        ▼       ▼                        ▼                ▼
┌────────┐┌──────┐┌──────┐                ┌──────┐        ┌──────┐
│Category││Course││Lesson│                │ User │        │ APK  │
│Details ││Details││Details│                │CRUD  │        │Upload│
└────────┘└───┬──┘└──────┘                └──────┘        └──────┘
              │
              ▼
         ┌─────────┐
         │Sections │
         │ (CRUD)  │
         └─────────┘


┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                            PUBLIC MARKETPLACE & COMMON SCREENS                                │
└──────────────────────────────────────────────────────────────────────────────────────────────┘

PUBLIC ACCESS:                           AUTHENTICATED:                      ALL USERS:
┌──────────────┐                        ┌──────────────┐                   ┌──────────────┐
│ Subscription │────┐                   │   Payment    │                   │ Notifications│
│    Plans     │    │                   │    Page      │                   │              │
└──────────────┘    │                   └──────┬───────┘                   └──────────────┘
                    │                          │
┌──────────────┐    │                   ┌──────▼───────┐                   ┌──────────────┐
│   Bundles    │────┤                   │   Payment    │                   │ Certificate  │
│   Catalog    │    │                   │    Result    │                   │  Download    │
└──────────────┘    │                   └──────────────┘                   └──────────────┘
                    ├──────┐
┌──────────────┐    │      │            ┌──────────────┐                   ┌──────────────┐
│    Addons    │────┤      └───────────▶│   License    │                   │    Logout    │
│    Store     │    │                   │     Keys     │                   │              │
└──────────────┘    │                   └──────────────┘                   └──────────────┘
                    │
┌──────────────┐    │                   ┌──────────────┐
│     APKs     │────┤                   │  Profile     │
│   Download   │    │                   │  Management  │
└──────────────┘    │                   └──────────────┘
                    │
┌──────────────┐    │
│  Resources   │────┘
│   Catalog    │
└──────────────┘
```

## Screen Details

### Public Screens

#### 1. Home Page (`/`)
**Description**: Landing page with hero section, features, robot showcase, about section
**Access**: Public (Guest/Unauthenticated users)
**Navigation to**:
- Login (`/login`)
- Sign Up (`/signup`)
- Subscription Plans (`/subscription-plan`)
- Bundles (`/bundle`)
- Addons (`/addons`)
- APKs (`/apks`)
- Resources (`/resources`)
- Course Details (`/course/[slug]`)

#### 2. Login (`/login`)
**Description**: User authentication page with email/password and social login (Google, Facebook)
**Access**: Public (Unauthenticated users only - redirects if logged in)
**Components**: `LoginForm`
**Login Flow**:
- Admin/Staff: Direct to role-specific dashboard
- User with profiles: Direct to `Select Profile`
- User without profile: Direct to `Create Parent Profile`
**Navigation to**:
- Select Profile (`/select-profile`) - User with existing profiles
- Create Parent Profile (`/create-parent-profile`) - User without profiles
- Admin Dashboard (`/admin`) - Admin role
- Staff Dashboard (`/staff`) - Staff role
- Reset Password Request (`/reset-password/request`)
- Sign Up (`/signup`)

#### 3. Sign Up/Register (`/signup`)
**Description**: New user registration with email/password
**Access**: Public (Unauthenticated users only)
**Components**: `RegisterForm`
**Navigation to**:
- Login (`/login`) - After successful registration
- Home Page (`/`) - Back button

#### 4. Reset Password Request (`/reset-password/request`)
**Description**: Request password reset via email
**Access**: Public
**Components**: `RequestResetPasswordForm`
**Navigation to**:
- Reset Password Confirm (`/reset-password/reset`)
- Login (`/login`)

#### 5. Reset Password Confirm (`/reset-password/reset`)
**Description**: Confirm new password with token from email
**Access**: Public (requires valid reset token)
**Components**: `ResetPasswordForm`
**Navigation to**:
- Login (`/login`) - After successful password reset

#### 6. Select Profile (`/select-profile`)
**Description**: Choose user profile (Parent/Child) after login - displays all active profiles with avatar and name, requires passcode for children profiles
**Access**: Authenticated users with existing profiles
**Components**: `ProfileSelection`
**Features**:
- Display all active profiles (status = 1)
- Profile avatars and names
- Passcode input for children profiles (optional for parent)
- Switch between profiles
**Navigation to**:
- Parent Dashboard (`/parent`) - If Parent profile selected
- Children Dashboard (`/children`) - If Child profile selected
- Login (`/login`) - If no profiles found

#### 7. Create Parent Profile (`/create-parent-profile`)
**Description**: First-time profile creation for new users
**Access**: Authenticated users without any profile
**Components**: `CreateParentProfile`
**Features**:
- Profile name input
- Avatar selection
- Profile type selection (Parent/Child)
- Optional passcode for children
**Navigation to**:
- Parent Dashboard (`/parent`) - After successful parent profile creation
- Children Dashboard (`/children`) - After successful child profile creation

---

### Parent Role Screens

#### 8. Parent Dashboard (`/parent`)
**Description**: Main dashboard for parents showing enrolled courses, subscription status, license info, children progress
**Access**: Authenticated Parent users (requires Parent profile selected)
**Key Features**:
- Enrolled courses overview with progress
- Subscription status and expiration
- License key information
- Quick access to children management
- Recent activities timeline
- Course recommendations
**Navigation to**:
- Courses List (`/parent/courses`)
- Children Management - Not implemented yet (managed through profile system)
- License Keys (`/license-key`)
- QR Codes (`/parent/qr-codes`)
- Robot Control (`/parent/robot`)
- Joystick (`/parent/joystick`)
- Smart Home (`/parent/smart-home`)
- Music (`/parent/music`)
- Activities (`/parent/activities`)

#### 9. Parent Courses List (`/parent/courses`)
**Description**: Browse and manage available and enrolled courses for parent
**Access**: Authenticated Parent users
**Navigation to**:
- Course Details (`/parent/courses/[slug]`)

#### 10. Parent Course Details (`/parent/courses/[slug]`)
**Description**: Detailed view of a specific course with enrollment option
**Access**: Authenticated Parent users
**Features**:
- Course overview and description
- Sections and lessons list
- Enrollment dialog
- Progress tracking for enrolled courses
**Components**: `CourseDetail`
**Navigation to**:
- Course Learning Overview (`/parent/courses/learning/[slug]`) - After enrollment

#### 11. Parent Course Learning Overview (`/parent/courses/learning/[slug]`)
**Description**: Course learning dashboard showing all sections and lessons with progress
**Access**: Authenticated Parent users enrolled in the course
**Features**:
- Course progress overview (X/Y lessons completed)
- All sections with expandable lessons
- Lesson status indicators (locked, in-progress, completed)
- Direct lesson access
- Lesson type icons (video, quiz, reading)
**Navigation to**:
- Lesson Learning Page (`/parent/courses/learning/[slug]/lesson/[accountLessonId]`)
- Quiz Page (`/parent/courses/learning/[slug]/quiz/[accountLessonId]`)

#### 12. Parent Lesson Learning Page (`/parent/courses/learning/[slug]/lesson/[accountLessonId]`)
**Description**: Interactive lesson content viewer
**Access**: Authenticated Parent users enrolled in the course
**Features**:
- Video player with controls
- Rich text lesson content
- Solution steps viewer
- PDF viewer
- Mark as complete button
- Next/Previous lesson navigation
- Progress tracking
**Components**: Video player, Rich text viewer, Solution viewer

#### 13. Parent Quiz Page (`/parent/courses/learning/[slug]/quiz/[accountLessonId]`)
**Description**: Interactive quiz and assessment page
**Access**: Authenticated Parent users enrolled in the course
**Features**:
- Quiz questions display
- Answer submission
- Score calculation
- Completion tracking
- Next/Previous navigation
**Components**: Quiz interface

#### 14. License Keys (`/license-key`)
**Description**: View and manage license keys for course access and AI features
**Access**: Authenticated Parent users
**Features**:
- View active license keys
- License expiration dates
- License types and features
- Purchase new licenses

#### 15. Parent QR Codes (`/parent/qr-codes`)
**Description**: Generate and manage QR codes for device pairing and robot control
**Access**: Authenticated Parent users
**Features**:
- Generate QR codes
- View QR code history
- QR code for robot pairing

#### 16. Parent Robot Control (`/parent/robot`)
**Description**: Control and interact with connected robots
**Access**: Authenticated Parent users with robot access
**Features**:
- Real-time robot control
- Video stream from robot
- Action buttons (move, dance, expression)
- Robot status monitoring
**Protection**: Requires valid license key

#### 17. Parent Joystick (`/parent/joystick`)
**Description**: Joystick interface for robot control with customizable button actions
**Access**: Authenticated Parent users
**Features**:
- Virtual joystick controls (left/right)
- Customizable button mapping (A, B, X, Y, LB, RB, LT, RT)
- Robot video stream
- Configuration modal for button actions
- Support for actions, dances, expressions, skills, extended actions
**Components**: `JoystickPage`, `JoystickConfigurationModal`
**Protection**: Requires valid license key

#### 18. Parent Smart Home (`/parent/smart-home`)
**Description**: Smart home integration and control simulation
**Access**: Authenticated Parent users

#### 19. Parent Music (`/parent/music`)
**Description**: Music and sound activities for robot
**Access**: Authenticated Parent users

#### 20. Parent Activities (`/parent/activities`)
**Description**: View and manage various learning activities
**Access**: Authenticated Parent users
**Navigation to**:
- Activity details pages

---

### Children Role Screens

#### 21. Children Dashboard (`/children`)
**Description**: Main dashboard for children showing enrolled courses, achievements, progress, and quick access to activities
**Access**: Authenticated Child users (requires Child profile selected)
**Key Features**:
- My courses overview with colorful UI
- Learning progress and stats
- Achievements and badges
- Recent activities
- Gamified learning elements
**Navigation to**:
- My Courses (`/children/courses`)
- Robot Control (`/children/robot`)
- Joystick (`/children/joystick`)
- Blockly Coding (`/children/blockly-coding`)
- QR Codes (`/children/qr-codes`)
- Smart Home (`/children/smart-home`)
- Activities (`/children/activities`)

#### 22. Children Courses List (`/children/courses`)
**Description**: Browse enrolled courses with child-friendly UI
**Access**: Authenticated Child users
**Navigation to**:
- Course Details (`/course/[slug]`)

#### 23. Children Robot Control (`/children/robot`)
**Description**: Interactive robot control interface with simplified controls
**Access**: Authenticated Child users with robot access
**Features**:
- Simplified robot controls
- Video stream from robot
- Fun animations and feedback
- Action buttons

#### 24. Children Joystick (`/children/joystick`)
**Description**: Joystick interface for robot control (same functionality as parent)
**Access**: Authenticated Child users
**Features**: Same as Parent Joystick

#### 25. Children Blockly Coding (`/children/blockly-coding`)
**Description**: Visual block-based programming interface
**Access**: Authenticated Child users
**Features**:
- Drag-and-drop block coding
- Robot programming with visual blocks
- Code execution and testing
- Save and load projects
**Components**: Blockly integration

#### 26. Children QR Codes (`/children/qr-codes`)
**Description**: QR code scanning and interaction
**Access**: Authenticated Child users

#### 27. Children Smart Home (`/children/smart-home`)
**Description**: Smart home control and learning activities with child-friendly UI
**Access**: Authenticated Child users

#### 28. Children Activities (`/children/activities`)
**Description**: Interactive learning activities and games
**Access**: Authenticated Child users
**Navigation to**:
- Specific activity pages (Quiz, Puzzles, Games)

---

### Course Screens (Shared between Parent and Children)

#### 29. Course Details (`/course/[slug]`)
**Description**: Public course details page accessible to all users
**Access**: Public and Authenticated users (Parent/Child)
**Features**:
- Course overview and description
- Rich text content
- Course thumbnail and media
- Sections preview
- Enrollment button (for authenticated users)
- Course information (level, duration, etc.)
**Components**: `CourseDetail`
**Navigation to**:
- Login (`/login`) - If not authenticated
- Parent Course Learning (`/parent/courses/learning/[slug]`) - If Parent enrolled
- Children Course Learning (uses same parent route structure) - If Child enrolled

**Note**: Both Parent and Children users use the same `/parent/courses/learning/[slug]` route structure for course learning

---

### Staff Role Screens

#### 30. Staff Dashboard (`/staff`)
**Description**: Main dashboard for staff showing statistics and quick access to content management
**Access**: Authenticated Staff users
**Key Features**:
- Total categories, courses, sections, lessons count
- Dashboard statistics with loading states
- Quick action buttons
**Components**: Uses `useStaffDashboardStats` hook
**Navigation to**:
- Categories Management (`/staff/categories`)
- Courses Management (`/staff/courses`)
- Lessons Management (`/staff/lessons`)
- Video Submissions (`/staff/video-submissions`)

#### 31. Staff Categories List (`/staff/categories`)
**Description**: Manage course categories with list and grid view
**Access**: Authenticated Staff users
**Features**: 
- View all categories
- Create new category
- Search and filter
**Navigation to**:
- Category Details (`/staff/categories/[id]`)
- Create Category (`/staff/categories/new`)

#### 32. Staff Category Details (`/staff/categories/[id]`)
**Description**: View category details and associated courses
**Access**: Authenticated Staff users
**Features**:
- View category information
- List all courses in category
- Edit/Delete category
- Rich text description viewer
**Navigation to**:
- Edit Category
- Course Details

#### 33. Staff Courses List (`/staff/courses`)
**Description**: Manage courses with comprehensive list view
**Access**: Authenticated Staff users
**Features**: 
- View all courses
- Search and filter
- Create new course
**Navigation to**:
- Course Details (`/staff/courses/[slug]`)
- Create Course (`/staff/courses/new`)

#### 34. Staff Course Details (`/staff/courses/[slug]`)
**Description**: Detailed course management with sections and lessons
**Access**: Authenticated Staff users
**Features**:
- View course information
- Manage sections (Create, Edit, Delete, Reorder)
- Manage lessons within sections (Create, Edit, Delete, Reorder)
- Drag-and-drop lesson ordering
- Move lessons between sections
- Rich text editor for content
**Components**: Comprehensive course management interface
**Navigation to**:
- Edit Course (`/staff/courses/[slug]/edit`)
- Create Section
- Create Lesson (`/staff/courses/[slug]/sections/[sectionId]/lessons/new`)
- Edit Lesson

#### 35. Staff Create/Edit Lesson (`/staff/lessons/[slug]/edit`)
**Description**: Create or edit lesson content
**Access**: Authenticated Staff users
**Features**:
- Lesson title and description
- Rich text editor for content
- Video upload with presigned URL
- File upload support
- Solution builder for coding exercises
- Lesson type selection
- Video processing status
**Components**: `RichTextEditor`, `SolutionBuilder`, `UploadingModal`
**File Upload**: Supports video files with progress tracking

#### 36. Staff Lessons List (`/staff/lessons`)
**Description**: Manage lessons across all courses
**Access**: Authenticated Staff users
**Features**: 
- View all lessons
- Search and filter
- Quick edit access

#### 37. Staff Video Submissions (`/staff/video-submissions`)
**Description**: Review and manage student video submissions
**Access**: Authenticated Staff users
**Features**:
- View all video submissions
- Filter by status (pending, approved, rejected)
- Review individual submissions
- Approve/Reject with feedback
**Navigation to**:
- Video Submission Details (`/staff/video-submissions/[id]`)

#### 38. Staff Video Submission Details (`/staff/video-submissions/[id]`)
**Description**: Review individual video submission
**Access**: Authenticated Staff users
**Features**:
- View video submission
- Student information
- Approve/Reject actions
- Provide feedback

---

### Admin Role Screens

#### 39. Admin Dashboard (`/admin`)
**Description**: Main dashboard for administrators with system-wide statistics and analytics
**Access**: Authenticated Admin users
**Key Features**:
- User statistics overview (total, growth rate, new this month)
- Online users count with real-time updates
- User growth trends chart
- User distribution chart
- Rate limit warnings
- Refresh capability for all stats
**Components**: `UserStatsOverview`, `GrowthTrendChart`, `UserDistributionChart`, `RateLimitWarning`
**Hooks**: `useGetDashboardStats`, `useGetOnlineUsersCount`, `useGetUserStats`
**Navigation to**:
- Users Management (`/admin/users`)
- Settings (`/admin/settings`)
- Robot Models (`/admin/robot-models`)
- APKs Management (`/admin/apks`)
- Osmo Cards (`/admin/osmo-cards`)
- Activities (`/admin/activities`)
- Subscription Plans (`/admin/plan`)

#### 40. Admin Users List (`/admin/users`)
**Description**: Comprehensive user management interface
**Access**: Authenticated Admin users
**Features**:
- View all users with pagination
- Search and filter users
- Create new users
- Edit/Delete users
- Assign roles (Admin, Staff, Parent, Child)
- User statistics and status
**Components**: `CreateUserModal`
**Navigation to**:
- User Details (Edit)

#### 41. Admin Settings (`/admin/settings`)
**Description**: System-wide settings and configurations
**Access**: Authenticated Admin users
**Features**:
- System configurations
- Application settings
- Feature toggles

#### 42. Admin Robot Models (`/admin/robot-models`)
**Description**: Manage robot models and configurations
**Access**: Authenticated Admin users
**Features**:
- Add/Edit/Delete robot models
- Configure robot specifications
- Robot capabilities management

#### 43. Admin APKs Management (`/admin/apks`)
**Description**: Manage Android APK files for robot control apps
**Access**: Authenticated Admin users
**Features**:
- Upload APK files
- Version management
- APK description and details
- Download statistics
- Robot model compatibility
**Components**: `UploadingModal`

#### 44. Admin Osmo Cards (`/admin/osmo-cards`)
**Description**: Manage Osmo cards for physical-digital learning integration
**Access**: Authenticated Admin users
**Features**:
- Create/Edit/Delete Osmo cards
- Configure card actions
- Map cards to robot actions, dances, expressions
**Components**: `CreateOsmoCardModal`

#### 45. Admin Activities (`/admin/activities`)
**Description**: Manage system-wide activities, actions, and robot behaviors
**Access**: Authenticated Admin users
**Features**:
- Manage robot actions
- Manage dances
- Manage expressions
- Manage extended actions
- Manage skills

#### 46. Admin Subscription Plans (`/admin/plan`)
**Description**: Manage subscription plans and pricing
**Access**: Authenticated Admin users
**Features**:
- Create/Edit/Delete subscription plans
- Set pricing and billing cycles
- Configure plan features
- Plan status management
- Rich text description editor

---

### Public Marketplace Screens

#### 47. Subscription Plans Page (`/subscription-plan`)
**Description**: Browse and purchase subscription plans
**Access**: Public and Authenticated users
**Features**:
- View all available subscription plans
- Compare plan features
- Pricing display with billing cycles (monthly, 3-month, 9-month, yearly)
- Rich text description parsing
- Register/Purchase button (requires authentication)
**Navigation to**:
- Payment (`/payment?category=plan&id=[planId]`) - If authenticated
- Login (`/login`) - If not authenticated

#### 48. Bundles Catalog (`/bundle`)
**Description**: Browse course bundles with discounted pricing
**Access**: Public and Authenticated users
**Features**:
- View all bundles with pagination
- Search bundles
- Featured bundles highlight
- Discount percentage display
- Bundle pricing comparison
**Components**: Bundle cards with hover effects
**Navigation to**:
- Bundle Details (`/bundle/[id]`)

#### 49. Bundle Details (`/bundle/[id]`)
**Description**: Detailed view of a bundle with included courses
**Access**: Public and Authenticated users
**Features**:
- Bundle overview and description
- List of included courses
- Total value vs bundle price
- Savings calculation
- Purchase/Add to cart button
**Navigation to**:
- Payment page with bundle selection
- Course Details (`/course/[slug]`)

#### 50. Addons Store (`/addons`)
**Description**: Browse and purchase addon features
**Access**: Public and Authenticated users
**Features**:
- View all addons with pagination
- Search addons
- Category badges (OSMO, QR CODE, SMART HOME, BLOCKLY)
- Addon pricing and descriptions
- Icon representations for each category
**Navigation to**:
- Addon Details (`/addons/[id]`)
- Payment page

#### 51. APKs Download Page (`/apks`)
**Description**: Public page to download robot control APK applications
**Access**: Public users
**Features**:
- Browse all available APKs
- Search APKs by name
- Filter by robot model
- APK version information
- Download buttons
- Installation instructions
**Components**: `ApkList`

#### 52. Resources Page (`/resources`)
**Description**: Comprehensive catalog of all products and services
**Access**: Public users
**Features**:
- Overview of all offerings (APK, License, Subscription, Addon, Courses, Bundles)
- Quick navigation anchors
- Categorized sections with cards
- Information about each product type
**Components**: `BundleCard`, `CourseCard`, `AddonCard`, `SubscriptionCard`, `ApkCard`, `LicenseCard`
**Navigation to**:
- Individual product pages

#### 53. Payment Page (`/payment`)
**Description**: Unified payment processing page
**Access**: Authenticated Parent users only
**Features**:
- Support multiple payment categories (course, addon, subscription, bundle, license)
- Payment method selection (PayOS, VNPay, Momo)
- Price display with key price integration
- Order summary
- Payment processing
**Query Parameters**: `category` and `id`
**Components**: `PaymentPageClient`
**Navigation to**:
- Payment Result (`/payment/result`)

#### 54. Payment Result (`/payment/result`)
**Description**: Payment completion and status page
**Access**: Authenticated users
**Features**:
- Payment success/failure status
- Order details
- Transaction information
**Navigation to**:
- Dashboard (based on user role)

---

### Common Screens (Available to All Authenticated Users)

#### 55. Profile Management
**Description**: View and edit user profile information through sidebar
**Access**: All authenticated users
**Features**:
- View profile details (name, email, avatar)
- Profile type (Parent/Child)
- Switch between profiles
**Components**: Integrated in `UserSidebar`, `ChildrenSidebar`

#### 56. Change Password
**Description**: Change current password
**Access**: All authenticated users
**Components**: Integrated in profile settings

#### 57. Notifications
**Description**: Real-time notification system
**Access**: All authenticated users
**Features**:
- Unread notification count badge
- Notification dropdown
- Mark as read
- Notification types (system, course, robot)
**Components**: `NotificationBell` in header

#### 58. Certificate Download (`/certificate`)
**Description**: View and download course completion certificates
**Access**: Authenticated users who completed courses
**Query Parameters**: `accountId` and `courseId`
**Features**:
- Dynamic certificate generation
- Certificate preview
- Download as PNG image (high quality)
- Certificate with course name, user name, completion date
- Professional certificate design
**Components**: `CertificateCard`
**Technology**: Uses dom-to-image-more for image generation

#### 59. Logout
**Description**: Sign out from the system
**Access**: All authenticated users
**Action**: 
- Clears sessionStorage (accessToken, refreshToken, availableProfiles)
- Invalidates authentication
- Redirects to home page (`/`)
**Components**: Logout button in sidebar

---

## Navigation Patterns

### Authentication Flow
1. **Unauthenticated Users**: 
   - Home → Login
   - Login Success (Admin/Staff) → Role Dashboard directly
   - Login Success (User with profiles) → Select Profile → Choose Profile → Role Dashboard
   - Login Success (User without profile) → Create Parent Profile → Dashboard
   
2. **Password Recovery**: 
   - Login → Reset Password Request → Check Email → Reset Password Confirm → Login

3. **New User Registration**:
   - Home → Signup → Login → Create Parent Profile → Parent Dashboard

### Profile System Flow
- **Profile Selection**: User can have multiple profiles (Parent and/or Children)
- **Profile Switching**: Available from sidebar - switches without logout
- **Passcode Protection**: Children profiles can be protected with optional 6-digit passcode
- **Active Profiles Only**: Only profiles with status = 1 are displayed

### Protected Routes
- **Public Routes** (No authentication required):
  - Home (`/`)
  - Login (`/login`)
  - Signup (`/signup`)
  - Reset Password (`/reset-password/request`, `/reset-password/reset`)
  - Course Details public view (`/course/[slug]`)
  - Subscription Plans (`/subscription-plan`)
  - Bundles (`/bundle`, `/bundle/[id]`)
  - Addons (`/addons`, `/addons/[id]`)
  - APKs (`/apks`)
  - Resources (`/resources`)
  
- **Authenticated Routes** (Require login):
  - All `/parent/*` routes - Parent role only
  - All `/children/*` routes - Child role only
  - All `/staff/*` routes - Staff role only
  - All `/admin/*` routes - Admin role only
  - `/select-profile` - Users with profiles
  - `/create-parent-profile` - Users without profiles
  - `/payment` - Parent role only
  - `/certificate` - All authenticated users
  - `/license-key` - Parent role

- **Role-Based Access Control**:
  - `AuthGuard` component protects routes by role
  - `AuthRedirect` component redirects authenticated users away from public-only pages (login, signup)
  - Token validation checks on sensitive operations
  - Profile type validation from JWT token

### Common Navigation Elements
- **Header Components**:
  - `Header` - Public pages (Home, landing pages)
  - `UserHeader` - Parent dashboard and pages
  - `ChildrenHeader` - Children dashboard and pages
  - Admin/Staff use standard headers

- **Sidebar Navigation**:
  - `UserSidebar` - Parent routes with customizable navigation items
  - `ChildrenSidebar` - Children routes with age-appropriate design
  - `AdminSidebar` - Admin routes with system management links
  - `StaffSidebar` - Staff routes with content management links
  - `CourseSidebar` - Course learning pages

- **Breadcrumbs**: Used in deep navigation paths
  - Course → Section → Lesson
  - Staff → Categories → Category Details
  - Staff → Courses → Course Details → Section → Lesson

- **Quick Actions**:
  - Robot Selector - Available in Parent/Children headers
  - Notification Bell - All authenticated pages
  - Profile Menu - Sidebar with logout option

### Layout Structure
- **Parent Layout** (`/parent/layout.tsx`): Wraps all parent routes with UserHeader and UserSidebar
- **Children Layout** (`/children/layout.tsx`): Wraps all children routes with ChildrenHeader and ChildrenSidebar
- **Staff Layout** (`/staff/layout.tsx`): Wraps all staff routes with StaffSidebar
- **Admin Layout** (`/admin/layout.tsx`): Wraps all admin routes with AdminSidebar
- **Course Learning Layout**: Minimal layout for focused learning experience

---

## Special Features

### Real-time Features
- **Robot Control**: WebSocket-based real-time communication with robots
  - Video streaming from robot camera
  - Command execution (move, dance, expression)
  - Status monitoring
  - Multiple robot support
  
- **Notifications**: Real-time notification system
  - Push notifications for course updates
  - Robot status alerts
  - System announcements
  - Unread count badge
  
- **Online Users Tracking**: Admin dashboard shows real-time online user count

### File Management & Upload
- **APK Management**: 
  - Upload Android APK files
  - Version tracking
  - Download statistics
  - Public download access
  
- **Certificate Generation**: 
  - Dynamic certificate creation
  - High-quality PNG export using dom-to-image-more
  - Personalized with user and course information
  
- **Video Upload**: 
  - Presigned URL upload for lessons
  - Video processing status tracking
  - Progress indicators
  - Large file support
  
- **Content Upload**:
  - Rich text content with image embedding
  - File attachments for lessons
  - Multiple file type support

### Payment Integration
- **Multiple Payment Gateways**:
  - PayOS integration
  - VNPay support
  - Momo wallet support
  - Payment status tracking
  
- **Subscription Management**:
  - Multiple billing cycles (1, 3, 9, 12 months)
  - Auto-renewal options
  - Expiration notifications
  
- **License Key System**:
  - Key validation for premium features
  - Expiration tracking
  - Multi-device support
  - Protected routes (Robot control, Joystick require valid license)

### Interactive Learning
- **Blockly Visual Programming**:
  - Drag-and-drop block interface
  - Robot programming capabilities
  - Code execution and testing
  - Save/load projects
  
- **Robot Control Interfaces**:
  - Virtual joystick with customizable buttons (A, B, X, Y, LB, RB, LT, RT)
  - Button configuration modal
  - Action mapping (actions, dances, expressions, skills, extended actions)
  - Real-time video feed
  
- **Interactive Activities**:
  - Quiz and assessments
  - Coding puzzles
  - Interactive exercises
  - Progress tracking
  - Gamification elements
  
- **QR Code Integration**:
  - QR code generation for device pairing
  - QR code scanning for interactions
  - Robot command execution via QR
  
- **Smart Home Simulation**:
  - IoT device control simulation
  - Educational smart home scenarios
  
- **Osmo Cards**:
  - Physical card to digital action mapping
  - Card configuration system
  - Multi-action support (actions, dances, expressions, skills)

### Content Management
- **Rich Text Editor**: 
  - WYSIWYG editing for course content
  - Image upload and embedding
  - Formatting options
  - Preview mode
  
- **Solution Builder**: 
  - Step-by-step solution creation
  - Code snippet support
  - Visual solution presentation
  
- **Drag-and-Drop Ordering**:
  - Lesson reordering within sections
  - Section reordering within courses
  - Cross-section lesson movement
  - Real-time order updates

### Robot Features
- **Robot Selector**: Dropdown to choose active robot
- **Robot Actions**: Predefined robot movements and behaviors
- **Robot Dances**: Choreographed dance sequences
- **Robot Expressions**: Facial expressions and emotions
- **Robot Skills**: Complex skill combinations
- **Extended Actions**: Custom action sequences

### Security & Protection
- **License Protection**: Routes protected by license validation
  - `ProtectLicense` component
  - Checks license validity
  - Redirects to license purchase if invalid
  
- **Role-Based Access**: JWT token validation with role checking
- **Passcode Protection**: Optional 6-digit passcode for children profiles
- **Token Refresh**: Automatic token refresh mechanism
- **Session Management**: Secure sessionStorage usage

---

## Error Handling & Edge Cases

### Error States
- **ErrorState Component**: Displays friendly error messages
- **LoadingState Component**: Shows loading animations during data fetching
- **NotFound Component**: 404 error page for invalid routes

### Edge Cases
- No courses enrolled → Show enrollment prompts
- Expired subscription → Redirect to subscription page
- No license key → Redirect to license key page
- Network errors → Retry mechanisms with user feedback
- Invalid tokens → Redirect to login with session expired message

---

## Notes
- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: shadcn/ui component library
- **State Management**: Redux Toolkit for global state (courses, notifications, robots)
- **Data Fetching**: TanStack Query (React Query) for server state
- **Authentication**: JWT token-based with sessionStorage
- **API Integration**: Axios for HTTP requests
- **Responsive Design**: Mobile-first approach with breakpoints
- **Theme Support**: Light/Dark mode via theme provider (planned)
- **Internationalization**: Vietnamese as primary language (i18n support structure)
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Progressive Web App**: PWA capabilities configured
- **SEO**: Next.js metadata API for optimization
- **Firebase Integration**: Authentication (Google, Facebook), Storage
- **Real-time**: WebSocket for robot communication
- **Icons**: Lucide React icon library
- **Animations**: Framer Motion for UI animations
- **Forms**: React Hook Form with validation
- **Notifications**: Sonner toast library
- **Code Editor**: Monaco Editor for code editing features
- **Blockly**: Google Blockly for visual programming
- **Video Player**: Custom video player with controls
- **Image Processing**: Sharp for image optimization (server-side)
- **PDF Generation**: Server-side certificate generation
- **File Upload**: Presigned URL approach for large files
- **Error Handling**: Comprehensive error boundaries and fallbacks
- **Loading States**: Skeleton loaders and loading indicators throughout
- **Testing**: Test structure in place (unit, integration, e2e)
- **Docker**: Containerized deployment support
- **Environment Variables**: Runtime environment variable support with next-runtime-env

### Browser Support
- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

### Key Technical Implementations
1. **Profile System**: Multi-profile support with passcode protection
2. **Robot Communication**: WebSocket-based real-time robot control
3. **Payment Integration**: Multiple payment gateway support (PayOS, VNPay, Momo)
4. **License Validation**: Protected route system with license checking
5. **Rich Content**: WYSIWYG editor with image upload
6. **Drag-and-Drop**: Course structure management with reordering
7. **Video Processing**: Async video upload with progress tracking
8. **Certificate Generation**: Dynamic image generation from HTML
9. **Responsive Layouts**: Different layouts per role with collapsible sidebars
10. **Notification System**: Real-time notification with unread counts

### Deployment
- **Production**: Dockerized deployment
- **Development**: Local development server on port 3000
- **Build**: Next.js production build with optimization
- **Static Assets**: Served from /public directory
- **API Endpoints**: Backend API integration via environment variables
