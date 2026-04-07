# SheSafe End-to-End Mobile Integration Guide (Admin + Authority + Victim App)

## 1. Objective

This document gives an A-to-Z implementation plan to connect the **victim mobile app** (`client`) to your already linked backend ecosystem in `admin` and `authority`.

Goal:
- Keep existing Admin and Authority dashboards working.
- Connect mobile app to real backend APIs (remove mock-only behavior).
- Preserve blockchain evidence integrity flow (hash + timestamp + on-chain verification).
- Provide a submission-ready plan you can execute quickly.

---

## 2. Current Architecture Analysis

## 2.1 Admin Folder Analysis

### admin/backend
- Stack: Node.js + Express + TypeScript + MongoDB + JWT + Multer + Cloudinary/IPFS + Ethers + Bull/Redis.
- Main API base: `/api`.
- Core route groups:
  - `/api/auth`
  - `/api/evidence`
  - `/api/access`
  - `/api/admin`
- Evidence flow implemented:
  - Upload files -> optional AES-256-GCM encryption -> cloud/IPFS storage -> SHA/hash composition -> blockchain write -> verification endpoint.
- Queue support:
  - Blockchain write retry and file batch processing via Redis/Bull.

### admin/client
- Already connected to backend via `apiClient` and token refresh logic.
- Uses authenticated admin endpoints for users/evidence/settings/overview.
- Deployment config exists (`vercel.json`).

## 2.2 Authority Folder Analysis

### authority/backend
- Stack mirrors admin backend, JavaScript version.
- Route groups match admin backend.
- Authority-restricted admin routes:
  - `/api/admin/all-evidence`
  - `/api/admin/access-logs`

### authority/frontend
- Already connected to backend using `apiClient`.
- Pulls evidence and audit logs and verifies evidence via backend.

## 2.3 Victim Mobile App (`client`) Analysis

- Current state is **not backend-linked**.
- Uses local storage + mock APIs:
  - `simulateEvidenceUpload`
  - `simulateTripSync`
- Evidence, emergency, and travel flows are UI/prototype level.
- No real auth token flow to backend.
- No secure token persistence (`expo-secure-store`) in current flow.

---

## 3. Key Gaps Blocking End-to-End Integration

1. Mobile app has no real API layer.
2. Mobile app has no auth session with backend JWT access/refresh tokens.
3. Upload, emergency, and travel screens call mock services only.
4. Evidence Locker and Evidence Detail are populated from local/static data, not backend.
5. Trusted Contacts feature exists in UI but no backend routes/models for contacts.
6. Travel monitoring UI sends location points locally; backend travel endpoint currently expects multipart flow with files and session metadata.
7. Security risk: backend `.env.example` files include real-looking secrets/credentials and must be rotated.

---

## 4. Recommended Integration Strategy

## 4.1 Single Source of Truth Backend for Mobile

Use `admin/backend` as canonical API for mobile integration because:
- TypeScript codebase is easier to maintain.
- Contains richer admin/user status fields.
- Same evidence/auth contract as authority backend.

Keep `authority/backend` for authority dashboard if needed, but avoid dual-write from mobile.

## 4.2 Role Model

Use one JWT model across all apps with roles:
- `user` -> victim mobile app
- `authority` -> authority dashboard
- `admin` -> admin dashboard

---

## 5. Verified API Contract (from existing backend code)

Base URL pattern:
- `https://<backend-domain>/api`

Standard response envelope:
- Success: `{ success: true, message?, data }`
- Error: `{ success: false, message, details? }`

## 5.1 Auth Endpoints

- `POST /auth/register`
  - Required: `name`, `email`, `password`, `confirmPassword`
  - Optional: `role`, `walletAddress`, `isAnonymous`
- `POST /auth/login`
  - Required: `email`, `password`
- `POST /auth/refresh`
  - Required: `refreshToken`
- `POST /auth/logout`
  - Required: `refreshToken`

## 5.2 Evidence Endpoints

- `POST /evidence/upload`
  - Multipart field: `files` (up to 20)
  - Body: `caseId`, `type` (`emergency|report|travel`), `metadata`, `isAnonymous`, etc.
  - Auth: optional
- `POST /evidence/emergency`
  - Multipart + batching metadata (`sessionId`, `mode`, `location`, `isFinal`)
  - Auth: optional
- `POST /evidence/travel`
  - Multipart + travel metadata (`sessionId`, `caseId`, `location`, `isFinal`)
  - Auth: optional
- `GET /evidence/user/:userId`
  - Auth required
