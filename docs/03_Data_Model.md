# 03_Data_Model

## ERD
User (1) --- (n) Expense  
User (1) --- (n) Category  
Category (1) --- (n) Expense  

## Bảng

### User
- id (PK)
- email
- password_hash
- createdAt

### Category
- id (PK)
- userId (FK → User)
- name
- type (enum: expense|income)

### Expense
- id (PK)
- userId (FK → User)
- categoryId (FK → Category)
- amount (decimal)
- note (string)
- date (datetime)
