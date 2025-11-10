# Testing Guide

Complete testing guide for AuthorStack.

## 🧪 Test Setup

### Install Dependencies

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📁 Test Structure

```
__tests__/
├── api/
│   └── dashboard-overview.test.ts  # API integration tests
└── utils/
    └── forecast.test.ts            # Unit tests
```

## 🧪 Unit Tests

### Forecast Utilities

Test file: `__tests__/utils/forecast.test.ts`

**Tests**:
- `calculateMovingAverage`: Calculates moving average correctly
- `calculateLinearRegressionForecast`: Calculates linear regression forecast
- `calculateStandardDeviation`: Calculates standard deviation
- `calculateConfidenceInterval`: Calculates confidence interval
- `determineTrend`: Detects trends correctly
- `aggregateDailyRevenue`: Aggregates revenue by date
- `generateForecast`: Generates forecast with sufficient data

**Run**:
```bash
npm test -- forecast.test.ts
```

## 🔌 Integration Tests

### API Endpoints

Test file: `__tests__/api/dashboard-overview.test.ts`

**Tests**:
- Unauthorized access returns 401
- Empty data returns empty response
- Sales data aggregation works correctly

**Run**:
```bash
npm test -- dashboard-overview.test.ts
```

## 📊 Test Coverage

### Current Coverage

- **Forecast Utilities**: ~80% coverage
- **API Endpoints**: ~60% coverage (basic tests)
- **Components**: 0% coverage (to be added)

### Coverage Goals

- **Minimum**: 50% overall coverage
- **Target**: 70% overall coverage
- **Ideal**: 80%+ overall coverage

## 🚀 Running Tests

### Local Development

```bash
# Run all tests
npm test

# Run specific test file
npm test -- forecast.test.ts

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### CI/CD

Tests run automatically in GitHub Actions on:
- Push to main/develop
- Pull requests

## 📝 Writing Tests

### Unit Test Example

```typescript
import { calculateMovingAverage } from '@/lib/utils/forecast';

describe('calculateMovingAverage', () => {
  it('should calculate moving average', () => {
    const data = [10, 20, 30, 40, 50];
    const result = calculateMovingAverage(data, 3);
    expect(result).toBe(40);
  });
});
```

### Integration Test Example

```typescript
import { GET } from '@/app/api/dashboard/overview/route';

describe('/api/dashboard/overview', () => {
  it('should return 401 if unauthorized', async () => {
    const response = await GET();
    expect(response.status).toBe(401);
  });
});
```

## ✅ Test Checklist

- [ ] Unit tests for utility functions
- [ ] Integration tests for API endpoints
- [ ] Component tests (to be added)
- [ ] E2E tests (to be added)
- [ ] Test coverage above 50%
- [ ] All tests passing in CI
- [ ] Tests run on every PR

## 🐛 Troubleshooting

### Tests Not Running

**Issue**: Tests fail to run

**Solutions**:
1. Check Jest is installed: `npm list jest`
2. Check jest.config.js is correct
3. Check test files are in `__tests__` directory
4. Check test file names end with `.test.ts`

### Mock Issues

**Issue**: Mocks not working

**Solutions**:
1. Check mocks are in `jest.setup.js`
2. Check mock imports are correct
3. Check mock implementations match actual code

### Coverage Issues

**Issue**: Coverage not generating

**Solutions**:
1. Check `--coverage` flag is used
2. Check `collectCoverageFrom` in jest.config.js
3. Check coverage directory is not ignored

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library](https://testing-library.com/)
- [Next.js Testing](https://nextjs.org/docs/testing)

---

**Status**: ✅ Basic Tests Implemented
**Last Updated**: 2024-01-XX