- `GET /evidence/:id`
  - Auth required
- `POST /evidence/verify/:id`
  - Auth required

## 5.3 Access Control Endpoints

- `POST /access/grant`
- `POST /access/revoke`

## 5.4 Admin/Authority Endpoints

- Admin dashboard uses `/admin/users`, `/admin/settings`, `/admin/all-evidence`, etc.
- Authority dashboard uses `/admin/all-evidence`, `/admin/access-logs`, `/evidence/verify/:id`.

---

## 6. Mobile App Implementation Blueprint (File-by-File)

## 6.1 Create Configuration Layer

Create `client/src/config/env.ts`:
- `EXPO_PUBLIC_API_BASE_URL`
- `EXPO_PUBLIC_WS_URL` (optional)

Example:

```ts
export const env = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://10.0.2.2:5000/api',
};
```

## 6.2 Create HTTP Client with Auto Refresh

Create `client/src/services/apiClient.ts`:
- Add JSON request helper.
- Add token injection in `Authorization` header.
- On `401`, call `/auth/refresh`, persist new tokens, retry original request.

## 6.3 Secure Token Storage

Add package:

```bash
npm install expo-secure-store
```

Create `client/src/services/authStorage.ts`:
- `setAccessToken`, `getAccessToken`
- `setRefreshToken`, `getRefreshToken`
- `clearSession`

Use SecureStore, not AsyncStorage, for tokens.

## 6.4 Auth Service

Create `client/src/services/authService.ts`:
- `register()`
- `login()`
- `refresh()`
- `logout()`

## 6.5 Auth Context

Create `client/src/context/AuthContext.tsx`:
- Session state
- Login/logout methods
- Bootstrap from SecureStore
- `isAuthenticated` flag

Wrap app root in AuthProvider (in `client/App.tsx`).

## 6.6 Replace Mock Evidence Service

Create `client/src/services/evidenceService.ts`:
- `uploadEvidence(formData)` -> `/evidence/upload`
- `uploadEmergencyChunk(formData)` -> `/evidence/emergency`
- `uploadTravelChunk(formData)` -> `/evidence/travel`
- `listMyEvidence(userId)` -> `/evidence/user/:userId`
- `getEvidenceById(id)` -> `/evidence/:id`
- `verifyEvidence(id)` -> `/evidence/verify/:id`
- `grantAccess(payload)` -> `/access/grant`

## 6.7 Replace Screen Integrations

### UploadScreen
- Replace `simulateEvidenceUpload` with `uploadEvidence`.
- Build multipart payload with field name `files`.

### EmergencyScreen
- On capture stop, send video chunk to `/evidence/emergency`.
- Use session-based batching (`sessionId`, `isFinal`).

### TravelMonitoringScreen
- Send periodic updates with `sessionId`, `location`, and batch sealing (`isFinal=true` on stop).
- Save offline queue for retries.

### EvidenceLockerScreen
- Replace static/mock merge with backend fetch (`/evidence/user/:userId`).

### EvidenceDetailScreen
- Use route item ID -> fetch `/evidence/:id`.
- Trigger verify action with `/evidence/verify/:id`.
- Trigger share with `/access/grant`.

### TrustedContactsScreen
- Keep current UI but mark backend integration as pending until contact APIs are added.

## 6.8 Offline Queue for Reliability

Create `client/src/services/offlineQueueService.ts`:
- Queue failed multipart or JSON tasks.
- Retry when app comes online.
- Avoid data loss during emergency/no-network situations.

---

## 7. Required Backend Additions for Full Mobile Feature Parity

These features are currently missing in backend and must be added to fully match mobile UI:

1. Trusted contacts CRUD APIs:
- `GET /contacts`
- `POST /contacts`
- `PATCH /contacts/:id`
- `DELETE /contacts/:id`

2. Emergency alert broadcast APIs:
- `POST /alerts/emergency`
- `POST /alerts/live-location`

3. Optional travel checkpoint endpoint (recommended):
- `POST /evidence/travel/checkpoint` for location-only heartbeat without mandatory file upload.

4. Push notification integration:
- Store Expo push token per user.
- Notify trusted contacts/authority when panic triggers.

---

## 8. Data Flow (Victim App -> Blockchain Verification)

1. User authenticates from mobile.
2. Access/refresh tokens are stored securely.
3. User uploads evidence from Upload/Emergency/Travel.
4. Backend validates and stores encrypted file.
5. Backend computes hash and stores evidence metadata.
6. Backend writes hash+timestamp+caseId to blockchain.
7. Evidence status becomes `ON_CHAIN` when transaction succeeds.
8. Authority/Admin dashboards fetch same evidence records.
9. Verification endpoint recalculates hash from stored files and checks chain match.

