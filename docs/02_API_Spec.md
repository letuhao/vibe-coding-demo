# 02_API_Spec

## Auth
- POST `/auth/register`
- POST `/auth/login`
- POST `/auth/refresh`

## Categories
- GET `/categories`
- POST `/categories`
- PUT `/categories/:id`
- DELETE `/categories/:id`

## Expenses
- GET `/expenses?from=YYYY-MM-DD&to=YYYY-MM-DD&categoryId=`
- POST `/expenses`
- PUT `/expenses/:id`
- DELETE `/expenses/:id`

## Reports
- GET `/reports/summary?from=YYYY-MM-DD&to=YYYY-MM-DD`
  → trả về tổng hợp theo category/tháng.
