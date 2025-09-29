# 04_Categories_Spec.md - Đặc Tả Kịch Bản Test Categories Management

## 📋 Thông Tin Cơ Bản

- **ID**: `CAT-001`
- **Tên File**: `categories.spec.ts`
- **Mô Tả**: Kịch bản test cho quản lý Categories của ứng dụng
- **Mục Tiêu**: Kiểm tra CRUD operations cho categories
- **Loại Test**: End-to-End (E2E)
- **Framework**: Playwright

## 🎯 Mục Tiêu Test

Kiểm tra toàn bộ chức năng quản lý categories bao gồm:

- Hiển thị danh sách categories
- Tạo category mới
- Chỉnh sửa category
- Xóa category
- Filtering theo type
- Validation form
- Error handling
- Responsive design

## 📝 Danh Sách Test Cases

### 1. **CAT-TC-001**: Categories Page Elements

- **Mô tả**: Kiểm tra các elements chính của trang categories
- **Steps**:
  1. Truy cập `/categories`
  2. Kiểm tra heading "Categories" hiển thị
  3. Kiểm tra button "Add" hiển thị
- **Expected**: Categories page load với các elements chính

### 2. **CAT-TC-002**: Open Create Category Form

- **Mô tả**: Kiểm tra mở form tạo category mới
- **Steps**:
  1. Truy cập `/categories`
  2. Click button "Add Category"
  3. Kiểm tra form elements hiển thị:
     - Category name input
     - Category type select
     - Save button
     - Cancel button
- **Expected**: Form tạo category hiển thị đầy đủ

### 3. **CAT-TC-003**: Create New Category

- **Mô tả**: Kiểm tra tạo category mới thành công
- **Steps**:
  1. Truy cập `/categories`
  2. Click "Add Category"
  3. Fill form:
     - Name: "Test Category"
     - Type: "EXPENSE"
  4. Click "Save"
  5. Kiểm tra category xuất hiện trong list
- **Expected**: Category được tạo thành công và hiển thị trong list

### 4. **CAT-TC-004**: Empty Category Name Validation

- **Mô tả**: Kiểm tra validation cho category name trống
- **Steps**:
  1. Truy cập `/categories`
  2. Click "Add Category"
  3. Submit form với name trống
  4. Kiểm tra error message
- **Expected**: Hiển thị lỗi "Category name is required"

### 5. **CAT-TC-005**: Cancel Category Creation

- **Mô tả**: Kiểm tra hủy tạo category
- **Steps**:
  1. Truy cập `/categories`
  2. Click "Add Category"
  3. Fill một số field
  4. Click "Cancel"
  5. Kiểm tra form đóng
- **Expected**: Form đóng và không tạo category

### 6. **CAT-TC-006**: Edit Existing Category

- **Mô tả**: Kiểm tra chỉnh sửa category có sẵn
- **Steps**:
  1. Truy cập `/categories`
  2. Tìm edit button của category đầu tiên
  3. Click edit button
  4. Kiểm tra form mở với data hiện tại
  5. Update name thành "Updated Category"
  6. Click "Save"
  7. Kiểm tra category được update
- **Expected**: Category được update thành công

### 7. **CAT-TC-007**: Delete Category

- **Mô tả**: Kiểm tra xóa category
- **Steps**:
  1. Truy cập `/categories`
  2. Tìm delete button của category đầu tiên
  3. Click delete button
  4. Confirm deletion trong dialog
  5. Kiểm tra category bị xóa
- **Expected**: Category bị xóa và hiển thị success message

### 8. **CAT-TC-008**: Filter by Type

- **Mô tả**: Kiểm tra filter categories theo type
- **Steps**:
  1. Truy cập `/categories`
  2. Tìm filter dropdown "Filter by Type"
  3. Select "EXPENSE"
  4. Kiểm tra chỉ hiển thị expense categories
- **Expected**: Chỉ hiển thị categories có type EXPENSE

### 9. **CAT-TC-009**: Category Statistics

- **Mô tả**: Kiểm tra hiển thị thống kê categories
- **Steps**:
  1. Truy cập `/categories`
  2. Tìm statistics section
  3. Kiểm tra "Total Categories" hiển thị
- **Expected**: Statistics section hiển thị với data

### 10. **CAT-TC-010**: Duplicate Category Name Error

- **Mô tả**: Kiểm tra lỗi khi tạo category với tên đã tồn tại
- **Steps**:
  1. Truy cập `/categories`
  2. Click "Add Category"
  3. Fill form với tên đã tồn tại: "Existing Category"
  4. Select type "EXPENSE"
  5. Click "Save"
  6. Kiểm tra error message
- **Expected**: Hiển thị lỗi "Category with this name already exists"

### 11. **CAT-TC-011**: Mobile Responsiveness

- **Mô tả**: Kiểm tra responsive design trên mobile
- **Steps**:
  1. Set mobile viewport (375x667)
  2. Truy cập `/categories`
  3. Kiểm tra page vẫn accessible
- **Expected**: Categories page responsive trên mobile

## 🔧 Test Data

### Valid Category Data

```javascript
const validCategory = {
  name: "Test Category",
  type: "EXPENSE",
};

const incomeCategory = {
  name: "Test Income",
  type: "INCOME",
};
```

### Invalid Test Data

```javascript
const invalidData = {
  emptyName: "",
  duplicateName: "Existing Category",
  invalidType: "INVALID_TYPE",
};
```

### Category Types

```javascript
const categoryTypes = {
  EXPENSE: "EXPENSE",
  INCOME: "INCOME",
};
```

## 🎭 Test Scenarios

### Happy Path

1. User truy cập categories page → Hiển thị danh sách
2. User click "Add Category" → Form mở
3. User fill form hợp lệ → Submit thành công
4. Category xuất hiện trong list
5. User có thể edit/delete category

### Error Scenarios

1. Submit form trống → Show validation errors
2. Submit tên trùng lặp → Show duplicate error
3. Delete category → Show confirmation dialog
4. Filter không có data → Show empty state

## 📊 Expected Results

- **Total Test Cases**: 11
- **Success Criteria**: Tất cả test cases pass
- **Coverage**: 100% categories management functionality
- **Performance**: Mỗi operation hoàn thành trong < 3 giây

## 🚨 Known Issues

- Test cases giả định có categories có sẵn để test edit/delete
- Một số elements có thể không tồn tại nếu chưa implement
- Duplicate name test có thể fail nếu không có data test
- Mobile responsiveness có thể không chính xác

## 📝 Notes

- Tests sử dụng conditional checks cho optional elements
- Screenshots có thể được capture cho debugging
- Tests có thể chạy parallel
- Cần setup test data trước khi chạy tests

## 🔗 Dependencies

- Categories API phải hoạt động với CRUD operations
- Authentication system phải hoạt động
- Form validation phải được implement
- Responsive CSS phải được implement
- Database constraints phải được setup đúng

## 🎯 Business Rules

### Category Validation Rules

1. Category name là bắt buộc
2. Category name phải unique trong cùng user
3. Category type phải là EXPENSE hoặc INCOME
4. Không thể xóa category đang được sử dụng bởi expenses

### Category Types

- **EXPENSE**: Dành cho các khoản chi tiêu
- **INCOME**: Dành cho các khoản thu nhập

## 🔄 Integration Points

- Categories được sử dụng trong Expenses form
- Categories có thể được filter trong Expenses page
- Category statistics được hiển thị trong Dashboard
- Category deletion có thể ảnh hưởng đến Expenses
