const AppData = {
    events: [
        { id: 1, name: "Workshop Kỹ năng thuyết trình chuyên nghiệp", date: "18/03/2026", loc: "Phòng Lab A2", status: "attended" },
        { id: 2, name: "Hội thảo Tư duy Thiết kế Sản phẩm", date: "15/03/2026", loc: "Hội trường 1", status: "attended" },
        { id: 3, name: "Ngày hội Sáng tạo công nghệ 2026", date: "25/03/2026", loc: "Sảnh trung tâm", status: "upcoming" }
    ],
    filter: 'all'
};

function renderEvents() {
    const container = document.getElementById('event-container');
    const search = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = AppData.events.filter(e => {
        const matchesTab = AppData.filter === 'all' || e.status === AppData.filter;
        const matchesSearch = e.name.toLowerCase().includes(search);
        return matchesTab && matchesSearch;
    });
    
    container.innerHTML = filtered.map(e => `
        <div class="event-card">
            <span class="status-tag ${e.status}">
                ${e.status === 'attended' ? 'Hoàn thành' : 'Sắp tới'}
            </span>
            <div class="event-title">${e.name}</div>
            <div class="event-info">
                <div><i class="far fa-calendar-alt"></i> ${e.date}</div>
                <div><i class="fas fa-map-marker-alt"></i> ${e.loc}</div>
            </div>
            ${e.status === 'attended' 
                ? `<button class="btn-card active" onclick="openProof(${e.id})">TẢI CHỨNG NHẬN</button>`
                : `<button class="btn-card locked">CHƯA KHẢ DỤNG</button>`}
        </div>
    `).join('');
}

function setFilter(f, btn) {
    AppData.filter = f;
    document.querySelectorAll('.tab-item').forEach(el => el.classList.remove('active'));
    btn.classList.add('active');
    renderEvents();
}

function openProof(id) {
    const e = AppData.events.find(x => x.id === id);
    const body = document.getElementById('modalBody');
    body.innerHTML = `
        <div style="text-align:center; padding: 25px; border: 2px dashed #d1d9e6; border-radius: 20px; background: #fafafa;">
            <i class="fas fa-award" style="font-size: 2.5rem; color: #ffbc00; margin-bottom: 15px;"></i>
            <h3 style="margin:10px 0; color: #001d3d;">${e.name}</h3>
            <p style="font-size:0.9rem; color: #666;">Bản điện tử đã sẵn sàng. Vui lòng tải xuống để lưu trữ.</p>
        </div>
    `;
    document.getElementById('proofModal').style.display = 'flex';
    document.getElementById('downloadBtn').onclick = () => downloadPDF(e);
}

function closeModal() { document.getElementById('proofModal').style.display = 'none'; }
function removeTones(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/đ/g, "d").replace(/Đ/g, "D")
              .replace(/[^\x00-\x7F]/g, ""); 
}

function downloadPDF(e) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a5" });
    const w = doc.internal.pageSize.getWidth();
    const h = doc.internal.pageSize.getHeight();
    doc.setDrawColor(0, 29, 61); 
    doc.setLineWidth(1.2); 
    doc.rect(5, 5, w - 10, h - 10);
    doc.setLineWidth(0.4); 
    doc.rect(7, 7, w - 14, h - 14);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(0, 29, 61);
    doc.text("CERTIFICATE", w/2, 30, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("OF COMPLETION", w/2, 38, { align: "center" });
    doc.setDrawColor(214, 40, 40);
    doc.line(w/2 - 20, 45, w/2 + 20, 45);
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text("This is to certify that you have successfully attended:", w/2, 60, { align: "center" });
    doc.setFontSize(15);
    doc.setTextColor(0, 0, 0);
    const cleanName = removeTones(e.name).toUpperCase();
    doc.text(cleanName, w/2, 72, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${e.date} | Location: ${removeTones(e.loc)}`, w/2, 82, { align: "center" });
    doc.setDrawColor(214, 40, 40);
    doc.setLineWidth(0.8);
    doc.circle(w - 35, h - 30, 10, 'S');
    doc.setFontSize(6);
    doc.setTextColor(214, 40, 40);
    doc.text("VERIFIED", w - 35, h - 31, { align: "center" });
    doc.text("SYSTEM", w - 35, h - 28, { align: "center" });
    doc.setTextColor(0, 0, 0);
    doc.line(25, h - 30, 60, h - 30);
    doc.text("Authorized Signature", 42.5, h - 25, { align: "center" });

    doc.save(`ChungNhan_${e.id}.pdf`);
}

document.addEventListener("DOMContentLoaded", renderEvents);
window.onclick = (event) => {
    if (event.target == document.getElementById('proofModal')) closeModal();
}