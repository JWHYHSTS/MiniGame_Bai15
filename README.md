# Cầu Nối Không Gian — Xưởng Tự Do V2

Game cá nhân Toán 9, Bài 15: độ dài cung tròn, diện tích hình quạt tròn và hình vành khuyên.

## Mở game / đưa lên GitHub

Giải nén toàn bộ ZIP, mở `index.html` bằng trình duyệt hiện đại. Không cần npm, API hay tải thêm tài nguyên.

Để chơi trên web: upload toàn bộ các tệp BÊN TRONG thư mục `CauNoiKhongGian` lên repository, để `index.html` ngay thư mục gốc. Bật GitHub Pages cho nhánh chứa tệp, thư mục gốc. Khi thay bản cũ, nhớ thêm tệp mới `bridge-engine.js`, thay `app.js`, `index.html`, `style.css` và các hướng dẫn. Tải lại trang sau khi triển khai.

## Sáu map khác nhau

| Map | Địa hình |
|---|---|
| Bến Sao Xanh | Vực thẳng, hai bờ cùng cao, hai neo thấp. |
| Hẻm Núi Hổ Phách | Đảo giữa có đường miễn phí và điểm tựa; xây hai nhịp hai bên. |
| Vườn Tinh Vân | Hai bờ lệch cao 180 đơn vị; cần đường lên dốc. |
| Trạm Vành Khuyên | Hai neo trên cao để thử cầu treo hoặc kết cấu kết hợp. |
| Cực Quang | Khối đá chắn giữa vực; mặt đường phải vượt phía trên, thanh không xuyên đá. |
| Cổng Ngân Hà | Tuyến lệch cao, neo thấp/cao; ba xe tạo tải đồng thời. |

Không có mẫu cầu bắt buộc. Game kiểm tra đường liên tục S–F, độ dốc, va chạm đá, biến dạng và tải kết cấu khi xe chạy. Mô phỏng đàn hồi 2D đơn giản hóa cho trò chơi, không dùng thiết kế công trình thật.

## Xây cầu tự do

1. Giải bốn hồ sơ toán để mở mặt đường, hợp kim, cáp và chạy thử. Mỗi câu đúng nhận 180 vật liệu, 100 điểm toán; có 100 vật liệu ban đầu, tổng 820 sau bốn câu.
2. Chọn Mặt đường, chạm S rồi chạm điểm trống để tạo nút và nối. Tiếp tục chạm để nối liên tiếp, hoặc kéo giữa hai điểm. Không cần xây theo nét gợi ý.
3. Dùng hợp kim/cáp để chống hoặc treo kết cấu. Nút vuông vàng là neo cố định. Nút tròn bạn tạo không tự được cố định.
4. Bấm Chạy thử sau bốn câu. Xe tới đích là vượt màn. Thử hỏng rồi sửa không trừ điểm xây dựng.

### Công cụ

- Điểm mới: chạm vùng trống. Đặt chính xác trên thanh sẽ chia thanh và tạo nút chung.
- Di chuyển: kéo nút tự tạo; neo cố định không kéo được.
- Tháo: chạm giữa thanh để tháo, hoặc chạm nút tự tạo để xóa nút cùng thanh liên quan.
- Hoàn tác: phục hồi thao tác xây, không xóa phần thưởng toán.
- Xóa bản vẽ: thu hồi vật liệu, giữ câu đã giải và kỷ lục.
- Khôi phục kỷ lục: nạp lại thiết kế đạt điểm tốt nhất.
- Bám lưới 20: bật/tắt tùy ý. Mục tọa độ cho phép nhập chính xác X, Y.
- Phóng to: kéo thanh trượt, cuộn trong vùng bản vẽ. Điện thoại nên xoay ngang khi cần vùng xây rộng.
- Esc: bỏ chọn điểm đang nối.

Tối đa 40 điểm, 100 thanh. Chiều dài tối đa: mặt đường 180, hợp kim 340, cáp 540 (đơn vị game). Đường xe chạy tiến từ trái sang phải; độ dốc không quá 0,72 theo tỉ số cao/ngang trước mô phỏng. Thanh cắt nhau chỉ liên kết khi có nút chung. Xe không chạy trên hợp kim/cáp thay mặt đường.

## Vật liệu và điểm

Vật liệu dùng = tổng (chiều dài thực của thanh × đơn giá).

| Loại | Giá / đơn vị dài |
|---|---:|
| Mặt đường | 0,32 |
| Hợp kim | 0,20 |
| Cáp | 0,11 |
| Đường có sẵn trên đảo | 0 |

Không làm tròn theo từng thanh. Chia nhỏ thanh không làm rẻ hơn. Tháo hoàn 100% vật liệu; thanh thừa vẫn được tính chi phí.

- Điểm tiết kiệm = làm tròn[1000 × (1 − vật liệu dùng / 820)], tối thiểu 0.
- Điểm lượt đạt = điểm toán + điểm tiết kiệm, chỉ ghi sau khi toàn bộ xe qua cầu.
- Kỷ lục map = điểm tốt nhất từng đạt. Tổng hành trình = tổng sáu kỷ lục; không cộng lặp các lần chơi.
- Chơi lại từ đầu vẫn giữ kỷ lục và bản thiết kế tốt nhất.
- 3 sao: từ 550 điểm tiết kiệm; 2 sao: từ 300; còn lại 1 sao.
- Thử cầu hỏng không trừ điểm hoặc năng lượng. Sai toán/hết giờ vẫn trừ 20 năng lượng.

Ví dụ cùng đạt 400 điểm toán: cầu dùng 400 vật liệu được 912 điểm tổng; giảm còn 300 và vẫn qua được sẽ đạt 1034 điểm.

## Các tính năng giữ lại

6 màn × 4 câu; 90 giây/câu mặc định; gợi ý không lộ đáp án; đúng hai câu thêm một gợi ý; năng lượng; tên/màu robot; lưu/tiếp tục; nhạc riêng từng màn và âm lượng; power hồi 50 năng lượng, thêm 30 giây, xem thiết kế tham khảo 12 giây, tăng độ cứng 30%; giảm chuyển động; giáo viên xem lời giải/thử màn; xuất CSV.

Giáo viên phải nhập mật khẩu mỗi lần mở khu vực riêng. Đây là khóa giao diện game tĩnh, không phải xác thực máy chủ. Không lưu trạng thái mở khóa sau tải lại trang.

## Dữ liệu và nâng cấp

Tại cùng địa chỉ đã chơi V1, game chuyển câu đã làm, thời gian, năng lượng, tên và màn đã mở sang V2. Cầu V1 dùng lưới cố định nên không chuyển; ngân sách tính lại từ số câu đã giải. Kỷ lục V2 bắt đầu mới. Dữ liệu V1 không bị xóa.

Chơi từ tệp và GitHub Pages có vùng lưu khác nhau. Không đồng bộ giữa thiết bị. Xóa dữ liệu trình duyệt sẽ xóa tiến độ. Game không gửi dữ liệu học sinh lên máy chủ.

Âm thanh tổng hợp bằng Web Audio sau tương tác đầu tiên, hình ảnh Canvas/SVG. Không dùng ảnh SGK hoặc nhạc thương mại. ALGY dùng hướng dẫn có sẵn, không gọi AI trực tuyến.

## Tệp chính

`index.html`, `style.css`, `questions.js`, `bridge-engine.js`, `app.js`, `assets/icon.svg`, `.nojekyll`. Thư mục `preview` chứa ảnh xem trước. Xem thêm hướng dẫn giáo viên và ghi chú kiểm tra.