---

## 9. Environment and Deployment Matrix

## 9.1 Local Dev Ports (avoid conflicts)

- `admin/backend`: set `PORT=5000`
- `authority/backend`: set `PORT=5001`
- `admin/client` Vite: default `5173`
- `authority/frontend` Vite: default `5174`
- `client` Expo: managed by Expo dev server

## 9.2 Mobile Env

Create `client/.env`:

```env
EXPO_PUBLIC_API_BASE_URL=https://<your-admin-backend-domain>/api
EXPO_PUBLIC_WS_URL=wss://<optional-ws-domain>
```

## 9.3 Web Env

- `admin/client`: `VITE_API_BASE_URL=https://<backend-domain>`
- `authority/frontend`: `VITE_API_BASE_URL=https://<backend-domain>/api` (as currently used)

---

## 10. Immediate Security Actions (Critical)

1. Rotate all exposed secrets now:
- MongoDB URI
- Cloudinary API key/secret
- JWT secrets
- Blockchain private key

2. Replace real values in `.env.example` with placeholders only.
3. Enforce HTTPS in production for all clients.
4. Add stricter CORS origin allowlist instead of wildcard behavior.
5. Add login blocking for suspended users (currently login flow does not explicitly deny suspended users).

---

## 11. Implementation Order (No-Error Sequence)

Execute in this exact order:

1. Set backend env and verify `/health`.
2. Add mobile env/config and API client.
3. Add secure auth storage + AuthContext.
4. Implement login/register and session bootstrap.
5. Replace UploadScreen mock calls with real multipart upload.
6. Replace EmergencyScreen mock calls with real emergency upload.
7. Replace EvidenceLocker fetch with backend list API.
8. Replace EvidenceDetail static data with backend detail+verify+share.
9. Add offline queue retry for failed uploads.
10. Add travel integration with session-based batch sealing.
11. Add trusted contacts backend APIs and wire TrustedContacts screen.
12. Run full regression across mobile, admin dashboard, authority dashboard.

---

## 12. Known Code-Level Risks Found During Analysis

1. `admin/backend` invite flow inconsistency:
- Validator requires password fields for invite.
- Controller currently forwards only `name`, `email`, `role`, `invitedBy` to service.
- Service expects password for user creation.
- Fix this mismatch before using invite endpoint in production.

2. `authority/backend` and `admin/backend` are near-duplicate codebases.
- Risk of drift and behavior mismatch over time.
- Long-term recommendation: one backend with role-based routing and deployment profiles.

3. Travel flow expectations mismatch:
- Mobile currently tracks points in memory.
- Backend travel endpoint is multipart/batch-oriented and currently assumes files in processing path.
- Add checkpoint API or adapt payload contract.

---

## 13. 60-Minute Submission Plan

If you only have 1 hour, do this minimum viable real integration:

1. 0-10 min
- Set backend URL in `client/.env`.
- Create `env.ts`, `apiClient.ts`, `authStorage.ts`.

2. 10-20 min
- Implement `authService.ts` + `AuthContext.tsx`.
- Wire login bootstrap.

3. 20-35 min
- Integrate UploadScreen with `/evidence/upload`.
- Integrate EmergencyScreen with `/evidence/emergency`.

4. 35-50 min
- Integrate EvidenceLocker + EvidenceDetail (`list`, `detail`, `verify`).

5. 50-60 min
- Smoke test using one real user account and one authority account.
- Capture screenshots + endpoint test evidence for submission.

---

## 14. Smoke Test Checklist

1. User can register and login from mobile.
2. Access token refresh works after token expiry.
3. Upload evidence returns `success: true` and evidence ID.
4. Emergency upload creates evidence with session metadata.
5. Evidence appears in mobile locker.
6. Same evidence appears in authority/admin dashboard.
7. Verify endpoint returns `status` and hash comparison fields.
8. Share access creates AccessControl record.
9. Logout revokes refresh token and clears mobile session.

---

## 15. Final Recommendation

For this submission:
- Keep `admin/backend` as primary API.
- Connect mobile app directly to that backend first.
- Treat Trusted Contacts + advanced travel checkpoint API as Phase 2 if time is short.

This gives you a true end-to-end demo where victim capture in mobile is visible and verifiable in authority/admin dashboards with blockchain integrity status.
