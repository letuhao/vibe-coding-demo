# 03_Expenses_Spec.md - Đặc Tả Kịch Bản Test Expenses Management

## 📋 Thông Tin Cơ Bản

- **ID**: `EXP-001`
- **Tên File**: `expenses.spec.ts`
- **Mô Tả**: Kịch bản test cho quản lý Expenses của ứng dụng
- **Mục Tiêu**: Kiểm tra CRUD operations và filtering cho expenses
- **Loại Test**: End-to-End (E2E)
- **Framework**: Playwright

## 🎯 Mục Tiêu Test

Kiểm tra toàn bộ chức năng quản lý expenses bao gồm:

- Hiển thị danh sách expenses
- Tạo expense mới
- Chỉnh sửa expense
- Xóa expense
- Filtering và searching
- Pagination và sorting
- Validation form
- Responsive design

## 📝 Danh Sách Test Cases

### 1. **EXP-TC-001**: Expenses Page Elements

- **Mô tả**: Kiểm tra các elements chính của trang expenses
- **Steps**:
  1. Truy cập `/expenses`
  2. Kiểm tra heading "Expenses" hiển thị
  3. Kiểm tra button "Add" hiển thị
- **Expected**: Expenses page load với các elements chính

### 2. **EXP-TC-002**: Open Create Expense Form

- **Mô tả**: Kiểm tra mở form tạo expense mới
- **Steps**:
  1. Truy cập `/expenses`
  2. Click button "Add Expense"
  3. Kiểm tra form elements hiển thị:
     - Amount input
     - Category select
     - Date input
     - Note textarea
     - Save button
     - Cancel button
- **Expected**: Form tạo expense hiển thị đầy đủ

### 3. **EXP-TC-003**: Create New Expense

- **Mô tả**: Kiểm tra tạo expense mới thành công
- **Steps**:
  1. Truy cập `/expenses`
  2. Click "Add Expense"
  3. Fill form:
     - Amount: "100.50"
     - Category: Select option "1"
     - Date: "2024-01-15"
     - Note: "Test expense"
  4. Click "Save"
  5. Kiểm tra expense xuất hiện trong list
- **Expected**: Expense được tạo thành công và hiển thị trong list

### 4. **EXP-TC-004**: Invalid Amount Validation

- **Mô tả**: Kiểm tra validation cho amount không hợp lệ
- **Steps**:
  1. Truy cập `/expenses`
  2. Click "Add Expense"
  3. Fill form với amount âm: "-10"
  4. Fill các field khác hợp lệ
  5. Click "Save"
- **Expected**: Hiển thị lỗi "Amount must be greater than 0"

### 5. **EXP-TC-005**: Empty Required Fields Validation

- **Mô tả**: Kiểm tra validation cho các field bắt buộc
- **Steps**:
  1. Truy cập `/expenses`
  2. Click "Add Expense"
  3. Submit form trống
  4. Kiểm tra error messages
- **Expected**: Hiển thị lỗi cho các field bắt buộc:
  - "Amount is required"
  - "Category is required"
  - "Date is required"

### 6. **EXP-TC-006**: Cancel Expense Creation

- **Mô tả**: Kiểm tra hủy tạo expense
- **Steps**:
  1. Truy cập `/expenses`
  2. Click "Add Expense"
  3. Fill một số field
  4. Click "Cancel"
  5. Kiểm tra form đóng
- **Expected**: Form đóng và không tạo expense

### 7. **EXP-TC-007**: Edit Existing Expense

- **Mô tả**: Kiểm tra chỉnh sửa expense có sẵn
- **Steps**:
  1. Truy cập `/expenses`
  2. Tìm edit button của expense đầu tiên
  3. Click edit button
  4. Kiểm tra form mở với data hiện tại
  5. Update amount thành "150.75"
  6. Click "Save"
  7. Kiểm tra expense được update
- **Expected**: Expense được update thành công

### 8. **EXP-TC-008**: Delete Expense

- **Mô tả**: Kiểm tra xóa expense
- **Steps**:
  1. Truy cập `/expenses`
  2. Tìm delete button của expense đầu tiên
  3. Click delete button
  4. Confirm deletion trong dialog
  5. Kiểm tra expense bị xóa
- **Expected**: Expense bị xóa và hiển thị success message

### 9. **EXP-TC-009**: Filter by Category

