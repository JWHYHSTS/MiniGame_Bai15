/* Câu hỏi tự biên soạn theo phạm vi Bài 15, Toán 9 KNTT, trang 91–95. */
const MAPS = [
 {name:'Bến Sao Xanh',tag:'Độ dài cung tròn',color:'#54edc7',sky:'#12384c',planet:'#5bcbbf',spans:4,load:2,desc:'Dựng cây cầu đầu tiên giữa hai đảo xanh.'},
 {name:'Hẻm Núi Hổ Phách',tag:'Cung lớn & chuyển động',color:'#ffbf69',sky:'#51343b',planet:'#df8b49',spans:5,load:2,desc:'Đưa xe thám hiểm qua thung lũng cát sao.'},
 {name:'Vườn Tinh Vân',tag:'Diện tích hình quạt',color:'#cba0ff',sky:'#372b65',planet:'#a188df',spans:5,load:3,desc:'Chế tạo những tấm ghép dưới vòm tinh vân.'},
 {name:'Trạm Vành Khuyên',tag:'Diện tích vành khuyên',color:'#75c7ff',sky:'#173b69',planet:'#6baee2',spans:6,load:3,desc:'Nối các trạm nghiên cứu trên quỹ đạo băng.'},
 {name:'Cực Quang',tag:'Vận dụng thực tế',color:'#fa93be',sky:'#493451',planet:'#e09cc2',spans:6,load:4,desc:'Tính vật liệu và hoàn thiện tuyến đường ánh sáng.'},
 {name:'Cổng Ngân Hà',tag:'Thử thách tổng hợp',color:'#ffe598',sky:'#353356',planet:'#d9c391',spans:7,load:4,desc:'Xây cây cầu cuối cùng cho đoàn xe tiếp tế.'}
];
const Q=(text,answer,unit,hint,solution,diagram,options=null)=>({text,answer,unit,hint,solution,diagram,options});
const QUESTIONS=[
 [Q('Bánh xe robot có bán kính 3 dm. Chu vi bánh xe bằng bao nhiêu π dm?',6,'π dm','Chu vi đường tròn C = 2πR.','C = 2π × 3 = 6π (dm).',{type:'circle',R:3},[3,6,9,12]),
 Q('Thanh cầu cong là cung 60° của đường tròn bán kính 12 m. Độ dài thanh bằng bao nhiêu π m?',4,'π m','Lấy 60/360 của chu vi đường tròn.','l = (60/180) × π × 12 = 4π (m).',{type:'sector',R:12,n:60}),
 Q('Một thanh viền là cung 90° của đường tròn bán kính 8 m. Độ dài thanh bằng bao nhiêu π m?',4,'π m','Cung 90° chiếm một phần tư đường tròn.','l = (90/180) × π × 8 = 4π (m).',{type:'sector',R:8,n:90},[2,4,8,16]),
 Q('Đường ray có dạng nửa đường tròn bán kính 5 m. Độ dài ray bằng bao nhiêu mét? Lấy π ≈ 3,14.',15.7,'m','Nửa đường tròn có số đo cung 180°.','l = π × 5 ≈ 15,7 (m).',{type:'sector',R:5,n:180})],
 [Q('Hai đầu A, B chia đường tròn bán kính 6 m thành cung nhỏ 120° và cung lớn. Độ dài cung lớn AB bằng bao nhiêu π m?',8,'π m','Tính số đo cung lớn bằng 360° trừ số đo cung nhỏ.','Cung lớn: 360° − 120° = 240°. l = (240/180) × π × 6 = 8π (m).',{type:'sector',R:6,n:240},[4,8,12,16]),
 Q('Một thanh cong dài 5π m, thuộc đường tròn bán kính 15 m. Số đo cung tương ứng là bao nhiêu độ?',60,'°','Từ l = nπR/180, suy ra n = 180l/(πR).','n = (180 × 5π)/(15π) = 60°.',{type:'sector',R:15,n:60,hideN:true}),
 Q('Một cung 120° dài 6π m. Bán kính đường tròn chứa cung đó bằng bao nhiêu mét?',9,'m','Thay l và n vào l = nπR/180 rồi tìm R.','R = (180 × 6π)/(120π) = 9 (m).',{type:'sector',R:9,n:120,hideR:true}),
 Q('Bánh xe bán kính 0,4 m lăn không trượt đúng 10 vòng. Xe đi được bao nhiêu mét? Lấy π ≈ 3,14.',25.12,'m','Quãng đường bằng số vòng nhân với chu vi bánh xe.','s = 10 × 2 × 3,14 × 0,4 = 25,12 (m).',{type:'circle',R:0.4})],
 [Q('Tấm pin hình quạt tròn bán kính 6 m, góc ở tâm 60°. Diện tích tấm pin bằng bao nhiêu π m²?',6,'π m²','Diện tích quạt tròn S = (n/360)πR².','S = (60/360) × π × 6² = 6π (m²).',{type:'sector',R:6,n:60},[3,6,12,36]),
 Q('Một tấm ghép hình quạt có bán kính 8 m và độ dài cung 5π m. Diện tích tấm ghép bằng bao nhiêu π m²?',20,'π m²','Có thể dùng S = lR/2 khi đã biết độ dài cung.','S = (5π × 8)/2 = 20π (m²).',{type:'sector',R:8,n:112.5,hideN:true}),
 Q('Một vùng hình quạt chiếm 25% diện tích hình tròn. Góc ở tâm của vùng đó bằng bao nhiêu độ?',90,'°','Tỉ lệ diện tích quạt bằng n/360.','n = 25% × 360° = 90°.',{type:'sector',R:5,n:90,hideR:true,hideN:true},[45,60,90,180]),
 Q('Tấm ghép hình quạt 90° có diện tích 16π m². Bán kính của tấm ghép bằng bao nhiêu mét?',8,'m','Thay n và S vào công thức; tìm R² trước, rồi lấy căn bậc hai dương.','16π = (90/360)πR² ⇒ R² = 64 ⇒ R = 8 (m).',{type:'sector',R:8,n:90,hideR:true})],
 [Q('Một vòng đệm có bán kính ngoài 7 cm và bán kính trong 5 cm. Diện tích vòng đệm bằng bao nhiêu π cm²?',24,'π cm²','Lấy diện tích hình tròn lớn trừ diện tích hình tròn nhỏ.','S = π(7² − 5²) = 24π (cm²).',{type:'ring',R:7,r:5},[4,12,24,144]),
 Q('Vành khuyên có bán kính ngoài 10 m và diện tích 64π m². Bán kính trong bằng bao nhiêu mét?',6,'m','Dùng 64 = 10² − r²; tìm r² rồi tìm r.','r² = 100 − 64 = 36 ⇒ r = 6 (m).',{type:'ring',R:10,r:6,hideInner:true}),
 Q('Một tấm vành khuyên có bán kính ngoài 3 m, trong 1 m. Sơn tấm này hết 20 nghìn đồng/m². Chi phí bao nhiêu nghìn đồng? Lấy π ≈ 3,14.',502.4,'nghìn đồng','Tính diện tích vành khuyên trước, rồi nhân với đơn giá.','S = 3,14(3² − 1²) = 25,12 m². Chi phí = 25,12 × 20 = 502,4 nghìn đồng.',{type:'ring',R:3,r:1}),
 Q('Vành khuyên có bán kính ngoài 10 m, trong 6 m. Diện tích vành khuyên bằng bao nhiêu phần trăm diện tích hình tròn ngoài?',64,'%','Tính (R² − r²)/R² rồi nhân 100%.','(10² − 6²)/10² × 100% = 64%.',{type:'ring',R:10,r:6},[36,40,64,80])],
 [Q('Hai tấm quạt A và B có cùng bán kính 6 m, góc ở tâm lần lượt 120° và 90°. Diện tích A lớn hơn B bao nhiêu π m²?',3,'π m²','Có thể tính phần chênh lệch như một quạt có góc 120° − 90°.','ΔS = ((120 − 90)/360) × π × 6² = 3π (m²).',{type:'sector',R:6,n:120}),
 Q('Mặt cầu là một nửa hình vành khuyên, có bán kính ngoài 5 m, trong 3 m. Diện tích mặt cầu bằng bao nhiêu π m²?',8,'π m²','Lấy một nửa diện tích hình vành khuyên tương ứng.','S = π(5² − 3²)/2 = 8π (m²).',{type:'halfRing',R:5,r:3},[4,8,16,32]),
 Q('Xe chạy hết cung 150° trên đường tròn bán kính 12 m. Quãng đường bằng bao nhiêu mét? Lấy π ≈ 3,14.',31.4,'m','Quãng đường chính là độ dài cung, không phải đoạn thẳng nối hai đầu.','l = (150/180) × 3,14 × 12 = 31,4 (m).',{type:'sector',R:12,n:150}),
 Q('Tấm kim loại hình quạt có bán kính 4 m, góc 135°. Cứ 1 m² nặng 2 kg. Tấm kim loại nặng bao nhiêu kg? Lấy π ≈ 3,14.',37.68,'kg','Tính diện tích quạt rồi nhân 2 kg/m².','S = (135/360) × 3,14 × 4² = 18,84 m². Khối lượng = 37,68 kg.',{type:'sector',R:4,n:135})],
 [Q('Vòm cổng là cung 144° của đường tròn bán kính 10 m. Độ dài vòm bằng bao nhiêu π m?',8,'π m','Dùng l = nπR/180.','l = (144/180) × π × 10 = 8π (m).',{type:'sector',R:10,n:144}),
 Q('Một tấm pin hình quạt có bán kính 10 m, độ dài cung 8π m. Diện tích tấm pin bằng bao nhiêu π m²?',40,'π m²','Dùng mối liên hệ S = lR/2.','S = (8π × 10)/2 = 40π (m²).',{type:'sector',R:10,n:144,hideN:true}),
 Q('Vòng bảo vệ có bán kính ngoài 9 m, trong 7 m. Cần phủ 25% diện tích vòng. Diện tích cần phủ bằng bao nhiêu π m²?',8,'π m²','Tính diện tích vành khuyên, sau đó lấy 25%.','S = 25% × π(9² − 7²) = 8π (m²).',{type:'ring',R:9,r:7}),
 Q('Bánh xe bán kính 0,5 m lăn không trượt trên đoạn đường dài 20π m. Bánh xe quay được bao nhiêu vòng?',20,'vòng','Số vòng bằng quãng đường chia chu vi bánh xe.','C = 2π × 0,5 = π (m). Số vòng = 20π/π = 20.',{type:'circle',R:0.5},[10,20,30,40])]
];
