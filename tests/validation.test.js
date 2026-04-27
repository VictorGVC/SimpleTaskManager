// Integration tests for task validation via API
// Run with: npm test

const BASE_URL = 'http://localhost:3000/api/trpc';

describe('Task Validation API Tests', () => {
  beforeAll(() => {
    // Ensure the dev server is running before running these tests
    console.log('Make sure the dev server is running on http://localhost:3000');
  });

  test('should accept valid task input', async () => {
    const response = await fetch(`${BASE_URL}/task.create?batch=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        0: {
          json: {
            titulo: 'Valid Task Title',
            descricao: 'Valid description'
          }
        }
      })
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data[0].result).toBeDefined();
  });

  test('should reject empty titulo', async () => {
    const response = await fetch(`${BASE_URL}/task.create?batch=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        0: {
          json: {
            titulo: '',
            descricao: 'Description'
          }
        }
      })
    });

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data[0].error).toBeDefined();
  });

  test('should reject missing titulo', async () => {
    const response = await fetch(`${BASE_URL}/task.create?batch=1`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        0: {
          json: {
            descricao: 'Description only'
          }
        }
      })
    });

    const data = await response.json();
    expect(response.status).toBe(400);
    expect(data[0].error).toBeDefined();
  });
});
