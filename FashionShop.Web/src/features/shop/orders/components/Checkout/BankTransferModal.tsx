import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Copy, Loader2, ShieldCheck, Maximize2 } from 'lucide-react';
import { useLockBodyScroll } from '../../../../../hooks/useLockBodyScroll';
import { BACKDROP_STYLES, backdropVariants, modalVariants } from '../../../../../utils/animation';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    bankInfo: {
        bankId: string;
        accountNo: string;
        accountName: string;
    };
    amount: number;
    orderCode: string;
    isLoading?: boolean;
}

export const BankTransferModal = ({
    isOpen,
    onClose,
    onConfirm,
    bankInfo,
    amount,
    orderCode,
    isLoading
}: Props) => {
    // Khóa cuộn trang khi Modal mở
    useLockBodyScroll(isOpen);
    
    const [copied, setCopied] = useState(false);
    const [isZoomed, setIsZoomed] = useState(false);

    const transferContent = `${orderCode}`;
    const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNo}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return createPortal(
        <AnimatePresence mode="wait">
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 font-sans select-none">
                    {/* Backdrop mờ nền */}
                    <motion.div
                        className={BACKDROP_STYLES}
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Khối Nội dung Modal - Tối ưu max-w-md và padding gọn p-4 sm:p-5 */}
                    <motion.div
                        className="relative z-10 bg-white rounded-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-5 shadow-2xl border border-zinc-100 space-y-3.5 overflow-hidden"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold tracking-tight text-zinc-900">
                                    Quét mã chuyển khoản
                                </h3>
                                <p className="text-[11px] text-zinc-400 mt-0.5">
                                    Dùng App Ngân hàng quét mã QR bên dưới
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer"
                                aria-label="Đóng"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* QR Code Container - Cân bằng kích thước vừa vặn không gây cuộn */}
                        <div className="flex flex-col items-center justify-center bg-zinc-50 p-2.5 sm:p-3 rounded-xl border border-zinc-200/70 relative group">
                            <div 
                                className="relative cursor-zoom-in overflow-hidden rounded-xl bg-white p-2 shadow-xs border border-zinc-100 transition-transform hover:scale-[1.01]"
                                onClick={() => setIsZoomed(true)}
                                title="Bấm để xem phóng to"
                            >
                                <img
                                    src={qrUrl}
                                    alt="VietQR Code"
                                    className="w-52 h-52 sm:w-60 sm:h-60 object-contain rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-zinc-900/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Maximize2 size={11} /> Phóng to
                                    </span>
                                </div>
                            </div>
                            
                            <span className="text-[10px] font-medium text-zinc-400 mt-1.5">
                                Tự động điền số tiền & nội dung
                            </span>
                        </div>

                        {/* Thông tin chuyển khoản - Gọn gàng text-xs */}
                        <div className="space-y-1.5 text-xs bg-zinc-50/80 p-3 rounded-xl border border-zinc-200/60">
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">Ngân hàng:</span>
                                <span className="font-bold text-zinc-900 uppercase">{bankInfo.bankId}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">Chủ tài khoản:</span>
                                <span className="font-bold text-zinc-900 uppercase">{bankInfo.accountName}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">Số tài khoản:</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-zinc-900">{bankInfo.accountNo}</span>
                                    <button
                                        onClick={() => handleCopy(bankInfo.accountNo)}
                                        className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer p-0.5"
                                        title="Sao chép STK"
                                    >
                                        <Copy size={13} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">Số tiền:</span>
                                <span className="font-mono font-bold text-emerald-600 text-sm">
                                    {amount.toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500">Nội dung:</span>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-mono font-bold text-zinc-900 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                                        {transferContent}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(transferContent)}
                                        className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer p-0.5"
                                        title="Sao chép nội dung"
                                    >
                                        <Copy size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {copied && (
                            <div className="text-center text-[11px] text-emerald-600 font-semibold animate-fade-in bg-emerald-50 py-1 rounded-md border border-emerald-200/50">
                                Đã sao chép vào bộ nhớ tạm!
                            </div>
                        )}

                        {/* Nút hành động */}
                        <div className="space-y-1.5">
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={onConfirm}
                                className="w-full py-2.5 sm:py-3 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={15} />
                                        <span>Đang xác nhận...</span>
                                    </>
                                ) : (
                                    <>
                                        <Check size={16} />
                                        <span>TÔI ĐÃ CHUYỂN KHOẢN XONG</span>
                                    </>
                                )}
                            </button>
                            <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-400">
                                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                                <span>Hệ thống tự động xác nhận sau khi nhận tiền</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Lightbox Phóng to - Dành cho ai muốn soi rõ hơn */}
                    <AnimatePresence>
                        {isZoomed && (
                            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                                <motion.div
                                    className="fixed inset-0 bg-black/80 backdrop-blur-xs"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsZoomed(false)}
                                />
                                <motion.div
                                    className="relative z-10 bg-white p-5 rounded-2xl max-w-xs w-full flex flex-col items-center gap-3 shadow-2xl"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                >
                                    <button
                                        onClick={() => setIsZoomed(false)}
                                        className="absolute top-2.5 right-2.5 w-7 h-7 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors"
                                    >
                                        <X size={16} />
                                    </button>
                                    <h4 className="font-bold text-zinc-900 text-xs pt-0.5">Mã QR phóng to</h4>
                                    <img
                                        src={qrUrl}
                                        alt="VietQR Zoomed"
                                        className="w-64 h-64 object-contain rounded-lg bg-white p-2 border border-zinc-100 shadow-xs"
                                    />
                                    <p className="text-[11px] text-zinc-500 text-center">
                                        Đưa camera điện thoại lại gần mã để quét
                                    </p>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};