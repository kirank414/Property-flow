/**
 * Zillow Authentication Integration Tests Specification
 * Future testing suite: Run using Jest / Supertest
 */

describe('POST /api/v1/auth/register', () => {
  it('should register a new tenant user successfully and hash passwords using Argon2id', async () => {
    // Boilerplate for testing user registration:
    // 1. Send register payload.
    // 2. Expect 201 Created and JWT tokens.
    // 3. Verify user has Tenant role link.
  });

  it('should fail registration if email format is invalid', async () => {
    // 1. Send body with invalid email.
    // 2. Expect 400 Bad Request from Zod validation.
  });
});

describe('POST /api/v1/auth/login', () => {
  it('should authenticate user and return secure HTTP-only cookies', async () => {
    // 1. Send credentials.
    // 2. Expect 200 OK, return access token in body, refresh token in cookie.
  });
});