- **Mô tả**: Kiểm tra filter expenses theo category
- **Steps**:
  1. Truy cập `/expenses`
  2. Tìm filter dropdown "Filter by Category"
  3. Select category "1"
  4. Kiểm tra chỉ hiển thị expenses của category đó
- **Expected**: Chỉ hiển thị expenses thuộc category được chọn

### 10. **EXP-TC-010**: Filter by Date Range

- **Mô tả**: Kiểm tra filter expenses theo khoảng thời gian
- **Steps**:
  1. Truy cập `/expenses`
  2. Tìm start date và end date inputs
  3. Set date range: "2024-01-01" đến "2024-01-31"
  4. Click "Apply Filter"
  5. Kiểm tra filtered results
- **Expected**: Chỉ hiển thị expenses trong khoảng thời gian

### 11. **EXP-TC-011**: Search by Note

- **Mô tả**: Kiểm tra tìm kiếm expenses theo note
- **Steps**:
  1. Truy cập `/expenses`
  2. Tìm search input
  3. Nhập "test" vào search box
  4. Press Enter
  5. Kiểm tra search results
- **Expected**: Hiển thị expenses có note chứa "test"

### 12. **EXP-TC-012**: Expense Statistics

- **Mô tả**: Kiểm tra hiển thị thống kê expenses
- **Steps**:
  1. Truy cập `/expenses`
  2. Tìm statistics section
  3. Kiểm tra "Total Expenses" hiển thị
- **Expected**: Statistics section hiển thị với data

### 13. **EXP-TC-013**: Pagination

- **Mô tả**: Kiểm tra pagination cho danh sách expenses
- **Steps**:
  1. Truy cập `/expenses`
  2. Tìm "Next" button
  3. Click "Next"
  4. Kiểm tra page indicator "Page 2"
- **Expected**: Pagination hoạt động đúng

### 14. **EXP-TC-014**: Sort by Amount

- **Mô tả**: Kiểm tra sắp xếp expenses theo amount
- **Steps**:
  1. Truy cập `/expenses`
  2. Tìm sort dropdown
  3. Select "Amount Descending"
  4. Kiểm tra expenses được sắp xếp
- **Expected**: Expenses được sắp xếp theo amount giảm dần

### 15. **EXP-TC-015**: Mobile Responsiveness

- **Mô tả**: Kiểm tra responsive design trên mobile
- **Steps**:
  1. Set mobile viewport (375x667)
  2. Truy cập `/expenses`
  3. Kiểm tra page vẫn accessible
- **Expected**: Expenses page responsive trên mobile

## 🔧 Test Data

### Valid Expense Data

```javascript
const validExpense = {
  amount: "100.50",
  categoryId: "1",
  date: "2024-01-15",
  note: "Test expense",
};
```

### Invalid Test Data

```javascript
const invalidData = {
  negativeAmount: "-10",
  emptyAmount: "",
  emptyCategory: "",
  emptyDate: "",
  invalidDate: "invalid-date",
};
```

### Filter Data

```javascript
const filterData = {
  categoryId: "1",
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  searchTerm: "test",
};
```

## 🎭 Test Scenarios

### Happy Path

1. User truy cập expenses page → Hiển thị danh sách
2. User click "Add Expense" → Form mở
3. User fill form hợp lệ → Submit thành công
4. Expense xuất hiện trong list
5. User có thể edit/delete expense

### Error Scenarios

1. Submit form trống → Show validation errors
2. Submit amount âm → Show amount error
3. Delete expense → Show confirmation dialog
4. Filter không có data → Show empty state

## 📊 Expected Results

- **Total Test Cases**: 15
- **Success Criteria**: Tất cả test cases pass
- **Coverage**: 100% expenses management functionality
- **Performance**: Mỗi operation hoàn thành trong < 3 giây

## 🚨 Known Issues

- Test cases giả định có categories và expenses có sẵn
- Một số elements có thể không tồn tại nếu chưa implement
- Pagination test có thể fail nếu không đủ data
- Mobile responsiveness có thể không chính xác

## 📝 Notes

- Tests sử dụng conditional checks cho optional elements
- Screenshots có thể được capture cho debugging
- Tests có thể chạy parallel
- Cần setup test data trước khi chạy tests

## 🔗 Dependencies

- Categories API phải hoạt động
- Expenses API phải có CRUD operations
- Authentication system phải hoạt động
- Form validation phải được implement
- Responsive CSS phải được implement
