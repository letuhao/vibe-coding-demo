# 05_Rules

## Code Style
- TypeScript strict mode
- ESLint + Prettier
- No any, no implicit any

## Architecture
- NestJS modules per resource
- DTO validated bằng class-validator
- Repository pattern qua Prisma

## Testing
- UT coverage ≥ 70%
- Integration cho endpoints quan trọng
- E2E smoke test (happy path)

## Docs
- Mỗi module có README.md
- API có curl samples
- PR bắt buộc update docs

## Security
- Không hardcode secret
- Mọi input validate
- Auth bắt buộc với mọi endpoint trừ /auth/*
