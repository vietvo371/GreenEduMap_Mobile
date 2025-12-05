#!/bin/bash

# Đường dẫn đến ảnh gốc (thay thế path_to_original_image.png bằng đường dẫn thật)
ORIGINAL_IMAGE="./src/assets/images/logo.png"
OUTPUT_DIR="ios/GreenEduMapApp/Images.xcassets/AppIcon.appiconset"

# Tạo các icon với kích thước khác nhau
sips -z 40 40 "${ORIGINAL_IMAGE}" --out "${OUTPUT_DIR}/Icon-40.png"
sips -z 60 60 "${ORIGINAL_IMAGE}" --out "${OUTPUT_DIR}/Icon-60.png"
sips -z 58 58 "${ORIGINAL_IMAGE}" --out "${OUTPUT_DIR}/Icon-58.png"
sips -z 87 87 "${ORIGINAL_IMAGE}" --out "${OUTPUT_DIR}/Icon-87.png"
sips -z 80 80 "${ORIGINAL_IMAGE}" --out "${OUTPUT_DIR}/Icon-80.png"
sips -z 120 120 "${ORIGINAL_IMAGE}" --out "${OUTPUT_DIR}/Icon-120.png"
sips -z 180 180 "${ORIGINAL_IMAGE}" --out "${OUTPUT_DIR}/Icon-180.png"

# Icon 1024x1024 phải không có alpha channel (yêu cầu của App Store)
sips -z 1024 1024 "${ORIGINAL_IMAGE}" --out "${OUTPUT_DIR}/Icon-1024-temp.png"
# Xóa alpha channel bằng cách convert qua JPEG rồi quay lại PNG
sips -s format jpeg "${OUTPUT_DIR}/Icon-1024-temp.png" --out "${OUTPUT_DIR}/Icon-1024-temp.jpg"
sips -s format png "${OUTPUT_DIR}/Icon-1024-temp.jpg" --out "${OUTPUT_DIR}/Icon-1024.png"
# Xóa các file tạm
rm "${OUTPUT_DIR}/Icon-1024-temp.png" "${OUTPUT_DIR}/Icon-1024-temp.jpg"

echo "Icon generation completed!"
echo "✓ All icons generated successfully"
echo "✓ Icon-1024.png has no alpha channel (App Store requirement)"
