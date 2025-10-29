# TODO: Fix TypeScript ESLint 'no-explicit-any' Warnings in Test Files

## Steps to Complete

1. **Edit src/pages/LoginContainer.test.tsx**
   - Add import { Mock } from 'vitest';
   - Replace 'as unknown as jest.Mock' with 'as Mock' for useAppDispatch mock.
   - Replace 'as any' with 'as Mock' for loginUser and useAppSelector mocks.

2. **Edit src/store/slices/authSlice.thunk.test.ts**
   - Add import { Mock } from 'vitest';
   - Replace 'as any' with 'as Mock' for all mocked API functions (login, getOwnProfile, register).

3. **Edit src/store/slices/leaderboardsSlice.thunk.test.ts**
   - Add import { Mock } from 'vitest';
   - Replace 'as any' with 'as Mock' for fetchLeaderboards mock.
   - Remove explicit ': any' type annotation for thunk result in rejected test case.

4. **Edit src/store/slices/threadsSlice.test.ts**
   - Add import { Thread } from '../../types/forum';
   - Replace 'as any' with 'as Thread' for mock thread objects.

5. **Run npm run lint**
   - Verify that all 'no-explicit-any' warnings are resolved.

6. **Run tests**
   - Execute npm test or vitest to ensure tests still pass after changes.
