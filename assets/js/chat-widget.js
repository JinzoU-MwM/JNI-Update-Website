/**
 * JNI Floating Chat Widget
 * Handles UI toggle and data submission
 */

document.addEventListener("DOMContentLoaded", function () {
    // 1. Create Widget HTML
    const chatWidgetHTML = `
        <div id="jni-chat-widget">
            <!-- Chat Button -->
            <button id="jni-chat-toggle" class="jni-chat-btn">
                <i class="bi bi-chat-dots-fill"></i>
                <span class="notification-dot"></span>
            </button>

            <!-- Chat Box -->
            <div id="jni-chat-box" class="jni-chat-box">
                <div class="jni-chat-header">
                    <h5>Hubungi Kami</h5>
                    <button id="jni-chat-close">&times;</button>
                </div>
                <div class="jni-chat-body">
                    <p class="small text-muted">Silakan tinggalkan pesan, kami akan segera membalas via WhatsApp/Email.</p>
                    <form id="jni-chat-form">
                        <input type="hidden" name="source" value="bubble_chat">
                        
                        <div class="mb-2">
                            <input type="text" name="name" class="form-control form-control-sm" placeholder="Nama Lengkap *" required>
                        </div>
                        
                        <div class="mb-2">
                            <input type="text" name="phone" class="form-control form-control-sm" placeholder="No. WhatsApp *" required>
                        </div>

                        <div class="mb-2">
                            <textarea name="message" class="form-control form-control-sm" rows="3" placeholder="Tulis pesan Anda..." required></textarea>
                        </div>

                        <button type="submit" class="btn btn-success btn-sm w-100">Kirim Pesan <i class="bi bi-send"></i></button>
                    </form>
                    <div id="jni-chat-response" class="mt-2 small text-center"></div>
                </div>
            </div>
        </div>
    `;

    // 2. Inject Styles and HTML
    document.body.insertAdjacentHTML('beforeend', chatWidgetHTML);
    
    // Add CSS dynamically or ensure it's in style.css
    const style = document.createElement('style');
    style.innerHTML = `
        #jni-chat-widget { position: fixed; bottom: 20px; right: 20px; z-index: 9999; font-family: 'Inter', sans-serif; }
        
        .jni-chat-btn {
            width: 60px; height: 60px; border-radius: 50%; background: #2E7D32; color: white;
            border: none; box-shadow: 0 4px 12px rgba(0,0,0,0.15); cursor: pointer;
            font-size: 24px; transition: transform 0.2s;
            display: flex; align-items: center; justify-content: center;
        }
        .jni-chat-btn:hover { transform: scale(1.1); background: #1b5e20; }
        
        .jni-chat-box {
            display: none; position: absolute; bottom: 80px; right: 0;
            width: 300px; background: white; border-radius: 12px;
            box-shadow: 0 5px 25px rgba(0,0,0,0.2); overflow: hidden;
            animation: slideIn 0.3s ease;
        }
        .jni-chat-box.active { display: block; }
        
        .jni-chat-header { background: #2E7D32; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center; }
        .jni-chat-header h5 { margin: 0; font-size: 16px; }
        #jni-chat-close { background: none; border: none; color: white; font-size: 24px; cursor: pointer; }
        
        .jni-chat-body { padding: 15px; }
        
        @keyframes slideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);

    // 3. Logic
    const toggleBtn = document.getElementById('jni-chat-toggle');
    const closeBtn = document.getElementById('jni-chat-close');
    const chatBox = document.getElementById('jni-chat-box');
    const form = document.getElementById('jni-chat-form');
    const responseDiv = document.getElementById('jni-chat-response');

    toggleBtn.addEventListener('click', () => chatBox.classList.toggle('active'));
    closeBtn.addEventListener('click', () => chatBox.classList.remove('active'));

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = 'Mengirim...';

        const formData = new FormData(form);
        
        try {
            const res = await fetch('api/send_message.php', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            
            if (data.status === 'success') {
                responseDiv.innerHTML = `<span class="text-success">${data.message}</span>`;
                form.reset();
                setTimeout(() => {
                    chatBox.classList.remove('active');
                    responseDiv.innerHTML = '';
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                }, 2000);
            } else {
                responseDiv.innerHTML = `<span class="text-danger">${data.message}</span>`;
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        } catch (error) {
            console.error(error);
            responseDiv.innerHTML = `<span class="text-danger">Gagal mengirim pesan.</span>`;
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
});
