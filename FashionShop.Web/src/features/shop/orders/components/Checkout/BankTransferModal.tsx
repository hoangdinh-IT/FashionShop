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
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 font-sans select-none overflow-x-hidden">
                    {/* Backdrop mờ nền */}
                    <motion.div
                        className={BACKDROP_STYLES}
                        variants={backdropVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={onClose}
                    />

                    {/* Khối Nội dung Modal */}
                    <motion.div
                        className="relative z-10 bg-white rounded-2xl w-full max-w-[360px] xs:max-w-sm sm:max-w-md p-4 sm:p-5 shadow-2xl border border-zinc-100 space-y-3 max-h-[90vh] overflow-y-auto custom-scrollbar"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-sm sm:text-base font-bold tracking-tight text-zinc-900">
                                    Quét mã chuyển khoản
                                </h3>
                                <p className="text-[10px] sm:text-[11px] text-zinc-400 mt-0.5">
                                    Dùng App Ngân hàng quét mã QR bên dưới
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all cursor-pointer shrink-0"
                                aria-label="Đóng"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* QR Code Container */}
                        <div className="flex flex-col items-center justify-center bg-zinc-50 p-2 sm:p-3 rounded-xl border border-zinc-200/70 relative group">
                            <div 
                                className="relative cursor-zoom-in overflow-hidden rounded-xl bg-white p-2 shadow-xs border border-zinc-100 transition-transform hover:scale-[1.01] w-full flex justify-center"
                                onClick={() => setIsZoomed(true)}
                                title="Bấm để xem phóng to"
                            >
                                <img
                                    src={qrUrl}
                                    alt="VietQR Code"
                                    className="w-full max-w-[190px] xs:max-w-[210px] sm:max-w-[240px] aspect-square object-contain rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <span className="bg-zinc-900/80 text-white text-[10px] font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Maximize2 size={11} /> Phóng to
                                    </span>
                                </div>
                            </div>
                            
                            <span className="text-[10px] font-medium text-zinc-400 mt-1.5 text-center">
                                Tự động điền số tiền & nội dung
                            </span>
                        </div>

                        {/* Thông tin chuyển khoản */}
                        <div className="space-y-2 text-[11px] sm:text-xs bg-zinc-50/80 p-2.5 sm:p-3 rounded-xl border border-zinc-200/60">
                            <div className="flex justify-between items-center gap-2">
                                <span className="text-zinc-500 shrink-0">Ngân hàng:</span>
                                <span className="font-bold text-zinc-900 uppercase truncate">{bankInfo.bankId}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <span className="text-zinc-500 shrink-0">Chủ tài khoản:</span>
                                <span className="font-bold text-zinc-900 uppercase truncate text-right">{bankInfo.accountName}</span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <span className="text-zinc-500 shrink-0">Số tài khoản:</span>
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="font-mono font-bold text-zinc-900 truncate">{bankInfo.accountNo}</span>
                                    <button
                                        onClick={() => handleCopy(bankInfo.accountNo)}
                                        className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer p-0.5 shrink-0"
                                        title="Sao chép STK"
                                    >
                                        <Copy size={13} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <span className="text-zinc-500 shrink-0">Số tiền:</span>
                                <span className="font-mono font-bold text-emerald-600 text-xs sm:text-sm truncate">
                                    {amount.toLocaleString('vi-VN')}đ
                                </span>
                            </div>
                            <div className="flex justify-between items-center gap-2">
                                <span className="text-zinc-500 shrink-0">Nội dung:</span>
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="font-mono font-bold text-zinc-900 bg-amber-100 px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] truncate">
                                        {transferContent}
                                    </span>
                                    <button
                                        onClick={() => handleCopy(transferContent)}
                                        className="text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer p-0.5 shrink-0"
                                        title="Sao chép nội dung"
                                    >
                                        <Copy size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {copied && (
                            <div className="text-center text-[10px] sm:text-[11px] text-emerald-600 font-semibold animate-fade-in bg-emerald-50 py-1 rounded-md border border-emerald-200/50">
                                Đã sao chép vào bộ nhớ tạm!
                            </div>
                        )}

                        {/* Nút hành động */}
                        <div className="space-y-1.5 pt-1">
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={onConfirm}
                                className="w-full py-2.5 sm:py-3 rounded-xl bg-zinc-900 hover:bg-black text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
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
                            <div className="flex items-center justify-center gap-1 text-[9px] sm:text-[10px] text-zinc-400 text-center">
                                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                                <span>Hệ thống tự động xác nhận sau khi nhận tiền</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Lightbox Phóng to */}
                    <AnimatePresence>
                        {isZoomed && (
                            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
                                {/* Backdrop */}
                                <motion.div
                                    className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsZoomed(false)}
                                />

                                {/* Container Zoomed Image */}
                                <motion.div
                                    className="relative z-10 bg-white p-4 sm:p-6 rounded-3xl max-w-[90vw] sm:max-w-lg w-full flex flex-col items-center gap-3 shadow-2xl max-h-[85vh] overflow-hidden"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                >
                                    <button
                                        onClick={() => setIsZoomed(false)}
                                        className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors cursor-pointer z-20"
                                        aria-label="Đóng"
                                    >
                                        <X size={18} />
                                    </button>

                                    <div className="w-full max-w-[380px] aspect-square rounded-2xl bg-white p-2 sm:p-3 border border-zinc-200/80 shadow-inner flex items-center justify-center mt-4 sm:mt-0">
                                        <img
                                            src={qrUrl}
                                            alt="VietQR Zoomed"
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
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